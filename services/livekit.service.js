const { AccessToken }  = require('livekit-server-sdk');

const API_KEY = 'devkey';
const API_SECRET = 'secret';


exports.generateToken = async (req) => {
    const roomName = req.query.roomName;
    const userIdentity = req.query.userIdentity;

    if (!roomName || !userIdentity) {
        return res.status(400).json({ error: 'Missing roomName or userIdentity' });
    }

    const at = new AccessToken(API_KEY, API_SECRET, {
        identity: userIdentity,
        ttl: '10m',
    });
    


    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
    });
  return await at.toJwt();
}