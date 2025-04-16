import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoGetOneOutput } from "@/modules/videos/types";
import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput['viewerReaction'];
}


export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const dislike = trpc.videoReactions.dislike.useMutation({ 
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });


  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="rounded-l-md rounded-r-none gap-2 pr-4"
        onClick={() => like.mutate({ videoId })} 
        disabled={like.isPending || dislike.isPending}  
      >
           <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-black")} />
           {likes}
      </Button>
      <Separator orientation="vertical" className="h-10 z-10" />
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-md pl-3"
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
      >
           <ThumbsDownIcon className={cn("size-5", viewerReaction === "dislike" && "fill-black")} />
           {dislikes}
      </Button>
    </div>
  );
};