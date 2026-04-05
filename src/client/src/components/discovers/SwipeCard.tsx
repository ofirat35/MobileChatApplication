import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "../../helpers/consts/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AppUserListModel } from "../../models/Users/AppUserListModel";
import { UserImageListDto } from "../../models/Images/UserImageListDto";
import { Text } from "react-native-paper";
import { CustomActivityIndicator } from "../shared/CustomActivityIndicator";
import dayjs from "dayjs";
import { useAppNavigation } from "../../hooks/useAppNavigation";

type SwipeProps = {
  user: AppUserListModel;
};

export function SwipeCard({ user }: SwipeProps) {
  const { navigate } = useAppNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const calculateAge = (birthD: string) => {
    return dayjs().diff(dayjs(birthD), "year");
  };

  const userAge = user?.birthDate ? calculateAge(user.birthDate) : 0;

  useEffect(() => {
    setCurrentImageIndex(0);
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [user?.id, user?.images.length]);

  const handleTap = (direction: "left" | "right") => {
    let nextIndex =
      direction === "right" ? currentImageIndex + 1 : currentImageIndex - 1;
    if (nextIndex < 0 || nextIndex >= user.images.length) return;

    scrollRef.current?.scrollTo({
      x: nextIndex * containerWidth,
      animated: true,
    });
    setCurrentImageIndex(nextIndex);
  };

  const imageTopIndicatorWidth =
    containerWidth > 0 && user.images.length > 0
      ? Math.round(
          (containerWidth - user.images.length * 3 - 20) / user.images.length,
        )
      : 0;

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
        {user.images.map((imagePath, i) => {
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
            {user.images.length > 0 ? (
              user.images.map((img, i) => {
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
