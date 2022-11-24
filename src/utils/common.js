// import { toast } from 'react-toastify'
import { CONVENTIONAL, METRIC } from './globals'
import { ValidationError } from './validator'

export function convertUnitToMap({ camera, value }) {
  return value * (camera.unitOfMeasurement === METRIC ? 1 : 0.3048)
}


export function calculatorUpdateHelpers() {
  return true;
}
export const chooseNextProperId = ids => {
  if (ids.length === 0) return 1
  return Math.max.apply(null, ids) + 1
}

export function parseResolutions(resolutions) {
  return {
    horizontal: parseFloat(resolutions.split(/x/i)[0]),
    vertical: parseFloat(resolutions.split(/x/i)[1])
  }
}

/**
 * Converts a degree value to radians.
 * @param {Number} degree - The degree to be converted to radians
 * @return {Number} The degree input in radians.
*/

export function toRadian(degree) {
  return degree * Math.PI / 180
}
/**
 * Converts a radian value to degrees.
 * @param {Number} radian - The radian to be converted to degrees
 * @return {Number} The radian input in degrees.
*/

export function toDegree(radian) {
  return radian * 180 / Math.PI
}

export function fovModeHelper(mode) {
  return mode === CONVENTIONAL ? 'horizontal' : 'vertical'
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const updateJsonById = (json, payload) => {
  let data = [];
  for (let d of json) {
    if (d.id === payload.id) {
      data[data.length] = { ...d, ...payload };
    } else {
      data[data.length] = d;
    }
  }
  return data;
}

export const formatDec = (num, pos = 2) => {
  let d = Math.pow(10, pos);
  let v = Math.round(num * d) / d;
  return isNaN(v) ? 0 : v;
}

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result);
    }
    fileReader.onerror = (error) => {
      reject(error);
    }
  })
}


export default function notifyHoneybadger({ err, action }) {
  // useful for debugging
  if (process.env.NODE_ENV === 'development') console.log('ERROR', `${(err.message || err) + '\n' + err.stack}`)
  if (process.env.NODE_ENV === 'development') {
    // console.log('HB payload: ', {
    //   message: `${action.type === 'EXPAND_PROJECT' ? 'Project did not load - ' : ''}${err.message}`,
    //   context: {
    //     actionType: action.type
    //   }
    // })
    return
  }

  if (!(err instanceof ValidationError)) {
    // toast.error(`${action.type === 'EXPAND_PROJECT' ? 'Project did not load - ' : ''}${err.message}`)

    // Honeybadger.notify(err, {
    //   message: `${action.type === 'EXPAND_PROJECT' ? 'Project did not load - ' : ''}${err.message}`,
    //   context: {
    //     actionType: action.type
    //   }
    // })
  }

  if (!action.skipThrow && !action.skipReport) {
    throw err
  }
}
