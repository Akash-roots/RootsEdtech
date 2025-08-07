const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function instantClone(audioPath, voiceName = 'InstantClone') {
  const form = new FormData();
  form.append('name', voiceName);
  form.append('files', fs.createReadStream(audioPath));
  form.append('remove_background_noise', 'false');

  const headers = {
    ...form.getHeaders(),
    'xi-api-key': process.env.ELEVENLABS_API_KEY
  };

  try {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/voices/add',
      form,
      { headers }
    );

    return response.data;
  } catch (err) {
    console.error('IVC Error:', err.response?.status, err.response?.data || err.message);
    throw err;
  }
}

module.exports = { instantClone };
