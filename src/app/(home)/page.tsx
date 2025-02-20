import { HydrateClient, trpc } from "@/trpc/server";
import { PageClient } from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  void trpc.hello.prefetch({ text: "Kimssi" });
  return (
    <HydrateClient>
      <Suspense fallback={<p>Ladataan...</p>}>
        <ErrorBoundary fallback={<p>Virhe!</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};
