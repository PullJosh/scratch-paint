import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';

import brushIcon from './brush.svg';

interface BitBrushModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const BitBrushModeComponent = (props: BitBrushModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.brush}
        imgSrc={brushIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default BitBrushModeComponent;
