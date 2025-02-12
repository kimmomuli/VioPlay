import { SearchIcon } from "lucide-react";

export const SearchInput = () => {
    return ( 
        <form className="flex w-full max-w-[600px]">
            <div className="relative w-full">
                <input 
                    type="text"
                    placeholder="Search"
                    className="w-full pl-4 py-2 pr-12 border bg-background text-foreground 
                               border-input focus:outline-none 
                               focus:border-primary focus:ring-2 focus:ring-primary/50 
                               rounded-s-md rounded-e-none"
                />
            </div>
            <button
                type="submit"
                className="px-5 py-2.5 bg-secondary text-secondary-foreground 
                           border border-input hover:bg-muted 
                           rounded-e-md rounded-s-none 
                           disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SearchIcon className="size-5"/>
            </button>
        </form>
    );
};
