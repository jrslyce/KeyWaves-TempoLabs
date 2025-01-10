import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

interface MediaGalleryProps {
  media?: MediaItem[];
}

const defaultMedia: MediaItem[] = [
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
  },
  {
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop",
  },
];

const MediaGallery = ({ media = defaultMedia }: MediaGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const currentMedia = media[currentIndex];

  return (
    <Card className="w-full max-w-[1000px] bg-background mx-auto p-4">
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
        {currentMedia.type === "image" ? (
          <img
            src={currentMedia.url}
            alt="Game media"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full">
            {isPlaying ? (
              <iframe
                width="100%"
                height="100%"
                src={currentMedia.url}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={currentMedia.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            )}
          </div>
        )}

        <Button
          variant="secondary"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {media.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
            onClick={() => {
              setCurrentIndex(index);
              setIsPlaying(false);
            }}
          />
        ))}
      </div>
    </Card>
  );
};

export default MediaGallery;
