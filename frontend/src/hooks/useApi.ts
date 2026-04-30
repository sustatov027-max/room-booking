import { useMemo, useState } from "react";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = useMemo(() => localStorage.getItem("jwtToken") || "", []);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }),
    [token]
  );

  return {
    loading,
    setLoading,
    error,
    setError,
    authHeaders,
  };
};