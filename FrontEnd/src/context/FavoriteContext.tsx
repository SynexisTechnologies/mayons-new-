import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Product } from "../components/product/types";

export type FavoriteItem =
  | { type: "product"; data: Product }
  | { type: "restaurant"; data: any };

interface FavoriteContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string, type: "product" | "restaurant") => boolean; // ✅ string
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export const FavoriteProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.find(
        (fav) =>
          fav.type === item.type &&
          fav.data._id === item.data._id // ✅ FIXED
      );

      if (exists) {
        return prev.filter(
          (fav) =>
            !(
              fav.type === item.type &&
              fav.data._id === item.data._id
            )
        );
      }

      return [...prev, item];
    });
  };

  const isFavorite = (
    id: string,
    type: "product" | "restaurant"
  ) => {
    return favorites.some(
      (fav) => fav.type === type && fav.data._id === id // ✅ FIXED
    );
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context)
    throw new Error(
      "useFavorites must be used within FavoriteProvider"
    );
  return context;
};
