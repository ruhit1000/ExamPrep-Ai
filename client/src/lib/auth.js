import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import clientPromise from './db';

const dbClient = await clientPromise;
const db = dbClient.db('exam-prep-db');

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  // Since Option B hosts Better Auth on Next.js, 
  // we trust both the client origin and backend origin
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:8000'
  ],
});
