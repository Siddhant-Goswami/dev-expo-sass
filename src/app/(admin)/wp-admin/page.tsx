import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/server/db';
import { LucideGithub } from 'lucide-react';

export default async function DemoCreateAccount() {
  const applications = await db.query.devApplications.findMany();
  return (
    <div>
      {applications.map((app) => (
        <Card key={app.id} className=" grid max-w-md gap-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{app.displayName}</CardTitle>
            <CardDescription>{app.bio}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline" className="aspect-square h-10 w-10 p-0">
                <LucideGithub />
              </Button>
              <Button variant="outline" className="aspect-square h-10 w-10 p-0">
                𝕏
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create account</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
