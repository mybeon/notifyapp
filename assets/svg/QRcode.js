import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';
import React from 'react';

const QRcode = () => {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#clip0_225_262)">
        <Path
          d="M3.5 3.5h5.25v5.25H3.5V3.5zm14 0v5.25h-5.25V3.5h5.25zm-5.25 9.625H14v-1.75h-1.75v-1.75H14v1.75h1.75v-1.75h1.75v1.75h-1.75v1.75h1.75v2.625h-1.75v1.75H14v-1.75h-2.625v1.75h-1.75V14h2.625v-.875zm1.75 0v2.625h1.75v-2.625H14zM3.5 17.5v-5.25h5.25v5.25H3.5zM5.25 5.25V7H7V5.25H5.25zm8.75 0V7h1.75V5.25H14zM5.25 14v1.75H7V14H5.25zM3.5 9.625h1.75v1.75H3.5v-1.75zm4.375 0h3.5v3.5h-1.75v-1.75h-1.75v-1.75zm1.75-4.375h1.75v3.5h-1.75v-3.5zM1.75 1.75v3.5H0v-3.5A1.75 1.75 0 011.75 0h3.5v1.75h-3.5zM19.25 0A1.75 1.75 0 0121 1.75v3.5h-1.75v-3.5h-3.5V0h3.5zM1.75 15.75v3.5h3.5V21h-3.5A1.75 1.75 0 010 19.25v-3.5h1.75zm17.5 3.5v-3.5H21v3.5A1.75 1.75 0 0119.25 21h-3.5v-1.75h3.5z"
          fill="#102661"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_225_262">
          <Path fill="#fff" d="M0 0H21V21H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default QRcode;
