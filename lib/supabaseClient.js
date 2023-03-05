import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://resvibgtwucmhpdbacog.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlc3ZpYmd0d3VjbWhwZGJhY29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgwMjAyNjEsImV4cCI6MTk5MzU5NjI2MX0.0t2ptaym7Ek7EWTJvk3q11qHJ19rm1HMJtvIn4tkgD4"
);
