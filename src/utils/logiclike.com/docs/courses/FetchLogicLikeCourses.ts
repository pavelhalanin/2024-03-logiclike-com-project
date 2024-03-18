import axios from 'axios';

export default async function FetchLogicLikeCourses() {
  try {
    const URL = 'https://logiclike.com/docs/courses.json';
    const response = await axios.get(URL);
    if (response.status === 200) {
      return response.data;
    }
  } catch (exception: any) {
    if (exception.response) {
      throw new Error('' + exception.response.status);
    }

    throw new Error('' + exception);
  }
}
