import { useEffect, useMemo } from "react";
import { Card, Table, Tag } from "antd";
import {
  ToolOutlined,
  BuildOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useDevice } from "../../context/DeviceContext";
import { useMaintenancePlan } from "../../context/MaintenancePlanContext";
import { useRepairPlan } from "../../context/RepairPlanContext";

function DashboardPage() {
  const { deviceList, fetchDeviceList } = useDevice();
  const { maintenancePlanList, fetchMaintenancePlanList } =
    useMaintenancePlan();
  const { repairPlanList, fetchRepairPlanList } = useRepairPlan();

  useEffect(() => {
    fetchDeviceList();
    fetchMaintenancePlanList();
    fetchRepairPlanList();
  }, []);

  const dashboardStats = useMemo(() => {
    const totalDevices = deviceList?.length || 0;
    const activeDevices =
      deviceList?.filter((item) => item.status === "active").length || 0;
    const underMaintenanceDevices =
      deviceList?.filter((item) => item.status === "under_maintenance")
        .length || 0;
    const brokenDevices =
      deviceList?.filter((item) => item.status === "broken").length || 0;

    const totalMaintenancePlans = maintenancePlanList?.length || 0;
    const pendingMaintenancePlans =
      maintenancePlanList?.filter((item) => item.status === "pending").length ||
      0;
    const inProgressMaintenancePlans =
      maintenancePlanList?.filter((item) => item.status === "in_progress")
        .length || 0;
    const completedMaintenancePlans =
      maintenancePlanList?.filter((item) => item.status === "completed")
        .length || 0;

    const totalRepairPlans = repairPlanList?.length || 0;
    const assignedRepairPlans =
      repairPlanList?.filter((item) => item.status === "assigned").length || 0;
    const inProgressRepairPlans =
      repairPlanList?.filter((item) => item.status === "in_progress").length ||
      0;
    const completedRepairPlans =
      repairPlanList?.filter((item) => item.status === "completed").length || 0;

    return {
      totalDevices,
      activeDevices,
      underMaintenanceDevices,
      brokenDevices,
      totalMaintenancePlans,
      pendingMaintenancePlans,
      inProgressMaintenancePlans,
      completedMaintenancePlans,
      totalRepairPlans,
      assignedRepairPlans,
      inProgressRepairPlans,
      completedRepairPlans,
    };
  }, [deviceList, maintenancePlanList, repairPlanList]);

  const recentWorkHistory = useMemo(() => {
    const maintenanceHistory = (maintenancePlanList || [])
      .filter((item) => item.status === "completed")
      .map((item) => ({
        key: `maintenance-${item._id}`,
        work_type: "maintenance",
        title: item.title,
        device_name: item.device_id?.device_name || "—",
        technician_name:
          item.assigned_technician_id?.full_name ||
          item.assigned_technician_id?.username ||
          "—",
        result: item.result || "—",
        completed_at: item.completed_at,
      }));

    const repairHistory = (repairPlanList || [])
      .filter((item) => item.status === "completed")
      .map((item) => ({
        key: `repair-${item._id}`,
        work_type: "repair",
        title: item.title,
        device_name: item.device_id?.device_name || "—",
        technician_name:
          item.assigned_technician_id?.full_name ||
          item.assigned_technician_id?.username ||
          "—",
        result: item.repair_result || "—",
        completed_at: item.completed_at,
      }));

    return [...maintenanceHistory, ...repairHistory]
      .sort(
        (a, b) =>
          new Date(b.completed_at || 0).getTime() -
          new Date(a.completed_at || 0).getTime(),
      )
      .slice(0, 8);
  }, [maintenancePlanList, repairPlanList]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();

    const maintenanceTasks = (maintenancePlanList || [])
      .filter(
        (item) =>
          item.status !== "completed" &&
          item.scheduled_date &&
          new Date(item.scheduled_date) >= now,
      )
      .map((item) => ({
        key: `upcoming-maintenance-${item._id}`,
        type: "Bảo trì",
        title: item.title,
        device: item.device_id?.device_name || "—",
        date: item.scheduled_date,
        technician:
          item.assigned_technician_id?.full_name ||
          item.assigned_technician_id?.username ||
          "—",
      }));

    return maintenanceTasks
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [maintenancePlanList]);

  const expiringDevices = useMemo(() => {
    const now = new Date();
    const next30Days = new Date();
    next30Days.setDate(now.getDate() + 30);

    return (deviceList || [])
      .filter((item) => item.warranty_expiry)
      .filter((item) => {
        const expiry = new Date(item.warranty_expiry);
        return expiry >= now && expiry <= next30Days;
      })
      .sort(
        (a, b) =>
          new Date(a.warranty_expiry).getTime() -
          new Date(b.warranty_expiry).getTime(),
      )
      .slice(0, 5);
  }, [deviceList]);

  const recentWorkColumns = [
    {
      title: "Loại công việc",
      dataIndex: "work_type",
      key: "work_type",
      render: (value) =>
        value === "maintenance" ? (
          <Tag color="blue">Bảo trì</Tag>
        ) : (
          <Tag color="orange">Sửa chữa</Tag>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Thiết bị",
      dataIndex: "device_name",
      key: "device_name",
    },
    {
      title: "Kỹ thuật viên",
      dataIndex: "technician_name",
      key: "technician_name",
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      render: (value) => value || "—",
    },
    {
      title: "Hoàn thành lúc",
      dataIndex: "completed_at",
      key: "completed_at",
      render: (value) =>
        value ? new Date(value).toLocaleString("vi-VN") : "—",
    },
  ];

  return (
    <div className="space-y-6 bg-slate-50 min-h-screen p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm border-0 bg-blue-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-base">Tổng thiết bị</p>
              <h3 className="text-4xl font-bold mt-2">
                {dashboardStats.totalDevices}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <ToolOutlined className="text-2xl" />
            </div>
          </div>

          <div className="mt-4 space-y-1 text-sm text-slate-700">
            <p>Đang hoạt động: {dashboardStats.activeDevices}</p>
            <p>Đang bảo trì: {dashboardStats.underMaintenanceDevices}</p>
            <p>Hỏng: {dashboardStats.brokenDevices}</p>
          </div>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 ">
          <div className="flex items-start justify-between">
            <div>
              <p className=" text-base">Kế hoạch bảo trì</p>
              <h3 className="text-4xl font-bold mt-2">
                {dashboardStats.totalMaintenancePlans}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <BuildOutlined className="text-2xl" />
            </div>
          </div>

          <div className="mt-4 space-y-1 text-sm text-slate-700">
            <p>Chờ thực hiện: {dashboardStats.pendingMaintenancePlans}</p>
            <p>Đang thực hiện: {dashboardStats.inProgressMaintenancePlans}</p>
            <p>Hoàn thành: {dashboardStats.completedMaintenancePlans}</p>
          </div>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-rose-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-base">Yêu cầu sửa chữa</p>
              <h3 className="text-4xl font-bold mt-2">
                {dashboardStats.totalRepairPlans}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <WarningOutlined className="text-2xl" />
            </div>
          </div>

          <div className="mt-4 space-y-1 text-sm text-slate-700">
            <p>Đã phân công: {dashboardStats.assignedRepairPlans}</p>
            <p>Đang sửa chữa: {dashboardStats.inProgressRepairPlans}</p>
            <p>Hoàn thành: {dashboardStats.completedRepairPlans}</p>
          </div>
        </Card>

        <Card className="rounded-xl shadow-sm border-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-base">Tổng việc hoàn thành</p>
              <h3 className="text-4xl font-bold mt-2">
                {dashboardStats.completedMaintenancePlans +
                  dashboardStats.completedRepairPlans}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <CheckCircleOutlined className="text-2xl" />
            </div>
          </div>

          <div className="mt-4 space-y-1 text-sm text-slate-700">
            <p>Bảo trì xong: {dashboardStats.completedMaintenancePlans}</p>
            <p>Sửa chữa xong: {dashboardStats.completedRepairPlans}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card
          className="rounded-xl shadow-sm border-0"
          title={
            <div className="flex items-center gap-2 text-slate-800">
              <CalendarOutlined className="text-orange-500" />
              <span>Thiết bị sắp hết bảo hành</span>
            </div>
          }
        >
          {expiringDevices.length === 0 ? (
            <p className="text-slate-500">
              Không có thiết bị nào sắp hết bảo hành.
            </p>
          ) : (
            <div className="space-y-3">
              {expiringDevices.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b last:border-b-0 pb-2"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {item.device_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.location || "—"}
                    </p>
                  </div>
                  <Tag color="gold">
                    {new Date(item.warranty_expiry).toLocaleDateString("vi-VN")}
                  </Tag>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card
          className="rounded-xl shadow-sm border-0"
          title={
            <div className="flex items-center gap-2 text-slate-800">
              <ClockCircleOutlined className="text-blue-500" />
              <span>Công việc sắp tới</span>
            </div>
          }
        >
          {upcomingTasks.length === 0 ? (
            <p className="text-slate-500">Không có công việc sắp tới.</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between border-b last:border-b-0 pb-2"
                >
                  <div>
                    <p className="font-medium text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">
                      {item.device} • {item.technician}
                    </p>
                  </div>
                  <Tag color="blue">
                    {new Date(item.date).toLocaleDateString("vi-VN")}
                  </Tag>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">
          Công việc hoàn thành gần đây
        </h3>

        <Table
          dataSource={recentWorkHistory}
          columns={recentWorkColumns}
          pagination={false}
          rowKey="key"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
