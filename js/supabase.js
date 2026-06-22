import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://xyreazdaomkrrkwhddab.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cmVhemRhb21rcnJrd2hkZGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDI1NTMsImV4cCI6MjA5NzM3ODU1M30.ZnNkt_OhXTISh2IuXAJXdfJY5lA76OGvcfQGpn1k3ZA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
