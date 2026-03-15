import { View, StyleSheet, Pressable, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../helpers/consts/Colors";
import {
  Snackbar,
  Text,
  TextInput,
  Button,
  SegmentedButtons,
} from "react-native-paper";
import { GenderEnum } from "../../helpers/enums/GenderEnum";
import { CustomActivityIndicator } from "../shared/CustomActivityIndicator";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useProfile } from "../../hooks/useProfile";
import { useTranslation } from "react-i18next";
import { PhotoModal } from "./modals/PhotoModal";
import Feather from "@expo/vector-icons/Feather";

export function ProfileList() {
  const { user, setUser, isLoading, images, updateUser } = useProfile();
  const { t } = useTranslation();

  const [showDate, setShowDate] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  if (!user) return <CustomActivityIndicator visible={true} />;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <CustomActivityIndicator visible={isLoading} />

      <View style={styles.headerCard}>
        <Pressable onPress={() => setPhotoModalVisible(true)}>
          <View>
            <Image
              source={
                images && images.length > 0
                  ? { uri: images[0].imagePath }
                  : require("../../../assets/img/emptyuser.jpg")
              }
              style={styles.avatar}
            />

            <View style={styles.avatarEdit}>
              <Feather name="camera" size={18} color="white" />
            </View>
          </View>
        </Pressable>

        <Text variant="titleLarge" style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>

        <Text style={styles.email}>{user.email}</Text>
      </View>

      <PhotoModal
        visible={photoModalVisible}
        photos={images}
        onClose={() => setPhotoModalVisible(false)}
      />

      <View style={styles.card}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          {t("Profile.Personal Info")}
        </Text>

        <View style={styles.row}>
          <TextInput
            mode="outlined"
            label={t("FirstName")}
            value={user.firstName}
            style={styles.flex}
            onChangeText={(text) => setUser({ ...user, firstName: text })}
          />

          <TextInput
            mode="outlined"
            label={t("LastName")}
            value={user.lastName}
            style={styles.flex}
            onChangeText={(text) => setUser({ ...user, lastName: text })}
          />
        </View>

        <Pressable
          style={{ marginBottom: 10 }}
          onPress={() => setShowDate(true)}
        >
          <TextInput
            mode="outlined"
            label={t("Birthdate")}
            value={formatDate(user.birthDate)}
            editable={false}
            right={<TextInput.Icon icon="calendar" />}
          />
        </Pressable>

        {showDate && (
          <DateTimePicker
            value={user.birthDate ? new Date(user.birthDate) : new Date()}
            mode="date"
            onChange={(event: any, selectedDate?: Date) => {
              setShowDate(false);

              if (selectedDate) {
                const iso = selectedDate.toISOString().split("T")[0];
                setUser({ ...user, birthDate: iso });
              }
            }}
          />
        )}

        <TextInput
          style={{ marginBottom: 10 }}
          mode="outlined"
          label={t("Country")}
          value={user.country}
          onChangeText={(text) => setUser({ ...user, country: text })}
        />

        <TextInput
          style={{ marginBottom: 10 }}
          mode="outlined"
          label={t("Email")}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
        />

        <TextInput
          mode="outlined"
          label={t("Bio")}
          multiline
          numberOfLines={4}
          value={user.bio}
          onChangeText={(text) => setUser({ ...user, bio: text })}
        />
      </View>

      <View style={styles.card}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          {t("Gender")}
        </Text>

        <SegmentedButtons
          value={user.gender.toString()}
          onValueChange={(value) => setUser({ ...user, gender: Number(value) })}
          buttons={[
            { value: GenderEnum.Man.toString(), label: t("Man") },
            { value: GenderEnum.Woman.toString(), label: t("Woman") },
          ]}
        />
      </View>

      <View>
        <Button
          mode="contained"
          style={styles.saveButton}
          contentStyle={{ height: 50 }}
          onPress={() =>
            updateUser().then((res) => {
              res && setShowSnackbar(true);
            })
          }
        >
          {t("Save")}
        </Button>
        <Snackbar
          visible={showSnackbar}
          style={{
            marginBottom: 70,
          }}
          duration={2500}
          onDismiss={() => setShowSnackbar(false)}
        >
          {t("Profile updated successfully")}
        </Snackbar>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 20,
  },

  headerCard: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },

  avatarEdit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.background.gray,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    marginTop: 12,
    fontWeight: "bold",
  },

  email: {
    opacity: 0.6,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  sectionTitle: {
    marginBottom: 15,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  flex: {
    flex: 1,
  },

  saveButton: {
    borderRadius: 12,
    marginBottom: 40,
  },
});
