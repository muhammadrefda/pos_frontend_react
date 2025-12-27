import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTag } from '../../services/tagService';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Swal from 'sweetalert2';

const TagFormPage = () => {
    const navigate = useNavigate();
    const [tagName, setTagName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tagName.trim()) {
            Swal.fire('Warning', 'Nama Tag tidak boleh kosong.', 'warning');
            return;
        }

        try {
            await createTag({ tagName });
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Tag berhasil ditambahkan.',
            }).then(() => {
                navigate('/tags');
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal menyimpan tag.',
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8">
                <Header title="Overview" />

                <div className="p-6">
                    <div className="max-w-lg bg-white p-8 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Tambah Tag Baru</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Nama Tag</label>
                                <input 
                                    type="text" 
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)} 
                                    className="w-full border p-2 rounded focus:ring focus:ring-blue-200" 
                                    placeholder="Contoh: Promo, New Arrival"
                                    required 
                                />
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan</button>
                                <Link to="/tags" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Batal</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagFormPage;