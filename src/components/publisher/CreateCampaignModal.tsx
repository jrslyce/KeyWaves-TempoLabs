import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";

const basicInfoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  heroImage: z.string().url("Must be a valid image URL"),
});

const requirementsSchema = z.object({
  minFollowers: z.string().transform((val) => parseInt(val, 10)),
  acceptedPlatforms: z.array(z.string()).min(1, "Select at least one platform"),
  contentRequirements: z
    .array(z.string())
    .min(1, "Add at least one requirement"),
});

const campaignDetailsSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  keysAvailable: z.string().transform((val) => parseInt(val, 10)),
  discordUrl: z.string().url("Must be a valid Discord URL").optional(),
});

type BasicInfoData = z.infer<typeof basicInfoSchema>;
type RequirementsData = z.infer<typeof requirementsSchema>;
type CampaignDetailsData = z.infer<typeof campaignDetailsSchema>;

interface CreateCampaignModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const STEPS = ["Basic Info", "Requirements", "Campaign Details", "Review"];

export default function CreateCampaignModal({
  open = false,
  onOpenChange = () => {},
}: CreateCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basicInfoForm = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: "",
      description: "",
      heroImage: "",
    },
  });

  const requirementsForm = useForm<RequirementsData>({
    resolver: zodResolver(requirementsSchema),
    defaultValues: {
      minFollowers: "",
      acceptedPlatforms: [],
      contentRequirements: [],
    },
  });

  const campaignDetailsForm = useForm<CampaignDetailsData>({
    resolver: zodResolver(campaignDetailsSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      keysAvailable: "",
      discordUrl: "",
    },
  });

  const handleNext = async (data: any) => {
    setFormData({ ...formData, ...data });
    if (currentStep === STEPS.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: publisherMember } = await supabase
        .from("publisher_members")
        .select("publisher_id")
        .eq("user_id", user.id)
        .single();

      if (!publisherMember?.publisher_id) throw new Error("No publisher found");

      const campaignData = {
        ...formData,
        publisher_id: publisherMember.publisher_id,
        status: "upcoming",
      };

      const { error } = await supabase.from("campaigns").insert(campaignData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form {...basicInfoForm}>
            <form
              onSubmit={basicInfoForm.handleSubmit(handleNext)}
              className="space-y-4"
            >
              <FormField
                control={basicInfoForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter campaign title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={basicInfoForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your game and campaign"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={basicInfoForm.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        );

      case 1:
        return (
          <Form {...requirementsForm}>
            <form
              onSubmit={requirementsForm.handleSubmit(handleNext)}
              className="space-y-4"
            >
              <FormField
                control={requirementsForm.control}
                name="minFollowers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Followers</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter minimum followers required"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={requirementsForm.control}
                name="acceptedPlatforms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accepted Platforms</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Select platforms"
                        options={[
                          { label: "YouTube", value: "youtube" },
                          { label: "Twitch", value: "twitch" },
                          { label: "TikTok", value: "tiktok" },
                          { label: "Instagram", value: "instagram" },
                        ]}
                        selected={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={requirementsForm.control}
                name="contentRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Requirements</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Select requirements"
                        options={[
                          { label: "Video Review", value: "video_review" },
                          { label: "Livestream", value: "livestream" },
                          {
                            label: "Social Media Posts",
                            value: "social_posts",
                          },
                          { label: "Written Review", value: "written_review" },
                        ]}
                        selected={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        );

      case 2:
        return (
          <Form {...campaignDetailsForm}>
            <form
              onSubmit={campaignDetailsForm.handleSubmit(handleNext)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={campaignDetailsForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={campaignDetailsForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={campaignDetailsForm.control}
                name="keysAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Keys Available</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of keys"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={campaignDetailsForm.control}
                name="discordUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Server URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Discord server URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Campaign Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Title</h4>
                  <p className="text-muted-foreground">{formData.title}</p>
                </div>
                <div>
                  <h4 className="font-medium">Dates</h4>
                  <p className="text-muted-foreground">
                    {format(formData.startDate, "PP")} -{" "}
                    {format(formData.endDate, "PP")}
                  </p>
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-muted-foreground">
                    {formData.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Keys Available</h4>
                  <p className="text-muted-foreground">
                    {formData.keysAvailable}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Minimum Followers</h4>
                  <p className="text-muted-foreground">
                    {formData.minFollowers}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between mb-8">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className={cn(
                "flex flex-col items-center space-y-2",
                index <= currentStep ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
                )}
              >
                {index + 1}
              </div>
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>

        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
