import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lfupwjtmtonrgbgzakjs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdXB3anRtdG9ucmdiZ3pha2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzg3NTgsImV4cCI6MjA5NTgxNDc1OH0.z5TChOBvMEbAMENpdSBsSp8-YuQrzt7dTejvADM9Rks'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
