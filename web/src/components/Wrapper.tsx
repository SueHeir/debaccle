import React from "react";
import { Box } from "@chakra-ui/react";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  variant?: WrapperVariant;
  children?: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={3}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100vw!important;"
    >
      {children}
    </Box>
  );
};
