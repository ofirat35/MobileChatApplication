import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Colors } from "../../helpers/consts/Colors";
import { AppUserProfile } from "../../models/Users/AppUserProfile";
import { UserImageListDto } from "../../models/Images/UserImageListDto";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

type ChatBoxProps = {
  userProfile: AppUserProfile;
  profilePicture: UserImageListDto | null;
};
export function ChatBox({ userProfile, profilePicture }: ChatBoxProps) {
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigate("MessageScreen", { userId: userProfile.id })}
      style={styles.container}
    >
      <View style={{ marginRight: 20 }}>
        {profilePicture ? (
          <Image
            resizeMode="stretch"
            source={{ uri: profilePicture.imagePath }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          ></Image>
        ) : (
          <Image
            resizeMode="stretch"
            source={require("../../../assets/img/img1.png")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          ></Image>
        )}
      </View>
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {userProfile.firstName} {userProfile.lastName}
        </Text>
        <Text style={{ fontSize: 16, color: Colors.text.gray }}>selam</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.background.white,
    paddingHorizontal: 15,
    height: 90,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.gray,
  },
});
