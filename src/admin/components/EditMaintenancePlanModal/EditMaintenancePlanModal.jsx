import { Modal, Input, Select, Button, DatePicker } from "antd";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useMaintenancePlan } from "../../../context/MaintenancePlanContext";
import { useDevice } from "../../../context/DeviceContext";
import { useUser } from "../../../context/UserContext";
import { usePopup } from "../../../context/PopupContext";

const { Option } = Select;
const { TextArea } = Input;

const EditMaintenancePlanModal = ({ open, setOpen, editData }) => {
  const { handleUpdateMaintenancePlan } = useMaintenancePlan();
  const { deviceList, fetchDeviceList } = useDevice();
  const { userList, fetchUserList } = useUser();
  const { showPopup } = usePopup();

  const [form, setForm] = useState({
    device_id: editData?.device_id?._id || editData?.device_id || "",
    title: editData?.title || "",
    description: editData?.description || "",
    scheduled_date: editData?.scheduled_date ? dayjs(editData.scheduled_date) : null,
    assigned_technician_id:
      editData?.assigned_technician_id?._id ||
      editData?.assigned_technician_id ||
      "",
    status: editData?.status || "pending",
    result: editData?.result || "",
    notes: editData?.notes || "",
    completed_at: editData?.completed_at ? dayjs(editData.completed_at) : null,
    cost: editData?.cost || 0,
    status_before: editData?.status_before || "",
    status_after: editData?.status_after || "",
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

  const handleSubmit = async () => {
    if (!form.title || !form.scheduled_date || !form.assigned_technician_id) {
      showPopup("Tiêu đề, ngày bảo trì và kỹ thuật viên là bắt buộc", false);
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
      status: form.status,
      result: form.result || null,
      notes: form.notes || null,
      completed_at: form.completed_at
        ? dayjs(form.completed_at).toISOString()
        : null,
      cost: Number(form.cost) || 0,
      status_before: form.status_before || null,
      status_after: form.status_after || null,
    };

    const res = await handleUpdateMaintenancePlan(editData._id, payload);

    if (res?.EC === 0) {
      showPopup(res.EM || "Cập nhật kế hoạch bảo trì thành công");
      setOpen(false);
    } else {
      showPopup(res?.EM || "Cập nhật kế hoạch bảo trì thất bại", false);
    }
  };

  return (
    <Modal
      title="Cập nhật kế hoạch bảo trì"
      open={open}
      onCancel={() => setOpen(false)}
      afterOpenChange={(isOpen) => {
        if (isOpen) handleOpenData();
      }}
      footer={null}
      width={900}
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
            disabled
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

        <div>
          <label className="font-semibold mb-1 block">Kết quả</label>
          <Input
            placeholder="Nhập kết quả bảo trì"
            value={form.result}
            onChange={(e) => handleChange("result", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Chi phí</label>
          <Input
            type="number"
            placeholder="0"
            value={form.cost}
            onChange={(e) => handleChange("cost", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Tình trạng trước</label>
          <Input
            placeholder="Nhập tình trạng trước bảo trì"
            value={form.status_before}
            onChange={(e) => handleChange("status_before", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Tình trạng sau</label>
          <Input
            placeholder="Nhập tình trạng sau bảo trì"
            value={form.status_after}
            onChange={(e) => handleChange("status_after", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Thời gian hoàn thành</label>
          <DatePicker
            format="DD/MM/YYYY"
            className="w-full"
            value={form.completed_at}
            onChange={(date) => handleChange("completed_at", date)}
          />
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
          Cập nhật
        </Button>
      </div>
    </Modal>
  );
};

export default EditMaintenancePlanModal;