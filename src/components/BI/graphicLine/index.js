import React from 'react';
import { Chart } from 'react-google-charts';

export const options = {
    chart: {
        title: 'Contagem de pessoas diárias',
        subtitle: 'por Hora'
    }
};

export function GraphicLine({ data }) {
    return <Chart chartType="Line" width="100%" height="400px" data={data} options={options} />;
}
