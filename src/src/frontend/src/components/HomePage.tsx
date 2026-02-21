import { useState, useMemo } from "react";
import { Search, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StickerGrid from "./StickerGrid";
import { useGetAllStickers } from "../hooks/useQueries";
import { Category } from "../backend.d";
import type { Sticker } from "../backend.d";

interface HomePageProps {
  onStickerClick: (sticker: Sticker) => void;
}

const categories: Array<{ value: Category | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: Category.memes, label: "Memes" },
  { value: Category.animals, label: "Animals" },
  { value: Category.emotions, label: "Emotions" },
  { value: Category.reactions, label: "Reactions" },
  { value: Category.food, label: "Food" },
  { value: Category.misc, label: "Misc" },
];

export default function HomePage({ onStickerClick }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const { theme, setTheme } = useTheme();

  const { data: allStickers = [], isLoading } = useGetAllStickers();

  // Filter stickers based on search and category
  const filteredStickers = useMemo(() => {
    let filtered = allStickers;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((sticker) => sticker.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (sticker) =>
          sticker.title.toLowerCase().includes(term) ||
          sticker.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [allStickers, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display tracking-tight">
                StickerVerse
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-display leading-tight tracking-tight">
              Discover the{" "}
              <span className="text-primary">funniest</span> stickers on the
              web! 🎉
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse thousands of hilarious stickers, perfect for every mood and
              moment. Save your favorites and share the laughs!
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search stickers by title or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-2xl bg-card border-2 border-border focus-visible:border-primary transition-colors shadow-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 bg-background sticky top-[73px] z-30 border-b border-border">
        <div className="container mx-auto px-4">
          <Tabs
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value as Category | "all")
            }
            className="w-full"
          >
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 bg-muted/50 rounded-2xl">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="rounded-xl px-6 py-2.5 text-sm font-medium whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Sticker Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <StickerGrid
            stickers={filteredStickers}
            isLoading={isLoading}
            onStickerClick={onStickerClick}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with{" "}
            <span className="text-primary">💗</span> using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
