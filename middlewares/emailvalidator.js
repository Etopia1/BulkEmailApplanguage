module.exports = (req, res, next) => {
  const { emailList } = req.body;

  if (!Array.isArray(emailList) || !emailList.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return res.status(400).send('Invalid email list');
  }
  next();
};
