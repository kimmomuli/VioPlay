import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";

interface VideoThumbnailProps {
    imageUrl?: string | null;
    previewUrl?: string | null;
    title: string;
    duration: number;   
}

export const VideoThumbnail = ({
    imageUrl,
    previewUrl,
    title,
    duration
}: VideoThumbnailProps) => {
    return ( 
        <div className="relative group">
            {/* thumbnail */}
            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <Image
                    src={imageUrl || THUMBNAIL_FALLBACK}
                    alt={title}
                    fill
                    className="size-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                <Image
                    unoptimized={!!previewUrl}
                    src={previewUrl || THUMBNAIL_FALLBACK}
                    alt={title}
                    fill
                    className="size-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
            </div>

            {/* duration */}
            <div>
                <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-xs text-white font-medium">
                    {formatDuration(duration)}
                </div>
            </div>
        </div>
    );
}
