import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Campaign {
  id: string;
  title: string;
  publisher: string;
  image: string;
  keysAvailable: number;
  endDate: string;
  featured?: boolean;
}

const featuredCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Epic Adventure RPG",
    publisher: "Legendary Games",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    keysAvailable: 100,
    endDate: "2024-04-15",
    featured: true,
  },
  {
    id: "2",
    title: "Space Explorer",
    publisher: "Cosmic Studios",
    image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413",
    keysAvailable: 50,
    endDate: "2024-04-20",
    featured: true,
  },
];

const LandingPage = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                KeyWaves
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Login</Button>
              <Button>Join Now</Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-black h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url(${featuredCampaigns[0].image})`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-white h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Discover Game Keys for Your Content
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              Join KeyWaves for free and get access to exclusive game keys for
              your content creation. Connect with top publishers and grow your
              channel.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Join Now - It's Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setContactOpen(true)}
              >
                Game Publishers Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-10 h-12" />
        </div>
      </div>

      {/* Featured Campaigns */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="group relative bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                {campaign.featured && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{campaign.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {campaign.publisher}
                </p>
                <div className="flex justify-between text-sm">
                  <span>{campaign.keysAvailable} keys available</span>
                  <span>Ends {campaign.endDate}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary">View Campaign</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publisher Contact Modal */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact KeyWaves</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="Your game studio name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@company.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your game and distribution needs"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setContactOpen(false)}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
