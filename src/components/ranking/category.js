import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const Category = ({ item, navigation }) => {
  const mainCategory = () =>
    navigation.navigate("CategoryRanking", { item: item });

  return (
    <LinearGradient
      style={styles.listItem}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      colors={["#009245", "#8cc631"]}
    >
      <TouchableOpacity style={styles.container} onPress={mainCategory}>
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Category;

const styles = StyleSheet.create({
  listItem: {
    flex: 1,

    margin: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
