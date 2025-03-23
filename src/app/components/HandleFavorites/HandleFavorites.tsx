"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserProvider";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/FireBaseConfig";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import RemoveModal from "../RemoveModal/RemoveModal";
import LoginModal from "../LoginModal/LoginModal";
import { FavoriteTypes } from "../../Types/FavoritesTypes";

function HandleFavorites({ media }: FavoriteTypes) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);

  const { user } = useUser();

  const fetchFavoritesFromFirebase = async (userId: string) => {
    const q = query(collection(db, "userFavoriteList", userId, "favorites"));
    try {
      const querySnapshot = await getDocs(q);
      const fetchedFavorites = querySnapshot.docs.map((doc) => doc.data());
      setFavorites(fetchedFavorites);
      localStorage.setItem("favoriteMovies", JSON.stringify(fetchedFavorites));
    } catch (error) {
      console.error("Error fetching favorites: ", error);
      setFavorites([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavoritesFromFirebase(user.uid);
    }
  }, [user]);

  const handleBookmarkClick = async (media: any) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    } else if (user) {
      try {
        const isAlreadyInFavorites = favorites.some(
          (favorite) => favorite.id === media.id
        );

        const filteredTitle = (media.title || media.name || "").replace(
          /[\/\.\#\$\[\]]/g,
          "-"
        );

        const favoriteRef = doc(
          db,
          "userFavoriteList",
          user.uid,
          "favorites",
          filteredTitle
        );

        if (isAlreadyInFavorites) {
          setItemToRemove(media);
          setIsConfirmModalOpen(true);
        } else {
          await setDoc(favoriteRef, {
            id: media.id,
            title: media.title || null,
            name: media.name || null,
            release_date: media.release_date || null,
            first_air_date: media.first_air_date || null,
            vote_average: media.vote_average || 0,
            poster_path: media.poster_path || null,
            media_type: media.media_type || null,
          });

          const currentFavorites = JSON.parse(
            localStorage.getItem("favoriteMovies") || "[]"
          );

          const updatedFavorites = [
            ...currentFavorites,
            {
              id: media.id,
              title: media.title,
              name: media.name,
              release_date: media.release_date,
              first_air_date: media.first_air_date,
              vote_average: media.vote_average,
              poster_path: media.poster_path,
              media_type: media.media_type,
            },
          ];

          localStorage.setItem(
            "favoriteMovies",
            JSON.stringify(updatedFavorites)
          );
          console.log(updatedFavorites);

          setFavorites(updatedFavorites);
        }
      } catch (error) {
        console.error("Error adding/removing movie to/from favorites:", error);
      }
    }
  };

  const handleRemoveFavorite = async (media: any) => {
    setItemToRemove(media);
    if (itemToRemove) {
      try {
        const filteredTitle = (
          itemToRemove.title ||
          itemToRemove.name ||
          ""
        ).replace(/[\/\.\#\$\[\]]/g, "-");
        const favoriteRef = doc(
          db,
          "userFavoriteList",
          user?.uid || "",
          "favorites",
          filteredTitle
        );

        await deleteDoc(favoriteRef);
        console.log(favorites);
        const updatedFavorites = favorites.filter(
          (favorite) => favorite.id !== itemToRemove.id
        );
        setFavorites(updatedFavorites);
        console.log(updatedFavorites);

        localStorage.setItem(
          "favoriteMovies",
          JSON.stringify(updatedFavorites)
        );

        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.error("Error removing movie from favorites:", error);
      }
    }

    setIsConfirmModalOpen(false);
    setItemToRemove(null);
  };

  return (
    <>
      {!media.known_for_department && (
        <div
          className="absolute top-2 left-2 z-10 p-2 cursor-pointer bg-dark-100 text-white rounded-lg"
          onClick={() => handleBookmarkClick(media)}
          onMouseEnter={() => setHoveredItemId(media.id)}
          onMouseLeave={() => setHoveredItemId(null)}
        >
          {favorites.some((favorite) => favorite.id === media.id) ? (
            <FaBookmark className="text-blue" size={40} />
          ) : hoveredItemId === media.id ? (
            <FaBookmark className="text-blue" size={40} />
          ) : (
            <FaRegBookmark size={40} />
          )}
        </div>
      )}

      <RemoveModal
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
        itemToRemove={itemToRemove}
        handleRemoveFavorite={() => handleRemoveFavorite(media)}
      />
      <LoginModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}

export default HandleFavorites;
