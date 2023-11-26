import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import GetInTouchModal from "@/components/ui/get-in-touch-modal";
import NavBar from "@/components/ui/navbar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";

export default function Page() {
    const projectTitle = "3D Cube Network for UX/Ul Design";
    const availableForWork = true;
    const userName = "Rishabh Gurbani";


    return (
    <>
        <NavBar />
        <div className="mt-8 flex justify-center">
            <main className="flex justify-center flex-col w-8/12">
                <h1 className="text-left text-2xl font-semibold mb-4 w-full">
                    {projectTitle}
                </h1>
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-3 items-center">
                        <img className="rounded-full w-12" src="https://lh3.googleusercontent.com/a/ACg8ocLfbKiBRQohC1aCKjnp_7mEa7LGMSewqNZOVZHVuvjwLNFS=s96-c" />
                        <div>
                            <div className="text-sm font-semibold mb-0.5">{userName}</div>
                            <div className="flex items-center">
                                <div className={"w-2 h-2 " + (availableForWork ? "bg-green-500" : "bg-red-500" ) +  " rounded-full mr-2"}></div>
                                {
                                    availableForWork ? <span className="text-xs text-green-500">Available for work</span> : <span className="text-xs text-red-500">Not available for work</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="icon">
                            Like
                        </Button>
                        <Button variant="outline" className="icon">
                            Save
                        </Button>
                        <GetInTouchModal/>
                    </div>
                </div>
                <img className="w-900 h-500 rounded-sm" src="https://cdn.dribbble.com/userupload/11597547/file/original-0bc15864f71e1fcdfa8152b2379fdb44.jpg" 
                alt="3D Cube Network" />
            </main>
        </div>
    </>
    );
}
