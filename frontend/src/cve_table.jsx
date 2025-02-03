import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  Select,
  SelectItem,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TextInput,
  Button,
} from "@tremor/react";
import { RiSearchLine } from "@remixicon/react";
import { RiFilterLine } from "@remixicon/react";
import { RiSkipRightLine } from "@remixicon/react";
import { RiSkipLeftLine } from "@remixicon/react";

// import { TextInput } from "@tremor/react";
// import { Button } from "@tremor/react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CVETable() {
  const [data, setData] = useState([]);
  const [totalCount, setCount] = useState(0);
  const [filters, setFilters] = useState({
    cve_id: "",
    year: "",
    min_score: "",
    max_score: "",
    last_modified: "",
    results_per_page: 10,
    startindex: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters.results_per_page, filters.cve_id]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cve", {
        params: filters,
      });

      setData(response.data.data);
      setCount(response.data.total_count);
    } catch (error) {
      console.error("Error fetching CVE data:", error);
    }
  };

  // const handleKeyDown = (e) => {
  //   // Check if the Enter key (keyCode 13) is pressed
  //   if (e.key === "Enter") {
  //     fetchData();
  //   }
  // };

  return (
    <div className="px-10 py-8">
      <h1 className="font-bold text-2xl">CVE List</h1>

      {/*search and sort components */}
      <div className="py-6">
        <div className="overflow-x-auto">
          <div className="flex space-x-5 p-1">
            <TextInput
              icon={RiSearchLine}
              placeholder="Search files..."
              onChange={(e) => {
                setFilters({ ...filters, cve_id: e.target.value });
              }}
              // onKeyDown={handleKeyDown}
              className="max-w-xs"
            />
            <Button
              onClick={() => setIsOpen(true)}
              variant="light"
              color="gray-400"
              className="max-w-xs"
              icon={RiFilterLine}
            />

            <div className="flex items-center space-x-5">
              {/* <Select className="max-w-xs">
                <SelectItem value="dateModified">
                  Sort by Date Modified
                </SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </Select> */}
            </div>
          </div>
        </div>
      </div>

      {/*Table Header*/}
      <div className="w-full overflow-hidden border">
        <Table className="w-full border-collapse">
          <TableHead className="bg-gray-200 sticky top-0 ">
            <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
              <TableHeaderCell className="w-[33%] text-tremor-content-strong dark:text-dark-tremor-content-strong">
                CVE ID
              </TableHeaderCell>
              <TableHeaderCell className="w-[25%] text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Published Year
              </TableHeaderCell>
              <TableHeaderCell className="w-[25%] text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Last Modified Year
              </TableHeaderCell>
              <TableHeaderCell className="w-[15%] text-tremor-content-strong dark:text-dark-tremor-content-strong">
                CVSS Score
              </TableHeaderCell>
              <TableHeaderCell className="w-[25%] text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Vulnerability Status
              </TableHeaderCell>
            </TableRow>
          </TableHead>
        </Table>
      </div>

      {/*Table Body*/}
      <div className="max-h-[60vh] overflow-auto w-full border">
        <Table className="w-full border-collapse">
          <TableBody>
            {data.map((cve) => (
              <Link key={cve.cve_id} to={`/cve/${cve.cve_id}`}>
                <TableRow
                  className=" hover:bg-tremor-brand-faint border-b border-tremor-border dark:border-dark-tremor-border"
                  key={cve.cve_id}
                >
                  <TableCell className="w-[30%]">{cve.cve_id}</TableCell>
                  <TableCell className="w-[25%]">
                    {new Date(cve.published_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="w-[25%]">
                    {new Date(cve.last_modified).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="w-[15%]">
                    {cve.cvss_v3_score || cve.cvss_v2_score || "0.0"}
                  </TableCell>
                  <TableCell className="w-[25%]">{cve.vuln_status}</TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </div>

      {/*Page Components*/}
      <div className="flex items-center justify-between space-x-4 p-2">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">
            Total Records: {totalCount}
          </label>
          <label className="text-sm font-medium">Results per page:</label>
          <Select
            className="w-24"
            value={filters.results_per_page}
            onChange={(value) => {
              setFilters({
                ...filters,
                results_per_page: value,
              });
              fetchData();
            }}
          >
            <SelectItem value={10}>10</SelectItem>
            <SelectItem value={50}>50</SelectItem>
            <SelectItem value={100}>100</SelectItem>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            color="gray"
            variant="light"
            icon={RiSkipLeftLine}
            onClick={() => {
              setFilters({
                ...filters,
                startindex: filters.startindex - filters.results_per_page,
              });
              fetchData();
            }}
            disabled={filters.startindex === 0}
          />

          <Button
            color="gray"
            variant="light"
            icon={RiSkipRightLine}
            onClick={() => {
              setFilters({
                ...filters,
                startindex: filters.startindex + filters.results_per_page,
              });
              fetchData();
            }}
          />
        </div>
      </div>

      {/*Dialog for filter options*/}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogPanel>
          <h2 className="text-lg font-semibold mb-4">Filter CVEs</h2>

          {/* Filter Inputs Grid */}
          <div className="space-y-5 gap-4 mb-4">
            {/* Year Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Published Year
              </label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, year: value })
                }
                value={filters.year || ""}
              >
                <SelectItem value={null}>All</SelectItem>

                {Array.from({ length: 31 }, (_, i) => 1995 + i).map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Min Score Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Min Score
              </label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, min_score: value })
                }
                value={filters.min_score || ""}
              >
                <SelectItem value={null}>All</SelectItem>

                {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
                  <SelectItem key={score} value={score}>
                    {score}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Max Score Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Score
              </label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, max_score: value })
                }
                value={filters.max_score || ""}
              >
                <SelectItem value={null}>All</SelectItem>

                {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
                  <SelectItem key={score} value={score}>
                    {score}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Last Modified Year Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Modified Year
              </label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, last_modified: value })
                }
                value={filters.last_modified || ""}
              >
                <SelectItem value={null}>All</SelectItem>

                {Array.from({ length: 31 }, (_, i) => 1995 + i).map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                fetchData();
                setIsOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
