import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { InterestedUser } from "../components/interests/InterestedUser";
import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useInterest } from "../hooks/useInterest";

export function InterestScreen() {
  const { interests, isLoading, getImages, fetchNextPage, swipe } =
    useInterest();
  const navigation = useAppNavigation();
  const { t } = useTranslation();
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
              <InterestedUser
                interestedUser={item}
                images={getImages(item.id)}
                handleTap={swipe}
              />
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
          {isLoading ? (
            <Text variant="bodyLarge">
              {isLoading ? t("Loading") + "..." : t("Not found")}
            </Text>
          ) : (
            <Button
              mode="contained"
              style={styles.navigateBtn}
              contentStyle={{ height: 50 }}
              onPress={() =>
                navigation.navigate("RootTabNavigationScreen", {
                  screen: "DiscoverTab",
                  params: {
                    screen: "DiscoverScreen",
                  },
                })
              }
            >
              {t("Start to find a match")}
            </Button>
          )}
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
  navigateBtn: {
    borderRadius: 12,
    marginBottom: 40,
  },
});
