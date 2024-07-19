const generteOtp = () => {
  const timestamp = new Date().getTime();
  const randonNumber = timestamp + timestamp;
  const otp = randonNumber.toString().substring(6, 12);
  return otp;
};

module.exports = generteOtp;
