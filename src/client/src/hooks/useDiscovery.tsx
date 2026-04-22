import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ExpiryTimeConsts";
import { QueryKeys } from "../helpers/consts/QueryKeys";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { ChatListModel } from "../models/Chats/ChatListModel";
import { ChatService } from "../services/ChatService";
import { ImageService } from "../services/ImageService";
import { SwipesService } from "../services/SwipesService";

const PAGE_SIZE = 30;

export function useDiscovery() {
  const queryClient = useQueryClient();
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastMatch, setLastChat] = useState<ChatListModel | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: QueryKeys.discovery.base,
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
    queryKey: QueryKeys.user.userImages(foregroundUser?.id),
    queryFn: () => ImageService.GetUserPictures(foregroundUser!.id),
    enabled: !!foregroundUser?.id,
    staleTime: MINIO_PRESIGNEDURL_EXPİRY,
  });

  const { data: backgroundImages = [] } = useQuery({
    queryKey: QueryKeys.user.userImages(backgroundUser?.id),
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
    onSuccess: async (isMatch: boolean, { userId, status }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.interest.base,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.chats.base,
      });
      if (isMatch) {
        const chat = await ChatService.ChatExistsWithUser(userId)!;
        setLastChat({
          ...chat!,
          matchedUser: {
            ...chat!.matchedUser,
            images:
              queryClient.getQueryData(QueryKeys.user.userImages(userId)) || [],
          },
        });
      }
    },
  });

  const nextUser = () => setActiveIndex((prev) => prev + 1);

  const swipe = async (userId: string, status: SwipeStatusEnum) => {
    nextUser();
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
    lastMatch,
    swipe,
  };
}
