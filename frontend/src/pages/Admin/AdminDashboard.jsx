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

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#e11d48"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#e5e7eb",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales (USD)",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        offsetY: -25,
        offsetX: -5,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail && salesDetail.length > 0) {
      const dates = salesDetail.map((item) => String(item._id));
      const salesValues = salesDetail.map((item) => Number(item.totalSales));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: dates,
          },
        },
        series: [
          {
            name: "Sales",
            data: salesValues,
          },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-0 mt-6">
        <div className="container mx-auto px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Sales</p>
                  <h2 className="text-2xl font-bold text-white">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      `$${sales?.totalSales?.toFixed(2) || "0.00"}`
                    )}
                  </h2>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  $
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Customers</p>
                  <h2 className="text-2xl font-bold text-white">
                    {loading ? <Loader /> : customers?.length || 0}
                  </h2>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  #
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                  <h2 className="text-2xl font-bold text-white">
                    {loadingTwo ? <Loader /> : orders?.totalOrders || 0}
                  </h2>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  📦
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Sales Trend</h2>
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
            <OrderList />
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
