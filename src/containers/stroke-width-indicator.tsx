import {connect} from 'react-redux';
import React from 'react';
import bindAll from 'lodash.bindall';
import parseColor from 'parse-color';
import {changeStrokeColor, changeStrokeColor2, changeStrokeGradientType} from '../reducers/stroke-style';
import {changeStrokeWidth} from '../reducers/stroke-width';
import StrokeWidthIndicatorComponent from '../components/stroke-width-indicator';
import {getSelectedLeafItems} from '../helper/selection';
import {
    applyColorToSelection, applyStrokeWidthToSelection, getColorsFromSelection, MIXED
} from '../helper/style-path';
import GradientTypes from '../lib/gradient-types';
import Modes from '../lib/modes';
import Formats, {isBitmap} from '../lib/format';

interface StrokeWidthIndicatorProps {
    disabled: boolean;
    format?: keyof typeof Formats;
    onChangeStrokeColor: (strokeColor: string) => void;
    onChangeStrokeColor2: (strokeColor: string) => void;
    onChangeStrokeGradientType: (strokeColor: string) => void;
    onChangeStrokeWidth: (strokeWidth: number) => void;
    onUpdateImage: () => void;
    strokeWidth?: number;
    textEditTarget?: number;
}

class StrokeWidthIndicator extends React.Component<StrokeWidthIndicatorProps> {
    constructor (props: StrokeWidthIndicatorProps) {
        super(props);
        bindAll(this, [
            'handleChangeStrokeWidth'
        ]);
    }
    handleChangeStrokeWidth (newWidth: number) {
        let changed = applyStrokeWidthToSelection(newWidth, this.props.textEditTarget);
        if ((!this.props.strokeWidth || this.props.strokeWidth === 0) && newWidth > 0) {
            const currentColorState = getColorsFromSelection(getSelectedLeafItems(), isBitmap(this.props.format));

            // Color counts as null if either both colors are null or the primary color is null and it's solid
            // TODO: consolidate this check in one place
            const wasNull = currentColorState.strokeColor === null &&
                (currentColorState.strokeColor2 === null ||
                 currentColorState.strokeGradientType === GradientTypes.SOLID);

            if (wasNull) {
                changed = applyColorToSelection(
                    '#000',
                    0, // colorIndex,
                    true, // isSolidGradient
                    true, // applyToStroke
                    this.props.textEditTarget) ||
                    changed;
                // If there's no previous stroke color, default to solid black
                this.props.onChangeStrokeGradientType(GradientTypes.SOLID);
                this.props.onChangeStrokeColor('#000');
            } else if (currentColorState.strokeColor !== MIXED) {
                // Set color state from the selected item's stroke color
                this.props.onChangeStrokeGradientType(currentColorState.strokeGradientType);
                this.props.onChangeStrokeColor(parseColor(currentColorState.strokeColor).hex);
                this.props.onChangeStrokeColor2(parseColor(currentColorState.strokeColor2).hex);
            }
        }
        this.props.onChangeStrokeWidth(newWidth);
        if (changed) this.props.onUpdateImage();
    }
    render () {
        return (
            <StrokeWidthIndicatorComponent
                disabled={this.props.disabled}
                strokeWidth={this.props.strokeWidth}
                onChangeStrokeWidth={this.handleChangeStrokeWidth}
            />
        );
    }
}

const mapStateToProps = state => ({
    disabled: state.scratchPaint.mode === Modes.BRUSH ||
        state.scratchPaint.mode === Modes.TEXT ||
        state.scratchPaint.mode === Modes.FILL,
    format: state.scratchPaint.format,
    strokeWidth: state.scratchPaint.color.strokeWidth,
    textEditTarget: state.scratchPaint.textEditTarget
});
const mapDispatchToProps = dispatch => ({
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    },
    onChangeStrokeColor2: strokeColor => {
        dispatch(changeStrokeColor2(strokeColor));
    },
    onChangeStrokeGradientType: strokeColor => {
        dispatch(changeStrokeGradientType(strokeColor));
    },
    onChangeStrokeWidth: strokeWidth => {
        dispatch(changeStrokeWidth(strokeWidth));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrokeWidthIndicator);
