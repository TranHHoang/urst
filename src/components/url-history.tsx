"use client";

import { useEffect, useState, useCallback } from "react";
import type { UrlData } from "@/lib/storage";
import { UrlHistoryItem } from "./url-history-item";

export function UrlHistory() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUrls = async () => {
    console.log("Fetching URLs...");
    try {
      const response = await fetch("/api/urls/recent");
      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }
      const data = await response.json();
      console.log("Fetched URLs:", data);
      setUrls(data);
    } catch (error) {
      console.error("Error fetching URLs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDelete = useCallback(async (code: string) => {
    console.log("Parent: Handling delete for code:", code);
    try {
      const response = await fetch(`/api/urls/${code}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete URL");
      }

      // Only refresh the list if delete was successful
      await fetchUrls();
    } catch (error) {
      console.error("Error in parent delete handler:", error);
      throw error; // Re-throw to let child component handle the error
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (urls.length === 0) {
    return <div>No URLs shortened yet.</div>;
  }

  const createDeleteHandler = (code: string) => {
    return async () => {
      await handleDelete(code);
    };
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent URLs</h2>
      <div className="space-y-2">
        {urls.map((url) => (
          <UrlHistoryItem
            key={url.code}
            data={url}
            onDelete={createDeleteHandler(url.code)}
          />
        ))}
      </div>
    </div>
  );
}
