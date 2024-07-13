import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import Blobbiness from '../helper/blob-tools/blob';
import {changeBrushSize} from '../reducers/eraser-mode';
import {clearSelectedItems} from '../reducers/selected-items';
import EraserModeComponent from '../components/eraser-mode/eraser-mode';
import {changeMode} from '../reducers/modes';

interface EraserModeProps {
    clearSelectedItems: () => void;
    eraserModeState?: {
        brushSize: number;
    };
    handleMouseDown: () => void;
    isEraserModeActive: boolean;
    onUpdateImage: () => void;
}

class EraserMode extends React.Component<EraserModeProps> {
    blob: Blobbiness;
    
    constructor (props: EraserModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
        this.blob = new Blobbiness(
            this.props.onUpdateImage, this.props.clearSelectedItems);
    }
    componentDidMount () {
        if (this.props.isEraserModeActive) {
            this.activateTool();
        }
    }
    componentDidUpdate(prevProps: Readonly<EraserModeProps>) {
        if (this.props.isEraserModeActive && !prevProps.isEraserModeActive) {
            this.activateTool();
        } else if (!this.props.isEraserModeActive && prevProps.isEraserModeActive) {
            this.deactivateTool();
        } else if (this.props.isEraserModeActive && prevProps.isEraserModeActive) {
            this.blob.setOptions({
                isEraser: true,
                ...this.props.eraserModeState
            });
        }
    }
    shouldComponentUpdate (nextProps: EraserModeProps) {
        return (
            nextProps.isEraserModeActive !== this.props.isEraserModeActive ||
            nextProps.eraserModeState.brushSize !== this.props.eraserModeState.brushSize
        );
    }
    componentWillUnmount () {
        if (this.blob.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        this.blob.activateTool({isEraser: true, ...this.props.eraserModeState});
    }
    deactivateTool () {
        this.blob.deactivateTool();
    }
    render () {
        return (
            <EraserModeComponent
                isSelected={this.props.isEraserModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    eraserModeState: state.scratchPaint.eraserMode,
    isEraserModeActive: state.scratchPaint.mode === Modes.ERASER
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    changeBrushSize: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.ERASER));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EraserMode);
