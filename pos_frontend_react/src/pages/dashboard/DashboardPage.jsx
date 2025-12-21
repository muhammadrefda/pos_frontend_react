import Sidebar from "../../components/Sidebar";

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Bagian Kiri: SIdebar */}
      <Sidebar />


      {/* Bagian: Konten Utama */}
      <div className="flex-1 p-8">
        <header className="bg-white shadow p-4 rounded mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Halo, Admin</span>
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm">Total Penjualan</h3>
            <p className="text-2xl font-bold">Rp 15.000.000</p>
          </div>
          <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm">Total Transaksi</h3>
            <p className="text-2xl font-bold">120 Order</p>
          </div>
          <div className="bg-white p-6 rounded shadow border-l-4 border-orange-500">
            <h3 className="text-gray-500 text-sm">Produk Terlaris</h3>
            <p className="text-2xl font-bold">Kopi Susu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

