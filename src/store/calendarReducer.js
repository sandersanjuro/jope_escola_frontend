export const initialState = {
  page: 0,
  rowsPerPage: 10,
  nameCalendar: '',
};

// ==============================|| AUTH REDUCER ||============================== //

const calendarReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_CALENDAR':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_CALENDAR':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_NAMECALENDAR_CALENDAR_FILTER':
      return {
        ...state,
        nameCalendar: actions.payload,
      };
    case 'SET_CLEAR_CALENDAR_FILTER':
      return {
        ...state,
        nameCalendar: '',
      };
    default:
      return state;
  }
};

export default calendarReducer;
