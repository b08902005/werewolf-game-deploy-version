import mongoose, { model } from 'mongoose';
import { yoga } from "./server_yoga";
import express from 'express';
// import { json } from 'body-parser';
import path from 'path';
// import cors from 'cors';
// import { expressMiddleware } from '@apollo/server/express4';
import "dotenv-defaults/config";

// import { ApolloServer } from '@apollo/server';
// import resolvers from './resolvers/resolvers';
// import { readFileSync } from "fs";

// import { createServer } from 'http';
// import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
// import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import User from './models/user';
import Room from './models/room';
import Message from './models/message';
import Night from './models/night';
import Morning from './models/morning';

import { createPubSub } from 'graphql-yoga'

mongoose.set("strictQuery", true)
mongoose.connect(
    process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((res) => console.log("mongo db connection created"))

const PORT = process.env.PORT || 4000;
const app = express();
app.use("/graphql", yoga)

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
}

const server = app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})





// const httpServer = createServer(app);
// const pubsub = createPubSub();

// const schema = makeExecutableSchema({
//     typeDefs: readFileSync("./src/schema.graphql", "utf-8"),
//     resolvers: resolvers
// });

// const server = new ApolloServer({
//     schema: schema,
//     context: ({ req, res }) => ({ req, res, pubsub }),
//     plugins: [
//         // Proper shutdown for the HTTP server.
//         ApolloServerPluginDrainHttpServer({ httpServer }),
//         // Proper shutdown for the WebSocket server.
//         {
//             async serverWillStart() {
//                 return {
//                     async drainServer() {
//                         await serverCleanup.dispose();
//                     },
//                 };
//             },
//         },
//     ],
// });

// // Creating the WebSocket server
const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: server,
    // server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: yoga.graphqlEndpoint,
    // path: '/graphql',
});

useServer(
    {
        execute: (args) => args.rootValue.execute(args),
        subscribe: (args) => args.rootValue.subscribe(args),
        onSubscribe: async (ctx, msg) => {
            const { schema, execute, subscribe, contextFactory, parse, validate } =
                yoga.getEnveloped({
                    ...ctx,
                    req: ctx.extra.request,
                    socket: ctx.extra.socket,
                    params: msg.payload
                })

            const args = {
                schema,
                operationName: msg.payload.operationName,
                document: parse(msg.payload.query),
                variableValues: msg.payload.variables,
                contextValue: await contextFactory(),
                rootValue: {
                    execute,
                    subscribe
                }
            }

            const errors = validate(args.schema, args.document)
            if (errors.length) return errors
            return args
        },
    },
    wsServer,
)
// // Hand in the schema we just created and have the
// // WebSocketServer start listening.
// const serverCleanup = useServer(
//     {
//         schema: schema,
//         context: (ctx, msg, args) => ({ pubsub }),
//     },
//     wsServer
// );

// if (process.env.NODE_ENV === "production") {
//     const __dirname = path.resolve();
//     app.use(express.static(path.join(__dirname, "../frontend", "build")));
//     app.get("/*", function (req, res) {
//         res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
//     });
// }

// if (process.env.NODE_ENV === "development") {
//     app.use(cors());
// }


// server.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}!`)
// })

// const startServer = async () => {
//     await server.start();
//     app.use('/graphql', cors(), json(), expressMiddleware(server, {
//         context: async ({ req }) => ({
//             token: req.headers.token,
//             User: User,
//             Room: Room,
//             Message: Message,
//             Night: Night,
//             Morning: Morning,
//             pubsub
//         }),
//     }));
// }

// startServer();

// httpServer.listen({ port: PORT }, () => {
//     console.log(`Apollo server is up on port ${PORT}`)
// });
