function generateRandomDigits(length) {
  const max = Math.pow(10, length) - 1;
  const randomDigits = Math.floor(Math.random() * max)
    .toString()
    .padStart(length, "0");
  return randomDigits;
}

function generateUserNumber() {
  const currentYear = new Date().getFullYear();
  const randomDigits = generateRandomDigits(6);
  return `${currentYear}${randomDigits}`;
}

module.exports = {
  generateRandomDigits,
  generateUserNumber,
};
