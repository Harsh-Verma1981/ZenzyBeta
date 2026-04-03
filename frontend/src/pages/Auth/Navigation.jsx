import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setMobileMenuOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Navigation Sidebar */}
      <div
        className={`${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static lg:block bg-gray-900 text-white transition-transform duration-300 ease-in-out h-[100vh] w-64 p-4 flex flex-col justify-between z-50`}
        id="navigation-container"
      >
        {/* Navigation Links */}
        <div className="flex flex-col space-y-2 mt-16 lg:mt-0">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <AiOutlineHome size={24} className="mr-3" />
            <span className="text-lg">HOME</span>
          </Link>

          <Link
            to="/shop"
            onClick={closeMobileMenu}
            className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <AiOutlineShopping size={24} className="mr-3" />
            <span className="text-lg">SHOP</span>
          </Link>

          <Link
            to="/cart"
            onClick={closeMobileMenu}
            className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors relative"
          >
            <AiOutlineShoppingCart size={24} className="mr-3" />
            <span className="text-lg">Cart</span>
            {cartItems.length > 0 && (
              <span className="ml-auto bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          <Link
            to="/favorite"
            onClick={closeMobileMenu}
            className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors relative"
          >
            <FaHeart size={20} className="mr-3" />
            <span className="text-lg">Favorites</span>
            <FavoritesCount />
          </Link>
        </div>

        {/* User Section */}
        <div className="mt-auto">
          {userInfo ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg">{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <ul className="absolute left-0 right-0 bottom-full mb-2 space-y-2 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link
                          to="/admin/dashboard"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/productlist"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 hover:bg-gray-100"
                        >
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/categorylist"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 hover:bg-gray-100"
                        >
                          Category
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/orderlist"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/userlist"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 hover:bg-gray-100"
                        >
                          Users
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <AiOutlineLogin size={24} className="mr-3" />
                <span className="text-lg">LOGIN</span>
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <AiOutlineUserAdd size={24} className="mr-3" />
                <span className="text-lg">REGISTER</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
