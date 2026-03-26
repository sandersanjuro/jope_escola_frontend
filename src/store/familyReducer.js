export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameFamily: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const familyReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_FAMILY':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_FAMILY':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMEFAMILY_FAMILY_FILTER':
      return {
        ...state,
        nameFamily: actions.payload,
      };
    case 'SET_CLEAR_FAMILY_FILTER':
      return {
        ...state,
        nameFamily: '',
      };
    default:
      return state;
  }
};

export default familyReducer;
