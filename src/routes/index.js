import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import FirstAccess from './FirstAccess';
import config from 'config';
import { useSelector } from 'react-redux';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const firstAccess = useSelector((state) => state.auth.user.firstAccess);
  const route =
    firstAccess == 1 ? [FirstAccess] : [AuthenticationRoutes, MainRoutes];
  return useRoutes(route, config.basename);
}
