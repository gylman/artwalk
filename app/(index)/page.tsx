"use client";

import PrimaryButton from "@/components/PrimaryButton";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MonaSans } from "../fonts";
import logo from "./logo.svg";
import Mask from "./Mask";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <main className="h-full">
      {loading ? <SplashScreen /> : <LandingScreen />}
    </main>
  );
}

function SplashScreen() {
  return (
    <div className="h-full bg-primary">
      <div className="flex flex-col items-center justify-center h-full gap-y-8">
        <Image
          alt="ArtWalk logo"
          src={logo}
          width={128}
          height={128}
          unoptimized
          unselectable="on"
          className="animate-spin-y"
        />
        <span className={`${MonaSans.className} text-secondary text-5xl`}>
          ArtWalk
        </span>
      </div>
    </div>
  );
}

function LandingScreen() {
  return (
    <div className="flex flex-col h-full overflow-hidden font-display">
      <div className="relative flex justify-center flex-1 min-h-0">
        <video className="absolute w-full h-[calc(100%+56px)]" controls />
        <Mask className="h-[max(144.53vw,100%+24px)] absolute text-[rgb(244,251,231)] pointer-events-none" />
      </div>
      <div className="z-10 w-full px-6 py-10 text-center bg-gray-100 shrink-0 h-fit rounded-t-base">
        <h1 className="text-5xl text-primary">Mint Walking</h1>
        <p className="pt-4 pb-8 text-xl text-gray-500">
          Click play to view how it works
        </p>
        <Link href="/connect">
          <PrimaryButton>Continue</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
