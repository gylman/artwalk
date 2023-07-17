"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Favorite() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-stretch h-full px-8 py-16">
      <PrimaryButton
        disabled={loading}
        className="flex items-center justify-center"
        onClick={async () => {
          setLoading(true);
          await fetch(`/api/reset`, {
            method: "POST",
          });
          router.replace("/challenges");
        }}
      >
        {loading ? (
          <IconLoader2 className="animate-spin" />
        ) : (
          "Reset everything"
        )}
      </PrimaryButton>
    </div>
  );
}
