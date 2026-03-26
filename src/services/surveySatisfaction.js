import { app } from './Api';

const postSatisfaction = async (data) => {
  return app.post(`survey_satisfaction`, data);
};

export { postSatisfaction };
