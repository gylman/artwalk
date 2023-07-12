import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  server: {},
  client: {
    VITE_MAPBOX_API_KEY: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
});
