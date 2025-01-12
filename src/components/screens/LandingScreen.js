import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export default function LandingScreen({ navigation }) {
    return (
        <View style={styles.landingContainer}>
        <View style={styles.topSection}>
            <Icon name="clipboard-outline" size={100} color="#f89700" />
            <Text style={styles.landingTitle}>Welcome to myToDo</Text>
            <Text style={styles.landingSubtitle}>
                Level up your life with a to-do list.
            </Text>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => navigation.navigate("Login")}
            >
            <Icon name="log-in-outline" size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => navigation.navigate("Register")}
            >
            <Icon name="person-add-outline" size={24} color="#f89700" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.registerText]}>Register</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    landingContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 20,
    },
    topSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    landingTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        marginTop: 20,
        textAlign: "center",
    },
    landingSubtitle: {
        fontSize: 16,
        color: "#666",
        marginTop: 10,
        textAlign: "center",
    },
    buttonContainer: {
        padding: 20,
        gap: 15,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
    },
    loginButton: {
        backgroundColor: "#f89700",
        borderColor: "#f89700",
    },
    registerButton: {
        backgroundColor: "#FFF",
        borderColor: "#f89700",
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFF",
    },
    registerText: {
        color: "#f89700",
    },
    
});
