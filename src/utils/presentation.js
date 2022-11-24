import { fovModeHelper } from './common'

/**
 * Returns a Map that is used to round presentational values.
 * @return {Map<string, number>}
 */

export function accuracyMap() {
  const accuracyMap = new Map()
  accuracyMap.set('ppf', 1)
  accuracyMap.set('focalLength', 2)
  accuracyMap.set('angleOfView', 0)
  accuracyMap.set('distance', 0)
  accuracyMap.set('fieldOfView', 1)
  accuracyMap.set('cameraHeight', 2)
  accuracyMap.set('sceneHeight', 2)
  accuracyMap.set('tilt', 2)
  return accuracyMap
}

/** Used in tests and to initialize state */
export function initialPresentationValues(camera) {
  const values = {}

  for (let [attrName, accValue] of accuracyMap()) {
    if (attrName === 'angleOfView') {
      values[attrName] = {
        value: camera[`${fovModeHelper(camera.fovMode)}AngleOfView`].toFixed(accValue),
        touched: false
      }
      continue
    }

    if (attrName === 'fieldOfView') {
      values[attrName] = {
        value: camera[`${fovModeHelper(camera.fovMode)}FieldOfView`].toFixed(accValue),
        touched: false
      }
      continue
    }

    values[attrName] = {
      value: camera[attrName].toFixed(accValue),
      touched: false
    }
  }
  return values
}
