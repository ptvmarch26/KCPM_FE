import { createContext, useContext, useState } from "react";
import {
  createMaintenancePlan,
  getAllMaintenancePlans,
  getUpcomingMaintenancePlans,
  getMaintenancePlanById,
  updateMaintenancePlan,
  deleteMaintenancePlan,
} from "../services/api/MaintenancePlanApi";

const MaintenancePlanContext = createContext();

export const MaintenancePlanProvider = ({ children }) => {
  const [maintenancePlanList, setMaintenancePlanList] = useState([]);
  const [maintenancePlanDetail, setMaintenancePlanDetail] = useState(null);
  const [upcomingMaintenancePlanList, setUpcomingMaintenancePlanList] = useState([]);

  const fetchMaintenancePlanList = async () => {
    const data = await getAllMaintenancePlans();
    setMaintenancePlanList(data?.result || []);
    return data;
  };

  const fetchUpcomingMaintenancePlanList = async () => {
    const data = await getUpcomingMaintenancePlans();
    setUpcomingMaintenancePlanList(data?.result || []);
    return data;
  };

  const fetchMaintenancePlanDetail = async (id) => {
    const data = await getMaintenancePlanById(id);

    if (data?.EC === 0) {
      setMaintenancePlanDetail(data.result);
    }

    return data;
  };

  const handleCreateMaintenancePlan = async (planData) => {
    const data = await createMaintenancePlan(planData);

    if (data?.EC === 0) {
      await fetchMaintenancePlanList();
      await fetchUpcomingMaintenancePlanList();
    }

    return data;
  };

  const handleUpdateMaintenancePlan = async (id, planData) => {
    const data = await updateMaintenancePlan(id, planData);

    if (data?.EC === 0) {
      setMaintenancePlanList((prev) =>
        prev.map((plan) => (plan._id === id ? data.result : plan))
      );

      setUpcomingMaintenancePlanList((prev) =>
        prev.map((plan) => (plan._id === id ? data.result : plan))
      );

      if (maintenancePlanDetail?._id === id) {
        setMaintenancePlanDetail(data.result);
      }
    }

    return data;
  };

  const handleDeleteMaintenancePlan = async (id) => {
    const data = await deleteMaintenancePlan(id);

    if (data?.EC === 0) {
      setMaintenancePlanList((prev) => prev.filter((plan) => plan._id !== id));
      setUpcomingMaintenancePlanList((prev) =>
        prev.filter((plan) => plan._id !== id)
      );

      if (maintenancePlanDetail?._id === id) {
        setMaintenancePlanDetail(null);
      }
    }

    return data;
  };

  return (
    <MaintenancePlanContext.Provider
      value={{
        maintenancePlanList,
        maintenancePlanDetail,
        upcomingMaintenancePlanList,
        setMaintenancePlanList,
        setMaintenancePlanDetail,
        setUpcomingMaintenancePlanList,
        fetchMaintenancePlanList,
        fetchUpcomingMaintenancePlanList,
        fetchMaintenancePlanDetail,
        handleCreateMaintenancePlan,
        handleUpdateMaintenancePlan,
        handleDeleteMaintenancePlan,
      }}
    >
      {children}
    </MaintenancePlanContext.Provider>
  );
};

export const useMaintenancePlan = () => useContext(MaintenancePlanContext);