const livekiService = require('../services/livekit.service')
const { AccessToken } = require('livekit-server-sdk');
const { v4: uuidv4 } = require('uuid');
const Class = require('../models/Class');

const API_KEY = 'devkey';
const API_SECRET = process.env.API_SECRET;

const rooms = {};
exports.rooms = rooms;

function generateRandomPassword() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


exports.generateToken = async (req, res) => {
    const { room_id, identity, password } = req.query;

    if (!room_id || !identity || !password) {
        return res.status(400).json({ error: 'Missing room_id, identity, or password' });
    }

    let cls;
    try {
        cls = await Class.findOne({ where: { room_id } });
    } catch (err) {
        console.error('Token generation DB error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (!cls || cls.status !== 'running') {
        return res.status(404).json({ error: 'Room not found' });
    }

    if (cls.room_password !== password) {
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

function createRoomInternal() {
    const room_id = uuidv4();
    const room_password = generateRandomPassword();

    rooms[room_id] = {
        password: room_password,
        created_at: Date.now(),
    };

    console.log(`Room created: ${room_id} with password: ${room_password}`);
    return { room_id, room_password };
}
exports.createRoomInternal = createRoomInternal;

exports.createRoom = async (req, res) => {
    const room = createRoomInternal();
    res.json(room);
}