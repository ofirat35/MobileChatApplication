import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { SwipesService } from "../services/SwipesService";
import { ImageService } from "../services/ImageService";
import { resetDiscoveryVersion } from "../features/slices/discoverySlice";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { RootState } from "../app/store";
import { AppUserProfile } from "../models/Users/AppUserProfile";

export function useDiscovery() {
  const [users, setUsers] = useState<AppUserProfile[]>([]);
  const [backgroundUser, setBackgroundUser] = useState<AppUserProfile | null>(
    null,
  );
  const [foregroundUser, setForegroundUser] = useState<AppUserProfile | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesMap, setImagesMap] = useState<
    Record<string, UserImageListDto[]>
  >({});
  const count = useSelector((_: RootState) => _.discovery.discoveryVersion);
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);

  useEffect(() => {
    loadUsers();
    return () => {
      dispatch(resetDiscoveryVersion());
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (count > 0) {
      resetDiscovery();
    }
  }, [count]);

  useEffect(() => {
    const preload = async () => {
      const ids = [users[activeIndex]?.id, users[activeIndex + 1]?.id];

      for (const id of ids) {
        if (id && !imagesMap[id]) {
          const images = await ImageService.GetUserPictures(id);
          setImagesMap((prev) => ({
            ...prev,
            [id]: images,
          }));
        }
      }
      if (users.length - 5 <= activeIndex) {
        const newUsers = await SwipesService.GetUsersToSwipe(25, 5);
        if (newUsers.length > 0) setUsers((prev) => [...prev, ...newUsers]);
      }
    };

    setForegroundUser(users[activeIndex] ?? null);
    preload();
  }, [activeIndex, users]);

  useEffect(() => {
    setBackgroundUser(users[activeIndex + 1] ?? null);
  }, [foregroundUser]);

  const loadUsers = async () => {
    const data = await SwipesService.GetUsersToSwipe(25, 0);
    setUsers(data);
  };

  const resetDiscovery = async () => {
    setUsers([]);
    setActiveIndex(0);
    setImagesMap({});
    setForegroundUser(null);
    setBackgroundUser(null);

    await loadUsers();
  };

  const nextUser = () => {
    setActiveIndex((prev) => prev + 1);
  };

  const handleSwipe = async (userId: string, status: SwipeStatusEnum) => {
    if (status == SwipeStatusEnum.like) SwipesService.Like(userId);
    else if (status == SwipeStatusEnum.pass) SwipesService.Pass(userId);
  };

  return {
    users,
    backgroundUser,
    foregroundUser,
    activeIndex,
    imagesMap,
    nextUser,
    handleSwipe,
  };
}
