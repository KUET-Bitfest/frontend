import { useState, useEffect, useCallback } from "react";

const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const base_url = process.env.NEXT_PUBLIC_ENDPOINT;
  const token = JSON.parse(localStorage.getItem("token"))
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${base_url}${endpoint}`, {
        method: 'GET',
        headers : {'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.access_token,
        "ngrok-skip-browser-warning": "69420"
      }
    });

      if (response.status === 304) {
        console.log("Data not modified, using cached data.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log("Request canceled:", error.message);
        setError("Request was cancelled");
      } else if (error instanceof TypeError) {
        console.error("Network error:", error.message);
        setError("Network error occurred");
      } else {
        console.error("Request error:", error.message);
        setError(error.message);
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [endpoint, fetchData]);

  return { data, loading, error, setData, refetch: fetchData };
};

export default useFetch;
