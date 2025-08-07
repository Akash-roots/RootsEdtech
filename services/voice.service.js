const Voice = require('../models/Voice');

exports.createVoice = (data) => Voice.create(data);
exports.getAllVoices = () => Voice.findAll({ order: [['created_at', 'DESC']] });
