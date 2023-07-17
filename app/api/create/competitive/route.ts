import { db } from "@/lib/drizzle";
import { challenges } from "@/lib/drizzle/schema";
import { NextResponse } from "next/server";

const cs = [
  {
    id: "sea_scape",
    imgUrl: "/images/sea_scape.webp",
    pricing: "Free",
    title: "Sea",
    numOfParticipants: 23,
    deadline: "7/28/2023, 6:28:11 PM",
    difficulty: "Medium",
  },
  {
    id: "alien",
    imgUrl: "/images/alien.png",
    pricing: "Premium",
    title: "Alien",
    numOfParticipants: 23,
    deadline: "8/12/2023, 4:48:49 AM",
    difficulty: "Medium",
  },
  {
    id: "leaves",
    imgUrl: "/images/leaves.jpg",
    pricing: "Free",
    title: "Leaves",
    numOfParticipants: 23,
    deadline: "8/15/2023, 5:25:31 PM",
    difficulty: "Medium",
  },
  {
    id: "car",
    imgUrl: "/images/car.jpg",
    pricing: "Free",
    title: "AUDI",
    numOfParticipants: 23,
    deadline: "8/16/2023, 12:04:47 PM",
    difficulty: "Medium",
  },
  {
    id: "mouth",
    imgUrl: "/images/mouth.png",
    pricing: "Premium",
    title: "Mouth",
    numOfParticipants: 23,
    deadline: "8/18/2023, 10:18:17 PM",
    difficulty: "Medium",
  },
  {
    id: "mountain",
    imgUrl: "/images/mountain.jpg",
    pricing: "Premium",
    title: "Mountains",
    numOfParticipants: 23,
    deadline: "8/2/2023, 10:36:42 AM",
    difficulty: "Medium",
  },
  {
    id: "moth",
    imgUrl: "/images/moth.jpg",
    pricing: "Premium",
    title: "Moth",
    numOfParticipants: 23,
    deadline: "8/26/2023, 10:02:56 PM",
    difficulty: "Medium",
  },
  {
    id: "pianist",
    imgUrl: "/images/pianist.jpg",
    pricing: "Premium",
    title: "Pianist",
    numOfParticipants: 23,
    deadline: "8/4/2023, 7:41:32 PM",
    difficulty: "Medium",
  },
  {
    id: "square",
    imgUrl: "/images/flow.png",
    pricing: "Premium",
    title: "Flow",
    numOfParticipants: 23,
    deadline: "Soon",
    difficulty: "Medium",
  },
  {
    id: "tree_easy",
    imgUrl: "/images/tree_easy.jpg",
    pricing: "Premium",
    title: "Tree simple",
    numOfParticipants: 23,
    deadline: "8/5/2023, 1:42:01 PM",
    difficulty: "Easy",
  },
  {
    id: "tree_difficult",
    pricing: "Free",
    imgUrl: "/images/tree_difficult.jpg",
    title: "Tough tree",
    numOfParticipants: 248,
    deadline: "8/6/2023, 5:16:35 AM",
    difficulty: "Hard",
  },
  {
    id: "tree_hard",
    pricing: "Free",
    title: "Detailed tree",
    imgUrl: "/images/tree_hard.jpg",
    numOfParticipants: 3,
    deadline: "9/3/2023, 3:14:20 PM",
    difficulty: "Medium",
  },
  {
    id: "tree_expert",
    imgUrl: "/images/tree_expert.jpg",
    pricing: "Premium",
    title: "TreeXpert",
    numOfParticipants: 5667,
    deadline: "9/4/2023, 12:16:46 PM",
    difficulty: "Expert",
  },
  {
    id: "tree_medium",
    imgUrl: "/images/tree_medium.webp",
    pricing: "Premium",
    title: "Tree OK",
    numOfParticipants: 5667,
    deadline: "9/5/2023, 8:58:38 AM",
    difficulty: "Expert",
  },
] as const;

export async function POST() {
  const random = cs[Math.floor(cs.length * Math.random())];
  await db
    .insert(challenges)
    .values({
      title: `${["Daily", "Draw", "Walk"][Math.floor(Math.random() * 3)]} ${
        random.title
      }${Math.random() < 0.5 ? " Challenge" : ""}`,
      imageUrl: random.imgUrl,
      type: "competitive",
      difficulty: random.difficulty.toLowerCase(),
      pricing: random.pricing.toLowerCase(),
      deadline: new Date((Math.floor(Date.now() / 3600000) + 24) * 3600000),
    } as any)
    .execute();

  return NextResponse.json({ ok: true });
}
