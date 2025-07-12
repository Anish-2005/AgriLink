import { authMiddleware } from "@civic/auth/nextjs/middleware";

export default authMiddleware();

export const config = {
  matcher: [
    '/marketplace',
    '/marketplace/:path*',
    '/app',
    '/app/:path*',
    '/portfolio',
    '/portfolio/:path*',
  ],
};
