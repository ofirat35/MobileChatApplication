module.exports = {
  input: ["./src/**/*.{js,jsx,ts,tsx}"],
  output: "./src/app/locales/$LOCALE/common.json",
  locales: ["en", "tr"],
  defaultValue: (lng, ns, key) => key,
  sort: true,
  keepRemoved: true,
  keySeparator: ".",
  namespaceSeparator: false,
};
