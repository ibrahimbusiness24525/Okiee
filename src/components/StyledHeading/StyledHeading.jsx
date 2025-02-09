import React from 'react';
import styled from 'styled-components';

const Heading = styled.h3`
  text-align: start;
  margin-bottom: 10px;
  font-weight: 400;
  font-size: 17px;
  color: #333;
  border-left: 4px solid #007bff;
  padding-left: 10px;
`;

const StyledHeading = ({ children }) => {
  return <Heading>{children}</Heading>;
};

export  {StyledHeading};
