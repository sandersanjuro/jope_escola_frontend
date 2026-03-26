import { app } from './Api';

const getExport = async (initialDate, finalDate) => {
  return app.get(
    `logs_export?initialDate=${initialDate}&finalDate=${finalDate}`
  );
};
export { getExport };
