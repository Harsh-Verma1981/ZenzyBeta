import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">Error loading products</Message>;

  return (
    <div className="flex flex-col gap-10 min-h-screen">
      {/* 1. Header Section (Checks keyword so it only shows on Home) */}
      {!keyword && (
        <section className="w-full px-4 lg:px-10">
          <Header />
        </section>
      )}

      {/* 2. Products Section */}
      <section className="w-full px-4 lg:px-10 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl lg:text-5xl font-bold text-white">
            Special Products
          </h1>
          <Link
            to="/shop"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full py-3 px-10 transition-all"
          >
            Shop All
          </Link>
        </div>

        {/* Responsive Grid - Fixes collision between items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.products.map((product) => (
            <div key={product._id} className="flex justify-center">
              <Product product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;