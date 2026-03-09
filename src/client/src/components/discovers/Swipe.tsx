import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Colors } from "../../helpers/consts/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSwipe } from "../../hooks/useSwipe";
import { AppUserProfile } from "../../models/Users/AppUserProfile";
import { UserImageListDto } from "../../models/Images/UserImageListDto";
import { useNavigation } from "@react-navigation/native";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { Text } from "react-native-paper";
import { CustomActivityIndicator } from "../shared/CustomActivityIndicator";

type SwipeProps = {
  user: AppUserProfile;
  userImages: UserImageListDto[];
};

export function Swipe({ user, userImages }: SwipeProps) {
  const { navigate } = useNavigation();
  const {
    userAge,
    currentImageIndex,
    scrollRef,
    imageTopIndicatorWidth,
    containerWidth,
    setContainerWidth,
    handleTap,
  } = useSwipe(user, userImages);

  if (!user) {
    return <CustomActivityIndicator visible={true}></CustomActivityIndicator>;
  }
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
      }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 10,
          zIndex: 200,
          justifyContent: "space-between",
          flexDirection: "row",
          paddingHorizontal: 10,
          width: "100%",
        }}
      >
        {userImages.map((imagePath, i) => {
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

      {containerWidth > 0 && (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{
              zIndex: 10,
            }}
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            scrollEnabled={true}
          >
            {userImages.length > 0 ? (
              userImages.map((img, i) => {
                return (
                  <Image
                    key={i}
                    resizeMode="stretch"
                    source={{ uri: img.imagePath }}
                    style={{
                      width: containerWidth,
                      height: "100%",
                      borderRadius: 10,
                    }}
                  ></Image>
                );
              })
            ) : (
              <Image
                resizeMode="stretch"
                source={require("../../../assets/img/img1.png")}
                style={{
                  width: containerWidth,
                  height: "100%",
                  borderRadius: 10,
                }}
              ></Image>
            )}
          </ScrollView>
          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              flexDirection: "row",
              zIndex: 50,
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                handleTap("left");
              }}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                handleTap("right");
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}

      <View
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 100,
          paddingHorizontal: 20,
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            variant="titleLarge"
            style={{
              color: Colors.text.white,
              marginRight: 15,
            }}
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <View
            style={{
              width: 50,
              height: 30,
              backgroundColor: Colors.background.white,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
            }}
          >
            <Text
              variant="labelMedium"
              style={{
                fontWeight: "bold",
                color: Colors.text.blue,
              }}
            >
              {`%${user.firstName.length * 15}`}
            </Text>
          </View>
        </View>
        <Text variant="bodyLarge" style={{ color: Colors.text.white }}>
          {userAge}
        </Text>
        <Text variant="bodyLarge" style={{ color: Colors.text.white }}>
          {user?.bio ?? "-"}
        </Text>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            alignItems: "center",
          }}
          onPress={() =>
            navigate("ViewUserProfileScreen", {
              userId: user.id,
            })
          }
        >
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={Colors.text.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
