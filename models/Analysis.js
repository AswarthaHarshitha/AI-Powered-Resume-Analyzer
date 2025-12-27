const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  summary: { type: String },
  recommendations: { type: Array, default: [] },
  skillGaps: { type: Array, default: [] },
  rawResponse: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
