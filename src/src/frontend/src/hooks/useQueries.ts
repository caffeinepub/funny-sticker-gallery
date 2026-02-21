import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useActor } from "./useActor";
import type { Sticker, Category } from "../backend.d";

// Initialize backend with seed data (call once on app startup)
export function useInitializeBackend() {
  const { actor, isFetching } = useActor();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!actor || isFetching || hasInitialized.current) return;

    const initializeBackend = async () => {
      try {
        await actor.initialize();
        hasInitialized.current = true;
      } catch (error) {
        console.error("Failed to initialize backend:", error);
      }
    };

    initializeBackend();
  }, [actor, isFetching]);
}

// Get all stickers
export function useGetAllStickers() {
  const { actor, isFetching } = useActor();
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStickers();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get single sticker
export function useGetSticker(id: number | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Sticker | null>({
    queryKey: ["stickers", id],
    queryFn: async () => {
      if (!actor || id === null) return null;
      try {
        return await actor.getSticker(id);
      } catch (error) {
        console.error("Error fetching sticker:", error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// Get stickers by category
export function useGetStickersByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getStickersByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

// Get stickers sorted by views
export function useGetStickersByViews() {
  const { actor, isFetching } = useActor();
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "byViews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStickersByViews();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get stickers sorted by likes
export function useGetStickersByLikes() {
  const { actor, isFetching } = useActor();
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "byLikes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStickersByLikes();
    },
    enabled: !!actor && !isFetching,
  });
}

// Search stickers
export function useSearchStickers(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "search", searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      return actor.searchStickers(searchTerm);
    },
    enabled: !!actor && !isFetching && !!searchTerm.trim(),
  });
}

// Increment view count
export function useIncrementViewCount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.incrementViewCount(id);
    },
    onSuccess: (_, id) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}

// Increment like count
export function useIncrementLikeCount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.incrementLikeCount(id);
    },
    onSuccess: (_, id) => {
      // Optimistically update the cache
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}
