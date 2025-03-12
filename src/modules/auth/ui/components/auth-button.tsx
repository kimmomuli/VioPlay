"use client";

import { UserButton, SignedIn, SignedOut, SignInButton, } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";

export const AuthButton = () => {
    return ( 
        <div>
            <SignedIn>
                <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Link
                            label="Studio"
                            href="/studio"
                            labelIcon={<ClapperboardIcon className="size-4"/>}
                            >

                        </UserButton.Link>
                        <UserButton.Action label="manageAccount"/>
                    </UserButton.MenuItems>
                </UserButton>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button 
                        variant="outline"
                        className="px-4 py-2 text-primary hover:text-primary/80 
                        border-2 border-primary rounded-md shadow-none" 
                        >
                        <UserCircleIcon />
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
        </div>
    );
};
