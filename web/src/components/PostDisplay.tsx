import React from "react";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
  Image,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import {
  MeQueryResult,
  useDeletePostMutation,
  useMeQuery,
} from "../generated/graphql";
import { IMAGE_HOST } from "../utils/constants";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import ImageModal from "./ImageModal";
interface PostProps {
  p: {
    title: string;
    id: number;
    image: string;
    text: string;
    locked: boolean;
    createdAt: String;
    creator: {
      id: number;
      image: string;
      username: string;
    };
  };
  meQuery: MeQueryResult;
}

export const PostDisplay: React.FC<PostProps> = ({ p, meQuery }) => {
  return (
    <Box>
      <Flex p={4} pt={1} pb={1}>
        <Avatar
          size={"lg"}
          mr={2}
          src={p.creator.image == "" ? "" : `${IMAGE_HOST}${p.creator.image}`}
        />

        <Box flex={1}>
          <NextLink href="/post/[id]" as={`/post/${p.id}`}>
            <Link>
              <Heading
                textColor={p.locked ? "grey" : ""}
                fontSize="xl"
                mt={1}
                mb={1}
              >
                {p.title}
              </Heading>
            </Link>
          </NextLink>
          <NextLink href={"/users/" + p.creator.username}>
            <Link>
              <Text textColor={p.locked ? "grey" : ""}>
                @{p.creator.username}
              </Text>
            </Link>
          </NextLink>
        </Box>
        <Box ml="auto" mb={"auto"}>
          <EditDeletePostButtons
            id={p.id}
            creatorId={p.creator.id}
            createdAt={p.createdAt}
            locked={p.locked}
            meQuery={meQuery}
          />
        </Box>
      </Flex>
      <Flex p={2} pl={4} pr={4} pb={1} align="center">
        <Text
          flex={1}
          mt={0}
          wordBreak={"break-word"}
          textColor={p.locked ? "grey" : ""}
        >
          {p.text}
        </Text>
      </Flex>

      {p.image ? (
        <ImageModal
          src={p.image == "" ? "" : `${IMAGE_HOST}${p.image}`}
        ></ImageModal>
      ) : null}
    </Box>
  );
};
