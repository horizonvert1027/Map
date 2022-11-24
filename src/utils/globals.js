/** Keep track of display value when the calculator is in metric units */
export const METRIC = 'Metric'

/** Keep track of display value when the calculator is in imperial units */
export const IMPERIAL = 'Imperial'

/** Keep track of display value when the calculator is in conventional mode */
export const CONVENTIONAL = 'Conventional'

/** Keep track of display value when the calculator is in corridor mode */
export const CORRIDOR = 'Corridor'

/** Used to loop over and create inupts/check values */
export const FOV_MODES = [CONVENTIONAL, CORRIDOR]

/** Maximum horizontal angle of view */
export const MAXIMUM_HORIZONTAL_ANGLE_OF_VIEW = 179

/** FoV Preview height and width (always 4:3) */
export const FOV_PREVIEW_HEIGHT = 314
export const FOV_PREVIEW_WIDTH = 419

/** Breakpoint for displaying mobile calculator */
export const MOBILE_BREAKPOINT_WIDTH = 800

/** Used to hydrate the values for the unit of ruler select component */
export const UNIT_OF_MEASUREMENT_OPTIONS = [
  { text: IMPERIAL, value: IMPERIAL },
  { text: METRIC, value: METRIC }
]

/** Imager sizes used to fill out the UI dropdown */
export const IMAGER_SIZES = [
  { text: '1/4"', value: 3.6 },
  { text: '1/3.6"', value: 4 },
  { text: '1/3.2"', value: 4.54 },
  { text: '1/3"', value: 4.80 },
  { text: '1/2.8"', value: 6.46 },
  { text: '1/2.7"', value: 5.37 },
  { text: '1/2.5"', value: 5.76 },
  { text: '1/2.3"', value: 6.44 },
  { text: '1/2"', value: 6.4 },
  { text: '1/1.8"', value: 7.18 },
  { text: '2/3"', value: 8.80 },
  { text: '1"', value: 12.80 },
  { text: '1.1"', value: 14.10 },
  { text: '35mm', value: 35.9 }
]

/** Resolutions used to fill out the UI dropdown */
export const RESOLUTIONS = [
  { text: 'QVGA', value: '320 x 240' },
  { text: 'VGA', value: '640 x 480' },
  { text: 'SVGA', value: '800 x 600' },
  { text: '720p', value: '1280 x 720' },
  { text: '1.3MP', value: '1280 x 1024' },
  { text: '2MP', value: '1600 x 1200' },
  { text: '1080p', value: '1920 x 1080' },
  { text: '3MP', value: '2048 x 1536' },
  { text: '4MP', value: '2688 x 1520' },
  { text: '5MP', value: '2592 x 1944' },
  { text: '6MP', value: '3072 x 2048' },
  { text: '4K', value: '3840 x 2160' },
  { text: '10MP', value: '3648 x 2752' },
  { text: '12MP', value: '4000 x 3000' },
  { text: '16MP', value: '4608 x 3456' },
  { text: '20MP', value: '5472 x 3648' },
  { text: '6K', value: '6016 x 4008' },
  { text: '7K', value: '7360 x 4128' },
  { text: '8K', value: '7680 x 4320' }
]

/** View choices used to fill out the UI dropdown */
export const VIEW_CHOICES = [
  { text: 'All Cameras', value: 'All Cameras' },
  { text: 'Selected Camera', value: 'Selected Camera' },
  { text: 'None', value: 'None' }
]

/** Values that need their units changed when unit of ruler changes */
export const UNIT_OF_MEASUREMENT_DEPENDENTS = ['distance', 'fieldOfView', 'cameraHeight', 'sceneHeight']

/** Max number of recently used models to store */
export const MAX_RECENT_MODELS = 100

/** Max number of recently used models to display */
export const RECENT_DISPLAY_COUNT = 15

// MAP

/** Colors used on the map */
export const green = '#4CE91C'
export const blue = '#428bca'

export const CAMERA_COLORS = {
  blue: '#a6cee3',
  green: '#b2df8a',
  red: '#fb9a99',
  orange: '#fdbf6f',
  purple: '#cab2d6',
  grey: '#696969'
}

export const CAMERA_SELECTED_COLORS = {
  blue: '#1f78b4',
  green: '#33a02c',
  red: '#e31a1c',
  orange: '#ff7f00',
  purple: '#6a3d9a',
  grey: '#000000'
}

