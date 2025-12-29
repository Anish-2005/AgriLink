import { createCivicAuthPlugin } from "@civic/auth/nextjs"

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};


const withCivicAuth = createCivicAuthPlugin({
  clientId: process.env.CIVIC_AUTH_CLIENT_ID,
  loginSuccessUrl: "/app"
});

export default withCivicAuth(nextConfig)