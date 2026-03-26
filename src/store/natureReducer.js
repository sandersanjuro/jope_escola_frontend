export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameNature: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const natureReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_NATURE':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_NATURE':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMENATURE_NATURE_FILTER':
      return {
        ...state,
        nameNature: actions.payload,
      };
    case 'SET_CLEAR_NATURE_FILTER':
      return {
        ...state,
        nameNature: '',
      };
    default:
      return state;
  }
};

export default natureReducer;
