import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const HANDLERS = {
  INIT_LOADING: 'INIT_LOADING',
  LOADING_DONE: 'LOADING_DONE',
  LOAD_ERR: 'LOAD_ERR',
  SET_SELECTED_COUNTRY: 'SET_SELECTED_COUNTRY',
  SET_SELECTED_COUNTRY_INDICATOR: 'SET_SELECTED_COUNTRY_INDICATOR',
  CHART_DATA_DONE: 'CHART_DATA_DONE',
  MODE_CHANGED: 'MODE_CHANGED',
}

const initialState = {
  data: null,
  isLoading: true,
  error: null,
  selectedCountry: null,
  selectedCountryIndicator: null,
  chartData: {},
  mode: 'analysis',
}

const handlers = {
  [HANDLERS.INIT_LOADING]: (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    }
  },
  [HANDLERS.LOADING_DONE]: (state, action) => {
    const {data} = action.payload

    return {
      ...state,
      data,
      isLoading: false,
      error: null,
    }
  },
  [HANDLERS.LOAD_ERR]: (state) => {
    return {
      ...state,
      error: true,
      isLoading: false,
    }
  },
  [HANDLERS.SET_SELECTED_COUNTRY]: (state, action) => {
    const selectedCountry = action.payload

    return {
      ...state,
      selectedCountry,
    }
  },
  [HANDLERS.SET_SELECTED_COUNTRY_INDICATOR]: (state, action) => {
    const selectedCountryIndicator = action.payload

    return {
      ...state,
      selectedCountryIndicator,
    }
  },
  [HANDLERS.CHART_DATA_DONE]: (state, action) => {
    const {data} = action.payload

    return {
      ...state,
      chartData: data,
      isLoading: false,
    }
  },
  [HANDLERS.MODE_CHANGED]: (state, action) => {
    const mode = action.payload

    return {
      ...state,
      mode,
    }
  }
}

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state

export const DataContext = createContext({ undefined })

export const DataProvider = (props) => {
  const { children } = props
  const [state, dispatch] = useReducer(reducer, initialState)

  const loadData = async (forced) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (state.data && !forced) {
      return
    }

    dispatch({ type: HANDLERS.INIT_LOADING })

    try {
      const data = await axios.get('http://localhost:5001/api/data')

      dispatch({ type: HANDLERS.LOADING_DONE, payload: data })
    } catch (err) {
      dispatch({ type: HANDLERS.LOAD_ERR })
    }
  }

    const getChartData = async (forced) => {
    dispatch({ type: HANDLERS.INIT_LOADING })

    try {
      const data = await axios.get('http://localhost:5001/api/data/chart', {
        params: {
          country: state.selectedCountry,
          indicator: state.selectedCountryIndicator,
        },
      })

      dispatch({ type: HANDLERS.CHART_DATA_DONE, payload: data })
    } catch (err) {
      dispatch({ type: HANDLERS.LOAD_ERR })
    }
  }

  useEffect(() => {
    loadData().catch(console.error)
  }, [])

  useEffect(()=>{
    if(state.data){
      setSelectedCountry(state.data.countries[0]);
      setSelectedCountryIndicator(state.data.indicator_name[0]);
    }
  }, [state.data])

  useEffect(()=>{
      getChartData().catch(console.error)
  }, [state.selectedCountry, state.selectedCountryIndicator])

  const setSelectedCountry = (country) => {
    dispatch({ type: HANDLERS.SET_SELECTED_COUNTRY, payload: country })
  }

  const setSelectedCountryIndicator = (indicator) => {
    dispatch({ type: HANDLERS.SET_SELECTED_COUNTRY_INDICATOR, payload: indicator })
  }

  const setMode = (mode) => {
    dispatch({ type: HANDLERS.MODE_CHANGED, payload: mode })
  }

  return (
    <DataContext.Provider
      value={{
        ...state,
        loadData,
        setSelectedCountry,
        setSelectedCountryIndicator,
        setMode,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

DataProvider.propTypes = {
  children: PropTypes.node,
}

export const DataConsumer = DataContext.Consumer

export const useDataContext = () => useContext(DataContext)
