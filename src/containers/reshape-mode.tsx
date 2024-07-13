import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';

import {changeMode} from '../reducers/modes';
import {clearHoveredItem, setHoveredItem} from '../reducers/hover';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {getSelectedLeafItems} from '../helper/selection';

import ReshapeTool from '../helper/selection-tools/reshape-tool';
import ReshapeModeComponent from '../components/reshape-mode/reshape-mode';

interface ReshapeModeProps {
    clearHoveredItem: () => void;
    clearSelectedItems: () => void;
    handleMouseDown: () => void;
    hoveredItemId?: number;
    isReshapeModeActive: boolean;
    onUpdateImage: () => void;
    setHoveredItem: (hoveredItemId: number) => void;
    setSelectedItems: () => void;
    switchToTextTool: () => void;
}

class ReshapeMode extends React.Component<ReshapeModeProps> {
    tool: ReshapeTool;
    
    constructor (props: ReshapeModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isReshapeModeActive) {
            this.activateTool();
        }
    }
    componentDidUpdate(prevProps: Readonly<ReshapeModeProps>) {
        if (this.tool && this.props.hoveredItemId !== prevProps.hoveredItemId) {
            this.tool.setPrevHoveredItemId(this.props.hoveredItemId);
        }

        if (this.props.isReshapeModeActive && !prevProps.isReshapeModeActive) {
            this.activateTool();
        } else if (!this.props.isReshapeModeActive && prevProps.isReshapeModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: ReshapeModeProps) {
        return (
            nextProps.isReshapeModeActive !== this.props.isReshapeModeActive ||
            nextProps.hoveredItemId !== this.props.hoveredItemId
        );
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        this.tool = new ReshapeTool(
            this.props.setHoveredItem,
            this.props.clearHoveredItem,
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.onUpdateImage,
            this.props.switchToTextTool
        );
        this.tool.setPrevHoveredItemId(this.props.hoveredItemId);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
        this.hitResult = null;
    }
    render () {
        return (
            <ReshapeModeComponent
                isSelected={this.props.isReshapeModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    isReshapeModeActive: state.scratchPaint.mode === Modes.RESHAPE,
    hoveredItemId: state.scratchPaint.hoveredItemId
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
    handleMouseDown: () => {
        dispatch(changeMode(Modes.RESHAPE));
    },
    switchToTextTool: () => {
        dispatch(changeMode(Modes.TEXT));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReshapeMode);
