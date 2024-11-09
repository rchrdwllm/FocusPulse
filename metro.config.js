const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: "./global.css" })
);
