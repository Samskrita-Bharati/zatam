const getDateTimeParts = (prefix = "G") => {
  const now = new Date();

  // Extract parts directly (no locale dependency)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  const random3 = String(Math.floor(Math.random() * 1000)).padStart(3, "0");

  // Compose the formatted ID
  const formattedId = `${prefix}_${year}${month}${day}_${hour}${minute}${second}_${ms}_${random3}`;

  // Construct ISO timestamp for general purpose
  const timestamp = now.toISOString();

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    ms,
    random3,
    timestamp,
    formattedId,
  };
};

module.exports = getDateTimeParts;
