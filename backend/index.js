require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
const zlib = require("zlib"); // For compression
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const RESULTS_PER_PAGE = 2000;

// Function to fetch and store CVE data from NVD API
const fetchAndStoreCVEData = async () => {
  let startIndex = 0;
  let totalResults = 1;

  try {
    while (startIndex < totalResults) {
      const response = await axios.get(BASE_URL, {
        params: { startIndex, resultsPerPage: RESULTS_PER_PAGE },
      });

      const data = response.data;
      totalResults = data.totalResults;

      const formattedData = data.vulnerabilities.map((vuln) => {
        const cveDetails = {
          metrics: vuln.cve.metrics,
          weaknesses: vuln.cve.weaknesses,
          configurations: vuln.cve.configurations,
        };

        // 🔥 Compress the JSON before storing
        const compressedDetails = zlib
          .gzipSync(JSON.stringify(cveDetails))
          .toString("base64");

        return {
          cve_id: vuln.cve.id,
          published_date: vuln.cve.published,
          last_modified: vuln.cve.lastModified,
          description: vuln.cve.descriptions[0]?.value || "No descrition found",
          source_identifier: vuln.cve.sourceIdentifier,
          vuln_status: vuln.cve.vulnStatus,
          cvss_v2_score:
            vuln.cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || null,
          cvss_v2_vector:
            vuln.cve.metrics?.cvssMetricV2?.[0]?.cvssData?.vectorString || null,
          cvss_v3_score:
            vuln.cve.metrics?.cvssMetricV3?.[0]?.cvssData?.baseScore || null,
          cvss_v3_vector:
            vuln.cve.metrics?.cvssMetricV3?.[0]?.cvssData?.vectorString || null,
          cve_details: compressedDetails, // 🔥 Store compressed JSON
        };
      });

      const { error } = await supabase
        .from("cve_data")
        .upsert(formattedData, { onConflict: ["cve_id"] });
      if (error) {
        console.error("Error inserting data:", error);
        return;
      }

      startIndex += RESULTS_PER_PAGE;
    }
    console.log("CVE Data Sync Completed");
  } catch (error) {
    console.error("Error fetching CVE data:", error.message);
  }
};

app.get("/cve", async (req, res) => {
  let {
    cve_id,
    year,
    min_score,
    max_score,
    last_modified,
    results_per_page,
    startindex,
  } = req.query;

  results_per_page = results_per_page ? parseInt(results_per_page) : 50;
  startindex = startindex ? parseInt(startindex) : 0;

  let query = supabase.from("cve_data").select("*", { count: "exact" });

  // Apply filters based on parameters
  if (cve_id) query = query.like("cve_id", `%${cve_id}%`);
  if (year) query = query.eq("year", parseInt(year));
  if (min_score) {
    query = query.gte("cvss_v2_score", parseFloat(min_score));
  }
  if (max_score) {
    query = query.lte("cvss_v2_score", parseFloat(max_score));
  }
  if (last_modified)
    query = query.gte("last_modified", new Date(last_modified).toISOString());

  // Apply pagination
  query = query.range(startindex, startindex + results_per_page - 1);

  // Execute the query
  const { data, count, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  // 🔥 Decompress cve_details for each record
  const decompressedData = data.map((record) => ({
    ...record,
    cve_details: JSON.parse(
      zlib.gunzipSync(Buffer.from(record.cve_details, "base64")).toString()
    ),
  }));

  // Return both the total count and the paginated data
  res.json({
    total_count: count, // Total number of records
    data: decompressedData, // Paginated data
  });
});

// API to fetch CVE by ID (Decompress before returning)
app.get("/cvedet/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("cve_data")
    .select("*")
    .eq("cve_id", id);
  if (error) return res.status(500).json({ error: error.message });

  if (data.length > 0) {
    // 🔥 Decompress before sending response
    const decompressedDetails = JSON.parse(
      zlib.gunzipSync(Buffer.from(data[0].cve_details, "base64")).toString()
    );
    data[0].cve_details = decompressedDetails;
  }

  res.json(data);
});

// API to fetch CVEs by Year

// Endpoint to manually trigger data sync
app.post("/sync", async (req, res) => {
  await fetchAndStoreCVEData();
  res.json({ message: "CVE Data Sync Triggered" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
