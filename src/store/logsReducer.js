export const initialState = {
  initialDate: '',
  finalDate: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const logsReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_INITIALDATE_LOGS_FILTER':
      return {
        ...state,
        initialDate: actions.payload,
      };
    case 'SET_FINALDATE_LOGS_FILTER':
      return {
        ...state,
        finalDate: actions.payload,
      };
    case 'SET_CLEAR_LOGS_FILTER':
      return {
        ...state,
        initialDate: '',
        finalDate: '',
      };
    default:
      return state;
  }
};

export default logsReducer;
