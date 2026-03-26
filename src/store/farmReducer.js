export const initialState = {
  farm: {},
};

// ==============================|| AUTH REDUCER ||============================== //

const farmReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_FARM_PANEL':
      return {
        ...state,
        farm: actions.payload,
      };
    case 'SET_FARM_CLEAR':
      return {
        ...state,
        farm: {},
      };
    default:
      return state;
  }
};

export default farmReducer;
