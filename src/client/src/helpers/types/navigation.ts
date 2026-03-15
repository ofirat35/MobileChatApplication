import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  RootTabNavigationScreen: NavigatorScreenParams<RootTabParamList>;
  ViewUserProfileScreen: { userId: string };
  MessageScreen: { userId?: string };
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type RootTabParamList = {
  DiscoverTab: NavigatorScreenParams<DiscoverStackParamList>;
  InterestTab: NavigatorScreenParams<InterestStackParamList>;
  ChatTab: NavigatorScreenParams<ChatStackParamList>;
  PreferenceTab: NavigatorScreenParams<PreferenceStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type DiscoverStackParamList = {
  DiscoverScreen: undefined;
};

export type InterestStackParamList = {
  InterestScreen: undefined;
};

export type ChatStackParamList = {
  ChatScreen: undefined;
};

export type PreferenceStackParamList = {
  PreferenceScreen: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
};
