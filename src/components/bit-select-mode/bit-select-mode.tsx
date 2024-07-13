import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import selectIcon from './marquee.svg';

interface BitSelectComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const BitSelectComponent = (props: BitSelectComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.select}
        imgSrc={selectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default BitSelectComponent;
