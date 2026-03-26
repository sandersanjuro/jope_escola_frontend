export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameTypeOs: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const typeOsReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_TYPEOS':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_TYPEOS':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMETYPEOS_TYPEOS_FILTER':
      return {
        ...state,
        nameTypeOs: actions.payload,
      };
    case 'SET_CLEAR_TYPEOS_FILTER':
      return {
        ...state,
        nameTypeOs: '',
      };
    default:
      return state;
  }
};

export default typeOsReducer;
