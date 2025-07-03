"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../utils/supabaseClient";

export default function SyncUserToSupabase() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;
      const customer_name = user.firstName || "";
      const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || "";

      // Check if user already exists (optional, to avoid duplicates)
      const { data: existing, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .eq("email", email)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from("customers")
          .insert([{ customer_name, email }]);
        if (error) {
          console.error("Error inserting user:", error);
        }
      }
    };

    if (isLoaded && user) {
      syncUser();
    }
  }, [user, isLoaded]);

  return null; // This component does not render anything
}