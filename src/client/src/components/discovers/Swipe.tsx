import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageSourcePropType,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../helpers/consts/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function Swipe() {
  const imagePaths: ImageSourcePropType[] = [
    require("../../../assets/img/img1.png"),
    require("../../../assets/img/img2.jpg"),
  ];
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  console.log(containerWidth);

  const onPageChanged = (page: NativeSyntheticEvent<NativeScrollEvent>) => {
    const imageId = Math.round(
      page.nativeEvent.contentOffset.x / containerWidth,
    );
    if (activeImage == imageId) return;
    setActiveImage(imageId);
  };

  const imageTopIndicatorWidth =
    containerWidth > 0
      ? Math.round(
          (containerWidth - imagePaths.length * 3 - 20) / imagePaths.length,
        )
      : 0;

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
        {imagePaths.map((imagePath, i) => {
          return (
            <View
              key={i}
              style={{
                width: imageTopIndicatorWidth,
                height: 8,
                borderRadius: 15,
                backgroundColor:
                  activeImage == i
                    ? Colors.background.white
                    : Colors.background.gray,
              }}
            ></View>
          );
        })}
      </View>

      {containerWidth > 0 && (
        <ScrollView
          style={{
            zIndex: 10,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={(p) => onPageChanged(p)}
        >
          {imagePaths.length > 0 &&
            imagePaths.map((img, i) => {
              return (
                <Image
                  key={i}
                  resizeMode="stretch"
                  source={img}
                  style={{
                    width: containerWidth,
                    height: "100%",
                    borderRadius: 10,
                  }}
                ></Image>
              );
            })}
        </ScrollView>
      )}

      <View
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 100,
          paddingHorizontal: 20,
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
            Fırat
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
              %67
            </Text>
          </View>
        </View>
        <Text
          style={{ fontSize: 15, fontWeight: "500", color: Colors.text.white }}
        >
          25 - İzmir
        </Text>
        <Text
          style={{ fontSize: 16, fontWeight: "400", color: Colors.text.white }}
        >
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, facilis
          quo labore at commodi vol dicta praesentium quibusdam ad!
        </Text>
        <TouchableOpacity style={{ paddingVertical: 8, alignItems: "center" }}>
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
