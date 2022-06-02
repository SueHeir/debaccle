import React from "react";
import { Box, IconButton, Link } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import produce from "immer";
import {
  MeQueryResult,
  PostsDocument,
  PostsQuery,
  useDeleteCommentMutation,
  useMeQuery,
} from "../generated/graphql";

interface EditDeleteCommentButtons {
  id: number;
  creatorId: number;
  postId: number | null | undefined;
  limit: number | undefined;
  cursor: string | null | undefined;
  users: string[] | null;
  userids: number[] | null;
  createdAt: String;
  meQuery: MeQueryResult;
}

export const EditDeleteCommentButtons: React.FC<EditDeleteCommentButtons> = ({
  id,
  creatorId,
  postId,
  limit,
  cursor,
  users,
  userids,
  meQuery,
}) => {
  const { data: meData } = meQuery;
  const [deleteComment] = useDeleteCommentMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  if (postId)
    return (
      <Box>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete Comment"
          onClick={() => {
            deleteComment({
              variables: { id, postId },
              update: (cache) => {
                // Post:77
                cache.evict({ id: "Comment:" + id });

                const postData = cache.readQuery<PostsQuery>({
                  query: PostsDocument,
                  variables: {
                    limit: limit,
                    cursor: cursor,
                    users: users,
                    userids: userids,
                  },
                });

                // console.log(postData)

                console.log(postData);
                if (postData) {
                  cache.writeQuery<PostsQuery>({
                    query: PostsDocument,
                    data: produce(postData, (x) => {
                      if (x) {
                        x.posts.posts.map((p) => {
                          if (p.id == postId) {
                            p.commentCount -= 1;
                          }
                        });
                      }
                    }),
                  });
                }
              },
            });
          }}
        />
      </Box>
    );

  return <Box> Loading...</Box>;
};
