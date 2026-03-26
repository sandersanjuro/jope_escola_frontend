import React from 'react';
import PropTypes from 'prop-types';
import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { Link } from 'react-router-dom';

function AddButton({ href }) {
    return (
        <Link to={href}>
            <Fab sx={{ position: 'fixed', bottom: 16, right: 16 }} color="primary" aria-label="add">
                <Add />
            </Fab>
        </Link>
    );
}

AddButton.propTypes = {
    href: PropTypes.string.isRequired
};

export default AddButton;
