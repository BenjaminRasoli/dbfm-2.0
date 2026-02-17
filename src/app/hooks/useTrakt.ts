import { useCallback, useEffect, useState } from "react";

export const useTrakt = () => {
  const [traktToken, setTraktToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("trakt_token");
    if (storedToken) {
      setTraktToken(storedToken);
    }
  }, []);

  const disconnectTrakt = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await fetch("/api/trakt/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      setTraktToken(null);
      localStorage.removeItem("trakt_token");
      localStorage.removeItem("trakt_user");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to disconnect";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    traktToken,
    isConnected: !!traktToken,
    loading,
    error,
    disconnectTrakt,
  };
};
