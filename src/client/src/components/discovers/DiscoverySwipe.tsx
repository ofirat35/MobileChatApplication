import React, { useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { useDiscovery } from "../../hooks/useDiscovery";
import { MatchOccuredModal } from "./MatchOccuredModal";
import { SwipeableCard } from "./SwipeableCard";

export function DiscoverySwipe() {
  const { backgroundUser, foregroundUser, lastMatch, swipe } = useDiscovery();
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
        chat={lastMatch}
        visible={matchModalVisible}
        onClose={() => setMatchModalVisible(false)}
      />
    </GestureHandlerRootView>
  );
}
