import Svg, {Path} from 'react-native-svg';
import React from 'react';

const Camera = () => {
  return (
    <Svg
      width={35}
      height={35}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10.5 13.125a2.625 2.625 0 100-5.25 2.625 2.625 0 000 5.25z"
        fill="#FAFAFA"
      />
      <Path
        d="M17.5 3.5h-2.774l-1.085-1.181a1.742 1.742 0 00-1.286-.569h-3.71c-.49 0-.962.21-1.295.569L6.274 3.5H3.5c-.962 0-1.75.787-1.75 1.75v10.5c0 .962.788 1.75 1.75 1.75h14c.962 0 1.75-.788 1.75-1.75V5.25c0-.963-.788-1.75-1.75-1.75zm-7 11.375A4.377 4.377 0 016.125 10.5 4.377 4.377 0 0110.5 6.125a4.377 4.377 0 014.375 4.375 4.377 4.377 0 01-4.375 4.375z"
        fill="#FAFAFA"
      />
    </Svg>
  );
};

export default Camera;
