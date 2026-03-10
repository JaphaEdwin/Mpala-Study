import React from "react";
import { Image, StyleSheet, View } from "react-native";

type Props = {
  size?: number;
};

const BrandLogo: React.FC<Props> = ({ size = 120 }) => {
  return (
    <View style={styles.wrap}>
      <Image
        source={require("../../assets/icon.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default BrandLogo;

