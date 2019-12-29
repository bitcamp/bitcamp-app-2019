import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import PropTypes from "prop-types";

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

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      style={{
        flex: 1,
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "pink"
      }}
    />
  );
}

QRCodeScanner.propTypes = {
  onScan: PropTypes.func.isRequired
};
