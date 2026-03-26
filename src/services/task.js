import { app } from './Api';
import { appblob } from './ApiBlob';

const getResourceTask = async () => {
  return app.get(`get_resource_task`);
};
const getTimesSla = async (idSla, dateTime, time) => {
  return app.get(
    `get_time_sla?idSla=${idSla}&dateTime=${dateTime}&time=${time}`
  );
};
const getSlaTask = async (idUnit) => {
  return app.get(`get_sla_negocio?idUnit=${idUnit || ''}`);
};
const getTypeOs = async (idFamily) => {
  return app.get(`type_os_family?idFamily=${idFamily || ''}`);
};
const getTEquipamentOs = async (idTypeOs) => {
  return app.get(`type_equipament_os?idTypeOs=${idTypeOs || ''}`);
};
const getOperatingTask = async (idUnit, idCategory) => {
  return app.get(
    `get_operating_task?idUnit=${idUnit}&idCategory=${idCategory}`
  );
};
const postTask = async (data) => {
  return app.post(`task`, data);
};
const initialAttendance = async (id, data) => {
  return app.post(`initial_attendance/${id}`, data);
};
const cancelTask = async (id, data) => {
  return app.post(`cancel_task/${id}`, data);
};
const reopenTask = async (id, data) => {
  return app.post(`task_reopen/${id}`, data);
};
const finalAttendance = async (id, data) => {
  return app.post(`final_attendance/${id}`, data);
};
const postDispatchTechnical = async (data) => {
  return app.post(`dispatch_technical`, data);
};
const getTaskPerId = async (id) => {
  return app.get(`task/${id}`);
};
const taskEndPerId = async (id) => {
  return app.get(`view_end/${id}`);
};
const updateTask = async (id, data) => {
  return app.post(`task/${id}`, data);
};
const getTasks = async (
  page,
  qtdPerPage,
  general,
  initialDate,
  finalDate,
  idStatus,
  idUnit,
  idTypeOs,
  moduleOs,
  idNatureOfOperation,
  os,
  proactive = '',
  direction_order = 'desc',
  type_order = 'data_abertura'
) => {
  return app.get(
    `task?page=${page}&qtdPerPage=${qtdPerPage}&general=${general}&initialDate=${initialDate}&finalDate=${finalDate}&idStatus=${idStatus}&idUnit=${idUnit}&idTypeOs=${idTypeOs}&moduleOs=${moduleOs}&idNatureOfOperation=${idNatureOfOperation}&os=${os}&proactive=${proactive}&direction_order=${direction_order}&type_order=${type_order}`
  );
};
const getTasksGerente = async (
  page,
  qtdPerPage,
  general,
  initialDate,
  finalDate,
  idStatus,
  idUnit,
  idTypeOs,
  moduleOs,
  idNatureOfOperation,
  os,
  proactive = ''
) => {
  return app.get(
    `task_gerente?page=${page}&qtdPerPage=${qtdPerPage}&general=${general}&initialDate=${initialDate}&finalDate=${finalDate}&idStatus=${idStatus}&idUnit=${idUnit}&idTypeOs=${idTypeOs}&moduleOs=${moduleOs}&idNatureOfOperation=${idNatureOfOperation}&os=${os}&proactive=${proactive}`
  );
};
const getTechinalDispatch = async (idTeam = '') => {
  return app.get(`get_techinal_dispatch?idTeam=${idTeam}`);
};

const getTeamTask = async (idTask) => {
  return app.get(`get_team_task?idTask=${idTask}`);
};

const getTeamTaskPost = async (idTypeOs, idUnit) => {
  return app.get(`get_team_task_post?idTypeOs=${idTypeOs}&idUnit=${idUnit}`);
};

const getTaskExport = async (initialDate, finalDate, moduleOs) => {
  return appblob.get(
    `task_export?initialDate=${initialDate}&finalDate=${finalDate}&moduleOs=${moduleOs}`
  );
};
const removeAttachment = async (id) => {
  return app.delete(`attachment_task/${id}`);
};
const getTechnicalTask = async (id) => {
  return app.get(`get_technical_os/${id}`);
};
const getTasksPreventiva = async (
  page,
  qtdPerPage,
  general,
  initialDate,
  finalDate,
  idStatus,
  idUnit,
  idTypeOs,
  moduleOs,
  idNatureOfOperation,
  os,
  proactive = '',
  equipamento_id = '',
  keyword = '',
  direction_order = 'desc',
  type_order = 'os.data_abertura',
  repactuationFilter = 'TODOS'
) => {
  return app.get(
    `task?page=${page}&qtdPerPage=${qtdPerPage}&general=${general}&initialDate=${initialDate}&finalDate=${finalDate}&idStatus=${idStatus}&idUnit=${idUnit}&idTypeOs=${idTypeOs}&moduleOs=${moduleOs}&idNatureOfOperation=${idNatureOfOperation}&os=${os}&proactive=${proactive}&equipamento_id=${equipamento_id}&keyword=${keyword}&direction_order=${direction_order}&type_order=${type_order}&repactuationFilter=${repactuationFilter}`
  );
};
const finalAttendanceAll = async (data) => {
  return app.post(`final_attendance_all`, data);
};
const getTaskExportSurvey = async (initialDate, finalDate, idUnit) => {
  return appblob.get(
    `task_export_survey?initialDate=${initialDate}&finalDate=${finalDate}&idUnit=${idUnit}`
  );
};

const getTasksReport = async (
  general,
  initialDate,
  finalDate,
  idStatus,
  idUnit,
  idTypeOs,
  moduleOs,
  idNatureOfOperation,
  os,
  proactive = '',
  equipamento_id = ''
) => {
  return appblob.get(
    `task_report_export?general=${general}&initialDate=${initialDate}&finalDate=${finalDate}&idStatus=${idStatus}&idUnit=${idUnit}&idTypeOs=${idTypeOs}&moduleOs=${moduleOs}&idNatureOfOperation=${idNatureOfOperation}&os=${os}&proactive=${proactive}&equipamento_id=${equipamento_id}`
  );
};
const destroy = async (id) => {
  return app.delete(`task/${id}`);
};

const repactuation = async (data, id) => {
  return app.post(`repactuation/${id}`, data);
};

const reset = async (data, id) => {
  return app.post(`reset_task/${id}`, data);
};
export {
  getResourceTask,
  postTask,
  getTasks,
  getOperatingTask,
  getSlaTask,
  getTimesSla,
  getTaskPerId,
  updateTask,
  getTechinalDispatch,
  postDispatchTechnical,
  initialAttendance,
  finalAttendance,
  taskEndPerId,
  cancelTask,
  getTeamTask,
  getTeamTaskPost,
  getTaskExport,
  reopenTask,
  getTypeOs,
  getTEquipamentOs,
  removeAttachment,
  getTechnicalTask,
  getTasksGerente,
  getTasksPreventiva,
  finalAttendanceAll,
  getTaskExportSurvey,
  getTasksReport,
  destroy,
  repactuation,
  reset
};
