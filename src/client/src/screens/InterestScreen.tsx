import { View, StyleSheet, FlatList } from "react-native";
import React from "react";
import { InterestedUser } from "../components/interests/InterestedUser";
import { Text } from "react-native-paper";
import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";
import { useInterest } from "../hooks/useInterest";

export function InterestScreen() {
  const { interests, isLoading, fetchNextPage, swipe } = useInterest();
  return (
    <View style={styles.container}>
      <CustomActivityIndicator visible={isLoading}></CustomActivityIndicator>
      {interests.length > 0 ? (
        <FlatList
          data={interests}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 12 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <View style={{ width: "49%", height: 320 }}>
              <InterestedUser interestedUser={item} handleTap={swipe} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text variant="bodyLarge">
            {isLoading ? "Loading..." : "Interests not found!"}
          </Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    flex: 1,
  },
});
