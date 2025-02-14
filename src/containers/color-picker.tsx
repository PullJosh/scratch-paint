import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import paper from '@scratch/paper';
import parseColor from 'parse-color';
import React from 'react';

import {changeColorIndex} from '../reducers/color-index';
import {clearSelectedItems} from '../reducers/selected-items';
import {activateEyeDropper} from '../reducers/eye-dropper';
import GradientTypes from '../lib/gradient-types';

import ColorPickerComponent from '../components/color-picker/color-picker';
import {MIXED} from '../helper/style-path';
import Modes from '../lib/modes';

const colorStringToHsv = (hexString: string) => {
    const hsv = parseColor(hexString).hsv;
    // Hue comes out in [0, 360], limit to [0, 100]
    hsv[0] = hsv[0] / 3.6;
    // Black is parsed as {0, 0, 0}, but turn saturation up to 100
    // to make it easier to see slider values.
    if (hsv[1] === 0 && hsv[2] === 0) {
        hsv[1] = 100;
    }
    return hsv;
};

const hsvToHex = (h: number, s: number, v: number) =>
    // Scale hue back up to [0, 360] from [0, 100]
    parseColor(`hsv(${3.6 * h}, ${s}, ${v})`).hex
;

interface ColorPickerProps {
    color?: string;
    color2?: string;
    colorIndex: number;
    gradientType: keyof typeof GradientTypes;
    isEyeDropping: boolean;
    mode?: keyof typeof Modes;
    onActivateEyeDropper: (currentTool: any, callback: any) => void;
    onChangeColor: (color: string) => void;
    onChangeGradientType?: (gradientType: keyof typeof GradientTypes) => void;
    onSelectColor: () => void;
    onSelectColor2: () => void;
    onSwap?: () => void;
    rtl: boolean;
    shouldShowGradientTools: boolean;
}

interface ColorPickerState {
    hue: number;
    saturation: number;
    brightness: number;
}

// Important! This component ignores new color props except when isEyeDropping
// This is to make the HSV <=> RGB conversion stable. The sliders manage their
// own changes until unmounted or color changes with props.isEyeDropping = true.
class ColorPicker extends React.Component<ColorPickerProps, ColorPickerState> {
    constructor (props: ColorPickerProps) {
        super(props);
        bindAll(this, [
            'getHsv',
            'handleChangeGradientTypeHorizontal',
            'handleChangeGradientTypeRadial',
            'handleChangeGradientTypeSolid',
            'handleChangeGradientTypeVertical',
            'handleHueChange',
            'handleSaturationChange',
            'handleBrightnessChange',
            'handleTransparent',
            'handleActivateEyeDropper'
        ]);

        const color = props.colorIndex === 0 ? props.color : props.color2;
        const hsv = this.getHsv(color);
        this.state = {
            hue: hsv[0],
            saturation: hsv[1],
            brightness: hsv[2]
        };
    }
    componentDidUpdate(prevProps: Readonly<ColorPickerProps>, prevState: Readonly<ColorPickerState>) {
        const color = this.props.colorIndex === 0 ? prevProps.color : prevProps.color2;
        const newColor = this.props.colorIndex === 0 ? this.props.color : this.props.color2;
        const colorSetByEyedropper = prevProps.isEyeDropping && color !== newColor;
        if (colorSetByEyedropper || prevProps.colorIndex !== this.props.colorIndex) {
            const hsv = this.getHsv(newColor);
            this.setState({
                hue: hsv[0],
                saturation: hsv[1],
                brightness: hsv[2]
            });
        }
    }
    getHsv (color: string) {
        const isTransparent = color === null;
        const isMixed = color === MIXED;
        return isTransparent || isMixed ?
            [50, 100, 100] : colorStringToHsv(color);
    }
    handleHueChange (hue: number) {
        this.setState({hue: hue}, () => {
            this.handleColorChange();
        });
    }
    handleSaturationChange (saturation: number) {
        this.setState({saturation: saturation}, () => {
            this.handleColorChange();
        });
    }
    handleBrightnessChange (brightness: number) {
        this.setState({brightness: brightness}, () => {
            this.handleColorChange();
        });
    }
    handleColorChange () {
        this.props.onChangeColor(hsvToHex(
            this.state.hue,
            this.state.saturation,
            this.state.brightness
        ));
    }
    handleTransparent () {
        this.props.onChangeColor(null);
    }
    handleActivateEyeDropper () {
        this.props.onActivateEyeDropper(
            paper.tool, // get the currently active tool from paper
            this.props.onChangeColor
        );
    }
    handleChangeGradientTypeHorizontal () {
        this.props.onChangeGradientType(GradientTypes.HORIZONTAL);
    }
    handleChangeGradientTypeRadial () {
        this.props.onChangeGradientType(GradientTypes.RADIAL);
    }
    handleChangeGradientTypeSolid () {
        this.props.onChangeGradientType(GradientTypes.SOLID);
    }
    handleChangeGradientTypeVertical () {
        this.props.onChangeGradientType(GradientTypes.VERTICAL);
    }
    render () {
        return (
            <ColorPickerComponent
                brightness={this.state.brightness}
                color={this.props.color}
                color2={this.props.color2}
                colorIndex={this.props.colorIndex}
                gradientType={this.props.gradientType}
                hue={this.state.hue}
                isEyeDropping={this.props.isEyeDropping}
                mode={this.props.mode}
                rtl={this.props.rtl}
                saturation={this.state.saturation}
                shouldShowGradientTools={this.props.shouldShowGradientTools}
                onActivateEyeDropper={this.handleActivateEyeDropper}
                onBrightnessChange={this.handleBrightnessChange}
                onChangeGradientTypeHorizontal={this.handleChangeGradientTypeHorizontal}
                onChangeGradientTypeRadial={this.handleChangeGradientTypeRadial}
                onChangeGradientTypeSolid={this.handleChangeGradientTypeSolid}
                onChangeGradientTypeVertical={this.handleChangeGradientTypeVertical}
                onHueChange={this.handleHueChange}
                onSaturationChange={this.handleSaturationChange}
                onSelectColor={this.props.onSelectColor}
                onSelectColor2={this.props.onSelectColor2}
                onSwap={this.props.onSwap}
                onTransparent={this.handleTransparent}
            />
        );
    }
}

const mapStateToProps = state => ({
    colorIndex: state.scratchPaint.fillMode.colorIndex,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    mode: state.scratchPaint.mode,
    rtl: state.scratchPaint.layout.rtl
});

const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    onActivateEyeDropper: (currentTool, callback) => {
        dispatch(activateEyeDropper(currentTool, callback));
    },
    onSelectColor: () => {
        dispatch(changeColorIndex(0));
    },
    onSelectColor2: () => {
        dispatch(changeColorIndex(1));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorPicker);
