import { User } from "@prisma/client";

async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/users", {
    cache: "no-store",
  });

  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  return (
    <div>
      <h1>User List</h1>
      {users.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
