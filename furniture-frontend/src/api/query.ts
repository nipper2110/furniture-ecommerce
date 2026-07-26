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

const fetchInfinitePosts = async ({ pageParam = null }) => {
  const query = pageParam ? `?limit=6&cursor=${pageParam}` : "?limit=6";
  const respone = await api.get(`users/posts/infinite${query}`);
  return respone.data;
};

export const postInfiniteQuery = () => ({
  queryKey: ["posts", "infinite"],
  queryFn: ({ pageParam = null }) => fetchInfinitePosts({ pageParam }),
  initialPageParam: null, // Start with no cursor
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
  // getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor ?? undefined,
  // maxPages: 1,
});
