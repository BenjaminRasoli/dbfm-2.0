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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/FireBaseConfig";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import RemoveModal from "../RemoveModal/RemoveModal";
import LoginModal from "../LoginModal/LoginModal";
import { FavoriteTypes } from "../../Types/FavoritesTypes";
import { MediaTypes } from "@/app/Types/MediaTypes";
import { MovieTypes } from "@/app/Types/MovieTypes";
import { TvTypes } from "@/app/Types/TvTypes";
import { useRouter } from "next/navigation";

function HandleFavorites({
  media,
  favorites,
  setFavorites,
  isRecommendations,
}: FavoriteTypes) {
  const [localFavorites, setLocalFavorites] = useState<MediaTypes[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);

  const router = useRouter();
  const { user } = useUser();
  const iconSize = isRecommendations ? 25 : 40;

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
    media: MovieTypes | TvTypes | MediaTypes,
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
          (favorite) => favorite.id === media.id,
        );

        const docId = String(media.id);

        const favoriteRef = doc(
          db,
          "userFavoriteList",
          user.uid,
          "favorites",
          docId,
        );

        if (isAlreadyInFavorites) {
          setItemToRemove(media);
          setIsConfirmModalOpen(true);
        } else {
          const updatedFavorite = {
            id: media.id,
            type: media.media_type || null,
            createdAt: serverTimestamp(),
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
          router.refresh();
        }
      } catch (error) {
        console.error("Error adding movie to/from favorites:", error);
      }
    }
  };

  const handleRemoveFavorite = async (
    media: MovieTypes | TvTypes | MediaTypes,
  ) => {
    setItemToRemove(media);
    if (itemToRemove) {
      try {
        const docId = String(itemToRemove.id);

        const favoriteRef = doc(
          db,
          "userFavoriteList",
          user?.uid || "",
          "favorites",
          docId,
        );

        await deleteDoc(favoriteRef);
        const updatedFavorites = (favorites ?? localFavorites)?.filter(
          (favorite) => favorite.id !== itemToRemove.id,
        );
        if (setFavorites) {
          setFavorites(updatedFavorites as MediaTypes[]);
        }
        if (!favorites) {
          setLocalFavorites((prevFavorites) =>
            prevFavorites.filter((favorite) => favorite.id !== itemToRemove.id),
          );
        }
        router.refresh();
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
          title="Add to favorites"
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
            (favorite) => favorite.id === media.id,
          ) ? (
            <FaBookmark className="text-blue" size={iconSize} />
          ) : isHovered ? (
            <FaBookmark className="text-blue" size={iconSize} />
          ) : (
            <FaRegBookmark size={iconSize} />
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
