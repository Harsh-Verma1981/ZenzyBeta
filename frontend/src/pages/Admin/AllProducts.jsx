import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500 p-4">Error loading products</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 lg:px-[9rem]">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4 p-3">
            <div className="text-2xl font-bold mb-6 text-white">
              All Products ({products.length})
            </div>

            <div className="flex flex-col gap-4">
              {products.map((product) => {
                // --- SMART IMAGE LOGIC ---
                const imageSrc = product.image.startsWith("http")
                  ? product.image
                  : "https://zenzloom-fg7a.onrender.com" + product.image;

                return (
                  <Link
                    key={product._id}
                    to={`/admin/product/update/${product._id}`}
                    className="block overflow-hidden bg-gray-800 rounded-lg border border-gray-700 hover:border-pink-600 transition-all shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <img
                        src={imageSrc} // Using the smart variable
                        alt={product.name}
                        className="w-full sm:w-[12rem] h-[10rem] object-cover"
                      />
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-xl font-semibold text-white">
                              {product?.name}
                            </h5>
                            <p className="text-gray-400 text-xs">
                              {moment(product.createdAt).format("MMMM Do YYYY")}
                            </p>
                          </div>

                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {product?.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors">
                            Update Product
                            <svg
                              className="w-3.5 h-3.5 ml-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </span>
                          <p className="text-pink-500 font-bold text-lg">
                            $ {product?.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="md:w-1/4 p-3 mt-2">
            <AdminMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;