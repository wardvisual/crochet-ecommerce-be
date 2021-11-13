const capitalizeFirstLetter = (value) => {
  if (!value) return "";
  return value
    .split(" ")
    .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .join(" ");
};

export default capitalizeFirstLetter;
