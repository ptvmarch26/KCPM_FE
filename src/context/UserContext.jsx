import { createContext, useContext, useState } from "react";
import {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/api/UserApi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [userDetail, setUserDetail] = useState(null);

  const fetchUserList = async () => {
    const data = await getAllUsers();
    setUserList(data?.result || []);
    return data;
  };

  const fetchUserDetail = async (id) => {
    const data = await getUserById(id);

    if (data?.EC === 0) {
      setUserDetail(data.result);
    }

    return data;
  };

  const handleCreateUser = async (userData) => {
    const data = await createUser(userData);

    if (data?.EC === 0) {
      await fetchUserList();
    }

    return data;
  };

  const handleUpdateUser = async (id, userData) => {
    const data = await updateUser(id, userData);

    if (data?.EC === 0) {
      setUserList((prev) =>
        prev.map((user) => (user._id === id ? data.result : user)),
      );

      if (userDetail?._id === id) {
        setUserDetail(data.result);
      }
    }

    return data;
  };

  const handleDeleteUser = async (id) => {
    const data = await deleteUser(id);

    if (data?.EC === 0) {
      setUserList((prev) => prev.filter((user) => user._id !== id));

      if (userDetail?._id === id) {
        setUserDetail(null);
      }
    }

    return data;
  };

  const handleLogin = async (loginData) => {
    const data = await loginUser(loginData);
    return data;
  };

  return (
    <UserContext.Provider
      value={{
        userList,
        userDetail,
        setUserList,
        setUserDetail,
        fetchUserList,
        fetchUserDetail,
        handleCreateUser,
        handleUpdateUser,
        handleDeleteUser,
        handleLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
