import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/shop"
            className="text-pink-600 hover:text-pink-700 font-semibold"
          >
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 p-4 rounded-lg bg-gray-800 shadow-sm"
              >
                <div className="w-full sm:w-20 h-20 flex-shrink-0">
                  <img
                    src={"https://zenzloom-fg7a.onrender.com" + item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-pink-600 hover:text-pink-700 font-semibold text-sm md:text-base"
                  >
                    {item.name}
                  </Link>
                  <div className="text-white text-sm mt-1">{item.brand}</div>
                  <div className="text-black font-bold text-base md:text-lg mt-1">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <select
                    className="w-full sm:w-20 p-2 border rounded text-black bg-white"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <button
                    className="text-red-500 hover:text-red-700 p-2"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                  <span className="font-semibold">
                    $
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">$ {cart.shippingPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold">$ {cart.taxPrice}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${cart.totalPrice}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
