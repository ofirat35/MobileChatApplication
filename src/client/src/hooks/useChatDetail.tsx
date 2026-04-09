import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ImageService } from "../services/ImageService";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";
import { UserService } from "../services/UserService";
import { QueryKeys } from "../helpers/consts/QueryKeys";
import { ChatService } from "../services/ChatService";
import { MessageCreateModel } from "../models/Messages/MessageCreateModel";
import { useMemo } from "react";

const PAGE_SIZE = 20;
type useChatDetailProps = {
  userId: string;
  chatId: string;
};
export function useChatDetail({ userId, chatId }: useChatDetailProps) {
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

  const {
    data: messagesList,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: QueryKeys.chats.detail(userId),
    queryFn: ({ pageParam }) => {
      return ChatService.GetChatById(chatId, pageParam, PAGE_SIZE);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNext ? pages.length + 1 : undefined;
    },
  });

  const messages = useMemo(() => {
    return messagesList?.pages.flatMap((page) => page.data) ?? [];
  }, [messagesList]);

  const sendMessageMutation = useMutation({
    mutationFn: ({ message }: { message: MessageCreateModel }) =>
      ChatService.SendMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.interest.base,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.chats.base,
      });
    },
  });

  const removeMessageMutation = useMutation({
    mutationFn: ({ messageId }: { messageId: string }) =>
      ChatService.RemoveMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.interest.base,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.chats.base,
      });
    },
  });

  const removeChatMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      ChatService.RemoveChat(userId),
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
    messages,
    hasNextPage,
    fetchMessages: fetchNextPage,
    removeChat: async (userId: string) =>
      await removeChatMutation.mutateAsync({ userId }),
    sendMessage: async (message: MessageCreateModel) =>
      await sendMessageMutation.mutateAsync({ message }),
    removeMessage: async (messageId: string) =>
      await removeMessageMutation.mutateAsync({ messageId }),
  };
}
