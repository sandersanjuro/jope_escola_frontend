import { app } from './Api';

const getSatisfactionQuestions = async () => {
  return app.get(`survey_satisfaction_questions`);
};

export { getSatisfactionQuestions };
