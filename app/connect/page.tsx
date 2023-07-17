"use client";

import Image from "next/image";
import background from "./background.svg";
import "@/lib/fcl/config";
import dynamic from "next/dynamic";

const Auth = dynamic(() => import("./Auth"));

export default function ConnectWallet() {
  return (
    <main className="relative h-full">
      <Image
        alt="background"
        src={background}
        width={393}
        height={805}
        unoptimized
        unselectable="on"
        aria-hidden
        className="absolute object-cover object-center w-full h-full"
      />
      <div className="relative flex flex-col justify-between h-full px-6 pt-16 pb-12">
        <h1 className="text-6xl font-semibold text-center text-secondary font-display">
          Own Your Workout
        </h1>
        <section className="flex flex-col items-center justify-start">
          <h2 className="w-full mb-4 text-5xl font-semibold text-center text-primary font-display">
            Touch grass
          </h2>
          <h3 className="w-full mb-12 text-2xl text-center text-gray-700 font-display">
            Create & Mint Art
            <br />
            through Fitness
          </h3>
          <Auth />
        </section>
      </div>
    </main>
  );
}
