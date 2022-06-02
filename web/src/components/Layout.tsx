import React from "react";
import { Wrapper, WrapperVariant } from "./Wrapper";
import { NavBar } from "./NavBar";
import { useColorModeValue } from "@chakra-ui/system";
import { Box, Flex } from "@chakra-ui/layout";
import { MeQueryResult } from "../generated/graphql";

interface LayoutProps {
  variant?: WrapperVariant;
  children?: React.ReactNode;
  meQuery: MeQueryResult;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  variant,
  meQuery,
}) => {
  return (
    <>
      <NavBar meQuery={meQuery} />

      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
Box;
