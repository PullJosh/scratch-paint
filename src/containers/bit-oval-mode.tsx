import paper from '@scratch/paper';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import ColorStyleType from '../lib/color-style-type';
import {MIXED} from '../helper/style-path';

import {changeFillColor, DEFAULT_COLOR} from '../reducers/fill-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {setCursor} from '../reducers/cursor';

import {clearSelection, getSelectedLeafItems} from '../helper/selection';
import OvalTool from '../helper/bit-tools/oval-tool';
import OvalModeComponent from '../components/bit-oval-mode/bit-oval-mode';

interface BitOvalModeProps {
    clearSelectedItems: () => void;
    color: ColorStyleType;
    filled?: boolean;
    handleMouseDown: () => void;
    isOvalModeActive: boolean;
    onChangeFillColor: (fillColor: any) => void;
    onUpdateImage: () => void;
    selectedItems?: paper.Item[];
    setCursor: (cursorString: string) => void;
    setSelectedItems: () => void;
    thickness: number;
    zoom: number;
}

class BitOvalMode extends React.Component<BitOvalModeProps> {
    tool: OvalTool;
    
    constructor (props: BitOvalModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isOvalModeActive) {
            this.activateTool();
        }
    }
    componentDidUpdate(prevProps: Readonly<BitOvalModeProps>) {
        if (this.tool) {
            if (prevProps.color !== this.props.color) {
                this.tool.setColor(this.props.color);
            }
            if (prevProps.selectedItems !== this.props.selectedItems) {
                this.tool.onSelectionChanged(this.props.selectedItems);
            }
            if (prevProps.filled !== this.props.filled) {
                this.tool.setFilled(this.props.filled);
            }
            if (prevProps.thickness !== this.props.thickness || prevProps.zoom !== this.props.zoom) {
                this.tool.setThickness(this.props.thickness);
            }
        }

        if (this.props.isOvalModeActive && !prevProps.isOvalModeActive) {
            this.activateTool();
        } else if (!this.props.isOvalModeActive && prevProps.isOvalModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: BitOvalModeProps) {
        return (
            nextProps.isOvalModeActive !== this.props.isOvalModeActive ||
            nextProps.color !== this.props.color ||
            nextProps.selectedItems !== this.props.selectedItems ||
            nextProps.filled !== this.props.filled ||
            nextProps.thickness !== this.props.thickness ||
            nextProps.zoom !== this.props.zoom
        );
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        // Force the default brush color if fill is MIXED or transparent
        const fillColorPresent = this.props.color.primary !== MIXED && this.props.color.primary !== null;
        if (!fillColorPresent) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
        }
        this.tool = new OvalTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage
        );
        this.tool.setColor(this.props.color);
        this.tool.setFilled(this.props.filled);
        this.tool.setThickness(this.props.thickness);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <OvalModeComponent
                isSelected={this.props.isOvalModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    color: state.scratchPaint.color.fillColor,
    filled: state.scratchPaint.fillBitmapShapes,
    isOvalModeActive: state.scratchPaint.mode === Modes.BIT_OVAL,
    selectedItems: state.scratchPaint.selectedItems,
    thickness: state.scratchPaint.bitBrushSize,
    zoom: state.scratchPaint.viewBounds.scaling.x
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    setCursor: cursorString => {
        dispatch(setCursor(cursorString));
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems(), true /* bitmapMode */));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_OVAL));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitOvalMode);
