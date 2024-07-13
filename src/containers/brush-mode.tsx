import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import ColorStyleType from '../lib/color-style-type';
import Blobbiness from '../helper/blob-tools/blob';
import {MIXED} from '../helper/style-path';

import {changeFillColor, clearFillGradient, DEFAULT_COLOR} from '../reducers/fill-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearSelection} from '../helper/selection';

import BrushModeComponent from '../components/brush-mode/brush-mode';

interface BrushModeProps {
    brushModeState?: {
        brushSize: number;
    };
    clearGradient: () => void;
    clearSelectedItems: () => void;
    colorState: {
        fillColor: ColorStyleType;
        strokeColor: ColorStyleType;
        strokeWidth: number;
    };
    handleMouseDown: () => void;
    isBrushModeActive: boolean;
    onChangeFillColor: (fillColor: string) => void;
    onUpdateImage: () => void;
}

class BrushMode extends React.Component<BrushModeProps> {
    blob: Blobbiness;
    
    constructor (props: BrushModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
        this.blob = new Blobbiness(
            this.props.onUpdateImage, this.props.clearSelectedItems);
    }
    componentDidMount () {
        if (this.props.isBrushModeActive) {
            this.activateTool();
        }
    }
    componentDidUpdate(prevProps: Readonly<BrushModeProps>) {
        if (this.props.isBrushModeActive && !prevProps.isBrushModeActive) {
            this.activateTool();
        } else if (!this.props.isBrushModeActive && prevProps.isBrushModeActive) {
            this.deactivateTool();
        } else if (this.props.isBrushModeActive && prevProps.isBrushModeActive) {
            const {fillColor, strokeColor, strokeWidth} = this.props.colorState;
            this.blob.setOptions({
                isEraser: false,
                fillColor: fillColor.primary,
                strokeColor: strokeColor.primary,
                strokeWidth,
                ...this.props.brushModeState
            });
        }
    }
    shouldComponentUpdate (nextProps: BrushModeProps) {
        return (
            nextProps.isBrushModeActive !== this.props.isBrushModeActive ||
            nextProps.colorState.fillColor !== this.props.colorState.fillColor ||
            nextProps.colorState.strokeColor !== this.props.colorState.strokeColor ||
            nextProps.colorState.strokeWidth !== this.props.colorState.strokeWidth ||
            nextProps.brushModeState.brushSize !== this.props.brushModeState.brushSize
        );
    }
    componentWillUnmount () {
        if (this.blob.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        // TODO: Instead of clearing selection, consider a kind of "draw inside"
        // analogous to how selection works with eraser
        clearSelection(this.props.clearSelectedItems);
        this.props.clearGradient();
        // Force the default brush color if fill is MIXED or transparent
        const fillColor = this.props.colorState.fillColor.primary;
        if (fillColor === MIXED || fillColor === null) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
        }
        this.blob.activateTool({
            isEraser: false,
            ...this.props.colorState,
            ...this.props.brushModeState
        });
    }
    deactivateTool () {
        this.blob.deactivateTool();
    }
    render () {
        return (
            <BrushModeComponent
                isSelected={this.props.isBrushModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    brushModeState: state.scratchPaint.brushMode,
    colorState: state.scratchPaint.color,
    isBrushModeActive: state.scratchPaint.mode === Modes.BRUSH
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearGradient: () => {
        dispatch(clearFillGradient());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BRUSH));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BrushMode);
