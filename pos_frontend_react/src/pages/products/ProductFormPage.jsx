import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../../services/productService';
import { getCategories, createCategory } from '../../services/categoryService';
import { getTags, createTag } from '../../services/tagService'; 
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Swal from 'sweetalert2';
import { 
    Box, 
    Button, 
    Container, 
    Paper, 
    Typography, 
    TextField, 
    Grid,
    Autocomplete,
    createFilterOptions,
    FormControlLabel,
    Switch,
    InputAdornment,
    Divider,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';

const filter = createFilterOptions();

const ProductFormPage = () => {
    const navigate = useNavigate();

    // Data Master
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    // Form State
    const [productName, setProductName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [active, setActive] = useState(true);

    // Load Master Data
    useEffect(() => {
        const loadMasterData = async () => {
            try {
                // Ambil data master untuk dropdown
                const catData = await getCategories(1, 100);
                setCategories(catData.data || []);

                const tagData = await getTags(1, 100);
                setTags(tagData.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        loadMasterData();
    }, []);

    // --- LOGIC CREATABLE CATEGORY ---
    const handleCategoryChange = async (event, newValue) => {
        if (typeof newValue === 'string') {
            setSelectedCategory({ categoryName: newValue });
        } else if (newValue && newValue.inputValue) {
            try {
                const newCat = await createCategory({ 
                    categoryName: newValue.inputValue,
                    description: "Created via Product Form",
                    active: true
                });
                
                // Tambahkan ke state list dan pilih
                setCategories(prev => [...prev, newCat]);
                setSelectedCategory(newCat); 
                
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Kategori baru dibuat!', timer: 2000, showConfirmButton: false });
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Gagal membuat kategori baru", "error");
            }
        } else {
            setSelectedCategory(newValue);
        }
    };

    // --- LOGIC CREATABLE TAGS ---
    const handleTagsChange = async (event, newValue) => {
        const lastItem = newValue[newValue.length - 1];

        if (lastItem && lastItem.inputValue) {
            try {
                const newTag = await createTag({ tagName: lastItem.inputValue });
                
                setTags(prev => [...prev, newTag]);
                
                const finalTags = [...newValue];
                finalTags.pop(); 
                finalTags.push(newTag); 
                
                setSelectedTags(finalTags);
                
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Tag baru dibuat!', timer: 2000, showConfirmButton: false });
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Gagal membuat tag baru", "error");
            }
        } else {
            setSelectedTags(newValue);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategory) {
            Swal.fire("Validasi", "Kategori harus dipilih!", "warning");
            return;
        }

        try {
            const payload = {
                productName,
                categoryId: selectedCategory.id,
                price: Number(price),
                stock: Number(stock),
                tagIds: selectedTags.map(t => t.id),
                active
            };
            await createProduct(payload);
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Produk berhasil disimpan.' })
                .then(() => navigate('/products'));
        } catch (error) {
            Swal.fire("Error", "Gagal menyimpan produk.", "error");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header title="New Product" />

                <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                    <Container maxWidth="sm">
                        <Paper sx={{ p: 4, borderRadius: 2 }}>
                            <Box display="flex" alignItems="center" mb={4}>
                                <Button 
                                    component={Link} 
                                    to="/products" 
                                    startIcon={<ArrowBack />} 
                                    sx={{ mr: 2, textTransform: 'none' }}
                                >
                                    Kembali
                                </Button>
                                <Typography variant="h5" fontWeight="bold">Tambah Produk Baru</Typography>
                            </Box>

                            <form onSubmit={handleSubmit}>
                                <Grid container direction="column" spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth label="Nama Produk" variant="outlined" required 
                                            value={productName} onChange={(e) => setProductName(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Autocomplete
                                            fullWidth
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            // PENTING: Bandingkan berdasarkan ID agar MUI tahu ini data yang sama
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);
                                                const { inputValue } = params;
                                                const isExisting = options.some((option) => inputValue === option.categoryName);
                                                if (inputValue !== '' && !isExisting) {
                                                    filtered.push({ inputValue, categoryName: `Add "${inputValue}"` });
                                                }
                                                return filtered;
                                            }}
                                            options={categories}
                                            getOptionLabel={(option) => {
                                                if (typeof option === 'string') return option;
                                                if (option.inputValue) return option.inputValue;
                                                return option.categoryName || "";
                                            }}
                                            renderOption={(props, option) => {
                                                const { key, ...optionProps } = props;
                                                return (
                                                    <li key={key} {...optionProps}>
                                                        {option.categoryName}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Kategori" required />}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth label="Harga" type="number" required 
                                            value={price} onChange={(e) => setPrice(e.target.value)}
                                            InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth label="Stok" type="number" required 
                                            value={stock} onChange={(e) => setStock(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Autocomplete
                                            multiple
                                            fullWidth
                                            value={selectedTags}
                                            onChange={handleTagsChange}
                                            // PENTING: Bandingkan berdasarkan ID
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);
                                                const { inputValue } = params;
                                                const isExisting = options.some((option) => inputValue === option.tagName);
                                                if (inputValue !== '' && !isExisting) {
                                                    filtered.push({ inputValue, tagName: `Add "${inputValue}"` });
                                                }
                                                return filtered;
                                            }}
                                            options={tags}
                                            getOptionLabel={(option) => {
                                                if (typeof option === 'string') return option;
                                                if (option.inputValue) return option.inputValue;
                                                return option.tagName || "";
                                            }}
                                            renderOption={(props, option) => {
                                                const { key, ...optionProps } = props;
                                                return (
                                                    <li key={key} {...optionProps}>
                                                        {option.tagName}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Tags (Opsional)" placeholder="Pilih atau buat tag..." />}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box display="flex" flexDirection="column" gap={2}>
                                            <FormControlLabel
                                                control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} color="primary" />}
                                                label={active ? "Status: Aktif" : "Status: Non-Aktif"}
                                            />
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                size="large" 
                                                fullWidth 
                                                startIcon={<Save />}
                                                sx={{ py: 1.5, fontWeight: 'bold' }}
                                            >
                                                Simpan Produk
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Container>
                </Box>
            </div>
        </div>
    );
};

export default ProductFormPage;