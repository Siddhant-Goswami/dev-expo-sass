import { Button } from "@/components/ui/button";
import { URLs } from "@/lib/constants";
import { api } from "@/trpc/server";
import { UserButton, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function addUser(formData: FormData) {
  "use server";

  const newUserName = formData.get("name") as string;

  await api.user.create.mutate({ name: newUserName });

  revalidatePath("/");
}

export default async function HomePage() {
  const user = await currentUser();

  const latestUser = await api.user.getLatest.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        {user ? (
          <>
            <p>Hello {user?.username ?? user?.firstName ?? "No name??"}!</p>
            {user.externalAccounts?.[0]?.provider === "oauth_github" && (
              <Link href={`https://github.com/${user?.username}`}>
                Your Github
              </Link>
            )}
          </>
        ) : (
          <Link href={URLs.signIn}>
            <Button>Sign in</Button>
          </Link>
        )}

        <form action={addUser}>
          <input
            type="text"
            className="rounded-md border-2 border-[#2e026d] bg-[#15162c] p-2 text-white"
          />
        </form>

        <UserButton />

        {latestUser ? <p>Latest user: {latestUser?.name}</p> : "No users yet"}
      </div>
    </main>
  );
}
