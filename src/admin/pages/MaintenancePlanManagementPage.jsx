import { useEffect, useMemo, useState } from "react";
import { Table, Input, Select, Button, Tag, Popconfirm, Space } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMaintenancePlan } from "../../context/MaintenancePlanContext";
import { usePopup } from "../../context/PopupContext";
import CreateMaintenancePlanModal from "../components/CreateMaintenancePlanModal/CreateMaintenancePlanModal";
import EditMaintenancePlanModal from "../components/EditMaintenancePlanModal/EditMaintenancePlanModal";

const { Option } = Select;

function MaintenancePlanManagementPage() {
  const {
    maintenancePlanList,
    fetchMaintenancePlanList,
    handleDeleteMaintenancePlan,
  } = useMaintenancePlan();

  const { showPopup } = usePopup();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterTechnician, setFilterTechnician] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchMaintenancePlanList();
  }, []);

  const technicianOptions = useMemo(() => {
    const map = new Map();

    (maintenancePlanList || []).forEach((plan) => {
      const tech = plan.assigned_technician_id;
      if (tech?._id) {
        map.set(tech._id, tech.full_name || tech.username || "Không rõ");
      }
    });

    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [maintenancePlanList]);

  const filteredPlans = (maintenancePlanList || []).filter((plan) => {
    const keyword = search.trim().toLowerCase();

    const matchesSearch = keyword
      ? plan.title?.toLowerCase().includes(keyword) ||
        plan.description?.toLowerCase().includes(keyword) ||
        plan.device_id?.device_name?.toLowerCase().includes(keyword) ||
        plan.assigned_technician_id?.full_name?.toLowerCase().includes(keyword) ||
        plan.assigned_technician_id?.username?.toLowerCase().includes(keyword)
      : true;

    const matchesStatus = filterStatus ? plan.status === filterStatus : true;
    const matchesTechnician = filterTechnician
      ? plan.assigned_technician_id?._id === filterTechnician
      : true;

    return matchesSearch && matchesStatus && matchesTechnician;
  });

  const handleOpenEdit = (plan) => {
    setSelectedPlan(plan);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    const res = await handleDeleteMaintenancePlan(id);

    if (res?.EC === 0) {
      showPopup(res.EM || "Xóa kế hoạch bảo trì thành công");
    } else {
      showPopup(res?.EM || "Xóa kế hoạch bảo trì thất bại", false);
    }
  };

  const statusColors = {
    pending: "default",
    in_progress: "processing",
    completed: "success",
  };

  const statusLabels = {
    pending: "Chờ thực hiện",
    in_progress: "Đang thực hiện",
    completed: "Hoàn thành",
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 220,
    },
    {
      title: "Thiết bị",
      dataIndex: "device_id",
      key: "device_id",
      render: (device) => device?.device_name || "—",
      width: 180,
    },
    {
      title: "Kỹ thuật viên",
      dataIndex: "assigned_technician_id",
      key: "assigned_technician_id",
      render: (tech) => tech?.full_name || tech?.username || "—",
      width: 180,
    },
    {
      title: "Ngày bảo trì",
      dataIndex: "scheduled_date",
      key: "scheduled_date",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "—",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {statusLabels[status] || status}
        </Tag>
      ),
      width: 150,
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      render: (value) => value || "—",
      width: 200,
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (value) => value || "—",
      width: 220,
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa kế hoạch bảo trì"
            description="Bạn có chắc muốn xóa kế hoạch bảo trì này không?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="space-y-3 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <Input
            placeholder="Tìm theo tiêu đề, thiết bị, kỹ thuật viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
          >
            Thêm kế hoạch bảo trì
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <Select
            placeholder="Lọc theo trạng thái"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            allowClear
            className="w-full lg:w-[220px]"
          >
            <Option value="pending">Chờ thực hiện</Option>
            <Option value="in_progress">Đang thực hiện</Option>
            <Option value="completed">Hoàn thành</Option>
          </Select>

          <Select
            placeholder="Lọc theo kỹ thuật viên"
            value={filterTechnician}
            onChange={(value) => setFilterTechnician(value)}
            allowClear
            className="w-full lg:w-[260px]"
          >
            {technicianOptions.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <Table
          dataSource={filteredPlans}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <CreateMaintenancePlanModal open={openCreate} setOpen={setOpenCreate} />

      {openEdit && selectedPlan && (
        <EditMaintenancePlanModal
          key={selectedPlan._id}
          open={openEdit}
          setOpen={setOpenEdit}
          editData={selectedPlan}
        />
      )}
    </div>
  );
}

export default MaintenancePlanManagementPage;