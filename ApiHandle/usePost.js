import { useState, useCallback } from "react";

const usePost = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_ENDPOINT;
  const token = JSON.parse(localStorage.getItem("token"))

  const postData = useCallback(async (body) => {
    try {
      setLoading(true);
      const response = await fetch(`${base_url}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token.accessToken,
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Failed to post data: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
      return jsonData;
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Network error:", error.message);
      } else {
        console.error("Request error:", error.message);
      }
      setData(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { postData, data, loading, setData };
};

export default usePost;
