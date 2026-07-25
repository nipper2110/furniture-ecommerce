import { QueryClient } from "@tanstack/react-query";
import api from ".";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
    },
  },
});

// const fetchProducts = async (q?: string) => {
//   const respone = await api.get(`users/products${q ?? ""}`);
//   return respone.data;
// };

const fetchProducts = (q?: string) =>
  api.get(`users/products${q ?? ""}`).then((res) => res.data);

// useQuery({ queryKey, queryFn}) for get method

export const productQuery = (q?: string) => ({
  queryKey: ["products", q],
  queryFn: () => fetchProducts(q),
});

const fetchPosts = (q?: string) =>
  api.get(`users/posts/infinite${q ?? ""}`).then((res) => res.data);

export const postQuery = (q?: string) => ({
  queryKey: ["posts", q],
  queryFn: () => fetchPosts(q),
});
