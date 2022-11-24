import { CONVENTIONAL, IMPERIAL } from './globals'
import {
  calculateFocalLength,
  calculateHorizontalFieldOfView,
  calculatePpf,
  calculateAspectRatio,
  calculateVerticalFieldOfView,
  calculateVerticalAngleOfView,
  calculateDistanceToTarget
} from './calculations'
import { parseResolutions } from './common'
import * as turf from '@turf/turf';

export const coreCameraProps = {
  notes: '',
  imagerSize: 4.8,
  distance: 100,
  horizontalAngleOfView: 80,
  imagerCount: 1,
  horizontalResolution: 1920,
  verticalResolution: 1080,
  cameraHeight: 10,
  sceneHeight: 10,
  tilt: 0.00,
  fovMode: CONVENTIONAL,
  unitOfMeasurement: IMPERIAL,
  heading: 90,
  backgroundPosition: { backgroundPositionX: -229, backgroundPositionY: -30 },
  sceneName: 'Intersection',
  streetViewActive: false,
  userUploadedSceneActive: false,
  userSelectedGeneralScene: false,
  location: {},
  displayIrLine: true,
  ppfNightMode: 'infrared',
  userSelectedPpfNightMode: false,
  color: 'blue'
}

/** Initial camera props that need to be calculated */
export function calculatedCameraProps(camera) {
  const { imagerSize, distance, horizontalAngleOfView, model, tilt } = camera
  const horizontalResolution = model ? parseResolutions(model.resolution).horizontal : camera.horizontalResolution
  const verticalResolution = model ? parseResolutions(model.resolution).vertical : camera.verticalResolution

  const distanceToTarget = calculateDistanceToTarget({ distance, tilt })
  const horizontalFieldOfView = calculateHorizontalFieldOfView({ horizontalAngleOfView, distance: distanceToTarget })
  const aspectRatio = calculateAspectRatio({ horizontalResolution, verticalResolution })

  return {
    ...camera,
    focalLength: calculateFocalLength({ imagerSize, horizontalAngleOfView }),
    ppf: calculatePpf({ horizontalResolution, horizontalFieldOfView, model, distance: distanceToTarget }),
    aspectRatio: calculateAspectRatio({ horizontalResolution, verticalResolution }),
    verticalFieldOfView: calculateVerticalFieldOfView({ aspectRatio, horizontalFieldOfView }),
    verticalAngleOfView: calculateVerticalAngleOfView({ aspectRatio, horizontalAngleOfView }),
    distanceToTarget,
    horizontalFieldOfView,
    horizontalResolution,
    verticalResolution
  }
}

/** Used in tests and to initialize a camera */
export function initialCameraProps(id = 1) {
  return {
    ...calculatedCameraProps({ ...coreCameraProps }),
    active: true,
    name: `Camera ${id}`,
    locked: false,
    id
  }
}

/**get Radian Value from Dec  */
export const toRad = (value) => {
  return (value * Math.PI) / 180;
};

/** get Decimal Value from Radian */
export const toDeg = (value) => {
  return (value * 180) / Math.PI;
};

export const getTargetPoint = (point, brng, distance) => {
  if (!point) return;
  // const EarthRadiusMeters = 6378137.0; // meters
  // var R = EarthRadiusMeters; // earth's mean radius in meters
  const R = 6378137.0; // meters
  var lat1 = toRad(point.lat), lon1 = toRad(point.lng);
  var lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
    Math.cos(lat1) * Math.sin(distance / R) * Math.cos(toRad(brng))
  );
  var lon2 = lon1 + Math.atan2(
    Math.sin(toRad(brng)) * Math.sin(distance / R) * Math.cos(lat1),
    Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
  );
  var desPoint = { lat: toDeg(lat2), lng: toDeg(lon2) };
  return desPoint;
};

