import AxiosInstance from "./AxiosInstance";

export const getWorkHistoryByDevice = async (deviceId) => {
  try {
    const response = await AxiosInstance.get(
      `/work-history/device/${deviceId}`,
    );
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

export const getWorkHistoryByTechnician = async (technicianId) => {
  try {
    const response = await AxiosInstance.get(
      `/work-history/technician/${technicianId}`,
    );
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
