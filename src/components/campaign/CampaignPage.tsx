import { useState } from "react";
import { useParams } from "react-router-dom";
import HeroSection from "./HeroSection";
import MediaGallery from "./MediaGallery";
import CampaignDetails from "./CampaignDetails";
import CampaignSidebar from "./CampaignSidebar";
import ApplicationModal from "./ApplicationModal";
import ContactModal from "./ContactModal";
import { useCampaignData } from "@/hooks/useCampaignData";
import { Skeleton } from "../ui/skeleton";

const CampaignSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Hero Section Skeleton */}
    <div className="h-[400px] relative bg-muted">
      <Skeleton className="w-full h-full" />
    </div>

    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-8">
          {/* Media Gallery Skeleton */}
          <Skeleton className="w-full aspect-[2/1] rounded-lg" />

          {/* Campaign Details Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="w-[380px]">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    </div>
  </div>
);

const CampaignPage = () => {
  const { id } = useParams();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { campaign, loading, error } = useCampaignData(id!);

  if (loading) {
    return <CampaignSkeleton />;
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Campaign not found</h2>
          <p className="text-muted-foreground">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Extract game and creator tags from meta_tags
  const gameTags =
    campaign.meta_tags
      ?.filter((tag: any) => tag.category === "game")
      .map((tag: any) => tag.name) || [];

  const creatorTags =
    campaign.meta_tags
      ?.filter((tag: any) => tag.category === "creator")
      .map((tag: any) => tag.name) || [];

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title={campaign.title}
        heroImage={campaign.hero_image}
        status={campaign.status as "active" | "upcoming" | "ended"}
      />

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1 space-y-8">
            <MediaGallery
              media={campaign.media_gallery?.map((item: any) => ({
                type: item.type,
                url: item.url,
                thumbnail: item.thumbnail,
              }))}
            />
            <CampaignDetails
              gameDescription={campaign.description}
              requirements={campaign.content_requirements}
              gameTags={gameTags}
              creatorTags={creatorTags}
              eligibilityCriteria={{
                followers: campaign.min_followers,
                platform: campaign.accepted_platforms?.join(", "),
                contentType: campaign.content_requirements || [],
              }}
            />
          </div>

          <CampaignSidebar
            status={campaign.status as "active" | "upcoming" | "ended"}
            startDate={campaign.start_date}
            endDate={campaign.end_date}
            onContactClick={() => setIsContactModalOpen(true)}
          />
        </div>
      </div>

      <ApplicationModal
        open={isApplicationModalOpen}
        onOpenChange={setIsApplicationModalOpen}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
      />

      <ContactModal
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        campaignTitle={campaign.title}
      />
    </div>
  );
};

export default CampaignPage;
