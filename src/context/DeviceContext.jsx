import { createContext, useContext, useState } from "react";
import {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
} from "../services/api/DeviceApi";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [deviceList, setDeviceList] = useState([]);
  const [deviceDetail, setDeviceDetail] = useState(null);

  const fetchDeviceList = async () => {
    const data = await getAllDevices();
    setDeviceList(data?.result || []);
    return data;
  };

  const fetchDeviceDetail = async (id) => {
    const data = await getDeviceById(id);

    if (data?.EC === 0) {
      setDeviceDetail(data.result);
    }

    return data;
  };

  const handleCreateDevice = async (deviceData) => {
    const data = await createDevice(deviceData);

    if (data?.EC === 0) {
      await fetchDeviceList();
    }

    return data;
  };

  const handleUpdateDevice = async (id, deviceData) => {
    const data = await updateDevice(id, deviceData);

    if (data?.EC === 0) {
      setDeviceList((prev) =>
        prev.map((device) => (device._id === id ? data.result : device)),
      );

      if (deviceDetail?._id === id) {
        setDeviceDetail(data.result);
      }
    }

    return data;
  };

  const handleDeleteDevice = async (id) => {
    const data = await deleteDevice(id);

    if (data?.EC === 0) {
      setDeviceList((prev) => prev.filter((device) => device._id !== id));

      if (deviceDetail?._id === id) {
        setDeviceDetail(null);
      }
    }

    return data;
  };

  return (
    <DeviceContext.Provider
      value={{
        deviceList,
        deviceDetail,
        setDeviceList,
        setDeviceDetail,
        fetchDeviceList,
        fetchDeviceDetail,
        handleCreateDevice,
        handleUpdateDevice,
        handleDeleteDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
