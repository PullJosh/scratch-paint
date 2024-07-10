import {combineReducers} from 'redux';
import intlReducer from './intl';
import {ScratchPaintReducer} from '../../index.ts';

export default combineReducers({
    intl: intlReducer,
    scratchPaint: ScratchPaintReducer
});
