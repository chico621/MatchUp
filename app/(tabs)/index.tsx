import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import icons

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Top Section with Title and Sign In */}
      <View style={styles.header}>
        <Text style={styles.title}>MatchUp</Text>

        <Link href="/signin" asChild>
          <TouchableOpacity style={styles.loginContainer}>
            <Text style={styles.loginText}>Login / Register</Text>
            <Ionicons name="log-in-outline" size={24} color="black" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

// External Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 50, // Moves everything down
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40, // Moves title and sign-in down
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5, // Adds spacing between text and icon
  },
  loginText: {
    fontSize: 16,
    color: "black",
  },
  navLinks: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    fontSize: 18,
    color: "blue",
    marginVertical: 10,
  },
});

