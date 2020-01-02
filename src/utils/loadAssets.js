import * as Font from "expo-font";
import {
  FontAwesome,
  Ionicons,
  EvilIcons,
  SimpleLineIcons,
  MaterialCommunityIcons,
  AntDesign
} from "@expo/vector-icons";

const fontList = [
  {
    "Aleo-Bold": require("../../assets/fonts/Aleo-Bold.otf")
  },
  FontAwesome.font,
  Ionicons.font,
  EvilIcons.font,
  SimpleLineIcons.font,
  MaterialCommunityIcons.font,
  AntDesign.font
];

export async function loadAssets() {
  await Promise.all([...fontList.map(font => Font.loadAsync(font))]);
}
