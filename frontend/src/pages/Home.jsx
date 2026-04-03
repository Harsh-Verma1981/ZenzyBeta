import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Message variant="danger">
          {isError?.data?.message || isError?.error || "Failed to load products"}
        </Message>
      </div>
    );
  }

  // Handle different response structures
  const products = data?.products || data || [];

  return (
    <>
      {!keyword ? <Header /> : null}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left">
            {keyword ? `Search results for: "${keyword}"` : "Special Products"}
          </h1>
          {!keyword && (
            <Link
              to="/shop"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
              Shop All Products
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl mb-4">No products found</p>
            {keyword && (
              <Link
                to="/shop"
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                Browse all products
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
