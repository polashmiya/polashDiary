import BlogCard from "./BlogCard";

export default function BlogList({ posts }) {
  if (!posts?.length) {
    return (
      <div className="text-center text-slate-600">
        <p>No posts or blogs found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, idx) => (
        <BlogCard key={post.id} post={post} delay={idx * 0.06} />
      ))}
    </div>
  );
}
