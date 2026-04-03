import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const App = () => {
//   return (
//     <div className="flex min-h-screen">
//       <ToastContainer />
//       {/* Sidebar: fixed width on desktop, off-canvas on mobile */}
//       <Navigation />
//       {/* Main content: offset by sidebar width on desktop */}
//       <main className="flex-1 lg:ml-64 min-w-0 py-3">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// src/App.jsx
const App = () => {
  return (
    <div className="flex min-h-screen bg-gray-950"> {/* Added a very dark base bg */}
      <ToastContainer />
      <Navigation />
      {/* Change bg-white or no-bg to bg-gray-900 or gray-950 */}
      <main className="flex-1 lg:ml-64 min-w-0 py-3 bg-gray-950 text-white"> 
        <Outlet />
      </main>
    </div>
  );
};

export default App;
