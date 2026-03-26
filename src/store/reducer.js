import { combineReducers } from 'redux';
import authReducer from './authReducer';

// reducer import
import customizationReducer from './customizationReducer';
import familyReducer from './familyReducer';
import farmReducer from './farmReducer';
import natureReducer from './natureReducer';
import operatingReducer from './operatingReducer';
import regionalReducer from './regionalReducer';
import taskReducer from './taskReducer';
import typetaskReducer from './typetaskReducer';
import typeequipamentReducer from './typeequipamentReducer';
import unitReducer from './unitReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import slaReducer from './slaReducer';
import calendarReducer from './calendarReducer';
import logsReducer from './logsReducer';
import typeOsReducer from './typeOsReducer';
import reportTaskReducer from './reportTaskReducer';
import BIReducer from './BIReducer';
import teamReducer from './teamReducer';
import typeProblemReducer from './typeProblemReducer';
import notificationsReducer from './notificationReducer';
import coletaReducer from './coletaReducer';
import painelChamadoReducer from './painelChamadoReducer';
import uraReducer from './uraReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  auth: authReducer,
  farm: farmReducer,
  user: userReducer,
  task: taskReducer,
  unit: unitReducer,
  regional: regionalReducer,
  family: familyReducer,
  typetask: typetaskReducer,
  typeequipament: typeequipamentReducer,
  nature: natureReducer,
  operating: operatingReducer,
  users: usersReducer,
  sla: slaReducer,
  calendar: calendarReducer,
  logs: logsReducer,
  typeOs: typeOsReducer,
  report_task: reportTaskReducer,
  bi: BIReducer,
  team: teamReducer,
  typeProblem: typeProblemReducer,
  notification: notificationsReducer,
  coleta: coletaReducer,
  painelChamado: painelChamadoReducer,
  ura: uraReducer
});

export default reducer;
