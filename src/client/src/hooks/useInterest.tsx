import { QueryKeys } from "../helpers/consts/QueryKeys";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { SwipesService } from "../services/SwipesService";
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { UserService } from "../services/UserService";
import { AppUserListModel } from "../models/Users/AppUserListModel";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { useMemo } from "react";
import { ImageService } from "../services/ImageService";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";

export function useInterest() {
  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: QueryKeys.interest.base,
      queryFn: async ({ pageParam }) => {
        return await UserService.GetInterestedUserProfiles(pageParam, 10);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.hasNext) {
          return pages.length + 1;
        }
        return undefined;
      },
    });

  const interests = data?.pages.flatMap((page) => page.data) ?? [];

  const idsToPreload = useMemo(() => {
    return data?.pages[data.pages.length - 1]?.data.map((u) => u.id) ?? [];
  }, [data]);

  useQueries({
    queries: useMemo(
      () =>
        (idsToPreload ?? []).map((id) => ({
          queryKey: QueryKeys.user.userImages(id),
          queryFn: () => ImageService.GetUserPictures(id),
          staleTime: MINIO_PRESIGNEDURL_EXPİRY,
          enabled: !!idsToPreload && idsToPreload.length > 0,
        })),
      [idsToPreload],
    ),
  });

  const getImages = (userId: string): UserImageListDto[] => {
    return (
      queryClient.getQueryData<UserImageListDto[]>(
        QueryKeys.user.userImages(userId),
      ) ?? []
    );
  };

  const swipeMutation = useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: SwipeStatusEnum;
    }) => {
      return status == SwipeStatusEnum.like
        ? SwipesService.Like(userId)
        : SwipesService.Pass(userId);
    },
    onSuccess: (isMatch: boolean, { userId, status }) => {
      queryClient.setQueryData(QueryKeys.interest.base, (oldData: any) => {
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((i: AppUserListModel) => i.id !== userId),
          })),
        };
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.chats.base,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.discovery.base,
      });
    },
  });

  return {
    interests,
    isLoading,
    hasNextPage,
    getImages,
    fetchNextPage,
    refetch,
    swipe: (userId: string, status: SwipeStatusEnum) =>
      swipeMutation.mutate({ userId, status }),
  };
}
