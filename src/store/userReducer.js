export const initialState = {
  page: 0,
  rowsPerPage: 10,
  unit: '',
  unidade_modelo: 0
};

// ==============================|| AUTH REDUCER ||============================== //

const userReducer = (state = initialState, actions) => {
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
    case 'SET_UNIT_USER':
      return {
        ...state,
        unit: actions.payload,
      };
    case 'SET_UNIT_MODELO_USER':
      return {
        ...state,
        unidade_modelo: actions.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
