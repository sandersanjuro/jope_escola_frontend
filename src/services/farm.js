import { app } from './Api';

const getFarmUser = async () => {
  return app.get('farm_user');
};
export { getFarmUser };
