import React from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import {
  MeQueryResult,
  useDeletePostMutation,
  useMeQuery,
} from "../generated/graphql";
interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
  createdAt: String;
  locked: boolean;
  meQuery: MeQueryResult;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
  createdAt,
  locked,
  meQuery,
}) => {
  const [deletePost] = useDeletePostMutation();
  const date1 = new Date();

  let text = " sec";
  const og_delta_time = (date1.valueOf() - Number(createdAt)) / 1000;
  let delta_time = og_delta_time;
  if (delta_time > 60) {
    delta_time = delta_time / 60;
    text = " min";
  }
  if (delta_time > 60) {
    delta_time = delta_time / 60;
    text = " hour";
  }

  if (delta_time >= 1.5) {
    text += "s ago";
  } else {
    text += " ago";
  }
  if (meQuery.data?.me?.id !== creatorId) {
    if (!locked)
      return (
        <Box maxWidth={"50px"}>
          <Text
            fontSize={"small"}
            alignSelf={"end"}
            textColor={locked ? "grey" : ""}
          >
            {delta_time.toFixed(0)}
            {text}
          </Text>
        </Box>
      );
    else {
      return <></>;
    }
  }

  return (
    <VStack alignItems={"end"}>
      <Text
        m={2}
        alignSelf={"end"}
        fontSize={"small"}
        textColor={locked ? "grey" : ""}
      >
        {delta_time.toFixed(0)}
        {text}
      </Text>
      <Flex alignItems={"end"}>
        {og_delta_time < 60 * 1.5 ? (
          <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
            <IconButton
              as={Link}
              ml={"auto"}
              mr={4}
              icon={<EditIcon />}
              aria-label="Edit Post"
            />
          </NextLink>
        ) : null}

        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete Post"
          onClick={() => {
            deletePost({
              variables: { id },
              update: (cache) => {
                // Post:77
                cache.evict({ id: "Post:" + id });
              },
            });
          }}
        />
      </Flex>
    </VStack>
  );
};
