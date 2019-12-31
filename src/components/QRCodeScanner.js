import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import PropTypes from "prop-types";
import { H3 } from "./Text";

// TODO: rework the props and displays on error
// This example was adapted from the expo website:
// https://docs.expo.io/versions/v36.0.0/sdk/bar-code-scanner/
export default function QRCodeScanner(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    props.onScan(data);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <H3 style={styles.centeredText}>
          To enable the scanner, give Bitcamp access to your device's
          camera.
        </H3>
      </View>
    );
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      style={StyleSheet.absoluteFill}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  centeredText: {
    textAlign: 'center'
  }
});

QRCodeScanner.propTypes = {
  onScan: PropTypes.func.isRequired
};
