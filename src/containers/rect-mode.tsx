import paper from '@scratch/paper';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import {MIXED} from '../helper/style-path';
import ColorStyleType from '../lib/color-style-type';
import GradientTypes from '../lib/gradient-types';

import {changeFillColor, clearFillGradient, DEFAULT_COLOR} from '../reducers/fill-style';
import {changeStrokeColor, clearStrokeGradient} from '../reducers/stroke-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {setCursor} from '../reducers/cursor';

import {clearSelection, getSelectedLeafItems} from '../helper/selection';
import RectTool from '../helper/tools/rect-tool';
import RectModeComponent from '../components/rect-mode/rect-mode';

interface RectModeProps {
    clearFillGradient: () => void;
    clearStrokeGradient: () => void;
    clearSelectedItems: () => void;
    colorState: {
        fillColor: ColorStyleType;
        strokeColor: ColorStyleType;
        strokeWidth: number;
    };
    handleMouseDown: () => void;
    isRectModeActive: boolean;
    onChangeFillColor: (fillColor: string | null) => void;
    onChangeStrokeColor: (strokeColor: string | null) => void;
    onUpdateImage: () => void;
    selectedItems?: paper.Item[];
    setCursor: (cursorString: string) => void;
    setSelectedItems: () => void;
}

class RectMode extends React.Component<RectModeProps> {
    tool: RectTool;
    
    constructor (props: RectModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool',
            'validateColorState'
        ]);
    }
    componentDidMount () {
        if (this.props.isRectModeActive) {
            this.activateTool();
        }
    }
    componentDidUpdate(prevProps: Readonly<RectModeProps>) {
        if (this.tool && this.props.colorState !== prevProps.colorState) {
            this.tool.setColorState(this.props.colorState);
        }
        if (this.tool && this.props.selectedItems !== prevProps.selectedItems) {
            this.tool.onSelectionChanged(this.props.selectedItems);
        }

        if (this.props.isRectModeActive && !prevProps.isRectModeActive) {
            this.activateTool();
        } else if (!this.props.isRectModeActive && prevProps.isRectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: RectModeProps) {
        return (
            nextProps.isRectModeActive !== this.props.isRectModeActive ||
            nextProps.colorState !== this.props.colorState ||
            nextProps.selectedItems !== this.props.selectedItems
        );
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        this.validateColorState();

        this.tool = new RectTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.activate();
    }
    validateColorState () { // TODO move to shared class
        // Make sure that at least one of fill/stroke is set, and that MIXED is not one of the colors.
        // If fill and stroke color are both missing, set fill to default and stroke to transparent.
        // If exactly one of fill or stroke color is set, set the other one to transparent.
        const {strokeWidth} = this.props.colorState;
        const fillColor1 = this.props.colorState.fillColor.primary;
        let fillColor2 = this.props.colorState.fillColor.secondary;
        let fillGradient = this.props.colorState.fillColor.gradientType;
        const strokeColor1 = this.props.colorState.strokeColor.primary;
        let strokeColor2 = this.props.colorState.strokeColor.secondary;
        let strokeGradient = this.props.colorState.strokeColor.gradientType;

        if (fillColor2 === MIXED) {
            this.props.clearFillGradient();
            fillColor2 = null;
            fillGradient = GradientTypes.SOLID;
        }
        if (strokeColor2 === MIXED) {
            this.props.clearStrokeGradient();
            strokeColor2 = null;
            strokeGradient = GradientTypes.SOLID;
        }

        const fillColorMissing = fillColor1 === MIXED ||
            (fillGradient === GradientTypes.SOLID && fillColor1 === null) ||
            (fillGradient !== GradientTypes.SOLID && fillColor1 === null && fillColor2 === null);
        const strokeColorMissing = strokeColor1 === MIXED ||
            strokeWidth === null ||
            strokeWidth === 0 ||
            (strokeGradient === GradientTypes.SOLID && strokeColor1 === null) ||
            (strokeGradient !== GradientTypes.SOLID && strokeColor1 === null && strokeColor2 === null);

        if (fillColorMissing && strokeColorMissing) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            this.props.clearFillGradient();
            this.props.onChangeStrokeColor(null);
            this.props.clearStrokeGradient();
        } else if (fillColorMissing && !strokeColorMissing) {
            this.props.onChangeFillColor(null);
            this.props.clearFillGradient();
        } else if (!fillColorMissing && strokeColorMissing) {
            this.props.onChangeStrokeColor(null);
            this.props.clearStrokeGradient();
        }
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <RectModeComponent
                isSelected={this.props.isRectModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isRectModeActive: state.scratchPaint.mode === Modes.RECT,
    selectedItems: state.scratchPaint.selectedItems
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearFillGradient: () => {
        dispatch(clearFillGradient());
    },
    clearStrokeGradient: () => {
        dispatch(clearStrokeGradient());
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems(), false /* bitmapMode */));
    },
    setCursor: cursorString => {
        dispatch(setCursor(cursorString));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.RECT));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RectMode);
