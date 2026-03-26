import { app } from './Api';

const ReportService = {
    getFilterOptions: () => {
        return app.get('/report/filter-options');
    },
    
    exportReport: (filters) => {
        return app.post('/report/export', filters, {
            responseType: 'blob'
        });
    }
};

export default ReportService;
