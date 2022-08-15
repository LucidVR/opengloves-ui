const capitaliseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const prettyPrintLabel = (str) => {
    const arr = str.split("_");
    return arr.map((v) => capitaliseFirstLetter(v)).join(" ");
};