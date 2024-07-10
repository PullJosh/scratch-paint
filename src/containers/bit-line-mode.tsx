import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes.js';
import {MIXED} from '../helper/style-path.js';

import {changeFillColor, clearFillGradient, DEFAULT_COLOR} from '../reducers/fill-style.js';
import {changeMode} from '../reducers/modes.js';
import {clearSelectedItems} from '../reducers/selected-items.js';
import {clearSelection} from '../helper/selection.js';

import BitLineModeComponent from '../components/bit-line-mode/bit-line-mode.jsx';
import BitLineTool from '../helper/bit-tools/line-tool.js';

interface BitLineModeProps {
    bitBrushSize: number;
    clearGradient: () => void;
    clearSelectedItems: () => void;
    color?: string;
    handleMouseDown: () => void;
    isBitLineModeActive: boolean;
    onChangeFillColor: (fillColor: string) => void;
    onUpdateImage: () => void;
}

class BitLineMode extends React.Component<BitLineModeProps> {
    tool: BitLineTool;
    
    constructor (props: BitLineModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isBitLineModeActive) {
            this.activateTool();
        }
    }
    componentWillReceiveProps (nextProps: BitLineModeProps) {
        if (this.tool && nextProps.color !== this.props.color) {
            this.tool.setColor(nextProps.color);
        }
        if (this.tool && nextProps.bitBrushSize !== this.props.bitBrushSize) {
            this.tool.setLineSize(nextProps.bitBrushSize);
        }

        if (nextProps.isBitLineModeActive && !this.props.isBitLineModeActive) {
            this.activateTool();
        } else if (!nextProps.isBitLineModeActive && this.props.isBitLineModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: BitLineModeProps) {
        return nextProps.isBitLineModeActive !== this.props.isBitLineModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        this.props.clearGradient();
        // Force the default line color if fill is MIXED or transparent
        let color = this.props.color;
        if (!color || color === MIXED) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }
        this.tool = new BitLineTool(
            this.props.onUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setLineSize(this.props.bitBrushSize);

        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <BitLineModeComponent
                isSelected={this.props.isBitLineModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    bitBrushSize: state.scratchPaint.bitBrushSize,
    color: state.scratchPaint.color.fillColor.primary,
    isBitLineModeActive: state.scratchPaint.mode === Modes.BIT_LINE
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearGradient: () => {
        dispatch(clearFillGradient());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_LINE));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitLineMode);
