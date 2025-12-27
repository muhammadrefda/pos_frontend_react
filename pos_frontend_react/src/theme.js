import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Warna biru mirip Tailwind blue-600
    },
    secondary: {
      main: '#64748b', // Warna slate-500
    },
    background: {
      default: '#f3f4f6', // Warna gray-100
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    // Custom style overrides (opsional)
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Mematikan huruf kapital semua pada tombol
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
            rounded: {
                borderRadius: '12px',
            }
        }
    }
  },
});

export default theme;