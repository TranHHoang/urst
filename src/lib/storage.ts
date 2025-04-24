import { supabase } from "./supabase";

export interface UrlData {
  code: string;
  original_url: string;
  clicks: number;
  created_at: string;
}

export const urlStorage = {
  async set(code: string, url: string): Promise<void> {
    const { error } = await supabase.from("shortened_urls").insert([
      {
        code,
        original_url: url,
        clicks: 0,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error storing URL:", error);
      throw error;
    }
  },

  async get(code: string): Promise<string | undefined> {
    // First increment the click count
    await this.incrementClicks(code);

    // Then fetch the URL
    const { data, error } = await supabase
      .from("shortened_urls")
      .select("original_url")
      .eq("code", code)
      .single();

    if (error) {
      console.error("Error fetching URL:", error);
      return undefined;
    }

    return data?.original_url;
  },

  async has(code: string): Promise<boolean> {
    const { count, error } = await supabase
      .from("shortened_urls")
      .select("code", { count: "exact", head: true })
      .eq("code", code);

    if (error) {
      console.error("Error checking URL existence:", error);
      return false;
    }

    return (count ?? 0) > 0;
  },

  async incrementClicks(code: string): Promise<void> {
    // First get the current click count
    const { data: current } = await supabase
      .from("shortened_urls")
      .select("clicks")
      .eq("code", code)
      .single();

    if (!current) return;

    // Then increment it
    const { error } = await supabase
      .from("shortened_urls")
      .update({ clicks: current.clicks + 1 })
      .eq("code", code);

    if (error) {
      console.error("Error incrementing clicks:", error);
    }
  },

  async getUrlData(code: string): Promise<UrlData | undefined> {
    const { data, error } = await supabase
      .from("shortened_urls")
      .select("*")
      .eq("code", code)
      .single();

    if (error) {
      console.error("Error fetching URL data:", error);
      return undefined;
    }

    return data as UrlData;
  },

  async getRecentUrls(limit: number = 5): Promise<UrlData[]> {
    const { data, error } = await supabase
      .from("shortened_urls")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent URLs:", error);
      return [];
    }

    return data as UrlData[];
  },

  async delete(code: string): Promise<boolean> {
    const { error } = await supabase
      .from("shortened_urls")
      .delete()
      .eq("code", code);

    if (error) {
      console.error("Error deleting URL:", error);
      return false;
    }

    return true;
  },
};
