import {
  Card,
  Table,
  TableBody,
  TableHeaderCell,
  TableHead,
  TableRow,
  TableCell,
  Text,
  Flex,
  Col,
  Metric,
} from "@tremor/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

const VulnerabilityDetail = () => {
  const { id } = useParams();

  const [cve, setCVE] = useState(null);

  useEffect(() => {
    // Example API call using the id
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/cvedet/${id}`); // GET request with ID in URL
        
        setCVE(res.data[0]); // Store the response data
        console.log(res.data[0]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);
  return (
    <div className="p-4 space-y-4">
      {cve ? (
        <>
          <Card>
            <Text as="h2" className="text-xl font-semibold">
              {cve.cve_id} - {cve.vuln_status}
            </Text>
            <Text className="text-sm text-gray-500">
              Published: {cve.published_date} | Last Modified:{" "}
              {cve.last_modified}
            </Text>

            {/* Description */}
            <div className="mt-4">
              <Text className="font-medium">Description:</Text>

              <Text className="text-gray-700">{cve.description}</Text>
            </div>

            {/* Metrics */}
            <div className="mt-4">
              <Text variant="h6">CVSS V2 Metrics</Text>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Severity</TableHeaderCell>
                    <TableHeaderCell>Vector String</TableHeaderCell>

                    <TableHeaderCell>Exploitability Info</TableHeaderCell>
                    <TableHeaderCell>Privilege Escalation</TableHeaderCell>
                    <TableHeaderCell>User Interaction Required</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cve.cve_details.metrics.cvssMetricV2.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell>{metric.baseSeverity}</TableCell>
                      <TableCell>{metric.cvssData.vectorString}</TableCell>

                      <TableCell>{metric.acInsufInfo ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {metric.obtainAllPrivilege ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {metric.userInteractionRequired ? "Yes" : "No"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Configuration Nodes */}
          <Card>
            <Text variant="h6">Configuration Nodes</Text>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>CPE Match Criteria</TableHeaderCell>
                  <TableHeaderCell>Criteria ID</TableHeaderCell>
                  <TableHeaderCell>Vulnerable</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cve.cve_details.configurations.map((config, index) => (
                  <React.Fragment key={index}>
                    {config.nodes.map((node, nodeIndex) =>
                      node.cpeMatch.map((match, matchIndex) => (
                        <TableRow key={matchIndex}>
                          <TableCell>{match.criteria}</TableCell>
                          <TableCell>{match.matchCriteriaId}</TableCell>
                          <TableCell>
                            {match.vulnerable ? "Yes" : "No"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card>
            <Text variant="h6">CVSS Data (V2.0)</Text>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Access Complexity</TableHeaderCell>
                  <TableHeaderCell>Access Vector</TableHeaderCell>
                  <TableHeaderCell>Authentication</TableHeaderCell>
                  <TableHeaderCell>Confidentiality Impact</TableHeaderCell>
                  <TableHeaderCell>Integrity Impact</TableHeaderCell>
                  <TableHeaderCell>Availability Impact</TableHeaderCell>
                  <TableHeaderCell>Base Score</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cve.cve_details.metrics.cvssMetricV2.map((metric, index) => (
                  <TableRow key={index}>
                    <TableCell>{metric.cvssData.accessComplexity}</TableCell>
                    <TableCell>{metric.cvssData.accessVector}</TableCell>
                    <TableCell>{metric.cvssData.authentication}</TableCell>
                    <TableCell>
                      {metric.cvssData.confidentialityImpact}
                    </TableCell>
                    <TableCell>{metric.cvssData.integrityImpact}</TableCell>
                    <TableCell>{metric.cvssData.availabilityImpact}</TableCell>
                    <TableCell>{metric.cvssData.baseScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Card>
            <Text variant="h6">Metrics Overview</Text>
            {/* Check if cvssMetricV2 data exists */}
            {cve.cve_details.metrics &&
            cve.cve_details.metrics.cvssMetricV2 &&
            cve.cve_details.metrics.cvssMetricV2.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Metric</TableHeaderCell>
                    <TableHeaderCell>Value</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Base Severity</TableCell>
                    <TableCell>
                      {cve.cve_details.metrics.cvssMetricV2[0]?.baseSeverity ||
                        "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Exploitability Score</TableCell>
                    <TableCell>
                      {cve.cve_details.metrics.cvssMetricV2[0]
                        ?.exploitabilityScore || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Impact Score</TableCell>
                    <TableCell>
                      {cve.cve_details.metrics.cvssMetricV2[0]?.impactScore ||
                        "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <Text>No metric data available</Text>
            )}
          </Card>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default VulnerabilityDetail;
