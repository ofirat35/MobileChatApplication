import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Colors } from "../../helpers/consts/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";

export function MessageInput({
  onSend,
  isSending,
}: {
  onSend: (message: string) => void;
  isSending?: boolean;
}) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (!message.trim() || isSending) return;
    onSend(message.trim());
    setMessage("");
  };

  return (
    <View style={messageStyles.container}>
      <TextInput
        ref={inputRef}
        style={messageStyles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        placeholderTextColor={Colors.text.gray}
        multiline
        maxLength={500}
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity
        style={[
          messageStyles.sendBtn,
          !message.trim() && messageStyles.sendBtnDisabled,
        ]}
        onPress={handleSend}
        disabled={!message.trim() || isSending}
      >
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const messageStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border.gray,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.border.gray,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1D9E75",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.35,
  },
});
