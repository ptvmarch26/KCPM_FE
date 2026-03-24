import { createContext, useContext, useState } from "react";
import {
  createRepairPlan,
  getAllRepairPlans,
  getRepairPlanById,
  getRepairPlansByStatus,
  getRepairHistoryByDevice,
  updateRepairPlan,
  deleteRepairPlan,
} from "../services/api/RepairPlanApi";

const RepairPlanContext = createContext();

export const RepairPlanProvider = ({ children }) => {
  const [repairPlanList, setRepairPlanList] = useState([]);
  const [repairPlanDetail, setRepairPlanDetail] = useState(null);
  const [repairHistoryList, setRepairHistoryList] = useState([]);

  const fetchRepairPlanList = async () => {
    const data = await getAllRepairPlans();
    setRepairPlanList(data?.result || []);
    return data;
  };

  const fetchRepairPlanDetail = async (id) => {
    const data = await getRepairPlanById(id);

    if (data?.EC === 0) {
      setRepairPlanDetail(data.result);
    }

    return data;
  };

  const fetchRepairPlansByStatus = async (status) => {
    const data = await getRepairPlansByStatus(status);
    return data;
  };

  const fetchRepairHistoryByDevice = async (deviceId) => {
    const data = await getRepairHistoryByDevice(deviceId);
    setRepairHistoryList(data?.result || []);
    return data;
  };

  const handleCreateRepairPlan = async (planData) => {
    const data = await createRepairPlan(planData);

    if (data?.EC === 0) {
      await fetchRepairPlanList();
    }

    return data;
  };

  const handleUpdateRepairPlan = async (id, planData) => {
    const data = await updateRepairPlan(id, planData);

    if (data?.EC === 0) {
      setRepairPlanList((prev) =>
        prev.map((plan) => (plan._id === id ? data.result : plan))
      );

      if (repairPlanDetail?._id === id) {
        setRepairPlanDetail(data.result);
      }
    }

    return data;
  };

  const handleDeleteRepairPlan = async (id) => {
    const data = await deleteRepairPlan(id);

    if (data?.EC === 0) {
      setRepairPlanList((prev) => prev.filter((plan) => plan._id !== id));

      if (repairPlanDetail?._id === id) {
        setRepairPlanDetail(null);
      }
    }

    return data;
  };

  return (
    <RepairPlanContext.Provider
      value={{
        repairPlanList,
        repairPlanDetail,
        repairHistoryList,
        setRepairPlanList,
        setRepairPlanDetail,
        setRepairHistoryList,
        fetchRepairPlanList,
        fetchRepairPlanDetail,
        fetchRepairPlansByStatus,
        fetchRepairHistoryByDevice,
        handleCreateRepairPlan,
        handleUpdateRepairPlan,
        handleDeleteRepairPlan,
      }}
    >
      {children}
    </RepairPlanContext.Provider>
  );
};

export const useRepairPlan = () => useContext(RepairPlanContext);