import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { H3 } from "./Text";

// TODO: rework the props and displays on error
// This example was adapted from the expo website:
// https://docs.expo.io/versions/v36.0.0/sdk/bar-code-scanner/
export default function QRCodeScanner(props) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <H3 style={styles.centeredText}>
          To enable the scanner, give Bitcamp access to your device's camera.
        </H3>
      </View>
    );
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={props.scannerIsOn ? props.onScan : undefined}
      barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      style={styles.container}
    >
      <H3 style={styles.description}>
        Align your QR code with the viewfinder below
      </H3>
      <Ionicons name="ios-qr-scanner" size={350} color="white" />
    </BarCodeScanner>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  centeredText: {
    textAlign: "center"
  },
  description: {
    color: "white",
    textAlign: "center",
    fontSize: 20
  }
});

QRCodeScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
  scannerIsOn: PropTypes.bool.isRequired
};
