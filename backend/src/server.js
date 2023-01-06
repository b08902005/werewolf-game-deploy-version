import { ApolloServer } from '@apollo/server';
import resolvers from './resolvers/resolvers';
import { readFileSync } from "fs";

import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const server = new ApolloServer({
  typeDefs: readFileSync("./src/schema.graphql", "utf-8"),
  resolvers: resolvers
});

export default server;