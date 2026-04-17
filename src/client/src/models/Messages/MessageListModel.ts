import { AppUserListModel } from "../Users/AppUserListModel";

export type MessageListModel = {
  id: string;
  chatId: string;
  sender: AppUserListModel;
  content: string;
  isRead: boolean;
  createdDate: string;
};
