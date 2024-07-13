import React from 'react';
import Popover from 'react-popover';

import ColorButton from './color-button/color-button';
import ColorPicker from '../containers/color-picker';
import InputGroup from './input-group/input-group';
import Label from './forms/label';

import GradientTypes from '../lib/gradient-types';

interface ColorIndicatorComponentProps {
    className?: string;
    disabled: boolean;
    color?: string;
    color2?: string;
    colorModalVisible: boolean;
    gradientType: keyof typeof GradientTypes;
    label: string;
    onChangeColor: (color: string) => void;
    onChangeGradientType: (gradientType: keyof typeof GradientTypes) => void;
    onCloseColor: () => void;
    onOpenColor: () => void;
    onSwap: () => void;
    outline: boolean;
    shouldShowGradientTools: boolean;
}

const ColorIndicatorComponent = (props: ColorIndicatorComponentProps) => (
    <InputGroup
        className={props.className}
        disabled={props.disabled}
    >
        <Popover
            body={
                <ColorPicker
                    color={props.color}
                    color2={props.color2}
                    gradientType={props.gradientType}
                    shouldShowGradientTools={props.shouldShowGradientTools}
                    onChangeColor={props.onChangeColor}
                    onChangeGradientType={props.onChangeGradientType}
                    onSwap={props.onSwap}
                />
            }
            isOpen={props.colorModalVisible}
            preferPlace="below"
            onOuterAction={props.onCloseColor}
        >
            <Label text={props.label}>
                <ColorButton
                    color={props.color}
                    color2={props.color2}
                    gradientType={props.gradientType}
                    onClick={props.onOpenColor}
                    outline={props.outline}
                />
            </Label>
        </Popover>
    </InputGroup>
);

export default ColorIndicatorComponent;
