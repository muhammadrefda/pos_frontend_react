import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import dashboardService from "../../services/dashboardService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaShoppingCart, FaMoneyBillWave, FaBoxOpen, FaUsers } from "react-icons/fa";

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    totalSalesToday: 0,
    totalTransactionsToday: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [salesChart, setSalesChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Execute all requests in parallel for better performance
        const [summaryRes, chartRes, topProductsRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getSalesChart(),
          dashboardService.getTopProducts(5),
        ]);

        if (summaryRes.data) setSummary(summaryRes.data);
        if (chartRes.data) setSalesChart(chartRes.data);
        if (topProductsRes.data) setTopProducts(topProductsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <Header title="Dashboard" />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Penjualan Hari Ini"
                value={formatCurrency(summary.totalSalesToday)}
                icon={<FaMoneyBillWave className="text-white text-2xl" />}
                color="bg-blue-500"
              />
              <SummaryCard
                title="Transaksi Hari Ini"
                value={`${summary.totalTransactionsToday} Order`}
                icon={<FaShoppingCart className="text-white text-2xl" />}
                color="bg-green-500"
              />
              <SummaryCard
                title="Total Produk"
                value={`${summary.totalProducts} Item`}
                icon={<FaBoxOpen className="text-white text-2xl" />}
                color="bg-orange-500"
              />
              <SummaryCard
                title="Total Pelanggan"
                value={`${summary.totalCustomers} Orang`}
                icon={<FaUsers className="text-white text-2xl" />}
                color="bg-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sales Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Grafik Penjualan (7 Hari Terakhir)
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesChart}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        labelStyle={{ color: "black" }}
                      />
                      <Bar dataKey="totalAmount" fill="#3B82F6" name="Total Penjualan" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Produk Terlaris
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-600">Produk</th>
                        <th className="text-right py-2 text-gray-600">Terjual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.length > 0 ? (
                        topProducts.map((product, index) => (
                          <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-3 text-sm text-gray-800 font-medium">
                              {product.productName}
                              <div className="text-xs text-gray-500 font-normal">
                                {formatCurrency(product.totalRevenue)}
                              </div>
                            </td>
                            <td className="py-3 text-right text-sm font-bold text-blue-600">
                              {product.totalQuantitySold}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="py-4 text-center text-gray-500">
                            Belum ada data penjualan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center border-l-4 border-transparent hover:border-gray-200 transition-all">
      <div className={`p-4 rounded-full ${color} mr-4 shadow-sm`}>{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default DashboardPage;