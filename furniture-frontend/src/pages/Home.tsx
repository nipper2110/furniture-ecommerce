import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Counch from "@/data/images/couch.png";
import { Button } from "@/components/ui/button";
import CarouselCard from "@/components/products/CarouselCard";
import BlogCard from "@/components/blogs/BlogCard";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types";
import { postQuery, productQuery } from "@/api/query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Title({
  title,
  href,
  sideText,
}: {
  title: string;
  href: string;
  sideText: string;
}) {
  return (
    <div className="mt-28 mb-10 flex flex-col px-4 md:flex-row md:justify-between md:px-0">
      <h2 className="mb-4 text-2xl font-bold md:mb-0">{title}</h2>
      <Link to={href} className="text-muted-foreground font-semibold underline">
        {sideText}
      </Link>
    </div>
  );
}

function Home() {
  // const { productsData, postsData } = useLoaderData();

  const {
    data: productsData,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    error: errorProduct,
    refetch: refetchProduct,
  } = useQuery(productQuery("?limit=8"));

  const {
    data: postsData,
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    refetch: refetchPost,
  } = useQuery(postQuery("?limit=3"));

  if (isLoadingProduct && isLoadingPost) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center">
        <Card className="w-full max-w-xs">
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isErrorProduct && isErrorPost) {
    return (
      <div className="container mx-auto my-32 flex flex-1 place-content-center">
        <div className="text-center text-red-400">
          <p className="mb-4">
            {errorProduct.message} & {errorPost.message}
          </p>
          <Button
            onClick={() => {
              refetchProduct();
              refetchPost();
            }}
            variant="secondary"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        {/* Text Section */}
        <div className="my-8 text-center lg:mt-20 lg:mb-0 lg:w-2/5 lg:text-left">
          <h1 className="mb-4 text-4xl font-extrabold text-[#3b5d50] lg:mb-8 lg:text-6xl">
            Modern Interior Design Studio
          </h1>
          <p className="mb-6 lg:mb-8">
            Furniture is an essential component of any living space, providing
            functionality, comfort, ans aesthetic appeal.
          </p>
          <div>
            <Button
              asChild
              className="mr-2 rounded-full bg-orange-300 px-8 py-6 text-base font-bold"
            >
              <Link to="#">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-bold text-[#3b5d50]"
            >
              <Link to="#">Explore</Link>
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <img src={Counch} alt="Counch" className="w-full lg:w-3/5" />
      </div>
      {productsData && <CarouselCard products={productsData.products} />}

      <Title
        title="Feature Products"
        href="/products"
        sideText="View All Products"
      />
      <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-4">
        {productsData &&
          productsData.products
            .slice(0, 4)
            .map((product: Product) => (
              <ProductCard product={product} key={product.id} />
            ))}
      </div>

      <Title title="Recent Blog" href="/blogs" sideText="View All Posts" />
      {postsData && <BlogCard posts={postsData.posts} />}
    </div>
  );
}

export default Home;
