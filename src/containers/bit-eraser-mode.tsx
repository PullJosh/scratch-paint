import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';

import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearSelection} from '../helper/selection';

import BitEraserModeComponent from '../components/bit-eraser-mode/bit-eraser-mode';
import BitBrushTool from '../helper/bit-tools/brush-tool';

interface BitEraserModeProps {
    bitEraserSize: number;
    clearSelectedItems: () => void;
    handleMouseDown: () => void;
    isBitEraserModeActive: boolean;
    onUpdateImage: (image: ImageData) => void;
}

class BitEraserMode extends React.Component<BitEraserModeProps> {
    tool: BitBrushTool;
    
    constructor (props: BitEraserModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isBitEraserModeActive) {
            this.activateTool();
        }
    }
    componentDidUpdate(prevProps: Readonly<BitEraserModeProps>) {
        if (this.tool && prevProps.bitEraserSize !== this.props.bitEraserSize) {
            this.tool.setBrushSize(this.props.bitEraserSize);
        }

        if (this.props.isBitEraserModeActive && !prevProps.isBitEraserModeActive) {
            this.activateTool();
        } else if (!this.props.isBitEraserModeActive && prevProps.isBitEraserModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: BitEraserModeProps) {
        return (
            nextProps.isBitEraserModeActive !== this.props.isBitEraserModeActive ||
            nextProps.bitEraserSize !== this.props.bitEraserSize
        );
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        this.tool = new BitBrushTool(
            this.props.onUpdateImage,
            true /* isEraser */
        );
        this.tool.setBrushSize(this.props.bitEraserSize);

        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <BitEraserModeComponent
                isSelected={this.props.isBitEraserModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    bitEraserSize: state.scratchPaint.bitEraserSize,
    isBitEraserModeActive: state.scratchPaint.mode === Modes.BIT_ERASER
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_ERASER));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitEraserMode);
