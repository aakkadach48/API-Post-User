"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
};

export default function PostsClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [authorId, setAuthorId] = useState<number>(1);
  const [published, setPublished] = useState(false);

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
    <main>
      <h2>{editingId ? "Edit Post" : "Add Post"}</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit">{editingId ? "Update" : "Add"}</button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setContent("");
              setPublished(false);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Post List</h2>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title} ({post.content})
            <button onClick={() => edit(post)}>Edit</button>
            <button onClick={() => remove(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
