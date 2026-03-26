export const initialState = {
  loggedIn: false,
  user: {},
};

// ==============================|| AUTH REDUCER ||============================== //

const authReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_LOGIN':
      return {
        ...state,
        loggedIn: true,
        user: actions.payload,
      };
    case 'SET_LOGOUT':
      return {
        ...state,
        loggedIn: false,
        user: {},
      };
    default:
      return state;
  }
};

export default authReducer;
