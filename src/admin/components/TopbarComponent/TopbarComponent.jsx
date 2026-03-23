import { FiMenu } from "react-icons/fi";
import { useLocation } from "react-router-dom";

function TopbarComponent({ adminName = "Admin", toggleSidebar }) {
  const location = useLocation();

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/users": "Quản lý nhân viên",
  };

  let currentPage = "Admin Panel";

  if (pageTitles[location.pathname]) {
    currentPage = pageTitles[location.pathname];
  } else if (location.pathname.startsWith("/admin/users/")) {
    currentPage = "Chi tiết người dùng";
  }

  return (
    <div className="fixed top-0 left-0 lg:left-[300px] right-0 z-30 h-16 bg-white shadow-md flex items-center justify-between px-3 lg:px-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-gray-700"
          onClick={toggleSidebar}
          type="button"
        >
          <FiMenu size={24} />
        </button>

        <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
          {currentPage}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
          {adminName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm lg:text-base text-gray-700">{adminName}</span>
      </div>
    </div>
  );
}

export default TopbarComponent;