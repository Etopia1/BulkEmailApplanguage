const mongoose = require('mongoose');

const EmailRecordSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  recipients: [{ type: String, required: true }],
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, required: true, enum: ['sent', 'failed'] },
}, { timestamps: true });

module.exports = mongoose.model('EmailRecord', EmailRecordSchema);
