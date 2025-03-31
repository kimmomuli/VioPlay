ALTER TABLE "videos" ALTER COLUMN "duration" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "duration" DROP NOT NULL;