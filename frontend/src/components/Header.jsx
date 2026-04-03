import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="flex flex-col xl:flex-row justify-around items-center p-4">
        <div className="hidden xl:block w-full xl:w-1/3 mb-4 xl:mb-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full xl:w-1/2">
          <ProductCarousel />
        </div>
      </div>
    </>
  );
};

export default Header;
