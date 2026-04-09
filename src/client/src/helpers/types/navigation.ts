import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  RootTabNavigationScreen: NavigatorScreenParams<RootTabParamList>;
  ViewUserProfileScreen: { userId: string };
  ChatDetailScreen: { userId?: string; chatId: string };
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type RootTabParamList = {
  DiscoverTab: NavigatorScreenParams<DiscoverStackParamList>;
  InterestTab: NavigatorScreenParams<InterestStackParamList>;
  ChatsTab: NavigatorScreenParams<ChatsStackParamList>;
  PreferenceTab: NavigatorScreenParams<PreferenceStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type DiscoverStackParamList = {
  DiscoverScreen: undefined;
};

export type InterestStackParamList = {
  InterestScreen: undefined;
};

export type ChatsStackParamList = {
  ChatsScreen: undefined;
};

export type PreferenceStackParamList = {
  PreferenceScreen: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
};
