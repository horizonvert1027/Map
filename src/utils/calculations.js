import { toRadian, toDegree } from "./common"

/**
 * Calculates ppf from horizontal resolution and horizontal field of view.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Object} args.horizontalResolution
 * @param {Number} args.horizontalFieldOfView
 * @return {Number}
 */

export function calculatePpf({ horizontalResolution, horizontalFieldOfView, model, distance }) {
  if (model && model.is_fisheye) {
    horizontalFieldOfView = calculateHorizontalFieldOfView({ horizontalAngleOfView: 180, distance })
  }
  return horizontalResolution / horizontalFieldOfView
}

/**
 * Calculates focal length based on imager size and horizontal angle of view.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Number} args.imagerSize
 * @param {Number} args.horizontalAngleOfView
 * @return {Number}
 */

export function calculateFocalLength({ imagerSize, horizontalAngleOfView }) {
  return imagerSize / (2 * Math.tan(toRadian(horizontalAngleOfView) / 2))
}
/**
 * Calculates horizontal field of view from angle of view, distance, and imager count.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Number} args.angleOfView
 * @param {Number} args.distance
 * @return {Number}
 */

export function calculateHorizontalFieldOfView({ horizontalAngleOfView, distance }) {
  return distance * Math.PI * (horizontalAngleOfView / 180)
}

/**
 * Calculates aspect ratio based on horizontal and vertical resolutions.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Number} args.horizontalResolution
 * @param {Number} args.verticalResolution
 * @return {Number}
 */

export function calculateAspectRatio({ horizontalResolution, verticalResolution }) {
  return horizontalResolution / verticalResolution
}

/**
 * Calculates vertical field of view based on aspect ratio and horizontal field of view.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Number} args.aspectRatio
 * @param {Number} args.horizontalFieldOfView
 * @return {Number}
 */

export function calculateVerticalFieldOfView({ aspectRatio, horizontalFieldOfView }) {
  return horizontalFieldOfView / aspectRatio
}

/**
 * Calculates horizontal angle of view based on distance and horizontal field of view.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Number} args.distance
 * @param {Number} args.horizontalFieldOfView
 * @return {Number}
 */

export function calculateHorizontalAngleOfView({ distance, horizontalFieldOfView }) {
  return toDegree(horizontalFieldOfView / distance)
}

/**
 * Calculates distance to target based on distance and tilt.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Number} args.distance
 * @param {Number} args.tilt
 * @return {Number}
 */

export function calculateDistanceToTarget({ distance, tilt }) {
  return distance / Math.cos(toRadian(tilt))
}

/**
 * Calculates vertical angle of view based on horizontal angle of view and aspect ratio.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Number} args.horizontalAngleOfView
 * @param {Number} args.aspectRatio
 * @return {Number}
 */

export function calculateVerticalAngleOfView({ horizontalAngleOfView, aspectRatio }) {
  const angle = horizontalAngleOfView / aspectRatio
  return isNaN(angle) ? 0 : angle
}

/**
 * Calculates scene height based on distance, tilt, and camera height.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Number} args.distance
 * @param {Number} args.tilt
 * @param {Number} args.cameraHeight
 * @return {Number}
 */

export function calculateSceneHeight({ distance, tilt, cameraHeight }) {
  return Math.tan(toRadian(tilt)) * distance + cameraHeight
}

/**
 * Calculates tilt based on distance, camera height, and scene height.
 * @param {Object} args - Object to be deconstructed which contains arguments.
 * @param {Number} args.distance
 * @param {Number} args.cameraHeight
 * @param {Number} args.sceneHeight
 * @return {Number}
 */

export function calculateTilt({ distance, cameraHeight, sceneHeight }) {
  return toDegree(Math.atan((sceneHeight - cameraHeight) / distance))
}

export function checkForInfinityOrNaN(v) { v === Infinity || isNaN(v) }