import AxiosInstance from "./AxiosInstance";

export const createRepairPlan = async (planData) => {
  try {
    const response = await AxiosInstance.post("/repair-plans", planData);
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

export const getAllRepairPlans = async () => {
  try {
    const response = await AxiosInstance.get("/repair-plans");
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

export const getRepairPlanById = async (id) => {
  try {
    const response = await AxiosInstance.get(`/repair-plans/${id}`);
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

export const getRepairPlansByStatus = async (status) => {
  try {
    const response = await AxiosInstance.get(
      `/repair-plans/status/filter?status=${status}`
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

export const getRepairHistoryByDevice = async (deviceId) => {
  try {
    const response = await AxiosInstance.get(
      `/repair-plans/device/${deviceId}/history`
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

export const updateRepairPlan = async (id, planData) => {
  try {
    const response = await AxiosInstance.patch(`/repair-plans/${id}`, planData);
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

export const deleteRepairPlan = async (id) => {
  try {
    const response = await AxiosInstance.delete(`/repair-plans/${id}`);
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