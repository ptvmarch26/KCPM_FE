import AxiosInstance from "./AxiosInstance";

export const createDevice = async (deviceData) => {
  try {
    const response = await AxiosInstance.post("/devices", deviceData);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi kết nối đến server",
        result: null,
      }
    );
  }
};

export const getAllDevices = async () => {
  try {
    const response = await AxiosInstance.get("/devices");
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi kết nối đến server",
        result: [],
      }
    );
  }
};

export const getDeviceById = async (id) => {
  try {
    const response = await AxiosInstance.get(`/devices/${id}`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi kết nối đến server",
        result: null,
      }
    );
  }
};

export const updateDevice = async (id, deviceData) => {
  try {
    const response = await AxiosInstance.patch(`/devices/${id}`, deviceData);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi kết nối đến server",
        result: null,
      }
    );
  }
};

export const deleteDevice = async (id) => {
  try {
    const response = await AxiosInstance.delete(`/devices/${id}`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi kết nối đến server",
        result: null,
      }
    );
  }
};
