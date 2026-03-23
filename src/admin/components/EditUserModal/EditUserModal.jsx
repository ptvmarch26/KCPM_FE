import { Modal, Input, Select, Button } from "antd";
import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { usePopup } from "../../../context/PopupContext";

const { Option } = Select;

const EditUserModal = ({ open, setOpen, editData }) => {
  const { handleUpdateUser } = useUser();
  const { showPopup } = usePopup();

  const [form, setForm] = useState({
    full_name: editData?.full_name || "",
    username: editData?.username || "",
    email: editData?.email || "",
    password: "",
    role: editData?.role || "technician",
    status: editData?.status || "active",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.full_name || !form.username || !form.role) {
      showPopup("Họ tên, tên đăng nhập và vai trò là bắt buộc", false);
      return;
    }

    const payload = {
      full_name: form.full_name,
      username: form.username,
      email: form.email || null,
      role: form.role,
      status: form.status,
    };

    if (form.password) {
      payload.password = form.password;
    }

    const res = await handleUpdateUser(editData._id, payload);

    if (res?.EC === 0) {
      showPopup(res.EM || "Cập nhật user thành công");
      setOpen(false);
    } else {
      showPopup(res?.EM || "Cập nhật thất bại", false);
    }
  };

  return (
    <Modal
      title="Cập nhật nhân viên"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={700}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="font-semibold mb-1 block">Họ và tên</label>
          <Input
            placeholder="Nguyễn Văn A"
            value={form.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Tên đăng nhập</label>
          <Input
            placeholder="nguyenvana"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Email</label>
          <Input
            placeholder="example@gmail.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">
            Mật khẩu mới (không bắt buộc)
          </label>
          <Input.Password
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Vai trò</label>
          <Select
            value={form.role}
            onChange={(value) => handleChange("role", value)}
            className="w-full"
          >
            <Option value="admin">Admin</Option>
            <Option value="technician">Kỹ thuật viên</Option>
          </Select>
        </div>

        <div>
          <label className="font-semibold mb-1 block">Trạng thái</label>
          <Select
            value={form.status}
            onChange={(value) => handleChange("status", value)}
            className="w-full"
          >
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Ngưng hoạt động</Option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={() => setOpen(false)}>Hủy</Button>
        <Button type="primary" onClick={handleSubmit}>
          Cập nhật
        </Button>
      </div>
    </Modal>
  );
};

export default EditUserModal;
