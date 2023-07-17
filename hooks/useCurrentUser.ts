import * as fcl from "@onflow/fcl";
import type { CurrentUser } from "@onflow/typedefs";
import { useEffect, useState } from "react";

export default function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fcl.currentUser.subscribe((user: CurrentUser) => {
      setUser(user);
    });
  }, []);

  return user;
}
