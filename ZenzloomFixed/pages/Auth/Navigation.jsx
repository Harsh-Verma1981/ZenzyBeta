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
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      closeMobileMenu();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] bg-gray-900 text-white p-2 rounded-lg shadow-lg"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* ── Mobile backdrop ── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-[50]"
          onClick={closeMobileMenu}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 z-[55] h-screen w-64
          bg-gray-900 text-white flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Brand / Logo */}
        <div>
          <div className="px-6 py-5 border-b border-gray-700">
            <span className="text-2xl font-extrabold tracking-wide text-pink-500">
              Zenzloom
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 px-3 pt-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <AiOutlineHome size={22} />
              <span className="text-base font-medium">HOME</span>
            </Link>

            <Link
              to="/shop"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <AiOutlineShopping size={22} />
              <span className="text-base font-medium">SHOP</span>
            </Link>

            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <AiOutlineShoppingCart size={22} />
              <span className="text-base font-medium">Cart</span>
              {cartItems.length > 0 && (
                <span className="ml-auto bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            <Link
              to="/favorite"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaHeart size={18} className="text-pink-400" />
              <span className="text-base font-medium">Favorites</span>
              <FavoritesCount />
            </Link>
          </nav>
        </div>

        {/* ── User section ── */}
        <div className="px-3 pb-5 border-t border-gray-700 pt-4">
          {userInfo ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <span className="text-base font-semibold truncate">{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-2 flex-shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <ul className="absolute left-0 right-0 bottom-full mb-2 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200">
                  {userInfo.isAdmin && (
                    <>
                      {[
                        { to: "/admin/dashboard", label: "Dashboard" },
                        { to: "/admin/productlist", label: "Products" },
                        { to: "/admin/categorylist", label: "Category" },
                        { to: "/admin/orderlist", label: "Orders" },
                        { to: "/admin/userlist", label: "Users" },
                      ].map(({ to, label }) => (
                        <li key={to}>
                          <Link
                            to={to}
                            onClick={closeMobileMenu}
                            className="block px-4 py-2.5 hover:bg-pink-50 hover:text-pink-600 text-sm font-medium transition-colors"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                      <li><hr className="border-gray-100" /></li>
                    </>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="block px-4 py-2.5 hover:bg-pink-50 hover:text-pink-600 text-sm font-medium transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <AiOutlineLogin size={22} />
                <span className="text-base font-medium">LOGIN</span>
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <AiOutlineUserAdd size={22} />
                <span className="text-base font-medium">REGISTER</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navigation;
