import paper from '@scratch/paper';

import React from 'react';
import {connect} from 'react-redux';
import ScrollableCanvasComponent from '../components/scrollable-canvas/scrollable-canvas';

import {clampViewBounds, pan, zoomOnFixedPoint, getWorkspaceBounds} from '../helper/view';
import {updateViewBounds} from '../reducers/view-bounds';
import {redrawSelectionBox} from '../reducers/selected-items';

import {getEventXY} from '../lib/touch-utils';
import bindAll from 'lodash.bindall';

interface ScrollableCanvasProps {
    canvas: Element;
    children: React.ReactNode;
    hideScrollbars?: boolean;
    redrawSelectionBox: () => void;
    style?: string;
    updateViewBounds: (matrix: paper.Matrix) => void;
}

class ScrollableCanvas extends React.Component<ScrollableCanvasProps> {
    initialMouseX: number | null;
    initialMouseY: number | null;
    initialScreenX: number | null;
    initialScreenY: number | null;
    
    static get ZOOM_INCREMENT () {
        return 0.5;
    }
    constructor (props: ScrollableCanvasProps) {
        super(props);
        bindAll(this, [
            'handleHorizontalScrollbarMouseDown',
            'handleHorizontalScrollbarMouseMove',
            'handleHorizontalScrollbarMouseUp',
            'handleVerticalScrollbarMouseDown',
            'handleVerticalScrollbarMouseMove',
            'handleVerticalScrollbarMouseUp',
            'handleWheel'
        ]);
    }
    componentDidMount () {
        if (this.props.canvas) {
            this.props.canvas.addEventListener('wheel', this.handleWheel);
        }
    }
    componentDidUpdate(prevProps: Readonly<ScrollableCanvasProps>) {
        if (this.props.canvas) {
            if (prevProps.canvas) {
                prevProps.canvas.removeEventListener('wheel', this.handleWheel);
            }
            this.props.canvas.addEventListener('wheel', this.handleWheel);
        }
    }
    handleHorizontalScrollbarMouseDown (event: React.MouseEvent | React.TouchEvent) {
        this.initialMouseX = getEventXY(event).x;
        this.initialScreenX = paper.view.matrix.tx;
        window.addEventListener('mousemove', this.handleHorizontalScrollbarMouseMove);
        window.addEventListener('touchmove', this.handleHorizontalScrollbarMouseMove, {passive: false});
        window.addEventListener('mouseup', this.handleHorizontalScrollbarMouseUp);
        window.addEventListener('touchend', this.handleHorizontalScrollbarMouseUp);
        event.preventDefault();
    }
    handleHorizontalScrollbarMouseMove (event: MouseEvent | TouchEvent) {
        const dx = this.initialMouseX - getEventXY(event).x;
        paper.view.matrix.tx = this.initialScreenX + (dx * paper.view.zoom * 2);
        clampViewBounds();
        this.props.updateViewBounds(paper.view.matrix);
        event.preventDefault();
    }
    handleHorizontalScrollbarMouseUp () {
        window.removeEventListener('mousemove', this.handleHorizontalScrollbarMouseMove);
        window.removeEventListener('touchmove', this.handleHorizontalScrollbarMouseMove, {passive: false});
        window.removeEventListener('mouseup', this.handleHorizontalScrollbarMouseUp);
        window.removeEventListener('touchend', this.handleHorizontalScrollbarMouseUp);
        this.initialMouseX = null;
        this.initialScreenX = null;
        event.preventDefault();
    }
    handleVerticalScrollbarMouseDown (event: React.MouseEvent | React.TouchEvent) {
        this.initialMouseY = getEventXY(event).y;
        this.initialScreenY = paper.view.matrix.ty;
        window.addEventListener('mousemove', this.handleVerticalScrollbarMouseMove);
        window.addEventListener('touchmove', this.handleVerticalScrollbarMouseMove, {passive: false});
        window.addEventListener('mouseup', this.handleVerticalScrollbarMouseUp);
        window.addEventListener('touchend', this.handleVerticalScrollbarMouseUp);
        event.preventDefault();
    }
    handleVerticalScrollbarMouseMove (event: MouseEvent | TouchEvent) {
        const dy = this.initialMouseY - getEventXY(event).y;
        paper.view.matrix.ty = this.initialScreenY + (dy * paper.view.zoom * 2);
        clampViewBounds();
        this.props.updateViewBounds(paper.view.matrix);
        event.preventDefault();
    }
    handleVerticalScrollbarMouseUp (event: MouseEvent | TouchEvent) {
        window.removeEventListener('mousemove', this.handleVerticalScrollbarMouseMove);
        window.removeEventListener('touchmove', this.handleVerticalScrollbarMouseMove, {passive: false});
        window.removeEventListener('mouseup', this.handleVerticalScrollbarMouseUp);
        window.removeEventListener('touchend', this.handleVerticalScrollbarMouseUp);
        this.initialMouseY = null;
        this.initialScreenY = null;
        event.preventDefault();
    }
    handleWheel (event: WheelEvent) {
        // Multiplier variable, so that non-pixel-deltaModes are supported. Needed for Firefox.
        // See #529 (or LLK/scratch-blocks#1190).
        const multiplier = event.deltaMode === 0x1 ? 15 : 1;
        const deltaX = event.deltaX * multiplier;
        const deltaY = event.deltaY * multiplier;
        const canvasRect = this.props.canvas.getBoundingClientRect();
        const offsetX = event.clientX - canvasRect.left;
        const offsetY = event.clientY - canvasRect.top;
        const fixedPoint = paper.view.viewToProject(
            new paper.Point(offsetX, offsetY)
        );
        if (event.metaKey || event.ctrlKey) {
            // Zoom keeping mouse location fixed
            zoomOnFixedPoint(-deltaY / 1000, fixedPoint);
            this.props.updateViewBounds(paper.view.matrix);
            this.props.redrawSelectionBox(); // Selection handles need to be resized after zoom
        } else if (event.shiftKey && event.deltaX === 0) {
            // Scroll horizontally (based on vertical scroll delta)
            // This is needed as for some browser/system combinations which do not set deltaX.
            // See #156.
            const dx = deltaY / paper.view.zoom;
            pan(dx, 0);
            this.props.updateViewBounds(paper.view.matrix);
        } else {
            const dx = deltaX / paper.view.zoom;
            const dy = deltaY / paper.view.zoom;
            pan(dx, dy);
            this.props.updateViewBounds(paper.view.matrix);
            if (paper.tool) {
                paper.tool.view._handleMouseEvent('mousemove', event, fixedPoint);
            }
        }
        event.preventDefault();
    }
    render () {
        let widthPercent = 0;
        let heightPercent = 0;
        let topPercent = 0;
        let leftPercent = 0;
        if (paper.project) {
            const bounds = getWorkspaceBounds();
            const {x, y, width, height} = paper.view.bounds;
            widthPercent = Math.min(100, 100 * width / bounds.width);
            heightPercent = Math.min(100, 100 * height / bounds.height);
            const centerX = (x + (width / 2) - bounds.x) / bounds.width;
            const centerY = (y + (height / 2) - bounds.y) / bounds.height;
            topPercent = Math.max(0, (100 * centerY) - (heightPercent / 2));
            leftPercent = Math.max(0, (100 * centerX) - (widthPercent / 2));
        }
        return (
            <ScrollableCanvasComponent
                hideScrollbars={this.props.hideScrollbars}
                horizontalScrollLengthPercent={widthPercent}
                horizontalScrollStartPercent={leftPercent}
                style={this.props.style}
                verticalScrollLengthPercent={heightPercent}
                verticalScrollStartPercent={topPercent}
                onHorizontalScrollbarMouseDown={this.handleHorizontalScrollbarMouseDown}
                onVerticalScrollbarMouseDown={this.handleVerticalScrollbarMouseDown}
            >
                {this.props.children}
            </ScrollableCanvasComponent>
        );
    }
}

const mapStateToProps = state => ({
    viewBounds: state.scratchPaint.viewBounds
});
const mapDispatchToProps = dispatch => ({
    redrawSelectionBox: () => {
        dispatch(redrawSelectionBox());
    },
    updateViewBounds: matrix => {
        dispatch(updateViewBounds(matrix));
    }
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScrollableCanvas);
