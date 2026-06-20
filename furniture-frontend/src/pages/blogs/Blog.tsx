import { posts } from "@/data/posts";
import BlogPostList from "@/components/blogs/BlogPostList";
import { Suspense } from "react";
import SuspenseFallback from "@/Suspense Fallback/SuspenseFallback";

function Blog() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <div className="container mx-auto">
        <h1 className="mt-8 text-center text-2xl font-bold md:text-left">
          Latest Blog Posts
        </h1>
        <BlogPostList posts={posts} />
      </div>
    </Suspense>
  );
}

export default Blog;
