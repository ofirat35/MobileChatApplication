import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import {
  ProfileUpdateFormData,
  profileUpdateSchema,
} from "../../validators/profileUpdateSchema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField } from "../shared/FormComponents/FormField";

export function ProfileList() {
  const { user, isLoading, images, isError, updateUser } = useProfile();
  const { t } = useTranslation();

  const [showDate, setShowDate] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileUpdateFormData>({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      ...user,
    },
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user]);

  if (!user) return <CustomActivityIndicator visible={true && !isError} />;

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
          {t("ProfileScreen.Personal Info")}
        </Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <FormField error={errors.firstName?.message}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label={t("FirstName")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FormField>
          </View>

          <View style={{ flex: 1 }}>
            <FormField error={errors.lastName?.message}>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label={t("LastName")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FormField>
          </View>
        </View>

        <FormField error={errors.birthDate?.message}>
          <Controller
            control={control}
            name="birthDate"
            render={({ field: { onChange, value } }) => {
              const dateValue = value ? new Date(value) : new Date();

              return (
                <>
                  <TouchableOpacity onPress={() => setShowDate(true)}>
                    <View pointerEvents="none">
                      <TextInput
                        mode="outlined"
                        label={t("Birthdate")}
                        value={dateValue.toLocaleDateString()}
                        editable={false}
                        right={<TextInput.Icon icon="calendar" />}
                      />
                    </View>
                  </TouchableOpacity>

                  {showDate && (
                    <DateTimePicker
                      value={dateValue}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      maximumDate={(() => {
                        var maxAge = new Date();
                        maxAge.setFullYear(new Date().getFullYear() - 18);
                        return maxAge;
                      })()}
                      onChange={(event, selectedDate) => {
                        setShowDate(Platform.OS === "ios");

                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              );
            }}
          ></Controller>
        </FormField>

        <FormField error={errors.country?.message}>
          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label={t("Country")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormField>

        <FormField error={errors.email?.message}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label={t("Email")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormField>

        <FormField error={errors.bio?.message}>
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label={t("Bio")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormField>
      </View>

      <View style={styles.card}>
        <FormField error={errors.gender?.message}>
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <View
                style={{
                  marginBottom: 20,
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  {t("Gender")}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SegmentedButtons
                    value={(value ?? GenderEnum.Man).toString()}
                    onValueChange={(val) => onChange(Number(val))}
                    buttons={[
                      { value: GenderEnum.Man.toString(), label: t("Man") },
                      { value: GenderEnum.Woman.toString(), label: t("Woman") },
                    ]}
                  />
                </View>
              </View>
            )}
          />
        </FormField>
      </View>

      <View>
        <Button
          mode="contained"
          style={styles.saveButton}
          contentStyle={{ height: 50 }}
          onPress={handleSubmit((data: ProfileUpdateFormData) => {
            updateUser({ ...user, ...data }).then((res) => {
              res && setShowSnackbar(true);
            });
          })}
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
  },
  flex: {
    flex: 1,
  },
  saveButton: {
    borderRadius: 12,
    marginBottom: 40,
  },
});
