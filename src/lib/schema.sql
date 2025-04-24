-- Create the shortened_urls table
CREATE TABLE IF NOT EXISTS shortened_urls (
  code TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  user_id TEXT
); 