/** get angle from centerPoint to the other points */
export const bearing = (mainLatLng, otherLatLng) => {
  var from = mainLatLng;
  var to = otherLatLng;
  if (from === to) {
    return 0;
  }
  var lat1 = toRad(from.lat);
  var lon1 = toRad(from.lng);
  var lat2 = toRad(to.lat);
  var lon2 = toRad(to.lng);
  var angle = -Math.atan2(
    Math.sin(lon1 - lon2) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
  );
  if (angle < 0.0) angle += Math.PI * 2.0;
  if (angle > Math.PI) angle -= Math.PI * 2.0;
  return parseFloat(Math.round(toDeg(angle) * 100) / 100);
};

export const getPositiveAngle = (mainLatLng, otherLatLng) => {
  let angle = bearing(mainLatLng, otherLatLng);
  if (angle <= 0) {
    angle += 360;
  }
  return angle;
};

/** get distance between to points */
export const getDistance = (p1, p2) => {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = toRad(p2.lat - p1.lat);
  var dLng = toRad(p2.lng - p1.lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(p1.lat)) *
    Math.cos(toRad(p2.lat)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

export const getPathDistance = path => {
  let d = 0;
  if (Array.isArray(path)) {
    for (let p = 1; p < path.length; p++) {
      d += getDistance(path[p - 1], path[p]);
    }
  }
  return d;
}

//viewpointstart
export const circlePath = (cx, cy, r) => {
  return (
    "M " +
    cx +
    " " +
    cy +
    " m -" +
    r +
    ", 0 a " +
    r +
    "," +
    r +
    " 0 1,0 " +
    r * 2 +
    ",0 a " +
    r +
    "," +
    r +
    " 0 1,0 -" +
    r * 2 +
    ",0"
  );
};

export const getAngle = (a1, a2) => {
  a1 = a1 > 0 ? a1 : 360 + a1;
  a2 = a2 > 0 ? a2 : 360 + a2;
  var angle = Math.abs(a1 - a2) + 180;
  if (angle > 180) {
    angle = 360 - angle;
  }
  return Math.abs(angle);
};

export const getPolygonIntersect = (path1, path2) => {
  const poly1 = turf.polygon([latlngToTurf(path1)]);
  const poly2 = turf.polygon([latlngToTurf(path2)]);
  const intersect = turf.intersect(poly1, poly2);
  return intersect ? turfToLatlng(intersect.geometry.coordinates) : path1;
}

export const getPolygonDifference = (path1, path2) => {
  const poly1 = turf.polygon([latlngToTurf(path1)]);
  const poly2 = turf.polygon([latlngToTurf(path2)]);
  const difference = turf.difference(poly1, poly2);
  return difference ? turfToLatlng(difference.geometry.coordinates) : path1;
}

export const getZoneByDistance = (data, distance1, distance2, eyesight) => {
  let path = [];
  let points = getArcPoints(data, data.rotation - data.angle / 2, data.rotation + data.angle / 2, Math.min(distance1, data.distance));
  for (let p = 1; p < points.length; p++) {
    path[path.length] = points[p];
  }
  points = getArcPoints(data, data.rotation - data.angle / 2, data.rotation + data.angle / 2, Math.min(distance2, data.distance));
  for (let p = points.length - 1; p > 0; p--) {
    path[path.length] = points[p];
  }
  return getPolygonIntersect(path, eyesight);
}

export const getArcPoints = (center, initialBearing, finalBearing, radius) => {
  var points = 128;//64;
  var extendedPoints = [center];

  if (initialBearing > finalBearing) finalBearing += 360;
  var deltaBearing = finalBearing - initialBearing;
  deltaBearing = deltaBearing / points;
  for (var i = 0; i < points + 1; i++) {
    extendedPoints.push(getTargetPoint(center, initialBearing + i * deltaBearing, radius));
    // bounds.extend(extendedPoints[extendedPoints.length - 1]);
  }
  return extendedPoints;
};

export const getIntersection = (ray, segment) => {

  // RAY in parametric: Point + Delta*T1
  var r_px = ray.a.x;
  var r_py = ray.a.y;
  var r_dx = ray.b.x - ray.a.x;
  var r_dy = ray.b.y - ray.a.y;

  // SEGMENT in parametric: Point + Delta*T2
  var s_px = segment.a.x;
  var s_py = segment.a.y;
  var s_dx = segment.b.x - segment.a.x;
  var s_dy = segment.b.y - segment.a.y;

  // Are they parallel? If so, no intersect
  var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
  var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
  if (r_dx / r_mag === s_dx / s_mag && r_dy / r_mag === s_dy / s_mag) {
    // Unit vectors are the same.
    return null;
  }

  // SOLVE FOR T1 & T2
  // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
  // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
  // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
  // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
  var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
  var T1 = (s_px + s_dx * T2 - r_px) / r_dx;

  // Must be within parametic whatevers for RAY/SEGMENT
  if (T1 < 0) return null;
  if (T2 < 0 || T2 > 1) return null;

  // Return the POINT OF INTERSECTION
  return {
    lng: r_px + r_dx * T1,
    lat: r_py + r_dy * T1,
    param: T1
  };

}

export const getSegments = (path) => {
  let segments = [];
  for (let p = 1; p < path.length; p++) {
    segments.push({
      a: { x: path[p - 1].lng, y: path[p - 1].lat },
      b: { x: path[p].lng, y: path[p].lat }
    })
  }
  return segments;
}

export const getEyesightPoints = (pivot, segments) => {
  // Get all unique points
  var points = (function (segments) {
    var a = [];
    segments.forEach(function (seg) {
      a.push(seg.a, seg.b);
    });
    return a;
  })(segments);
  var uniquePoints = (function (points) {
    var set = {};
    return points.filter(function (p) {
      var key = p.x + "," + p.y;
      if (key in set) {
        return false;
      } else {
        set[key] = true;
        return true;
      }
    });
  })(points);

  // Get all angles
  var uniqueAngles = [];
  for (let j = 0; j < uniquePoints.length; j++) {
    var uniquePoint = uniquePoints[j];
    let angle = Math.atan2(uniquePoint.y - pivot.lat, uniquePoint.x - pivot.lng);
    uniquePoint.angle = angle;
    uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
  }

  // RAYS IN ALL DIRECTIONS
  var intersects = [];
  for (let j = 0; j < uniqueAngles.length; j++) {
    let angle = uniqueAngles[j];

    // Calculate dx & dy from angle
    var dx = Math.cos(angle);
    var dy = Math.sin(angle);

    // Ray from center of screen to pivot
    var ray = {
      a: { x: pivot.lng, y: pivot.lat },
      b: { x: pivot.lng + dx, y: pivot.lat + dy }
    };

    // Find CLOSEST intersection
    var closestIntersect = null;
    for (var i = 0; i < segments.length; i++) {
      var intersect = getIntersection(ray, segments[i]);
      if (!intersect) continue;
      if (!closestIntersect || intersect.param < closestIntersect.param) {
        closestIntersect = intersect;
      }
    }

    // Intersect angle
    if (!closestIntersect) continue;
    closestIntersect.angle = angle;

    // Add to list of intersects
    intersects.push(closestIntersect);
  }

  // Sort intersects by angle
  intersects = intersects.sort(function (a, b) {
    return a.angle - b.angle;
  });

  return intersects;
}

export const turfToLatlng = (turfPoints) => {
  let temp = [];
  for (let t = 0; t < turfPoints.length; t++) {
    temp[t] = [];
    for (let p of turfPoints.length === 1 ? turfPoints[t] : turfPoints[t][0]) {
      temp[t].push({ lat: p[1], lng: p[0] });
    }
  }
  return temp;
}

export const latlngToTurf = (latlngPoints) => {
  let temp = [];
  for (let p of latlngPoints) {
    temp.push([p.lng, p.lat]);
  }
  temp.push([latlngPoints[0].lng, latlngPoints[0].lat]);
  return temp;
}