import { useEffect, useState } from "react";
import { X, Heart, Eye, Calendar, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  useIncrementViewCount,
  useIncrementLikeCount,
  useGetStickersByCategory,
} from "../hooks/useQueries";
import type { Sticker } from "../backend.d";

interface StickerDetailModalProps {
  sticker: Sticker | null;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  memes: "bg-primary text-primary-foreground",
  animals: "bg-secondary text-secondary-foreground",
  emotions: "bg-accent text-accent-foreground",
  reactions: "bg-chart-1 text-primary-foreground",
  food: "bg-chart-4 text-primary-foreground",
  misc: "bg-muted text-muted-foreground",
};

export default function StickerDetailModal({
  sticker,
  onClose,
}: StickerDetailModalProps) {
  const [hasLiked, setHasLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0n);
  const [localViewCount, setLocalViewCount] = useState(0n);

  const incrementView = useIncrementViewCount();
  const incrementLike = useIncrementLikeCount();

  // Get related stickers from the same category
  const { data: relatedStickers = [] } = useGetStickersByCategory(
    sticker?.category || null
  );

  // Filter out the current sticker and limit to 4
  const filteredRelated = relatedStickers
    .filter((s) => s.id !== sticker?.id)
    .slice(0, 4);

  // Increment view count when modal opens
  useEffect(() => {
    if (sticker) {
      incrementView.mutate(sticker.id);
      setLocalViewCount(sticker.viewCount + 1n);
      setLocalLikeCount(sticker.likeCount);
      setHasLiked(false);
    }
  }, [sticker?.id]);

  const handleLike = () => {
    if (!sticker || hasLiked) return;

    incrementLike.mutate(sticker.id, {
      onSuccess: () => {
        setHasLiked(true);
        setLocalLikeCount((prev) => prev + 1n);
        toast.success("Liked! 💗", {
          description: "This sticker has been added to your favorites.",
        });
      },
      onError: () => {
        toast.error("Oops!", {
          description: "Failed to like sticker. Please try again.",
        });
      },
    });
  };

  if (!sticker) return null;

  const createdDate = new Date(Number(sticker.createdAt) / 1_000_000);

  return (
    <Dialog open={!!sticker} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 rounded-3xl overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: Image */}
            <div className="relative bg-muted aspect-square md:aspect-auto">
              <img
                src={sticker.imageUrl}
                alt={sticker.title}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Right: Details */}
            <div className="p-6 md:p-8 space-y-6">
              <DialogHeader>
                <div className="space-y-3">
                  <Badge
                    className={`${
                      categoryColors[sticker.category] || categoryColors.misc
                    } rounded-xl px-3 py-1 text-xs font-semibold w-fit`}
                  >
                    {sticker.category}
                  </Badge>
                  <DialogTitle className="text-2xl md:text-3xl font-display leading-tight">
                    {sticker.title}
                  </DialogTitle>
                </div>
              </DialogHeader>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">
                    {Number(localViewCount).toLocaleString()} views
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium">
                    {Number(localLikeCount).toLocaleString()} likes
                  </span>
                </div>
              </div>

              {/* Like Button */}
              <Button
                onClick={handleLike}
                disabled={hasLiked || incrementLike.isPending}
                className={`w-full py-6 text-lg font-semibold rounded-2xl transition-all ${
                  hasLiked
                    ? "bg-success text-success-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {incrementLike.isPending ? (
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5 animate-pulse" />
                    Liking...
                  </span>
                ) : hasLiked ? (
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5 fill-current animate-pulse-heart" />
                    Liked!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Like this sticker
                  </span>
                )}
              </Button>

              {/* Tags */}
              {sticker.tags.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Tag className="w-4 h-4" />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sticker.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="rounded-lg px-3 py-1 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                <Calendar className="w-4 h-4" />
                <span>
                  Added on {createdDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Related Stickers */}
              {filteredRelated.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold">
                    More from {sticker.category}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredRelated.map((related) => (
                      <div
                        key={related.id}
                        className="cursor-pointer group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-primary transition-all"
                        onClick={() => {
                          onClose();
                          // Small delay to allow modal to close before opening new one
                          setTimeout(() => {
                            const event = new CustomEvent("openSticker", {
                              detail: related,
                            });
                            window.dispatchEvent(event);
                          }, 100);
                        }}
                      >
                        <img
                          src={related.imageUrl}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-medium line-clamp-2">
                              {related.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
