import { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

const TodoContext = createContext(undefined);

// Initial state
const initialState = {
  tasks: [
    {
      id: 1,
      title: "Mathematics Study Session",
      description: "Algebra and Calculus Review",
      status: "active",
      startTime: "09:00",
      endTime: "11:00",
      date: new Date(),
      color: "hsl(221, 83%, 53%)",
      icon: "📚",
      progress: 45,
      timeSpent: 2700, // 45 minutes in seconds
      totalTime: 7200, // 2 hours in seconds
      userId: "1",
      category: "Math",
      priority: "high",
      completedAt: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Physics Assignment",
      description: "Complete chapter 5 problems",
      status: "upcoming",
      startTime: "14:00",
      endTime: "16:00",
      date: new Date(),
      color: "hsl(142, 71%, 45%)",
      icon: "⚡",
      progress: 0,
      timeSpent: 0,
      totalTime: 7200,
      userId: "1",
      category: "Physics",
      priority: "medium",
      completedAt: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "History Essay",
      description: "World War II research paper",
      status: "completed",
      startTime: "10:00",
      endTime: "12:00",
      date: new Date(Date.now() - 86400000),
      color: "hsl(262, 83%, 58%)",
      icon: "📝",
      progress: 100,
      timeSpent: 7200,
      totalTime: 7200,
      userId: "1",
      category: "History",
      priority: "high",
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  users: [
    {
      id: "1",
      name: "Demo User",
      email: "demo@studyplanner.com",
      totalTasksCompleted: 15,
      totalTimeSpent: 108000, // 30 hours
      weeklyStats: {
        tasksCompleted: 5,
        timeSpent: 18000 // 5 hours
      },
      monthlyStats: {
        tasksCompleted: 12,
        timeSpent: 43200 // 12 hours
      }
    }
  ],
  loading: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  START_TASK: 'START_TASK',
  COMPLETE_TASK: 'COMPLETE_TASK',
  UPDATE_TASK_PROGRESS: 'UPDATE_TASK_PROGRESS',
  UPDATE_USER_STATS: 'UPDATE_USER_STATS'
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case actionTypes.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: false
      };

    case actionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };

    case actionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };

    case actionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case actionTypes.START_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, status: 'active' } : task
        )
      };

    case actionTypes.COMPLETE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? {
                ...task,
                status: 'completed',
                progress: 100,
                completedAt: new Date().toISOString()
              }
            : task
        )
      };

    case actionTypes.UPDATE_TASK_PROGRESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? {
                ...task,
                progress: action.payload.progress,
                timeSpent: action.payload.timeSpent
              }
            : task
        )
      };

    case actionTypes.UPDATE_USER_STATS:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id
            ? { ...user, ...action.payload.stats }
            : user
        )
      };

    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasks = await apiClient.getTasks();
      dispatch({ type: actionTypes.SET_TASKS, payload: tasks });
    } catch (error) {
      setError(error.message);
    }
  };

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      const newTask = await apiClient.createTask(taskData);
      dispatch({ type: actionTypes.ADD_TASK, payload: newTask });
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await apiClient.updateTask(id, updates);
      dispatch({ type: actionTypes.UPDATE_TASK, payload: updatedTask });
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiClient.deleteTask(id);
      dispatch({ type: actionTypes.DELETE_TASK, payload: id });
    } catch (error) {
      setError(error.message);
    }
  };

  const startTask = (id) => {
    dispatch({ type: actionTypes.START_TASK, payload: id });
  };

  const completeTask = (id) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      dispatch({ type: actionTypes.COMPLETE_TASK, payload: { id } });
      
      // Update user stats
      const user = state.users.find(u => u.id === task.userId);
      if (user) {
        const updatedStats = {
          totalTasksCompleted: user.totalTasksCompleted + 1,
          totalTimeSpent: user.totalTimeSpent + task.timeSpent,
          weeklyStats: {
            tasksCompleted: user.weeklyStats.tasksCompleted + 1,
            timeSpent: user.weeklyStats.timeSpent + task.timeSpent
          },
          monthlyStats: {
            tasksCompleted: user.monthlyStats.tasksCompleted + 1,
            timeSpent: user.monthlyStats.timeSpent + task.timeSpent
          }
        };
        dispatch({ 
          type: actionTypes.UPDATE_USER_STATS, 
          payload: { id: user.id, stats: updatedStats } 
        });
      }
    }
  };

  const updateTaskProgress = (id, progress, timeSpent) => {
    dispatch({ 
      type: actionTypes.UPDATE_TASK_PROGRESS, 
      payload: { id, progress, timeSpent } 
    });
  };

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return state.tasks.filter(task => task.status === status);
  };

  // Get tasks by user
  const getTasksByUser = (userId) => {
    return state.tasks.filter(task => task.userId === userId);
  };

  // Get user stats
  const getUserStats = (userId) => {
    return state.users.find(user => user.id === userId);
  };

  // Get completion rate
  const getCompletionRate = (userId) => {
    const userTasks = getTasksByUser(userId);
    const completedTasks = userTasks.filter(task => task.status === 'completed');
    return userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0;
  };

  // Get time spent on similar tasks
  const getTimeSpentOnSimilarTasks = (category) => {
    const similarTasks = state.tasks.filter(task => 
      task.category === category && task.status === 'completed'
    );
    return similarTasks.reduce((total, task) => total + task.timeSpent, 0);
  };

  // Get weekly top performers
  const getWeeklyTopPerformers = () => {
    return state.users
      .slice()
      .sort((a, b) => b.weeklyStats.tasksCompleted - a.weeklyStats.tasksCompleted)
      .slice(0, 5);
  };

  // Get monthly top performers
  const getMonthlyTopPerformers = () => {
    return state.users
      .slice()
      .sort((a, b) => b.monthlyStats.tasksCompleted - a.monthlyStats.tasksCompleted)
      .slice(0, 5);
  };

  const value = {
    // State
    tasks: state.tasks,
    users: state.users,
    loading: state.loading,
    error: state.error,
    
    // Actions
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    updateTaskProgress,
    
    // Getters
    getTasksByStatus,
    getTasksByUser,
    getUserStats,
    getCompletionRate,
    getTimeSpentOnSimilarTasks,
    getWeeklyTopPerformers,
    getMonthlyTopPerformers
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

export { actionTypes };