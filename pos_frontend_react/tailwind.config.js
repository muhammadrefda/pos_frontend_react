/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Warna Custom POS ---
        'pos-primary': '#10B981', // Hijau (contoh: untuk tombol utama, sidebar aktif)
        'pos-secondary': '#374151', // Abu gelap (contoh: untuk teks, latar belakang sidebar)
        'pos-alert': '#EF4444', // Merah
        'pos-background': '#F9FAFB', // Putih keabu-abuan untuk latar belakang halaman
      }
    },
  },
  plugins: [],
}