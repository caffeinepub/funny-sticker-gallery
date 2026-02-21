import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./components/HomePage";
import StickerDetailModal from "./components/StickerDetailModal";
import { useInitializeBackend } from "./hooks/useQueries";
import type { Sticker } from "./backend.d";

export default function App() {
  // Initialize backend with seed data on app startup
  useInitializeBackend();

  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);

  // Listen for custom event to open sticker from related section
  useEffect(() => {
    const handleOpenSticker = (e: Event) => {
      const customEvent = e as CustomEvent<Sticker>;
      setSelectedSticker(customEvent.detail);
    };

    window.addEventListener("openSticker", handleOpenSticker);
    return () => window.removeEventListener("openSticker", handleOpenSticker);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <HomePage onStickerClick={setSelectedSticker} />
        <StickerDetailModal
          sticker={selectedSticker}
          onClose={() => setSelectedSticker(null)}
        />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
