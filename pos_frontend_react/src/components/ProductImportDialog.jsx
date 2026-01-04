import { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography, 
    Box, 
    LinearProgress, 
    Alert,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { CloudUpload, Download } from '@mui/icons-material';
import Papa from 'papaparse';
import { createProduct } from '../services/productService';
import { getTags, createTag } from '../services/tagService'; 
import { getCategories, createCategory } from '../services/categoryService'; // Tambah Service Kategori
import Swal from 'sweetalert2';

const ProductImportDialog = ({ open, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);

    // 1. Fungsi Download Template (User Friendly V3)
    const handleDownloadTemplate = () => {
        // Kolom CategoryId diganti Category (Nama)
        const csvContent = "ProductName,Category,Price,Stock,Tags (Pisahkan dengan |)\nContoh Produk A,Elektronik,50000,20,Premium|Diskon";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'template_produk_smart.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper: Cari ID Kategori, kalau gak ada -> Create Baru
    const resolveCategoryId = async (categoryName, existingCategoriesMap) => {
        if (!categoryName) throw new Error("Nama Kategori Kosong");

        const lowerName = categoryName.trim().toLowerCase();
        let catId = existingCategoriesMap.get(lowerName);

        if (catId) {
            return catId;
        } else {
            // CATEGORY TIDAK DITEMUKAN -> AUTO CREATE
            // console.log(`Kategori '${categoryName}' belum ada. Membuat baru...`);
            const newCat = await createCategory({ 
                categoryName: categoryName.trim(),
                description: "Created via Bulk Import",
                active: true
            });
            
            const newId = newCat.id;
            existingCategoriesMap.set(lowerName, newId);
            return newId;
        }
    };

    // Helper: Cari ID Tag
    const resolveTagIds = async (tagString, existingTagsMap) => {
        if (!tagString) return [];
        
        const tagNames = tagString.split('|').map(t => t.trim()).filter(t => t !== '');
        const finalIds = [];

        for (const name of tagNames) {
            const lowerName = name.toLowerCase();
            let tagId = existingTagsMap.get(lowerName);

            if (tagId) {
                finalIds.push(tagId);
            } else {
                try {
                    const newTag = await createTag({ tagName: name });
                    const newId = newTag.id; 
                    existingTagsMap.set(lowerName, newId); 
                    finalIds.push(newId);
                } catch (err) {
                    console.error(`Gagal create tag ${name}`, err);
                }
            }
        }
        return finalIds;
    };

    // 2. Fungsi Proses Upload
    const handleUpload = () => {
        if (!file) return;

        setUploading(true);
        setProgress(0);
        setLogs([]);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data;
                const total = rows.length;
                let successCount = 0;
                let failCount = 0;
                let tempLogs = [];

                try {
                    // A. PRE-FETCH: Ambil Tags DAN Categories
                    const [tagsResult, catsResult] = await Promise.all([
                        getTags(1, 1000),
                        getCategories(1, 1000)
                    ]);

                    const tagsData = tagsResult.data || [];
                    const catsData = catsResult.data || [];
                    
                    // Buat Map (Kamus)
                    const tagMap = new Map();
                    tagsData.forEach(t => tagMap.set(t.tagName.toLowerCase(), t.id));

                    const catMap = new Map();
                    catsData.forEach(c => catMap.set(c.categoryName.toLowerCase(), c.id));

                    // B. LOOP INSERT
                    for (let i = 0; i < total; i++) {
                        const row = rows[i];
                        
                        try {
                            // 1. Resolve Category (Nama -> ID)
                            const categoryId = await resolveCategoryId(row.Category, catMap);

                            // 2. Resolve Tags (Nama -> IDs)
                            const tagIds = await resolveTagIds(row["Tags (Pisahkan dengan |)"], tagMap);

                            const payload = {
                                productName: row.ProductName,
                                categoryId: categoryId,
                                price: Number(row.Price),
                                stock: Number(row.Stock),
                                tagIds: tagIds,
                                active: true
                            };

                            if(!payload.productName) throw new Error("Nama Produk kosong");

                            await createProduct(payload);
                            
                            successCount++;
                            tempLogs.push({ status: 'success', msg: `Baris ${i+2}: ${payload.productName} - OK` });

                        } catch (error) {
                            console.error(error);
                            failCount++;
                            tempLogs.push({ status: 'error', msg: `Baris ${i+2}: ${row.ProductName || 'Baris '+ (i+2)} - Gagal: ${error.message}` });
                        }

                        // Update Progress
                        const percentage = Math.round(((i + 1) / total) * 100);
                        setProgress(percentage);
                    }
                } catch (globalError) {
                    tempLogs.push({ status: 'error', msg: `System Error: ${globalError.message}` });
                }

                setLogs(tempLogs);
                setUploading(false);

                Swal.fire({
                    icon: failCount === 0 ? 'success' : 'warning',
                    title: 'Proses Selesai',
                    text: `Berhasil: ${successCount}, Gagal: ${failCount}`,
                }).then(() => {
                    if (successCount > 0) onSuccess();
                    if (failCount === 0) onClose();
                });
            }
        });
    };

    return (
        <Dialog open={open} onClose={!uploading ? onClose : undefined} maxWidth="sm" fullWidth>
            <DialogTitle>Import Produk (Bulk Insert)</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Unduh template CSV, isi data produk. 
                        Untuk kolom <b>Tags</b>, isi dengan <b>Nama Tag</b> dipisah tanda pipa (|).
                        <br/>Contoh: <i>Premium|Diskon</i> (Jika tag belum ada, akan otomatis dibuatkan).
                    </Typography>
                    
                    <Button 
                        startIcon={<Download />} 
                        variant="outlined" 
                        size="small" 
                        onClick={handleDownloadTemplate}
                    >
                        Download Template CSV
                    </Button>
                </Box>

                <Box sx={{ p: 3, border: '2px dashed #ccc', borderRadius: 2, textAlign: 'center', backgroundColor: '#fafafa' }}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ display: 'none' }}
                        id="csv-upload-input"
                        disabled={uploading}
                    />
                    <label htmlFor="csv-upload-input">
                        <Button variant="contained" component="span" startIcon={<CloudUpload />} disabled={uploading}>
                            Pilih File CSV
                        </Button>
                    </label>
                    {file && <Typography sx={{ mt: 1, fontWeight: 'bold' }}>{file.name}</Typography>}
                </Box>

                {uploading && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="caption">Memproses... {progress}%</Typography>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                )}

                {/* Log Error Area (Jika ada yang gagal) */}
                {logs.length > 0 && !uploading && (
                    <Box sx={{ mt: 2, maxHeight: 150, overflow: 'auto', border: '1px solid #eee', borderRadius: 1 }}>
                        <List dense>
                            {logs.map((log, idx) => (
                                <ListItem key={idx}>
                                    <ListItemText 
                                        primary={log.msg} 
                                        primaryTypographyProps={{ 
                                            color: log.status === 'success' ? 'green' : 'red',
                                            fontSize: '0.8rem'
                                        }} 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={uploading}>Tutup</Button>
                <Button 
                    onClick={handleUpload} 
                    variant="contained" 
                    color="primary" 
                    disabled={!file || uploading}
                >
                    {uploading ? 'Mengupload...' : 'Mulai Import'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductImportDialog;
