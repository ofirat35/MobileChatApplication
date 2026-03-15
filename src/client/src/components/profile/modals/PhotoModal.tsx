import {
  View,
  Modal,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Text, Menu, PaperProvider, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { ImageService } from "../../../services/ImageService";
import { UserImageListDto } from "../../../models/Images/UserImageListDto";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keycloakService } from "../../../helpers/Auth/keycloak";

const { width } = Dimensions.get("window");

type PhotoModalProps = {
  visible: boolean;
  photos: UserImageListDto[] | undefined;
  onClose: () => void;
  onDelete?: (imageId: string) => void;
  onUpload?: (image: UserImageListDto) => void;
  onProfilePictureUpdated?: (image: UserImageListDto) => void;
};

export function PhotoModal({
  visible,
  photos,
  onClose,
  onDelete,
  onUpload,
  onProfilePictureUpdated,
}: PhotoModalProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [actionVisible, setActionVisible] = useState(false);

  const queryClient = useQueryClient();

  const uploadImageMutation = useMutation({
    mutationFn: (file: ImagePicker.ImagePickerAsset) =>
      ImageService.UploadPicture(file),
    onSuccess: async (res) => {
      res && onUpload && onUpload(res);
      const userId = await keycloakService.getCurrentUserId();

      queryClient.setQueryData(
        ["user-images", userId],
        (old: UserImageListDto[]) => [...old, res],
      );
    },
  });
  const deleteImageMutation = useMutation({
    mutationFn: (id: string) => ImageService.DeletePicture(id),
    onSuccess: async (res, id) => {
      onDelete && onDelete(id);
      setMenuVisible(false);

      const userId = await keycloakService.getCurrentUserId();
      scrollRef.current?.scrollTo({
        x: width * (activeIndex > 0 ? activeIndex - 1 : 0),
        animated: true,
      });
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      queryClient.setQueryData(
        ["user-images", userId],
        (old: UserImageListDto[]) => [...old?.filter((i) => i.id !== id)],
      );
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImageMutation.mutateAsync(result.assets[0]);
    }
  };

  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <PaperProvider>
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
            }}
          >
            <Text variant="titleLarge" style={{ color: "white" }}>
              {t("My Photos")}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Pressable onPress={() => setMenuVisible(true)}>
                    <Entypo
                      name="dots-three-vertical"
                      size={22}
                      color="white"
                    />
                  </Pressable>
                }
              >
                <Menu.Item onPress={pickImage} title={t("Upload Photo")} />
                {photos && (
                  <Menu.Item
                    onPress={() =>
                      deleteImageMutation.mutate(photos[activeIndex].id)
                    }
                    title={t("Delete Photo")}
                  />
                )}
              </Menu>

              <Pressable onPress={onClose} style={{ marginLeft: 16 }}>
                <AntDesign name="close" size={24} color="white" />
              </Pressable>
            </View>
          </SafeAreaView>

          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {photos &&
              photos.map((photo) => (
                <Pressable
                  key={photo.id}
                  onLongPress={() => {
                    setActionVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: photo.imagePath }}
                    style={{
                      width: width,
                      height: "100%",
                    }}
                    resizeMode="contain"
                  />
                </Pressable>
              ))}
          </ScrollView>

          <Modal
            visible={actionVisible && photos && photos?.length > 0}
            transparent
            animationType="slide"
            onRequestClose={() => setActionVisible(false)}
          >
            <Pressable
              style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              onPress={() => setActionVisible(false)}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <Button
                  mode="contained"
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    if (photos && photos[activeIndex]) {
                      ImageService.SetProfilePicture(photos[activeIndex].id);
                      onProfilePictureUpdated &&
                        onProfilePictureUpdated(photos[activeIndex]);
                      scrollRef.current?.scrollTo({
                        x: 0,
                        animated: true,
                      });
                      setActiveIndex(0);
                    }
                    setActionVisible(false);
                  }}
                >
                  Set as Profile Picture
                </Button>
                <Button onPress={() => setActionVisible(false)}>Cancel</Button>
              </View>
            </Pressable>
          </Modal>
        </View>
      </PaperProvider>
    </Modal>
  );
}
