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

  // Debug: Log state
  useEffect(() => {
    console.log("Order data:", order);
    console.log("Razorpay config:", razorpayConfig);
    console.log("Razorpay config error:", razorpayConfigError);
  }, [order, razorpayConfig, razorpayConfigError]);

  // Load Razorpay Checkout script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        if (window.Razorpay) {
          console.log("Razorpay already loaded");
          resolve(window.Razorpay);
          return;
        }

        console.log("Loading Razorpay script...");
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          console.log("Razorpay script loaded");
          resolve(window.Razorpay);
        };
        script.onerror = (err) => {
          console.error("Failed to load Razorpay script", err);
          reject(err);
        };
        document.head.appendChild(script);
      });
    };

    loadRazorpayScript()
      .then(() => setIsRazorpayLoaded(true))
      .catch((error) => {
        console.error("Failed to load Razorpay script:", error);
        toast.error("Failed to load payment gateway");
      });
  }, []);

  // Handle payment
  const handlePayment = async () => {
    if (!order || order.isPaid) {
      console.log("Order invalid or already paid:", order);
      return;
    }

    try {
      setIsPaymentProcessing(true);
      console.log("Initiating payment for order:", order._id);

      // Check Razorpay config
      if (!razorpayConfig?.keyId) {
        const errorMsg = "Razorpay not configured. Please check environment variables.";
        console.error(errorMsg);
        toast.error(errorMsg);
        setIsPaymentProcessing(false);
        return;
      }

      // Create Razorpay order on backend
      console.log("Calling createRazorpayOrder mutation...");
      const { data: razorpayOrder } = await createRazorpayOrder({
        orderId: order._id,
      }).unwrap();

      console.log("Razorpay order created:", razorpayOrder);

      // Razorpay checkout options
      const options = {
        key: razorpayConfig.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "ZENZOOM STORE",
        description: `Order #${order._id}`,
        order_id: razorpayOrder.orderId,
        handler: async (response) => {
          console.log("Payment response from Razorpay:", response);
          // Verify payment on backend
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
          } catch (error) {
            console.error("Verification error:", error);
            toast.error(
              error?.data?.message || "Payment verification failed"
            );
          } finally {
            setIsPaymentProcessing(false);
          }
        },
        prefill: {
          name: order.user?.username || "",
          email: order.user?.email || "",
        },
        theme: {
          color: "#e11d48",
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal dismissed");
            setIsPaymentProcessing(false);
          },
        },
      };

      console.log("Opening Razorpay checkout with options:", options);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error?.data?.message || error?.message || "Failed to create payment order");
      setIsPaymentProcessing(false);
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update delivery status");
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error?.error || "An error occurred while fetching order details"}
      </Message>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Order Details</h2>

            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">Image</th>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Quantity</th>
                      <th className="px-4 py-3 text-right">Unit Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-pink-600 hover:text-pink-700"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">{item.qty}</td>
                        <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
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
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="space-y-3 mb-6">
              <p className="flex justify-between">
                <strong className="text-pink-600">Order:</strong>{" "}
                <span className="font-mono">{order._id}</span>
              </p>
              <p className="flex justify-between">
                <strong className="text-pink-600">Name:</strong>{" "}
                <span>{order.user.username}</span>
              </p>
              <p className="flex justify-between">
                <strong className="text-pink-600">Email:</strong>{" "}
                <span>{order.user.email}</span>
              </p>
              <p className="flex justify-between">
                <strong className="text-pink-600">Address:</strong>{" "}
                <span>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </span>
              </p>
              <p className="flex justify-between">
                <strong className="text-pink-600">Method:</strong>{" "}
                <span>{order.paymentMethod}</span>
              </p>
              <div className="flex justify-between items-center">
                <strong className="text-pink-600">Payment Status:</strong>
                {order.isPaid ? (
                  <span className="text-green-600 font-semibold">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Not paid</span>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 mt-8">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-semibold">$ {order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">$ {order.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold">$ {order.taxPrice}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>$ {order.totalPrice}</span>
                </div>
              </div>
            </div>

            {!order.isPaid && (
              <div className="mt-6">
                {isPaymentProcessing || loadingRazorpayOrder ? (
                  <Loader />
                ) : (
                  <button
                    type="button"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-semibold disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors"
                    onClick={handlePayment}
                    disabled={!isRazorpayLoaded}
                  >
                    {isRazorpayLoaded ? "Pay with Razorpay" : "Loading..."}
                  </button>
                )}
                {razorpayConfigError && (
                  <p className="text-red-500 text-sm mt-2">
                    Razorpay config error. Check console.
                  </p>
                )}
              </div>
            )}

            {loadingVerification && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div className="mt-6">
                {loadingDeliver ? (
                  <Loader />
                ) : (
                  <button
                    type="button"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
