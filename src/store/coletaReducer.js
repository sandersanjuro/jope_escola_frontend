export const initialState = {
    page: 0,
    rowsPerPage: 10,
    nameColeta: '',
    initialDate: '',
    finalDate: '',
    driver_id: ''
  };
  
  // ==============================|| AUTH REDUCER ||============================== //
  
  const coletaReducer = (state = initialState, actions) => {
    switch (actions.type) {
      case 'SET_PAGE_COLETA':
        return {
          ...state,
          page: actions.payload,
        };
      case 'SET_ROWS_PER_PAGE_COLETA':
        return {
          ...state,
          rowsPerPage: actions.payload,
        };
      case 'SET_NAMECOLETA_COLETA_FILTER':
        return {
          ...state,
          nameColeta: actions.payload,
        };
      case 'SET_CLEAR_COLETA_FILTER':
        return {
          ...state,
          initialDate: '',
          finalDate: '',
          driver_id: ''
        };
      case 'SET_INITIALDATE_COLETA_FILTER':
        return {
          ...state,
          initialDate: actions.payload,
        };
      case 'SET_FINALDATE_COLETA_FILTER':
        return {
          ...state,
          finalDate: actions.payload,
        };
      case 'SET_IDDRIVER_FILTER':
        return {
          ...state,
          driver_id: actions.payload
        };
      default:
        return state;
    }
  };
  
  export default coletaReducer;
  