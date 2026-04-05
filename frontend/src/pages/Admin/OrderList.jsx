import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

// `embedded` prop = true when rendered inside AdminDashboard (skip AdminMenu + outer padding)
const OrderList = ({ embedded = false }) => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error.error}
      </Message>
    );

  const content = (
    <div className="overflow-x-auto">
      {!embedded && <h2 className="text-2xl font-bold mb-6 text-black">Order List</h2>}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full min-w-[700px] text-white">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Items</th>
              <th className="px-4 py-3 text-left text-sm">ID</th>
              <th className="px-4 py-3 text-left text-sm">User</th>
              <th className="px-4 py-3 text-left text-sm">Date</th>
              <th className="px-4 py-3 text-right text-sm">Total</th>
              <th className="px-4 py-3 text-center text-sm">Paid</th>
              <th className="px-4 py-3 text-center text-sm">Delivered</th>
              <th className="px-4 py-3 text-center text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50 hover:text-black transition-colors">
                <td className="px-4 py-3">
                  {order.orderItems.length > 0 && (
                    <img
                      src={"https://zenzloom-fg7a.onrender.com" + order.orderItems[0].image}
                      alt={order._id}
                      className="w-14 h-14 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  {order._id.substring(0, 8)}...
                </td>
                <td className="px-4 py-3 text-sm">{order.user ? order.user.username : "N/A"}</td>
                <td className="px-4 py-3 text-sm">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-sm">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${order.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${order.isDelivered ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Link to={`/order/${order._id}`} className="text-pink-600 hover:text-pink-700 font-semibold text-sm">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminMenu />
      {content}
    </div>
  );
};

export default OrderList;
