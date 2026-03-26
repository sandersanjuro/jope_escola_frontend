import React from 'react';
import { Chart } from 'react-google-charts';

const generateTicks = (maxValue) => {
    let ticks = [];
    for (let i = 0; i <= maxValue; i += 10) {
        ticks.push(i);
    }
    return ticks;
};

const options = {
    title: '% SLA ABERTURA GERENTE',
    legend: { position: 'none' },
    orientation: 'horizontal', // Alterado para orientação horizontal
    series: {
        0: { axis: 'Value' },
        1: { axis: 'Value', color: 'green' } // Barra verde
    },
    axes: {
        y: {
            Value: { label: 'Value' }
        }
    },
    vAxis: {
        ticks: generateTicks(100) // Marcando a linha de 90%
    },
    hAxis: {
        title: 'Meses',
        viewWindow: {
            min: 0
        }
    }
};
const Bar = ({ allData, handleClick }) => {
    return allData.length > 0 ? (
        <Chart
            chartEvents={[
                {
                    eventName: 'select',
                    callback: ({ chartWrapper }) => handleClick(chartWrapper)
                }
            ]}
            chartType="BarChart"
            width="100%"
            height="400px"
            data={allData}
            options={options}
        />
    ) : (
        <h1>Sem resultado na busca...</h1>
    );
};

export default Bar;
