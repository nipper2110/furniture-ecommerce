import { authApi } from "@/api";
import {
  postInfiniteQuery,
  postQuery,
  productQuery,
  queryClient,
  onePostQuery,
  categoryTypeQuery,
  productInfiniteQuery,
  oneProductQuery,
} from "@/api/query";
import useAuthStore, { Status } from "@/store/authStore";
import { redirect, type Params } from "react-router";

// export const homeLoader = async () => {
//   try {
//     const products = await api.get("users/products?limit=8");
//     const posts = await api.get("users/posts/infinite?limit=3");

//     // const [products, posts] = await Promise.all([
//     //   api.get("users/products?limit=8"),
//     //   api.get("users/posts/infinite?limit=3"),
//     // ]);

//     return { productsData: products.data, postsData: posts.data };
//   } catch (error) {
//     console.log("HomeLoader error: ", error);
//   }
// };

export const homeLoader = async () => {
  await queryClient.ensureQueryData(productQuery("?limit=8"));
  await queryClient.ensureQueryData(postQuery("?limit=3"));
  return null;
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

export const otpLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== Status.otp) {
    return redirect("/register");
  }

  return null;
};

export const confirmLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== Status.confirm) {
    return redirect("/register");
  }

  return null;
};

export const verifyLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== Status.verify) {
    return redirect("/reset");
  }

  return null;
};

export const newPasswordLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== Status.reset) {
    return redirect("/reset");
  }

  return null;
};

export const blogInfiniteLoader = async () => {
  await queryClient.ensureInfiniteQueryData(postInfiniteQuery());
  return null;
};

export const postLoader = async ({ params }: { params: Params<string> }) => {
  if (!params.postId) {
    throw new Error("No Post ID provided.");
  }

  await queryClient.ensureQueryData(postQuery("?limit=6"));

  await queryClient.ensureQueryData(onePostQuery(Number(params.postId)));
  return { postId: params.postId };
};

export const productInfiniteLoader = async () => {
  await queryClient.ensureQueryData(categoryTypeQuery());
  await queryClient.prefetchInfiniteQuery(productInfiniteQuery());
  return null;
};

export const productLoader = async ({ params }: { params: Params<string> }) => {
  if (!params.productId) {
    throw new Error("No Product ID provided.");
  }

  await queryClient.ensureQueryData(productQuery("?limit=4"));

  await queryClient.ensureQueryData(oneProductQuery(Number(params.productId)));
  return { productId: params.productId };
};
