export enum tools {
    CREATEDRAWING = 'createDrawing',
    PENCIL = 'pencil',
    PENCIL_SELECT = 'pencilSelect',
    BRUSH = 'brush',
    BRUSH_SELECT = 'brushSelect',
    RECTANGLE = 'rectangle',
    RECTANGLE_SELECT = 'rectangleSelect',
    CIRCLE = 'ellipse',
    POLYGON = 'polygon',
    APPCOLOR = 'colorApplicator',
    APPCOLOR_SELECT = 'colorApplicatorSelect',
    BUCKET = 'paintBucket',
    BUCKET_SELECT = 'bucketSelect',
    AIR_BRUSH = 'airbrush',
    AIR_BRUSH_SELECT = 'airbrushSelect',
    GRID = 'grid',
    GRID_SELECT = 'gridSelect',
    PIPETTE = 'pipette',
    PIPETTE_SELECT = 'pipetteSelect',
    STAMP = 'stamp',
    STAMP_SELECT = 'stampSelect',
    ROTATESTAMP = 'rotateStamp',
    SELECT = 'select',
    SELECT_SELECT = 'selectSelect',
    LINE = 'line',
    LINE_SELECT = 'lineSelect',
    SAVE = 'save',
    DOWNLOAD= 'download',
    USER_GUIDE = 'userGuide',
    ERASER = 'eraser',
    TEXTSELECT= 'textSelect',
    TEXT = 'text',
    EXPORT = 'export',
    PEN= 'pen',
    PEN_SELECT = 'penSelect',
    QUILL = 'quill',
    QUILL_SELECT = 'quillSelect',
  }
export enum MOUSE_CLICK {
  LEFT = 'left',
  RIGHT = 'right',
}
export enum COOKIE {
    COOKIE_ID = '12345',
    CLIENT_ID = 'userid',
}
export enum KEY {
    KEY_O = 'o',
    KEY_X = 'x',
    KEY_V = 'v',
    KEY_D = 'd',
    KEY_Z = 'z',
    KEY_Z_U = 'Z',
    KEY_DEL = 'Delete',
    KEY_C = 'c',
    KEY_W = 'w',
    KEY_P = 'p',
    KEY_Y = 'y',
    KEY_A = 'a',
    KEY_1 = '1',
    KEY_2 = '2',
    KEY_3 = '3',
    KEY_L = 'l',
    KEY_T = 't',
    KEY_R = 'r',
    KEY_B = 'b',
    KEY_E = 'e',
    KEY_I = 'i',
    KEY_S = 's',
    KEY_G = 'g',
    KEY_M = 'm',
    KEY_SPACE = 'Space',
    KEY_PLUS = '+',
    KEY_MINUS = '-',
    KEY_ENTER= 'Enter',
    KEY_BACKSPACE = 'Backspace',
    KEY_ESCAPE = 'Escape',
    KEY_ALT = 'Alt',
  }
export enum DEFAULT_COLORS {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    BACKGROUND = 'background',
    WHITE = '#FFFFFF',
    BLACK = '#000000',
    RED = '#FF0000',
    GREEN = '#00FF00',
    BLUE = '#0000FF',
    YELLOW = '#FFFF00',
    TURQUOISE = '#00FFFF',
    PINK = '#FF00FF',
    GRAY = '#C0C0C0',
    ORANGE = '#F39C12',
}

export enum BASE_COLORS {
  RED = 'rouge',
  GREEN = 'vert',
  BLUE = 'bleu',
}

