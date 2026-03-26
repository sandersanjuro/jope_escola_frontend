import React from 'react';
import { useSelector } from 'react-redux';
import TabTask from './TabTask';
import Task from './Task';

const Index = () => {
    const id_role = useSelector((state) => state.auth.user.perfil_id);
    let path = window.location.pathname;
    if (id_role === 3) {
        if (path !== '/nova_corretiva' && path !== '/nova_proativa') {
            return <Task />;
        }
        return <Task />;
    } else {
        return <Task />;
    }
};

export default Index;
