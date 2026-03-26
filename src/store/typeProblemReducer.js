export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameTypeProblem: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const typeProblemReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_TYPEPROBLEM':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_TYPEPROBLEM':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMETYPEPROBLEM_TYPEPROBLEM_FILTER':
      return {
        ...state,
        nameTypeProblem: actions.payload,
      };
    case 'SET_CLEAR_TYPEPROBLEM_FILTER':
      return {
        ...state,
        nameTypeProblem: '',
      };
    default:
      return state;
  }
};

export default typeProblemReducer;
