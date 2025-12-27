const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: { type: String },
  storagePath: { type: String },
  mimeType: { type: String },
  size: { type: Number },
  parsedText: { type: String },
  parsedSections: { type: Object },
  analysis: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
