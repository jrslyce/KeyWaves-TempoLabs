import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import CampaignList from "./CampaignList";
import ApplicationList from "./ApplicationList";
import { Plus } from "lucide-react";
import CreateCampaignModal from "./CreateCampaignModal";

export default function PublisherDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublisherData();
    setupSubscriptions();
  }, []);

  const fetchPublisherData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get publisher ID for the current user
      const { data: publisherMember } = await supabase
        .from("publisher_members")
        .select("publisher_id")
        .eq("user_id", user.id)
        .single();

      if (!publisherMember?.publisher_id) return;

      // Fetch campaigns
      const { data: campaignData } = await supabase
        .from("campaigns")
        .select("*, applications(*)")
        .eq("publisher_id", publisherMember.publisher_id);

      setCampaigns(campaignData || []);

      // Fetch all applications for these campaigns
      const campaignIds = campaignData?.map((c) => c.id) || [];
      const { data: applicationData } = await supabase
        .from("applications")
        .select("*, campaign:campaigns(title)")
        .in("campaign_id", campaignIds);

      setApplications(applicationData || []);
    } catch (error) {
      console.error("Error fetching publisher data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupSubscriptions = () => {
    const campaignsSubscription = supabase
      .channel("campaigns_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "campaigns" },
        fetchPublisherData,
      )
      .subscribe();

    const applicationsSubscription = supabase
      .channel("applications_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        fetchPublisherData,
      )
      .subscribe();

    return () => {
      campaignsSubscription.unsubscribe();
      applicationsSubscription.unsubscribe();
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Publisher Dashboard</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="campaigns">
          <TabsList className="mb-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <CampaignList campaigns={campaigns} />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationList applications={applications} />
          </TabsContent>
        </Tabs>
      </Card>

      <CreateCampaignModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
