import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "../helpers/consts/Colors";
import { CustomTextInput } from "../components/shared/CustomTextInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AuthService } from "../services/AuthService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Snackbar, Text } from "react-native-paper";
import { GenderEnum } from "../helpers/enums/GenderEnum";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema, RegisterFormData } from "../validators/registerSchema";
import { FormField } from "../components/shared/FormComponents/FormField";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

export function RegisterScreen() {
  const { navigate } = useAppNavigation();
  const [showPicker, setShowPicker] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      gender: GenderEnum.Man,
      birthDate: (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d.toISOString();
      })(),
    },
  });

  const registerHandler = async (data: RegisterFormData) => {
    await AuthService.register({
      ...data,
      birthDate: new Date(data.birthDate).toISOString().split("T")[0],
    }).then((res) => {
      if (res) {
        reset();
        setShowSnackbar(true);
      }
    });
  };
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.background.lightgray,
        zIndex: 10,
      }}
    >
      <TopShape />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={[
            {
              zIndex: 5,
              width: width * 0.9,
              height: hasErrors ? height * 0.75 : height * 0.65,
              paddingTop: 40,
              paddingBottom: 40,
              paddingHorizontal: 25,
              backgroundColor: Colors.background.lightgray,
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
            },
            styles.shadow,
          ]}
        >
          <View style={{ marginBottom: 35 }}>
            <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
              SIGN UP
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <FormField error={errors.firstName?.message}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextInput
                    title="First Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  >
                    <FontAwesome5
                      name="user-alt"
                      size={16}
                      color={Colors.background.primary}
                    />
                  </CustomTextInput>
                )}
              />
            </FormField>

            <FormField error={errors.lastName?.message}>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextInput
                    title="Last Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  >
                    <FontAwesome5
                      name="user-alt"
                      size={16}
                      color={Colors.background.primary}
                    />
                  </CustomTextInput>
                )}
              />
            </FormField>

            <FormField error={errors.email?.message}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextInput
                    title="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  >
                    <MaterialIcons
                      name="email"
                      size={16}
                      color={Colors.background.primary}
                    />
                  </CustomTextInput>
                )}
              />
            </FormField>

            <FormField error={errors.password?.message}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextInput
                    title="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                  >
                    <Ionicons
                      name="lock-closed-sharp"
                      size={16}
                      color={Colors.background.primary}
                    />
                  </CustomTextInput>
                )}
              />
            </FormField>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, marginBottom: 20 }}>
                <Text style={{ textAlign: "center", marginBottom: 5 }}>
                  Birthdate
                </Text>
                <FormField error={errors.birthDate?.message}>
                  <Controller
                    control={control}
                    name="birthDate"
                    render={({ field: { onChange, value } }) => {
                      const dateValue = value ? new Date(value) : new Date();

                      return (
                        <>
                          <TouchableOpacity onPress={() => setShowPicker(true)}>
                            <View pointerEvents="none">
                              <CustomTextInput
                                title="BirthDate"
                                value={dateValue.toLocaleDateString()} // This displays the string
                                editable={false}
                              >
                                <FontAwesome5
                                  name="calendar-alt"
                                  size={16}
                                  color={Colors.background.primary}
                                />
                              </CustomTextInput>
                            </View>
                          </TouchableOpacity>

                          {showPicker && (
                            <DateTimePicker
                              value={dateValue}
                              mode="date"
                              display={
                                Platform.OS === "ios" ? "spinner" : "default"
                              }
                              maximumDate={(() => {
                                var maxAge = new Date();
                                maxAge.setFullYear(
                                  new Date().getFullYear() - 18,
                                );
                                return maxAge;
                              })()}
                              onChange={(event, selectedDate) => {
                                setShowPicker(Platform.OS === "ios");

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
              </View>

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
                      <Text style={{ textAlign: "center", marginBottom: 10 }}>
                        {t("Gender")}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Switch
                          trackColor={{ false: "#ed21f8", true: "#4183f5" }}
                          thumbColor="#f4f3f4"
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={(val) =>
                            onChange(val ? GenderEnum.Man : GenderEnum.Woman)
                          }
                          value={value === GenderEnum.Man}
                        />
                        <Text style={{ marginLeft: 5, fontSize: 14 }}>
                          {GenderEnum[value]}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </FormField>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: Colors.background.primary,
                paddingVertical: 15,
                alignItems: "center",
                borderRadius: 20,
              }}
              onPress={handleSubmit(registerHandler)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                SIGN UP
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text style={{ color: Colors.text.lightgray }}>
                already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigate("LoginScreen")}>
                <Text
                  style={{ color: Colors.text.primary, fontWeight: "bold" }}
                >
                  SIGN IN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Snackbar
        visible={showSnackbar}
        duration={2500}
        onDismiss={() => setShowSnackbar(false)}
      >
        {t("RegisterScreen.Successfully registered")}
      </Snackbar>
    </SafeAreaView>
  );
}

const TopShape = () => (
  <View
    style={{
      position: "absolute",
      width: width * 0.6,
      height: width * 0.6,
      top: -(width * 0.3 + 30),
      left: width * 0.2,
    }}
  >
    <View
      style={{
        backgroundColor: Colors.background.primary,
        width: width * 0.55,
        height: width * 0.55,
        position: "absolute",
        top: 10,
        right: 0,
        zIndex: 10,
        borderRadius: (width * 0.55) / 2,
      }}
    ></View>
    <View
      style={{
        backgroundColor: Colors.background.secondary,
        width: width * 0.6,
        height: width * 0.6,
        position: "absolute",
        left: width * 0.1,
        zIndex: 5,
        borderRadius: (width * 0.6) / 2,
      }}
    ></View>
  </View>
);

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});
