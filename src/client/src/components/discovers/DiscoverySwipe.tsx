import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Swipe } from "./Swipe";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

export function DiscoverySwipe() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      console.log(translateX.value);
      console.log(translateY.value);
    })
    .onEnd(() => {
      if (translateX.value > 120) {
        translateX.value = withSpring(width * 1.3);
        translateY.value = withSpring(0);
      } else if (translateX.value < -120) {
        translateX.value = withSpring(-500);
        translateY.value = withSpring(0);
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${translateX.value / 20}deg`,
      },
    ],
  }));

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flex: 1, padding: 5 }, cardStyle]}>
          <Swipe />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
