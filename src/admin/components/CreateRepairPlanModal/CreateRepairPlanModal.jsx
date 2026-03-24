import { Modal, Input, Select, Button } from "antd";
import { useMemo, useState } from "react";
import { useRepairPlan } from "../../../context/RepairPlanContext";
import { useDevice } from "../../../context/DeviceContext";
import { useUser } from "../../../context/UserContext";
import { usePopup } from "../../../context/PopupContext";
import { useAuth } from "../../../context/AuthContext";

const { Option } = Select;
const { TextArea } = Input;

const CreateRepairPlanModal = ({ open, setOpen }) => {
  const { handleCreateRepairPlan } = useRepairPlan();
  const { deviceList, fetchDeviceList } = useDevice();
  const { userList, fetchUserList } = useUser();
  const { showPopup } = usePopup();
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    device_id: "",
    title: "",
    issue_description: "",
    priority: "medium",
    status: "assigned",
    assigned_technician_id: "",
    notes: "",
  });

  const technicianOptions = useMemo(() => {
    return (userList || []).filter(
      (user) => user.role === "technician" && user.status === "active"
    );
  }, [userList]);

  const handleOpenData = async () => {
    await Promise.all([fetchDeviceList(), fetchUserList()]);
  };

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
      issue_description: "",
      priority: "medium",
      status: "assigned",
      assigned_technician_id: "",
      notes: "",
    });
  };

  const handleSubmit = async () => {
    if (
      !form.device_id ||
      !form.title ||
      !form.issue_description ||
      !form.assigned_technician_id
    ) {
      showPopup(
        "Thiết bị, tiêu đề, mô tả lỗi và kỹ thuật viên là bắt buộc",
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
      issue_description: form.issue_description,
      priority: form.priority,
      status: form.status,
      assigned_technician_id: form.assigned_technician_id,
      created_by: currentUser._id,
      notes: form.notes || null,
    };

    const res = await handleCreateRepairPlan(payload);

    if (res?.EC === 0) {
      showPopup(res.EM || "Tạo yêu cầu sửa chữa thành công");
      setOpen(false);
      resetForm();
    } else {
      showPopup(res?.EM || "Tạo yêu cầu sửa chữa thất bại", false);
    }
  };

  return (
    <Modal
      title="Thêm yêu cầu sửa chữa"
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
            placeholder="Sửa chữa máy in Canon 2900"
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
          <label className="font-semibold mb-1 block">Mức độ ưu tiên</label>
          <Select
            value={form.priority}
            onChange={(value) => handleChange("priority", value)}
            className="w-full"
          >
            <Option value="low">Thấp</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="high">Cao</Option>
          </Select>
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
            <Option value="assigned">Đã phân công</Option>
            <Option value="in_progress">Đang sửa chữa</Option>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold mb-1 block">Mô tả lỗi</label>
          <TextArea
            rows={4}
            placeholder="Nhập mô tả lỗi của thiết bị..."
            value={form.issue_description}
            onChange={(e) => handleChange("issue_description", e.target.value)}
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

export default CreateRepairPlanModal;