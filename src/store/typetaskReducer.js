export const initialState = {
  page: 0,
  rowsPerPage: 10,
  tarefa: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const typetaskReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_TYPETASK':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_TYPETASK':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_TAREFA_TYPETASK_FILTER':
      return {
        ...state,
        tarefa: actions.payload,
      };
    case 'SET_CLEAR_TYPETASK_FILTER':
      return {
        ...state,
        tarefa: '',
      };
    default:
      return state;
  }
};

export default typetaskReducer;
