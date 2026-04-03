import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error.message}
      </Message>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-pink-600 hover:text-pink-700 font-semibold mb-6 inline-block">
        ← Go Back
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Product Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-lg h-auto object-cover rounded-lg shadow-lg"
            />
            <HeartIcon product={product} />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            {product.description}
          </p>

          <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-6">
            ${product.price.toFixed(2)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <FaStore className="text-pink-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-semibold">{product.brand}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <FaClock className="text-pink-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Added</p>
                <p className="font-semibold">{moment(product.createAt).fromNow()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <FaStar className="text-pink-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Reviews</p>
                <p className="font-semibold">{product.numReviews}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <FaBox className="text-pink-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="font-semibold">{product.countInStock}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <select
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="p-3 w-24 border rounded-lg bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={product.countInStock === 0}
            >
              {[...Array(product.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <Ratings
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>

          {product.countInStock > 0 ? (
            <button
              onClick={addToCartHandler}
              className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors"
            >
              Add To Cart
            </button>
          ) : (
            <p className="text-red-500 font-semibold">Out of Stock</p>
          )}
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <ProductTabs
          loadingProductReview={loadingProductReview}
          userInfo={userInfo}
          submitHandler={submitHandler}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          product={product}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
