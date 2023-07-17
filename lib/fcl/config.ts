import { env } from "@/env";
import { config } from "@onflow/fcl";

config({
  "accessNode.api":
    env.NEXT_PUBLIC_NODE_ENV === "production"
      ? "https://rest-mainnet.onflow.org"
      : "https://rest-testnet.onflow.org",
  "discovery.wallet":
    env.NEXT_PUBLIC_NODE_ENV === "production"
      ? "https://fcl-discovery.onflow.org/authn"
      : "https://fcl-discovery.onflow.org/testnet/authn",
  "discovery.authn.endpoint":
    env.NEXT_PUBLIC_NODE_ENV === "production"
      ? "https://fcl-discovery.onflow.org/api/authn"
      : "https://fcl-discovery.onflow.org/api/testnet/authn",
  "app.detail.icon":
    env.NEXT_PUBLIC_NODE_ENV === "production"
      ? "https://artwalkflow.netlify.app/logo.svg"
      : "",
  "app.detail.title": "ArtWalk",
});
