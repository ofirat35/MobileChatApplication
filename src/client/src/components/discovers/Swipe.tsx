import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../helpers/consts/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSwipe } from "../../hooks/useSwipe";
import { AppUserProfile } from "../../models/Users/AppUserProfile";
import { UserImageListDto } from "../../models/Images/UserImageListDto";
import { SwipesService } from "../../services/SwipesService";
import { useNavigation } from "@react-navigation/native";
import { Loading } from "../shared/Loading";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";

type SwipeProps = {
  user: AppUserProfile;
  userImages: UserImageListDto[];
  onSwipe?: (userId: string, swipeStatus: SwipeStatusEnum) => void;
};

export function Swipe({ user, userImages, onSwipe }: SwipeProps) {
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
    return <Loading fullScreen={false} />;
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
              onPress={() => handleTap("left")}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => handleTap("right")}
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
            style={{
              fontSize: 28,
              fontWeight: "bold",
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
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Colors.text.blue,
              }}
            >
              {`%${user.firstName.length * 15}`}
            </Text>
          </View>
        </View>
        <Text
          style={{ fontSize: 15, fontWeight: "500", color: Colors.text.white }}
        >
          {userAge}
        </Text>
        <Text
          style={{ fontSize: 16, fontWeight: "400", color: Colors.text.white }}
        >
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
              onSwipe: () => onSwipe(),
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
