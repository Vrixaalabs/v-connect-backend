import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { User } from '../models/Profile.model';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Augment Express request type
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

  // Check if it's a mock token first
  if (token.startsWith('mock-token-')) {
    // For mock tokens, try to find or create user based on the mock token
    const mockUserSub = token === 'mock-token-john' ? 'auth0|user1' :
                       token === 'mock-token-jane' ? 'auth0|user2' :
                       token === 'mock-token-alice' ? 'auth0|user3' :
                       token === 'mock-token-bob' ? 'auth0|user4' :
                       token === 'mock-token-charlie' ? 'auth0|user5' : 'auth0|mockuser';
    
    const mockUserName = token === 'mock-token-john' ? 'John Doe' :
                        token === 'mock-token-jane' ? 'Jane Smith' :
                        token === 'mock-token-alice' ? 'Alice Johnson' :
                        token === 'mock-token-bob' ? 'Bob Martin' :
                        token === 'mock-token-charlie' ? 'Charlie Lee' : 'Mock User';

    (async () => {
      try {
        let user = await User.findOne({ auth0Id: mockUserSub });

        if (!user) {
          user = await User.create({
            name: mockUserName,
            email: `${mockUserName.toLowerCase().replace(' ', '.')}@university.edu`,
            auth0Id: mockUserSub,
            department: 'Computer Science',
            degree: 'Bachelor of Science',
            graduationYear: new Date().getFullYear(),
            portfolio: [],
          });
          console.log('✅ Created mock user:', user.name);
        }

        req.user = user;
      } catch (error) {
        console.error('❌ Error finding/creating mock user:', error);
      }
      next();
    })();
    return;
  }

  // Real Auth0 token verification
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decoded: any) => {
    if (err) {
      console.error('❌ authMiddleware error:', err);
      return next();
    }

    console.log('🔐 Decoded JWT:', decoded);

    try {
      let user = await User.findOne({ auth0Id: decoded.sub });

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
        console.log('✅ Created Auth0 user:', user.name);
      }

      req.user = user;
    } catch (error) {
      console.error('❌ Error finding/creating user:', error);
      // Don't fail the request, just continue without user
    }

    next();
  });
};
