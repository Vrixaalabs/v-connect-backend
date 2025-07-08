import path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { postResolvers } from './resolvers/postResolvers';
import { userResolvers } from './resolvers/userResolvers';

// Load all .graphql files from the typeDefs directory
const typeDefsArray = loadFilesSync(path.join(__dirname, './typeDefs/**/*.graphql'));
const typeDefs = mergeTypeDefs(typeDefsArray);

// Merge resolvers (you can also dynamically load them if needed)
const resolvers = mergeResolvers([userResolvers, postResolvers]);

// Build the schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
