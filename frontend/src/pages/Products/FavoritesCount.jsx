// src/pages/Products/FavoritesCount.jsx
import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  // If there are no favorites, don't render anything
  if (favoriteCount === 0) {
    return null;
  }

  // ONLY return the number, no wrapping div/span or styles here
  return <>{favoriteCount}</>;
};

export default FavoritesCount;