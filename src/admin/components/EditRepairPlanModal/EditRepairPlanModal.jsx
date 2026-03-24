import { Modal, Input, Select, Button } from "antd";
import { useMemo, useState } from "react";
import { useRepairPlan } from "../../../context/RepairPlanContext";
import { useUser } from "../../../context/UserContext";
import { usePopup } from "../../../context/PopupContext";

const { Option } = Select;
const { TextArea } = Input;

const EditRepairPlanModal = ({ open, setOpen, editData }) => {
  const { handleUpdateRepairPlan } = useRepairPlan();
  const { userList, fetchUserList } = useUser();
  const { showPopup } = usePopup();

  const [form, setForm] = useState({
    title: editData?.title || "",
    issue_description: editData?.issue_description || "",
    priority: editData?.priority || "medium",
    status: editData?.status || "assigned",
    assigned_technician_id:
      editData?.assigned_technician_id?._id ||
      editData?.assigned_technician_id ||
      "",
    repair_result: editData?.repair_result || "",
    cost: editData?.cost || 0,
    notes: editData?.notes || "",
    status_before: editData?.status_before || "",
    status_after: editData?.status_after || "",
  });

  const technicianOptions = useMemo(() => {
    return (userList || []).filter(
      (user) => user.role === "technician" && user.status === "active"
    );
  }, [userList]);

  const handleOpenData = async () => {
    await fetchUserList();
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.issue_description ||
      !form.assigned_technician_id
    ) {
      showPopup(
        "Tiêu đề, mô tả lỗi và kỹ thuật viên là bắt buộc",
        false
      );
      return;
    }

    const payload = {
      title: form.title,
      issue_description: form.issue_description,
      priority: form.priority,
      status: form.status,
      assigned_technician_id: form.assigned_technician_id,
      repair_result: form.repair_result || null,
      cost: Number(form.cost) || 0,
      notes: form.notes || null,
      status_before: form.status_before || null,
      status_after: form.status_after || null,
    };

    const res = await handleUpdateRepairPlan(editData._id, payload);

    if (res?.EC === 0) {
      showPopup(res.EM || "Cập nhật yêu cầu sửa chữa thành công");
      setOpen(false);
    } else {
      showPopup(res?.EM || "Cập nhật yêu cầu sửa chữa thất bại", false);
    }
  };

  return (
    <Modal
      title="Cập nhật yêu cầu sửa chữa"
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

        <div className="md:col-span-2">
          <label className="font-semibold mb-1 block">Mô tả lỗi</label>
          <TextArea
            rows={4}
            placeholder="Nhập mô tả lỗi của thiết bị..."
            value={form.issue_description}
            onChange={(e) => handleChange("issue_description", e.target.value)}
          />
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
          <label className="font-semibold mb-1 block">Trạng thái</label>
          <Select
            value={form.status}
            onChange={(value) => handleChange("status", value)}
            className="w-full"
          >
            <Option value="assigned">Đã phân công</Option>
            <Option value="in_progress">Đang sửa chữa</Option>
            <Option value="completed">Hoàn thành</Option>
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
          <label className="font-semibold mb-1 block">Chi phí</label>
          <Input
            type="number"
            placeholder="0"
            value={form.cost}
            onChange={(e) => handleChange("cost", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Kết quả sửa chữa</label>
          <Input
            placeholder="Nhập kết quả sửa chữa"
            value={form.repair_result}
            onChange={(e) => handleChange("repair_result", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Tình trạng trước</label>
          <Input
            placeholder="Nhập tình trạng trước sửa chữa"
            value={form.status_before}
            onChange={(e) => handleChange("status_before", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Tình trạng sau</label>
          <Input
            placeholder="Nhập tình trạng sau sửa chữa"
            value={form.status_after}
            onChange={(e) => handleChange("status_after", e.target.value)}
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

export default EditRepairPlanModal;