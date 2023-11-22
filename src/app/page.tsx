import { db } from "@/server/db";

export default async function HomePage() {
  const users = await db.query.users.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-col items-center justify-center"
          >
            <h2 className="text-xl font-bold">{user.name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}
