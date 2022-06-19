import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Link,
  Flex,
  Button,
  Heading,
  useColorMode,
  useColorModeValue,
  IconButton,
  useDisclosure,
  Stack,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  useMeQuery,
  useLogoutMutation,
  MeQueryResult,
} from "../generated/graphql";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import {
  AddIcon,
  ChevronDownIcon,
  CloseIcon,
  HamburgerIcon,
  MoonIcon,
  PlusSquareIcon,
  SearchIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { CgHome, CgHomeAlt, CgProfile } from "react-icons/cg";
import { useMediaQuery } from "@chakra-ui/react";
import useMobileDetect from "../utils/isMobile";
import { IMAGE_HOST } from "../utils/constants";
import { SetNotificationId } from "../utils/SetNotificationId";
import { NotificationMenuItem } from "./NotificationMenuItem";
import {
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationIcon,
  BottomNavigationLabel,
} from "chakra-ui-bottom-navigation";

interface NavBarProps {
  deviceType?: string;
  meQuery: MeQueryResult;
}

export const NavBar: React.FC<NavBarProps> = ({ meQuery }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  const pathname = router.pathname;
  // console.log(pathname);

  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = meQuery;

  let isMobile = useMobileDetect().isMobile();

  // const [showChild, setShowChild] = useState(false);
  // useEffect(() => {
  //   setShowChild(true);
  // }, []);

  // if (!showChild) {
  //   return null;
  // }

  const path = router.asPath;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = useCallback(
    (path: any) => {
      router.push(path);
    },
    [router.push]
  );

  let loginbody = null;
  let moblieNavFooter = <></>;
  let navHeader = <></>;
  let mobilePadding = <Box pb={16}></Box>;
  let profilePath = "/users/";
  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    let colorOfButton = "white";
    if (colorMode === "light") {
      colorOfButton = "black";
    }

    navHeader = (
      <HStack spacing={0} alignItems={"center"}>
        <HStack as={"nav"} spacing={1} ml={2} mr={2}>
          <NextLink href="/">
            <Box>
              <Button
                size="md"
                aria-label="Home"
                colorScheme={colorMode === "light" ? "darkgray" : ""}
                textColor={pathname == "/" ? "primary.200" : "white"}
              >
                <CgHomeAlt />
                <Box
                  ml={1}
                  pl={"auto"}
                  pr={"auto"}
                  display={{ base: "none", md: "flex" }}
                >
                  Home
                </Box>
              </Button>
            </Box>
          </NextLink>
          <NextLink href="/explore">
            <Box>
              <Button
                size="md"
                aria-label="Explore"
                colorScheme={colorMode === "light" ? "darkgray" : ""}
                textColor={pathname == "/explore" ? "primary.200" : "white"}
              >
                <SearchIcon />
                <Box ml={1} display={{ base: "none", md: "flex" }}>
                  Explore
                </Box>
              </Button>
            </Box>
          </NextLink>
        </HStack>
      </HStack>
    );

    loginbody = (
      <>
        <Button
          mr={2}
          textColor={pathname == "/login" ? "primary.500" : colorOfButton}
          onClick={async () => {
            router.push("/login");
          }}
        >
          login
        </Button>
        <Button
          mr={2}
          colorScheme={"gray"}
          textColor={pathname == "/register" ? "primary.500" : colorOfButton}
          onClick={async () => {
            router.push("/register");
          }}
        >
          register
        </Button>
      </>
    );

    if (isMobile) {
      navHeader = <Text color={"white"}>Debaccle</Text>;
      mobilePadding = <Box pt={0}> </Box>;
      moblieNavFooter = (
        <BottomNavigation
          value={router.pathname}
          onChange={handleChange}
          rounded={"none"}
          zIndex={100}
          pb={5}
        >
          <BottomNavigationItem value="/">
            <BottomNavigationIcon as={CgHomeAlt} />
            <BottomNavigationLabel>Home</BottomNavigationLabel>
          </BottomNavigationItem>

          <BottomNavigationItem value="/explore">
            <BottomNavigationIcon as={SearchIcon} />
            <BottomNavigationLabel>Explore</BottomNavigationLabel>
          </BottomNavigationItem>
        </BottomNavigation>
      );
    }
    // user is logged in
  } else {
    profilePath += data.me.username;

    loginbody = (
      <Menu>
        <MenuButton
          as={Button}
          mr={4}
          rounded={"full"}
          variant={"link"}
          cursor={"pointer"}
          minW={0}
        >
          <Avatar
            size={"sm"}
            mr={1}
            src={data.me.image == "" ? "" : `${IMAGE_HOST}${data.me.image}`}
          />
        </MenuButton>
        <MenuList zIndex={120}>
          <MenuItem
            w={"100%"}
            onClick={async () => {
              await logout();

              await apolloClient.resetStore();
            }}
            // isLoading={logoutFetching}
            // variant="ghost"
          >
            logout
          </MenuItem>
          <NotificationMenuItem id={data.me.id} />
        </MenuList>
      </Menu>
    );

    navHeader = (
      <HStack spacing={0} alignItems={"center"}>
        <HStack as={"nav"} spacing={1} ml={2} mr={2}>
          <NextLink href="/">
            <Box>
              <Button
                size="md"
                aria-label="Home"
                colorScheme={colorMode === "light" ? "darkgray" : ""}
                textColor={pathname == "/" ? "primary.200" : "white"}
              >
                <CgHomeAlt />
                <Box
                  ml={1}
                  pl={"auto"}
                  pr={"auto"}
                  display={{ base: "none", md: "flex" }}
                >
                  Home
                </Box>
              </Button>
            </Box>
          </NextLink>
          <NextLink href="/explore">
            <Box>
              <Button
                size="md"
                aria-label="Explore"
                colorScheme={colorMode === "light" ? "darkgray" : ""}
                textColor={pathname == "/explore" ? "primary.200" : "white"}
              >
                <SearchIcon />
                <Box ml={1} display={{ base: "none", md: "flex" }}>
                  Explore
                </Box>
              </Button>
            </Box>
          </NextLink>

          <NextLink href={profilePath}>
            <Box>
              <Button
                size="md"
                aria-label="Profile"
                colorScheme={colorMode === "light" ? "darkgray" : ""}
                textColor={
                  pathname == "/users/[username]" ? "primary.200" : "white"
                }
              >
                <CgProfile />
                <Box ml={1} display={{ base: "none", md: "flex" }}>
                  Profile
                </Box>
              </Button>
            </Box>
          </NextLink>
          <NextLink href="/create-post">
            <Box>
              <Button
                size="md"
                aria-label="Post"
                colorScheme={colorMode === "light" ? "darkgray" : ""}
                textColor={pathname == "/create-post" ? "primary.200" : "white"}
              >
                <AddIcon />
                <Box ml={1} display={{ base: "none", md: "flex" }}>
                  Opinion
                </Box>
              </Button>
            </Box>
          </NextLink>
        </HStack>
      </HStack>
    );

    if (isMobile) {
      navHeader = (
        <Text fontSize={22} color={"white"}>
          Debaccle
        </Text>
      );
      mobilePadding = <Box pt={0}> </Box>;

      moblieNavFooter = (
        <BottomNavigation
          value={router.pathname}
          onChange={handleChange}
          rounded={"none"}
          zIndex={100}
          pb={5}
        >
          <BottomNavigationItem value="/">
            <BottomNavigationIcon as={CgHomeAlt} />
            <BottomNavigationLabel>Home</BottomNavigationLabel>
          </BottomNavigationItem>

          <BottomNavigationItem value="/explore">
            <BottomNavigationIcon as={SearchIcon} />
            <BottomNavigationLabel>Explore</BottomNavigationLabel>
          </BottomNavigationItem>

          <BottomNavigationItem value={profilePath}>
            <BottomNavigationIcon as={CgProfile} />
            <BottomNavigationLabel>Profile</BottomNavigationLabel>
          </BottomNavigationItem>

          <BottomNavigationItem value="/create-post">
            <BottomNavigationIcon as={AddIcon} />
            <BottomNavigationLabel>Opinion</BottomNavigationLabel>
          </BottomNavigationItem>
        </BottomNavigation>
      );
    }
  }
  // {
  //   50: '#eef1f9',
  //   100: '#d3d6de',
  //   200: '#b7bbc5',
  //   300: '#9a9faf',
  //   400: '#7e8498',
  //   500: '#646b7e',
  //   600: '#4e5363',
  //   700: '#383b47',
  //   800: '#21242c',
  //   900: '#090c14',
  // }

  return (
    <>
      <Box
        bg={useColorModeValue("#21242c", "#1b1c21")}
        w={isMobile ? "100vp" : "100%"}
        top={isMobile ? undefined : 0}
        position={isMobile ? undefined : "fixed"}
        zIndex={50}
      >
        <Box>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              ml={2}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
              colorScheme={colorMode === "light" ? "darkgray" : ""}
              textColor={"white"}
            />
            <Box display={{ base: "none", md: "flex" }}>
              <Box mt={1} ml={4} mr={2} fontSize={20} textColor={"white"}>
                <NextLink href={"/about"}>Debaccle</NextLink>
              </Box>
              <Button
                onClick={toggleColorMode}
                colorScheme={colorMode === "light" ? "darkgray" : ""}
                textColor={"white"}
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Box>
            {navHeader}

            <Flex alignItems={"center"}>
              <Box mr={2} textColor={"white"}>
                {data?.me?.username}
              </Box>

              {loginbody}
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                <Button onClick={toggleColorMode}>
                  {colorMode === "light" ? "Dark Mode  " : "Light Mode  "}
                  {colorMode === "light" ? (
                    <MoonIcon ml={2} />
                  ) : (
                    <SunIcon ml={2} />
                  )}
                </Button>
                <Button onClick={() => router.push("/about")}>About</Button>
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Box>
      {mobilePadding}
      {moblieNavFooter}
    </>
  );
};
