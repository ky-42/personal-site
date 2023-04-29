import styled, { css, keyframes } from 'styled-components';

/* -------------------------------------------------------------------------- */

const MainVisibility = keyframes`
  0% {opacity: 0%}
  80% {opacity: 0%}
  100% {width: 100%}
`;

const FadeInAnimation = css`
  animation: ${MainVisibility} 3s linear 1;
`;

const LoadingMain = styled.main`
  overflow: hidden;
  width: 100%;
  height: 100vh;
  // So that the loading text is not imeadiatly visible
  // It will only be visable after 3 seconds
  ${FadeInAnimation}
`;

/* -------------------------------------------------------------------------- */

const LoadingText = styled.p`
  position: absolute;
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${(props) => props.theme.backgroundColour};
  font-size: 3rem;
  z-index: 100;
`;

/* --------------------------- Cube Animation CSS --------------------------- */

const CubeFallFrames = keyframes`
  0% {
    top: 50%;
    transform: translate(-50%, -50%) rotate(0);
  }
  50% {
    top: 50%;
    transform: translate(-50%, -50%) rotate(0);
  }
  60% {
    top: 50%;
    transform: translate(-50%, -50%) rotate(0);
  }
  85% {
    top: 115%;
  }
  85.01% {
    top:-15%;    
    transform: translate(-50%, -50%) rotate(0);
  }
  100% {
    top: 50%;
    transform: translate(-50%, -50%) rotate(0);
  }
`;

const CubeWidthFrames = keyframes`
  0% {
    width: 5rem;
  }
  1% {
    width: 20rem;
  }
  48% {
    width: 20rem;
  }
  50% {
    width: 5rem;
  }
  100% {
    width: 5rem;
  }
`;

const CubeAnimation = css`
  animation: ${CubeFallFrames} 5s cubic-bezier(0.81, 0, 1, 0.8) infinite,
    ${CubeWidthFrames} 5s ease-in infinite;
`;

const Cube = styled.div`
  position: absolute;
  width: 5rem;
  height: 5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => props.theme.textColour};
  ${CubeAnimation}
`;

/* -------------------------------------------------------------------------- */

const LoadingPage = () => {
  return (
    <LoadingMain>
      <LoadingText>Loading...</LoadingText>
      <Cube />
    </LoadingMain>
  );
};

export default LoadingPage;
