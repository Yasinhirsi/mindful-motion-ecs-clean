import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Using any type to silence TypeScript errors
// This is a temporary workaround for Next.js 14 cookies API issues
const getCookieStore = () => cookies() as any;

export const createServerComponentClient = async () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name) => {
          try {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
          } catch (error) {
            console.error('Error getting cookie:', error);
            return undefined;
          }
        },
        set: async (name, value, options) => {
          try {
            const cookieStore = await cookies();
            cookieStore.set(name, value, options);
          } catch (error) {
            console.error('Error setting cookie:', error);
          }
        },
        remove: async (name, options) => {
          try {
            const cookieStore = await cookies();
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
};

export const createServerActionClient = async () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name) => {
          try {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
          } catch (error) {
            console.error('Error getting cookie:', error);
            return undefined;
          }
        },
        set: async (name, value, options) => {
          try {
            const cookieStore = await cookies();
            cookieStore.set(name, value, options);
          } catch (error) {
            console.error('Error setting cookie:', error);
          }
        },
        remove: async (name, options) => {
          try {
            const cookieStore = await cookies();
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
};
