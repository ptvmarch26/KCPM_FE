import { Modal, Input, Select, Button, DatePicker } from "antd";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useMaintenancePlan } from "../../../context/MaintenancePlanContext";
import { useDevice } from "../../../context/DeviceContext";
import { useUser } from "../../../context/UserContext";
import { usePopup } from "../../../context/PopupContext";
import { useAuth } from "../../../context/AuthContext";

const { Option } = Select;
const { TextArea } = Input;

const CreateMaintenancePlanModal = ({ open, setOpen }) => {
  const { handleCreateMaintenancePlan } = useMaintenancePlan();
  const { deviceList, fetchDeviceList } = useDevice();
  const { userList, fetchUserList } = useUser();
  const { showPopup } = usePopup();
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    device_id: "",
    title: "",
    description: "",
    scheduled_date: null,
    assigned_technician_id: "",
    status: "pending",
    notes: "",
  });

  const technicianOptions = useMemo(() => {
    return (userList || []).filter(
      (user) => user.role === "technician" && user.status === "active"
    );
  }, [userList]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      device_id: "",
      title: "",
      description: "",
      scheduled_date: null,
      assigned_technician_id: "",
      status: "pending",
      notes: "",
    });
  };

  const handleOpenData = async () => {
    await Promise.all([fetchDeviceList(), fetchUserList()]);
  };

  const handleSubmit = async () => {
    if (
      !form.device_id ||
      !form.title ||
      !form.scheduled_date ||
      !form.assigned_technician_id
    ) {
      showPopup(
        "Thiết bị, tiêu đề, ngày bảo trì và kỹ thuật viên là bắt buộc",
        false
      );
      return;
    }

    if (!currentUser?._id) {
      showPopup("Không xác định được người tạo, vui lòng đăng nhập lại", false);
      return;
    }

    const payload = {
      device_id: form.device_id,
      title: form.title,
      description: form.description || null,
      scheduled_date: form.scheduled_date
        ? dayjs(form.scheduled_date).toISOString()
        : null,
      assigned_technician_id: form.assigned_technician_id,
      created_by: currentUser._id,
      status: form.status,
      notes: form.notes || null,
    };

    const res = await handleCreateMaintenancePlan(payload);

    if (res?.EC === 0) {
      showPopup(res.EM || "Tạo kế hoạch bảo trì thành công");
      setOpen(false);
      resetForm();
    } else {
      showPopup(res?.EM || "Tạo kế hoạch bảo trì thất bại", false);
    }
  };

  return (
    <Modal
      title="Thêm kế hoạch bảo trì"
      open={open}
      onCancel={() => setOpen(false)}
      afterOpenChange={(isOpen) => {
        if (isOpen) handleOpenData();
      }}
      footer={null}
      width={850}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="font-semibold mb-1 block">Tiêu đề</label>
          <Input
            placeholder="Bảo trì định kỳ máy in Canon 2900"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Thiết bị</label>
          <Select
            value={form.device_id}
            onChange={(value) => handleChange("device_id", value)}
            className="w-full"
            placeholder="Chọn thiết bị"
            showSearch
            optionFilterProp="children"
          >
            {(deviceList || []).map((device) => (
              <Option key={device._id} value={device._id}>
                {device.device_name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="font-semibold mb-1 block">Ngày bảo trì</label>
          <DatePicker
            format="DD/MM/YYYY"
            className="w-full"
            value={form.scheduled_date}
            onChange={(date) => handleChange("scheduled_date", date)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Kỹ thuật viên</label>
          <Select
            value={form.assigned_technician_id}
            onChange={(value) => handleChange("assigned_technician_id", value)}
            className="w-full"
            placeholder="Chọn kỹ thuật viên"
            showSearch
            optionFilterProp="children"
          >
            {technicianOptions.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.full_name} - {user.username}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="font-semibold mb-1 block">Trạng thái</label>
          <Select
            value={form.status}
            onChange={(value) => handleChange("status", value)}
            className="w-full"
          >
            <Option value="pending">Chờ thực hiện</Option>
            <Option value="in_progress">Đang thực hiện</Option>
            <Option value="completed">Hoàn thành</Option>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold mb-1 block">Mô tả</label>
          <TextArea
            rows={4}
            placeholder="Nhập mô tả kế hoạch bảo trì..."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold mb-1 block">Ghi chú</label>
          <TextArea
            rows={3}
            placeholder="Nhập ghi chú..."
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={() => setOpen(false)}>Hủy</Button>
        <Button type="primary" onClick={handleSubmit}>
          Thêm
        </Button>
      </div>
    </Modal>
  );
};

export default CreateMaintenancePlanModal;