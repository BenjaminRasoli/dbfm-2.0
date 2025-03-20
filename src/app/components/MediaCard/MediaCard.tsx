"use client";
import { FaBookmark, FaRegBookmark, FaWindowClose } from "react-icons/fa";
import { RiStarSFill } from "react-icons/ri";
import { MediaTypes } from "@/app/Types/MediaTypes";
import { MediaCardTypes } from "@/app/Types/MediaCardTypes";
import Image from "next/image";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import MovieTvPlaceHolder from "../../images/poster-image.png";
import PersonPlaceHolder from "../../images/personposter.jpg";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/config/FireBaseConfig";
import { useUser } from "@/app/context/UserProvider";
import { disableOverflow } from "@/app/utils/HandleDOM";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";

function MediaCard({ media, loading }: MediaCardTypes) {
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<MediaTypes | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    disableOverflow(isModalOpen || isConfirmModalOpen);
    return () => disableOverflow(false);
  }, [isModalOpen, isConfirmModalOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleOutsideClick(e, modalRef, setIsModalOpen);
      handleOutsideClick(e, modalRef, setIsConfirmModalOpen);
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

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

          const updatedFavorites = [
            ...favorites,
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

          setFavorites(updatedFavorites);
          localStorage.setItem(
            "favoriteMovies",
            JSON.stringify(updatedFavorites)
          );
        }
      } catch (error) {
        console.error("Error adding/removing movie to/from favorites:", error);
      }
    }
  };

  const handleRemoveConfirmation = async () => {
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
        const updatedFavorites = favorites.filter(
          (favorite) => favorite.id !== itemToRemove.id
        );
        setFavorites(updatedFavorites);

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

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
    setItemToRemove(null);
  };

  useEffect(() => {
    if (user) {
      fetchFavoritesFromFirebase(user.uid);
    }
  }, [user]);

  const fetchFavoritesFromFirebase = async (userId: string) => {
    const q = query(collection(db, "userFavoriteList", userId, "favorites"));
    try {
      const querySnapshot = await getDocs(q);
      const fetchedFavorites = querySnapshot.docs.map((doc) => doc.data());
      setFavorites(fetchedFavorites);
    } catch (error) {
      console.error("Error fetching favorites: ", error);
      setFavorites([]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2 custom:grid-cols-3 2xl:grid-cols-4 gap-5 pt-10">
        {loading || !media || media.length === 0
          ? Array.from({ length: 6 }, (_, index) => (
              <SkeletonLoader key={index} />
            ))
          : media?.map((media: MediaTypes) => (
              <div key={media.id} className="w-[300px] h-[580px] mb-3 relative">
                <Link
                  href={
                    media.media_type
                      ? `/${media.media_type}/${media.id}`
                      : `/movie/${media.id}`
                  }
                  className="block w-full h-full group"
                >
                  <div className="relative w-full h-[400px] overflow-hidden rounded-t-lg">
                    <Image
                      src={
                        media.media_type !== "person"
                          ? media.poster_path === null
                            ? MovieTvPlaceHolder
                            : `https://image.tmdb.org/t/p/w500/${media.poster_path}`
                          : media.profile_path === null
                          ? PersonPlaceHolder
                          : `https://image.tmdb.org/t/p/w500/${media.profile_path}`
                      }
                      alt={media.title || media.name || "Unknown title"}
                      width={300}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out scale-100 group-hover:scale-110"
                      priority
                    />
                  </div>

                  <div className="pb-4 p-2 shadow-2xl rounded-b-lg h-[120px]">
                    {media.media_type !== "person" && (
                      <div className="flex mt-2">
                        <span className="text-yellow-400">
                          <RiStarSFill size={20} />
                        </span>
                        <span className="ml-1 text-sm text-dark">
                          {media.vote_average || 0}
                        </span>
                      </div>
                    )}

                    <div className="mt-2">
                      <h3 className="text-xl font-semibold text-dark overflow-hidden text-ellipsis whitespace-nowrap">
                        {media.title || media.name || "Unknown name"}
                      </h3>
                    </div>

                    <p className="text-dark">
                      {media.media_type !== "person" &&
                        (media.release_date ||
                          media.first_air_date ||
                          "Unknown date")}
                    </p>
                  </div>
                </Link>

                {media.media_type !== "person" && (
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
              </div>
            ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-[55]">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.5 }}
          ></div>

          <div
            ref={modalRef}
            className="bg-white w-[300px] h-[200px] flex flex-col rounded-lg shadow-lg p-6 relative z-[55]"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 cursor-pointer text-black hover:text-red-hover"
            >
              <FaWindowClose size={24} />
            </button>

            <p className="text-lg font-semibold text-center my-auto">
              Please Register or Login to add media to your favorite list
            </p>
            <div className="flex justify-between px-10 ">
              <Link
                className="bg-blue hover:bg-blue-hover rounded-lg p-2 text-white"
                href={"/login"}
              >
                Login
              </Link>
              <Link
                className="bg-blue hover:bg-blue-hover rounded-lg p-2 text-white"
                href={"/register"}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && itemToRemove && (
        <div className="fixed inset-0 flex justify-center items-center z-[55]">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.5 }}
          ></div>

          <div
            ref={modalRef}
            className="bg-white w-[300px] h-[200px] flex flex-col rounded-lg shadow-lg p-6 relative z-[55]"
          >
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 cursor-pointer text-black hover:text-red-hover"
            >
              <FaWindowClose size={24} />
            </button>

            <p className="text-lg font-semibold text-center my-auto">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Are you sure you want to remove "
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              {itemToRemove.title || itemToRemove.name}" from your favorites?
            </p>
            <div className="flex justify-between px-5 gap-2">
              <button
                onClick={handleRemoveConfirmation}
                className="cursor-pointer bg-red hover:bg-red-hover rounded-lg p-2 text-white"
              >
                Yes, Remove
              </button>
              <button
                onClick={handleCancel}
                className="cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-lg p-2 text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MediaCard;
