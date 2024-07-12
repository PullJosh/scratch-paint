import paper from '@scratch/paper';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes.js';

import {clearFillGradient} from '../reducers/fill-style.js';
import {changeMode} from '../reducers/modes.js';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items.js';
import {setCursor} from '../reducers/cursor.js';

import {getSelectedLeafItems} from '../helper/selection.js';
import BitSelectTool from '../helper/bit-tools/select-tool.js';
import SelectModeComponent from '../components/bit-select-mode/bit-select-mode.jsx';

interface BitSelectModeProps {
    clearGradient: () => void;
    clearSelectedItems: () => void;
    handleMouseDown: () => void;
    isSelectModeActive: boolean;
    onUpdateImage: () => void;
    selectedItems?: paper.Item[];
    setCursor: (cursorString: string) => void;
    setSelectedItems: () => void;
}

class BitSelectMode extends React.Component<BitSelectModeProps> {
    tool: BitSelectTool;
    
    constructor (props: BitSelectModeProps) {
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
    componentDidUpdate(prevProps: Readonly<BitSelectModeProps>) {
        if (this.tool && prevProps.selectedItems !== this.props.selectedItems) {
            this.tool.onSelectionChanged(this.props.selectedItems);
        }

        if (this.props.isSelectModeActive && !prevProps.isSelectModeActive) {
            this.activateTool();
        } else if (!this.props.isSelectModeActive && prevProps.isSelectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: BitSelectModeProps) {
        return (
            nextProps.isSelectModeActive !== this.props.isSelectModeActive ||
            nextProps.selectedItems !== this.props.selectedItems
        );
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        this.props.clearGradient();
        this.tool = new BitSelectTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
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
            <SelectModeComponent
                isSelected={this.props.isSelectModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    isSelectModeActive: state.scratchPaint.mode === Modes.BIT_SELECT,
    selectedItems: state.scratchPaint.selectedItems
});
const mapDispatchToProps = dispatch => ({
    clearGradient: () => {
        dispatch(clearFillGradient());
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    setCursor: cursorType => {
        dispatch(setCursor(cursorType));
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems()));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_SELECT));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitSelectMode);
