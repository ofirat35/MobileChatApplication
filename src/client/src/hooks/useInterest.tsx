import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { SwipesService } from "../services/SwipesService";
import { UserProfileService } from "../services/UserProfileService";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export function useInterest() {
  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["interests-users"],
      queryFn: async ({ pageParam }) => {
        return await UserProfileService.GetInterestedUserProfiles(
          pageParam,
          10,
        );
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

  const handleTap = async (userId: string, status: SwipeStatusEnum) => {
    if (status === SwipeStatusEnum.like) {
      SwipesService.Like(userId);
    } else if (status === SwipeStatusEnum.pass) {
      SwipesService.Pass(userId);
    }

    queryClient.invalidateQueries({
      queryKey: ["chats"],
      exact: true,
    });
    queryClient.invalidateQueries({
      queryKey: ["discovery-users"],
      exact: true,
    });
    queryClient.setQueryData(["interests-users"], (old: any) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.filter((i: any) => i.user.id !== userId),
        })),
      };
    });
  };

  return {
    interests,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch,
    handleTap,
  };
}
