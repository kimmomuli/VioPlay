"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
    const [data] = trpc.hello.useSuspenseQuery({ text: "Kimssi" });

    return (
        <div>
            <p>Selaimessa: {data.greeting}</p>
        </div>
    );
}; 