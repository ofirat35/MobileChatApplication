import { MessageListModel } from "../Messages/MessageListModel";
import { AppUserListModel } from "../Users/AppUserListModel";

export type ChatListModel = {
  id: string;
  matchedUser: AppUserListModel;
  messages: MessageListModel[];
  unreadCount: number;
};
