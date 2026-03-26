// material-ui
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPanelBi } from 'services/panelBi';

// ==============================|| Index ||============================== //

const PanelBi = () => {
    const params = useParams();
    const windowLocation = window.location.search;
    const idFarm = windowLocation.split('?idFarm=')[1];
    const [url, setUrl] = useState('');
    useEffect(() => {
        getPanelBiUrl();
    }, [params.id, idFarm]);
    function getPanelBiUrl() {
        getPanelBi(params.id, idFarm).then((resp) => setUrl(resp.data.url));
    }
    return (
        <>
            <Grid xs={12} md={12} sm={12} container>
                {!url && <h1>Painel não encontrado !</h1>}
                <Grid item xs={12} md={12}>
                    <iframe title="teste" height={screen.height - 260} width="100%" src={url} frameborder="0" allowFullScreen="true" />
                </Grid>
            </Grid>
        </>
    );
};

export default PanelBi;
