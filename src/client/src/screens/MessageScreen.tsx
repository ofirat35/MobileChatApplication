import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ImageService } from "../services/ImageService";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { UserProfileService } from "../services/UserProfileService";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppUserProfile } from "../models/Users/AppUserProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Colors } from "../helpers/consts/Colors";

export function MessageScreen() {
  const [profilePicture, setProfilePicture] = useState<UserImageListDto>();
  const [user, setUser] = useState<AppUserProfile>();
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params as {
    userId: string;
  };
  useEffect(() => {
    getAppUser();
    getProfilePicture(userId);
  }, []);
  const getAppUser = () => {
    return UserProfileService.GetUserProfile(userId).then((user) =>
      setUser(user.user),
    );
  };
  const getProfilePicture = (id: string) => {
    if (id) {
      ImageService.GetUserProfilePicture(id).then((image) => {
        image && setProfilePicture(image);
      });
    }
  };
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={26} />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          {profilePicture ? (
            <Image
              resizeMode="stretch"
              source={{ uri: profilePicture.imagePath }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            ></Image>
          ) : (
            <Image
              resizeMode="stretch"
              source={require("../../assets/img/img1.png")}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            ></Image>
          )}
          <Text style={{ marginTop: 5, fontSize: 17, fontWeight: "bold" }}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.gray,
    paddingBottom: 15,
  },
});
