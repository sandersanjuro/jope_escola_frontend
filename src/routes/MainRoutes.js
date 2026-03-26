import PropTypes from 'prop-types';
import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import CloseFarm from 'views/pages/CloseFarm/CloseFarm';
import PanelBi from 'views/pages/PanelBi/PanelBi';
import { Navigate } from 'react-router';
import GridUser from 'views/pages/User/GridUser';
import User from 'views/pages/User/User';
import GridTask from 'views/pages/Task/GridTask';
import Task from 'views/pages/Task/index';
import Unit from 'views/pages/Unit/Unit';
import GridUnit from 'views/pages/Unit/GridUnit';
import Regional from 'views/pages/Regional/Regional';
import GridRegional from 'views/pages/Regional/GridRegional';
import Family from 'views/pages/Family/Family';
import GridFamily from 'views/pages/Family/GridFamily';
import Nature from 'views/pages/Nature/Nature';
import GridNature from 'views/pages/Nature/GridNature';
import TypeTask from 'views/pages/TypeTask/TypeTask';
import GridTypeTask from 'views/pages/TypeTask/GridTypeTask';
import TypeEquipament from 'views/pages/TypeEquipament/TypeEquipament';
import GridTypeEquipament from 'views/pages/TypeEquipament/GridTypeEquipament';
import Rotina from 'views/pages/Rotina/Rotina';
import Operating from 'views/pages/Operating/Operating';
import GridOperating from 'views/pages/Operating/GridOperating';
import MaintenancePlan from 'views/pages/MaitenancePlan/MaintenancePlan';
import GridSla from 'views/pages/Sla/GridSla';
import Sla from 'views/pages/Sla/Sla';
import GridCalendar from 'views/pages/Calendar/GridCalendar';
import Calendar from 'views/pages/Calendar/Calendar';
import Settings from 'views/pages/ConfigurationPanel/ConfigurationPanel';
import FinalTask from 'views/pages/Task/FinalTask';
import TabTask from 'views/pages/Task/TabTask';
import ConfigurationUnit from 'views/pages/ConfigurationUnit/ConfigurationUnit';
import AdministrationCenter from 'views/pages/administrationCenter/AdministrationCenter';
import Logs from 'views/pages/Logs/Logs';
import TypeOs from 'views/pages/TypeOS/TypeOs';
import GridTypeOs from 'views/pages/TypeOS/GridTypeOs';
import ReportTask from 'views/pages/ReportTask/ReportTask';
import Bi from 'views/pages/Bi/Bi';
import GridProactive from 'views/pages/Proactive/GridProactive';
import GridTaskManager from 'views/pages/TaskManager/GridTaskManager';
import TaskManager from 'views/pages/TaskManager/TaskManager';
import Team from 'views/pages/Team/Team';
import GridTeam from 'views/pages/Team/GridTeam';
import TypeProblem from 'views/pages/TypeProblem/TypeProblem';
import GridTypeProblem from 'views/pages/TypeProblem/GridTypeProblem';
import Profile from 'views/pages/Profile/Profile';
import GridColeta from 'views/pages/Coleta/GridColeta';
import GridUra from 'views/pages/Ura/GridUra';
import Dashboard from 'views/pages/Dashboard/Dashboard';
import DashboardDirector from 'views/pages/DashboardDirector/DashboardDirector';
import ReportTaskNew from 'views/pages/Report/ReportTaskNew';
import TaskPdf from 'views/pages/TaskPdf/TaskPdf';
const Home = Loadable(lazy(() => import('views/pages/Home/Home')));

// ==============================|| MAIN ROUTING ||============================== //

const AuthRouter = ({ children }) => {
    let token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};
