import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, List, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import { useSelector } from 'react-redux';

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
    const theme = useTheme();
    const name = useSelector((state) => state.auth.user.nome) || '';
    const idUnit = useSelector((state) => state.user.unit || '');

    // menu list collapse & items
    const items = item.children?.map((menu) => {
        switch (menu.type) {
            case 'collapse':
                return <NavCollapse key={menu.id} menu={menu} level={1} />;
            case 'item':
                if (idUnit == 14725896312) {
                    if (menu.id !== 'configuracoes_unidade') {
                        return <NavItem key={menu.id} item={menu} level={1} />;
                    }
                } else {
                    if (menu.id !== 'configuracoes') {
                        return <NavItem key={menu.id} item={menu} level={1} />;
                    }
                }
            // default:
            //     return (
            //         <Typography key={menu.id} variant="h6" color="error" align="center">
            //             Menu Items Error
            //         </Typography>
            //     );
        }
    });

    return (
        <>
            {item.titleName && (
                <Typography
                    variant="caption"
                    sx={{ ...theme.typography.menuCaption, color: '#000000', textAlign: 'center' }}
                    display="block"
                    gutterBottom
                >
                    Bem Vindo {name.split(' ')[0]}
                </Typography>
            )}
            <Divider sx={{ mt: 0.25, mb: 1.25 }} />
            <List
                subheader={
                    item.title && (
                        <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
                            {item.title}
                            {item.caption && (
                                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                    {item.caption}
                                </Typography>
                            )}
                        </Typography>
                    )
                }
            >
                {items}
            </List>

            {/* group divider */}
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;
