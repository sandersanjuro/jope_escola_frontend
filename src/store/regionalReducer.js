export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameRegional: '',
  idBusiness: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const regionalReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_REGIONAL':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_REGIONAL':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMEREGIONAL_REGIONAL_FILTER':
      return {
        ...state,
        nameRegional: actions.payload,
      };
    case 'SET_IDBUSINESS_REGIONAL_FILTER':
      return {
        ...state,
        idBusiness: actions.payload,
      };
    case 'SET_CLEAR_REGIONAL_FILTER':
      return {
        ...state,
        nameRegional: '',
        idBusiness: '',
      };
    default:
      return state;
  }
};

export default regionalReducer;
