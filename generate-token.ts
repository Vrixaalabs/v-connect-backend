import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Replace with a valid MongoDB _id from your User collection
const userPayload = {
  id: '686eaf3d82b01542e0054462',  // use real ObjectId
  email: 'testuser@example.com'
};

const secret = 'Nagaon@123'; // Same as your JWT_SECRET in `.env`

const token = jwt.sign(userPayload, secret, { expiresIn: '1d' });

console.log('🔐 JWT Token for Testing:\n');
console.log(token);
console.log('🧪 JWT_SECRET =', process.env.JWT_SECRET);

//Made for testing only