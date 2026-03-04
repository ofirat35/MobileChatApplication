import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { SwipesService } from "../../services/SwipesService";
import { AppUserProfile } from "../../models/Users/AppUserProfile";
import { ImageService } from "../../services/ImageService";
import { UserImageListDto } from "../../models/Images/UserImageListDto";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { resetDiscoveryVersion } from "../../features/slices/discoverySlice";
const { width } = Dimensions.get("window");

export function DiscoverySwipe() {
  const [users, setUsers] = useState<AppUserProfile[]>([]);
  const [backgroundUser, setBackgroundUser] = useState<AppUserProfile | null>(
    null,
  );
  const [foregroundUser, setForegroundUser] = useState<AppUserProfile | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesMap, setImagesMap] = useState<
    Record<string, UserImageListDto[]>
  >({});
  const count = useSelector((_: RootState) => _.discovery.discoveryVersion);
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  useEffect(() => {
    loadUsers();
    return () => {
      dispatch(resetDiscoveryVersion());
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (count > 0) {
      resetDiscovery();
    }
  }, [count]);

  const loadUsers = async () => {
    const data = await SwipesService.GetUsersToSwipe(25, 0);
    setUsers(data);
  };

  const resetDiscovery = async () => {
    setUsers([]);
    setActiveIndex(0);
    setImagesMap({});
    setForegroundUser(null);
    setBackgroundUser(null);

    await loadUsers();
  };

  useEffect(() => {
    const preload = async () => {
      const ids = [users[activeIndex]?.id, users[activeIndex + 1]?.id];

      for (const id of ids) {
        if (id && !imagesMap[id]) {
          const images = await ImageService.GetUserPictures(id);
          setImagesMap((prev) => ({
            ...prev,
            [id]: images,
          }));
        }
      }
      if (users.length - 5 <= activeIndex) {
        const newUsers = await SwipesService.GetUsersToSwipe(25, 5);
        if (newUsers.length > 0) setUsers((prev) => [...prev, ...newUsers]);
      }
    };

    setForegroundUser(users[activeIndex] ?? null);
    preload();
  }, [activeIndex, users]);
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    setBackgroundUser(users[activeIndex + 1] ?? null);
  }, [foregroundUser]);

  const nextUser = () => {
    setActiveIndex((prev) => prev + 1);
  };

  const handleSwipe = async (userId: string, status: SwipeStatusEnum) => {
    if (status == SwipeStatusEnum.like) SwipesService.Like(userId);
    else if (status == SwipeStatusEnum.pass) SwipesService.Pass(userId);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      if (isSwiping.value) return;

      if (Math.abs(translateX.value) > 120) {
        isSwiping.value = true;

        const isLike = translateX.value > 0;
        const userId = users[activeIndex]?.id;
        if (!userId) return;

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
                onSwipe={() => {
                  handleSwipe(foregroundUser.id, SwipeStatusEnum.like);
                  nextUser();
                }}
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
