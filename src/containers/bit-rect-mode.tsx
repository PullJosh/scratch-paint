import paper from '@scratch/paper';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes.js';
import ColorStyleProptype from '../lib/color-style-proptype.js';
import {MIXED} from '../helper/style-path.js';

import {changeFillColor, DEFAULT_COLOR} from '../reducers/fill-style.js';
import {changeMode} from '../reducers/modes.js';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items.js';
import {setCursor} from '../reducers/cursor.js';

import {clearSelection, getSelectedLeafItems} from '../helper/selection.js';
import RectTool from '../helper/bit-tools/rect-tool.js';
import RectModeComponent from '../components/bit-rect-mode/bit-rect-mode.jsx';

interface BitRectModeProps {
    clearSelectedItems: () => void;
    color: any; // TODO: This used to be `ColorStyleProptype`
    filled?: boolean;
    handleMouseDown: () => void;
    isRectModeActive: boolean;
    onChangeFillColor: (fillColor: any) => void;
    onUpdateImage: () => void;
    selectedItems?: paper.Item[];
    setCursor: (cursorString: string) => void;
    setSelectedItems: () => void;
    thickness: number;
    zoom: number;
}

class BitRectMode extends React.Component<BitRectModeProps> {
    tool: RectTool;
    
    constructor (props: BitRectModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isRectModeActive) {
            this.activateTool();
        }
    }
    componentDidUpdate(prevProps: Readonly<BitRectModeProps>) {
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
            if (prevProps.thickness !== this.props.thickness ||
                    prevProps.zoom !== this.props.zoom) {
                this.tool.setThickness(this.props.thickness);
            }
        }

        if (this.props.isRectModeActive && !prevProps.isRectModeActive) {
            this.activateTool();
        } else if (!this.props.isRectModeActive && prevProps.isRectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: BitRectModeProps) {
        return (
            nextProps.isRectModeActive !== this.props.isRectModeActive ||
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
        this.tool = new RectTool(
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
            <RectModeComponent
                isSelected={this.props.isRectModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    color: state.scratchPaint.color.fillColor,
    filled: state.scratchPaint.fillBitmapShapes,
    isRectModeActive: state.scratchPaint.mode === Modes.BIT_RECT,
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
        dispatch(changeMode(Modes.BIT_RECT));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitRectMode);
