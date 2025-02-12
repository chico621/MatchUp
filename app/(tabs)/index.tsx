import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-bold text-lg my-10"> Welcome to MatchUp </Text>
      <Link href="/signin">Sign In</Link>
      <Link href="/bookings">Bookings</Link>
      <Link href="/messages">Messages</Link>
      <Link href="/profile">Profile</Link>
    </View>
  );
}
