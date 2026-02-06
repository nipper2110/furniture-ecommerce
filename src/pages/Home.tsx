import { Link } from "react-router";
import Counch from "@/data/images/couch.png";
import { Button } from "@/components/ui/button";
import CarouselCard from "@/components/products/CarouselCard";
import { products } from "@/data/products";
import { posts } from "@/data/posts";
import BlogCard from "@/components/blogs/BlogCard";

const samplePosts = posts.slice(0, 3);

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
      <CarouselCard products={products} />

      <Title title="Recent Blog" href="/blogs" sideText="View All Posts" />
      <BlogCard posts={samplePosts} />
    </div>
  );
}

export default Home;
