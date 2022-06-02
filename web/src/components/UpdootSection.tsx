import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  MeQueryResult,
  PostSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
  meQuery: MeQueryResult;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({
  post,
  meQuery,
}) => {
  const { data: meData } = meQuery;
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  const toast = useToast();

  let count = 0;
  return (
    <Flex direction="row" justifyContent="center" alignItems="center">
      <IconButton
        m={2}
        ml={4}
        onClick={async () => {
          if (!meData?.me) {
            return;
          }

          if (post.voteStatus === 1) {
            return;
          }

          setLoadingState("updoot-loading");
          const returnvote = await vote({
            variables: {
              postId: post.id,
              value: 1,
            },
          });
          setLoadingState("not-loading");
          await meQuery.refetch();

          if (returnvote.data?.vote.upvotes != post.upvotes) {
            if (meQuery.data?.me?.credits)
              toast({
                title: `Points Left: ${meQuery.data.me.credits - 1}`,
                status: "success",
                duration: 900,
                isClosable: true,
              });
          }
        }}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        isLoading={loadingState === "updoot-loading"}
        aria-label="updoot post"
        icon={<ChevronUpIcon />}
      />
      <Text textColor={post.locked ? "grey" : ""}>{post.upvotes}</Text>
      <IconButton
        m={2}
        onClick={async () => {
          if (!meData?.me) {
            return;
          }

          if (post.voteStatus === -1) {
            return;
          }

          setLoadingState("downdoot-loading");
          const returnvote = await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
          });
          setLoadingState("not-loading");
          await meQuery.refetch();

          if (meQuery.data?.me?.credits)
            if (returnvote.data?.vote.downvotes != post.downvotes) {
              toast({
                title: `Points Left: ${meQuery.data.me.credits - 1}`,
                status: "success",
                duration: 900,
                isClosable: true,
              });
            }
        }}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downdoot-loading"}
        aria-label="downdoot post"
        icon={<ChevronDownIcon />}
      />
      <Text textColor={post.locked ? "grey" : ""}>{post.downvotes}</Text>
    </Flex>
  );
};
