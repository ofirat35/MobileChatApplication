import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../services/UserService";
import { keycloakService } from "../helpers/Auth/keycloak";
import { AppUserListModel } from "../models/Users/AppUserListModel";
import { ImageService } from "../services/ImageService";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";

export function useProfile() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const authenticated = await keycloakService.isAuthenticated();
      if (!authenticated) return null;

      const id = await keycloakService.getCurrentUserId();
      return UserService.getUserById(id!);
    },
    staleTime: 1000 * 10,
  });
  const { data: images } = useQuery({
    queryKey: ["user-images", user?.id],
    queryFn: () => {
      return ImageService.GetUserPictures(user!.id);
    },
    enabled: !!user,
    staleTime: MINIO_PRESIGNEDURL_EXPİRY,
  });

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser: AppUserListModel) =>
      UserService.updateUser(updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
        exact: true,
      });
    },
  });

  const setBirthDate = (date: Date) => {
    if (!user) return;

    queryClient.setQueryData<AppUserListModel>(["profile"], {
      ...user,
      birthDate: date.toISOString().split("T")[0],
    });
  };

  return {
    user,
    isLoading,
    isError,
    images,
    updateUser: (updatedUser: AppUserListModel) =>
      updateUserMutation.mutateAsync(updatedUser),
    setBirthDate,
  };
}
