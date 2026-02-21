import Map "mo:core/Map";
import Nat32 "mo:core/Nat32";
import Time "mo:core/Time";

module {
  type OldCategory = {
    #animals;
    #memes;
    #emotions;
    #reactions;
    #food;
    #misc;
  };

  type OldSticker = {
    id : Nat32;
    title : Text;
    imageUrl : Text;
    category : OldCategory;
    tags : [Text];
    viewCount : Nat;
    likeCount : Nat;
    createdAt : Time.Time;
  };

  type OldActor = {
    stickers : Map.Map<Nat32, OldSticker>;
    nextId : Nat;
  };

  type NewCategory = {
    #animals;
    #memes;
    #emotions;
    #reactions;
    #food;
    #misc;
  };

  type NewSticker = {
    id : Nat32;
    title : Text;
    imageUrl : Text;
    category : NewCategory;
    tags : [Text];
    viewCount : Nat;
    likeCount : Nat;
    createdAt : Time.Time;
  };

  type NewActor = {
    stickers : Map.Map<Nat32, NewSticker>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    { old with stickers = old.stickers };
  };
};
