import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  // --- SMART IMAGE LOGIC ---
  // If product.image starts with http, use it directly (Cloudinary).
  // Otherwise, attach the Render backend URL (Local storage).
  const imageSrc = product.image?.startsWith("http")
    ? product.image
    : "https://zenzloom-fg7a.onrender.com" + product.image;

  return (
    <div className="w-[20rem] ml-[2rem] p-3">
      <div className="relative">
        <img
          src={imageSrc} // Use the calculated variable here
          alt={product.name}
          className="h-auto rounded w-full object-cover"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-white">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;