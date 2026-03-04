import { useEffect, useState } from "react";
import { InterestedUserProfile } from "../models/UserProfiles/InterestedUserProfile";
import { useDispatch } from "react-redux";
import { SwipeStatusEnum } from "../helpers/enums/SwipeStatusEnum";
import { PaginatedRequestModel } from "../models/PaginationRequestModel";
import { SwipesService } from "../services/SwipesService";
import { updateChatVersion } from "../features/slices/chatSlice";
import { UserProfileService } from "../services/UserProfileService";

export function useInterest() {
  const [interests, setInterests] = useState<InterestedUserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState<PaginatedRequestModel>({
    page: 1,
    pageSize: 10,
  });
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

  const fetchInterests = async (targetPage: number, overwrite = false) => {
    if (loading || (!hasMore && !overwrite)) return;

    setLoading(true);

    try {
      const response = await UserProfileService.GetInterestedUserProfiles(
        pagination.page,
        pagination.pageSize,
      );
      setHasMore(response.hasNext);

      if (overwrite) {
        setPagination({ page: 1, pageSize: 10 });
        setInterests(response.data);
      } else {
        setInterests((prev) => [...prev, ...response.data]);
      }

      setPagination({ ...pagination, page: targetPage + 1 });
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchInterests(pagination.page);
  };

  useEffect(() => {
    setLoading(true);
    fetchInterests(1, true).then((_) => {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    });
  }, []);

  return {
    interests,
    hasMore,
    loading,
    pagination,
    setPagination,
    fetchInterests,
    handleLoadMore,
    handleTap,
  };
}
