import { createContext, useContext, useState } from "react";
import {
  getWorkHistoryByDevice,
  getWorkHistoryByTechnician,
} from "../services/api/WorkHistoryApi";

const WorkHistoryContext = createContext();

export const WorkHistoryProvider = ({ children }) => {
  const [workHistoryList, setWorkHistoryList] = useState([]);

  const fetchWorkHistoryByDevice = async (deviceId) => {
    const data = await getWorkHistoryByDevice(deviceId);
    setWorkHistoryList(data?.result || []);
    return data;
  };

  const fetchWorkHistoryByTechnician = async (technicianId) => {
    const data = await getWorkHistoryByTechnician(technicianId);
    setWorkHistoryList(data?.result || []);
    return data;
  };

  return (
    <WorkHistoryContext.Provider
      value={{
        workHistoryList,
        setWorkHistoryList,
        fetchWorkHistoryByDevice,
        fetchWorkHistoryByTechnician,
      }}
    >
      {children}
    </WorkHistoryContext.Provider>
  );
};

export const useWorkHistory = () => useContext(WorkHistoryContext);
