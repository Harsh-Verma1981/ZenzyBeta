import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

// Fallback sample data so the chart never appears empty
const SAMPLE_DATES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const SAMPLE_SALES = [1200, 1900, 1500, 2800, 2200, 3565];

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        toolbar: { show: false },
        background: "transparent",
        fontFamily: "inherit",
      },
      tooltip: { theme: "light" },
      colors: ["#e11d48"],
      dataLabels: { enabled: true },
      stroke: { curve: "smooth", width: 3 },
      title: { text: "Sales Trend", align: "left", style: { fontSize: "16px", fontWeight: "700" } },
      grid: { borderColor: "#e5e7eb" },
      markers: { size: 6 },
      xaxis: {
        categories: SAMPLE_DATES,
        title: { text: "Date" },
      },
      yaxis: {
        title: { text: "Sales (USD)" },
        min: 0,
        labels: { formatter: (val) => `$${val.toLocaleString()}` },
      },
      legend: { position: "top", horizontalAlign: "right" },
    },
    series: [{ name: "Sales", data: SAMPLE_SALES }],
  });

  useEffect(() => {
    if (salesDetail && salesDetail.length > 0) {
      const dates = salesDetail.map((item) => String(item._id));
      const salesValues = salesDetail.map((item) => Number(item.totalSales));

      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: { ...prev.options.xaxis, categories: dates },
        },
        series: [{ name: "Sales", data: salesValues }],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="px-4 py-6 mt-2">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Sales</p>
                  <h2 className="text-3xl font-bold text-white">
                    {isLoading ? <Loader /> : `$${sales?.totalSales?.toFixed(2) || "0.00"}`}
                  </h2>
                </div>
                <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  $
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Customers</p>
                  <h2 className="text-3xl font-bold text-white">
                    {loading ? <Loader /> : customers?.length || 0}
                  </h2>
                </div>
                <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  #
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                  <h2 className="text-3xl font-bold text-white">
                    {loadingTwo ? <Loader /> : orders?.totalOrders || 0}
                  </h2>
                </div>
                <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  📦
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="overflow-x-auto">
              <Chart
                options={state.options}
                series={state.series}
                type="line"
                height={350}
                width="100%"
              />
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
            <OrderList embedded />
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
