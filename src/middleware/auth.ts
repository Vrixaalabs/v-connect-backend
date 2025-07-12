import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { User } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();  
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const client = jwksClient({
  jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`, // <- uses env var
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) return next();

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decoded: any) => {
    if (err) {
      console.error('❌ authMiddleware error:', err);
      return next();
    }

    console.log('🔐 Decoded JWT:', decoded);

    try {
      let user = await User.findOne({ email: decoded.email });

      if (!user) {
        user = await User.create({
          name: decoded.name || 'No Name',
          email: decoded.email,
          auth0Id: decoded.sub,
          department: 'Unknown',
          degree: 'Unknown',
          graduationYear: new Date().getFullYear(),
          portfolio: [],
        });
      }

      req.user = user;
    } catch (error) {
      console.error('❌ Error finding/creating user:', error);
    }

    next();
  });
}; 