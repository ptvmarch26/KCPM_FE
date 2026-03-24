import AxiosInstance from "./AxiosInstance";

export const createMaintenancePlan = async (planData) => {
  try {
    const response = await AxiosInstance.post("/maintenance-plans", planData);
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

export const getAllMaintenancePlans = async () => {
  try {
    const response = await AxiosInstance.get("/maintenance-plans");
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

export const getUpcomingMaintenancePlans = async () => {
  try {
    const response = await AxiosInstance.get("/maintenance-plans/upcoming/list");
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

export const getMaintenancePlanById = async (id) => {
  try {
    const response = await AxiosInstance.get(`/maintenance-plans/${id}`);
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

export const updateMaintenancePlan = async (id, planData) => {
  try {
    const response = await AxiosInstance.patch(`/maintenance-plans/${id}`, planData);
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

export const deleteMaintenancePlan = async (id) => {
  try {
    const response = await AxiosInstance.delete(`/maintenance-plans/${id}`);
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