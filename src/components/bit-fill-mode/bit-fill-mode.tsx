import React from 'react';

import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import fillIcon from './fill.svg';

interface BitFillComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const BitFillComponent = (props: BitFillComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.fill}
        imgSrc={fillIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default BitFillComponent;
