export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameTeam: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const teamReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_TEAM':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_TEAM':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMETEAM_TEAM_FILTER':
      return {
        ...state,
        nameTeam: actions.payload,
      };
    case 'SET_CLEAR_TEAM_FILTER':
      return {
        ...state,
        nameTeam: '',
      };
    default:
      return state;
  }
};

export default teamReducer;
