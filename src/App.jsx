import { useReducer } from 'react'
import './App.css'
import Digits from './Digits'
import OperationBtn from './OperationBtn'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  DEL_DIGIT: 'delete-digit',
  AC: 'ac',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }

      if (payload.digit == '0' && state.currentOperand == '0') return state

      if (payload.digit == '.' && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: `0${payload.digit}`,
        }
      }

      if (payload.digit == '.' && state.currentOperand.includes('.'))
        return state

      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          currentOperand: null,
          previousOperand: state.currentOperand,
          operation: payload.operation,
        }
      }

      return {
        ...state,
        currentOperand: null,
        previousOperand: evaluate(state),
        operation: payload.operation,
      }

    case ACTIONS.AC:
      return {}

    case ACTIONS.DEL_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }

      if (state.currentOperand == null) return state

      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: null }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }

    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      )
        return state

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null,
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ''
  let result = ''
  switch (operation) {
    case '÷':
      result = prev / current
      break
    case '×':
      result = prev * current
      break
    case '+':
      result = prev + current
      break
    case '-':
      result = prev - current
      break
  }

  return result.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {},
  )

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.AC })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DEL_DIGIT })}>DEL</button>
      <OperationBtn dispatch={dispatch} operation="÷" />
      <Digits dispatch={dispatch} digit="1" />
      <Digits dispatch={dispatch} digit="2" />
      <Digits dispatch={dispatch} digit="3" />
      <OperationBtn dispatch={dispatch} operation="×" />
      <Digits dispatch={dispatch} digit="4" />
      <Digits dispatch={dispatch} digit="5" />
      <Digits dispatch={dispatch} digit="6" />
      <OperationBtn dispatch={dispatch} operation="+" />
      <Digits dispatch={dispatch} digit="7" />
      <Digits dispatch={dispatch} digit="8" />
      <Digits dispatch={dispatch} digit="9" />
      <OperationBtn dispatch={dispatch} operation="-" />
      <Digits dispatch={dispatch} digit="." />
      <Digits dispatch={dispatch} digit="0" />
      <button
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        className="span-two"
      >
        =
      </button>
    </div>
  )
}

export default App
