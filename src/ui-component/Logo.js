// material-ui
import LogoHeader from '../components/Images/new_logo_jope.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    return (
        <h2
            style={{
                color: '#FFFF',
                fontFamily: 'Arial Narrow, sans-serif',
                fontStyle: 'italic',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            JOPE
        </h2>
        // <img color="#FFF" src={LogoHeader} alt="inova" width="100" />
    );
};
const LogoLogin = () => {
    return (
        //  if you want to use image instead of svg uncomment following, and comment out <svg> element.
        <img src={LogoHeader} alt="inova" width="200" />
    );
};

export { Logo, LogoLogin };
