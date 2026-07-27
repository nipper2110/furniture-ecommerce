import { Link, useLoaderData } from "react-router";
// import { posts } from "@/data/posts";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import RichTextRenderer from "@/components/blogs/RichTextRenderer";
import { Suspense } from "react";
import SuspenseFallback from "@/Suspense Fallback/SuspenseFallback";
import { useSuspenseQuery } from "@tanstack/react-query";
import { onePostQuery, postQuery } from "@/api/query";
import type { Post, Tag } from "@/types";

const imageURL = import.meta.env.VITE_IMG_URL;

function BlogDetail() {
  // const { postId } = useParams();
  // const post = posts.find((post) => post.id === postId);

  const { postId } = useLoaderData();
  const { data: postsData } = useSuspenseQuery(postQuery("?limit=6"));
  const { data: postDetail } = useSuspenseQuery(onePostQuery(postId));

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <div className="container mx-auto px-4 lg:px-0">
        <section className="flex flex-col lg:flex-row">
          <section className="w-full lg:w-3/4 lg:pr-16">
            <Button variant="outline" asChild className="mt-8 mb-6">
              <Link to="/blogs">
                <Icons.arrowLeft />
                All Posts
              </Link>
            </Button>
            {postDetail ? (
              <>
                <h2 className="mb-3 text-3xl font-extrabold">
                  {postDetail.post.title}
                </h2>
                <div className="text-sm">
                  <span>
                    by
                    <span className="font-semibold">
                      {" "}
                      {postDetail.post.author.fullName}
                    </span>{" "}
                    on
                    <span className="font-semibold">
                      {" "}
                      {postDetail.post.updatedAt}
                    </span>
                  </span>
                </div>
                <h3 className="my-6 text-base font-normal">
                  {postDetail.post.content}
                </h3>
                <img
                  src={imageURL + postDetail.post.image}
                  alt={postDetail.post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-xl"
                />
                <RichTextRenderer
                  content={postDetail.post.body}
                  className="my-8"
                />
                <div className="mb-12 space-x-2">
                  {postDetail.post.tags.map((tag: Tag) => (
                    <Button key={tag.name} variant="secondary">
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground mt-8 mb-16 text-center text-xl font-bold lg:mt-24">
                No post found
              </p>
            )}
          </section>
          <section className="w-full lg:mt-24 lg:w-1/4">
            <div className="mb-8 flex items-center gap-2 text-base font-semibold">
              <Icons.layer />
              <h3>Other Blog Posts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
              {postsData.posts.map((post: Post) => (
                <Link
                  to={`/blogs/${post.id}`}
                  key={post.id}
                  className="mb-6 flex items-start gap-2"
                >
                  <img
                    src={imageURL + post.image}
                    alt="blog post"
                    loading="lazy"
                    decoding="async"
                    className="w-1/4 rounded"
                  />
                  <div className="text-muted-foreground w-3/4 text-sm font-medium">
                    <p className="line-clamp-2">{post.content}</p>
                    <i>... see more</i>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </div>
    </Suspense>
  );
}

export default BlogDetail;
