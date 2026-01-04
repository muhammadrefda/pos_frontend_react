import { useEffect, useState } from 'react';
import { getTransactions } from '../../services/transactionService';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Swal from 'sweetalert2';
import { 
    Box, 
    Container, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography, 
    TablePagination,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import { Visibility, CreditCard, AccountBalance, Money } from '@mui/icons-material';

const TransactionListPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            try {
                const result = await getTransactions(page + 1, rowsPerPage);
                setTransactions(result.data || []);
                setTotalRecords(result.totalRecords || 0);
            } catch (error) {
                console.error("Gagal ambil riwayat transaksi:", error);
            } finally {
                setLoading(false);
            }
        };
        loadTransactions();
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const getPaymentIcon = (method) => {
        if (!method) return <Money />;
        const m = method.toLowerCase();
        if (m.includes('transfer')) return <AccountBalance />;
        if (m.includes('qris') || m.includes('card')) return <CreditCard />;
        return <Money />;
    };

    const getPaymentColor = (method) => {
        if (!method) return "default";
        const m = method.toLowerCase();
        if (m.includes('transfer')) return "info";
        if (m.includes('qris')) return "warning";
        return "success"; // Cash
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header title="Transactions" />

                <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                    <Container maxWidth="xl">
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                                Riwayat Transaksi
                            </Typography>
                        </Box>

                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>ID Transaksi</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Tanggal</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Pelanggan</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Metode Bayar</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Tagihan</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">Memuat data...</TableCell>
                                            </TableRow>
                                        ) : transactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">Belum ada riwayat transaksi.</TableCell>
                                            </TableRow>
                                        ) : (
                                            transactions.map((trx) => (
                                                <TableRow key={trx.transactionId} hover>
                                                    <TableCell sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 'bold' }}>
                                                        {trx.invoiceNumber || `#TRX-${trx.transactionId}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(trx.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 'medium' }}>
                                                        {trx.customerName || trx.fullName || `Cust ID: ${trx.customerId}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            icon={getPaymentIcon(trx.paymentMethod)} 
                                                            label={trx.paymentMethod} 
                                                            color={getPaymentColor(trx.paymentMethod)} 
                                                            size="small" 
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                        {formatRupiah(trx.totalAmount)}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Lihat Detail">
                                                            <IconButton 
                                                                color="primary" 
                                                                onClick={() => Swal.fire('Info', 'Fitur Detail Transaksi menyusul!', 'info')}
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50]}
                                component="div"
                                count={totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Container>
                </Box>
            </div>
        </div>
    );
};

export default TransactionListPage;