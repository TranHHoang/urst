import { Button } from "@/components/ui/button";
import { Copy, Download, Share2 } from "lucide-react";
import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QrCodeResultProps {
  originalUrl: string;
  shortUrl: string;
}

export function QrCodeResult({ originalUrl, shortUrl }: QrCodeResultProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="bg-white p-3 border rounded-md" ref={qrRef}>
          <QRCodeSVG
            value={shortUrl}
            size={150}
            level="H"
            includeMargin={true}
          />
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Your shortened URL:
            </p>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-primary hover:underline"
              >
                {shortUrl}
              </a>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3 mr-1" />
                {copied ? "Copied!" : "Copy"}
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
            <Button variant="outline" size="sm" onClick={handleDownloadQR}>
              <Download className="h-3 w-3 mr-1" />
              Download QR
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: "Shortened URL",
                      text: `Check out this shortened URL: ${shortUrl}`,
                      url: shortUrl,
                    })
                    .catch(console.error);
                }
              }}
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
