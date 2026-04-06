import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="w-full max-w-full overflow-hidden"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => {
              // --- SMART IMAGE LOGIC FOR CAROUSEL ---
              const imageSrc = image.startsWith("http")
                ? image // Cloudinary URL
                : "https://zenzloom-fg7a.onrender.com" + image; // Local Render Path

              return (
                <div key={_id} className="px-2">
                  <img
                    src={imageSrc} // Updated to use the smart variable
                    alt={name}
                    className="w-full rounded-lg object-cover h-[20rem] md:h-[30rem]"
                  />

                  {/* Container for text details */}
                  <div className="mt-4 flex flex-col lg:flex-row justify-between gap-4">
                    
                    {/* Left Column: Name and Description */}
                    <div className="w-full lg:w-1/2">
                      <h2 className="text-xl font-bold text-white mb-2">{name}</h2>
                      <p className="text-pink-500 font-semibold mb-4">$ {price}</p>
                      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                        {description.substring(0, 150)}...
                      </p>
                    </div>

                    {/* Right Column: Icons/Stats */}
                    <div className="w-full lg:w-1/2 grid grid-cols-2 gap-2 text-sm text-gray-300">
                      <div className="space-y-4">
                        <h1 className="flex items-center">
                          <FaStore className="mr-2 text-pink-500" /> Brand: {brand}
                        </h1>
                        <h1 className="flex items-center">
                          <FaClock className="mr-2 text-pink-500" /> Added:{" "}
                          {moment(createdAt).fromNow()}
                        </h1>
                        <h1 className="flex items-center">
                          <FaStar className="mr-2 text-pink-500" /> Reviews: {numReviews}
                        </h1>
                      </div>

                      <div className="space-y-4">
                        <h1 className="flex items-center">
                          <FaStar className="mr-2 text-pink-500" /> Rating: {Math.round(rating)}
                        </h1>
                        <h1 className="flex items-center">
                          <FaShoppingCart className="mr-2 text-pink-500" /> Qty: {quantity}
                        </h1>
                        <h1 className="flex items-center">
                          <FaBox className="mr-2 text-pink-500" /> In Stock: {countInStock}
                        </h1>
                      </div>
                    </div>

                  </div>
                </div>
              );
            }
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;