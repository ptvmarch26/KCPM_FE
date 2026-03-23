import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiLogOut } from "react-icons/fi";

function SidebarComponent({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FiHome size={20} />,
    },
    {
      name: "Quản lý nhân viên",
      path: "/admin/users",
      icon: <FiUsers size={20} />,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[300px] bg-gray-900 text-white shadow-lg transition-transform duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <Link
            to="/admin/dashboard"
            className="text-2xl font-bold tracking-wide"
            onClick={toggleSidebar}
          >
            SE113
          </Link>
        </div>

        <nav className="p-3">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path} onClick={toggleSidebar}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-4 rounded-md transition-all duration-200 relative overflow-hidden
                    ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-800 text-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-0 h-full w-1 bg-blue-500 transition-opacity
                      ${isActive ? "opacity-100" : "opacity-0"}`}
                    />
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}

            <li className="pt-4">
              <button
                type="button"
                className="flex items-center gap-3 p-4 rounded-md transition-all duration-200 text-red-400 hover:bg-red-600 hover:text-white w-full"
              >
                <FiLogOut size={20} />
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default SidebarComponent;