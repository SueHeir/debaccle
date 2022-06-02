import { useRouter } from "next/router";
import React from "react";
import { QueryClient } from "react-query";

export function useReactQueryClient() {
    const router = useRouter();
    const [queryClient] = React.useState(function () {
      return new QueryClient({
        defaultOptions: {
          queries: {
            onError(err) {
              // ....
            },
          },
        },
      });
    });
  
    return queryClient;
  }
  