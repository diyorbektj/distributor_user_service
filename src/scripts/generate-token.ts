import * as dotenv from 'dotenv';
dotenv.config();

import * as jwt from 'jsonwebtoken';

const payload = { id: 1, role_id: 1 };
const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
  expiresIn: '24h',
});
console.log('Token:', token);