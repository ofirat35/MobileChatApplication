import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "../services/ChatService";
import { ImageService } from "../services/ImageService";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";
import { UserService } from "../services/UserService";
import { QueryKeys } from "../helpers/consts/QueryKeys";
import { MatchesService } from "../services/MatchesService";

const PAGE_SIZE = 10;
type useMessageProps = {
  userId: string;
};
export function useMessage({ userId }: useMessageProps) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: QueryKeys.user.detail(userId),
    queryFn: () => UserService.getUserById(userId),
  });

  const { data: userImages } = useQuery({
    queryKey: QueryKeys.user.userImages(userId),
    queryFn: () => ImageService.GetUserPictures(userId),
    staleTime: MINIO_PRESIGNEDURL_EXPİRY,
  });

  const removeMatchMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      MatchesService.RemoveMatch(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.interest.base,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.chats.base,
      });
    },
  });

  return {
    user: { ...user, images: userImages },
    isLoading,
    removeMatch: async (userId: string) =>
      await removeMatchMutation.mutateAsync({ userId }),
  };
}
