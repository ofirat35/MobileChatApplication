import { View } from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { useDiscovery } from "../../hooks/useDiscovery";
import { SwipeableCard } from "./SwipeableCard";
import { MatchOccuredModal } from "./MatchOccuredModal";

export function DiscoverySwipe() {
  const { backgroundUser, foregroundUser, lastMatchedUser, swipe } =
    useDiscovery();
  const [matchModalVisible, setMatchModalVisible] = useState(false);

  const onSwipeHandler = async (isLike: boolean) => {
    let isMatch = await swipe(
      foregroundUser!.id,
      isLike ? SwipeStatusEnum.like : SwipeStatusEnum.pass,
    );
    setMatchModalVisible(isMatch);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {backgroundUser && (
          <SwipeableCard
            key={backgroundUser.id}
            user={backgroundUser}
            isForeground={false}
          />
        )}

        {foregroundUser && (
          <SwipeableCard
            key={foregroundUser.id}
            user={foregroundUser}
            isForeground={true}
            onSwipe={onSwipeHandler}
          />
        )}
      </View>
      <MatchOccuredModal
        visible={matchModalVisible}
        onClose={() => setMatchModalVisible(false)}
        matchedUser={lastMatchedUser}
      />
    </GestureHandlerRootView>
  );
}
