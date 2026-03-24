import DashboardPage from "../admin/pages/DashboardPage";
import LoginPage from "../admin/pages/LoginPage";
import UserManagementPage from "../admin/pages/UserManagementPage";
import DeviceManagementPage from "../admin/pages/DeviceManagementPage";
import MaintenancePlanManagementPage from "../admin/pages/MaintenancePlanManagementPage";
import RepairPlanManagementPage from "../admin/pages/RepairPlanManagementPage";
import AdminLayout from "../admin/layout/AdminLayout";
import NotFoundPage from "../admin/pages/NotFoundPage";

const routes = [
  {
    path: "/admin/login",
    element: <LoginPage />,
    layout: null,
    isPrivate: false,
  },
  {
    path: "/admin/dashboard",
    element: <DashboardPage />,
    layout: AdminLayout,
    isPrivate: true,
    allowedRoles: ["admin", "technician"],
  },
  {
    path: "/admin/users",
    element: <UserManagementPage />,
    layout: AdminLayout,
    isPrivate: true,
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/devices",
    element: <DeviceManagementPage />,
    layout: AdminLayout,
    isPrivate: true,
    allowedRoles: ["admin", "technician"],
  },
  {
    path: "/admin/maintenances",
    element: <MaintenancePlanManagementPage />,
    layout: AdminLayout,
    isPrivate: true,
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/repairs",
    element: <RepairPlanManagementPage />,
    layout: AdminLayout,
    isPrivate: true,
    allowedRoles: ["admin"],
  },
  {
    path: "*",
    element: <NotFoundPage />,
    layout: null,
    isPrivate: false,
  },
];

export default routes;
