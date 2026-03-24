import { useEffect, useMemo, useState } from "react";
import { Table, Input, Select, Button, Tag, Popconfirm, Space } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRepairPlan } from "../../context/RepairPlanContext";
import { usePopup } from "../../context/PopupContext";
import CreateRepairPlanModal from "../components/CreateRepairPlanModal/CreateRepairPlanModal";
import EditRepairPlanModal from "../components/EditRepairPlanModal/EditRepairPlanModal";

const { Option } = Select;

function RepairPlanManagementPage() {
  const { repairPlanList, fetchRepairPlanList, handleDeleteRepairPlan } =
    useRepairPlan();
  const { showPopup } = usePopup();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterPriority, setFilterPriority] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchRepairPlanList();
  }, []);

  const filteredPlans = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return (repairPlanList || []).filter((plan) => {
      const matchesSearch = keyword
        ? plan.title?.toLowerCase().includes(keyword) ||
          plan.issue_description?.toLowerCase().includes(keyword) ||
          plan.device_id?.device_name?.toLowerCase().includes(keyword) ||
          plan.assigned_technician_id?.full_name?.toLowerCase().includes(keyword) ||
          plan.assigned_technician_id?.username?.toLowerCase().includes(keyword)
        : true;

      const matchesStatus = filterStatus ? plan.status === filterStatus : true;
      const matchesPriority = filterPriority
        ? plan.priority === filterPriority
        : true;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [repairPlanList, search, filterStatus, filterPriority]);

  const handleOpenEdit = (plan) => {
    setSelectedPlan(plan);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    const res = await handleDeleteRepairPlan(id);

    if (res?.EC === 0) {
      showPopup(res.EM || "Xóa yêu cầu sửa chữa thành công");
    } else {
      showPopup(res?.EM || "Xóa yêu cầu sửa chữa thất bại", false);
    }
  };

  const statusColors = {
    new: "default",
    assigned: "processing",
    in_progress: "warning",
    completed: "success",
  };

  const statusLabels = {
    new: "Mới tạo",
    assigned: "Đã phân công",
    in_progress: "Đang sửa chữa",
    completed: "Hoàn thành",
  };

  const priorityColors = {
    low: "green",
    medium: "gold",
    high: "red",
  };

  const priorityLabels = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
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
      title: "Mô tả lỗi",
      dataIndex: "issue_description",
      key: "issue_description",
      render: (value) => value || "—",
      width: 260,
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag color={priorityColors[priority] || "default"}>
          {priorityLabels[priority] || priority}
        </Tag>
      ),
      width: 120,
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
      title: "Kỹ thuật viên",
      dataIndex: "assigned_technician_id",
      key: "assigned_technician_id",
      render: (tech) => tech?.full_name || tech?.username || "—",
      width: 180,
    },
    {
      title: "Chi phí",
      dataIndex: "cost",
      key: "cost",
      render: (cost) =>
        cost !== undefined && cost !== null
          ? Number(cost).toLocaleString("vi-VN")
          : "0",
      width: 120,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : "—"),
      width: 180,
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 220,
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
            title="Xóa yêu cầu sửa chữa"
            description="Bạn có chắc muốn xóa yêu cầu sửa chữa này không?"
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
            placeholder="Tìm theo tiêu đề, thiết bị, mô tả lỗi, kỹ thuật viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
          >
            Thêm yêu cầu sửa chữa
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
            <Option value="new">Mới tạo</Option>
            <Option value="assigned">Đã phân công</Option>
            <Option value="in_progress">Đang sửa chữa</Option>
            <Option value="completed">Hoàn thành</Option>
          </Select>

          <Select
            placeholder="Lọc theo ưu tiên"
            value={filterPriority}
            onChange={(value) => setFilterPriority(value)}
            allowClear
            className="w-full lg:w-[220px]"
          >
            <Option value="low">Thấp</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="high">Cao</Option>
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

      <CreateRepairPlanModal open={openCreate} setOpen={setOpenCreate} />

      {openEdit && selectedPlan && (
        <EditRepairPlanModal
          key={selectedPlan._id}
          open={openEdit}
          setOpen={setOpenEdit}
          editData={selectedPlan}
        />
      )}
    </div>
  );
}

export default RepairPlanManagementPage;