import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.data?.error || error.error}
        </Message>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">You have no orders yet.</p>
          <Link to="/shop" className="text-pink-500 hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-white border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 text-left">IMAGE</th>
                <th className="py-3 text-left">ID</th>
                <th className="py-3 text-left">DATE</th>
                <th className="py-3 text-left">TOTAL</th>
                <th className="py-3 text-left">PAID</th>
                <th className="py-3 text-left">DELIVERED</th>
                <th className="py-3"></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                // --- SMART IMAGE LOGIC ---
                const firstItemImage = order.orderItems[0]?.image;
                const imageSrc = firstItemImage?.startsWith("http")
                  ? firstItemImage
                  : "https://zenzloom-fg7a.onrender.com" + firstItemImage;

                return (
                  <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-4">
                      <img
                        src={imageSrc}
                        alt={order._id}
                        className="w-[5rem] h-[5rem] object-cover rounded"
                      />
                    </td>

                    <td className="py-4 font-mono text-xs">{order._id}</td>
                    <td className="py-4 text-sm">
                      {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                    </td>
                    <td className="py-4 font-semibold">$ {order.totalPrice}</td>

                    <td className="py-4">
                      <div className={`p-1 text-center text-xs font-bold w-[6rem] rounded-full ${order.isPaid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {order.isPaid ? "Completed" : "Pending"}
                      </div>
                    </td>

                    <td className="py-4">
                      <div className={`p-1 text-center text-xs font-bold w-[6rem] rounded-full ${order.isDelivered ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {order.isDelivered ? "Completed" : "Pending"}
                      </div>
                    </td>

                    <td className="py-4 text-right">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded text-sm transition-colors">
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;