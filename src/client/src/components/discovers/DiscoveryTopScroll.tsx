import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../helpers/consts/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export function DiscoveryTopScroll() {
  const [activeItem, setActiveItem] = useState("Recommended");
  const items = ["Recommended", "Passport", "SuperLikes"];
  const itemClickHandel = (newState: string) => {
    setActiveItem(newState);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        height: 90,
        maxHeight: 90,
        paddingBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: Colors.background.black,
      }}
    >
      {items.map((item, i) => {
        return (
          <View key={i}>
            <Item
              title={item}
              isActive={activeItem === item}
              onClick={itemClickHandel}
            >
              <MaterialCommunityIcons
                name="bow-arrow"
                size={24}
                color="black"
              />
            </Item>
          </View>
        );
      })}
    </ScrollView>
  );
}

const Item = ({
  title,
  images,
  isActive,
  children,
  onClick,
}: {
  title: string;
  images?: string[];
  isActive?: boolean;
  children?: any;
  onClick: any;
}) => {
  return (
    <View
      style={{
        flex: 1,
        width: 90,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isActive ? (
        <TouchableOpacity
          style={{
            backgroundColor: Colors.border.pink,
            padding: 2,
            borderRadius: 30,
          }}
        >
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 29,
              backgroundColor: Colors.background.white,
              zIndex: 100,
              borderWidth: 4,
              borderColor: Colors.border.black,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {children}
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => onClick(title)}>
          <View style={{ width: 80 }}>
            <View
              style={{
                backgroundColor: Colors.border.black,
                borderRadius: 30,

                zIndex: 100,
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../../assets/img/img1.png")}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  borderWidth: 0.4,
                  borderColor: Colors.border.white,
                }}
              ></Image>
            </View>
            <View
              style={{
                position: "absolute",
                left: 20,
                backgroundColor: Colors.border.black,
                borderRadius: 30,
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../../assets/img/img2.jpg")}
                blurRadius={30}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                }}
              ></Image>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <View style={{ marginTop: 2 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: isActive ? Colors.text.white : Colors.text.dirtyWhite,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};
