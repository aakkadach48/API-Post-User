"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
};

export default function PostsClientComplete() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState<number>(1);
  const [published, setPublished] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadPosts() {
    const res = await fetch("/api/posts");
    setPosts(await res.json());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId === null) {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, authorId, published }),
      });
    } else {
      await fetch(`/api/posts/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title,
          content,
          authorId,
          published,
        }),
      });
    }

    setTitle("");
    setContent("");
    setEditingId(null);
    setPublished(false);
    loadPosts();
  }

  async function remove(id: number) {
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadPosts();
  }

  function edit(post: Post) {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setAuthorId(post.authorId);
    setPublished(post.published);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
          {editingId ? "✏️ Edit Post" : "➕ Add Post"}
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-3 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none
                         transition-all duration-200"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Content
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-3 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none
                         transition-all duration-200"
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className={`flex-1 py-3 rounded-lg text-white font-semibold transition-all duration-200 active:scale-95
                ${
                  editingId
                    ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md"
                    : "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                }`}
            >
              {editingId ? "💾 Update Post" : "➕ Add Post"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                  setPublished(false);
                }}
                className="flex-1 py-3 rounded-lg bg-slate-400 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-semibold transition-all duration-200 active:scale-95"
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
          <span>👥</span> User List
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No posts yet. Create one to get started!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex justify-between items-center bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600
                           border border-slate-200 dark:border-slate-500 rounded-xl p-5 hover:shadow-md hover:scale-105 transition-all duration-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white text-lg">
                    {post.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {post.content}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => edit(post)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium
                               transition-all duration-200 active:scale-95 shadow-md"
                    title="Edit this post"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => remove(post.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium
                               transition-all duration-200 active:scale-95 shadow-md"
                    title="Delete this post"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
