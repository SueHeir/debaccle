import React from "react";
import { Box, Button, IconButton, Link } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import {
  MeQueryResult,
  useDeletePostMutation,
  useFollowUserMutation,
  useHateUserMutation,
  useMeQuery,
  UserDocument,
  UserQuery,
  useUnFollowUserMutation,
  useUnHateUserMutation,
} from "../generated/graphql";
import router from "next/router";
import produce from "immer";
interface EditDeletePostButtonsProps {
  meData: MeQueryResult;
  username: string;
  followers: number[];
  haters: number[];
  id: number;
  profileName: string;
}

export const EditFollowHateButtons: React.FC<EditDeletePostButtonsProps> = ({
  meData,
  id,
  username,
  followers,
  haters,
  profileName,
}) => {
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnFollowUserMutation();

  const [hateUser] = useHateUserMutation();
  const [unhateUser] = useUnHateUserMutation();

  let userProfile;
  let editFollowButton;
  if (meData.data?.me?.id) {
    editFollowButton = (
      <Box ml={"auto"}>
        <Button
          m={2}
          aria-label="Follow"
          onClick={async () => {
            if (meData.data?.me?.id) {
              const meID = meData.data.me.id;
              const { errors, data: UserData } = await followUser({
                variables: { username: username },
                update: (cache) => {
                  // Post:77
                  const userData = cache.readQuery<UserQuery>({
                    query: UserDocument,
                    variables: {
                      username: profileName,
                      id: null,
                    },
                  });
                  console.log(userData);
                  if (userData?.user?.id == meID) {
                    cache.writeQuery<UserQuery>({
                      query: UserDocument,
                      data: produce(userData, (x) => {
                        if (x.user?.following) {
                          x.user?.following.push(id);
                        }
                      }),
                    });
                  }
                },
              });
            }

            return;
          }}
        >
          Follow
        </Button>
        <Button
          m={2}
          aria-label="Hate"
          onClick={async () => {
            if (meData.data?.me?.id) {
              const meID = meData.data.me.id;
              const { errors, data: UserData } = await hateUser({
                variables: { username: username },
                update: (cache) => {
                  // Post:77
                  const userData = cache.readQuery<UserQuery>({
                    query: UserDocument,
                    variables: {
                      username: profileName,
                      id: null,
                    },
                  });
                  console.log(userData);
                  if (userData?.user?.id == meID) {
                    cache.writeQuery<UserQuery>({
                      query: UserDocument,
                      data: produce(userData, (x) => {
                        if (x.user?.hating) {
                          x.user?.hating.push(id);
                        }
                      }),
                    });
                  }
                },
              });
            }

            return;
          }}
        >
          Hate
        </Button>
      </Box>
    );

    if (followers.includes(meData.data.me.id)) {
      editFollowButton = (
        <Button
          m={2}
          ml={"auto"}
          aria-label="UnFollow"
          onClick={async () => {
            if (meData.data?.me?.id) {
              const meID = meData.data.me.id;
              await unfollowUser({
                variables: { username: username },
                update: (cache) => {
                  // Post:77
                  const userData = cache.readQuery<UserQuery>({
                    query: UserDocument,
                    variables: {
                      username: profileName,
                      id: null,
                    },
                  });
                  console.log(userData);
                  if (userData?.user?.id == meID) {
                    cache.writeQuery<UserQuery>({
                      query: UserDocument,
                      data: produce(userData, (x) => {
                        if (x.user?.following) {
                          let Index = -1;
                          for (let i = 0; i < x.user?.following.length; i++) {
                            if (x.user.following[i] == id) {
                              Index = i;
                            }
                          }
                          x.user?.following.splice(Index, 1);
                        }
                      }),
                    });
                  }
                },
              });
            }

            return;
          }}
        >
          UnFollow
        </Button>
      );
    }
    if (haters.includes(meData.data.me.id)) {
      editFollowButton = (
        <Button
          m={2}
          ml={"auto"}
          aria-label="UnHate"
          onClick={async () => {
            if (meData.data?.me?.id) {
              const meID = meData.data.me.id;
              await unhateUser({
                variables: { username: username },
                update: (cache) => {
                  // Post:77
                  const userData = cache.readQuery<UserQuery>({
                    query: UserDocument,
                    variables: {
                      username: profileName,
                      id: null,
                    },
                  });
                  console.log(userData);
                  if (userData?.user?.id == meID) {
                    cache.writeQuery<UserQuery>({
                      query: UserDocument,
                      data: produce(userData, (x) => {
                        if (x.user?.hating) {
                          let Index = -1;
                          for (let i = 0; i < x.user?.hating.length; i++) {
                            if (x.user.hating[i] == id) {
                              Index = i;
                            }
                          }
                          x.user?.hating.splice(Index, 1);
                        }
                      }),
                    });
                  }
                },
              });
            }
            return;
          }}
        >
          UnHate
        </Button>
      );
    }

    if (meData.data.me.id == id) {
      editFollowButton = (
        <IconButton
          m={2}
          ml={"auto"}
          aria-label="Edit Profile"
          icon={<EditIcon />}
          onClick={() => {
            router.push("/edit-profile");
          }}
        />
      );

      if (!meData.data.me.emailvarified) {
        editFollowButton = <Box m={2}>Check Spam Email to register Email</Box>;
      }
    }
  }

  return <Box>{editFollowButton}</Box>;
};
