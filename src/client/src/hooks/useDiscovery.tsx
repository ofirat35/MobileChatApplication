import { useState, useMemo, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { SwipesService } from "../services/SwipesService";
import { ImageService } from "../services/ImageService";
import { UserImageListDto } from "../models/Images/UserImageListDto";

export function useDiscovery() {
  const queryClient = useQueryClient();
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["discovery-users"],
      queryFn: ({ pageParam }) =>
        SwipesService.GetUsersToSwipe(25, pageParam as string[]),
      initialPageParam: [] as string[],
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return undefined;

        const currentStack = allPages.flat().slice(activeIndex);
        return currentStack.map((user) => user.id);
      },
      staleTime: 1000 * 60 * 2,
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

    const idsToPreload = users
      .slice(activeIndex, activeIndex + 4)
      .map((u) => u.id);

    idsToPreload.forEach((id) => {
      queryClient.ensureQueryData({
        queryKey: ["user-images", id],
        queryFn: () => ImageService.GetUserPictures(id),
        staleTime: 1000 * 60 * 10,
      });
    });
  }, [activeIndex, users]);

  const foregroundUser = users[activeIndex];
  const backgroundUser = users[activeIndex + 1];

  const getUserImages = (userId?: string): UserImageListDto[] => {
    if (!userId) return [];
    return (
      queryClient.getQueryData<UserImageListDto[]>(["user-images", userId]) ||
      []
    );
  };

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interests-users"],
        exact: true,
      });

      // eşleşme oldusa chatte invalidate edilmeli
      // queryClient.invalidateQueries({
      //   queryKey: ["interests-users"],
      //   exact: true,
      // });
    },
  });

  const nextUser = () => setActiveIndex((prev) => prev + 1);

  const handleSwipe = (userId: string, status: SwipeStatusEnum) => {
    swipeMutation.mutate({ userId, status });
  };

  return {
    users,
    foregroundUser,
    backgroundUser,
    activeIndex,
    isLoading,
    nextUser,
    handleSwipe,
    getUserImages,
  };
}
