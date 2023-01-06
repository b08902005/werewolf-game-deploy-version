import { createPubSub, createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import { useServer } from 'graphql-ws/lib/use/ws'
import ws from 'ws'
import * as fs from 'fs'

import User from "./models/user";
import Room from "./models/room";
import Message from "./models/message";
import Night from './models/night';
import Morning from './models/morning';

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import SingleRoom from './resolvers/SingleRoom';
import SingleMessage from './resolvers/SingleMessage';
import SingleNight from './resolvers/SingleNight'

const pubsub = createPubSub();

export const yoga = createYoga({
  schema: createSchema({
    typeDefs: fs.readFileSync(
      './src/schema.graphql',
      'utf-8'
    ),
    resolvers: {
      Query,
      Mutation,
      Subscription,
      SingleRoom,
      SingleMessage,
      SingleNight
    },
  }),
  context: {
    User,
    Room,
    Message,
    Night,
    Morning,
    pubsub,
  },
  graphqlEndpoint: '/graphql',   // uncomment this to send the app to: 4000/
  graphiql: {
    subscriptionsProtocol: 'WS',
  },
});

// const server = createServer(yoga)
// export default server;


// const wsServer = new ws.Server({
//   server: server,
//   path: yoga.graphqlEndpoint,
// })

// useServer(
//   {
//     execute: (args) => args.rootValue.execute(args),
//     subscribe: (args) => args.rootValue.subscribe(args),
//     onSubscribe: async (ctx, msg) => {
//       const { schema, execute, subscribe, contextFactory, parse, validate } =
//         yoga.getEnveloped({
//           ...ctx,
//           req: ctx.extra.request,
//           socket: ctx.extra.socket,
//           params: msg.payload
//         })

//       const args = {
//         schema,
//         operationName: msg.payload.operationName,
//         document: parse(msg.payload.query),
//         variableValues: msg.payload.variables,
//         contextValue: await contextFactory(),
//         rootValue: {
//           execute,
//           subscribe
//         }
//       }

//       const errors = validate(args.schema, args.document)
//       if (errors.length) return errors
//       return args
//     },
//   },
//   wsServer,
// )

