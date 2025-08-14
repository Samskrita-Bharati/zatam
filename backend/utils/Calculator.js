const calculateAverage = (arr) => {
  if (arr.length === 0) {
    return { average: 0, count: 0 }; // Handle empty array
  }

  const sum = arr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return {
    averageRating: sum / arr.length,
    ratingCount: arr.length,
  };
};

module.exports = {
  calculateAverage,
};
