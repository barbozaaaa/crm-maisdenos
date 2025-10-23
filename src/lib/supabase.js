import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sdgdcmejzthicgwinuze.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZ2RjbWVqenRoaWNnd2ludXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NzQ4NzQsImV4cCI6MjA1MDA1MDg3NH0.8QZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