export const CAMERA_SELECTED_RGB_COLORS = {
  blue: '31, 120, 180',
  green: '51, 160, 44',
  red: '227, 26, 28',
  orange: '255, 127, 0',
  purple: '106, 61, 154',
  grey: '0, 0, 0'
}

export const CAMERA_SELECTED_FULL_RGB_COLORS = {
  blue: { r: 31, g: 120, b: 180 },
  green: { r: 51, g: 160, b: 44 },
  red: { r: 227, g: 26, b: 28 },
  orange: { r: 255, g: 127, b: 0 },
  purple: { r: 106, g: 61, b: 154 },
  grey: { r: 0, g: 0, b: 0 }
}

export const SELECTED_COLORS = [
  '#1f78b4',
  '#33a02c',
  '#e31a1c',
  '#ff7f00',
  '#6a3d9a',
  '#ffc107',
  '#000000',
  '#9e9e9e',
  '#ffffff'
]

/** Map types **/
export const ROADMAP = 'roadmap'
export const SATELLITE = 'satellite'
export const BLANK = 'blank'
export const defaultZoom = 18

// API urls

/** Used when initializing projects */
export const basicAuthCredentials = 'calculator/basic_auth_credentials'

/** Userd for retrieving current information from logged in user */
export const currentUser = 'get_current_user'

/** Used to determine unit preference based on geolocation */
export const unitPreference = 'unit_preference'

/** Used for retrieving fov uploads of current user */
export const fovUploads = 'fov_uploads?v3=true'

/** Used for creating a fov upload */
export const deleteFovUploadPath = id => `fov_uploads/${id}?v3=true`

/** Used for creating a fov upload */
export const createFovUploadPath = 'fov_uploads?v3=true'

/** Used for creating new Floor Plans */
export const createFloorPlanPath = 'floor_plan_uploads'

// PPF PREVIEW
export const POSSIBLE_PPFS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20,
  22, 25, 28, 30, 32, 35, 38, 40, 45, 50, 55,
  60, 65, 70, 75, 80, 90, 100, 110, 130, 150, 200]

// Defaults for drawing mode
export const DEFAULT_SHAPE_OPTIONS = {
  editable: false,
  strokeColor: '#000',
  fillColor: '#fff',
  rotateControl: true,
  fillOpacity: 0.75,
  draggable: true,
  zIndex: 102,
  isLocked: false,
  strokeWeight: 3
}

export const DEFAULT_WALL_OPTIONS = {
  ...DEFAULT_SHAPE_OPTIONS,
  strokeColor: '#ff7f00',
  strokeWeight: 4.5,
  zIndex: 106
}

export const INNER_WALL_OPTIONS = {
  clickable: false,
  draggable: false,
  editable: false,
  strokeColor: '#ff7f00',
  strokeWeight: 2.5,
  zIndex: 107
}

export const WALL_SNAP_ICON = {
  strokeWeight: 2.6,
  strokeColor: '#ff7f00',
  scale: 6,
  fillColor: '#ff7f00',
  fillOpacity: 0.55
}

export const DEFAULT_LABEL_ZOOM = 20

//ensure these are sorted
export const DEFAULT_LABEL_SIZES = [0.25, 0.5, 1, 2, 3].sort()

export const DEFAULT_LABEL_MARKS = {
  1: { style: { fontSize: '14px', lineHeight: '28px' }, label: 'Aa' },
  2: '',
  3: '',
  4: '',
  5: { style: { fontSize: '20px', lineHeight: '28px' }, label: 'Aa' }
}

export const DEFAULT_LABEL_DIMENSIONS = {
  baseWidth: 90,
  baseHeight: 23,
  baseFontSize: 1
}

export const DOWNTILT_PREVIEW_DIMENSIONS = {
  height: 180,
  width: 320,
  cameraIconHeight: 14,
  // height - 1/2 camera icon height
  maxCameraIconHeight: 180 - 7
}

export const UNIT_KEY = 'IPVMCALC-unitOfMeasurement'

export const COLORS = {
  primary: '#428bca',
  primaryHover: '#347dbc',
  secondary: '#606c76',
  tertiary: '#f4f5f6',
  quaternary: '#d1d1d1',
  quaternaryHover: '#bcbcbc',
  gold: '#ffd700',
  warning: '#ffcc00',
  ok: '#6cc644',
  danger: 'red',
  green: '#009e25'
}

export const EXPORT_STATUS_HEIGHT = 36

export const ANALYTIC_ZONE_OPACITIES = [0.90, 0.60, 0.40, 0.20]



// WEBPACK FOOTER //
// ./src/helpers/globals.js