const livekiService = require('../services/livekit.service')
const { AccessToken } = require('livekit-server-sdk');
const { v4: uuidv4 } = require('uuid');

const API_KEY = 'devkey';
const API_SECRET = process.env.API_SECRET;

const rooms = {};

function generateRandomPassword() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


exports.generateToken = async (req, res) => {
    const { room_id, identity, password } = req.query;

    if (!room_id || !identity || !password) {
        return res.status(400).json({ error: 'Missing room_id, identity, or password' });
    }

    if (!rooms[room_id]) {
        return res.status(404).json({ error: 'Room not found' });
    }

    if (rooms[room_id].password !== password) {
        return res.status(403).json({ error: 'Invalid password' });
    }

    const at = new AccessToken(API_KEY, API_SECRET, {
        identity: identity,
        ttl: '10m',
    });

    at.addGrant({
        roomJoin: true,
        room: room_id,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
    });
    const token = await at.toJwt();
    console.log("token", token);

    res.json({ token });
}

exports.createRoom = async (req, res) => {
    const room_id = uuidv4();
    const room_password = generateRandomPassword();

    rooms[room_id] = {
        password: room_password,
        created_at: Date.now(),
    };

    console.log(`Room created: ${room_id} with password: ${room_password}`);

    let room =  {
        room_id,
        room_password,
    };
    res.json(room);
}