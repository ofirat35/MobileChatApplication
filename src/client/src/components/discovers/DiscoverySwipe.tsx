import { View } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { useDiscovery } from "../../hooks/useDiscovery";
import { SwipeableCard } from "./SwipeableCard";
import { MatchOccuredModal } from "./MatchOccuredModal";

export function DiscoverySwipe() {
  const {
    backgroundUser,
    foregroundUser,
    matchModalVisible,
    lastMatchedUser,
    setMatchModalVisible,
    nextUser,
    handleSwipe,
  } = useDiscovery();

  const onSwipeComplete = (isLike: boolean) => {
    nextUser();
    handleSwipe(
      foregroundUser!.id,
      isLike ? SwipeStatusEnum.like : SwipeStatusEnum.pass,
    );
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
      <MatchOccuredModal
        visible={matchModalVisible}
        onClose={() => setMatchModalVisible(false)}
        matchedUser={lastMatchedUser}
      />
    </GestureHandlerRootView>
  );
}
