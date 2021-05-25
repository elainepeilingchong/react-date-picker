import { createStore, combineReducers } from "redux";
import { reducer as forms } from 'redux-form';

const initialState = {
  allIds: [],
  byIds: {}
};

 function todos(state = initialState, action) {
  switch (action.type) {
    case "ADD_TODO": {
      const { id, content } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            content,
            completed: false
          }
        }
      };
    }
    case "TOGGLE_TODO": {
      const { id } = action.payload;
      return {
        ...state,
        byIds: {
          ...state.byIds,
          [id]: {
            ...state.byIds[id],
            completed: !state.byIds[id].completed
          }
        }
      };
    }
    default:
      return state;
  }
}


const reducers =  combineReducers({ todos, form: forms });


export default createStore(reducers);
