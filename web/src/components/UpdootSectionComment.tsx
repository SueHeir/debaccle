import React, { useState } from "react";
import { Flex, Icon, IconButton, Text, useToast } from "@chakra-ui/react";
import {
  CommentSnippetFragment,
  useVoteCommentMutation,
  useMeQuery,
  PostSnippetFragment,
  MeQueryResult,
} from "../generated/graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useIsAuth } from "../utils/useIsAuth";

interface UpdootSectionComments {
  comment: CommentSnippetFragment;
  post: PostSnippetFragment | null;
  meQuery: MeQueryResult;
}

export const UpdootSectionComments: React.FC<UpdootSectionComments> = ({
  comment,
  post,
  meQuery,
}) => {
  const { data: meData } = meQuery;
  const toast = useToast();
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [voteComment] = useVoteCommentMutation();

  if (post)
    return (
      <Flex direction="row" justifyContent="center" alignItems="center">
        <IconButton
          m={2}
          ml={4}
          onClick={async () => {
            if (!meData?.me) {
              return;
            }
            setLoadingState("updoot-loading");
            const returnvote = await voteComment({
              variables: {
                commentId: comment.id,
                value: 1,
              },
              // update: (cache) => updateAfterVote(1, post.id, cache),
            });
            setLoadingState("not-loading");

            await meQuery.refetch();
            if (returnvote.data?.voteComment.upvotes != comment.upvotes) {
              if (meQuery.data?.me?.credits)
                toast({
                  title: `Points Left: ${meQuery.data.me.credits - 1}`,
                  status: "success",
                  duration: 900,
                  isClosable: true,
                });
            }
          }}
          isLoading={loadingState === "updoot-loading"}
          aria-label="updoot post"
          icon={<ChevronUpIcon />}
        />
        <Text textColor={post.locked ? "grey" : ""}>{comment.upvotes}</Text>
        <IconButton
          m={2}
          onClick={async () => {
            if (!meData?.me) {
              return;
            }

            setLoadingState("downdoot-loading");
            const returnvote = await voteComment({
              variables: {
                commentId: comment.id,
                value: -1,
              },
              // update: (cache) => updateAfterVote(-1, post.id, cache),
            });
            setLoadingState("not-loading");

            await meQuery.refetch();
            if (meQuery.data?.me?.credits)
              if (returnvote.data?.voteComment.downvotes != comment.downvotes) {
                toast({
                  title: `Points Left: ${meQuery.data.me.credits - 1}`,
                  status: "success",
                  duration: 900,
                  isClosable: true,
                });
              }
          }}
          isLoading={loadingState === "downdoot-loading"}
          aria-label="downdoot post"
          icon={<ChevronDownIcon />}
        />
        <Text textColor={post.locked ? "grey" : ""}>{comment.downvotes}</Text>
      </Flex>
    );

  return <></>;
};
