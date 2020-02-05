module.exports = (end, start) => {
  return `${(Math.abs(
    new Date(end) - new Date(start)
  ) / 360000).toFixed(2)} hours`;
};