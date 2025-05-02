import { api } from "../api"; // assumes Axios instance is configured here

export const getMyRepayments = async () => {
  try {
    const response = await api.get("/repayment/my-repayments");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch repayments:", error);
    throw error;
  }
};
