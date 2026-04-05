import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "../../helpers/consts/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";
import { AppUserListModel } from "../../models/Users/AppUserListModel";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useAppNavigation } from "../../hooks/useAppNavigation";

type InterestedUserProps = {
  interestedUser: AppUserListModel;
  handleTap: (userId: string, status: SwipeStatusEnum) => void;
};

export function InterestedUser({
  interestedUser,
  handleTap,
}: InterestedUserProps) {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();
  const calculateAge = (birthD: string) => {
    return dayjs().diff(dayjs(birthD), "year");
  };

  return (
    <TouchableOpacity
      style={{ borderRadius: 15 }}
      onPress={async () => {
        navigate("ViewUserProfileScreen", { userId: interestedUser.id });
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 8,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 120,
            height: 30,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.background.lightBlack,
            zIndex: 100,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome
              name="heart"
              size={11}
              color={Colors.background.lightgray}
            />
            <Text
              variant="labelMedium"
              style={{
                color: Colors.text.white,
                textAlign: "center",
                marginLeft: 5,
                fontWeight: "bold",
              }}
            >
              {interestedUser.status === SwipeStatusEnum.like
                ? t("Liked")
                : t("Profile Visited")}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
        }}
      >
        <View
          style={{
            width: "100%",
            height: 150,
            overflow: "hidden",
          }}
        >
          <Image
            resizeMode="stretch"
            source={require("../../../assets/img/img1.png")}
            style={{
              width: "100%",
              height: "100%",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
          ></Image>
        </View>

        <View
          style={{
            backgroundColor: Colors.background.black,
            paddingTop: 10,
            paddingBottom: 15,
            paddingHorizontal: 15,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <View>
            <Text
              variant="titleMedium"
              style={{
                color: Colors.text.white,
                fontWeight: "bold",
                height: 50,
              }}
            >
              {interestedUser.firstName} {interestedUser.lastName},{" "}
              {calculateAge(interestedUser.birthDate)}
            </Text>
            <Text variant="bodyMedium" style={{ color: Colors.text.white }}>
              Arkadaşlık
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 15,
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: Colors.background.white,
                padding: 5,
                width: 40,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
              }}
              onPress={(e) => {
                e.stopPropagation();
                handleTap(interestedUser.id, SwipeStatusEnum.pass);
              }}
            >
              <AntDesign
                name="close"
                size={24}
                color={Colors.background.black}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.background.pink,
                padding: 5,
                width: 40,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
              }}
              onPress={(e) => {
                e.stopPropagation();
                handleTap(interestedUser.id, SwipeStatusEnum.like);
              }}
            >
              <FontAwesome
                name="heart"
                size={20}
                color={Colors.background.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
