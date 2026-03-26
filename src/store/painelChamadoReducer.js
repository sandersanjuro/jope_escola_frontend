export const initialState = {
    selectedUser: ''
  };
  
  // ==============================|| AUTH REDUCER ||============================== //
  
  const painelChamadoReducer = (state = initialState, actions) => {
    switch (actions.type) {
      case 'SET_SUPERVISOR_PAINEL_CHAMADO':
        return {
          ...state,
          selectedUser: actions.payload,
        };
      default:
        return state;
    }
  };
  
  export default painelChamadoReducer;
  