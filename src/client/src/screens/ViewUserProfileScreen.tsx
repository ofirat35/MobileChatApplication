import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "../helpers/consts/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";
import { InterestedUserProfile } from "../models/UserProfiles/InterestedUserProfile";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRoute } from "@react-navigation/native";
import { UserProfileService } from "../services/UserProfileService";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { ImageService } from "../services/ImageService";
import { SwipesService } from "../services/SwipesService";
import { Text } from "react-native-paper";
import { GenderEnum } from "../helpers/enums/GenderEnum";
import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { removeUser } from "../features/slices/discoverySlice";

const { width, height } = Dimensions.get("window");

type ViewUserProfileProps = {
  navigation: any;
};

export function ViewUserProfileScreen({ navigation }: ViewUserProfileProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [user, setUser] = useState<InterestedUserProfile | null>(null);
  const [images, setImages] = useState<UserImageListDto[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const route = useRoute();
  const { userId } = route.params as { userId: string };
  const imageTopIndicatorWidth =
    width > 0 && images.length > 1
      ? Math.round((width - images.length * 3 - 50) / images.length)
      : 0;

  useEffect(() => {
    const loadUser = async () => {
      if (userId) {
        UserProfileService.GetUserProfile(userId).then((res) => setUser(res));
        ImageService.GetUserPictures(userId).then((res) => setImages(res));
      }
    };

    loadUser();
    userId && SwipesService.ViewProfile(userId);
  }, []);
  const calculateAge = (birthD: string) => {
    return dayjs().diff(dayjs(birthD), "year");
  };
  const handleSwipeStatus = async (userId: string, status: SwipeStatusEnum) => {
    if (status == SwipeStatusEnum.like) SwipesService.Like(userId);
    else if (status == SwipeStatusEnum.pass) SwipesService.Pass(userId);

    dispatch(removeUser(userId));

    navigation.goBack();
  };

  if (!user) {
    return <CustomActivityIndicator visible={true}></CustomActivityIndicator>;
  }

  return (
    <View>
      <ScrollView
        style={{ height: height }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        <View
          style={{
            width: width,
            position: "absolute",
            top: 5,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            zIndex: 90,
            paddingHorizontal: 20,
          }}
        >
          {images.map((imagePath, i) => {
            return (
              <View
                key={i}
                style={{
                  width: imageTopIndicatorWidth,
                  height: 8,
                  borderRadius: 15,
                  backgroundColor:
                    currentImageIndex == i
                      ? Colors.background.white
                      : Colors.background.gray,
                }}
              ></View>
            );
          })}
        </View>
        {user.status && (
          <View
            style={{
              position: "absolute",
              top: 360,
              left: 20,
              width: 120,
              height: 30,
              borderRadius: 15,
              display: "flex",
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
                variant="titleSmall"
                style={{
                  color: Colors.text.white,
                  textAlign: "center",
                  marginLeft: 5,
                }}
              >
                {user.status === SwipeStatusEnum.like
                  ? t("Liked")
                  : t("Profile Visited")}
              </Text>
            </View>
          </View>
        )}

        <ScrollView
          style={{
            zIndex: 10,
            height: 400,
          }}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled={true}
        >
          {images.length > 0 ? (
            images.map((img, i) => {
              return (
                <Image
                  key={i}
                  resizeMode="stretch"
                  source={{ uri: img.imagePath }}
                  style={{
                    width: width,
                    height: "100%",
                  }}
                ></Image>
              );
            })
          ) : (
            <Image
              resizeMode="stretch"
              source={require("../../assets/img/img1.png")}
              style={{
                width: width,
                height: "100%",
              }}
            ></Image>
          )}
        </ScrollView>
        <View>
          <View style={{ backgroundColor: Colors.background.white }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 30,
                  paddingVertical: 25,
                }}
              >
                <View>
                  <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                    {user.user.firstName} {user.user.lastName}
                  </Text>
                  <Text variant="bodyLarge" style={{ color: Colors.text.gray }}>
                    {`${calculateAge(user.user.birthDate)} - İzmir`}
                  </Text>
                </View>
                <View>
                  <Entypo name="dots-three-vertical" size={24} color="black" />
                </View>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.background.lightgray,
                }}
              ></View>
              <View
                style={{
                  paddingHorizontal: 30,
                  paddingVertical: 20,
                }}
              >
                <View
                  style={{
                    marginBottom: 15,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <SimpleLineIcons
                    name="info"
                    size={20}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                  <View>
                    <Text variant="bodyLarge">
                      {t(GenderEnum[user.user.gender])}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="eye-outline"
                    size={20}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                  <View>
                    <Text variant="bodyLarge">Arkadaşlık</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
            <Text
              variant="titleLarge"
              style={{ fontWeight: "bold", marginBottom: 10 }}
            >
              {t("About")}
            </Text>
            <Text variant="bodyLarge" style={{ textAlign: "justify" }}>
              {user.user.bio ?? "..."}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 70,
          position: "absolute",
          bottom: 60,
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: Colors.background.white,
            padding: 5,
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
          }}
          onPress={() => handleSwipeStatus(user.user.id, SwipeStatusEnum.pass)}
        >
          <AntDesign name="close" size={28} color={Colors.background.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.background.pink,
            padding: 5,
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
          }}
          onPress={() => handleSwipeStatus(user.user.id, SwipeStatusEnum.like)}
        >
          <FontAwesome name="heart" size={28} color={Colors.background.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
