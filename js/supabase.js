import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://tcsgtzdmfzcqlaagnlcr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjc2d0emRtZnpjcWxhYWdubGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTc1NDQsImV4cCI6MjA5NzE5MzU0NH0.FaOEEgmsV60GCXOHVXZi_CE-bwUj8kz3k5N2G1pZeRg";

export const supabase = createClient(supabaseUrl, supabaseKey);