module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@api": "./src/api",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@navigation": "./src/navigation",
            "@hooks": "./src/hooks",
            "@theme": "./src/theme",
            "@utils": "./src/utils",
            "@constants": "./src/constants",
            "@services": "./src/services",
            "@types": "./src/types",
            "@legal": "./src/legal"
          },
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"]
        }
      ],
      "react-native-reanimated/plugin"
    ]
  };
};

