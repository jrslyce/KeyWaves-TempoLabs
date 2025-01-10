import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useCampaign } from "@/contexts/CampaignContext";
import { handleApiError } from "@/lib/error-handling";

export function useCampaignData(campaignId: string) {
  const { state, dispatch } = useCampaign();

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) return;

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        // Fetch campaign details
        const { data: campaign } = await handleApiError(
          supabase.from("campaigns").select("*").eq("id", campaignId).single(),
          "Failed to fetch campaign details",
          { campaignId, operation: "fetch_campaign" },
        );

        dispatch({ type: "SET_CAMPAIGN", payload: campaign });

        // Fetch applications for this campaign
        const { data: applications } = await handleApiError(
          supabase
            .from("applications")
            .select("*")
            .eq("campaign_id", campaignId),
          "Failed to fetch campaign applications",
          { campaignId, operation: "fetch_applications" },
        );

        dispatch({ type: "SET_APPLICATIONS", payload: applications });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error instanceof Error ? error.message : "An error occurred",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchCampaign();

    // Set up real-time subscription for applications
    const applicationsSubscription = supabase
      .channel(`public:applications:campaign_id=eq.${campaignId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "applications",
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          dispatch({ type: "ADD_APPLICATION", payload: payload.new });
        },
      )
      .subscribe();

    return () => {
      applicationsSubscription.unsubscribe();
    };
  }, [campaignId, dispatch]);

  return state;
}
