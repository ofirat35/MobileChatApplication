import { TextInput, View, StyleSheet } from "react-native";

type CustomTextInputProps = {
  title: string;
  children?: any;
  handleOnChangeText?: (text: string) => void;
};

export function CustomTextInput({
  title,
  children,
  handleOnChangeText,
}: CustomTextInputProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 20,
        },
        styles.shadow,
      ]}
    >
      <View
        style={{
          paddingLeft: 15,
          paddingRight: 5,
        }}
      >
        {children}
      </View>

      <TextInput
        style={{
          flex: 1,
          paddingVertical: 15,
          fontSize: 16,
        }}
        onChangeText={(e) => handleOnChangeText && handleOnChangeText(e)}
        placeholder={title}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});
