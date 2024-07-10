import paper from '@scratch/paper';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes.js';

import {changeMode} from '../reducers/modes.js';
import {clearHoveredItem, setHoveredItem} from '../reducers/hover.js';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items.js';
import {setCursor} from '../reducers/cursor.js';

import {getSelectedLeafItems} from '../helper/selection.js';
import SelectTool from '../helper/selection-tools/select-tool.js';
import SelectModeComponent from '../components/select-mode/select-mode.jsx';

interface SelectModeProps {
    clearHoveredItem: () => void;
    clearSelectedItems: () => void;
    handleMouseDown: () => void;
    hoveredItemId?: number;
    isSelectModeActive: boolean;
    onUpdateImage: () => void;
    selectedItems?: paper.Item[];
    setCursor: (cursorString: string) => void;
    setHoveredItem: (hoveredItemId: number) => void;
    setSelectedItems: () => void;
    switchToTextTool: () => void;
}

class SelectMode extends React.Component<SelectModeProps> {
    tool: SelectTool;
    
    constructor (props: SelectModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isSelectModeActive) {
            this.activateTool();
        }
    }
    componentWillReceiveProps (nextProps: SelectModeProps) {
        if (this.tool && nextProps.hoveredItemId !== this.props.hoveredItemId) {
            this.tool.setPrevHoveredItemId(nextProps.hoveredItemId);
        }
        if (this.tool && nextProps.selectedItems !== this.props.selectedItems) {
            this.tool.onSelectionChanged(nextProps.selectedItems);
        }

        if (nextProps.isSelectModeActive && !this.props.isSelectModeActive) {
            this.activateTool();
        } else if (!nextProps.isSelectModeActive && this.props.isSelectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: SelectModeProps) {
        return nextProps.isSelectModeActive !== this.props.isSelectModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        this.tool = new SelectTool(
            this.props.setHoveredItem,
            this.props.clearHoveredItem,
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage,
            this.props.switchToTextTool
        );
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <SelectModeComponent
                isSelected={this.props.isSelectModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    isSelectModeActive: state.scratchPaint.mode === Modes.SELECT,
    hoveredItemId: state.scratchPaint.hoveredItemId,
    selectedItems: state.scratchPaint.selectedItems
});
const mapDispatchToProps = dispatch => ({
    setHoveredItem: hoveredItemId => {
        dispatch(setHoveredItem(hoveredItemId));
    },
    clearHoveredItem: () => {
        dispatch(clearHoveredItem());
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems(), false /* bitmapMode */));
    },
    setCursor: cursorString => {
        dispatch(setCursor(cursorString));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.SELECT));
    },
    switchToTextTool: () => {
        dispatch(changeMode(Modes.TEXT));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectMode);
