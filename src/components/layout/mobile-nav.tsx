import {
  MobileNavClient,
} from "@/components/layout/mobile-nav-client";

import {
  getRequestAuth,
} from "@/lib/auth/server-session";

export async function MobileNav() {
  const {
    userId,
  } =
    await getRequestAuth();

  return (
    <MobileNavClient
      loggedIn={
        Boolean(
          userId,
        )
      }
    />
  );
}
