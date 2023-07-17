import { InferModel } from "drizzle-orm";
import {
  boolean,
  datetime,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const challenges = mysqlTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  type: mysqlEnum("type", ["competitive", "creative"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard", "expert"]),
  deadline: datetime("deadline"),
  pricing: mysqlEnum("pricing", ["free", "premium"]).notNull(),
  participantCount: int("participant_count").default(0).notNull(),
  // join: walks
});
export type ChallengeType = InferModel<typeof challenges>;

export const nfts = mysqlTable(
  "nfts",
  {
    id: serial("id").primaryKey(),
    userAddr: varchar("user_addr", { length: 32 }).notNull(),
    walkId: int("walk_id").notNull(),
    rank: int("rank"),
    claimed: boolean("claimed").default(false).notNull(),
  },
  (nfts) => ({
    userAddrIndex: index("user_idx").on(nfts.userAddr),
    walkIndex: index("walk_idx").on(nfts.walkId),
  }),
);
export type NFTType = InferModel<typeof nfts>;

export const walks = mysqlTable(
  "walks",
  {
    id: serial("id").primaryKey(),
    updatedAt: timestamp("updated_at").notNull(),
    userAddr: varchar("user_addr", { length: 32 }).notNull(),
    challengeId: int("challenge_id").notNull(), // one-to-many
    nftId: int("nft_id"), // one-to-one?
    status: mysqlEnum("status", [
      "in progress",
      "finished",
      "submitted",
    ]).notNull(),
    data: json("data").notNull(),
    totalLength: real("total_length").notNull(),
    drawnLength: real("drawn_length").notNull(),
    totalTime: real("total_time").notNull(),
    drawnTime: real("drawn_time").notNull(),
    similarity: real("similarity"),
  },
  (walks) => ({
    userAddrIndex: index("user_idx").on(walks.userAddr),
    challengeIndex: index("challenge_idx").on(walks.challengeId),
    nftIndex: index("nft_idx").on(walks.nftId),
    statusIndex: index("status_idx").on(walks.status),
  }),
);
export type WalkType = InferModel<typeof walks>;
