import { useState, useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import dayjs from "dayjs";
import { AppUserProfile } from "../models/Users/AppUserProfile";
import { UserImageListDto } from "../models/Images/UserImageListDto";

export const useSwipe = (
  user: AppUserProfile,
  userImages: UserImageListDto[],
) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const calculateAge = (birthD: string) => {
    return dayjs().diff(dayjs(birthD), "year");
  };

  const userAge = user?.birthDate ? calculateAge(user.birthDate) : 0;

  useEffect(() => {
    setCurrentImageIndex(0);
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [user?.id, userImages.length]);

  const handleTap = (direction: "left" | "right") => {
    let nextIndex =
      direction === "right" ? currentImageIndex + 1 : currentImageIndex - 1;
    if (nextIndex < 0 || nextIndex >= userImages.length) return;

    scrollRef.current?.scrollTo({
      x: nextIndex * containerWidth,
      animated: true,
    });
    setCurrentImageIndex(nextIndex);
  };

  const imageTopIndicatorWidth =
    containerWidth > 0 && userImages.length > 0
      ? Math.round(
          (containerWidth - userImages.length * 3 - 20) / userImages.length,
        )
      : 0;

  return {
    userAge,
    currentImageIndex,
    scrollRef,
    imageTopIndicatorWidth,
    containerWidth,
    setContainerWidth,
    handleTap,
  };
};
