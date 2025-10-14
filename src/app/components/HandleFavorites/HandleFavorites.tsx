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
import { MediaTypes } from "@/app/Types/MediaTypes";
import { MovieTypes } from "@/app/Types/MovieTypes";
import { TvTypes } from "@/app/Types/TvTypes";

function HandleFavorites({ media, favorites, setFavorites }: FavoriteTypes) {
  const [localFavorites, setLocalFavorites] = useState<MediaTypes[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchFavoritesFromFirebase = async (userId: string) => {
      const q = query(collection(db, "userFavoriteList", userId, "favorites"));
      try {
        const querySnapshot = await getDocs(q);
        const fetchedFavorites: MediaTypes[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return data as MediaTypes;
        });
        if (setFavorites) {
          setFavorites(fetchedFavorites);
        }

        if (!favorites) {
          setLocalFavorites(fetchedFavorites);
        }
      } catch (error) {
        console.error("Error fetching favorites: ", error);
        if (setFavorites) {
          setFavorites([]);
        }
      }
    };

    if (user && !favorites) {
      fetchFavoritesFromFirebase(user.uid);
    }
  }, [user, favorites, setFavorites]);

  function isMediaType(
    media: MovieTypes | TvTypes | MediaTypes
  ): media is MediaTypes {
    return (media as MediaTypes).id !== undefined;
  }

  const handleBookmarkClick = async (media: MediaTypes) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    } else if (user) {
      try {
        const isAlreadyInFavorites = (favorites ?? localFavorites)?.some(
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
          const updatedFavorite = {
            id: media.id,
            title: media.title || null,
            name: media.name || null,
            media_type: media.media_type || null,
          };
          await setDoc(favoriteRef, updatedFavorite);
          if (setFavorites) {
            setFavorites((prevFavorites: any) => [
              ...prevFavorites,
              updatedFavorite,
            ]);
          }
          if (!favorites) {
            setLocalFavorites((prevFavorites: any) => [
              ...prevFavorites,
              updatedFavorite,
            ]);
          }
        }
      } catch (error) {
        console.error("Error adding/removing movie to/from favorites:", error);
      }
    }
  };

  const handleRemoveFavorite = async (
    media: MovieTypes | TvTypes | MediaTypes
  ) => {
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
        const updatedFavorites = (favorites ?? localFavorites)?.filter(
          (favorite) => favorite.id !== itemToRemove.id
        );
        if (setFavorites) {
          setFavorites(updatedFavorites as MediaTypes[]);
        }
        if (!favorites) {
          setLocalFavorites((prevFavorites) =>
            prevFavorites.filter((favorite) => favorite.id !== itemToRemove.id)
          );
        }
      } catch (error) {
        console.error("Error removing movie from favorites:", error);
      }
    }

    setIsConfirmModalOpen(false);
    setItemToRemove(null);
  };

  return (
    <>
      {media.media_type !== "person" && media.gender == null && (
        <div
          className="absolute top-2 left-2 z-10 p-2 cursor-pointer bg-dark-100 text-white rounded-lg"
          onClick={() => {
            if (isMediaType(media)) {
              handleBookmarkClick(media);
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {(favorites ?? localFavorites)?.some(
            (favorite) => favorite.id === media.id
          ) ? (
            <FaBookmark className="text-blue" size={40} />
          ) : isHovered ? (
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
