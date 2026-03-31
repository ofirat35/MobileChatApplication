import { View } from "react-native";
import React from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { useDiscovery } from "../../hooks/useDiscovery";
import { SwipeableCard } from "./SwipeableCard";

export function DiscoverySwipe() {
  const { backgroundUser, foregroundUser, nextUser, handleSwipe } =
    useDiscovery();

  const onSwipeComplete = (isLike: boolean) => {
    handleSwipe(
      foregroundUser!.id,
      isLike ? SwipeStatusEnum.like : SwipeStatusEnum.pass,
    );

    nextUser();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {backgroundUser && (
          <SwipeableCard
            key={backgroundUser.id}
            user={backgroundUser}
            isForeground={false}
            onSwipe={() => {}}
          />
        )}

        {foregroundUser && (
          <SwipeableCard
            key={foregroundUser.id}
            user={foregroundUser}
            isForeground={true}
            onSwipe={onSwipeComplete}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}
