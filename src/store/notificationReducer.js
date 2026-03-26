import { getNotification } from 'services/notification';

export const initialState = {
  notifications: [],
};

// ==============================|| AUTH REDUCER ||============================== //
export const loadTotalNotification = async (dispatch) => {
  await getNotification()
    .then((res) => {
      dispatch({
        type: 'SET_TOTAL_NOTIFICATION',
        payload: { total: res.data },
      });
    })
    .catch(() => {});
};

const notificationsReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_TOTAL_NOTIFICATION':
      return {
        ...state,
        notifications: actions.payload.total,
      };
    default:
      return state;
  }
};

export default notificationsReducer;
