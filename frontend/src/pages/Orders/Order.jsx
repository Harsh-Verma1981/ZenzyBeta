import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetOrderDetailsQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useGetRazorpayKeyIdQuery,
  useDeliverOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [createRazorpayOrder, { isLoading: loadingRazorpayOrder }] =
    useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment, { isLoading: loadingVerification }] =
    useVerifyRazorpayPaymentMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { data: razorpayConfig, error: razorpayConfigError } =
    useGetRazorpayKeyIdQuery();

  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Load Razorpay Checkout script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    script.onerror = () => toast.error("Razorpay SDK failed to load");
    document.body.appendChild(script);
  }, []);

  // Handle payment
  const handlePayment = async () => {
    if (!order || order.isPaid) return;

    try {
      setIsPaymentProcessing(true);

      if (!razorpayConfig?.keyId) {
        toast.error("Razorpay Key ID is missing");
        setIsPaymentProcessing(false);
        return;
      }

      // 1. Create order on backend
      const result = await createRazorpayOrder({ orderId: order._id }).unwrap();

      // 2. FIX: Find the correct data "Box"
      const rzpData = result.order || result; 
      const actualOrderId = rzpData.id || rzpData.orderId;

      if (!actualOrderId) {
        throw new Error("Razorpay Order ID not found in server response");
      }

      const options = {
        key: razorpayConfig.keyId,
        amount: rzpData.amount * 100,// converting into cents
        currency: rzpData.currency || "USD",
        name: "ZENZLOOM STORE",
        description: `Order #${order._id}`,
        order_id: actualOrderId,
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              orderId: order._id,
              paymentData: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            }).unwrap();

            toast.success("Payment successful!");
            refetch();
          } catch (err) {
            toast.error(err?.data?.message || "Verification failed");
          } finally {
            setIsPaymentProcessing(false);
          }
        },
        prefill: {
          name: order.user?.username,
          email: order.user?.email,
        },
        theme: { color: "#e11d48" },
        modal: { ondismiss: () => setIsPaymentProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err?.data?.message || err.message || "Payment Failed");
      setIsPaymentProcessing(false);
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || "Delivery update failed");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Items Section */}
        <div className="w-full lg:w-2/3">
          <div className="bg-[#1A1A1A] rounded-lg shadow-md p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Order Details</h2>

            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-800 text-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left">Image</th>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Quantity</th>
                      <th className="px-4 py-3 text-right">Unit Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border border-gray-700" />
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/product/${item.product}`} className="text-pink-500 hover:underline">
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">{item.qty}</td>
                        <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">${(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-sm border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Shipping Info</h2>
            <div className="space-y-3 mb-6 text-sm text-gray-300">
              <p className="flex justify-between"><strong>Order ID:</strong> <span className="font-mono">{order._id}</span></p>
              <p className="flex justify-between"><strong>Name:</strong> <span>{order.user.username}</span></p>
              <p className="flex justify-between"><strong>Email:</strong> <span>{order.user.email}</span></p>
              <p className="flex justify-between"><strong>Address:</strong> <span className="text-right">{order.shippingAddress.address}, {order.shippingAddress.city}</span></p>
              <p className="flex justify-between"><strong>Payment:</strong> 
                <span className={order.isPaid ? "text-green-500" : "text-red-500 font-bold"}>
                  {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : "Not Paid"}
                </span>
              </p>
            </div>

            <h2 className="text-xl font-bold mb-4 border-t border-gray-700 pt-4">Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between"><span>Items</span><span className="font-semibold">${order.itemsPrice}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-semibold">${order.shippingPrice}</span></div>
              <div className="flex justify-between"><span>Tax</span><span className="font-semibold">${order.taxPrice}</span></div>
              <div className="flex justify-between text-xl font-bold text-pink-500 border-t border-gray-700 pt-3">
                <span>Total</span><span>${order.totalPrice}</span>
              </div>
            </div>

            {/* Actions */}
            {!order.isPaid && (
              <button
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-bold disabled:bg-gray-600 transition-colors"
                onClick={handlePayment}
                disabled={!isRazorpayLoaded || isPaymentProcessing}
              >
                {isPaymentProcessing ? "Processing..." : "Pay with Razorpay"}
              </button>
            )}

            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition-colors"
                onClick={deliverHandler}
                disabled={loadingDeliver}
              >
                {loadingDeliver ? "Updating..." : "Mark As Delivered"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;