import { ModeToggle } from "@/components/ui/toggle";
import { UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <h1 className="bg-background text-foreground">Page</h1>
      <ModeToggle />
      <UserButton />
    </div>
  );
}
