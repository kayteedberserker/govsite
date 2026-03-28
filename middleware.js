// middleware.js
import { withAuth } from "next-auth/middleware";

// Explicitly exporting the withAuth function satisfies the build requirement
export default withAuth({
  callbacks: {
    // This simply ensures the user has a valid token (is logged in)
    authorized: ({ token }) => !!token, 
  },
});

export const config = {
  matcher: ["/admin/:path*"], // This protects the entire admin folder
};