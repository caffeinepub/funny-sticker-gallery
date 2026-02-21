import { useState } from "react";
import { Eye, Heart, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Sticker } from "../backend.d";

interface StickerGridProps {
  stickers: Sticker[];
  isLoading: boolean;
  onStickerClick: (sticker: Sticker) => void;
}

const categoryColors: Record<string, string> = {
  memes: "bg-primary text-primary-foreground",
  animals: "bg-secondary text-secondary-foreground",
  emotions: "bg-accent text-accent-foreground",
  reactions: "bg-chart-1 text-primary-foreground",
  food: "bg-chart-4 text-primary-foreground",
  misc: "bg-muted text-muted-foreground",
};

function StickerCard({ sticker }: { sticker: Sticker; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const tiltX = isHovered ? (mousePos.y / 15) : 0;
  const tiltY = isHovered ? -(mousePos.x / 15) : 0;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 rounded-2xl shadow-card hover:shadow-card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${isHovered ? 1.05 : 1})`,
        transition: "transform 0.2s ease-out, box-shadow 0.3s ease",
      }}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img
            src={sticker.imageUrl}
            alt={sticker.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              className={`${
                categoryColors[sticker.category] || categoryColors.misc
              } rounded-xl px-3 py-1 text-xs font-semibold shadow-lg`}
            >
              {sticker.category}
            </Badge>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {sticker.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{Number(sticker.viewCount).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              <span>{Number(sticker.likeCount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StickerCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <Skeleton className="aspect-square w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StickerGrid({
  stickers,
  isLoading,
  onStickerClick,
}: StickerGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <StickerCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (stickers.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl">🔍</div>
        <h3 className="text-2xl font-display text-muted-foreground">
          No stickers found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try adjusting your search or browse different categories to discover
          more funny stickers!
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      style={{
        animation: "fade-in 0.6s ease-out",
      }}
    >
      {stickers.map((sticker, index) => (
        <div
          key={sticker.id}
          onClick={() => onStickerClick(sticker)}
          style={{
            animation: `bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${
              index * 0.05
            }s both`,
          }}
        >
          <StickerCard sticker={sticker} onClick={() => onStickerClick(sticker)} />
        </div>
      ))}
    </div>
  );
}
