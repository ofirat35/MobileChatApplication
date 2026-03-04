import {
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../helpers/consts/Colors";
import { Checkbox, Snackbar, Text } from "react-native-paper";
import { TextInput, Button } from "react-native-paper";
import { GenderEnum } from "../../helpers/enums/GenderEnum";
import { CustomActivityIndicator } from "../shared/CustomActivityIndicator";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useProfile } from "../../hooks/useProfile";

export function ProfileList() {
  const { user, setUser, loading, success, updateUser } = useProfile();

  const [show, setShow] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!user)
    return <CustomActivityIndicator visible={true}></CustomActivityIndicator>;

  return (
    <View style={{ flex: 1 }}>
      <CustomActivityIndicator visible={loading}></CustomActivityIndicator>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
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
          <View>
            <Pressable onPress={() => setShow(true)}>
              <TextInput
                mode="outlined"
                label="BirthDate"
                value={formatDate(user.birthDate)}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="calendar"
                    onPress={() => setShow(true)}
                  />
                }
              />
            </Pressable>
            {show && (
              <DateTimePicker
                testID="dateTimeicker"
                value={user.birthDate ? new Date(user.birthDate) : new Date()}
                mode={"date"}
                onChange={(event: any, selectedDate?: Date) => {
                  setShow(false);
                  if (selectedDate && user) {
                    const isoDate = selectedDate.toISOString().split("T")[0];
                    setUser({
                      ...user,
                      birthDate: isoDate,
                    });
                  }
                }}
              />
            )}
          </View>
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
            onPress={() =>
              updateUser().then((res) => {
                res && setShowSnackbar(true);
              })
            }
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
