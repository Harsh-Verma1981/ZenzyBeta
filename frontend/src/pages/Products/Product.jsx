import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
// import {BASE_URL}  from "../../config.js";

const Product = ({ product }) => {
  return (
    <div className="w-full p-3">
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4 bg-gray-800 text-white">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center text-white">
            <div className="font-semibold text-lg truncate">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
