// SwipeableCard.tsx
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { SwipeCard } from "./SwipeCard";
import { AppUserProfile } from "../../models/Users/AppUserProfile";

const { width } = Dimensions.get("window");

type SwipeableCardProps = {
  user: AppUserProfile;
  onSwipe: (isLike: boolean) => void;
  isForeground: boolean;
};

export function SwipeableCard({
  user,
  onSwipe,
  isForeground,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(isForeground)
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
            runOnJS(onSwipe)(isLike);
          }
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${translateX.value / 20}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[{ position: "absolute", inset: 5 }, animatedStyle]}
      >
        <SwipeCard user={user} />
      </Animated.View>
    </GestureDetector>
  );
}
