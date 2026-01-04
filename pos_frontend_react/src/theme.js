import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Ini warna biru (Tailwind blue-600)
    },
    secondary: {
      main: '#dc2626', // Ini warna merah (Tailwind red-600)
    },
    background: {
      default: '#f3f4f6', // Abu-abu muda (gray-100)
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
  },
  components: {
    // Override style default komponen di sini (opsional)
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Supaya tombol tidak huruf kapital semua
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;