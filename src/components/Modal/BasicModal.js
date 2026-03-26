import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

export default function BasicModal({ open, handleClose, title, description, onDelete }) {
    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {description}
                    </Typography>
                    <Grid container alignItems="end" justifyContent="end" sx={{ mt: 3 }}>
                        <Grid item>
                            <Box sx={{ mt: 2, mr: 3 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="button"
                                        variant="contained"
                                        color="error"
                                        onClick={handleClose}
                                    >
                                        Não
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box sx={{ mt: 2, mr: 3 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        onClick={onDelete}
                                    >
                                        Sim
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}
