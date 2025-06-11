const livekiService = require('../services/livekit.service')

exports.generateToken = async (req, res) => {
    const token =  await livekiService.generateToken(req);
    console.log("token",token);
    
    res.json({ token });
}