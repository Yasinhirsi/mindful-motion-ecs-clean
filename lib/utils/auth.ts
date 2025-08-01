import { cookies } from 'next/headers';
import { createServerClient } from "@supabase/ssr";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          },
        },
      }
    );

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      return null;
    }

    if (!session) {
      console.log("No session found");
      return null;
    }

    // Log the session details to help with debugging
    console.log("Session found:", {
      user_id: session.user.id,
      email: session.user.email,
      expires_at: new Date(session.expires_at! * 1000).toISOString(),
    });

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      return null;
    }

    if (!user) {
      console.log("No user found for session ID:", session.user.id);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Unexpected error in getCurrentUser:", error);
    return null;
  }
}
