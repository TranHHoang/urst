"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Link2 } from "lucide-react";
import { UrlHistory } from "@/components/url-history";
import { UserMenu } from "@/components/user-menu";
import { QrCodeResult } from "@/components/qr-code-result";

export default function Home() {
  const [url, setUrl] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortUrl(data.shortUrl);
      setExpiresAt(data.expiresAt);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to shorten URL");
      setShowResult(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            <span className="font-medium">urst</span>
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold sm:text-4xl">
              Shorten your links
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create short and memorable links that redirect to your long URLs.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create a short link</CardTitle>
              <CardDescription>
                Paste your long URL to generate a short link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex gap-2" onSubmit={handleSubmit}>
                <Input
                  type="url"
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  className="flex-1"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Shortening..." : "Shorten"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              {showResult && (
                <QrCodeResult
                  originalUrl={url}
                  shortUrl={shortUrl}
                  expiresAt={expiresAt}
                />
              )}
            </CardContent>
          </Card>

          <UrlHistory />
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} urst. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
