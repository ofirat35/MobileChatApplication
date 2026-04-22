type QueryKeyType = {
  user: {
    base: string[];
    detail: (userId: string) => string[];
    userImages: (userId: string) => string[];
  };
  interest: {
    base: string[];
  };
  discovery: {
    base: string[];
  };
  chats: {
    base: string[];
    detail: (chatId: string) => string[];
  };
  messages: {
    base: string[];
    withChatId: (chatId: string) => string[];
  };
  profile: {
    base: string[];
  };
  preference: {
    base: string[];
  };
  matches: {
    base: string[];
    userMatches: (userId: string) => string[];
  };
};

export const QueryKeys: QueryKeyType = {
  user: {
    base: ["user"],
    detail: (userId: string) => [...QueryKeys.user.base, userId],
    userImages: (userId: string) => [...QueryKeys.user.base, "images", userId],
  },
  interest: {
    base: ["interest"],
  },
  discovery: {
    base: ["discovery"],
  },
  chats: {
    base: ["chats"],
    detail: (chatId: string) => [...QueryKeys.chats.base, chatId],
  },
  messages: {
    base: ["messages"],
    withChatId: (chatId: string) => [...QueryKeys.messages.base, chatId],
  },
  profile: {
    base: ["profile"],
  },
  preference: {
    base: ["preference"],
  },
  matches: {
    base: ["matches"],
    userMatches: (userId: string) => [
      ...QueryKeys.matches.base,
      "userMatches",
      userId,
    ],
  },
};
