"use client";

import { ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // your GraphQL endpoint
  cache: new InMemoryCache(),
  headers: typeof window !== "undefined" && localStorage.getItem("token")
    ? {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    : {},
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

export default Providers;