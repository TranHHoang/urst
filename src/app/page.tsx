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
import { UrlHistoryItem } from "@/components/url-history-item";
import { GoogleLoginButton } from "@/components/google-login-button";
import { QrCodeResult } from "@/components/qr-code-result";

export default function Home() {
  const [url, setUrl] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      // In a real app, this would call an API to shorten the URL
      setShortUrl("linkbr.ef/xyz123");
      setShowResult(true);
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
          <GoogleLoginButton />
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
                />
                <Button type="submit">
                  Shorten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {showResult && (
                <QrCodeResult originalUrl={url} shortUrl={shortUrl} />
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your links</h2>
            <div className="space-y-3">
              <UrlHistoryItem
                originalUrl="https://example.com/very/long/url/that/needs/shortening/and/is/quite/lengthy"
                shortUrl="linkbr.ef/a1b2c3"
                createdAt="2 hours ago"
                clicks={12}
              />
              <UrlHistoryItem
                originalUrl="https://another-example.com/blog/post/2023/05/15/how-to-create-short-links"
                shortUrl="linkbr.ef/d4e5f6"
                createdAt="Yesterday"
                clicks={45}
              />
              <UrlHistoryItem
                originalUrl="https://docs.example.org/documentation/getting-started/introduction"
                shortUrl="linkbr.ef/g7h8i9"
                createdAt="Last week"
                clicks={128}
              />
            </div>
          </div>
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
