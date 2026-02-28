"use client";

import { useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/exportWatched");
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "watched.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export watched list.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-800">
      <h1 className="text-2xl font-semibold pb-6 dark:text-white border-b border-gray-200 dark:border-gray-700">
        Export Watched List
      </h1>
      <button
        onClick={handleExport}
        disabled={loading}
        className="py-2 px-4 mt-6 bg-blue text-white rounded-lg hover:bg-blue-hover cursor-pointer transition"
      >
        {loading ? "Downloading..." : "Download JSON"}
      </button>
    </div>
  );
};

export default Page;
