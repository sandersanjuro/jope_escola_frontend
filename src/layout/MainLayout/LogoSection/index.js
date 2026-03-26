import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import { Logo } from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <ButtonBase style={{ justifyContent: 'center', alignItems: 'center' }} disableRipple component={Link} to="/index">
        <Logo />
    </ButtonBase>
);

export default LogoSection;