AuthRouter.propTypes = {
    children: PropTypes.object
};
const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/index',
            element: (
                <AuthRouter>
                    <Home />
                </AuthRouter>
            )
        },
        {
            path: '/fechamento_fazenda',
            element: (
                <AuthRouter>
                    <CloseFarm />
                </AuthRouter>
            )
        },
        {
            path: '/painel/:id',
            element: (
                <AuthRouter>
                    <PanelBi />
                </AuthRouter>
            )
        },
        {
            path: 'usuarios',
            element: (
                <AuthRouter>
                    <GridUser />
                </AuthRouter>
            )
        },
        {
            path: 'novo_usuario',
            element: (
                <AuthRouter>
                    <User />
                </AuthRouter>
            )
        },
        {
            path: '/usuario/:id/:action',
            element: (
                <AuthRouter>
                    <User />
                </AuthRouter>
            )
        },
        {
            path: 'nova_corretiva',
            element: (
                <AuthRouter>
                    <Task />
                </AuthRouter>
            )
        },
        {
            path: 'corretivas',
            element: (
                <AuthRouter>
                    <GridTask />
                </AuthRouter>
            )
        },
        {
            path: 'corretiva/:id/:action',
            element: (
                <AuthRouter>
                    <Task />
                </AuthRouter>
            )
        },
        {
            path: 'nova_preventiva',
            element: (
                <AuthRouter>
                    <Task />
                </AuthRouter>
            )
        },
        {
            path: 'preventivas',
            element: (
                <AuthRouter>
                    <GridTask />
                </AuthRouter>
            )
        },
        {
            path: 'preventiva/:id/:action',
            element: (
                <AuthRouter>
                    <Task />
                </AuthRouter>
            )
        },
        {
            path: 'nova_unidade',
            element: (
                <AuthRouter>
                    <Unit />
                </AuthRouter>
            )
        },
        {
            path: 'unidades',
            element: (
                <AuthRouter>
                    <GridUnit />
                </AuthRouter>
            )
        },
        {
            path: '/unidade/:id/:action',
            element: (
                <AuthRouter>
                    <Unit />
                </AuthRouter>
            )
        },
        {
            path: 'nova_tarefa',
            element: (
                <AuthRouter>
                    <TypeTask />
                </AuthRouter>
            )
        },
        {
            path: 'tarefas',
            element: (
                <AuthRouter>
                    <GridTypeTask />
                </AuthRouter>
            )
        },
        {
            path: '/tarefa/:id/:action',
            element: (
                <AuthRouter>
                    <TypeTask />
                </AuthRouter>
            )
        },
        {
            path: 'novo_tipoequipamento',
            element: (
                <AuthRouter>
                    <TypeEquipament />
                </AuthRouter>
            )
        },
        {
            path: 'tipoequipamentos',
            element: (
                <AuthRouter>
                    <GridTypeEquipament />
                </AuthRouter>
            )
        },
        {
            path: '/tipoequipamento/:id/:action',
            element: (
                <AuthRouter>
                    <TypeEquipament />
                </AuthRouter>
            )
        },
        {
            path: 'nova_regional',
            element: (
                <AuthRouter>
                    <Regional />
                </AuthRouter>
            )
        },
        {
            path: 'regionais',
            element: (
                <AuthRouter>
                    <GridRegional />
                </AuthRouter>
            )
        },
        {
            path: '/regional/:id/:action',
            element: (
                <AuthRouter>
                    <Regional />
                </AuthRouter>
            )
        },
        {
            path: 'nova_familia',
            element: (
                <AuthRouter>
                    <Family />
                </AuthRouter>
            )
        },
        {
            path: 'familias',
            element: (
                <AuthRouter>
                    <GridFamily />
                </AuthRouter>
            )
        },
        {
            path: '/familia/:id/:action',
            element: (
                <AuthRouter>
                    <Family />
                </AuthRouter>
            )
        },
        {
            path: 'nova_natureza',
            element: (
                <AuthRouter>
                    <Nature />
                </AuthRouter>
            )
        },
        {
            path: 'naturezas',
            element: (
                <AuthRouter>
                    <GridNature />
                </AuthRouter>
            )
        },
        {
            path: '/natureza/:id/:action',
            element: (
                <AuthRouter>
                    <Nature />
                </AuthRouter>
            )
        },
        {
            path: 'nova_rotina',
            element: (
                <AuthRouter>
                    <Rotina />
                </AuthRouter>
            )
        },
        {
            path: 'novo_ativo',
            element: (
                <AuthRouter>
                    <Operating />
                </AuthRouter>
            )
        },
        {
            path: 'ativos',
            element: (
                <AuthRouter>
                    <GridOperating />
                </AuthRouter>
            )
        },
        {
            path: '/ativo/:id/:action',
            element: (
                <AuthRouter>
                    <Operating />
                </AuthRouter>
            )
        },
        {
            path: '/plano_manutencao/:idOperating',
            element: (
                <AuthRouter>
                    <MaintenancePlan />
                </AuthRouter>
            )
        },
        {
            path: '/slas',
            element: (
                <AuthRouter>
                    <GridSla />
                </AuthRouter>
            )
        },
        {
            path: '/novo_sla',
            element: (
                <AuthRouter>
                    <Sla />
                </AuthRouter>
            )
        },
        {
            path: '/sla/:id/:action',
            element: (
                <AuthRouter>
                    <Sla />
                </AuthRouter>
            )
        },
        {
            path: '/calendarios',
            element: (
                <AuthRouter>
                    <GridCalendar />
                </AuthRouter>
            )
        },
        {
            path: 'novo_calendario',
            element: (
                <AuthRouter>
                    <Calendar />
                </AuthRouter>
            )
        },
        {
            path: '/calendario/:id/:action',
            element: (
                <AuthRouter>
                    <Calendar />
                </AuthRouter>
            )
        },
        {
            path: '/configuracoes',
            element: (
                <AuthRouter>
                    <Settings />
                </AuthRouter>
            )
        },
        {
            path: 'atendimento/:module/:id',
            element: (
                <AuthRouter>
                    <FinalTask />
                </AuthRouter>
            )
        },
        {
            path: 'inicio_atendimento/:id',
            element: (
                <AuthRouter>
                    <TabTask />
                </AuthRouter>
            )
        },
        {
            path: '/configuracoes_unidade',
            element: (
                <AuthRouter>
                    <ConfigurationUnit />
                </AuthRouter>
            )
        },
        {
            path: '/administracoes',
            element: (
                <AuthRouter>
                    <AdministrationCenter />
                </AuthRouter>
            )
        },
        {
            path: '/logs',
            element: (
                <AuthRouter>
                    <Logs />
                </AuthRouter>
            )
        },
        {
            path: '/tipo_os',
            element: (
                <AuthRouter>
                    <TypeOs />
                </AuthRouter>
            )
        },
        {
            path: '/tipo_os/:id/:action',
            element: (
                <AuthRouter>
                    <TypeOs />
                </AuthRouter>
            )
        },
        {
            path: '/tipos_os',
            element: (
                <AuthRouter>
                    <GridTypeOs />
                </AuthRouter>
            )
        },
        {
            path: '/exportacao_chamados',
            element: (
                <AuthRouter>
                    <ReportTask />
                </AuthRouter>
            )
        },
        {
            path: '/bi',
            element: (
                <AuthRouter>
                    <Bi />
                </AuthRouter>
            )
        },
        {
            path: 'proativas',
            element: (
                <AuthRouter>
                    <GridProactive />
                </AuthRouter>
            )
        },
        {
            path: 'nova_proativa',
            element: (
                <AuthRouter>
                    <Task />
                </AuthRouter>
            )
        },
        {
            path: 'proativa/:id/:action',
            element: (
                <AuthRouter>
                    <Task />
                </AuthRouter>
            )
        },
        {
            path: 'chamados_gerente',
            element: (
                <AuthRouter>
                    <GridTaskManager />
                </AuthRouter>
            )
        },
        {
            path: 'novo_chamado_gerente',
            element: (
                <AuthRouter>
                    <TaskManager />
                </AuthRouter>
            )
        },
        {
            path: 'chamado_gerente/:id/:action',
            element: (
                <AuthRouter>
                    <TaskManager />
                </AuthRouter>
            )
        },
        {
            path: '/equipe',
            element: (
                <AuthRouter>
                    <Team />
                </AuthRouter>
            )
        },
        {
            path: '/equipe/:id/:action',
            element: (
                <AuthRouter>
                    <Team />
                </AuthRouter>
            )
        },
        {
            path: '/equipes',
            element: (
                <AuthRouter>
                    <GridTeam />
                </AuthRouter>
            )
        },
        {
            path: 'novo_tipo_problema',
            element: (
                <AuthRouter>
                    <TypeProblem />
                </AuthRouter>
            )
        },
        {
            path: 'tipo_problemas',
            element: (
                <AuthRouter>
                    <GridTypeProblem />
                </AuthRouter>
            )
        },
        {
            path: '/tipo_problema/:id/:action',
            element: (
                <AuthRouter>
                    <TypeProblem />
                </AuthRouter>
            )
        },
        {
            path: '/profile/:id',
            element: (
                <AuthRouter>
                    <Profile />
                </AuthRouter>
            )
        },
        {
            path: '/coletas',
            element: (
                <AuthRouter>
                    <GridColeta />
                </AuthRouter>
            )
        },
        {
            path: '/uras',
            element: (
                <AuthRouter>
                    <GridUra />
                </AuthRouter>
            )
        },
        {
            path: '/dashboard',
            element: (
                <AuthRouter>
                    <Dashboard />
                </AuthRouter>
            )
        },
        {
            path: '/dashboard_directors',
            element: (
                <AuthRouter>
                    <DashboardDirector />
                </AuthRouter>
            )
        }, 
        {
            path: '/report_task',
            element: (
                <AuthRouter>
                    <ReportTaskNew />
                </AuthRouter>
            )
        },
        {
            path: '/task_pdf',
            element: (
                <AuthRouter>
                    <TaskPdf />
                </AuthRouter>
            )
        }
    ]
};

export default MainRoutes;
