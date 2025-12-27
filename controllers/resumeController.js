const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { parseFile } = require('../utils/parse');
const { analyzeResume } = require('../openai/client');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const file = req.file;
    const storagePath = file.path;
    const parsedText = await parseFile(storagePath, file.mimetype);

    const resume = new Resume({
      user: req.user._id,
      originalName: file.originalname,
      storagePath,
      mimeType: file.mimetype,
      size: file.size,
      parsedText
    });
    await resume.save();

    // Call OpenAI to analyze
    let analysisResult = null;
    try {
      const { raw, parsed, fullResponse } = await analyzeResume(parsedText.slice(0, 12000));
      const analysis = new Analysis({ resume: resume._id, summary: parsed.summary || '', recommendations: parsed.recommendations || [], skillGaps: parsed.skillGaps || [], rawResponse: fullResponse });
      await analysis.save();
      resume.analysis = analysis._id;
      await resume.save();
      analysisResult = analysis;
    } catch (err) {
      console.error('OpenAI error:', err.message || err);
    }

    res.json({ resume, analysis: analysisResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).populate('analysis');
    res.json(resumes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getResumeFile = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Not found' });
    if (resume.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    res.download(resume.storagePath, resume.originalName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
