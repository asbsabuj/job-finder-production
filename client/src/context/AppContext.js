import React, { useReducer, useContext, useEffect } from "react"
import reducer from "./reducer"
import axios from "axios"

import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_ERROR,
  CREATE_JOB_SUCCESS,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOBS,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from "./action"

const AppContext = React.createContext()

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: null,
  userLoading: true,
  userLocation: "",
  showSidebar: false,
  isEditing: false,
  editJodId: "",
  position: "",
  company: "",
  jobLocation: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const authFetch = axios.create({
    baseURL: "/api/v1",
  })

  authFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      console.log(error.response)
      if (error.response.status === 401) {
        logoutUser()
      }
      return Promise.reject(error)
    }
  )

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT })
    clearALert()
  }

  const clearALert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT })
    }, 3000)
  }

  const setUpUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN })
    try {
      const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)

      const { user, location } = data
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      })
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearALert()
  }

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  const logoutUser = async () => {
    await authFetch.get("/auth/logout")
    dispatch({ type: LOGOUT_USER })
  }

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN })
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser)
      const { user, location } = data
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      })
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        })
      }
    }
    clearALert()
  }

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } })
  }

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES })
  }

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN })
    try {
      const { position, company, jobType, jobLocation, status } = state

      await authFetch.post("/jobs", {
        position,
        company,
        jobType,
        jobLocation,
        status,
      })
      dispatch({ type: CREATE_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearALert()
  }

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`

    if (search) {
      url = url + `&search=${search}`
    }
    dispatch({ type: GET_JOBS_BEGIN })
    try {
      const { data } = await authFetch(url)
      const { jobs, totalJobs, numOfPages } = data

      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: { jobs, totalJobs, numOfPages },
      })
    } catch (error) {
      logoutUser()
    }
    clearALert()
  }

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOBS, payload: { id } })
  }

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN })
    try {
      const { position, company, jobType, jobLocation, status } = state

      await authFetch.patch(`/jobs/${state.editJodId}`, {
        position,
        company,
        jobType,
        jobLocation,
        status,
      })
      dispatch({ type: EDIT_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearALert()
  }

  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN })

    try {
      await authFetch.delete(`/jobs/${jobId}`)
      getJobs()
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearALert()
  }

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN })

    try {
      const { data } = await authFetch("/jobs/stats")
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      })
    } catch (error) {
      logoutUser()
    }
    clearALert()
  }

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } })
  }

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN })
    try {
      const { data } = await authFetch("/auth/getCurrentUser")
      const { user, location } = data
      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      })
    } catch (error) {
      if (error.response.status === 401) return
      logoutUser()
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setUpUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }
