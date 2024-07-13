import paper from '@scratch/paper';

import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

const SelectionHOC = function (WrappedComponent) {
    interface SelectionComponentProps {
        hoveredItemId?: number;
    };
    
    class SelectionComponent extends React.Component<SelectionComponentProps> {
        constructor (props: SelectionComponentProps) {
            super(props);
            bindAll(this, [
                'removeItemById'
            ]);
        }
        componentDidUpdate (prevProps: SelectionComponentProps) {
            // Hovered item has changed
            if ((this.props.hoveredItemId && this.props.hoveredItemId !== prevProps.hoveredItemId) ||
                    (!this.props.hoveredItemId && prevProps.hoveredItemId)) {
                // Remove the old hover item if any
                this.removeItemById(prevProps.hoveredItemId);
            }
        }
        removeItemById (itemId: number) {
            if (itemId) {
                const match = paper.project.getItem({
                    match: item => (item.id === itemId)
                });
                if (match) {
                    match.remove();
                }
            }
        }
        render () {
            const {
                hoveredItemId, // eslint-disable-line no-unused-vars
                ...props
            } = this.props;
            return (
                <WrappedComponent {...props} />
            );
        }
    }

    const mapStateToProps = state => ({
        hoveredItemId: state.scratchPaint.hoveredItemId
    });
    return connect(
        mapStateToProps
    )(SelectionComponent);
};

export default SelectionHOC;
