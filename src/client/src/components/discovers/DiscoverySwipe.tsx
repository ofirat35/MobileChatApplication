import { View, Text, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { SwipeCard } from "./SwipeCard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { useDiscovery } from "../../hooks/useDiscovery";
const { width } = Dimensions.get("window");

export function DiscoverySwipe() {
  const {
    backgroundUser,
    foregroundUser,
    getUserImages,
    nextUser,
    handleSwipe,
  } = useDiscovery();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > 120) {
        const isLike = translateX.value > 0;
        const direction = isLike ? width * 1.5 : -width * 1.5;

        translateX.value = withSpring(direction, {}, (finished) => {
          if (finished) {
            runOnJS(handleSwipe)(
              foregroundUser.id,
              isLike ? SwipeStatusEnum.like : SwipeStatusEnum.pass,
            );

            translateX.value = 0;
            translateY.value = 0;

            runOnJS(nextUser)();
          }
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${translateX.value / 20}deg` },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {backgroundUser && (
          <View style={{ position: "absolute", inset: 5, zIndex: 1 }}>
            <SwipeCard
              user={backgroundUser}
              userImages={getUserImages(backgroundUser.id)}
            />
          </View>
        )}

        {foregroundUser && (
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[{ flex: 1, padding: 5, zIndex: 10 }, cardStyle]}
            >
              <SwipeCard
                user={foregroundUser}
                userImages={getUserImages(foregroundUser.id)}
              />
            </Animated.View>
          </GestureDetector>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
