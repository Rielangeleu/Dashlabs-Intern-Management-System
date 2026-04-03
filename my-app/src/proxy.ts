import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy(req) {
    // We leave this empty because the withAuth wrapper handles the security checks for us
  },
  {
    pages: {
      signIn: "/login", // If they aren't logged in, send them here
    },
  }
);

export const config = {
  matcher: [
    // Protect everything EXCEPT the login page, Next.js background files, and your logo
    "/((?!login|api|_next/static|_next/image|dashlabs-logo.png).*)",
  ],
};