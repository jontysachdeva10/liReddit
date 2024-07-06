import React from "react";
import Wrapper, { WrapperVariant } from "./Wrapper";
import Nav from "./Nav";

interface WrapperWithNavProps {
  children: React.ReactNode,
  variant?: WrapperVariant;
}

const WrapperWithNav: React.FC<WrapperWithNavProps> = ({
  children,
  variant
}) => {
  return (
    <>
      <Nav />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default WrapperWithNav;
