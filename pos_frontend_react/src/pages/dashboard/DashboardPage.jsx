import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
// Kita pakai service yang sudah ada (Real Data)
import { getTransactions } from "../../services/transactionService";
import { getProducts } from "../../services/productService";
import { getCustomers } from "../../services/customerService";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { 
    Box, 
    Grid, 
    Card, 
    Typography, 
    CircularProgress,
    Container,
    Paper,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Chip,
    Alert
} from "@mui/material";
import { 
    ShoppingCart, 
    MonetizationOn, 
    Inventory, 
    People, 
    TrendingUp, 
    Warning 
} from "@mui/icons-material";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    omsetToday: 0,
    trxToday: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data Grafik Dummy (Biar cantik buat demo)
  // Nanti bisa diganti logic real aggregation dari transaction history
  const chartData = [
    { name: 'Senin', total: 400000 },
    { name: 'Selasa', total: 300000 },
    { name: 'Rabu', total: 200000 },
    { name: 'Kamis', total: 278000 },
    { name: 'Jumat', total: 189000 },
    { name: 'Sabtu', total: 239000 },
    { name: 'Minggu', total: 349000 },
  ];

  useEffect(() => {
    const calculateDashboard = async () => {
      setLoading(true);
      try {
        // 1. Ambil Data Real dari API yang sudah ada
        // Kita ambil limit besar untuk kalkulasi sederhana di frontend
        const [trxRes, prodRes, custRes] = await Promise.all([
            getTransactions(1, 1000), // Ambil 1000 transaksi terakhir
            getProducts(1, 1000),     // Ambil 1000 produk
            getCustomers(1, 1000)     // Ambil 1000 pelanggan
        ]);

        const transactions = trxRes.data || [];
        const products = prodRes.data || [];
        const customers = custRes.data || [];

        // --- A. Hitung Statistik Hari Ini ---
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        const todayTransactions = transactions.filter(t => 
            t.transactionDate.startsWith(today)
        );

        const omsetToday = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

        setStats({
            omsetToday: omsetToday,
            trxToday: todayTransactions.length,
            totalProducts: products.length, // Total Record Produk
            totalCustomers: customers.length // Total Record Pelanggan
        });

        // --- B. Filter Produk Stok Menipis (< 5) ---
        const lowStock = products
            .filter(p => p.stock <= 5)
            .sort((a, b) => a.stock - b.stock) // Urutkan dari yang paling sedikit
            .slice(0, 5); // Ambil 5 teratas
        
        setLowStockProducts(lowStock);

        // --- C. Transaksi Terakhir ---
        setRecentTransactions(transactions.slice(0, 5)); // 5 Transaksi teratas (API biasanya sudah sort desc)

      } catch (error) {
        console.error("Gagal hitung dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateDashboard();
  }, []);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="Dashboard" />

        <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                        Halo, Admin! 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Berikut adalah laporan operasional toko Anda hari ini.
                    </Typography>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {/* --- ROW 1: SUMMARY CARDS --- */}
                        <Grid item xs={12} sm={6} lg={3}>
                            <SummaryCard
                                title="Omset Hari Ini"
                                value={formatRupiah(stats.omsetToday)}
                                icon={<MonetizationOn fontSize="large" sx={{ color: 'white' }} />}
                                color="linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" // Blue Gradient
                                subtitle="+12% dari kemarin" // Mockup
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <SummaryCard
                                title="Transaksi Hari Ini"
                                value={stats.trxToday}
                                icon={<ShoppingCart fontSize="large" sx={{ color: 'white' }} />}
                                color="linear-gradient(135deg, #16a34a 0%, #15803d 100%)" // Green Gradient
                                subtitle="Order baru masuk"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <SummaryCard
                                title="Total Produk"
                                value={stats.totalProducts}
                                icon={<Inventory fontSize="large" sx={{ color: 'white' }} />}
                                color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" // Orange Gradient
                                subtitle="Item terdaftar"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <SummaryCard
                                title="Total Pelanggan"
                                value={stats.totalCustomers}
                                icon={<People fontSize="large" sx={{ color: 'white' }} />}
                                color="linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)" // Purple Gradient
                                subtitle="Member aktif"
                            />
                        </Grid>

                        {/* --- ROW 2: CHART & ALERTS --- */}
                        
                        {/* Grafik Penjualan */}
                        <Grid item xs={12} lg={8}>
                            <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }} elevation={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Tren Penjualan Minggu Ini
                                    </Typography>
                                    <Chip label="Realtime" color="success" size="small" variant="outlined" />
                                </Box>
                                <Box height={320}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip formatter={(val) => formatRupiah(val)} />
                                            <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Low Stock & Recent Transactions */}
                        <Grid item xs={12} lg={4}>
                            <Box display="flex" flexDirection="column" gap={3}>
                                
                                {/* WIDGET 1: Stok Menipis */}
                                <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }} elevation={2}>
                                    <Box sx={{ p: 2, bgcolor: '#fef2f2', borderBottom: '1px solid #fee2e2' }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Warning color="error" fontSize="small" />
                                            <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                                                Stok Menipis ({lowStockProducts.length})
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <List dense>
                                        {lowStockProducts.length === 0 ? (
                                            <Box p={3} textAlign="center">
                                                <Typography variant="body2" color="text.secondary">Semua stok aman!</Typography>
                                            </Box>
                                        ) : (
                                            lowStockProducts.map((p, index) => (
                                                <Box key={`lowstock-${p.id || index}`}>
                                                    <ListItem>
                                                        <ListItemText 
                                                            primary={p.productName} 
                                                            secondary={`Sisa Stok: ${p.stock}`} 
                                                        />
                                                        <Chip label="Restock!" color="error" size="small" />
                                                    </ListItem>
                                                    {index < lowStockProducts.length - 1 && <Divider component="li" />}
                                                </Box>
                                            ))
                                        )}
                                    </List>
                                </Paper>

                                {/* WIDGET 2: Transaksi Terakhir */}
                                <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }} elevation={2}>
                                    <Box sx={{ p: 2, borderBottom: '1px solid #f3f4f6' }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Transaksi Terakhir
                                        </Typography>
                                    </Box>
                                    <List dense>
                                        {recentTransactions.map((trx, index) => (
                                            <Box key={`recent-${trx.transactionId || index}`}>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                                                            <ShoppingCart sx={{ fontSize: 16 }} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText 
                                                        primary={trx.invoiceNumber || `#TRX-${trx.transactionId}`}
                                                        secondary={`Customer ID: ${trx.customerId}`}
                                                    />
                                                    <Typography variant="body2" fontWeight="bold" color="primary">
                                                        {formatRupiah(trx.totalAmount)}
                                                    </Typography>
                                                </ListItem>
                                                {index < recentTransactions.length - 1 && <Divider component="li" />}
                                            </Box>
                                        ))}
                                        {recentTransactions.length === 0 && (
                                            <Box p={3} textAlign="center">
                                                <Typography variant="body2" color="text.secondary">Belum ada transaksi</Typography>
                                            </Box>
                                        )}
                                    </List>
                                </Paper>

                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card sx={{ height: '100%', borderRadius: 3, p: 2, position: 'relative', overflow: 'hidden' }} elevation={2}>
        <Box display="flex" alignItems="center">
            <Box 
                sx={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 3, 
                    background: color, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    mr: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    {title}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {value}
                </Typography>
                {subtitle && (
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                        <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
                        <Typography variant="caption" color="success.main" fontWeight="bold">
                            {subtitle}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    </Card>
  );
};

export default DashboardPage;