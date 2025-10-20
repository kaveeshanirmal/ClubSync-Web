"use client";

import { useState } from "react";

export default function TestPage() {
  const [status, setStatus] = useState<string>("Not tested");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus("Testing...");

    try {
      const response = await fetch("/api/test-db");
      const data = await response.json();

      if (response.ok) {
        setStatus("✅ Database connected successfully");
      } else {
        setStatus(`❌ Connection failed: ${data.error}`);
      }
    } catch (error) {
      setStatus(`❌ Request failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? "Testing" : "Test Connection"}
      </button>

      <div className="p-4 border rounded bg-gray-50">
        <p>
          <strong>Status:</strong> {status}
        </p>
      </div>
    </div>
  );
}
