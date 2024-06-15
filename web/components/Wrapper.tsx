import { Box } from "@chakra-ui/react";

const Wrapper = ({ children, variant = "regular" }) => {
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
