import { repactuation } from "services/task";

export const initialState = {
  page: 1,
  rowsPerPage: 48,
  general: '',
  initialDate: '',
  finalDate: '',
  idStatus: [],
  idUnit: '',
  idTypeOs: [],
  idNatureOfOperation: '',
  os: '',
  objectStatus: [],
  equipamento_id: '',
  keyword: '',
  objectTypeOs: [],
  user_id: '',
  orderDirection: 'desc',
  typeOrder: 'os.data_abertura',
  repactuationFilter: 'TODOS'
};

// ==============================|| AUTH REDUCER ||============================== //

const taskReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_PAGE_TASK':
      return {
        ...state,
        page: actions.payload,
      };
    case 'SET_ROWS_PER_PAGE_TASK':
      return {
        ...state,
        rowsPerPage: actions.payload,
      };
    case 'SET_GENERAL_TASK_FILTER':
      return {
        ...state,
        general: actions.payload,
      };
    case 'SET_INITIALDATE_TASK_FILTER':
      return {
        ...state,
        initialDate: actions.payload,
      };
    case 'SET_FINALDATE_TASK_FILTER':
      return {
        ...state,
        finalDate: actions.payload,
      };
    case 'SET_IDSTATUS_TASK_FILTER':
      return {
        ...state,
        idStatus: actions.payload,
        objectStatus: actions.objectStatus,
      };
    case 'SET_OS_TASK_FILTER':
      return {
        ...state,
        os: actions.payload,
      };
    case 'SET_IDUNITTASK_FILTER':
      return {
        ...state,
        idUnit: actions.payload,
      };
    case 'SET_IDTYPEOSTASK_FILTER':
      return {
        ...state,
        idTypeOs: actions.payload,
        objectTypeOs: actions.objectTypeOs
      };
    case 'SET_IDNATUREOFOPERATION_FILTER':
      return {
        ...state,
        idNatureOfOperation: actions.payload,
      };
    case 'SET_IDEQUIPAMENTO_FILTER':
      return {
        ...state,
        equipamento_id: actions.payload,
      };
    case 'SET_USER_TASK':
      return {
        ...state,
        user_id: actions.payload,
      };
    case 'SET_CLEAR_TASK_FILTER':
      return {
        ...state,
        general: '',
        initialDate: '',
        finalDate: '',
        idStatus: [],
        idUnit: '',
        idTypeOs: [],
        idNatureOfOperation: actions.idNatureOfOperation,
        os: '',
        objectStatus: [],
        page: 1,
        equipamento_id: '',
        keyword: '',
        objectTypeOs: [],
        user_id: '',
        repactuationFilter: 'TODOS',
      };
    case 'SET_KEYWORD_TASK_FILTER':
      return {
        ...state,
        keyword: actions.payload,
      };
    case 'SET_ORDER_DIRECTION':
      return {
        ...state,
        orderDirection: actions.payload,
      };
    case 'SET_TYPE_ORDER':
      return {
        ...state,
        typeOrder: actions.payload,
      };
    case 'SET_REPACTUATION_FILTER':
      return {
        ...state,
        repactuationFilter: actions.payload,
      };
    default:
      return state;
  }
};

export default taskReducer;
