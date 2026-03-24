import { useEffect, useState } from "react";
import { Table, Input, Select, Button, Tag, Popconfirm, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDevice } from "../../context/DeviceContext";
import { usePopup } from "../../context/PopupContext";
import CreateDeviceModal from "../components/CreateDeviceModal/CreateDeviceModal";
import EditDeviceModal from "../components/EditDeviceModal/EditDeviceModal";

const { Option } = Select;

function DeviceManagementPage() {
  const { deviceList, fetchDeviceList, handleDeleteDevice } = useDevice();
  const { showPopup } = usePopup();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchDeviceList();
  }, []);

  const handleOpenEdit = (device) => {
    setSelectedDevice(device);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    const res = await handleDeleteDevice(id);

    if (res?.EC === 0) {
      showPopup(res.EM || "Xóa thiết bị thành công");
    } else {
      showPopup(res?.EM || "Xóa thiết bị thất bại", false);
    }
  };

  const categoryOptions = [
    ...new Set((deviceList || []).map((d) => d.category).filter(Boolean)),
  ];

  const filteredDevices = (deviceList || []).filter((device) => {
    const keyword = search.toLowerCase();

    const matchesSearch = search
      ? device.device_name?.toLowerCase().includes(keyword) ||
        device.category?.toLowerCase().includes(keyword) ||
        device.location?.toLowerCase().includes(keyword) ||
        device.manufacturer?.toLowerCase().includes(keyword)
      : true;

    const matchesStatus = filterStatus ? device.status === filterStatus : true;
    const matchesCategory = filterCategory
      ? device.category === filterCategory
      : true;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusColors = {
    active: "green",
    under_maintenance: "gold",
    broken: "red",
    inactive: "default",
  };

  const statusLabels = {
    active: "Đang hoạt động",
    under_maintenance: "Đang bảo trì",
    broken: "Hỏng",
    inactive: "Ngưng hoạt động",
  };

  const columns = [
    {
      title: "Tên thiết bị",
      dataIndex: "device_name",
      key: "device_name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Nhà sản xuất",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render: (manufacturer) => manufacturer || "—",
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
    },
    {
      title: "Ngày mua",
      dataIndex: "purchase_date",
      key: "purchase_date",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "—",
    },
    {
      title: "Hết bảo hành",
      dataIndex: "warranty_expiry",
      key: "warranty_expiry",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "—",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : "—"),
    },
    {
      title: "Hành động",
      key: "action",
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
            title="Xóa thiết bị"
            description="Bạn có chắc muốn xóa thiết bị này không?"
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
            placeholder="Tìm kiếm theo tên thiết bị, danh mục, vị trí, nhà sản xuất..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-none"
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="rounded-none"
            onClick={() => setOpenCreate(true)}
          >
            Thêm thiết bị
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <Select
            placeholder="Lọc theo danh mục"
            value={filterCategory}
            onChange={(value) => setFilterCategory(value)}
            allowClear
            className="w-full lg:w-[250px]"
          >
            {categoryOptions.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Lọc theo trạng thái"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            allowClear
            className="w-full lg:w-[250px]"
          >
            <Option value="active">Đang hoạt động</Option>
            <Option value="under_maintenance">Đang bảo trì</Option>
            <Option value="broken">Hỏng</Option>
            <Option value="inactive">Ngưng hoạt động</Option>
          </Select>
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <Table
          dataSource={filteredDevices}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
          scroll={{ x: "max-content" }}
        />
      </div>

      <CreateDeviceModal open={openCreate} setOpen={setOpenCreate} />

      {openEdit && selectedDevice && (
        <EditDeviceModal
          key={selectedDevice._id}
          open={openEdit}
          setOpen={setOpenEdit}
          editData={selectedDevice}
        />
      )}
    </div>
  );
}

export default DeviceManagementPage;
