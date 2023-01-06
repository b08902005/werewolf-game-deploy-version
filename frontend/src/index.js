import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws";

import { ChatProvider } from "./containers/hooks/useChat"
import { UserProvider } from "./containers/hooks/useUser";
import { GameProvider } from "./containers/hooks/useGame";
import App from "./containers/App";
import reportWebVitals from "./reportWebVitals";

// const httpUri = `http://${window.location.hostname}:4000/`
// const wsUrl = `ws://${window.location.hostname}:4000/`
// console.log(httpUri, wsUrl);

const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === 'production'
    ? '/graphql'
    : 'http://localhost:4000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: process.env.NODE_ENV === 'production'
    ? window.location.origin.replace(/^http/, "ws") + '/graphql'
    : 'ws://localhost:4000/graphql',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <UserProvider>
        <GameProvider>
          <ChatProvider><App /></ChatProvider>
        </GameProvider>
      </UserProvider>
    </ApolloProvider>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
