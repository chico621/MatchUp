import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Match<Text style={styles.titleUp}>Up</Text>
        </Text>

        <Link href="/signin" asChild>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
            <Ionicons name="log-in-outline" size={22} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/handshake.jpg")}
          style={styles.image}
        />

        {/* Fading Effect on Image */}
        <LinearGradient
          colors={["transparent", "#424242"]}
          style={styles.gradient}
        />
      </View>

      {/* Main Body */}
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to MatchUp</Text>
        <Text style={styles.description}>
          The easiest way to find and schedule local football matches.
        </Text>

        {/* Key Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Easy Match Scheduling</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="chatbubbles-outline" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Direct Team Communication</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="people-outline" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Find Local Teams Instantly</Text>
          </View>
        </View>

        {/* Call-to-Action */}
        <Link href="/signup" asChild>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>Get Started</Text>
            <Ionicons name="arrow-forward-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ // Styles for the component
  container: {
    flex: 1,
    backgroundColor: "#424242",
    paddingHorizontal: 0,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.23,
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  titleUp: {
    color: "#4CAF50",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5A5A5A",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  loginText: {
    fontSize: 15,
    color: "white",
    marginRight: 5,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#DDDDDD",
    textAlign: "center",
  },
  featuresContainer: {
    marginTop: 20,
    width: "100%",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: "white",
    marginLeft: 10,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  ctaText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginRight: 10,
  },
});
