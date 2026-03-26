// Obtém a data atual em UTC
const currentUTCDate = new Date();

// Obtém o offset do fuso horário de São Paulo em minutos (considerando horário de verão)
const offsetSP = -180; // São Paulo: UTC-3 (UTC-2 durante o horário de verão)

// Calcula a data atual no fuso horário de São Paulo
const currentSPDate = new Date(currentUTCDate.getTime() + offsetSP * 60000);

// Formata a data atual no formato ISO (yyyy-mm-dd)
const isoDate = currentSPDate.toISOString().slice(0, 10);

export const initialState = {
  optionMenu: 'SLA GERENTE',
  initialDate: '2024',
  finalDate: null,
  unitFilter: '',
  filtered: false,
  filterDate: '2024',
  filterUnit: 14725896312,
  filterUnitCount: '',
  filterDateCount: isoDate,
  filterDateCountFormat: isoDate,
};

const BIReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case 'SET_OPTION_MENU':
      return {
        ...state,
        optionMenu: actions.payload,
      };
    case 'SET_FILTER_DATE':
      return {
        ...state,
        filterDate: actions.payload,
      };
    case 'SET_FILTER_UNIT':
      return {
        ...state,
        filterUnit: actions.payload,
      };
    case 'SET_UNITBI_FILTER':
      return {
        ...state,
        unitFilter: actions.payload,
      };
    case 'SET_COURSE_FILTER':
      return {
        ...state,
        courseFilter: actions.payload,
      };
    case 'SET_EVENT_FILTER':
      return {
        ...state,
        eventFilter: actions.payload,
      };
    case 'SET_TYPE_EVENT_FILTER':
      return {
        ...state,
        typeEventFilter: actions.payload,
      };
    case 'SET_SPEAKER_FILTER':
      return {
        ...state,
        speakerFilter: actions.payload,
      };
    case 'SET_FILTERED':
      return {
        ...state,
        filtered: actions.payload,
      };
    case 'SET_FILTER_UNIT_COUNT':
      return {
        ...state,
        filterUnitCount: actions.payload,
      };
    case 'SET_FILTER_DATE_COUNT':
      return {
        ...state,
        filterDateCount: actions.payload,
      };
    case 'SET_FILTER_DATE_COUNT_FORMAT':
      return {
        ...state,
        filterDateCountFormat: actions.payload,
      };
    default:
      return state;
  }
};

export default BIReducer;
