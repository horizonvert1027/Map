// import { convertUnitToMap } from './common';

// export function determineLocationOfNewCameras({ map, cameras }) {
//   const mapCenter = map.getBounds().getCenter()
//   const camera = cameras.find(c => {
//     const location = new window.google.maps.LatLng(c.location)
//     return location.lng() === mapCenter.lng() && location.lng() === mapCenter.lng()
//   })

//   if (!camera) return mapCenter.toJSON()

//   const location = window.google.maps.geometry.spherical.computeOffset(new window.google.maps.LatLng(camera.location), convertUnitToMap({ value: camera.distance, camera }) + 20, 90)
//   map.setCenter(location)
//   return location.toJSON()
// }

// export function getAddressFromLocation(location) {
//   return new Promise(function (resolve) {
//     const geocoder = new window.google.maps.Geocoder()
//     geocoder.geocode({ 'location': location }, function (results, status) {
//       if (status === 'OK' && results[0]) resolve(results[0].formatted_address)
//       else resolve(null)
//     })
//   })
// }

// export function clearMapComponents({ map, cameras }) {
//   const { floorPlans, markups } = map;

//   [cameras, floorPlans, markups].forEach(type => {
//     type.forEach(c => c.remove && c.remove())
//   })
// }

// export function setMapBounds(cameras) {
//   let arrLats = [];
//   let aaa = [];
//   cameras.map(camera => {
//     for (let i = 0; i < camera.markers.length; i++) {
//       arrLats.push({ lat: camera.markers[i].lat, lng: camera.markers[i].lng });
//     }
//     return false;
//   })
//   let maxLat = Math.max.apply(Math, arrLats.map(function (o) { return o.lat; }));
//   let maxLng = Math.max.apply(Math, arrLats.map(function (o) { return o.lng; }));
//   let minLat = Math.min.apply(Math, arrLats.map(function (o) { return o.lat; }));
//   let minLng = Math.min.apply(Math, arrLats.map(function (o) { return o.lng; }));
//   aaa.push(new window.google.maps.LatLng(minLat - 0.0005, minLng - 0.0005))
//   aaa.push(new window.google.maps.LatLng(maxLat + 0.0005, maxLng + 0.0005))

//   return aaa;
// }


export const getSouthWest = (bounds) => {
  return new window.google.maps.LatLng(bounds.south, bounds.west);
}
export const getNorthEast = (bounds) => {
  return new window.google.maps.LatLng(bounds.north, bounds.east);
}
export const json2Bounds = json => {
  return new window.google.maps.LatLngBounds(
    new window.google.maps.LatLng(json.sw),
    new window.google.maps.LatLng(json.ne),
  );
}
export const bounds2Json = bounds => {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return { ne: { lat: ne.lat(), lng: ne.lng() }, sw: { lat: sw.lat(), lng: sw.lng() } }
};

export const latLng2Point = (latLng, map) => {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());

  var scale = Math.pow(2, map.getZoom());
  var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
  return new window.google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
}

export const point2LatLng = (point, map) => {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new window.google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}

// export const featuresToLatlng = (features) => {
//   let temp = [];
//   for (let f of features) {
//     temp.push({ lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] });
//   }
//   return temp;
// }