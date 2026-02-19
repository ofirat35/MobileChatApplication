import { View, Text, FlatList } from "react-native";
import React from "react";
import MessageList from "../components/messages/MessageList";

export function MessageScreen() {
  return (
    <View>
      {/* <FlatList
              data={interests}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              onEndReached={() => fetchInterests()}
              onEndReachedThreshold={0.4}
              renderItem={({ item }) => (
                <View style={{ width: "49%", height: 320 }}>
                  <InterestedUser interestedUser={item} handleTap={handleTap} />
                </View>
              )}
              keyExtractor={(item) => item.user.id.toString()}
            /> */}
      <MessageList></MessageList>
      <MessageList></MessageList>
    </View>
  );
}
