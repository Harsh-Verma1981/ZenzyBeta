import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Rating from "./Rating";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import ProductTabs from "./Tabs";
import HeartIcon from "./HeartIcon";

const Product = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

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
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error.message}
      </Message>
    );

  // --- HYBRID IMAGE LOGIC ---
  const imageSrc = product.image.startsWith("http")
    ? product.image // Use Cloudinary directly
    : "https://zenzloom-fg7a.onrender.com" + product.image; // Fallback to local Render path

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
              src={imageSrc} // Updated to use the smart variable
              alt={product.name}
              className="w-full max-w-lg h-auto object-cover rounded-lg shadow-lg"
            />
            <HeartIcon product={product} />
          </div>
        </div>

        {/* ... (rest of the component info remains the same) */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h2>
          {/* ... Price, Brand, Stock info ... */}
          
          {/* ... Add to Cart Button ... */}
          <p className="text-4xl font-bold text-pink-600 mb-6">
            ${product.price}
          </p>

          {/* (Skipping static JSX for brevity, keep your original grid here) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
             {/* Brand, Added, Reviews, In Stock items... */}
          </div>

          {/* ... Quantity Select and Rating ... */}

          {product.countInStock > 0 ? (
            <button
              onClick={addToCartHandler}
              className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors"
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

export default Product;