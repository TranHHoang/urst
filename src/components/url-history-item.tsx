"use client";

import { formatDistanceToNow } from "date-fns";
import type { UrlData } from "@/lib/storage";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UrlHistoryItemProps {
  data: UrlData;
  onDelete: () => Promise<void>;
}

export function UrlHistoryItem({ data, onDelete }: UrlHistoryItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { original_url, code, clicks, created_at } = data;
  const shortUrl = `${window.location.origin}/${code}`;
  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error("Error deleting URL:", error);
      alert("Failed to delete URL");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{shortUrl}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                type="button"
                aria-label="Delete URL"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete URL</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-[300px]">
              {original_url}
            </p>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            <p>{timeAgo}</p>
            <p>{clicks} clicks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
