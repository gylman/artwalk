import { config } from '@onflow/fcl';

config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "discovery.wallet.method": "POP/RPC", // Optional. Available methods are "IFRAME/RPC", "POP/RPC", "TAB/RPC" or "HTTP/POST", defaults to "IFRAME/RPC".
  "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/testnet/authn",
  "app.detail.title": "ArtWalk"
})
