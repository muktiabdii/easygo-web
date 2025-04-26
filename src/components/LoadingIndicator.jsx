import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animasi titik-titik berputar
const dotBounce = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SpinnerDot = styled.div`
  width: 12px;
  height: 12px;
  margin: 0 4px;
  border-radius: 50%;
  background-color: #4A90E2;
  animation: ${dotBounce} 1.2s infinite ease-in-out;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const LoadingIndicator = () => (
  <SpinnerContainer>
    <SpinnerDot />
    <SpinnerDot />
    <SpinnerDot />
  </SpinnerContainer>
);

export default LoadingIndicator;
