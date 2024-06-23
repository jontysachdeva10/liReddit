'use client';

import { Box } from "@chakra-ui/react";

interface WrapperProps {
  children: React.ReactNode,
  variant?: 'small' | 'regular',
}

const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}: {
  children: React.ReactNode;
  variant?: string;
}) => {
  return (
    <Box
      mt={8}
      w="100%"
      maxW={variant === "regular" ? "800px" : "400px"}
      mx="auto"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
