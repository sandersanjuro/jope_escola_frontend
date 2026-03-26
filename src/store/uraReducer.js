export const initialState = {
    page: 0,
    rowsPerPage: 10,
    family: '',
    type_os: '',
    id: ''
  };
  
  // ==============================|| AUTH REDUCER ||============================== //
  
  const uraReducer = (state = initialState, actions) => {
    switch (actions.type) {
      case 'SET_PAGE_URA':
        return {
          ...state,
          page: actions.payload,
        };
      case 'SET_ROWS_PER_PAGE_URA':
        return {
          ...state,
          rowsPerPage: actions.payload,
        };
    case 'SET_FAMILY_URA':
        return {
            ...state,
            family: actions.payload,
        };
    case 'SET_TYPEOS_URA':
        return {
            ...state,
            type_os: actions.payload,
        };
    case 'SET_ID_URA':
        return {
            ...state,
            id: actions.payload,
        };
      default:
        return state;
    }
  };
  
  export default uraReducer;
  