import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCustomer } from '../../services/customerService';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Swal from 'sweetalert2';

const CustomerFormPage = () => {
    const navigate = useNavigate();

    // State Form
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            /* 
               Payload harus sesuai dengan CustomerCreateDto di Backend:
               {
                   FullName: "...",
                   PhoneNumber: "...",
                   Email: "..."
               }
            */
            const payload = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                email: formData.email
            };

            await createCustomer(payload);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Pelanggan berhasil disimpan.',
                showConfirmButton: true,
            }).then(() => {
                navigate('/customers');
            });

        } catch (error) {
            console.error(error);
            // Tampilkan pesan error spesifik jika ada
            const msg = error.response?.data?.message || error.message || 'Gagal menyimpan pelanggan.';
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: msg,
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8">
                <Header title="Overview" />
                <div className="p-6">
                    <div className="max-w-lg bg-white p-8 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Tambah Pelanggan Baru</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                                <input type="text" name="fullName" onChange={handleChange} className="w-full border p-2 rounded" placeholder="Sesuai KTP..." required />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">No. Telepon</label>
                                <input type="text" name="phoneNumber" onChange={handleChange} className="w-full border p-2 rounded" placeholder="08..." required />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input type="email" name="email" onChange={handleChange} className="w-full border p-2 rounded" placeholder="nama@email.com" required />
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan</button>
                                <Link to="/customers" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Batal</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerFormPage;
