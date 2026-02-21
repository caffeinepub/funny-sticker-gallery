import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat32 "mo:core/Nat32";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Category = {
    #animals;
    #memes;
    #emotions;
    #reactions;
    #food;
    #misc;
  };

  module Category {
    public func toText(category : Category) : Text {
      switch (category) {
        case (#animals) { "animals" };
        case (#memes) { "memes" };
        case (#emotions) { "emotions" };
        case (#reactions) { "reactions" };
        case (#food) { "food" };
        case (#misc) { "misc" };
      };
    };
  };

  type Sticker = {
    id : Nat32;
    title : Text;
    imageUrl : Text;
    category : Category;
    tags : [Text];
    viewCount : Nat;
    likeCount : Nat;
    createdAt : Time.Time;
  };

  module Sticker {
    public func compareByViewCount(sticker1 : Sticker, sticker2 : Sticker) : Order.Order {
      Nat.compare(sticker2.viewCount, sticker1.viewCount);
    };

    public func compareByLikeCount(sticker1 : Sticker, sticker2 : Sticker) : Order.Order {
      Nat.compare(sticker2.likeCount, sticker1.likeCount);
    };
  };

  let stickers = Map.empty<Nat32, Sticker>();
  var nextId = 1_000;

  public shared ({ caller }) func addSticker(title : Text, imageUrl : Text, category : Category, tags : [Text]) : async Nat32 {
    let id = Nat32.fromNat(nextId);
    nextId += 1;

    let sticker : Sticker = {
      id;
      title;
      imageUrl;
      category;
      tags;
      viewCount = 0;
      likeCount = 0;
      createdAt = Time.now();
    };

    stickers.add(id, sticker);
    id;
  };

  public query ({ caller }) func getAllStickers() : async [Sticker] {
    stickers.values().toArray();
  };

  public query ({ caller }) func getSticker(id : Nat32) : async Sticker {
    switch (stickers.get(id)) {
      case (null) { Runtime.trap("Sticker not found") };
      case (?sticker) { sticker };
    };
  };

  public query ({ caller }) func getStickersByCategory(category : Category) : async [Sticker] {
    stickers.values().toArray().filter(func(sticker) { sticker.category == category });
  };

  public query ({ caller }) func searchStickers(searchTerm : Text) : async [Sticker] {
    let term = searchTerm.toLower();
    stickers.values().toArray().filter(
      func(sticker) {
        sticker.title.toLower().contains(#text term) or
        sticker.tags.values().any(func(tag) { tag.toLower().contains(#text term) });
      }
    );
  };

  public shared ({ caller }) func incrementViewCount(id : Nat32) : async () {
    switch (stickers.get(id)) {
      case (null) { Runtime.trap("Sticker not found") };
      case (?sticker) {
        let updatedSticker : Sticker = {
          id = sticker.id;
          title = sticker.title;
          imageUrl = sticker.imageUrl;
          category = sticker.category;
          tags = sticker.tags;
          viewCount = sticker.viewCount + 1;
          likeCount = sticker.likeCount;
          createdAt = sticker.createdAt;
        };
        stickers.add(id, updatedSticker);
      };
    };
  };

  public shared ({ caller }) func incrementLikeCount(id : Nat32) : async () {
    switch (stickers.get(id)) {
      case (null) { Runtime.trap("Sticker not found") };
      case (?sticker) {
        let updatedSticker : Sticker = {
          id = sticker.id;
          title = sticker.title;
          imageUrl = sticker.imageUrl;
          category = sticker.category;
          tags = sticker.tags;
          viewCount = sticker.viewCount;
          likeCount = sticker.likeCount + 1;
          createdAt = sticker.createdAt;
        };
        stickers.add(id, updatedSticker);
      };
    };
  };

  public query ({ caller }) func getStickersByViews() : async [Sticker] {
    stickers.values().toArray().sort(Sticker.compareByViewCount);
  };

  public query ({ caller }) func getStickersByLikes() : async [Sticker] {
    stickers.values().toArray().sort(Sticker.compareByLikeCount);
  };

  public shared ({ caller }) func seedStickers() : async () {
    let initialStickers = [
      (
        "Doge Wow",
        "https://placehold.co/400x400/ff9500/white?text=🐕+Doge",
        #memes,
        ["dog", "funny", "meme", "wow"]
      ),
      (
        "Grumpy Cat",
        "https://placehold.co/400x400/8b7355/white?text=😾+Grumpy",
        #animals,
        ["cat", "grumpy", "meme"]
      ),
      (
        "Happy Pancake",
        "https://placehold.co/400x400/ffd700/white?text=🥞+Pancake",
        #food,
        ["breakfast", "happy", "food"]
      ),
      (
        "Epic Win",
        "https://placehold.co/400x400/00d000/white?text=🏆+Win",
        #reactions,
        ["win", "success", "reaction"]
      ),
      (
        "Crab Rave",
        "https://placehold.co/400x400/ff4500/white?text=🦀+Rave",
        #memes,
        ["crab", "rave", "dance"]
      ),
      (
        "Sleepy Sloth",
        "https://placehold.co/400x400/8b8589/white?text=🦥+Sloth",
        #animals,
        ["sloth", "sleepy", "cute"]
      ),
      (
        "Facepalm Emoji",
        "https://placehold.co/400x400/6495ed/white?text=🤦+Facepalm",
        #reactions,
        ["facepalm", "emoji", "reaction"]
      ),
      (
        "Dancing Banana",
        "https://placehold.co/400x400/ffe135/white?text=🍌+Dance",
        #memes,
        ["banana", "dance", "funny"]
      ),
      (
        "Yawn Cat",
        "https://placehold.co/400x400/d2691e/white?text=😽+Yawn",
        #animals,
        ["cat", "yawn", "sleepy"]
      ),
      (
        "Taco Tuesday",
        "https://placehold.co/400x400/ff6347/white?text=🌮+Taco",
        #food,
        ["taco", "mexican", "food"]
      ),
      (
        "Jazz Hands",
        "https://placehold.co/400x400/da70d6/white?text=🙌+Jazz",
        #reactions,
        ["jazz", "hands", "celebrate"]
      ),
      (
        "Bread Loaf",
        "https://placehold.co/400x400/deb887/white?text=🍞+Bread",
        #food,
        ["bread", "loaf", "food"]
      ),
      (
        "Nope Frog",
        "https://placehold.co/400x400/3cb371/white?text=🐸+Nope",
        #memes,
        ["frog", "nope", "meme"]
      ),
      (
        "Excited Doggo",
        "https://placehold.co/400x400/ff8c00/white?text=🐶+Excited",
        #animals,
        ["dog", "excited", "cute"]
      ),
      (
        "Silly Monkey",
        "https://placehold.co/400x400/cd853f/white?text=🐵+Silly",
        #animals,
        ["monkey", "silly", "funny"]
      ),
      (
        "Potato Face",
        "https://placehold.co/400x400/a0522d/white?text=🥔+Potato",
        #misc,
        ["potato", "funny", "face"]
      ),
      (
        "Dancing Pickle",
        "https://placehold.co/400x400/9acd32/white?text=🥒+Pickle",
        #memes,
        ["pickle", "dance", "meme"]
      ),
      (
        "Surprised Pikachu",
        "https://placehold.co/400x400/ffeb3b/white?text=⚡+Pikachu",
        #memes,
        ["pikachu", "surprised", "meme"]
      ),
      (
        "Pizza Party",
        "https://placehold.co/400x400/ff4500/white?text=🍕+Pizza",
        #food,
        ["pizza", "party", "food"]
      ),
      (
        "Winking Whale",
        "https://placehold.co/400x400/4682b4/white?text=🐋+Whale",
        #animals,
        ["whale", "winking", "cute"]
      ),
      (
        "Thug Life Sunglasses",
        "https://placehold.co/400x400/2f4f4f/white?text=😎+Thug",
        #memes,
        ["sunglasses", "thug", "life"]
      ),
      (
        "Crying Laughing Emoji",
        "https://placehold.co/400x400/ffd700/white?text=😂+LOL",
        #emotions,
        ["crying", "laughing", "emoji"]
      ),
      (
        "Angry Tomato",
        "https://placehold.co/400x400/dc143c/white?text=🍅+Angry",
        #food,
        ["tomato", "angry", "food"]
      ),
      (
        "Rainbow Unicorn",
        "https://placehold.co/400x400/ff69b4/white?text=🦄+Unicorn",
        #misc,
        ["rainbow", "unicorn", "cute"]
      ),
      (
        "Thumbs Up Cat",
        "https://placehold.co/400x400/bc8f8f/white?text=😸+Thumbs",
        #animals,
        ["cat", "thumbs", "up"]
      ),
      (
        "Party Penguin",
        "https://placehold.co/400x400/4169e1/white?text=🐧+Party",
        #animals,
        ["penguin", "party", "animal"]
      ),
    ];

    for ((title, imageUrl, category, tags) in initialStickers.values()) {
      let id = Nat32.fromNat(nextId);
      nextId += 1;

      let sticker : Sticker = {
        id;
        title;
        imageUrl;
        category;
        tags;
        viewCount = 0;
        likeCount = 0;
        createdAt = Time.now();
      };

      stickers.add(id, sticker);
    };
  };

  public shared ({ caller }) func initialize() : async () {
    if (stickers.size() == 0) {
      await seedStickers();
    };
  };
};
