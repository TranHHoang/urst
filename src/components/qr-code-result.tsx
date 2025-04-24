import { Button } from "@/components/ui/button";
import { Copy, Download, QrCode } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QrCodeResultProps {
  originalUrl: string;
  shortUrl: string;
}

export function QrCodeResult({ originalUrl, shortUrl }: QrCodeResultProps) {
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState<string>("");
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR code image on mount
  useEffect(() => {
    generateQrImage();
  }, [shortUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const generateQrImage = () => {
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
      const pngData = canvas.toDataURL("image/png");
      setQrImage(pngData);
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleDownloadQR = () => {
    if (!qrImage) return;

    const downloadLink = document.createElement("a");
    downloadLink.download = "qr-code.png";
    downloadLink.href = qrImage;
    downloadLink.click();
  };

  const handleCopyQR = async () => {
    if (!qrImage) return;

    try {
      const blob = await fetch(qrImage).then((res) => res.blob());
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      alert("QR code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy QR code:", err);
      alert("Failed to copy QR code. Try downloading instead.");
    }
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleCopyQR}
            title="Click to copy QR code"
            ref={qrRef}
          >
            <QRCodeSVG
              value={shortUrl}
              size={150}
              level="H"
              includeMargin={false}
              style={{ display: "block" }}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyQR}>
              <QrCode className="h-3 w-3 mr-1" />
              Copy QR
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadQR}>
              <Download className="h-3 w-3 mr-1" />
              Save QR
            </Button>
          </div>
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
        </div>
      </div>
    </div>
  );
}
