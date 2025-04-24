import { Button } from "@/components/ui/button";
import { Copy, Download, Share2 } from "lucide-react";

interface QrCodeResultProps {
  originalUrl: string;
  shortUrl: string;
}

export function QrCodeResult({ originalUrl, shortUrl }: QrCodeResultProps) {
  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="bg-white p-3 border rounded-md">
          <img
            src="/placeholder.svg?height=150&width=150"
            alt="QR code for shortened URL"
            className="h-[150px] w-[150px]"
          />
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Your shortened URL:
            </p>
            <div className="flex items-center gap-2">
              <a
                href={`https://${shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-primary hover:underline"
              >
                {shortUrl}
              </a>
              <Button variant="outline" size="sm" className="h-8">
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Original URL:</p>
            <p className="text-sm truncate max-w-[300px] sm:max-w-[400px]">
              {originalUrl}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" />
              Download QR
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
