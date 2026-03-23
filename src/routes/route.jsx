import AdminLayout from "../admin/layout/AdminLayout";
import DashboardPage from "../admin/pages/DashboardPage";
import UserManagementPage from "../admin/pages/UserManagementPage";

const routes = [
  { path: "/admin/dashboard", element: <DashboardPage />, layout: AdminLayout },
  {
    path: "/admin/users",
    element: <UserManagementPage />,
    layout: AdminLayout,
  },
];

export default routes;
