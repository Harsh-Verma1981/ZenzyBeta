import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <h1 className="text-white text-center">ERROR</h1>;

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full px-2">
      {/* 1. SMALL PRODUCTS GRID */}
      {/* Changed 'hidden' to 'flex' and used grid logic to show them on all screens */}
      <div className="w-full xl:w-[45%] order-2 xl:order-1">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-4">
          {data.map((product) => (
            <div key={product._id} className="flex justify-center">
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN CAROUSEL */}
      <div className="w-full xl:w-[55%] order-1 xl:order-2">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;