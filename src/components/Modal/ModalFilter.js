import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '80vh', // Define a altura máxima para o modal
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    overflowY: 'auto', // Adiciona rolagem vertical quando necessário
    pt: 2,
    px: 4,
    pb: 3
};

export default function ModalFilter(props) {
    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: props.width ? props.width : 400 }}>
                    <h2 id="parent-modal-title">{props.title}</h2>
                    {props.content}
                </Box>
            </Modal>
        </div>
    );
}
