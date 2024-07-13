import {combineReducers} from 'redux';
import intlReducer from './intl';
import {ScratchPaintReducer} from '../../index';

export default combineReducers({
    intl: intlReducer,
    scratchPaint: ScratchPaintReducer
});
