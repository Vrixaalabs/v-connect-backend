// generate-jwt.ts
import jwt from 'jsonwebtoken';

// Replace with your actual MongoDB user _id
const userId = '6867c0fc480b3e3fce748a5f';

// Use the same secret as in your .env or auth middleware
const secret = 'thisisasecretkey'; // or process.env.JWT_SECRET

const token = jwt.sign({ userId }, secret, { expiresIn: '7d' });

console.log('Your JWT token:', token);