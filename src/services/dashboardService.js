import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000/api';

class DashboardService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        // Interceptor para adicionar token automaticamente
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    /**
     * Busca os dados do dashboard
     * @param {string} period - Período no formato "agosto-2025"
     * @param {Array} typeOsIds - Array de IDs dos tipos de OS
     * @returns {Promise}
     */
    async getDashboardData(period, typeOsIds = []) {
        try {
            const params = new URLSearchParams();
            params.append('period', period);
            
            if (typeOsIds.length > 0) {
                typeOsIds.forEach(id => params.append('typeOs[]', id));
            }

            const response = await this.api.get(`/dashboard/data?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            throw error;
        }
    }

    /**
     * Busca resumo do dashboard (formato específico para o frontend)
     * @param {string} period - Período no formato "agosto-2025"
     * @param {Array} typeOsIds - Array de IDs dos tipos de OS (array vazio = sem filtro)
     * @returns {Promise}
     */
    async getDashboardSummary(period, typeOsIds = []) {
        try {
            const params = new URLSearchParams();
            params.append('period', period);
            
            // Só adiciona filtro de tipo de OS se houver seleções
            if (typeOsIds && typeOsIds.length > 0) {
                typeOsIds.forEach(id => params.append('typeOs[]', id));
            }

            const response = await this.api.get(`/dashboard/summary?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar resumo do dashboard:', error);
            throw error;
        }
    }


    /**
     * Busca os períodos disponíveis
     * @returns {Promise}
     */
    async getAvailablePeriods() {
        try {
            const response = await this.api.get('/dashboard/available-periods');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar períodos disponíveis:', error);
            throw error;
        }
    }

    /**
     * Busca dados para o dashboard de diretoras
     * @param {Object} filters - Filtros: { year, unit, typeOs }
     * @returns {Promise}
     */
    async getDirectorDashboardData(filters) {
        try {
            const params = new URLSearchParams();
            params.append('year', filters.year);
            params.append('unit', filters.unit);
            
            if (filters.typeOs && Array.isArray(filters.typeOs) && filters.typeOs.length > 0) {
                filters.typeOs.forEach(id => params.append('typeOs[]', id));
            }

            const response = await this.api.get(`/dashboard/director?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard de diretoras:', error);
            throw error;
        }
    }

    /**
     * Busca os tipos de OS disponíveis
     * @returns {Promise}
     */
    async getTypeOsOptions() {
        try {
            const response = await this.api.get('/dashboard/type-os');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar tipos de OS:', error);
            throw error;
        }
    }

    /**
     * Busca chamados pendentes para o modal
     * @param {Object} filters - Filtros: { year, month, unit, typeOs, page, perPage }
     * @returns {Promise}
     */
    async getPendentesData(filters) {
        try {
            const params = new URLSearchParams();
            params.append('year', filters.year);
            params.append('month', filters.month);
            params.append('unit', filters.unit);
            params.append('page', filters.page);
            params.append('perPage', filters.perPage);
            
            if (filters.typeOs && Array.isArray(filters.typeOs) && filters.typeOs.length > 0) {
                filters.typeOs.forEach(id => params.append('typeOs[]', id));
            }

            const response = await this.api.get(`/dashboard/pendentes?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar chamados pendentes:', error);
            throw error;
        }
    }

    /**
     * Busca chamados finalizados para o modal
     * @param {Object} filters - Filtros: { year, month, unit, typeOs, page, perPage }
     * @returns {Promise}
     */
    async getFinalizadosData(filters) {
        try {
            const params = new URLSearchParams();
            params.append('year', filters.year);
            params.append('month', filters.month);
            params.append('unit', filters.unit);
            params.append('page', filters.page);
            params.append('perPage', filters.perPage);
            
            if (filters.typeOs && Array.isArray(filters.typeOs) && filters.typeOs.length > 0) {
                filters.typeOs.forEach(id => params.append('typeOs[]', id));
            }

            const response = await this.api.get(`/dashboard/finalizados?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar chamados finalizados:', error);
            throw error;
        }
    }
}

export default new DashboardService();
