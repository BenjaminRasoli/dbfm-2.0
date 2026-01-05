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
import { ImCheckmark, ImCheckmark2 } from "react-icons/im";
import RemoveModal from "../RemoveModal/RemoveModal";
import LoginModal from "../LoginModal/LoginModal";
import { WatchedTypes } from "@/app/Types/WatchedTypes";
import { MediaTypes } from "@/app/Types/MediaTypes";
import { MovieTypes } from "@/app/Types/MovieTypes";
import { TvTypes } from "@/app/Types/TvTypes";
import { useRouter } from "next/navigation";

function HandleWatched({ media, watched, setWatched }: WatchedTypes) {
  const [localWatched, setLocalWatched] = useState<MediaTypes[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);

  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchWatchedFromFirebase = async (userId: string) => {
      const q = query(collection(db, "userWatchedList", userId, "watched"));
      try {
        const querySnapshot = await getDocs(q);
        const fetchedWatched: MediaTypes[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return data as MediaTypes;
        });

        if (setWatched) {
          setWatched(fetchedWatched);
        }

        if (!watched) {
          setLocalWatched(fetchedWatched);
        }
      } catch (error) {
        console.error("Error fetching watched list: ", error);
        if (setWatched) {
          setWatched([]);
        }
      }
    };

    if (user && !watched) {
      fetchWatchedFromFirebase(user.uid);
    }
  }, [user, watched, setWatched]);

  function isMediaType(
    media: MovieTypes | TvTypes | MediaTypes
  ): media is MediaTypes {
    return (media as MediaTypes).id !== undefined;
  }

  const handleBookmarkClick = async (media: MediaTypes) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    try {
      const isAlreadyInWatched = (watched ?? localWatched)?.some(
        (item) => item.id === media.id
      );

      const docId = String(media.id);

      const watchedRef = doc(db, "userWatchedList", user.uid, "watched", docId);
      if (isAlreadyInWatched) {
        setItemToRemove(media);
        setIsConfirmModalOpen(true);
      } else {
        const updatedWatched = {
          id: media.id,
          type: media.media_type || null,
        };

        await setDoc(watchedRef, updatedWatched);

        if (setWatched) {
          setWatched((prev: any) => [...prev, updatedWatched]);
        }

        if (!watched) {
          setLocalWatched((prev: any) => [...prev, updatedWatched]);
        }
        router.refresh();
      }
    } catch (error) {
      console.error("Error adding watched item:", error);
    }
  };

  const handleRemoveWatched = async (
    media: MovieTypes | TvTypes | MediaTypes
  ) => {
    setItemToRemove(media);
    const docId = String(itemToRemove.id);
    if (itemToRemove) {
      try {
        const watchedRef = doc(
          db,
          "userWatchedList",
          user?.uid || "",
          "watched",
          docId
        );

        await deleteDoc(watchedRef);

        const updatedWatched = (watched ?? localWatched)?.filter(
          (item) => item.id !== itemToRemove.id
        );

        if (setWatched) {
          setWatched(updatedWatched as MediaTypes[]);
        }

        if (!watched) {
          setLocalWatched((prev) =>
            prev.filter((item) => item.id !== itemToRemove.id)
          );
        }
        router.refresh();
      } catch (error) {
        console.error("Error removing item from watched:", error);
      }
    }

    setIsConfirmModalOpen(false);
    setItemToRemove(null);
  };

  return (
    <>
      {media.media_type !== "person" && media.gender == null && (
        <div
          title="Add to watched"
          className="absolute top-18 left-2 z-10 p-2 cursor-pointer bg-dark-100 text-white rounded-lg"
          onClick={() => {
            if (isMediaType(media)) {
              handleBookmarkClick(media);
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {(watched ?? localWatched)?.some((item) => item.id === media.id) ? (
            <ImCheckmark className="text-blue" size={40} />
          ) : isHovered ? (
            <ImCheckmark className="text-blue" size={40} />
          ) : (
            <ImCheckmark2 size={40} />
          )}
        </div>
      )}

      <RemoveModal
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
        itemToRemove={itemToRemove}
        handleRemoveFavorite={() => handleRemoveWatched(media)}
      />

      <LoginModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}

export default HandleWatched;
