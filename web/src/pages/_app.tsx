import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { QueryClient } from "react-query";
import { ChakraProvider, ColorModeScript, CSSReset } from "@chakra-ui/react";
import { PaginatedPosts, useMeQuery } from "../generated/graphql";
import theme from "../theme";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
declare global {
  interface Window {
    OneSignal: any;
  }
}

const link = createUploadLink({
  uri: process.env.NEXT_PUBLIC_URL,
  credentials: "include",
}) as unknown as ApolloLink;

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // keyArgs: [],
            // merge(
            //   existing: PaginatedPosts | undefined,
            //   incoming: PaginatedPosts
            // ): PaginatedPosts {
            //   return {
            //     ...incoming,
            //     posts: [...(existing?.posts || []), ...incoming.posts],
            //   };
            // },
          },
        },
      },
    },
  }),
  link: link,
});

function MyApp({ Component, pageProps }: any) {
  const router = useRouter();

  // const meQuery = useMeQuery();

  // useEffect(() => {
  //   window.OneSignal = window.OneSignal || [];

  //   OneSignal.init({
  //     appId: "33218402-d669-4787-9d3d-cb946b692027",
  //     subdomainName: "http://debaccle.com",
  //     notifyButton: {
  //       enable: false,
  //     },

  //     allowLocalhostAsSecureOrigin: true,
  //   });

  //   // OneSignal.setExternalUserId(id.toString());
  //   // }
  //   // }

  //   return () => {
  //     window.OneSignal = undefined;
  //   };
  // }, []);

  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <CSSReset />

        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
