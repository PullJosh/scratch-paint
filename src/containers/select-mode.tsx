import paper from '@scratch/paper';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';

import {changeMode} from '../reducers/modes';
import {clearHoveredItem, setHoveredItem} from '../reducers/hover';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {setCursor} from '../reducers/cursor';

import {getSelectedLeafItems} from '../helper/selection';
import SelectTool from '../helper/selection-tools/select-tool';
import SelectModeComponent from '../components/select-mode/select-mode';

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
    componentDidUpdate(prevProps: Readonly<SelectModeProps>) {
        if (this.tool && this.props.hoveredItemId !== prevProps.hoveredItemId) {
            this.tool.setPrevHoveredItemId(this.props.hoveredItemId);
        }
        if (this.tool && this.props.selectedItems !== prevProps.selectedItems) {
            this.tool.onSelectionChanged(this.props.selectedItems);
        }

        if (this.props.isSelectModeActive && !prevProps.isSelectModeActive) {
            this.activateTool();
        } else if (!this.props.isSelectModeActive && prevProps.isSelectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: SelectModeProps) {
        return (
            nextProps.isSelectModeActive !== this.props.isSelectModeActive ||
            nextProps.hoveredItemId !== this.props.hoveredItemId ||
            nextProps.selectedItems !== this.props.selectedItems
        );
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
