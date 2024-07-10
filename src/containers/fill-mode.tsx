import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes.js';
import GradientTypes from '../lib/gradient-types.js';
import FillTool from '../helper/tools/fill-tool.js';
import {generateSecondaryColor, MIXED} from '../helper/style-path.js';

import {changeFillColor, changeFillColor2, DEFAULT_COLOR} from '../reducers/fill-style.js';
import {changeMode} from '../reducers/modes.js';
import {clearSelectedItems} from '../reducers/selected-items.js';
import {clearSelection} from '../helper/selection.js';
import {clearHoveredItem, setHoveredItem} from '../reducers/hover.js';
import {changeGradientType} from '../reducers/fill-mode-gradient-type.js';

import FillModeComponent from '../components/fill-mode/fill-mode.jsx';

interface FillModeProps {
    changeGradientType: (gradientType: keyof typeof GradientTypes) => void;
    clearHoveredItem: () => void;
    clearSelectedItems: () => void;
    fillColor?: string;
    fillColor2?: string;
    fillStyleGradientType: keyof typeof GradientTypes;
    fillModeGradientType?: keyof typeof GradientTypes;
    handleMouseDown: () => void;
    hoveredItemId?: number;
    isFillModeActive: boolean;
    onChangeFillColor: (fillColor: string, index: number) => void;
    onUpdateImage: () => void;
    setHoveredItem: (hoveredItemId: number) => void;
}

class FillMode extends React.Component<FillModeProps> {
    tool: FillTool;
    
    constructor (props: FillModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isFillModeActive) {
            this.activateTool();
        }
    }
    componentWillReceiveProps (nextProps: FillModeProps) {
        if (this.tool) {
            if (nextProps.fillColor !== this.props.fillColor) {
                this.tool.setFillColor(nextProps.fillColor);
            }
            if (nextProps.fillColor2 !== this.props.fillColor2) {
                this.tool.setFillColor2(nextProps.fillColor2);
            }
            if (nextProps.hoveredItemId !== this.props.hoveredItemId) {
                this.tool.setPrevHoveredItemId(nextProps.hoveredItemId);
            }
            if (nextProps.fillModeGradientType !== this.props.fillModeGradientType) {
                this.tool.setGradientType(nextProps.fillModeGradientType);
            }
        }

        if (nextProps.isFillModeActive && !this.props.isFillModeActive) {
            this.activateTool();
        } else if (!nextProps.isFillModeActive && this.props.isFillModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: FillModeProps) {
        return nextProps.isFillModeActive !== this.props.isFillModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);

        // Force the default fill color if fill is MIXED
        let fillColor = this.props.fillColor;
        if (this.props.fillColor === MIXED) {
            fillColor = DEFAULT_COLOR;
            this.props.onChangeFillColor(DEFAULT_COLOR, 0);
        }
        const gradientType = this.props.fillModeGradientType ?
            this.props.fillModeGradientType : this.props.fillStyleGradientType;
        let fillColor2 = this.props.fillColor2;
        if (gradientType !== this.props.fillStyleGradientType) {
            if (this.props.fillStyleGradientType === GradientTypes.SOLID) {
                fillColor2 = generateSecondaryColor(fillColor);
                this.props.onChangeFillColor(fillColor2, 1);
            }
            this.props.changeGradientType(gradientType);
        }
        if (this.props.fillColor2 === MIXED) {
            fillColor2 = generateSecondaryColor(fillColor);
            this.props.onChangeFillColor(fillColor2, 1);
        }
        this.tool = new FillTool(
            this.props.setHoveredItem,
            this.props.clearHoveredItem,
            this.props.onUpdateImage
        );
        this.tool.setFillColor(fillColor);
        this.tool.setFillColor2(fillColor2);
        this.tool.setGradientType(gradientType);
        this.tool.setPrevHoveredItemId(this.props.hoveredItemId);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <FillModeComponent
                isSelected={this.props.isFillModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

const mapStateToProps = state => ({
    fillModeGradientType: state.scratchPaint.fillMode.gradientType, // Last user-selected gradient type
    fillColor: state.scratchPaint.color.fillColor.primary,
    fillColor2: state.scratchPaint.color.fillColor.secondary,
    fillStyleGradientType: state.scratchPaint.color.fillColor.gradientType, // Selected item(s)' gradient type
    hoveredItemId: state.scratchPaint.hoveredItemId,
    isFillModeActive: state.scratchPaint.mode === Modes.FILL
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
    changeGradientType: gradientType => {
        dispatch(changeGradientType(gradientType));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.FILL));
    },
    onChangeFillColor: (fillColor, index) => {
        if (index === 0) {
            dispatch(changeFillColor(fillColor));
        } else if (index === 1) {
            dispatch(changeFillColor2(fillColor));
        }
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillMode);
