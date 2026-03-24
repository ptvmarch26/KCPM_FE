import { Modal, Input, Select, Button, DatePicker } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useDevice } from "../../../context/DeviceContext";
import { usePopup } from "../../../context/PopupContext";

const { Option } = Select;
const { TextArea } = Input;

const CreateDeviceModal = ({ open, setOpen }) => {
  const { handleCreateDevice } = useDevice();
  const { showPopup } = usePopup();

  const [form, setForm] = useState({
    device_name: "",
    category: "",
    location: "",
    status: "active",
    purchase_date: null,
    warranty_expiry: null,
    manufacturer: "",
    notes: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      device_name: "",
      category: "",
      location: "",
      status: "active",
      purchase_date: null,
      warranty_expiry: null,
      manufacturer: "",
      notes: "",
    });
  };

  const handleSubmit = async () => {
    if (!form.device_name || !form.category || !form.location) {
      showPopup("Tên thiết bị, danh mục và vị trí là bắt buộc", false);
      return;
    }

    const payload = {
      device_name: form.device_name,
      category: form.category,
      location: form.location,
      status: form.status,
      purchase_date: form.purchase_date
        ? dayjs(form.purchase_date).toISOString()
        : null,
      warranty_expiry: form.warranty_expiry
        ? dayjs(form.warranty_expiry).toISOString()
        : null,
      manufacturer: form.manufacturer || null,
      notes: form.notes || null,
    };

    const res = await handleCreateDevice(payload);

    if (res?.EC === 0) {
      showPopup(res.EM || "Thêm thiết bị thành công");
      setOpen(false);
      resetForm();
    } else {
      showPopup(res?.EM || "Thêm thiết bị thất bại", false);
    }
  };

  return (
    <Modal
      title="Thêm thiết bị"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={800}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="font-semibold mb-1 block">Tên thiết bị</label>
          <Input
            placeholder="Máy in Canon 2900"
            value={form.device_name}
            onChange={(e) => handleChange("device_name", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Danh mục</label>
          <Input
            placeholder="Máy in"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Vị trí</label>
          <Input
            placeholder="Phòng kỹ thuật"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Trạng thái</label>
          <Select
            value={form.status}
            onChange={(value) => handleChange("status", value)}
            className="w-full"
          >
            <Option value="active">Đang hoạt động</Option>
            <Option value="under_maintenance">Đang bảo trì</Option>
            <Option value="broken">Hỏng</Option>
            <Option value="inactive">Ngưng hoạt động</Option>
          </Select>
        </div>

        <div>
          <label className="font-semibold mb-1 block">Nhà sản xuất</label>
          <Input
            placeholder="Canon"
            value={form.manufacturer}
            onChange={(e) => handleChange("manufacturer", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Ngày mua</label>
          <DatePicker
            format="DD/MM/YYYY"
            className="w-full"
            value={form.purchase_date ? dayjs(form.purchase_date) : null}
            onChange={(date) => handleChange("purchase_date", date)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Ngày hết bảo hành</label>
          <DatePicker
            format="DD/MM/YYYY"
            className="w-full"
            value={form.warranty_expiry ? dayjs(form.warranty_expiry) : null}
            onChange={(date) => handleChange("warranty_expiry", date)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold mb-1 block">Ghi chú</label>
          <TextArea
            rows={4}
            placeholder="Nhập ghi chú về thiết bị..."
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

export default CreateDeviceModal;
