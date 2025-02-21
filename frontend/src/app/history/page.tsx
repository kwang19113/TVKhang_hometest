"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface DetectionRecord {
  id: number;
  timestamp: string;
  num_people: number;
  image_path: string;
}

const History: React.FC = () => {
  const [records, setRecords] = useState<DetectionRecord[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [inputLimit, setInputLimit] = useState<string>("10");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for filter inputs
  const [filterNumPeople, setFilterNumPeople] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const offset = (page - 1) * limit;

  // State for applied (active) filters
  const [appliedNumPeople, setAppliedNumPeople] = useState<string>("");
  const [appliedDate, setAppliedDate] = useState<string>("");

  // Indicates whether search mode is active
  const [isSearch, setIsSearch] = useState<boolean>(false);

  // Get the base API URL from the environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Function to fetch records based on mode (paginated history vs. filtered search)
  const fetchRecords = () => {
    setLoading(true);
    let url = "";
    if (isSearch) {
      // Build the search URL with applied filters.
      url = `${apiUrl}/search/?`;
      if (appliedNumPeople !== "") {
        url += `num_people=${appliedNumPeople}&`;
      }
      if (appliedDate !== "") {
        url += `date=${appliedDate}&`;
      }
      if (url.endsWith("&") || url.endsWith("?")) {
        url = url.slice(0, -1);
      }
    } else {
      url = `${apiUrl}/history/?offset=${offset}&limit=${limit}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch records");
        setLoading(false);
      });
  };

  // Refetch whenever pagination or active filters change.
  useEffect(() => {
    fetchRecords();
  }, [limit, page, isSearch, appliedNumPeople, appliedDate]);

  // Handler to update the limit based on user input and reset page to 1.
  const handleSetLimit = () => {
    const newLimit = Number(inputLimit);
    if (!isNaN(newLimit) && newLimit > 0) {
      setLimit(newLimit);
      setPage(1);
    } else {
      alert("Please enter a valid number greater than 0.");
    }
  };

  // Pagination Handlers (only used when not in search mode)
  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (records.length === limit) {
      setPage(page + 1);
    }
  };

  // Handlers for Search/Filter functionality
  const handleSearch = () => {
    setAppliedNumPeople(filterNumPeople);
    setAppliedDate(filterDate);
    setIsSearch(true);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilterNumPeople("");
    setFilterDate("");
    setAppliedNumPeople("");
    setAppliedDate("");
    setIsSearch(false);
    setPage(1);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header with Limit Control */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <h1 className="text-3xl font-bold mb-4 md:mb-0 text-black">Detection History</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSetLimit}
            className="bg-white border border-white hover:bg-black hover:text-white text-black font-bold py-2 px-4 rounded"
          >
            Set Limit
          </button>
          <input
            type="number"
            value={inputLimit}
            onChange={(e) => setInputLimit(e.target.value)}
            placeholder="Enter limit"
            className="border border-black px-2 py-1 w-24 rounded-none"
          />
        </div>
      </div>

      {/* Search and Filter Section aligned to the right */}
      <div className="flex flex-col md:flex-row md:space-x-4 items-end  mb-6 mt-8">
        <div className="mb-4 md:mb-0">
          <label className="block mb-1 text-black">Number of People:</label>
          <input
            type="number"
            value={filterNumPeople}
            onChange={(e) => setFilterNumPeople(e.target.value)}
            placeholder="e.g., 3"
            className="border border-black px-2 py-1 rounded"
          />
        </div>
        <div className="mb-4 md:mb-0">
          <label className="block mb-1 text-black">Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-black px-2 py-1 rounded"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSearch}
            className="bg-white hover:text-black hover:underline text-black font-bold py-2 px-4 rounded-none"
          >
            Search
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-white hover:text-black hover:underline text-black font-bold py-2 px-4 rounded-none"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Data Display */}
      {loading && (
        <div className="flex justify-center items-center">
          <p className="text-black">Loading...</p>
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-white shadow border border-white p-4 flex flex-col items-center"
              >
                {record.image_path ? (
                  <img
                    src={`${apiUrl}/${record.image_path}`}
                    alt={`Detection ${record.id}`}
                    className="object-cover h-full w-full mb-4"
                  />
                ) : (
                  <div className="h-48 w-full bg-white border border-black flex justify-center items-center mb-4">
                    <span className="text-black">No Image</span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-lg font-bold text-black">Detection #{record.id}</p>
                  <p className="text-sm text-black">
                    {new Date(record.timestamp).toLocaleString()}
                  </p>
                  <p className="text-base mt-2 text-black">
                    Number of People: <span className="font-bold">{record.num_people}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls (only visible when not in search mode) */}
          {!isSearch && (
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={handlePrevious}
                disabled={page === 1}
                className="bg-transparent border border-white text-black font-bold py-2 px-4 rounded-none disabled:opacity-50 hover:bg-transparent hover:text-black"
              >
                Previous
              </button>
              <span className="text-black font-bold">{page}</span>
              <button
                onClick={handleNext}
                disabled={records.length < limit}
                className="bg-transparent border border-white text-black font-bold py-2 px-4 rounded-none disabled:opacity-50 hover:bg-transparent hover:text-black"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Return to Homepage */}
      <div className="fixed bottom-5 left-5">
        <Link href="/">
          <button className="bg-white border border-black hover:bg-black hover:text-white text-black font-bold py-3 px-4 rounded-full shadow">
            HOME
          </button>
        </Link>
      </div>
    </div>
  );
};

export default History;
