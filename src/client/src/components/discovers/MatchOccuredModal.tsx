import * as React from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { Modal, Portal, Text, Button, Avatar } from "react-native-paper";
import { AppUserProfile } from "../../models/Users/AppUserProfile";
import { Colors } from "../../helpers/consts/Colors";
import { AntDesign } from "@expo/vector-icons";

interface MatchModalProps {
  visible: boolean;
  onClose: () => void;
  matchedUser: AppUserProfile | null;
}

export const MatchOccuredModal = ({
  visible,
  onClose,
  matchedUser,
}: MatchModalProps) => {
  if (!matchedUser) return null;
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <Text variant="headlineLarge" style={styles.title}>
            It's a Match!
          </Text>

          <Text variant="bodyLarge" style={styles.subtitle}>
            You and {matchedUser.firstName} have liked each other.
          </Text>

          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={120}
              source={
                matchedUser.images.length > 0
                  ? {
                      uri: matchedUser.images?.[0]?.imagePath,
                    }
                  : require("../../../assets/img/img1.png")
              }
            />
          </View>

          <Button
            mode="contained"
            onPress={onClose}
            style={styles.button}
            buttonColor="#FF5252"
          >
            Keep Swiping
          </Button>

          <Button
            mode="contained"
            style={[
              styles.button,
              { borderWidth: 1, borderColor: Colors.border.gray },
            ]}
            onPress={() => {}}
            textColor={"#FF5252"}
            buttonColor={Colors.background.white}
          >
            Send a Message
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 450,
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#FF5252",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 25,
    color: "#444",
  },
  avatarContainer: {
    marginBottom: 30,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  button: {
    width: "100%",
    paddingVertical: 4,
    marginBottom: 10,
  },
});
