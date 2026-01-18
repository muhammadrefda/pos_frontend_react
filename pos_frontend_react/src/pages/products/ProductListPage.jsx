import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../services/productService';
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
    IconButton,
    Stack
} from '@mui/material';
import { Search, Add, Delete, Edit, FileDownload, PictureAsPdf, CloudUpload } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { exportToExcel, exportToPDF } from '../../services/exportService';
import ProductImportDialog from '../../components/ProductImportDialog';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [openImport, setOpenImport] = useState(false); // State Dialog Import

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

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
                // API kita: pageNumber mulai dari 1
                const result = await getProducts(page + 1, rowsPerPage, debouncedSearch);
                setProducts(result.data || []);
                setTotalRecords(result.totalRecords || 0);
            } catch (err) {
                console.error(err);
            }
        };
        loadData();
    }, [refreshKey, page, rowsPerPage, debouncedSearch]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Produk?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProduct(id);
                    Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success');
                    setRefreshKey(old => old + 1); 
                } catch {
                    Swal.fire('Gagal!', 'Gagal menghapus produk.', 'error');
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

    // --- LOGIC EXPORT ---
    const fetchAllDataForExport = async () => {
        try {
            // Ambil semua data (limit besar, misal 1000) agar terdownload semua
            // Idealnya backend punya endpoint khusus export tanpa pagination
            const result = await getProducts(1, 1000, debouncedSearch);
            return result.data || [];
        } catch (error) {
            console.error("Gagal download data", error);
            Swal.fire("Error", "Gagal mengambil data untuk export", "error");
            return [];
        }
    };

    const handleExportExcel = async () => {
        const data = await fetchAllDataForExport();
        if (data.length === 0) return;

        // Format data agar rapi di Excel
        const excelData = data.map(item => ({
            "Nama Produk": item.productName,
            "Kategori": item.categoryName,
            "Harga": item.price,
            "Stok": item.stock,
            "Status": item.active ? "Aktif" : "Non-Aktif",
            "Tags": item.tags ? item.tags.join(", ") : ""
        }));

        exportToExcel(excelData, "Data-Produk", "Produk");
    };

    const handleExportPDF = async () => {
        const data = await fetchAllDataForExport();
        if (data.length === 0) return;

        // Definisi Kolom PDF
        const columns = [
            { title: "Nama Produk", dataKey: "productName" },
            { title: "Kategori", dataKey: "categoryName" },
            { title: "Harga", dataKey: "price" },
            { title: "Stok", dataKey: "stock" },
            { title: "Tags", dataKey: "tags" }
        ];

        // Format data baris
        const pdfData = data.map(item => ({
            ...item,
            price: formatRupiah(item.price), // Format rupiah di PDF
            tags: item.tags ? item.tags.join(", ") : "-"
        }));

        exportToPDF(columns, pdfData, "Laporan-Produk", "Laporan Data Produk");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header title="Products" />

                <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                    <Container maxWidth="xl">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                                Daftar Produk
                            </Typography>
                            
                            <Stack direction="row" spacing={2}>
                                <Button 
                                    variant="outlined" 
                                    color="success" 
                                    startIcon={<FileDownload />}
                                    onClick={handleExportExcel}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#0d5e27'
                                        }
                                    }}
                                >
                                    Excel
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    startIcon={<PictureAsPdf />}
                                    onClick={handleExportPDF}
                                >
                                    PDF
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<CloudUpload />}
                                    onClick={() => setOpenImport(true)}
                                >
                                    Import CSV
                                </Button>
                                <Button 
                                    component={Link} 
                                    to="/products/new" 
                                    variant="contained" 
                                    startIcon={<Add />}
                                >
                                    Tambah Produk
                                </Button>
                            </Stack>
                        </Box>

                        <Paper sx={{ p: 2, mb: 3 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Cari produk..."
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
                                            <TableCell sx={{ fontWeight: 'bold' }}>Nama Produk</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Kategori</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Harga</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Stok</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', width: '300px' }}>Tags</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">Data tidak ditemukan.</TableCell>
                                            </TableRow>
                                        ) : (
                                            products.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body1" fontWeight="medium">{row.productName}</Typography>
                                                    </TableCell>
                                                    <TableCell>{row.categoryName || '-'}</TableCell>
                                                    <TableCell>{formatRupiah(row.price)}</TableCell>
                                                    <TableCell>
                                                        <span className={row.stock < 5 ? 'text-red-600 font-bold' : 'text-gray-800'}>
                                                            {row.stock}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                                            {row.tags && row.tags.map((tag, idx) => (
                                                                <Chip key={idx} label={tag} size="small" color="primary" variant="outlined" />
                                                            ))}
                                                        </Stack>
                                                    </TableCell>
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

                {/* Dialog Import */}
                <ProductImportDialog 
                    open={openImport} 
                    onClose={() => setOpenImport(false)} 
                    onSuccess={() => setRefreshKey(old => old + 1)}
                />
            </div>
        </div>
    );
};
export default ProductListPage;