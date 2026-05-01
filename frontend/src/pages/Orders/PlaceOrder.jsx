import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || error?.error || "Failed to place order");
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto px-4 py-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Order Items Table */}
            <div className="w-full lg:w-2/3 overflow-x-auto">
              <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-100 text-black">
                    <tr>
                      <th className="px-4 py-3 text-left">Image</th>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Quantity</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.cartItems.map((item, index) => {
                      // --- SMART IMAGE LOGIC ---
                      const imageSrc = item.image?.startsWith("http")
                        ? item.image
                        : "https://zenzloom-fg7a.onrender.com" + item.image;

                      return (
                        <tr key={index} className="border-t border-gray-700">
                          <td className="px-4 py-3">
                            <img
                              src={imageSrc} // Use the logic variable here
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              to={`/product/${item.product}`}
                              className="text-pink-500 hover:text-pink-600 font-medium"
                            >
                              {item.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-center text-white">
                            {item.qty}
                          </td>
                          <td className="px-4 py-3 text-right text-white">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-white font-semibold">
                            $ {(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg text-gray-300">
                    <span>Items</span>
                    <span className="font-semibold text-white">$ {cart.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-lg text-gray-300">
                    <span>Shipping</span>
                    <span className="font-semibold text-white">$ {cart.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between text-lg text-gray-300">
                    <span>Tax</span>
                    <span className="font-semibold text-white">$ {cart.taxPrice}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-2xl font-bold text-white">
                      <span>Total</span>
                      <span className="text-pink-500">${cart.totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Shipping Address</h3>
                  <p className="text-gray-400">
                    {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                    {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Payment Method</h3>
                  <p className="text-gray-400">{cart.paymentMethod}</p>
                </div>

                {error && (
                  <Message variant="danger">
                    {error?.data?.message || error?.error || "Failed to place order"}
                  </Message>
                )}

                <button
                  type="button"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-full text-lg font-semibold disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </button>

                {isLoading && <Loader />}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;