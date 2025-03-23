import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface InfiniteScrollProps {
    inManual?: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchnextPage: () => void;
};

export const InfiniteScroll = ({
    inManual = false,
    hasNextPage,
    isFetchingNextPage,
    fetchnextPage
}: InfiniteScrollProps) => {
    const { targetRef, isIntersecting } = useIntersectionObserver({
        threshold: 0.5,
        rootMargin: '100px',
    });

    useEffect(() => {
        if (isIntersecting && hasNextPage && !isFetchingNextPage && !inManual) {
            fetchnextPage();
        }
    }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchnextPage, inManual]);
    
    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div ref={targetRef} className="h-1"/>
            {hasNextPage ? (
                <Button 
                    variant="secondary"
                    disabled={!hasNextPage || isFetchingNextPage}
                    onClick={() => fetchnextPage()}
                >
                    {isFetchingNextPage ? "Loading..." : "Load More"}   
                </Button>
            ) : (
                <p className="text-xs text-muted-foreground">
                    You have reached the end of the list
                </p>
            )}
        </div>
    );
};