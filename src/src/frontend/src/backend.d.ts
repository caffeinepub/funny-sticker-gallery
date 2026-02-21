import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Sticker {
    id: number;
    title: string;
    likeCount: bigint;
    createdAt: Time;
    tags: Array<string>;
    imageUrl: string;
    viewCount: bigint;
    category: Category;
}
export enum Category {
    memes = "memes",
    food = "food",
    misc = "misc",
    animals = "animals",
    emotions = "emotions",
    reactions = "reactions"
}
export interface backendInterface {
    addSticker(title: string, imageUrl: string, category: Category, tags: Array<string>): Promise<number>;
    getAllStickers(): Promise<Array<Sticker>>;
    getSticker(id: number): Promise<Sticker>;
    getStickersByCategory(category: Category): Promise<Array<Sticker>>;
    getStickersByLikes(): Promise<Array<Sticker>>;
    getStickersByViews(): Promise<Array<Sticker>>;
    incrementLikeCount(id: number): Promise<void>;
    incrementViewCount(id: number): Promise<void>;
    initialize(): Promise<void>;
    searchStickers(searchTerm: string): Promise<Array<Sticker>>;
    seedStickers(): Promise<void>;
}
