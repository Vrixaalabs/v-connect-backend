import { AuthUser } from '../graphql/context';

export interface MockUser extends AuthUser {
  name: string;
}

export const mockUsers: Record<string, MockUser> = {
  'mock-token-john': { sub: 'auth0|user1', name: 'John Doe' },
  'mock-token-jane': { sub: 'auth0|user2', name: 'Jane Smith' },
  'mock-token-alice': { sub: 'auth0|user3', name: 'Alice Johnson' },
  'mock-token-bob': { sub: 'auth0|user4', name: 'Bob Martin' },
  'mock-token-charlie': { sub: 'auth0|user5', name: 'Charlie Lee' },
};
