import { useEffect, useState } from 'react';

// material-ui
import { Grid, Button } from '@mui/material';
import FarmIcon from '@mui/icons-material/Agriculture';
import { useNavigate } from 'react-router-dom';
import { getFarmUser } from 'services/farm';
import Fundo from '../../../components/Images/fundo.png';

// ==============================|| Index ||============================== //

const CloseFarm = () => {
    const navigate = useNavigate();
    const [farm, setFarm] = useState([]);
    useEffect(() => {
        getAllFarmUser();
    }, []);
    function getAllFarmUser() {
        getFarmUser().then((resp) => {
            setFarm(resp.data);
        });
    }
    function renderFarm() {
        return farm.map((desc) => (
            <Grid key={desc.id_panel} item md={3} sm={12} ml={4}>
                <Button
                    style={{
                        background: 'transparent 0% 0% no-repeat padding-box',
                        border: '1px solid #91B754',
                        borderRadius: '15px',
                        opacity: 1,
                        width: '100%',
                        height: '53px',
                        font: 'normal normal normal 18px/22px Myriad Pro',
                        letterSpacing: '0px',
                        color: '#91B754'
                    }}
                    onClick={() => navigate({ pathname: `/painel/${desc.id_panel}?idFarm=${desc.id_farm}` })}
                >
                    {`${desc.farm} - ${desc.bi_panel}`}
                </Button>
            </Grid>
        ));
    }
    return (
        <Grid
            style={{
                backgroundImage: `url(${Fundo})`,
                backgroundPosition: '50% 50%',
                backgroundSize: 'cover',
                width: '100%',
                height: '100%',
                padding: 0,
                margin: 0
            }}
            xs={12}
            md={12}
            sm={12}
            container
            // alignItems="center"
            // justifyContent="center"
        >
            <Grid item md={12} mt="0">
                <h1
                    style={{
                        font: 'normal normal bold 35px/44px Myriad Pro',
                        letterSpacing: '0px',
                        color: '#91B754',
                        opacity: 1,
                        padding: 15,
                        marginLeft: '2%'
                    }}
                >
                    <FarmIcon /> FECHAMENTO FAZENDAS
                </h1>
                <hr style={{ width: '95%' }}></hr>
                <div
                    style={{
                        padding: 15,
                        color: 'var(--unnamed-color-ffffff)',
                        textAlign: 'left',
                        font: 'normal normal 300 18px/22px Myriad Pro',
                        letterSpacing: '0px',
                        color: '#FFFFFF',
                        opacity: 1,
                        marginLeft: '2%'
                    }}
                >
                    <p>Selecione uma fazenda para entrar dentro do painel estatístico</p>
                </div>
            </Grid>
            {renderFarm()}
        </Grid>
    );
};

export default CloseFarm;
