import ProductCard from "@/components/products/ProductCard";
// import { products, filterList } from "@/data/products";
import ProductFilter from "@/components/products/ProductFilter";
// import Pagination from "@/components/products/Pagination";
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { categoryTypeQuery, productInfiniteQuery } from "@/api/query";
import LoadingCard from "@/components/loading-card";
import { Button } from "@/components/ui/button";

function Product() {
  const { data: cateType } = useSuspenseQuery(categoryTypeQuery());
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    // isFetchingPreviousPage,
    fetchNextPage,
    // fetchPreviousPage,
    hasNextPage,
    // hasPreviousPage,
  } = useInfiniteQuery(productInfiniteQuery());

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  return status === "pending" ? (
    <LoadingCard />
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="container mx-auto">
      <section className="flex flex-col lg:flex-row">
        <section className="my-8 ml-4 w-full lg:ml-0 lg:w-1/5">
          <ProductFilter filterList={cateType} />
        </section>
        <section className="w-full lg:ml-0 lg:w-4/5">
          <h1 className="my-8 ml-4 text-2xl font-bold">All Products</h1>
          <div className="mb-12 grid grid-cols-1 gap-6 gap-y-12 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* <Pagination /> */}
          <div className="my-4 flex justify-center">
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              variant={!hasNextPage ? "ghost" : "secondary"}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
            </Button>
          </div>
          <div className="">
            {isFetching && !isFetchingNextPage
              ? "Background Updating..."
              : null}
          </div>
        </section>
      </section>
    </div>
  );
}

export default Product;
