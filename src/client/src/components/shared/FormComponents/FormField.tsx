import { View, Text } from "react-native";

export const FormField = ({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) => {
  return (
    <View style={{ marginBottom: 20 }}>
      {children}
      {error && (
        <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};
