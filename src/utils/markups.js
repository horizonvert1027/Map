import { DEFAULT_LABEL_ZOOM, DEFAULT_LABEL_SIZES } from './globals'

export const getLabelSize = zoom => {
  // set the scale based off the current zoom (higher zoom => smaller label)
  const scale = Math.pow(2, DEFAULT_LABEL_ZOOM - zoom)

  // ensure scale is one of our preset values
  if (DEFAULT_LABEL_SIZES.includes(scale)) return scale
  else if (scale < Math.min(...DEFAULT_LABEL_SIZES)) return Math.min(...DEFAULT_LABEL_SIZES)
  else return Math.max(...DEFAULT_LABEL_SIZES)
}

// label has position
export const typeSpecificInfo = ({ overlay, type, zoom }) => {
  switch (type) {
    case 'circle':
      return {
        location: { lat: overlay.center.lat(), lng: overlay.center.lng() },
        radius: overlay.getRadius()
      }
    case 'polygon':
      return {
        location: overlay.getPaths().getArray()[0].getArray().map(l => ({ lat: l.lat(), lng: l.lng() }))
      }
    case 'polyline':
      return {
        location: overlay.getPath().getArray().map(l => ({ lat: l.lat(), lng: l.lng() }))
      }
    case 'wall':
      return {
        location: overlay.getPath().getArray().map(l => ({ lat: l.lat(), lng: l.lng() }))
      }
    case 'rectangle':
      return {
        location: overlay.getBounds().toJSON()
      }
    case 'label':
      return {
        location: { lat: overlay.location.lat(), lng: overlay.location.lng() },
        text: overlay.text,
        dimensions: overlay.dimensions,
        size: getLabelSize(zoom)
      }
    default:  
  }
}
