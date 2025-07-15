import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  type Comment {
    body: String
  }

  type Post {
    id: ID!
    content: String!
    likes: Int!
    timestamp: String!
    author: User!
    comments: [Comment!]!
  }

  type Group {
    id: ID!
    name: String!
    isOfficial: Boolean!
    members: [User!]!
  }

  type Query {
    getTrendingPosts(limit: Int!): [Post!]!
    getSuggestedGroups(limit: Int!): [Group!]!
    getPopularGroups(limit: Int!): [Group!]!
  }
`;
