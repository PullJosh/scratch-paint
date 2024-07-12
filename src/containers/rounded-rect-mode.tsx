import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes.js';

import {changeMode} from '../reducers/modes.js';
import {clearHoveredItem, setHoveredItem} from '../reducers/hover.js';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items.js';

import {getSelectedLeafItems} from '../helper/selection.js';
import RoundedRectTool from '../helper/tools/rounded-rect-tool.js';
import RoundedRectModeComponent from '../components/rounded-rect-mode/rounded-rect-mode.jsx';

interface RoundedRectModeProps {
    clearHoveredItem: () => void;
    clearSelectedItems: () => void;
    handleMouseDown: () => void;
    hoveredItemId?: number;
    isRoundedRectModeActive: boolean;
    onUpdateImage: () => void;
    setHoveredItem: (hoveredItemId: number) => void;
    setSelectedItems: () => void;
}

class RoundedRectMode extends React.Component<RoundedRectModeProps> {
    tool: RoundedRectTool;
    
    constructor (props: RoundedRectModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isRoundedRectModeActive) {
            this.activateTool();
        }
    }
    componentDidUpdate(prevProps: Readonly<RoundedRectModeProps>) {
        if (this.tool && this.props.hoveredItemId !== prevProps.hoveredItemId) {
            this.tool.setPrevHoveredItemId(this.props.hoveredItemId);
        }

        if (this.props.isRoundedRectModeActive && !prevProps.isRoundedRectModeActive) {
            this.activateTool();
        } else if (!this.props.isRoundedRectModeActive && prevProps.isRoundedRectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: RoundedRectModeProps) {
        return (
            nextProps.isRoundedRectModeActive !== this.props.isRoundedRectModeActive ||
            nextProps.hoveredItemId !== this.props.hoveredItemId
        );
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        this.tool = new RoundedRectTool(
            this.props.setHoveredItem,
            this.props.clearHoveredItem,
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.onUpdateImage
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
            <RoundedRectModeComponent
                isSelected={this.props.isRoundedRectModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    isRoundedRectModeActive: state.scratchPaint.mode === Modes.ROUNDED_RECT,
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
        dispatch(changeMode(Modes.ROUNDED_RECT));
    },
    deactivateTool () {
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoundedRectMode);
