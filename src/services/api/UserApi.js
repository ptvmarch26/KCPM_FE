import AxiosInstance from "./AxiosInstance";

export const loginUser = async (loginData) => {
  try {
    const response = await AxiosInstance.post("/users/login", loginData);
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

export const createUser = async (userData) => {
  try {
    const response = await AxiosInstance.post("/users", userData);
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

export const getAllUsers = async () => {
  try {
    const response = await AxiosInstance.get("/users");
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

export const getUserById = async (id) => {
  try {
    const response = await AxiosInstance.get(`/users/${id}`);
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

export const updateUser = async (id, userData) => {
  try {
    const response = await AxiosInstance.put(`/users/${id}`, userData);
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

export const deleteUser = async (id) => {
  try {
    const response = await AxiosInstance.delete(`/users/${id}`);
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
