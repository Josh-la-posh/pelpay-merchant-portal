export const formatNumber = (num) => {
  if (num === null || num === undefined) return "";

  const value = Number(num);

  if (value >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(1) + "T";
  } else if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "B";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "k";
  }

  return value.toString();
};
