/**
 * ========================================
 * File: supabaseClient.js
 * Tema: Klien Supabase untuk Koneksi Database
 * Proyek: Virnophas Official
 * ========================================
 */

// Impor fungsi createClient dari Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Kredensial Supabase Anda. JANGAN DIBAGIKAN!
const SUPABASE_URL = 'https://rjuyxywkpyinetnmtstm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdXl4eXdrcHlpbmV0bm10c3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTk1MzUsImV4cCI6MjA3MDczNTUzNX0.vlip7D5W-w1fzaRyO0HKQSMYTetH58e2pEbuZmfntf8';

// Inisialisasi klien Supabase dan ekspor
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

