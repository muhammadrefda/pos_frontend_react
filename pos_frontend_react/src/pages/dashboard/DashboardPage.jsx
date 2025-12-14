const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard POS</h1>
        <p className="text-gray-600">
          Selamat datang, Ini adalah halaman Dashboard.
        </p>
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout (Dummy)
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;