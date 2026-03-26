import React from 'react';
import { Chart } from 'react-google-charts';
export const options = {
    title: 'Curtidas',
    vAxis: { minValue: 0 },
    chartArea: { width: '90%', height: '70%' },
    legend: { position: 'in' },
    explorer: { axis: 'horizontal', keepInBounds: true }
};

export function GraphicArea(props) {
    return props.allData.length > 1 ? (
        <Chart chartType="AreaChart" width={props.width} height="600px" data={props.allData} options={options} />
    ) : (
        <h1>Sem resultado na busca...</h1>
    );
}
