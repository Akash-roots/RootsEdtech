const path = require('path');
const ivcService = require('../services/ivc.service');
const voiceService = require('../services/voice.service');

exports.instantClone = async (req, res) => {
  const voiceName = req.body.name || 'InstantClone';
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No audio files uploaded' });
    }
    const filePath = req.files[0].path;
    const voiceData = await ivcService.instantClone(filePath, voiceName);

    // Save in DB
    await voiceService.createVoice({
      id: voiceData.voice_id,
      name: voiceName,
      file_path: path.basename(filePath),
    });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(filePath)}`;

    res.json({
      voice_id: voiceData.voice_id,
      name: voiceName,
      url: fileUrl,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ error: 'IVC failed' });
  }
};
