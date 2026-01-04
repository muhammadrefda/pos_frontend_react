import { useEffect, useState } from 'react';
import { getTags, deleteTag } from '../../services/tagService';
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
    IconButton
} from '@mui/material';
import { Search, Add, Delete } from '@mui/icons-material';

const TagListPage = () => {
    const [tags, setTags] = useState([]);
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
                const result = await getTags(page + 1, rowsPerPage, debouncedSearch);
                setTags(result.data || []);
                setTotalRecords(result.totalRecords || 0);
            } catch (err) {
                console.error("Gagal ambil tags:", err);
            }
        };
        loadData();
    }, [refreshKey, page, rowsPerPage, debouncedSearch]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Tag?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteTag(id);
                    Swal.fire('Terhapus!', 'Tag berhasil dihapus.', 'success');
                    setRefreshKey(old => old + 1);
                } catch {
                    Swal.fire('Gagal!', 'Tag sedang digunakan oleh produk.', 'error');
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
                <Header title="Tags" />

                <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                    <Container maxWidth="md"> {/* MaxWidth MD agar tidak terlalu lebar */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                                Daftar Tag
                            </Typography>
                            <Button 
                                component={Link} 
                                to="/tags/new" 
                                variant="contained" 
                                startIcon={<Add />}
                            >
                                Tambah Tag
                            </Button>
                        </Box>

                        <Paper sx={{ p: 2, mb: 3 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Cari tag..."
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
                                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Nama Tag</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tags.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">Data tidak ditemukan.</TableCell>
                                            </TableRow>
                                        ) : (
                                            tags.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell>{row.id}</TableCell>
                                                    <TableCell sx={{ fontWeight: 'medium' }}>{row.tagName}</TableCell>
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

export default TagListPage;