export enum COLOR_TEST {
  INVALID_COLOR = '#FFF1AZ',
  PALETTE_COLOR = '#123456',
  VALID_TRANS = 27,
  INVALID_TRANS = 200,
  TRANS = '7F',
}
export enum COPYPASTE {
  COPY = 'copy',
  PASTE = 'paste',
  DUPLICATE = 'duplicate',
  DELETE = 'delete',
  COPYPASTE_OFFSET = 5,
}
export enum FILTER {
  CONTROL = 'ctrl',
  BOX = 'box',
  SELECTOR = 'selector',
  FILTER = 'filter',
  PATTERN = 'pattern',
  GRID = 'grid',
  ERASER = 'eraser',
}
export enum SVGSELECT {
  POSITION_OFFSET = 3,
  DIMENSION_OFFSET = 7,
}
export enum POLYGON {
  MAX_SIDES = 12,
  MIN_SIDES = 3,
}
export enum LINE_TYPE {
  DOTTED = 'dotted',
  DASH = 'dash',
  BASE = '',
  ROUND = 'round',
  ANGLE = 'square',
}
export enum ERASER {
  TOOLBOXWIDTHOFFSET = 320,
  BASICSIZE = 25,
  ERASERID = 'eraser',
  BORDERID = 'border',
  SVGNODENAME = 'svg',
  MINORRORGAJE = 5,

}
export enum LINE_ATTRIBUTES {
  STROKE = 'stroke',
  FILL = 'fill',
  SPACE = ' ',
  STROKE_WIDTH = 'stroke-width',
  STROKE_LINEJOIN = 'stroke-linejoin',
  STROKE_LINECAP = 'stroke-linecap',
  STROKE_DASHARRAY = 'stroke-dasharray',
  ID = 'id',
  R = 'r',
  D = 'd',
  M = 'M',
  L = 'L',
  ARC = 'a ',
  DASH = '-',
  FILTER = 'filter',
  URL = 'url',
  PATH = 'path',
  SVG = 'svg',
  CX = 'cx',
  CY = 'cy',
  NONE = 'none',
  NULL = '',
  COMMA = ',',
  ZERO = '0',
  TWOHUND = '200',
  HEIGTH = 'height',
  WIDTH = 'width',
  DOTTED = '1, 15',
  DASHED = '10, 10',
  FILTER_POUND = '(#',
  FILTER_CLOSE = ')',
  CIRCLE = 'circle',
  IMAGE = 'image',
  LINK_SVG = 'http://www.w3.org/2000/svg',
}
export enum IMG_URL {
  MICH1= '../../../../assets/imgs/mich1.png',
  MICH2= '../../../../assets/imgs/mich2.png',
  MICH3= '../../../../assets/imgs/mich3.png',
  MICH4= '../../../../assets/imgs/mich4.png',
  MICH5= '../../../../assets/imgs/mich5.png',
  DWIGHT1= '../../../../assets/imgs/dwight1.png',
  DWIGHT2= '../../../../assets/imgs/dwight2.png',
  DWIGHT3= '../../../../assets/imgs/dwight3.png',
}
export enum DEFAULT_VALUES {
  GRID_VALUE = 10,
  GRID_OPACITY_PERCENT = 50,
  GRID_OPACITY = 0.5,
  GRID_ZORO = 0,
  TIP_MAX = 30,
  TIP_MIN = 10,
  MIN_MAX_DIFF = 1,
  NUMBER_SIDES_POLYGON = 3,
  SHAPE_SELECTED = 'rectangle',
  SHAPE_CHOSEN = 'Rectangle',
  STAMP_ROTATION_FACTOR = 0,
  STAMP_DENUM = 1,
  STAMP_NUM = 1,
  TEXT_POLICE = 'sans-serif',
  ORIGIN_POSITION = 0,
  PASTE_OFFSET = 5,
  TRANSPARENT = 'transparent',
  FILL = 'fill',
  FILLSTROKE = 'fillStroke',
  STROKE_NONE = 'none',
  STROKE = 'stroke',

}
export enum CTRL_POINTS {
  TOP_LEFT = 'topLeft',
  TOP_CENTER = 'topCenter',
  TOP_RIGHT = 'topRight',
  CENTER_LEFT = 'centerLeft',
  CENTER_MIDDLE = 'centerMiddle',
  CENTER_RIGHT = 'centerRight',
  BOTTOM_LEFT = 'bottomLeft',
  BOTTOM_CENTER = 'bottomCenter',
  BOTTOM_RIGHT = 'bottomRight',
}
export enum SIDEBAR {
  sideBarWidth = 320,
  BOUNDING_RECT_X_OFFSET = 3,
  BOUNDING_RECT_Y_OFFSET = 4,
}
export enum RESIZE {
  SIDEBAR_WIDTH = 320,
  BBOX_OFFSET_Y = 4,
  BBOX_OFFSET_X = 2.25,
  BBOX_OFFSET_WIDTH = -4.75,
  BBOX_OFFSET_HEIGHT = -3,
}

export enum GROUP {
  GROUP_EL = 'g',
}

export enum SHAPES {
  RECT = 'rect',
  ELLIPSE = 'ellipse',
  POLYGON = 'polygon',
  LINK_SVG = 'http://www.w3.org/2000/svg',
  TRIANGLE = 3,
}

