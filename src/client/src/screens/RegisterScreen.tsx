import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "../helpers/consts/Colors";
import { CustomTextInput } from "../components/shared/CustomTextInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AuthService } from "../services/AuthService";
import { RegisterModel } from "../models/Auths/RegisterModel";
const { width, height } = Dimensions.get("window");

export function RegisterScreen({ navigation }: any) {
  console.log("RegisterScreen mounted");
  const [user, setUser] = useState<RegisterModel>({
    email: "",
    username: "",
    password: "",
  });
  const registerHandler = async () => {
    console.log("Attempting registration...");
    await AuthService.register(user);
    console.log("Registration complete.");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.background.lightgray,
        zIndex: 10,
      }}
    >
      <TopShape />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={[
            {
              zIndex: 5,
              width: width * 0.9,
              height: height * 0.7,
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
          <View style={{ marginBottom: 50 }}>
            <Text style={{ fontSize: 26, fontWeight: "bold" }}>SIGN UP</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                marginBottom: 20,
              }}
            >
              <CustomTextInput
                title="Email"
                handleOnChangeText={(e) => setUser({ ...user, email: e })}
              >
                <MaterialIcons
                  name="email"
                  size={16}
                  color={Colors.background.primary}
                />
              </CustomTextInput>
            </View>
            <View
              style={{
                marginBottom: 20,
              }}
            >
              <CustomTextInput
                title="Username"
                handleOnChangeText={(u) => setUser({ ...user, username: u })}
              >
                <FontAwesome5
                  name="user-alt"
                  size={16}
                  color={Colors.background.primary}
                />
              </CustomTextInput>
            </View>

            <View
              style={{
                marginBottom: 40,
              }}
            >
              <CustomTextInput
                title="Password"
                handleOnChangeText={(p) => setUser({ ...user, password: p })}
              >
                <Ionicons
                  name="lock-closed-sharp"
                  size={16}
                  color={Colors.background.primary}
                />
              </CustomTextInput>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.background.primary,
                  paddingVertical: 15,
                  alignItems: "center",
                  borderRadius: 20,
                }}
                onPress={registerHandler}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>
            <View>
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
                <TouchableOpacity
                  onPress={() => navigation.navigate("LoginScreen")}
                >
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
      </View>
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
