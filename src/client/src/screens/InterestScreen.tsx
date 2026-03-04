import { View, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { InterestedUser } from "../components/interests/InterestedUser";
import { UserProfileService } from "../services/UserProfileService";
import { InterestedUserProfile } from "../models/UserProfiles/InterestedUserProfile";
import { PaginatedRequestModel } from "../models/PaginationRequestModel";
import { SwipesService } from "../services/SwipesService";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { useDispatch } from "react-redux";
import { updateChatVersion } from "../features/slices/chatSlice";
import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";

export function InterestScreen() {
  const [interests, setInterests] = useState<InterestedUserProfile[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState<PaginatedRequestModel>({
    page: 1,
    pageSize: 10,
  });
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const dispatch = useDispatch();
  const handleTap = async (userId: string, status: SwipeStatusEnum) => {
    if (status === SwipeStatusEnum.like) {
      await SwipesService.Like(userId);
      setInterests((prev) => prev.filter((i) => i.user.id !== userId));
      dispatch(updateChatVersion());
    } else if (status === SwipeStatusEnum.pass) {
      await SwipesService.Pass(userId);
      setInterests((prev) => prev.filter((i) => i.user.id !== userId));
    }
  };

  const fetchInterests = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const res = await UserProfileService.GetInterestedUserProfiles(
        pagination.page,
        pagination.pageSize,
      );
      setHasMore(res.hasNext);
      if (res.data.length === 0) {
        setLoadingMore(false);
        return;
      }
      setInterests((prev) => [...prev, ...res.data]);
      setPagination((prev) => ({
        ...prev,
        page: pagination.page + 1,
      }));
    } catch (error) {
      console.error("Error fetching interests:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setIndicatorVisible(true);
    fetchInterests().then((_) => {
      setTimeout(() => {
        setIndicatorVisible(false);
      }, 400);
    });
  }, []);

  return (
    <View style={styles.container}>
      <CustomActivityIndicator
        visible={indicatorVisible}
      ></CustomActivityIndicator>
      <FlatList
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
