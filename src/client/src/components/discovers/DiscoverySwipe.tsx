import { View, Text, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { Swipe } from "./Swipe";
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
    users,
    backgroundUser,
    foregroundUser,
    activeIndex,
    imagesMap,
    nextUser,
    handleSwipe,
  } = useDiscovery();

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [foregroundUser]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      if (isSwiping.value) return;

      if (Math.abs(translateX.value) > 120) {
        const userId = users![activeIndex]?.id;
        if (!userId) return;

        isSwiping.value = true;
        const isLike = translateX.value > 0;
        runOnJS(handleSwipe)(
          userId,
          isLike ? SwipeStatusEnum.like : SwipeStatusEnum.pass,
        );
        runOnJS(nextUser)();

        const direction = isLike ? width * 1.5 : -width * 1.5;

        translateX.value = withSpring(direction, {}, () => {
          isSwiping.value = false;
        });
      } else {
        // Return to center if swipe wasn't far enough
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${translateX.value / 20}deg` },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, position: "relative" }}>
        {backgroundUser && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              padding: 5,
            }}
          >
            <Swipe
              user={backgroundUser}
              userImages={imagesMap[backgroundUser.id] || []}
            />
          </View>
        )}

        {foregroundUser ? (
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[{ flex: 1, padding: 5, zIndex: 10 }, cardStyle]}
            >
              <Swipe
                user={foregroundUser}
                userImages={imagesMap[foregroundUser.id] || []}
              />
            </Animated.View>
          </GestureDetector>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No more users!</Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
