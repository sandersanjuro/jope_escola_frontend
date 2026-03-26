export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameUser: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const usersReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_USER':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_USER':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMEUSER_USER_FILTER':
      return {
        ...state,
        nameUser: actions.payload,
      };
    case 'SET_CLEAR_USER_FILTER':
      return {
        ...state,
        nameUser: '',
      };
    default:
      return state;
  }
};

export default usersReducer;
