import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";

export const AuthButton = () => {
    return ( 
        <Button 
            variant="outline"
            className="px-4 py-2 text-primary hover:text-primary/80 
                       border-2 border-primary rounded-md shadow-none" 
        >
            <UserCircleIcon />
            Sign In
        </Button>
    );
};
