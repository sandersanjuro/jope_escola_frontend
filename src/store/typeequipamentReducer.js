export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameTypeEquipament: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const typeequipamentReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_TYPEEQUIPAMENT':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_TYPEEQUIPAMENT':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMETYPEEQUIPAMENT_TYPEEQUIPAMENT_FILTER':
      return {
        ...state,
        nameTypeEquipament: actions.payload,
      };
    case 'SET_CLEAR_TYPEEQUIPAMENT_FILTER':
      return {
        ...state,
        nameTypeEquipament: '',
      };
    default:
      return state;
  }
};

export default typeequipamentReducer;
