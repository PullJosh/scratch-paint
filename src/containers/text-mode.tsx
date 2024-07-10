import paper from '@scratch/paper';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Fonts from '../lib/fonts.js';
import Modes from '../lib/modes.js';
import ColorStyleProptype from '../lib/color-style-proptype.js';
import {MIXED} from '../helper/style-path.js';

import {changeFont} from '../reducers/font.js';
import {changeFillColor, clearFillGradient, DEFAULT_COLOR} from '../reducers/fill-style.js';
import {changeStrokeColor} from '../reducers/stroke-style.js';
import {changeMode} from '../reducers/modes.js';
import {setTextEditTarget} from '../reducers/text-edit-target.js';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items.js';
import {setCursor} from '../reducers/cursor.js';

import {clearSelection, getSelectedLeafItems} from '../helper/selection.js';
import TextTool from '../helper/tools/text-tool.js';
import TextModeComponent from '../components/text-mode/text-mode.jsx';
import BitTextModeComponent from '../components/bit-text-mode/bit-text-mode.jsx';

interface TextModeProps {
    changeFont: (font: string) => void;
    clearGradient: () => void;
    clearSelectedItems: () => void;
    colorState: {
        fillColor: any; // TODO: ColorStyleProptype
        strokeColor: any; // TODO: ColorStyleProptype
        strokeWidth: number;
    };
    font?: string;
    handleChangeModeBitText: () => void;
    handleChangeModeText: () => void;
    isBitmap?: boolean;
    isTextModeActive: boolean;
    onChangeFillColor: (fillColor: any) => void; // TODO: any
    onChangeStrokeColor: (strokeColor: any) => void; // TODO: any
    onUpdateImage: () => void;
    rtl?: boolean;
    selectedItems?: paper.Item[];
    setCursor: (cursorString: string) => void;
    setSelectedItems: () => void;
    setTextEditTarget: (targetId: number) => void;
    textArea?: HTMLTextAreaElement;
    textEditTarget?: number;
    viewBounds: paper.Matrix;
}

class TextMode extends React.Component<TextModeProps> {
    tool: TextTool;
    
    constructor (props: TextModeProps) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isTextModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps: TextModeProps) {
        if (this.tool) {
            if (nextProps.colorState !== this.props.colorState) {
                this.tool.setColorState(nextProps.colorState);
            }
            if (nextProps.selectedItems !== this.props.selectedItems) {
                this.tool.onSelectionChanged(nextProps.selectedItems);
            }
            if (!nextProps.textEditTarget && this.props.textEditTarget) {
                this.tool.onTextEditCancelled();
            }
            if (!nextProps.viewBounds.equals(this.props.viewBounds)) {
                this.tool.onViewBoundsChanged(nextProps.viewBounds);
            }
            if (nextProps.font !== this.props.font) {
                this.tool.setFont(nextProps.font);
            }
            if (nextProps.rtl !== this.props.rtl) {
                this.tool.setRtl(nextProps.rtl);
            }
        }

        if (nextProps.isTextModeActive && !this.props.isTextModeActive) {
            this.activateTool(nextProps);
        } else if (!nextProps.isTextModeActive && this.props.isTextModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps: TextModeProps) {
        return nextProps.isTextModeActive !== this.props.isTextModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool (nextProps: TextModeProps) {
        const selected = getSelectedLeafItems();
        let textBoxToStartEditing = null;
        if (selected.length === 1 && selected[0] instanceof paper.PointText) {
            textBoxToStartEditing = selected[0];
        }
        clearSelection(this.props.clearSelectedItems);
        this.props.clearGradient();

        // If fill and stroke color are both mixed/transparent/absent, set fill to default and stroke to transparent.
        // If exactly one of fill or stroke color is set, set the other one to transparent.
        // This way the tool won't draw an invisible state, or be unclear about what will be drawn.
        const {strokeWidth} = nextProps.colorState;
        const fillColor = nextProps.colorState.fillColor.primary;
        const strokeColor = nextProps.colorState.strokeColor.primary;
        const fillColorPresent = fillColor !== MIXED && fillColor !== null;
        const strokeColorPresent = nextProps.isBitmap ? false :
            strokeColor !== MIXED && strokeColor !== null && strokeWidth !== null && strokeWidth !== 0;
        if (!fillColorPresent && !strokeColorPresent) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            this.props.onChangeStrokeColor(null);
        } else if (!fillColorPresent && strokeColorPresent) {
            this.props.onChangeFillColor(null);
        } else if (fillColorPresent && !strokeColorPresent) {
            this.props.onChangeStrokeColor(null);
        }
        if (!nextProps.font || Object.keys(Fonts).map(key => Fonts[key])
            .indexOf(nextProps.font) < 0) {
            this.props.changeFont(Fonts.SANS_SERIF);
        }

        this.tool = new TextTool(
            this.props.textArea,
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage,
            this.props.setTextEditTarget,
            this.props.changeFont,
            nextProps.isBitmap
        );
        this.tool.setRtl(this.props.rtl);
        this.tool.setColorState(nextProps.colorState);
        this.tool.setFont(nextProps.font);
        this.tool.activate();
        if (textBoxToStartEditing) {
            this.tool.beginTextEdit(textBoxToStartEditing);
            this.props.textArea.select();
        }
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            this.props.isBitmap ?
                <BitTextModeComponent
                    isSelected={this.props.isTextModeActive}
                    onMouseDown={this.props.handleChangeModeBitText}
                /> :
                <TextModeComponent
                    isSelected={this.props.isTextModeActive}
                    onMouseDown={this.props.handleChangeModeText}
                />
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    colorState: state.scratchPaint.color,
    font: state.scratchPaint.font,
    isTextModeActive: ownProps.isBitmap ?
        state.scratchPaint.mode === Modes.BIT_TEXT :
        state.scratchPaint.mode === Modes.TEXT,
    rtl: state.scratchPaint.layout.rtl,
    selectedItems: state.scratchPaint.selectedItems,
    textEditTarget: state.scratchPaint.textEditTarget,
    viewBounds: state.scratchPaint.viewBounds
});
const mapDispatchToProps = (dispatch, ownProps) => ({
    changeFont: font => {
        dispatch(changeFont(font));
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearGradient: () => {
        dispatch(clearFillGradient());
    },
    handleChangeModeBitText: () => {
        dispatch(changeMode(Modes.BIT_TEXT));
    },
    handleChangeModeText: () => {
        dispatch(changeMode(Modes.TEXT));
    },
    setCursor: cursorString => {
        dispatch(setCursor(cursorString));
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems(), ownProps.isBitmap));
    },
    setTextEditTarget: targetId => {
        dispatch(setTextEditTarget(targetId));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TextMode);
