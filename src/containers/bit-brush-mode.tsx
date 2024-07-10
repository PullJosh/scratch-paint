import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import {MIXED} from '../helper/style-path';

import {changeFillColor, clearFillGradient, DEFAULT_COLOR} from '../reducers/fill-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearSelection} from '../helper/selection';

import BitBrushModeComponent from '../components/bit-brush-mode/bit-brush-mode.jsx';
import BitBrushTool from '../helper/bit-tools/brush-tool';

interface BitBrushModeProps {
    bitBrushSize: number;
    clearGradient: () => void;
    clearSelectedItems: () => void;
    color?: string;
    handleMouseDown: () => void;
    isBitBrushModeActive: boolean;
    onChangeFillColor: (fillColor: string) => void;
    onUpdateImage: () => void;
}

class BitBrushMode extends React.Component<BitBrushModeProps> {
    tool: BitBrushTool;
    
    constructor (props: BitBrushModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isBitBrushModeActive) {
            this.activateTool();
        }
    }
    componentWillReceiveProps (nextProps: BitBrushModeProps) {
        if (this.tool && nextProps.color !== this.props.color) {
            this.tool.setColor(nextProps.color);
        }
        if (this.tool && nextProps.bitBrushSize !== this.props.bitBrushSize) {
            this.tool.setBrushSize(nextProps.bitBrushSize);
        }

        if (nextProps.isBitBrushModeActive && !this.props.isBitBrushModeActive) {
            this.activateTool();
        } else if (!nextProps.isBitBrushModeActive && this.props.isBitBrushModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: BitBrushModeProps) {
        return nextProps.isBitBrushModeActive !== this.props.isBitBrushModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        this.props.clearGradient();
        // Force the default brush color if fill is MIXED or transparent
        let color = this.props.color;
        if (!color || color === MIXED) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }
        this.tool = new BitBrushTool(
            this.props.onUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setBrushSize(this.props.bitBrushSize);

        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <BitBrushModeComponent
                isSelected={this.props.isBitBrushModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    bitBrushSize: state.scratchPaint.bitBrushSize,
    color: state.scratchPaint.color.fillColor.primary,
    isBitBrushModeActive: state.scratchPaint.mode === Modes.BIT_BRUSH
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearGradient: () => {
        dispatch(clearFillGradient());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_BRUSH));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitBrushMode);
