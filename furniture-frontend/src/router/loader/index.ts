import api, { authApi } from "@/api";
import { redirect } from "react-router";

export const homeLoader = async () => {
  try {
    const respone = await api.get("users/products");
    return respone.data;
  } catch (error) {
    console.log("HomeLoader error: ", error);
  }
};

export const loginLoader = async () => {
  try {
    const respone = await authApi.get("auth-check");

    if (respone.status !== 200) {
      return null;
    }

    return redirect("/");
  } catch (error) {
    console.log("Loader error: ", error);
  }
};
