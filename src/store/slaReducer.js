export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameSla: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const slaReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_SLA':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_SLA':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMESLA_SLA_FILTER':
      return {
        ...state,
        nameSla: actions.payload,
      };
    case 'SET_CLEAR_SLA_FILTER':
      return {
        ...state,
        nameSla: '',
      };
    default:
      return state;
  }
};

export default slaReducer;
