import { discovery } from "expo-auth-session/build/providers/Google";

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
  };
  profile: {
    base: string[];
  };
  preference: {
    base: string[];
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
  },
  profile: {
    base: ["profile"],
  },
  preference: {
    base: ["preference"],
  },
};
