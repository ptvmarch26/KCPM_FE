import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiLogOut } from "react-icons/fi";
import { MdDevices } from "react-icons/md";
import { GiAutoRepair } from "react-icons/gi";
import { useAuth } from "../../../context/AuthContext";

function SidebarComponent({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, handleLogout } = useAuth();

  const handleUserLogout = () => {
    handleLogout();
    toggleSidebar();
    navigate("/admin/login", { replace: true });
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FiHome size={20} />,
      allowedRoles: ["admin", "technician"],
    },
    {
      name: "Quản lý thiết bị",
      path: "/admin/devices",
      icon: <MdDevices size={20} />,
      allowedRoles: ["admin", "technician"],
    },
    {
      name: "Quản lý nhân viên",
      path: "/admin/users",
      icon: <FiUsers size={20} />,
      allowedRoles: ["admin"],
    },
    {
      name: "Quản lý bảo trì",
      path: "/admin/maintenances",
      icon: <GiAutoRepair size={20} />,
      allowedRoles: ["admin"],
    },
    {
      name: "Quản lý sửa chữa",
      path: "/admin/repairs",
      icon: <GiAutoRepair size={20} />,
      allowedRoles: ["admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(currentUser?.role)
  );

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
            {filteredMenuItems.map((item) => {
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
                onClick={handleUserLogout}
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