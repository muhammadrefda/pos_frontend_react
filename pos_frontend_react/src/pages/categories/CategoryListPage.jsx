import { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '../../services/categoryService';
import { Link } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
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
    Chip,
    IconButton
} from '@mui/material';
import { Search, Add, Delete, Edit } from '@mui/icons-material';

const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    // Pagination State (MUI TablePagination uses 0-based index for page)
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0); // Reset ke halaman pertama saat search berubah
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Backend saya page-nya mulai dari 1, tapi MUI mulai dari 0. Jadi perlu +1
                const result = await getCategories(page + 1, rowsPerPage, debouncedSearch);
                setCategories(result.data || []);
                setTotalRecords(result.totalRecords || 0);
            } catch (err) {
                alert("Gagal ambil kategori" + err);
            }
        };
        loadData();
    }, [refreshKey, page, rowsPerPage, debouncedSearch]);

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus kategori ini?")) return;
        await deleteCategory(id);
        setRefreshKey(old => old + 1);
    };

    // Handler Pagination MUI
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar masih pakai komponen lama (Hybrid sementara) */}
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header title="Overview" />

                <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                    <Container maxWidth="lg">
                        {/* Header Halaman */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                                Master Kategori
                            </Typography>
                            <Button 
                                component={Link} 
                                to="/categories/new" 
                                variant="contained" 
                                startIcon={<Add />}
                            >
                                Tambah Baru
                            </Button>
                        </Box>

                        {/* Search Bar */}
                        <Paper sx={{ p: 2, mb: 3 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Cari nama kategori..."
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

                        {/* Tabel Data */}
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Nama Kategori</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Deskripsi</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categories.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    Tidak ada data ditemukan.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            categories.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell>{row.categoryName}</TableCell>
                                                    <TableCell>{row.description || '-'}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={row.active ? "Aktif" : "Non-Aktif"} 
                                                            color={row.active ? "success" : "default"}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton color="error" onClick={() => handleDelete(row.id)} size="small">
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            
                            {/* Pagination Component Built-in MUI */}
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Baris per halaman:"
                            />
                        </Paper>
                    </Container>
                </Box>
            </div>
        </div>
    );
};

export default CategoryListPage;