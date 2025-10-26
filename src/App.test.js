import { storiesReducer } from './App'; // Adjust path if reducer is in a separate file
import axios from 'axios';

// Mock Axios
jest.mock('axios');
const mockedAxios = axios;

// Mock stories data
const mockStories = [
  {
    objectID: '1',
    title: 'Test Story 1',
    url: 'https://example.com/1',
    author: 'Author 1',
    num_comments: 5,
    points: 10,
    created_at: '2023-10-23',
  },
  {
    objectID: '2',
    title: 'Test Story 2',
    url: 'https://example.com/2',
    author: 'Author 2',
    num_comments: 3,
    points: 8,
    created_at: '2023-10-23',
  },
];

describe('App Reducer', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  test('sets loading state on STORY_FETCH_INIT', () => {
    const initialState = { data: [], isLoading: false, isError: false };
    const action = { type: 'STORY_FETCH_INIT' };
    const newState = storiesReducer(initialState, action);
    expect(newState).toEqual({ data: [], isLoading: true, isError: false });
  });

  test('sets stories on STORY_FETCH_SUCCESS', () => {
    const initialState = { data: [], isLoading: true, isError: false };
    const action = { type: 'STORY_FETCH_SUCCESS', payload: mockStories };
    const newState = storiesReducer(initialState, action);
    expect(newState).toEqual({ data: mockStories, isLoading: false, isError: false });
  });

  test('sets error state on STORY_FETCH_FAILURE', () => {
    const initialState = { data: [], isLoading: true, isError: false };
    const action = { type: 'STORY_FETCH_FAILURE' };
    const newState = storiesReducer(initialState, action);
    expect(newState).toEqual({ data: [], isLoading: false, isError: true });
  });

  test('removes a story on REMOVE_STORY', () => {
    const initialState = { data: mockStories, isLoading: false, isError: false };
    const action = { type: 'REMOVE_STORY', payload: '1' };
    const newState = storiesReducer(initialState, action);
    expect(newState.data).toEqual([mockStories[1]]);
  });
});