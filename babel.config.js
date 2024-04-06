module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required for expo-router
      // "expo-router/babel",
      'react-native-reanimated/plugin',
      [
        "transform-inline-environment-variables", {
          include: [
            'EXPO_PUBLIC_API_URL',
            'EXPO_PUBLIC_API_KEY',
            'EXPO_PUBLIC_AUTH_DOMAIN',
            'EXPO_PUBLIC_PROJECT_ID',
            'EXPO_PUBLIC_STORAGE_BUCKET',
            'EXPO_PUBLIC_MESAGING_SENDER_ID',
            'EXPO_PUBLIC_APP_ID',
            'EXPO_PUBLIC_MEASURING_ID'
          ]
        }
      ]
    ],
  };
};
