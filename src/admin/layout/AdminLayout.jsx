import { useState } from "react";
import { ConfigProvider } from "antd";
import SidebarComponent from "../components/SidebarComponent/SidebarComponent";
import TopbarComponent from "../components/TopbarComponent/TopbarComponent";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: { borderRadius: 0 },
          Card: { borderRadius: 0 },
          Modal: { borderRadius: 0 },
        },
        token: {
          borderRadius: 0,
        },
      }}
    >
      <div className="min-h-screen bg-[#f5f5f5]">
        <SidebarComponent
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <TopbarComponent
          adminName="Admin"
          toggleSidebar={toggleSidebar}
        />

        <main className="pt-20 px-4 lg:px-6 lg:ml-[300px]">
          {children}
        </main>
      </div>
    </ConfigProvider>
  );
}

export default AdminLayout;