export enum OPEN_LOCAL {
  HEIGTH_INDEX = 0,
  WIDTH_INDEX = 1,
  BGCOLOR_INDEX = 2,
  SVG_INFO = 3,
}

export enum COLOR_PALETTE {
  CANVAS = 'canvas',
  CANVAS_VAL = 'canvasval',
  TD = '2d',
  SRC = '../../../../assets/imgs/color-gradient.png',
}

export enum COLOR_PICKER {
  TABS = 'tabs',
  FF = 'FF',
  RGBA = '(255,255,255, 1)',
  ACTIVE = 'active',
  BUTTON = 'BUTTON',
  PAR_OPEN = '(',
  PAR_CLOSE = ')',
  COMMA = ', ',
  ZERO = '0',
  ALERT = 'svp entrer une valeur entre 0 et 100',
}

export enum DIALOG_POPUP {
  PROMPTER = 'Vous devez entrer une valeur',
  LENGTH_MIN = 'Longueur doit être supérieure à 0',
  LENGTH_MAX = 'Longueur doit être inférieure à 5000',
  HEIGTH_MIN = 'Hauteur doit être supérieure à 0',
  HEIGTH_MAX = 'Hauteur doit être inférieure à 5000',
  NUMBER_ONLY = 'Le format doit être des chiffres seulement',
  BETWEEND = 'entre 0 et 255',
  BETWEENU = 'entre 0 et 1',
  BACKGROUND = '#FFFFFF',
  PATTERN_NUMBER = '^[0-9]*$',
  THF = '255',
  BACK = 'back',
  CONFIRM = 'Etes vous sur de vouloir supprimer le dessin courant?',
  REQUIRED = 'required',
  MIN = 'min',
  MAX = 'max',
  PATTERN = 'pattern',
  MESSAGE = '*Rentrez une valeur comprise entre 0 et 255',
  ZERO = '0',
  POUND = '#',
  NULL = '',
}

export enum DIALOG_OPEN {
  NODRAWINGS = 'noDrawings',
  ALERT_OUVERT = 'Les dessins du serveur ne peuvent etre ouverts ',
  P = 'p',
  CREATE_TEXT = 'aucun dessin correspond a vos options',
  ALERT_CHOIX = 'le dessin ne peut etre ouvert, svp choisissez un autre',
  ERASER_ALERT= 'Il n\'y a pas d\'elements à effacer',
}

export enum DIALOG_OPEN_LOCAL {
  AND = '&',
  CLOSE_COMMA = '),',
  CLOSE_AND = ')&',
  REGEXP = ',(?=\\S)',
  LESSER = '<',
  GREAT_COMMA = '>,',
  GREAT_AND = '>&',
  NULL = '',
}

export enum DIALOG_SAVE {
  PROMPTER = 'Vous devez entrer une valeur',
  MIN_LENGTH_MESS = 'Le nom doit être composé d\'au moins un charactère',
  MAX_LENGTH_MESS = 'Le nom doit avoir une longeur maximale de 50 charactères',
  PATTERN_MESS = 'Veuillez séparer les étiquettes par une virgule seulement (charactères alphanumérique seulement)',
  NULL = '',
  PATTERN_NUMBER = '^[a-zA-Z0-9]*$|(^([a-zA-Z0-9]+,)+[a-zA-Z0-9]+)',
  REQUIRED = 'required',
  MAX_LENGTH = 'maxlength',
  PATTERN = 'pattern',
  LOG = 'le dessin ne peut etre sauvegarder: ',
}

export enum DIALOG_SAVE_LOCAL {
  SAVE = 'save',
  PROMPTER = 'Vous devez entrer une valeur',
  MAX_LENGTH_MESS = 'Le nom doit avoir une longeur maximale de 50 charactères',
  PATTERN_ERROR_MESS = 'le nom ne doit pas contenir de caractères spéciaux',
  REQUIRED = 'required',
  PATTERN = 'pattern',
  MAX_LENGTH = 'maxlength',
  NULL = '',
  COMMA = ',',
  A = 'a',
  HREF = 'href',
  URL = 'data:array/text;charset=utf8, ',
  DOWNLOAD = 'download',
  NONE = 'none',
}

export enum CANVAS {
  CANVAS = 'canvas',
  CONTEXT = '2d',

}

export enum CHAR {
  OPEN_PARENTH = '(',
  COMMA_SPACE = ', ',
  CLOSE_PARENTH = ')',
}

export enum BASE64 {
  URL = 'data:image/svg+xml;base64,',
}
