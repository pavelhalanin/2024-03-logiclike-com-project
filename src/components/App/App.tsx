import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RootStoreDto } from '../../store';
import { LogicLikeTypes } from '../../types/logiclike.com/logiclikeReducer';
import FetchLogicLikeCourses from '../../utils/logiclike.com/docs/courses/FetchLogicLikeCourses';
import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { LogicLikeCoursesDto } from '../../types/logiclike.com/LogicLikeCourses';

export default function App() {
  const dispatch = useDispatch();
  const courses = useSelector(
    (state: RootStoreDto) => state.logiclikeReducer.courses,
  );
  const [courcesInPage, setCourcesInPage] = useState<LogicLikeCoursesDto[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>('all');

  useEffect(() => {
    (async function () {
      await fetchCourses();
    })();
  }, []);

  useEffect(() => {
    setCourcesInPage(courses.data);
    let topicSet = new Set<string>();
    courses.data.forEach(element => {
      element.tags.forEach(tag => {
        topicSet.add(tag);
      });
    });

    const arrayTags = Array.from(topicSet);
    setTopics(arrayTags);
  }, [courses]);

  useEffect(() => {
    if (currentTopic === 'all') {
      setCourcesInPage(courses.data);
      return;
    }

    const sortedCourses = courses.data.filter(course => {
      const tags = course.tags;
      for (let i = 0; i < tags.length; ++i) {
        const currentTag = tags[i];
        if (currentTag === currentTopic) {
          return true;
        }
      }
    });
    setCourcesInPage(sortedCourses);
  }, [currentTopic]);

  async function fetchCourses() {
    try {
      dispatch({ type: LogicLikeTypes.FETCH_LOGICLIKE_COURSES });
      const json = await FetchLogicLikeCourses();
      dispatch({
        type: LogicLikeTypes.FETCH_LOGICLIKE_COURSES_SUCCESS,
        payload: json,
      });
    } catch (exception) {
      dispatch({
        type: LogicLikeTypes.FETCH_LOGICLIKE_COURSES_ERROR,
        payload: '' + exception,
      });
    }
  }

  if (courses.error) {
    return (
      <div>
        <pre>{courses.error}</pre>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__block1}>
        <ul className={styles.tags}>
          <li
            custom-attr-selected={currentTopic === 'all' ? '1' : '0'}
            onClick={() => setCurrentTopic('all')}>
            Все темы
          </li>
          {topics.map(tag => {
            return (
              <li
                key={tag}
                onClick={() => setCurrentTopic(tag)}
                custom-attr-selected={currentTopic === tag ? '1' : '0'}>
                {tag}
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.wrapper__block2}>
        <ul className={styles.cards}>
          {courcesInPage.map(e => {
            return (
              <li key={e.id}>
                <div
                  className={styles.card__image_block}
                  style={{ backgroundColor: e.bgColor }}>
                  <img src={e.image} alt="" />
                </div>
                <div className={styles.card__image_text}>{e.name}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
