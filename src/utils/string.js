import configurationOptionStrings from "../strings/configuration_options.json";

const capitaliseFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatText = (str) => {
  const arr = str.split("_");
  return arr.map((v) => capitaliseFirstLetter(v)).join(" ");
};

export const prettyPrintSection = (section) =>
  configurationOptionStrings.sections[section] ?? formatText(key);

export const prettyPrintKey = (section, key) =>
  configurationOptionStrings.keys[section]?.[key]?.label ?? formatText(key);

export const getDescriptionForKey = (section, key) =>
  configurationOptionStrings.keys[section]?.[key]?.description;
