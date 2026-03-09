import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { SwipesService } from "../services/SwipesService";
import { ImageService } from "../services/ImageService";
import {
  // addUsers,
  resetDiscoveryVersion,
  // setUsers,
} from "../features/slices/discoverySlice";
import { RootState } from "../app/store";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { AppUserProfile } from "../models/Users/AppUserProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export function useDiscovery() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<AppUserProfile[]>([]);
  const [imagesMap, setImagesMap] = useState<
    Record<string, UserImageListDto[]>
  >({});
  const [activeIndex, setActiveIndex] = useState(0);

  const [foregroundUser, setForegroundUser] = useState<AppUserProfile>();
  const [backgroundUser, setBackgroundUser] = useState<AppUserProfile>();

  useEffect(() => {
    init();
    return () => {
      dispatch(resetDiscoveryVersion());
    };
  }, []);

  useEffect(() => {
    preloadUsers().then(() => {
      users.length && setForegroundUser(users[activeIndex]);
    });
  }, [activeIndex, users.length]);

  useEffect(() => {
    setBackgroundUser(users[activeIndex + 1]);
  }, [foregroundUser]);

  const init = async () => {
    const data = await SwipesService.GetUsersToSwipe(25, 0);
    setUsers(data);
    preloadImages(data.slice(0, 2).map((u) => u.id));
  };

  const preloadUsers = async () => {
    if (!users || !users.length) return;

    const ids = [users[activeIndex]?.id, users[activeIndex + 1]?.id].filter(
      Boolean,
    );
    await preloadImages(ids);

    if (users.length - activeIndex <= 5) {
      const newUsers = await SwipesService.GetUsersToSwipe(25, 5);
      if (newUsers.length) setUsers((prev) => [...prev, ...newUsers]);
    }
  };

  const preloadImages = async (ids: string[]) => {
    const idsToFetch = ids.filter((id) => id && !imagesMap[id]);
    if (!idsToFetch.length) return;

    const newImages: Record<string, UserImageListDto[]> = {};
    await Promise.all(
      idsToFetch.map(async (id) => {
        const images = await ImageService.GetUserPictures(id);
        newImages[id] = images;
      }),
    );

    if (Object.keys(newImages).length > 0) {
      setImagesMap((prev) => ({ ...prev, ...newImages }));
    }
  };

  const nextUser = () => setActiveIndex((prev) => prev + 1);

  const handleSwipe = async (userId: string, status: SwipeStatusEnum) => {
    if (status === SwipeStatusEnum.like) SwipesService.Like(userId);
    else if (status === SwipeStatusEnum.pass) SwipesService.Pass(userId);
  };

  return {
    users,
    foregroundUser,
    backgroundUser,
    activeIndex,
    imagesMap,
    nextUser,
    handleSwipe,
  };
}
