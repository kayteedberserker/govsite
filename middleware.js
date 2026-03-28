// middleware.js
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/:path*"], // This protects the entire admin folder
};