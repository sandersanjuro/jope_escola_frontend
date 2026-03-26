import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import promise from 'redux-promise';
import multi from 'redux-multi';
import thunk from 'redux-thunk';

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = applyMiddleware(thunk, multi, promise)(createStore)(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export { store };
