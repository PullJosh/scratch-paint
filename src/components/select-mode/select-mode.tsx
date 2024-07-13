import React from 'react';
import messages from '../../lib/messages';
import ToolSelectComponent from '../tool-select-base/tool-select-base';

import selectIcon from './select.svg';

interface SelectModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const SelectModeComponent = (props: SelectModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.select}
        imgSrc={selectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default SelectModeComponent;
