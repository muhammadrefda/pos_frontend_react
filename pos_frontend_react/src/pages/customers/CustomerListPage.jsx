import { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '../../services/customerService';
import { Link } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Swal from 'sweetalert2';
import { 
    Box, 
    Button, 
    Container, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography, 
    TextField, 
    InputAdornment,
    TablePagination,
    IconButton,
    Avatar
} from '@mui/material';
import { Search, Add, Delete, Person } from '@mui/icons-material';

const CustomerListPage = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getCustomers(page + 1, rowsPerPage, debouncedSearch);
                setCustomers(result.data || []);
                setTotalRecords(result.totalRecords || 0);
            } catch (err) {
                console.error(err);
            }
        };
        loadData();
    }, [refreshKey, page, rowsPerPage, debouncedSearch]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Pelanggan?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCustomer(id);
                    Swal.fire('Terhapus!', 'Pelanggan berhasil dihapus.', 'success');
                    setRefreshKey(old => old + 1);
                } catch {
                    Swal.fire('Gagal!', 'Gagal menghapus pelanggan.', 'error');
                }
            }
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header title="Customers" />

                <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                                Daftar Pelanggan
                            </Typography>
                            <Button 
                                component={Link} 
                                to="/customers/new" 
                                variant="contained" 
                                startIcon={<Add />}
                            >
                                Tambah Pelanggan
                            </Button>
                        </Box>

                        <Paper sx={{ p: 2, mb: 3 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Cari pelanggan (nama, hp)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                        </Paper>

                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', width: 50 }}>Avatar</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Nama Lengkap</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>No. Telepon</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">Data tidak ditemukan.</TableCell>
                                            </TableRow>
                                        ) : (
                                            customers.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell>
                                                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                            <Person fontSize="small" />
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>{row.fullName}</TableCell>
                                                    <TableCell>{row.phoneNumber}</TableCell>
                                                    <TableCell>{row.email || '-'}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                                            <Delete />
                                                        </IconButton>
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

export default CustomerListPage;