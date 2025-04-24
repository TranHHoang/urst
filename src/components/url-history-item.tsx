import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, ExternalLink } from "lucide-react";

interface UrlHistoryItemProps {
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

export function UrlHistoryItem({
  originalUrl,
  shortUrl,
  createdAt,
  clicks,
}: UrlHistoryItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-sm truncate max-w-[300px] sm:max-w-[400px]">
                {originalUrl}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <a
                  href={`https://${shortUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary flex items-center hover:underline"
                >
                  {shortUrl}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy URL</span>
                </Button>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="text-muted-foreground">{createdAt}</p>
              <p className="font-medium">{clicks} clicks</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
