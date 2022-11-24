import {
  calculateSceneHeight,
  calculateTilt,
  checkForInfinityOrNaN
} from './calculations';

/** Helpers specific to custom validation behaviour extracted out of the validator */
export function tiltHandler(context) {
  const sceneHeight = calculateSceneHeight({
    tilt: context.value,
    cameraHeight: context.cameraHeight,
    distance: context.distance
  })

  if (sceneHeight < 0) {
    const maxTilt = calculateTilt({
      distance: context.distance,
      cameraHeight: context.cameraHeight,
      sceneHeight: 0
    })
    let displayTilt = maxTilt - context.angle / 2.0
    displayTilt = checkForInfinityOrNaN(displayTilt) ? '0' : displayTilt.toFixed(2)

    throw new ValidationError(`Max allowed tilt is ${displayTilt} at this camera height and distance`)
  }
}



export class ValidationError extends Error {
  constructor(msg) {
    super(msg)
    this.name = 'ValidationError'
  }
}

export default (function() {
  function _invalidInputCheck(val, validateGreaterThanZero) {
    if (val === '-' && !validateGreaterThanZero) {
      return val
    } else if (RegExp(/^[0][.]?\d*$/).test(val) || val === '') {
      return val
    } else if (!parseFloat(val) || !RegExp(/^[-]?[0-9]*[.{1}]?[0-9]*$/).test(val)) {
      throw new ValidationError('Invalid input')
    } else if (val < 0 && validateGreaterThanZero) {
      throw new ValidationError('Input must be greater than zero')
    } else {
      return val
    }
  }

  function _handleTrailingPeriod(val) {
    if (val.slice(-1) === '.') {
      return {
        presentation: val,
        internal: Number(parseFloat(val).toFixed(1))
      }
    } else {
      return { presentation: val, internal: parseFloat(val) }
    }
  }

  function _generalSharedValidations(val, validateGreaterThanZero = false) {
    if (typeof val !== 'string') throw new ValidationError('Argument must be a string')
    const validatedValues = _invalidInputCheck(val, validateGreaterThanZero)
    return _handleTrailingPeriod(validatedValues)
  }

  return {
    validate(val) {
      return _generalSharedValidations(val)
    },
    validateGreaterThanZero(val) {
      return _generalSharedValidations(val, true)
    },
    validateRange({ value, base, ceiling, allowed, options }) {
      const validatedValues = _generalSharedValidations(value)
      if (value < base) { throw new ValidationError(`Must be greater than ${base}`) }
      if (allowed && allowed.includes(parseFloat(value))) return validatedValues
      if (value > ceiling) throw new ValidationError(`Must be less than ${ceiling}`)
      if (options) tiltHandler(options)
      return validatedValues
    }
  }
})()
