"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/StatusPage";
import { btn } from "@/components/ui";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="500"
      title="Something went"
      accent="off script."
      body="Sorry, this page didn't load properly. Please try again in a moment."
      action={
        <button type="button" onClick={retry} className={btn.ghost}>
          Try Again
        </button>
      }
    />
  );
}
