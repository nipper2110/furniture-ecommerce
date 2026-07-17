import api from "@/api";

export const homeLoader = async () => {
  try {
    const respone = await api.get("users/products");
    return respone.data;
  } catch (error) {
    console.log("HomeLoader error: ", error);
  }
};
