import AxiosInstance from "./AxiosInstance";

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await AxiosInstance.post("/auths/refresh", {
      refreshToken,
    });

    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Không thể làm mới access token",
        result: null,
      }
    );
  }
};