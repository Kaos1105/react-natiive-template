declare module '*.jpg' {
    const path: string;
    export default path;
}

declare module '*.png' {
    const path: string;
    export default path;
}

declare module '*.svg' {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}
