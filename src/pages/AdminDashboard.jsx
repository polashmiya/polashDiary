export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-4 text-slate-700">
        Admin features for local users and comment moderation are not available with the remote API integration.
      </p>
      <p className="mt-2 text-slate-700">
        You can still create posts from the Create Post page and manage content using the backend.
      </p>
      <div className="mt-6">
        <a href="/create-post" className="inline-block rounded bg-indigo-600 text-white px-4 py-2">Create Post</a>
      </div>
    </div>
  );
}
