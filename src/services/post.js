import { app } from './Api';

const getPosts = async () => {
  return app.get('post');
};
const savePosts = async (data) => {
  return app.post('post', data);
};

export { getPosts, savePosts };
