import { useState, useMemo, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { SwipesService } from "../services/SwipesService";
import { ImageService } from "../services/ImageService";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";
import { AppUserListModel } from "../models/Users/AppUserListModel";
import { AppUserProfile } from "../models/Users/AppUserProfile";

const PAGE_SIZE = 30;

export function useDiscovery() {
  const queryClient = useQueryClient();
  const [activeIndex, setActiveIndex] = useState(0);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [lastMatchedUser, setLastMatchedUser] = useState<AppUserProfile | null>(
    null,
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["discovery-users"],
      queryFn: ({ pageParam }) =>
        SwipesService.GetUsersToSwipe(PAGE_SIZE, pageParam as string[]),
      initialPageParam: [] as string[],
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return undefined;

        const currentStack = allPages.flat().slice(activeIndex);
        return currentStack.map((user) => user.id);
      },
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 10,
    });

  const users = useMemo(() => {
    const allUsers = data?.pages.flat() || [];
    return Array.from(new Map(allUsers.map((u) => [u.id, u])).values());
  }, [data]);

  useEffect(() => {
    if (users.length === 0) return;

    const remaining = users.length - activeIndex;
    if (remaining <= 5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [activeIndex, users]);

  const foregroundUser = users[activeIndex];
  const backgroundUser = users[activeIndex + 1];

  const { data: foregroundImages = [] } = useQuery({
    queryKey: ["user-images", foregroundUser?.id],
    queryFn: () => ImageService.GetUserPictures(foregroundUser!.id),
    enabled: !!foregroundUser?.id,
    staleTime: MINIO_PRESIGNEDURL_EXPİRY,
  });

  const { data: backgroundImages = [] } = useQuery({
    queryKey: ["user-images", backgroundUser?.id],
    queryFn: () => ImageService.GetUserPictures(backgroundUser!.id),
    enabled: !!backgroundUser?.id,
    staleTime: MINIO_PRESIGNEDURL_EXPİRY,
  });

  const swipeMutation = useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: SwipeStatusEnum;
    }) =>
      status === SwipeStatusEnum.like
        ? SwipesService.Like(userId)
        : SwipesService.Pass(userId),
    onSuccess: (isMatch: boolean, { userId, status }) => {
      queryClient.invalidateQueries({
        queryKey: ["interests-users"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["chats"],
        exact: true,
      });
      setMatchModalVisible(true);
      if (isMatch) {
        const matchedUser = users.find((u) => u.id === userId);
        setLastMatchedUser({
          ...matchedUser!,
          images: queryClient.getQueryData(["user-images", userId]) || [],
        });
        setMatchModalVisible(true);
      }
    },
  });

  const nextUser = () => setActiveIndex((prev) => prev + 1);

  const handleSwipe = async (userId: string, status: SwipeStatusEnum) => {
    return swipeMutation.mutateAsync({ userId, status });
  };

  return {
    users,
    foregroundUser: foregroundUser
      ? { ...foregroundUser, images: foregroundImages }
      : null,
    backgroundUser: backgroundUser
      ? { ...backgroundUser, images: backgroundImages }
      : null,
    activeIndex,
    isLoading,
    matchModalVisible,
    setMatchModalVisible,
    lastMatchedUser,
    nextUser,
    handleSwipe,
  };
}
