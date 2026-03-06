"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UsersClientComplete() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadUsers() {
    const res = await fetch("/api/users");
    setUsers(await res.json());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId === null) {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
    } else {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name,
          email,
        }),
      });
    }

    setName("");
    setEmail("");
    setEditingId(null);
    loadUsers();
  }

  async function remove(id: number) {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadUsers();
  }

  function edit(user: User) {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
          {editingId ? "✏️ Edit User" : "➕ Add User"}
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-3 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none
                         transition-all duration-200"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-3 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none
                         transition-all duration-200"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {editingId ? "💾 Update User" : "➕ Add User"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setEmail("");
                }}
                className="flex-1 py-3 rounded-lg bg-slate-400 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-semibold transition-all duration-200 active:scale-95"
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* User List Card */}
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
          <span>👥</span> User List
        </h2>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No users yet. Create one to get started!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600
                           border border-slate-200 dark:border-slate-500 rounded-xl p-5 hover:shadow-md hover:scale-105 transition-all duration-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white text-lg">
                    {u.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {u.email}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => edit(u)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium
                               transition-all duration-200 active:scale-95 shadow-md"
                    title="Edit this user"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => remove(u.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium
                               transition-all duration-200 active:scale-95 shadow-md"
                    title="Delete this user"
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
