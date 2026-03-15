import { View, StyleSheet, FlatList } from "react-native";
import React from "react";
import { InterestedUser } from "../components/interests/InterestedUser";

import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";
import { useInterest } from "../hooks/useInterest";

export function InterestScreen() {
  const { interests, isLoading, fetchNextPage, handleTap } = useInterest();

  return (
    <View style={styles.container}>
      <CustomActivityIndicator visible={isLoading}></CustomActivityIndicator>
      <FlatList
        data={interests}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => (
          <View style={{ width: "49%", height: 320 }}>
            <InterestedUser interestedUser={item} handleTap={handleTap} />
          </View>
        )}
        keyExtractor={(item) => item.user.id.toString()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    width: "100%",
  },
});
