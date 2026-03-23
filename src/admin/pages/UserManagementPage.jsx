import { useEffect, useState } from "react";
import { Table, Input, Select, Button, Tag, Popconfirm, Space } from "antd";
import {
  ExportOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useUser } from "../../context/UserContext";
import CreateUserModal from "../components/CreateUserModal/CreateUserModal";
import EditUserModal from "../components/EditUserModal/EditUserModal";

const { Option } = Select;

function UserManagementPage() {
  const { userList, fetchUserList, handleDeleteUser } = useUser();

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    const res = await handleDeleteUser(id);

    if (res?.EC === 0) {
      alert(res.EM || "Xóa user thành công");
    } else {
      alert(res?.EM || "Xóa user thất bại");
    }
  };

  const filteredUsers = (userList || []).filter((user) => {
    const keyword = search.toLowerCase();

    const matchesSearch = search
      ? user.full_name?.toLowerCase().includes(keyword) ||
        user.username?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword)
      : true;

    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesStatus = filterStatus ? user.status === filterStatus : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleLabels = {
    admin: "Admin",
    technician: "Kỹ thuật viên",
  };

  const statusColors = {
    active: "green",
    inactive: "red",
  };

  const statusLabels = {
    active: "Hoạt động",
    inactive: "Ngưng hoạt động",
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "—",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => roleLabels[role] || role,
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
            title="Xóa user"
            description="Bạn có chắc muốn xóa user này không?"
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
            placeholder="Tìm kiếm theo họ tên, username, email..."
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
            Thêm nhân viên
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <Select
            placeholder="Lọc theo vai trò"
            value={filterRole}
            onChange={(value) => setFilterRole(value)}
            allowClear
            className="w-full lg:w-[250px]"
          >
            <Option value="admin">Admin</Option>
            <Option value="technician">Kỹ thuật viên</Option>
          </Select>

          <Select
            placeholder="Lọc theo trạng thái"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            allowClear
            className="w-full lg:w-[250px]"
          >
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Ngưng hoạt động</Option>
          </Select>
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <Table
          dataSource={filteredUsers}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
          scroll={{ x: "max-content" }}
        />
      </div>

      <CreateUserModal open={openCreate} setOpen={setOpenCreate} />

      {openEdit && selectedUser && (
        <EditUserModal
          key={selectedUser._id}
          open={openEdit}
          setOpen={setOpenEdit}
          editData={selectedUser}
        />
      )}
    </div>
  );
}

export default UserManagementPage;