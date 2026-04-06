import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

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
      {!embedded && <h2 className="text-2xl font-bold mb-6 text-white">Order List</h2>}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto border border-gray-700">
        <table className="w-full min-w-[700px] text-white">
          <thead className="bg-gray-700 text-pink-500">
            <tr>
              <th className="px-4 py-3 text-left text-sm uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-left text-sm uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-sm uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-sm uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-right text-sm uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-center text-sm uppercase tracking-wider">Paid</th>
              <th className="px-4 py-3 text-center text-sm uppercase tracking-wider">Delivered</th>
              <th className="px-4 py-3 text-center text-sm uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {orders.map((order) => {
              // --- SMART IMAGE LOGIC ---
              // Pulls the image from the first item in the order
              const firstItemImage = order.orderItems[0]?.image;
              const imageSrc = firstItemImage?.startsWith("http")
                ? firstItemImage
                : "https://zenzloom-fg7a.onrender.com" + firstItemImage;

              return (
                <tr key={order._id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    {order.orderItems.length > 0 && (
                      <img
                        src={imageSrc} // Updated to use smart logic
                        alt={order._id}
                        className="w-14 h-14 object-cover rounded border border-gray-600"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm">{order.user ? order.user.username : "N/A"}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-sm text-pink-500">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link to={`/order/${order._id}`} className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors">
                      Details
                    </Link>
                  </td>
                </tr>
              );
            })}
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