const voiceService = require('../services/voice.service');

exports.createVoice = async (req, res) => {
  try {
    const voice = await voiceService.createVoice(req.body);
    res.status(201).json(voice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVoices = async (req, res) => {
  try {
    const voices = await voiceService.getAllVoices();
    const formatted = voices.map(v => ({
      id: v.id,
      name: v.name,
      created_at: v.created_at,
      file_url: `${req.protocol}://${req.get('host')}/uploads/${v.file_path}`,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
