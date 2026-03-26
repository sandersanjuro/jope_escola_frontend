export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameUnit: '',
  idReg: '',
  loading: false,
};

// ==============================|| AUTH REDUCER ||============================== //

const unitReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_UNIT':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_UNIT':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMEUNIT_UNIT_FILTER':
      return {
        ...state,
        nameUnit: actions.payload,
      };
    case 'SET_IDREG_UNIT_FILTER':
      return {
        ...state,
        idReg: actions.payload,
      };
    case 'SET_CLEAR_UNIT_FILTER':
      return {
        ...state,
        nameUnit: '',
        idReg: '',
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: actions.payload,
      };
    default:
      return state;
  }
};

export default unitReducer;
