import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { apiKey } from "@better-auth/api-key";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.WEB_ORIGIN ?? "http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    apiKey({
      // Project API keys are what the SDK sends as `Authorization: Bearer <key>`.
      defaultKeyLength: 32,
      schema: {
        apikey: { modelName: "ApiKey" },
      },
    }),
  ],
});
