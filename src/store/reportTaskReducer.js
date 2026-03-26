export const initialState = {
  initialDate: '',
  finalDate: '',
  moduleOs: ''
};

// ==============================|| AUTH REDUCER ||============================== //

const reportTaskReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_INITIALDATE_REPORT_TASK_FILTER':
      return {
        ...state,
        initialDate: actions.payload,
      };
    case 'SET_MODULEOS_REPORT_TASK_FILTER':
      return {
        ...state,
        moduleOs: actions.payload,
      };
    case 'SET_FINALDATE_REPORT_TASK_FILTER':
      return {
        ...state,
        finalDate: actions.payload,
      };
    case 'SET_CLEAR_REPORT_TASK_FILTER':
      return {
        ...state,
        initialDate: '',
        finalDate: '',
        moduleOs: ''
      };
    default:
      return state;
  }
};

export default reportTaskReducer;
