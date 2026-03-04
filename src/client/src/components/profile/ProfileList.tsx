import { View, StyleSheet, StyleProp, TextStyle } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../helpers/consts/Colors";
import { Checkbox, Snackbar, Text } from "react-native-paper";
import { TextInput, Button } from "react-native-paper";
import { UserService } from "../../services/UserService";
import { keycloakService } from "../../helpers/Auth/keycloak";
import { AppUserListModel } from "../../models/Users/AppUserListModel";
import { GenderEnum } from "../../helpers/enums/GenderEnum";
import { CustomActivityIndicator } from "../shared/CustomActivityIndicator";

export function ProfileList() {
  const [user, setUser] = useState<AppUserListModel>();
  const [visible, setVisible] = useState(false);
  const [indicatorVisible, setIndicatorVisible] = useState(false);

  const onDismissSnackBar = () => setVisible(false);

  const updateUser = async () => {
    setIndicatorVisible(true);
    if (user)
      UserService.updateUser({ ...user }).then((res) => {
        setTimeout(() => {
          if (res) setVisible(true);
          else setVisible(false);
          setIndicatorVisible(false);
        }, 500);
      });
    else setIndicatorVisible(false);
  };

  useEffect(() => {
    setIndicatorVisible(true);
    keycloakService.isAuthenticated().then(async (authenticated) => {
      if (authenticated) {
        let user = await UserService.getUserById(
          (await keycloakService.getCurrentUserId())!,
        );
        setUser({ ...user });
        console.log("user authenticated");
        setTimeout(() => {
          setIndicatorVisible(false);
        }, 400);
      }
    });
  }, []);

  if (!user)
    return (
      <CustomActivityIndicator
        visible={indicatorVisible}
      ></CustomActivityIndicator>
    );

  return (
    <View style={{ flex: 1 }}>
      <CustomActivityIndicator
        visible={indicatorVisible}
      ></CustomActivityIndicator>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={4000}
        action={{
          label: "Undo",
          onPress: () => {
            // Do something
          },
        }}
      >
        User updated!
      </Snackbar>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 25,
        }}
      >
        <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
          Basic Information
        </Text>
      </View>
      <View style={styles.profileList}>
        <View style={[{ flexDirection: "row", gap: 10 }, styles.profileBox]}>
          <ProfileBox
            style={{ flex: 1 }}
            label="Firstname"
            value={user.firstName}
            onChange={(text) => setUser({ ...user, firstName: text })}
          />
          <ProfileBox
            style={{ flex: 1 }}
            label="Lastname"
            value={user.lastName}
            onChange={(text) => setUser({ ...user, lastName: text })}
          />
        </View>

        <View style={[{ flexDirection: "row", gap: 10 }, styles.profileBox]}>
          <ProfileBox
            style={{ flex: 1 }}
            label="Birthdate"
            value={user.birthDate}
            onChange={(text) => setUser({ ...user, birthDate: text })}
          />
          <ProfileBox
            style={{ flex: 1 }}
            label="Country"
            value={user.country}
            onChange={(text) => setUser({ ...user, country: text })}
          />
        </View>
        <ProfileBox
          style={styles.profileBox}
          label="Email"
          value={user.email}
          onChange={(text) => setUser({ ...user, email: text })}
        />
        <TextInput
          mode="outlined"
          label="Bio"
          style={styles.profileBox}
          multiline={true}
          numberOfLines={5}
          value={user.bio}
          onChangeText={(text) => setUser({ ...user, bio: text })}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text variant="labelLarge" style={{ fontWeight: "bold" }}>
            Gender :
          </Text>
          <View style={{ flexDirection: "row", marginLeft: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Checkbox
                status={
                  user.gender === GenderEnum.Man ? "checked" : "unchecked"
                }
                onPress={() => {
                  setUser({ ...user, gender: GenderEnum.Man });
                }}
              />
              <Text>Man</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                status={
                  user.gender === GenderEnum.Woman ? "checked" : "unchecked"
                }
                onPress={() => {
                  setUser({ ...user, gender: GenderEnum.Woman });
                }}
              />
              <Text>Woman</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 60,
          }}
        >
          <Button
            style={{ flex: 0.2 }}
            mode="contained"
            onPress={() => updateUser()}
          >
            Save
          </Button>
        </View>
      </View>
    </View>
  );
}

const ProfileBox = ({
  label,
  value,
  style,
  onChange,
}: {
  label: string;
  value: string;
  style?: StyleProp<TextStyle>;
  onChange: (text: string) => void;
}) => {
  return (
    <TextInput
      mode="outlined"
      style={style ? style : {}}
      label={label}
      value={value}
      onChangeText={(text) => onChange(text)}
    />
  );
};

const styles = StyleSheet.create({
  profileList: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopWidth: 1,
    borderColor: Colors.border.gray,
  },
  profileBox: {
    marginBottom: 10,
  },
});
