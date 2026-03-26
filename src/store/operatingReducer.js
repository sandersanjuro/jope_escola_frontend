export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameOperating: '',
  idUnit: '',
  idCategory: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const operatingReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_OPERATING':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_OPERATING':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAME_OPERATING_FILTER':
      return {
        ...state,
        nameOperating: actions.payload,
      };
    case 'SET_IDUNIT_OPERATING_FILTER':
      return {
        ...state,
        idUnit: actions.payload,
      };
    case 'SET_IDCATEGORY_OPERATING_FILTER':
      return {
        ...state,
        idCategory: actions.payload,
      };
    case 'SET_CLEAR_OPERATING_FILTER':
      return {
        ...state,
        nameOperating: '',
        idUnit: '',
        idCategory: '',
      };
    default:
      return state;
  }
};

export default operatingReducer;
