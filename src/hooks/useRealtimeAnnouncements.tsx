import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useRealtimeAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAnnouncements(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnnouncements();

    // Subscribe to announcement changes
    const channel = supabase
      .channel("announcements:realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newAnnouncement = payload.new as Announcement;
            if (newAnnouncement.is_published) {
              setAnnouncements((prev) => [newAnnouncement, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Announcement;
            setAnnouncements((prev) => {
              // If it was unpublished, remove it
              if (!updated.is_published) {
                return prev.filter((a) => a.id !== updated.id);
              }
              // Check if it exists
              const exists = prev.find((a) => a.id === updated.id);
              if (exists) {
                return prev.map((a) => (a.id === updated.id ? updated : a));
              } else {
                // Newly published
                return [updated, ...prev];
              }
            });
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setAnnouncements((prev) => prev.filter((a) => a.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAnnouncements]);

  return {
    announcements,
    loading,
    refetch: fetchAnnouncements,
  };
}
