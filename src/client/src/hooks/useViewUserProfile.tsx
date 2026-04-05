import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../services/UserService";
import { keycloakService } from "../helpers/Auth/keycloak";
import { AppUserListModel } from "../models/Users/AppUserListModel";
import { ImageService } from "../services/ImageService";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";
import { QueryKeys } from "../helpers/consts/QueryKeys";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { SwipesService } from "../services/SwipesService";
import { useEffect } from "react";
type UseViewUserProfileProps = { userId: string };

export function useViewUserProfile({ userId }: UseViewUserProfileProps) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: QueryKeys.profile.base,
    queryFn: async () => {
      const authenticated = await keycloakService.isAuthenticated();
      if (!authenticated) return null;

      return UserService.getUserById(userId);
    },
    staleTime: 1000 * 10,
  });

  const { data: images } = useQuery({
    queryKey: QueryKeys.user.userImages(userId ?? ""),
    queryFn: () => {
      return ImageService.GetUserPictures(userId ?? "");
    },
    enabled: !!user,
    staleTime: MINIO_PRESIGNEDURL_EXPİRY,
  });

  const swipeMutation = useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: SwipeStatusEnum;
    }) => {
      switch (status) {
        case SwipeStatusEnum.like:
          return SwipesService.Like(userId);
        case SwipeStatusEnum.pass:
          return SwipesService.Pass(userId);
        case SwipeStatusEnum.profileVisited:
          return SwipesService.ViewProfile(userId);
      }
    },
    onSuccess: (isMatch: boolean, { userId, status }) => {
      if (status === SwipeStatusEnum.profileVisited) return;

      queryClient.setQueryData(QueryKeys.discovery.base, (oldData: any) => {
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) =>
            page.filter((item: AppUserListModel) => item.id !== userId),
          ),
        };
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.chats.base,
      });
    },
  });

  useEffect(() => {
    userId &&
      swipeMutation.mutate({ userId, status: SwipeStatusEnum.profileVisited });
  }, [userId]);

  return {
    user: { ...user, images },
    isLoading,
    swipe: (userId: string, status: SwipeStatusEnum) =>
      swipeMutation.mutate({ userId, status }),
  };
}
