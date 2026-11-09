import { AurumCore, type AurumCoreOptions } from '../core/core';
import type {
  Adjustments,
  AspectId,
  ExportMime,
  ExportProgress,
  FrameRect,
  ImageSource,
  Size,
} from '../core/types';
import { ADJUST_RANGES, clamp } from '../core/state';
import { isAbortError } from '../core/async';
import { PRESETS, presetThumbnail } from '../core/color';
import type { PresetCategory } from '../core/color';
import type { EditorState } from '../core/types';
import { maxFrame } from '../core/math';
import { ensureStyles } from './styles';
import { icon, type IconName } from './icons';

export type TabId = 'crop' | 'adjust' | 'filter' | 'text' | 'ai';
export type CropMode = 'ratio' | 'rotation' | 'perspectiveY' | 'perspectiveX';
export type Locale = 'vi' | 'en';

const STRINGS = {
  vi: {
    title: 'Chỉnh ảnh',
    undo: 'Hoàn tác',
    redo: 'Làm lại',
    save: 'Lưu',
    cancel: 'Hủy',
    cancelled: 'Đã hủy thay đổi',
    emptyTitle: 'Chỉnh ảnh của bạn',
    emptyHint: 'Kéo ảnh vào đây hoặc chọn từ thiết bị. Hỗ trợ JPEG, PNG, WebP.',
    openImage: 'Mở ảnh',
    tabCrop: 'Cắt',
    tabAdjust: 'Tinh chỉnh',
    tabFilter: 'Bộ lọc',
    aspect: 'Tỷ lệ khung',
    ratioLabel: 'Tỷ lệ',
    aspectFree: 'Tự do',
    aspectScreen: 'Màn hình',
    rotateLeft: 'Xoay trái',
    rotateRight: 'Xoay phải',
    flipH: 'Lật ngang',
    flipV: 'Lật dọc',
    rotation: 'Góc xoay',
    reset: 'Đặt lại',
    adjustTitle: 'Tinh chỉnh',
    brightness: 'Độ sáng',
    contrast: 'Độ tương phản',
    saturation: 'Độ bão hòa',
    exposure: 'Phơi sáng',
    warmth: 'Độ ấm',
    vignette: 'Mờ góc',
    highlights: 'Vùng sáng',
    shadows: 'Vùng tối',
    whites: 'Điểm trắng',
    blacks: 'Điểm đen',
    tint: 'Sắc thái màu',
    vibrance: 'Độ sống động',
    gamma: 'Gamma',
    clarity: 'Độ rõ nét',
    sharpen: 'Làm nét',
    denoise: 'Khử nhiễu',
    smoothSkin: 'Làm mịn da',
    blemish: 'Xóa mụn / đốm',
    skinTexture: 'Giữ chi tiết da',
    skinTone: 'Tông da',
    faceSlim: 'Thon gọng mặt',
    jawline: 'Hàm',
    chin: 'Cằm',
    eyeSize: 'Mắt',
    noseSize: 'Mũi',
    mouthSize: 'Miệng',
    liquify: 'Bóp méo',
    liquifyTitle: 'Bóp méo vùng ảnh bằng cọ',
    brushSize: 'Cỡ cọ',
    clearLiquify: 'Xóa bóp méo',
    brightnessShort: 'Sáng',
    contrastShort: 'Tương phản',
    saturationShort: 'Bão hòa',
    exposureShort: 'Phơi sáng',
    warmthShort: 'Ấm',
    vignetteShort: 'Mờ góc',
    highlightsShort: 'Vùng sáng',
    shadowsShort: 'Vùng tối',
    whitesShort: 'Trắng',
    blacksShort: 'Đen',
    tintShort: 'Sắc thái',
    vibranceShort: 'Sống động',
    gammaShort: 'Gamma',
    clarityShort: 'Rõ nét',
    sharpenShort: 'Nét',
    denoiseShort: 'Khử nhiễu',
    smoothSkinShort: 'Mịn da',
    blemishShort: 'Xóa mụn',
    skinTextureShort: 'Chi tiết',
    skinToneShort: 'Tông da',
    faceSlimShort: 'Thon mặt',
    jawlineShort: 'Hàm',
    chinShort: 'Cằm',
    eyeSizeShort: 'Mắt',
    noseSizeShort: 'Mũi',
    mouthSizeShort: 'Miệng',
    groupLight: 'Ánh sáng',
    groupColor: 'Màu',
    groupDetail: 'Chi tiết',
    groupPortrait: 'Chân dung',
    groupShape: 'Dáng mặt',
    groupEffect: 'Hiệu ứng',
    auto: 'Tự động',
    autoTitle: 'Tự động tối ưu ảnh',
    autoRunning: 'Đang phân tích…',
    autoDone: 'Đã tối ưu tự động',
    autoFailed: 'Không thể tối ưu tự động',
    ai: 'AI 4×',
    aiTitle: 'Phóng to và làm nét bằng AI (Real-ESRGAN)',
    aiRunning: 'Đang chạy AI…',
    aiDone: 'Đã làm nét bằng AI',
    aiFailed: 'Không thể chạy AI',
    aiCancelled: 'Đã hủy AI',
    aiCancel: 'Hủy AI',
    aiPreparing: 'Đang kiểm tra thiết bị…',
    aiTiles: 'Đang xử lý từng vùng ảnh…',
    aiCompare: 'Giữ để so sánh',
    aiBefore: 'Bản trước AI',
    aiUndo: 'Hoàn tác AI',
    aiUndoConfirm: 'Hoàn tác AI sẽ bỏ các chỉnh sửa sau đó. Tiếp tục?',
    aiReverted: 'Đã hoàn tác AI',
    filterTitle: 'Bộ lọc màu',
    cropFrame: 'Khung cắt',
    cropKeys: 'Dùng phím mũi tên để đổi kích thước, giữ Shift để đổi nhanh.',
    perspective: 'Phối cảnh',
    tiltVertical: 'Trên / dưới',
    tiltHorizontal: 'Trái / phải',
    perspectiveHint: 'Kéo thanh để chỉnh độ nghiêng. Nhấn đúp vào thanh để đặt lại.',
    resetCrop: 'Đặt lại khung cắt',
    resetRotation: 'Đặt lại góc xoay',
    resetPerspective: 'Đặt lại phối cảnh',
    resetPerspectiveY: 'Đặt lại nghiêng trên / dưới',
    resetPerspectiveX: 'Đặt lại nghiêng trái / phải',
    resetFilter: 'Đặt lại bộ lọc',
    exportTitle: 'Lưu ảnh',
    exportSub: 'Kết xuất từ file gốc ở độ phân giải đầy đủ.',
    format: 'Định dạng',
    quality: 'Chất lượng',
    saveImage: 'Lưu ảnh',
    overwrite: 'Lưu đè',
    saveCopy: 'Lưu bản sao',
    saving: 'Đang lưu…',
    rendering: 'Đang kết xuất ảnh…',
    encoding: 'Đang mã hóa ảnh…',
    uploading: 'Đang tải lên…',
    cancelExport: 'Hủy xuất ảnh',
    exportCancelled: 'Đã hủy xuất ảnh',
    saved: 'Đã lưu ảnh',
    savedCopy: 'Đã lưu bản sao',
    exportFailed: 'Không thể xuất ảnh',
    notImage: 'Tệp này không phải là ảnh',
    tabText: 'Chữ',
    tabAi: 'AI',
    catAll: 'Tất cả',
    catRoot: 'Chuẩn',
    catMeitu: 'Meitu',
    catXingtu: 'Xingtu',
    catLr: 'Lightroom',
    catMono: 'Đen trắng',
    savePreset: 'Lưu bộ lọc',
    presetName: 'Tên bộ lọc…',
    savedPresets: 'Đã lưu',
    defaultFilters: 'Mặc định',
    noSaved: 'Chưa có bộ lọc đã lưu. Tuỳ chỉnh màu rồi bấm Lưu.',
    apply: 'Áp dụng',
    deletePreset: 'Xoá',
    presetSaved: 'Đã lưu bộ lọc',
    presetApplied: 'Đã áp dụng bộ lọc',
    presetDeleted: 'Đã xoá bộ lọc',
    presetExists: 'Tên này đã có — chọn tên khác',
    textTitle: 'Thêm chữ lên ảnh',
    addText: 'Thêm chữ',
    textInput: 'Nội dung chữ…',
    fontSize: 'Cỡ chữ',
    textOpacity: 'Độ mờ',
    textRotate: 'Xoay',
    bold: 'Đậm',
    italic: 'Nghiêng',
    outline: 'Viền',
    shadow: 'Bóng đổ',
    textColor: 'Màu chữ',
    tapTextHint: 'Chạm vào chữ trên ảnh để kéo • Kéo 2 tay không có — dùng thanh trượt',
    deleteText: 'Xoá chữ',
    duplicateText: 'Nhân đôi',
    bgTitle: 'AI tách nền',
    bgSub: 'Chạy offline trên máy. Model tải 1 lần (kiểm tra SHA-256), inference không dùng mạng.',
    bgRemove: 'Xoá phông (trong suốt)',
    bgBlur: 'Mờ phông',
    bgReplace: 'Đổi nền trắng',
    bgPerson: 'Tách người (MODNet)',
    bgRemoveShort: 'Xoá phông',
    bgBlurShort: 'Mờ phông',
    bgReplaceShort: 'Nền trắng',
    bgPersonShort: 'Tách người',
    bgNeedHost: 'Bản dựng này chưa bật AI tách nền. Mở demo/ai-panel.html để thử engine offline-first.',
    bgRunning: 'Đang tách nền…',
    bgDone: 'Đã tách nền — cảnh báo: lịch sử chỉnh sửa được đặt lại.',
    bgFailed: 'Chưa tách được nền',
    tuneTitle: 'Tùy chỉnh tone',
    tuneHint: 'Chọn tone, kéo slider để tinh chỉnh rồi Lưu.',
    collapse: 'Thu gọn',
    expand: 'Mở rộng',
    tuneStrength: 'Độ đậm',
    tuneBright: 'Sáng',
    tuneContrast: 'Tương phản',
    tuneSat: 'Bão hòa',
    tuneWarm: 'Ấm',
    tuneTint: 'Sắc thái',
    tuneVig: 'Mờ góc',
    tuneReset: 'Reset tone',
    modelLabel: 'Model',
    modelFast: 'MODNet · Nhanh',
    modelBalanced: 'BiRefNet · Cân bằng',
    modelQuality: 'ISNet · Chất lượng',
    modelRecommended: 'Khuyến nghị',
    modelDetailFast: '13 MB · Tách người · iPhone siêu nhẹ',
    modelDetailBalanced: '98 MB · Đa dụng · Chân dung + vật',
    modelDetailQuality: '88 MB · Tốt nhất · Edge tóc mịn',
    brushLabel: 'Cọ',
    brushAdd: 'Giữ (thêm)',
    brushErase: 'Xoá',
    brushSizeMask: 'Kích thước cọ',
    brushUndo: 'Hoàn tác nét',
    brushInvert: 'Đảo mask',
    brushTransparent: 'Nền trong suốt',
    brushApply: 'Hoàn tất',
    brushCancel: 'Huỷ',
    brushHint: 'Chạm kéo trên ảnh để chỉnh viền. Thêm = giữ chủ thể, Xoá = bỏ nền.',
    textPinch: 'Chụm 2 ngón để co giãn · Xoay bằng ngón xoay',
    textDoubleTap: 'Chạm đúp vào chữ để sửa',
    textStyleTitle: 'Kiểu chữ',
    textStyleTitle2: 'Chữ đậm',
    textStyleCaption: 'Chú thích',
    textStyleOutline: 'Viền nổi',
    textQuick: 'Mẫu nhanh',
    textArrange: 'Căn chỉnh',
    textAlignLeft: 'Trái',
    textAlignCenter: 'Giữa',
    textAlignRight: 'Phải',
    textShowFrame: 'Khung chữ',
    retouchTitle: 'AI Retouch',
    retouchWhiten: 'Trắng da',
    retouchSmooth: 'Mịn da',
    retouchBlemish: 'Xóa mụn',
    retouchTone: 'Tông da',
    retouchDone: 'Đã retouch AI',
    retouchFailed: 'Chưa retouch được',
  },
  en: {
    title: 'Edit photo',
    undo: 'Undo',
    redo: 'Redo',
    save: 'Save',
    cancel: 'Cancel',
    cancelled: 'Changes discarded',
    emptyTitle: 'Edit your photo',
    emptyHint: 'Drop an image here or choose one from your device. JPEG, PNG and WebP are supported.',
    openImage: 'Open image',
    tabCrop: 'Crop',
    tabAdjust: 'Adjust',
    tabFilter: 'Filters',
    aspect: 'Aspect ratio',
    ratioLabel: 'Ratio',
    aspectFree: 'Free',
    aspectScreen: 'Screen',
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    flipH: 'Flip H',
    flipV: 'Flip V',
    rotation: 'Rotation',
    reset: 'Reset',
    adjustTitle: 'Adjust',
    brightness: 'Brightness',
    contrast: 'Contrast',
    saturation: 'Saturation',
    exposure: 'Exposure',
    warmth: 'Warmth',
    vignette: 'Vignette',
    highlights: 'Highlights',
    shadows: 'Shadows',
    whites: 'Whites',
    blacks: 'Blacks',
    tint: 'Tint',
    vibrance: 'Vibrance',
    gamma: 'Gamma',
    clarity: 'Clarity',
    sharpen: 'Sharpen',
    denoise: 'Denoise',
    smoothSkin: 'Skin smoothing',
    blemish: 'Blemish removal',
    skinTexture: 'Skin texture',
    skinTone: 'Skin tone',
    faceSlim: 'Face slim',
    jawline: 'Jawline',
    chin: 'Chin',
    eyeSize: 'Eyes',
    noseSize: 'Nose',
    mouthSize: 'Mouth',
    liquify: 'Liquify',
    liquifyTitle: 'Push pixels with a brush',
    brushSize: 'Brush size',
    clearLiquify: 'Clear liquify',
    brightnessShort: 'Bright',
    contrastShort: 'Contrast',
    saturationShort: 'Color',
    exposureShort: 'Exposure',
    warmthShort: 'Warmth',
    vignetteShort: 'Vignette',
    highlightsShort: 'Highlights',
    shadowsShort: 'Shadows',
    whitesShort: 'Whites',
    blacksShort: 'Blacks',
    tintShort: 'Tint',
    vibranceShort: 'Vibrance',
    gammaShort: 'Gamma',
    clarityShort: 'Clarity',
    sharpenShort: 'Sharpen',
    denoiseShort: 'Denoise',
    smoothSkinShort: 'Smooth skin',
    blemishShort: 'Blemish',
    skinTextureShort: 'Texture',
    skinToneShort: 'Skin tone',
    faceSlimShort: 'Face',
    jawlineShort: 'Jaw',
    chinShort: 'Chin',
    eyeSizeShort: 'Eyes',
    noseSizeShort: 'Nose',
    mouthSizeShort: 'Mouth',
    groupLight: 'Light',
    groupColor: 'Color',
    groupDetail: 'Detail',
    groupPortrait: 'Portrait',
    groupShape: 'Face shape',
    groupEffect: 'Effect',
    auto: 'Auto',
    autoTitle: 'Auto enhance',
    autoRunning: 'Analyzing…',
    autoDone: 'Auto enhance applied',
    autoFailed: 'Could not auto enhance',
    ai: 'AI 4×',
    aiTitle: 'Upscale and sharpen with AI (Real-ESRGAN)',
    aiRunning: 'Running AI…',
    aiDone: 'AI enhancement complete',
    aiFailed: 'AI processing failed',
    aiCancelled: 'AI cancelled',
    aiCancel: 'Cancel AI',
    aiPreparing: 'Checking device…',
    aiTiles: 'Processing image tiles…',
    aiCompare: 'Hold to compare',
    aiBefore: 'Before AI',
    aiUndo: 'Undo AI',
    aiUndoConfirm: 'Undo AI will discard edits made after it. Continue?',
    aiReverted: 'AI reverted',
    filterTitle: 'Color presets',
    cropFrame: 'Crop frame',
    cropKeys: 'Use the arrow keys to resize, hold Shift for larger steps.',
    perspective: 'Perspective',
    tiltVertical: 'Top / bottom',
    tiltHorizontal: 'Left / right',
    perspectiveHint: 'Drag the ruler to adjust the tilt. Double-tap it to reset.',
    resetCrop: 'Reset crop frame',
    resetRotation: 'Reset rotation',
    resetPerspective: 'Reset perspective',
    resetPerspectiveY: 'Reset top / bottom tilt',
    resetPerspectiveX: 'Reset left / right tilt',
    resetFilter: 'Reset filters',
    exportTitle: 'Save image',
    exportSub: 'Rendered from the original file at full resolution.',
    format: 'Format',
    quality: 'Quality',
    saveImage: 'Save image',
    overwrite: 'Overwrite',
    saveCopy: 'Save copy',
    saving: 'Saving…',
    rendering: 'Rendering image…',
    encoding: 'Encoding image…',
    uploading: 'Uploading…',
    cancelExport: 'Cancel export',
    exportCancelled: 'Export cancelled',
    saved: 'Image saved',
    savedCopy: 'Copy saved',
    exportFailed: 'Could not export the image',
    notImage: 'That file is not an image',
    tabText: 'Text',
    tabAi: 'AI',
    catAll: 'All',
    catRoot: 'Basic',
    catMeitu: 'Meitu',
    catXingtu: 'Xingtu',
    catLr: 'Lightroom',
    catMono: 'Mono',
    savePreset: 'Save filter',
    presetName: 'Filter name…',
    savedPresets: 'Saved',
    defaultFilters: 'Default',
    noSaved: 'No saved filters yet. Tune the look, then tap Save.',
    apply: 'Apply',
    deletePreset: 'Delete',
    presetSaved: 'Filter saved',
    presetApplied: 'Filter applied',
    presetDeleted: 'Filter deleted',
    presetExists: 'That name exists — pick another',
    textTitle: 'Add text to photo',
    addText: 'Add text',
    textInput: 'Text content…',
    fontSize: 'Size',
    textOpacity: 'Opacity',
    textRotate: 'Rotate',
    bold: 'Bold',
    italic: 'Italic',
    outline: 'Outline',
    shadow: 'Shadow',
    textColor: 'Text color',
    tapTextHint: 'Drag the text on the photo • Use sliders to size/rotate',
    deleteText: 'Delete text',
    duplicateText: 'Duplicate',
    bgTitle: 'AI background',
    bgSub: 'Runs offline on-device. Model downloads once (SHA-256 checked); inference never uses the network.',
    bgRemove: 'Remove background (transparent)',
    bgBlur: 'Blur background',
    bgReplace: 'White background',
    bgPerson: 'Person matte (MODNet)',
    bgRemoveShort: 'Remove',
    bgBlurShort: 'Blur',
    bgReplaceShort: 'White bg',
    bgPersonShort: 'Person',
    bgNeedHost: 'This build has no AI background action. Open demo/ai-panel.html to try the offline engine.',
    bgRunning: 'Removing background…',
    bgDone: 'Background removed — note: edit history is reset.',
    bgFailed: 'Could not remove background',
    tuneTitle: 'Tone tune',
    tuneHint: 'Pick a tone, drag sliders to refine, then Save.',
    collapse: 'Collapse',
    expand: 'Expand',
    tuneStrength: 'Strength',
    tuneBright: 'Brightness',
    tuneContrast: 'Contrast',
    tuneSat: 'Saturation',
    tuneWarm: 'Warmth',
    tuneTint: 'Tint',
    tuneVig: 'Vignette',
    tuneReset: 'Reset tune',
    modelLabel: 'Model',
    modelFast: 'MODNet · Fast',
    modelBalanced: 'BiRefNet · Balanced',
    modelQuality: 'ISNet · Quality',
    modelRecommended: 'Recommended',
    modelDetailFast: '13 MB · Portrait · iPhone light',
    modelDetailBalanced: '98 MB · General · Portrait + object',
    modelDetailQuality: '88 MB · Best · Fine hair edge',
    brushLabel: 'Brush',
    brushAdd: 'Keep (add)',
    brushErase: 'Erase',
    brushSizeMask: 'Brush size',
    brushUndo: 'Undo stroke',
    brushInvert: 'Invert mask',
    brushTransparent: 'Transparent',
    brushApply: 'Done',
    brushCancel: 'Cancel',
    brushHint: 'Drag on the photo to fix edges. Keep = foreground, Erase = background.',
    textPinch: 'Pinch to resize · Twist to rotate',
    textDoubleTap: 'Double-tap text to edit',
    textStyleTitle: 'Title',
    textStyleTitle2: 'Bold title',
    textStyleCaption: 'Caption',
    textStyleOutline: 'Outline',
    textQuick: 'Quick styles',
    textArrange: 'Align',
    textAlignLeft: 'Left',
    textAlignCenter: 'Center',
    textAlignRight: 'Right',
    textShowFrame: 'Frame',
    retouchTitle: 'AI Retouch',
    retouchWhiten: 'Whiten',
    retouchSmooth: 'Smooth',
    retouchBlemish: 'Blemish',
    retouchTone: 'Tone',
    retouchDone: 'AI retouch done',
    retouchFailed: 'Could not retouch',
  },
} as const;

type UIStrings = Record<keyof typeof STRINGS.vi, string>;

export interface AIActionContext {
  /** Aborted when the user presses the AI cancel button or destroys the editor. */
  signal: AbortSignal;
  /**
   * Update the AI progress panel. Pass a value in `[0, 1]`, or a negative value
   * for an indeterminate stage (loading the model, probing the device).
   */
  report: (progress: number, label?: string) => void;
}

export interface AIAction {
  /** Short label on the header button, e.g. `AI 4×`. */
  label: string;
  title: string;
  /**
   * Run the optional AI action. The application owns the model URL, probe,
   * planner and `editor.runAI()` call; the core never imports a model.
   */
  run: (editor: AurumEditor, context: AIActionContext) => Promise<void>;
}

export type BackgroundMode = 'remove' | 'blur' | 'replace' | 'person';
export type AiModelId = 'isnet-fp16' | 'birefnet-lite-512-fp16' | 'modnet-fp16';
export type RetouchMode = 'whiten' | 'smooth' | 'blemish' | 'tone';

export interface RetouchActionContext {
  signal: AbortSignal;
  report: (progress: number, label?: string) => void;
}

export interface RetouchAction {
  run: (editor: AurumEditor, context: RetouchActionContext, mode: RetouchMode) => Promise<void>;
}

export interface BackgroundActionContext {
  signal: AbortSignal;
  report: (progress: number, label?: string) => void;
  modelId?: AiModelId;
}

export interface BackgroundMaskResult {
  maskWidth: number;
  maskHeight: number;
  mask: Float32Array;
  modelId: string;
  mode: BackgroundMode;
}

export interface BackgroundAction {
  /**
   * Run background inference using the standalone ai-engine bundle.
   * If the return value is a BackgroundMaskResult, the UI enters brush
   * refine mode (remove/person). Otherwise the host has already loaded
   * the composited image via editor.load() (blur/replace legacy path).
   */
  run: (
    editor: AurumEditor,
    context: BackgroundActionContext,
    mode: BackgroundMode,
    modelId: AiModelId,
  ) => Promise<BackgroundMaskResult | void>;
}

export interface AurumUIOptions extends Omit<AurumCoreOptions, 'container'> {
  container: HTMLElement | string;
  locale?: Locale;
  title?: string;
  fileName?: string;
  /** CSS custom properties, e.g. `{ gold: '#f3c77b' }`. */
  theme?: Record<string, string>;
  /**
   * Called instead of the automatic download when provided. Return a promise
   * to keep the sheet open while uploading; the success toast only appears
   * after it resolves, and a rejection is shown as an error.
   */
  onSave?: (blob: Blob, fileName: string) => void | Promise<void>;
  /**
   * Optional second save action. When provided, the sheet offers both
   * "overwrite" (`onSave`) and "save a copy" (`onSaveCopy`).
   */
  onSaveCopy?: (blob: Blob, fileName: string) => void | Promise<void>;
  /** Called by the Cancel button. Without it, Cancel discards the edits. */
  onClose?: () => void;
  autoDownload?: boolean;
  startTab?: TabId;
  /** Restrict the formats offered by the export sheet, e.g. `['image/jpeg']`. */
  exportTypes?: ExportMime[];
  /** Set false when you load `dist/aurum.css` yourself. */
  injectStyles?: boolean;
  /**
   * Optional AI action button. Nothing is loaded until the user presses it;
   * the host supplies `dist/aurum-ai.esm.js` and the model/runtime URLs.
   */
  aiAction?: AIAction;
  /**
   * Optional background-removal action (AI tab). The host supplies the
   * standalone `dist/aurum-ai-engine.esm.js` + ORT runtime + pinned models.
   * The core never imports ORT or model bytes.
   */
  backgroundAction?: BackgroundAction;
  retouchAction?: RetouchAction;
}

interface TickControl {
  row: HTMLElement;
  rail: HTMLElement;
  set: (value: number, animate?: boolean) => void;
  setRange: (
    min: number,
    max: number,
    step: number,
    tickStep: number,
    zero?: boolean,
  ) => void;
  setLabel: (label: string) => void;
  setDisabled: (disabled: boolean) => void;
  focus: () => void;
}

interface CropDrag {
  pointerId: number;
  handle: string;
  startX: number;
  startY: number;
  frame: FrameRect;
  viewport: Size;
  aspect: AspectId;
  startScale: number;
  startRatio: number;
  key: string;
  handleEl: HTMLElement;
  move: (event: PointerEvent) => void;
  end: (event: PointerEvent) => void;
}

const TABS: { id: TabId; icon: IconName; label: keyof UIStrings }[] = [
  { id: 'adjust', icon: 'adjust', label: 'tabAdjust' },
  { id: 'filter', icon: 'filter', label: 'tabFilter' },
  { id: 'text', icon: 'text', label: 'tabText' },
  { id: 'ai', icon: 'wand', label: 'tabAi' },
  { id: 'crop', icon: 'crop', label: 'tabCrop' },
];

const ASPECTS: { id: AspectId; label: string }[] = [
  { id: 'free', label: 'free' },
  { id: '1:1', label: '1:1' },
  { id: '4:3', label: '4:3' },
  { id: '3:4', label: '3:4' },
  { id: '16:9', label: '16:9' },
  { id: '9:16', label: '9:16' },
  { id: 'screen', label: 'screen' },
];

const ADJUST_SHORT: Record<keyof Adjustments, keyof UIStrings> = {
  brightness: 'brightnessShort',
  contrast: 'contrastShort',
  saturation: 'saturationShort',
  exposure: 'exposureShort',
  warmth: 'warmthShort',
  vignette: 'vignetteShort',
  highlights: 'highlightsShort',
  shadows: 'shadowsShort',
  whites: 'whitesShort',
  blacks: 'blacksShort',
  tint: 'tintShort',
  vibrance: 'vibranceShort',
  gamma: 'gammaShort',
  clarity: 'clarityShort',
  sharpen: 'sharpenShort',
  denoise: 'denoiseShort',
  smoothSkin: 'smoothSkinShort',
  blemish: 'blemishShort',
  skinTexture: 'skinTextureShort',
  skinTone: 'skinToneShort',
  faceSlim: 'faceSlimShort',
  jawline: 'jawlineShort',
  chin: 'chinShort',
  eyeSize: 'eyeSizeShort',
  noseSize: 'noseSizeShort',
  mouthSize: 'mouthSizeShort',
};

/** Ordered the way photographers think: exposure, colour, detail, skin, mood. */
const ADJUST_GROUPS: {
  id: string;
  label: keyof UIStrings;
  keys: (keyof Adjustments)[];
}[] = [
  {
    id: 'light',
    label: 'groupLight',
    keys: ['brightness', 'exposure', 'contrast', 'highlights', 'shadows', 'whites', 'blacks'],
  },
  {
    id: 'color',
    label: 'groupColor',
    keys: ['saturation', 'vibrance', 'warmth', 'tint', 'gamma'],
  },
  { id: 'detail', label: 'groupDetail', keys: ['clarity', 'sharpen', 'denoise'] },
  {
    id: 'portrait',
    label: 'groupPortrait',
    keys: ['smoothSkin', 'skinTexture', 'blemish', 'skinTone'],
  },
  {
    id: 'shape',
    label: 'groupShape',
    keys: ['faceSlim', 'jawline', 'chin', 'eyeSize', 'noseSize', 'mouthSize'],
  },
  { id: 'effect', label: 'groupEffect', keys: ['vignette'] },
];

const FORMATS: { type: ExportMime; label: string }[] = [
  { type: 'image/jpeg', label: 'JPEG' },
  { type: 'image/webp', label: 'WebP' },
  { type: 'image/png', label: 'PNG' },
];

let uid = 0;

// ------------------------------------------------------------------ text layers
export interface AurumTextLayer {
  id: string;
  text: string;
  /** Centre position in exported-image fractions (0..1). */
  x: number;
  y: number;
  /** Font size as fraction of export height. */
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
  outline: boolean;
  shadow: boolean;
  align: 'left' | 'center' | 'right';
  /** Rotation degrees, -180..180. */
  rotation: number;
  /** Opacity 0..1 */
  opacity: number;
  font: string;
}

const TEXT_FONTS: { id: string; label: string; stack: string }[] = [
  { id: 'sys', label: 'San', stack: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" },
  { id: 'serif', label: 'Serif', stack: "Georgia,'Times New Roman',serif" },
  { id: 'mono', label: 'Mono', stack: "'SF Mono',Menlo,Consolas,monospace" },
  { id: 'round', label: 'Rounded', stack: "'Arial Rounded MT Bold','Helvetica Neue',sans-serif" },
  { id: 'heavy', label: 'Heavy', stack: "'Arial Black',Impact,sans-serif" },
  { id: 'title', label: 'Title', stack: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" },
  { id: 'caption', label: 'Caption', stack: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" },
];

function defaultTextLayer(): AurumTextLayer {
  const id = `t${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
  return {
    id,
    text: '',
    x: 0.5,
    y: 0.5,
    size: 0.07,
    color: '#ffffff',
    bold: false,
    italic: false,
    outline: false,
    shadow: true,
    align: 'center',
    rotation: 0,
    opacity: 1,
    font: 'sys',
  };
}

function applyTextStyle(layer: AurumTextLayer, style: string): void {
  if (style === 'title') {
    layer.font = 'sys'; layer.bold = true; layer.size = 0.11; layer.outline = false; layer.shadow = true; layer.color = '#ffffff';
  } else if (style === 'bold') {
    layer.font = 'heavy'; layer.bold = true; layer.size = 0.09; layer.outline = false; layer.shadow = false;
  } else if (style === 'caption') {
    layer.font = 'sys'; layer.bold = false; layer.italic = false; layer.size = 0.045; layer.outline = false; layer.shadow = false;
  } else if (style === 'outline') {
    layer.font = 'heavy'; layer.bold = true; layer.size = 0.09; layer.outline = true; layer.shadow = false; layer.color = '#ffffff';
  }
}

const USER_PRESET_KEY = 'aurum:user-presets:v1';

interface UserPreset {
  id: string;
  name: string;
  createdAt: number;
  filter: string;
  adjust: Record<keyof Adjustments, number>;
  enhance: EditorState['enhance'];
}

function loadUserPresets(): UserPreset[] {
  try {
    const raw = localStorage.getItem(USER_PRESET_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is UserPreset =>
        !!p && typeof p === 'object' && typeof (p as UserPreset).name === 'string',
    );
  } catch {
    return [];
  }
}

function storeUserPresets(presets: UserPreset[]): void {
  try {
    localStorage.setItem(USER_PRESET_KEY, JSON.stringify(presets));
  } catch {
    // Storage may be unavailable (private mode); the list lives for the session.
  }
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function escHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function q<T extends Element>(root: ParentNode, selector: string): T {
  const found = root.querySelector<T>(selector);
  if (!found) throw new Error(`Aurum: missing UI node ${selector}`);
  return found;
}

function iconButton(name: IconName, label: string, onClick: () => void): HTMLButtonElement {
  const button = el('button', 'au-icon au-glass');
  button.type = 'button';
  button.title = label;
  button.setAttribute('aria-label', label);
  button.innerHTML = icon(name);
  button.addEventListener('click', onClick);
  return button;
}

function download(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = el('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function baseName(source: ImageSource | undefined, custom?: string): string {
  let name = custom || '';
  if (!name && typeof source === 'string') {
    try {
      const url = new URL(source, location.href);
      name = decodeURIComponent(url.pathname.split('/').pop() || '');
    } catch {
      name = '';
    }
  }
  if (!name && source instanceof File) name = source.name;
  name = name.replace(/\.[a-z0-9]{1,5}$/i, '').replace(/[\\/:*?"<>|]+/g, '').trim();
  return name.slice(0, 64) || 'aurum';
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

/**
 * Default glass/dark/gold UI on top of the headless `AurumCore`.
 * Instantiate `AurumCore` directly when you only need the engine.
 */
export class AurumEditor extends AurumCore {
  readonly root: HTMLElement;

  private work: HTMLElement;
  private frameEl!: HTMLElement;
  private sheetWrap!: HTMLElement;
  private toastEl!: HTMLElement;
  private undoBtn!: HTMLButtonElement;
  private redoBtn!: HTMLButtonElement;
  private saveBtn!: HTMLButtonElement;
  private ratioBtn!: HTMLButtonElement;
  private rotationBtn!: HTMLButtonElement;
  private perspectiveYBtn!: HTMLButtonElement;
  private perspectiveXBtn!: HTMLButtonElement;
  private ratioValue!: HTMLElement;
  private rotationValue!: HTMLElement;
  private perspectiveYValue!: HTMLElement;
  private perspectiveXValue!: HTMLElement;
  private ratioContext!: HTMLElement;
  private rotationContext!: HTMLElement;
  private perspectiveYContext!: HTMLElement;
  private perspectiveXContext!: HTMLElement;
  private perspectiveYControl!: TickControl;
  private perspectiveXControl!: TickControl;
  private modesWrap!: HTMLElement;
  private modesTrack!: HTMLElement;
  private chipsEl!: HTMLElement;
  private scrimEl!: HTMLElement;
  private cropResetBtn!: HTMLButtonElement;
  private adjustValue!: HTMLButtonElement;
  private autoBtn!: HTMLButtonElement;
  private autoLabel!: HTMLElement;
  private aiAction?: AIAction;
  private aiBtn: HTMLButtonElement | null = null;
  private aiPanel!: HTMLElement;
  private aiDetail!: HTMLElement;
  private aiBar!: HTMLElement;
  private aiBusy = false;
  private aiAbort: AbortController | null = null;
  private aiCompareBar: HTMLElement | null = null;
  private aiCompareHold: HTMLButtonElement | null = null;
  private aiCompareOn = false;
  private paramsEl!: HTMLElement;
  private filterWrap!: HTMLElement;
  private filterCats!: HTMLElement;
  private filterCat: PresetCategory | 'all' = 'all';
  private filterHint!: HTMLElement;
  private savedWrap!: HTMLElement;
  private filterNameInput!: HTMLInputElement;
  private filterSaveBtn!: HTMLButtonElement;
  private savedList!: HTMLElement;
  private userPresets: UserPreset[] = loadUserPresets();
  private savedFilterButtons = new Map<string, HTMLButtonElement>();
  private activeSavedId: string | null = null;
  private savedReturnState: EditorState | null = null;
  // Filter tune (custom sliders per tone)
  private filterTuneKey: keyof Adjustments = 'brightness';
  private filterTuneTicks!: TickControl;
  private filterTuneValue!: HTMLButtonElement;
  private filterTuneButtons = new Map<keyof Adjustments, HTMLButtonElement>();
  private filterTuneWrap!: HTMLElement;
  private backgroundAction?: BackgroundAction;
  private retouchAction?: RetouchAction;
  private bgBusy = false;
  private bgAbort: AbortController | null = null;
  private bgDetail!: HTMLElement;
  private bgPanel!: HTMLElement;
  private bgModelLabelEl!: HTMLElement;
  private bgModelSegEl!: HTMLElement;
  private bgListEl!: HTMLElement;
  private retouchListEl!: HTMLElement;
  private retouchLabelEl!: HTMLElement;
  private bgModel: AiModelId = (() => {
    try {
      const v = localStorage.getItem('aurum:ai-model');
      return (v === 'isnet-fp16' || v === 'birefnet-lite-512-fp16' || v === 'modnet-fp16') ? (v as AiModelId) : 'isnet-fp16';
    } catch { return 'isnet-fp16'; }
  })();
  private bgModelButtons = new Map<AiModelId, HTMLButtonElement>();
  private bgModelDetail!: HTMLElement;
  // Mask brush refine state
  private refineCanvas!: HTMLCanvasElement;
  private refineOn = false;
  private refineSource: CanvasImageSource | null = null;
  private refineWidth = 0;
  private refineHeight = 0;
  private refineMaskWidth = 0;
  private refineMaskHeight = 0;
  private refineMask: Float32Array | null = null;
  private refineOriginalMask: Float32Array | null = null;
  private refineMode: BackgroundMode = 'remove';
  private refineBaseMode: BackgroundMode = 'remove';
  private refineModelId = '';
  private brushMode: 'add' | 'erase' = 'add';
  private brushSize = 7;
  private refineHistory: Float32Array[] = [];
  private refineStroke: { pointerId: number; snapshotTaken: boolean } | null = null;
  private maskToolbar!: HTMLElement;
  private maskBrushTicks!: TickControl;
  private maskTransparentBtn: HTMLButtonElement | null = null;
  private textLayer!: HTMLElement;
  private texts: AurumTextLayer[] = [];
  private selectedTextId: string | null = null;
  private textPlacing = false;
  private textPlaceBtn!: HTMLButtonElement;
  private textShowFrame = (() => { try { return localStorage.getItem('aurum:text-frame') !== '0'; } catch { return true; } })();
  private textInput!: HTMLTextAreaElement;
  private textSizeTicks!: TickControl;
  private textOpacityTicks!: TickControl;
  private textRotateTicks!: TickControl;
  private textControls!: HTMLElement;
  private qualityRow!: HTMLElement;
  private progressEl!: HTMLElement;
  private progressBar!: HTMLElement;
  private progressText!: HTMLElement;
  private progressLabel!: HTMLElement;
  private progressCancel!: HTMLButtonElement;
  private exportAbort: AbortController | null = null;
  private saveLabel!: HTMLElement;
  private saveImageBtn!: HTMLButtonElement;
  private saveCopyBtn: HTMLButtonElement | null = null;
  private saveCopyLabel: HTMLElement | null = null;
  private metaName!: HTMLElement;
  private metaInfo!: HTMLElement;
  private s: UIStrings;
  private locale: Locale;
  private fileBase: string;
  private customTitle?: string;
  private onSaveCb?: (blob: Blob, fileName: string) => void | Promise<void>;
  private onSaveCopyCb?: (blob: Blob, fileName: string) => void | Promise<void>;
  private onCloseCb?: () => void;
  private autoDownload: boolean;
  private quality = 92;
  private exportType: ExportMime = 'image/jpeg';
  private exportTypes: ExportMime[] = FORMATS.map((format) => format.type);
  private currentTab: TabId = 'adjust';
  private cropMode: CropMode = 'ratio';
  private lastAspect: AspectId | null = null;
  private adjustKey: keyof Adjustments = 'brightness';
  private liquifyOn = false;
  private liquifySize = 5;
  private liquifyGesture = 0;
  private liquifyButton: HTMLButtonElement | null = null;
  private adjustContext: HTMLElement | null = null;
  private liquifyContext: HTMLElement | null = null;
  private liquifyTicks: TickControl | null = null;
  private liquifyValue: HTMLButtonElement | null = null;
  private liquifyRing: HTMLElement | null = null;
  private liquifyStroke: {
    pointerId: number;
    key: string;
    x: number;
    y: number;
    u: number;
    v: number;
  } | null = null;
  private saving = false;
  private autoBusy = false;
  private uiDestroyed = false;
  private dragDepth = 0;
  private toastTimer = 0;
  private ratioTimer = 0;
  private cropKeyTimer = 0;
  private cropDrag: CropDrag | null = null;
  private frameBox = { x: NaN, y: NaN, w: NaN, h: NaN };
  private readonly uid = `au${++uid}`;

  private tabButtons = new Map<TabId, HTMLButtonElement>();
  private panes = new Map<TabId, HTMLElement>();
  private aspectButtons = new Map<AspectId, HTMLButtonElement>();
  private flipButtons = new Map<'flipH' | 'flipV', HTMLButtonElement>();
  private adjustButtons = new Map<keyof Adjustments, HTMLButtonElement>();
  private filterButtons = new Map<string, HTMLButtonElement>();
  private formatButtons = new Map<ExportMime, HTMLButtonElement>();
  private rotationControl!: TickControl;
  private adjustTicks!: TickControl;
  private qualityControl!: TickControl;

  constructor(options: AurumUIOptions) {
    const host =
      typeof options.container === 'string'
        ? document.querySelector<HTMLElement>(options.container)
        : options.container;
    if (!host) {
      throw new Error(`Aurum: container "${String(options.container)}" was not found`);
    }
    if (options.injectStyles !== false) ensureStyles();

    const root = el('div', 'au-root');
    root.tabIndex = -1;
    const work = el('div', 'au-work');
    root.appendChild(work);
    host.appendChild(root);

    const {
      image,
      locale,
      title,
      fileName,
      theme,
      onSave,
      onSaveCopy,
      onClose,
      autoDownload,
      startTab,
      exportTypes,
      aiAction,
      backgroundAction,
      retouchAction,
      ...coreOptions
    } = options;
    super({
      ...coreOptions,
      container: work,
      background: coreOptions.background ?? 'transparent',
    });

    this.root = root;
    this.work = work;
    this.locale = locale === 'en' ? 'en' : 'vi';
    this.s = STRINGS[this.locale] as unknown as UIStrings;
    this.fileBase = baseName(image, fileName);
    this.customTitle = title;
    this.onSaveCb = onSave;
    this.onSaveCopyCb = onSaveCopy;
    this.onCloseCb = onClose;
    this.autoDownload = autoDownload !== false;
    this.aiAction = aiAction;
    this.backgroundAction = backgroundAction;
    this.retouchAction = retouchAction;
    if (exportTypes && exportTypes.length) {
      this.exportTypes = exportTypes.filter((type, index) =>
        FORMATS.some((format) => format.type === type) &&
        exportTypes.indexOf(type) === index,
      );
      if (!this.exportTypes.length) this.exportTypes = FORMATS.map((format) => format.type);
      this.exportType = this.exportTypes[0];
    }

    if (theme) {
      for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key.startsWith('--') ? key : `--au-${key}`, value);
      }
    }

    this.buildChrome();
    this.syncUI();
    this.setCropMode('ratio');
    this.setTab(startTab || 'adjust');
    if (image) void this.openSource(image);
  }

  /* ------------------------------------------------------------- public UI */

  /** Switch the visible tool panel. */
  showTab(tab: TabId): void {
    this.setTab(tab);
  }

  /** Open the export sheet programmatically. */
  openExport(): void {
    this.openSheet();
  }

  override undo(): boolean {
    const hadAI = this.canRevertAI();
    const changed = super.undo();
    // `super.undo()` only reverts the AI pass once the post-AI history is
    // empty. A normal edit undo must keep the compare bar visible.
    if (changed && hadAI && !this.canRevertAI()) {
      this.setAICompareVisible(false);
      this.toast(this.s.aiReverted);
    }
    return changed;
  }

  override destroy(): void {
    if (this.uiDestroyed) return;
    this.uiDestroyed = true;
    this.setLiquify(false);
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.clearTransient();
    if (this.cropDrag) this.endCropDrag();
    super.destroy();
    this.root.remove();
  }

  /* --------------------------------------------------------------- assembly */

  private buildChrome(): void {
    this.buildOverlay();
    this.buildTextLayer();
    this.buildEmpty();
    this.buildLoading();
    this.buildHeader();
    this.buildDock();
    this.buildSheet();
    this.buildAI();
    this.buildBG();
    this.buildToast();
    this.buildLiquifyOverlay();
    this.bindEvents();
  }

  private buildOverlay(): void {
    const overlay = el('div', 'au-overlay');
    const scrim = el('div', 'au-scrim');
    scrim.setAttribute('aria-hidden', 'true');
    const frame = el('div', 'au-frame');
    frame.setAttribute('role', 'group');
    frame.tabIndex = 0;
    frame.setAttribute(
      'aria-label',
      `${this.s.cropFrame}. ${this.s.cropKeys}`,
    );
    for (const pos of ['33.333%', '66.666%']) {
      const v = el('span', 'au-grid v');
      v.style.left = pos;
      v.setAttribute('aria-hidden', 'true');
      frame.appendChild(v);
      const h = el('span', 'au-grid h');
      h.style.top = pos;
      h.setAttribute('aria-hidden', 'true');
      frame.appendChild(h);
    }
    for (const corner of ['tl', 'tr', 'br', 'bl']) {
      const handle = el('span', `au-corner ${corner}`);
      handle.dataset.cropHandle = corner;
      handle.setAttribute('aria-hidden', 'true');
      frame.appendChild(handle);
    }
    for (const edge of ['n', 'e', 's', 'w']) {
      const handle = el('span', `au-edge ${edge}`);
      handle.dataset.cropHandle = edge;
      handle.setAttribute('aria-hidden', 'true');
      frame.appendChild(handle);
    }
    overlay.appendChild(scrim);
    overlay.appendChild(frame);
    this.work.appendChild(overlay);
    this.frameEl = frame;
    this.scrimEl = scrim;
  }

  private buildEmpty(): void {
    const empty = el('div', 'au-empty');
    empty.innerHTML = `<div class="au-empty__icon">${icon('image')}</div><h3></h3><p></p><button class="au-ghost" type="button"></button>`;
    q<HTMLElement>(empty, 'h3').textContent = this.s.emptyTitle;
    q<HTMLElement>(empty, 'p').textContent = this.s.emptyHint;
    const open = q<HTMLButtonElement>(empty, 'button');
    open.textContent = this.s.openImage;
    open.addEventListener('click', () => this.fileInput?.click());

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.hidden = true;
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      input.value = '';
      if (file) void this.openSource(file);
    });
    this.fileInput = input;
    empty.appendChild(input);
    this.work.appendChild(empty);

    this.work.addEventListener('dragenter', (event) => {
      event.preventDefault();
      this.dragDepth += 1;
      this.root.classList.add('au-dragover');
    });
    this.work.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    });
    this.work.addEventListener('dragleave', () => {
      this.dragDepth = Math.max(0, this.dragDepth - 1);
      if (!this.dragDepth) this.root.classList.remove('au-dragover');
    });
    this.work.addEventListener('drop', (event) => {
      event.preventDefault();
      this.dragDepth = 0;
      this.root.classList.remove('au-dragover');
      const file = event.dataTransfer?.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        this.toast(this.s.notImage, true);
        return;
      }
      void this.openSource(file);
    });
  }

  private fileInput?: HTMLInputElement;

  private buildLoading(): void {
    const loading = el('div', 'au-loading');
    loading.innerHTML = '<div class="au-spinner"></div>';
    this.work.appendChild(loading);
  }

  private buildHeader(): void {
    const header = el('header', 'au-top');
    header.setAttribute('aria-label', this.customTitle || this.s.title);

    const primary = el('div', 'au-top__row au-top__row--primary');
    const cancel = el('button', 'au-top__cancel au-glass');
    cancel.type = 'button';
    cancel.textContent = this.s.cancel;
    cancel.addEventListener('click', () => this.cancel());
    this.saveBtn = el('button', 'au-top__save au-glass au-glass--gold');
    this.saveBtn.type = 'button';
    this.saveBtn.innerHTML = `${icon('save')}<span></span>`;
    const saveText = this.saveBtn.querySelector('span');
    if (saveText) saveText.textContent = this.s.save;
    this.saveBtn.disabled = true;
    this.saveBtn.addEventListener('click', () => this.openSheet());
    primary.append(cancel, this.saveBtn);

    const toolsRow = el('div', 'au-top__row au-top__row--tools');
    const history = el('div', 'au-top__group');
    this.undoBtn = iconButton('undo', this.s.undo, () => this.undo());
    this.redoBtn = iconButton('redo', this.s.redo, () => this.redo());
    this.undoBtn.disabled = true;
    this.redoBtn.disabled = true;
    history.append(this.undoBtn, this.redoBtn);

    const transforms = el('div', 'au-top__group');
    const rotateLeft = iconButton('rotateLeft', this.s.rotateLeft, () => this.rotateBy(-90));
    const rotateRight = iconButton('rotateRight', this.s.rotateRight, () => this.rotateBy(90));
    const flipH = iconButton('flipH', this.s.flipH, () => this.flip('h'));
    const flipV = iconButton('flipV', this.s.flipV, () => this.flip('v'));
    this.flipButtons.set('flipH', flipH);
    this.flipButtons.set('flipV', flipV);
    transforms.append(rotateLeft, rotateRight, flipH, flipV);
    toolsRow.append(history, transforms);

    if (this.aiAction) {
      const aiGroup = el('div', 'au-top__group');
      const aiBtn = el('button', 'au-top__ai au-glass');
      aiBtn.type = 'button';
      aiBtn.title = this.aiAction.title;
      aiBtn.setAttribute('aria-label', this.aiAction.title);
      aiBtn.innerHTML = `${icon('ai')}<span></span>`;
      const aiLabel = aiBtn.querySelector('span');
      if (aiLabel) aiLabel.textContent = this.aiAction.label;
      aiBtn.addEventListener('click', () => void this.runAIAction());
      this.aiBtn = aiBtn;
      aiGroup.appendChild(aiBtn);
      toolsRow.appendChild(aiGroup);
    }

    header.append(primary, toolsRow);
    this.root.insertBefore(header, this.work);
  }

  private buildDock(): void {
    const dock = el('div', 'au-dock');
    const deck = el('div', 'au-deck');
    const tabbar = el('div', 'au-tabs');
    tabbar.setAttribute('role', 'tablist');
    tabbar.setAttribute('aria-label', this.s.title);

    for (const tab of TABS) {
      const paneId = `${this.uid}-pane-${tab.id}`;
      const tabId = `${this.uid}-tab-${tab.id}`;
      const button = el('button', 'au-tab');
      button.type = 'button';
      button.id = tabId;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', 'false');
      button.setAttribute('aria-controls', paneId);
      button.innerHTML = icon(tab.icon);
      const label = el('span');
      label.textContent = this.s[tab.label];
      button.appendChild(label);
      button.addEventListener('click', () => this.setTab(tab.id));
      this.tabButtons.set(tab.id, button);
      tabbar.appendChild(button);

      const pane = el('section', 'au-pane');
      pane.id = paneId;
      pane.setAttribute('role', 'tabpanel');
      pane.setAttribute('aria-labelledby', tabId);
      if (tab.id === 'crop') this.buildCropPane(pane);
      if (tab.id === 'adjust') this.buildAdjustPane(pane);
      if (tab.id === 'filter') this.buildFilterPane(pane);
      if (tab.id === 'text') this.buildTextPane(pane);
      if (tab.id === 'ai') this.buildAIPane(pane);
      this.panes.set(tab.id, pane);
      deck.appendChild(pane);
    }

    tabbar.addEventListener('keydown', (event) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const ids = TABS.map((item) => item.id);
      const index = Math.max(0, ids.indexOf(this.currentTab));
      const next =
        event.key === 'Home'
          ? ids[0]
          : event.key === 'End'
            ? ids[ids.length - 1]
            : ids[(index + (event.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length];
      this.setTab(next);
      this.tabButtons.get(next)?.focus();
    });

    const compare = this.buildAICompare();
    dock.append(deck, ...(compare ? [compare] : []), tabbar);
    this.root.appendChild(dock);
  }

  /**
   * Compact bar that appears after an AI pass. AI swaps the base bitmap, so it
   * has its own before/after and undo instead of living in the slider history.
   */
  private buildAICompare(): HTMLElement | null {
    if (!this.aiAction) return null;
    const bar = el('div', 'au-aicmp au-glass');
    bar.hidden = true;
    const hold = el('button', 'au-aicmp__hold');
    hold.type = 'button';
    hold.textContent = this.s.aiCompare;
    hold.setAttribute('aria-pressed', 'false');
    const undo = el('button', 'au-aicmp__undo');
    undo.type = 'button';
    undo.textContent = this.s.aiUndo;

    const setCompare = (on: boolean): void => {
      if (this.aiCompareOn === on) return;
      this.aiCompareOn = on;
      this.setCompareAI(on);
      hold.classList.toggle('is-on', on);
      hold.setAttribute('aria-pressed', String(on));
      hold.textContent = on ? this.s.aiBefore : this.s.aiCompare;
    };
    const end = (): void => setCompare(false);
    hold.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      try {
        hold.setPointerCapture(event.pointerId);
      } catch {
        // The pointer may already be gone.
      }
      setCompare(true);
      event.preventDefault();
    });
    hold.addEventListener('pointerup', end);
    hold.addEventListener('pointercancel', end);
    hold.addEventListener('keydown', (event) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      setCompare(true);
    });
    hold.addEventListener('keyup', (event) => {
      if (event.key === ' ' || event.key === 'Enter') setCompare(false);
    });
    hold.addEventListener('contextmenu', (event) => event.preventDefault());
    undo.addEventListener('click', () => {
      if (this.history.canUndo && !window.confirm(this.s.aiUndoConfirm)) return;
      if (!this.revertAI()) return;
      this.setAICompareVisible(false);
      this.toast(this.s.aiReverted);
    });

    bar.append(hold, undo);
    this.aiCompareBar = bar;
    this.aiCompareHold = hold;
    return bar;
  }

  private setAICompareVisible(visible: boolean): void {
    if (!this.aiCompareBar) return;
    if (!visible && this.aiCompareOn) {
      this.aiCompareOn = false;
      this.setCompareAI(false);
      if (this.aiCompareHold) {
        this.aiCompareHold.textContent = this.s.aiCompare;
        this.aiCompareHold.classList.remove('is-on');
        this.aiCompareHold.setAttribute('aria-pressed', 'false');
      }
    }
    this.aiCompareBar.hidden = !visible;
  }

  private buildCropPane(pane: HTMLElement): void {
    const top = el('div', 'au-deck__row au-deck__row--top');

    this.ratioBtn = el('button', 'au-mode au-glass');
    this.ratioBtn.type = 'button';
    this.ratioBtn.innerHTML = `${icon('crop')}<span class="au-mode__value"></span>`;
    this.ratioValue = q<HTMLElement>(this.ratioBtn, '.au-mode__value');
    this.ratioBtn.setAttribute('aria-pressed', 'true');
    this.ratioBtn.addEventListener('click', () => this.setCropMode('ratio'));

    this.rotationBtn = el('button', 'au-mode au-glass');
    this.rotationBtn.type = 'button';
    this.rotationBtn.innerHTML = `${icon('rotateRight')}<span class="au-mode__value"></span>`;
    this.rotationValue = q<HTMLElement>(this.rotationBtn, '.au-mode__value');
    this.rotationBtn.setAttribute('aria-pressed', 'false');
    this.rotationBtn.addEventListener('click', () => this.setCropMode('rotation'));

    this.perspectiveYBtn = el('button', 'au-mode au-mode--persp au-glass');
    this.perspectiveYBtn.type = 'button';
    this.perspectiveYBtn.innerHTML = `${icon('tiltY')}<span class="au-mode__value"></span>`;
    this.perspectiveYBtn.title = `${this.s.tiltVertical} · ${this.s.perspectiveHint}`;
    this.perspectiveYValue = q<HTMLElement>(this.perspectiveYBtn, '.au-mode__value');
    this.perspectiveYBtn.setAttribute('aria-pressed', 'false');
    this.perspectiveYBtn.addEventListener('click', () => this.setCropMode('perspectiveY'));

    this.perspectiveXBtn = el('button', 'au-mode au-mode--persp au-glass');
    this.perspectiveXBtn.type = 'button';
    this.perspectiveXBtn.innerHTML = `${icon('tiltX')}<span class="au-mode__value"></span>`;
    this.perspectiveXBtn.title = `${this.s.tiltHorizontal} · ${this.s.perspectiveHint}`;
    this.perspectiveXValue = q<HTMLElement>(this.perspectiveXBtn, '.au-mode__value');
    this.perspectiveXBtn.setAttribute('aria-pressed', 'false');
    this.perspectiveXBtn.addEventListener('click', () => this.setCropMode('perspectiveX'));

    // The active mode pill always sits at the exact centre of the pane, over
    // the fixed gold line of the ruler below. The track slides under it.
    this.modesWrap = el('div', 'au-modes');
    this.modesTrack = el('div', 'au-modes__track');
    this.modesTrack.append(
      this.ratioBtn,
      this.rotationBtn,
      this.perspectiveYBtn,
      this.perspectiveXBtn,
    );
    this.modesWrap.appendChild(this.modesTrack);

    const reset = iconButton('reset', this.s.resetCrop, () => this.resetCropMode());
    reset.classList.add('au-reset');
    this.cropResetBtn = reset;
    top.append(this.modesWrap, reset);
    pane.appendChild(top);

    const context = el('div', 'au-deck__row au-deck__row--context');
    this.ratioContext = el('div', 'au-context is-active');
    this.ratioContext.dataset.context = 'ratio';
    const chipsRail = el('div', 'au-chipsrail');
    const chips = el('div', 'au-chips');
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', this.s.aspect);
    for (const aspect of ASPECTS) {
      const button = el('button', 'au-chip');
      button.type = 'button';
      button.textContent = this.aspectLabel(aspect.id);
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => this.chooseAspect(aspect.id));
      this.aspectButtons.set(aspect.id, button);
      chips.appendChild(button);
    }
    chipsRail.appendChild(chips);
    this.chipsEl = chips;
    this.ratioContext.appendChild(chipsRail);

    this.rotationContext = el('div', 'au-context');
    this.rotationContext.dataset.context = 'rotation';
    this.rotationControl = this.makeTicks({
      label: this.s.rotation,
      min: -180,
      max: 180,
      step: 1,
      tickStep: 3,
      defaultValue: 0,
      zero: true,
      head: false,
      ruler: true,
      format: (value) => `${Math.round(value)}°`,
      onInput: (value) => this.setRotation(value),
      onDragStart: () => this.beginRotationDrag(),
      onDragEnd: () => this.endRotationDrag(),
    });
    this.rotationContext.appendChild(this.rotationControl.row);

    this.perspectiveYContext = el('div', 'au-context');
    this.perspectiveYContext.dataset.context = 'perspectiveY';
    this.perspectiveYControl = this.makeTicks({
      label: this.s.tiltVertical,
      min: -100,
      max: 100,
      step: 1,
      tickStep: 2,
      defaultValue: 0,
      zero: true,
      head: false,
      ruler: true,
      format: (value) => signed(Math.round(value)),
      onInput: (value) => this.setPerspective({ perspectiveY: value }),
    });
    this.perspectiveYControl.rail.addEventListener('dblclick', () => {
      this.setPerspective({ perspectiveY: 0 }, 'perspective');
    });
    this.perspectiveYContext.appendChild(this.perspectiveYControl.row);

    this.perspectiveXContext = el('div', 'au-context');
    this.perspectiveXContext.dataset.context = 'perspectiveX';
    this.perspectiveXControl = this.makeTicks({
      label: this.s.tiltHorizontal,
      min: -100,
      max: 100,
      step: 1,
      tickStep: 2,
      defaultValue: 0,
      zero: true,
      head: false,
      ruler: true,
      format: (value) => signed(Math.round(value)),
      onInput: (value) => this.setPerspective({ perspectiveX: value }),
    });
    this.perspectiveXControl.rail.addEventListener('dblclick', () => {
      this.setPerspective({ perspectiveX: 0 }, 'perspective');
    });
    this.perspectiveXContext.appendChild(this.perspectiveXControl.row);

    context.append(
      this.ratioContext,
      this.rotationContext,
      this.perspectiveYContext,
      this.perspectiveXContext,
    );
    pane.appendChild(context);
  }

  private buildAdjustPane(pane: HTMLElement): void {
    const top = el('div', 'au-deck__row au-deck__row--top au-deck__row--adjust');

    // Auto is an action, not a slider: keep it fixed while the parameter rail
    // scrolls underneath. It only writes scalar sliders, so the result stays
    // undoable and every value can still be tuned by hand.
    this.autoBtn = el('button', 'au-auto au-glass au-glass--gold');
    this.autoBtn.type = 'button';
    this.autoBtn.title = this.s.autoTitle;
    this.autoBtn.setAttribute('aria-label', this.s.autoTitle);
    this.autoBtn.innerHTML = `${icon('auto')}<span data-auto-label></span>`;
    this.autoLabel = q<HTMLElement>(this.autoBtn, '[data-auto-label]');
    this.autoLabel.textContent = this.s.auto;
    this.autoBtn.addEventListener('click', () => void this.runAuto());

    const params = el('div', 'au-params');
    this.paramsEl = params;
    params.setAttribute('role', 'group');
    params.setAttribute('aria-label', this.s.adjustTitle);
    for (const group of ADJUST_GROUPS) {
      const sep = el('span', 'au-param-sep');
      sep.dataset.group = group.id;
      const label = el('b');
      label.textContent = this.s[group.label];
      sep.appendChild(label);
      params.appendChild(sep);
      for (const key of group.keys) {
        const button = el('button', 'au-param');
        button.type = 'button';
        button.dataset.adjust = key;
        button.textContent = this.s[ADJUST_SHORT[key]];
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => this.selectAdjust(key));
        this.adjustButtons.set(key, button);
        params.appendChild(button);
      }
      if (group.id === 'shape') {
        const liquify = el('button', 'au-param au-param--liquify');
        liquify.type = 'button';
        liquify.title = this.s.liquifyTitle;
        liquify.setAttribute('aria-label', this.s.liquifyTitle);
        liquify.setAttribute('aria-pressed', 'false');
        liquify.innerHTML = `${icon('liquify')}<span>${this.s.liquify}</span>`;
        liquify.addEventListener('click', () => this.setLiquify(!this.liquifyOn));
        this.liquifyButton = liquify;
        params.appendChild(liquify);
      }
    }

    this.adjustValue = el('button', 'au-value au-glass au-glass--gold');
    this.adjustValue.type = 'button';
    this.adjustValue.addEventListener('click', () => this.resetAdjust(this.adjustKey));
    top.append(this.autoBtn, params, this.adjustValue);
    pane.appendChild(top);

    const context = el('div', 'au-deck__row au-deck__row--context');
    this.adjustContext = context;
    this.adjustTicks = this.makeTicks({
      label: this.s[this.adjustKey],
      min: -100,
      max: 100,
      step: 1,
      tickStep: 2,
      defaultValue: 0,
      zero: true,
      head: false,
      ruler: true,
      format: (value) => this.formatAdjust(value),
      onInput: (value) => this.setAdjust(this.adjustKey, value),
    });
    context.appendChild(this.adjustTicks.row);
    pane.appendChild(context);

    // Liquify replaces the value ruler with a brush-size ruler. Same height,
    // so entering the mode cannot resize the stage or move the photo.
    const liquifyContext = el('div', 'au-deck__row au-deck__row--context au-liquify-row');
    liquifyContext.style.display = 'none';
    this.liquifyContext = liquifyContext;
    this.liquifyTicks = this.makeTicks({
      label: this.s.brushSize,
      min: 1,
      max: 20,
      step: 1,
      tickStep: 1,
      defaultValue: this.liquifySize,
      head: false,
      ruler: false,
      format: (value) => `${Math.round(value)}%`,
      onInput: (value) => this.setLiquifySize(value, false),
      onReset: () => this.setLiquifySize(5),
    });
    this.liquifyValue = el('button', 'au-value au-glass au-glass--gold');
    this.liquifyValue.type = 'button';
    this.liquifyValue.textContent = `${this.liquifySize}%`;
    this.liquifyValue.title = `${this.s.reset}: ${this.s.brushSize}`;
    this.liquifyValue.setAttribute('aria-label', `${this.s.reset}: ${this.s.brushSize}`);
    this.liquifyValue.addEventListener('click', () => this.setLiquifySize(5));
    const clear = iconButton('reset', this.s.clearLiquify, () => this.clearLiquifyDabs());
    clear.classList.add('au-reset');
    liquifyContext.append(this.liquifyTicks.row, this.liquifyValue, clear);
    pane.appendChild(liquifyContext);
    this.selectAdjust(this.adjustKey);
  }

  private buildFilterPane(pane: HTMLElement): void {
    // Gọn: nút reset nằm cố định đầu danh sách (không còn top row)

    // Category chips — Meitu / Xingtu / Lightroom / Mono / Chuẩn
    const cats = el('div', 'au-chips au-filter-cats');
    cats.setAttribute('role', 'group');
    cats.setAttribute('aria-label', this.s.filterTitle);
    type CatId = PresetCategory | 'all';
    const catDefs: { id: CatId; label: keyof UIStrings }[] = [
      { id: 'all', label: 'catAll' },
      { id: 'root', label: 'catRoot' },
      { id: 'meitu', label: 'catMeitu' },
      { id: 'xingtu', label: 'catXingtu' },
      { id: 'lr', label: 'catLr' },
      { id: 'mono', label: 'catMono' },
    ];
    for (const def of catDefs) {
      const btn = el('button', 'au-chip');
      btn.type = 'button';
      btn.textContent = this.s[def.label];
      btn.setAttribute('aria-pressed', String(this.filterCat === def.id));
      btn.addEventListener('click', () => {
        this.filterCat = def.id;
        for (const child of Array.from(cats.children)) {
          child.setAttribute('aria-pressed', String(child === btn));
        }
        this.buildFilters();
      });
      cats.appendChild(btn);
    }
    this.filterCats = cats;
    pane.appendChild(cats);

    // Hint line for the selected tone (Apple design §16 Simplicity: specific labels)
    const hint = el('div', 'au-tone-hint');
    hint.setAttribute('aria-live', 'polite');
    this.filterHint = hint;
    pane.appendChild(hint);

    const context = el('div', 'au-deck__row au-deck__row--context au-deck__row--filters');
    this.filterWrap = el('div', 'au-filters');
    this.filterWrap.setAttribute('role', 'group');
    this.filterWrap.setAttribute('aria-label', this.s.filterTitle);
    context.appendChild(this.filterWrap);
    pane.appendChild(context);

    // --- Tune per tone: sliders that write Adjust (stack on the preset, saveable) ---
    // Collapsible to keep Filter deck compact (Apple Simplicity: show common path first)
    const tune = el('div', 'au-tune au-collapsible');
    tune.setAttribute('aria-label', this.s.tuneTitle);
    const tuneHead = el('button', 'au-tune__head au-collapsible__head');
    tuneHead.type = 'button';
    tuneHead.setAttribute('aria-expanded', 'false');
    const tuneTitle = el('span', 'au-tune__title');
    tuneTitle.textContent = this.s.tuneTitle;
    const tuneHint = el('span', 'au-tune__hint');
    tuneHint.textContent = this.s.tuneHint;
    const tuneBody = el('div', 'au-collapsible__body');
    tuneBody.hidden = true;
    const tuneChevron = el('span', 'au-chev');
    tuneChevron.textContent = '▾';
    tuneHead.append(tuneTitle, tuneHint, tuneChevron);
    const tuneReset = el('button', 'au-chip au-tune__reset');
    tuneReset.type = 'button';
    tuneReset.textContent = this.s.tuneReset;
    tuneReset.addEventListener('click', (e) => {
      e.stopPropagation();
      for (const key of (['brightness','contrast','saturation','warmth','tint','vignette','vibrance'] as const)) {
        this.setAdjust(key, key === 'vignette' ? 0 : 0);
      }
      this.syncTuneUI();
    });
    const tuneRow = el('div', 'au-tune__row');
    const tuneChips = el('div', 'au-params au-tune__chips');
    const tuneKeys: (keyof Adjustments)[] = ['brightness','contrast','saturation','warmth','tint','vibrance','vignette'];
    const keyLabels: Record<keyof Adjustments, keyof UIStrings> = {
      brightness: 'brightnessShort', contrast: 'contrastShort', saturation: 'saturationShort',
      warmth: 'warmthShort', tint: 'tintShort', vibrance: 'vibranceShort', vignette: 'vignetteShort',
    } as any;
    // Use localized labels via s, fallback to key
    for (const key of tuneKeys) {
      const b = el('button', 'au-param');
      b.type = 'button';
      b.dataset.tune = key;
      const short = (this.s as any)[keyLabels[key]] as string | undefined;
      b.textContent = short ?? key;
      b.setAttribute('aria-pressed', String(key === this.filterTuneKey));
      b.addEventListener('click', () => this.selectFilterTune(key));
      this.filterTuneButtons.set(key, b);
      tuneChips.appendChild(b);
    }
    this.filterTuneValue = el('button', 'au-value au-glass au-glass--gold');
    this.filterTuneValue.type = 'button';
    this.filterTuneValue.setAttribute('aria-label', this.s.tuneTitle);
    this.filterTuneValue.addEventListener('click', () => {
      // double-purpose: tap value resets current tune key (like Adjust)
      this.resetAdjust(this.filterTuneKey);
      this.syncTuneUI();
    });
    tuneRow.append(tuneChips, this.filterTuneValue);
    const tuneContext = el('div', 'au-tune__slider');
    this.filterTuneTicks = this.makeTicks({
      label: this.s.tuneTitle,
      min: -100, max: 100, step: 1, tickStep: 2, defaultValue: 0,
      zero: true, head: false, ruler: true,
      format: (v) => this.formatTune(v),
      onInput: (v) => {
        if (this.filterTuneKey === 'vignette') this.setAdjust('vignette', clamp(v, 0, 100));
        else this.setAdjust(this.filterTuneKey, v);
        this.syncTuneUI();
      },
    });
    tuneContext.appendChild(this.filterTuneTicks.row);
    // Saved head inside Tune (user request: put ĐÃ LƯU + Lưu into Tùy chỉnh)
    const savedHead = el('div', 'au-saved__head au-saved__head--inline');
    const savedTitle = el('span', 'au-saved__title');
    savedTitle.textContent = this.s.savedPresets;
    const nameInput = document.createElement('input');
    nameInput.className = 'au-saved__input';
    nameInput.type = 'text';
    nameInput.maxLength = 32;
    nameInput.spellcheck = false;
    nameInput.autocomplete = 'off';
    nameInput.setAttribute('aria-label', this.s.presetName);
    nameInput.placeholder = this.s.presetName;
    const saveBtn = el('button', 'au-save-preset au-glass au-glass--gold');
    saveBtn.type = 'button';
    saveBtn.innerHTML = `${icon('bookmark')}<span>${this.s.savePreset}</span>`;
    saveBtn.setAttribute('aria-label', this.s.savePreset);
    saveBtn.addEventListener('click', () => this.saveCurrentPreset(nameInput));
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.saveCurrentPreset(nameInput);
    });
    savedHead.append(savedTitle, nameInput, saveBtn);
    const hiddenList = el('div', 'au-saved__list');
    hiddenList.style.display = 'none';
    this.savedList = hiddenList;
    this.savedWrap = hiddenList;
    this.filterNameInput = nameInput;
    this.filterSaveBtn = saveBtn;
    tuneBody.append(savedHead, hiddenList, tuneReset, tuneRow, tuneContext);
    tuneHead.addEventListener('click', (e) => {
      // Keep Reset clickable without toggling
      if ((e.target as HTMLElement).closest('.au-tune__reset')) return;
      const open = tuneBody.hidden;
      tuneBody.hidden = !open;
      tuneHead.setAttribute('aria-expanded', String(open));
      tuneChevron.textContent = open ? '▴' : '▾';
      tune.classList.toggle('is-open', open);
      if (open) window.requestAnimationFrame(() => this.selectFilterTune(this.filterTuneKey));
    });
    this.filterTuneWrap = tune;
    tune.append(tuneHead, tuneBody);
    pane.appendChild(tune);
    this.selectFilterTune(this.filterTuneKey);
  }

  private selectFilterTune(key: keyof Adjustments): void {
    this.filterTuneKey = key;
    for (const [id, btn] of this.filterTuneButtons) {
      btn.setAttribute('aria-pressed', String(id === key));
    }
    const [min, max] = ADJUST_RANGES[key];
    this.filterTuneTicks.setRange(min, max, 1, 2, min < 0);
    this.filterTuneTicks.setLabel(`${this.s.tuneTitle} · ${key}`);
    const state = this.isReady ? this.getState() : null;
    const value = state ? Math.round(state.adjust[key]) : 0;
    this.filterTuneTicks.set(value, false);
    this.syncTuneUI();
    // Center chip
    const btn = this.filterTuneButtons.get(key);
    if (btn) {
      window.requestAnimationFrame(() => {
        const rail = btn.parentElement as HTMLElement | null;
        if (!rail) return;
        const r = btn.getBoundingClientRect();
        const rr = rail.getBoundingClientRect();
        if (!r.width || !rr.width) return;
        const delta = r.left - rr.left - (rr.width - r.width) / 2;
        if (Math.abs(delta) > 1) rail.scrollBy({ left: delta, behavior: 'smooth' });
      });
    }
  }

  private formatTune(value: number): string {
    const [min] = ADJUST_RANGES[this.filterTuneKey];
    return min >= 0 ? String(Math.round(value)) : signed(Math.round(value));
  }

  private syncTuneUI(): void {
    if (!this.isReady || !this.filterTuneTicks) return;
    const state = this.getState();
    const active = document.activeElement;
    const value = Math.round(state.adjust[this.filterTuneKey]);
    if (active !== this.filterTuneTicks.rail) this.filterTuneTicks.set(value, false);
    if (this.filterTuneValue) this.filterTuneValue.textContent = this.formatTune(value);
  }

  // ---------------------------------------------------------------- text pane
  private buildTextPane(pane: HTMLElement): void {
    // Compact: quick-row is the entry — plus icon toggles place mode
    // Keep a hidden input for compatibility (fully controlled via overlay editor)
    const input = document.createElement('textarea');
    input.className = 'au-text-input';
    input.style.display = 'none';
    input.rows = 1;
    input.maxLength = 120;
    input.spellcheck = false;
    input.setAttribute('aria-label', this.s.textInput);
    input.placeholder = this.s.textInput;
    input.addEventListener('input', () => {
      const layer = this.selectedLayer();
      if (!layer) return;
      layer.text = input.value;
      this.positionTexts();
      this.syncTextLayerEl(layer);
    });
    this.textInput = input;
    pane.appendChild(input);

    // Quick styles — Meitu style single-tap presets (Apple: Familiarity + Craft)
    const quick = el('div', 'au-quick-styles');
    const quickRow = el('div', 'au-quick-row');
    // Place-mode toggle: tap to enable; next tap on photo creates a text there.
    const placeBtn = el('button', 'au-quick-chip au-quick-chip--icon');
    placeBtn.type = 'button';
    placeBtn.innerHTML = `${icon('plus')}<span>${this.locale === 'vi' ? 'Chạm đặt' : 'Place'}</span>`;
    placeBtn.setAttribute('aria-pressed', 'false');
    placeBtn.title = this.locale === 'vi' ? 'Bật chế độ: chạm vào ảnh để đặt chữ' : 'Toggle: tap photo to place text';
    placeBtn.addEventListener('click', () => {
      this.textPlacing = !this.textPlacing;
      placeBtn.setAttribute('aria-pressed', String(this.textPlacing));
      placeBtn.classList.toggle('is-active', this.textPlacing);
      this.root.classList.toggle('au-text-placing', this.textPlacing);
      this.toast(this.textPlacing ? (this.locale === 'vi' ? 'Chạm vào ảnh để đặt chữ mới' : 'Tap photo to place text') : (this.locale === 'vi' ? 'Tắt chế độ đặt chữ' : 'Place mode off'), false);
    });
    this.textPlaceBtn = placeBtn;
    quickRow.appendChild(placeBtn);
    const styleDefs = [
      { id: 'title', label: this.s.textStyleTitle },
      { id: 'bold', label: this.s.textStyleTitle2 },
      { id: 'caption', label: this.s.textStyleCaption },
      { id: 'outline', label: this.s.textStyleOutline },
    ];
    for (const def of styleDefs) {
      const b = el('button', 'au-quick-chip');
      b.type = 'button';
      b.textContent = def.label;
      b.dataset.style = def.id;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        const layer = this.selectedLayer();
        if (!layer) return;
        applyTextStyle(layer, def.id);
        for (const child of Array.from(quickRow.children)) child.setAttribute('aria-pressed', String(child === b));
        this.syncTextControls(layer);
        this.syncTextLayerEl(layer);
        this.positionTexts();
      });
      quickRow.appendChild(b);
    }
    quick.appendChild(quickRow);
    pane.appendChild(quick);

    // Font + color row
    const meta = el('div', 'au-text-meta');
    const fontSeg = el('div', 'au-seg au-text-fonts');
    fontSeg.setAttribute('role', 'group');
    fontSeg.setAttribute('aria-label', this.s.textStyleTitle);
    for (const font of TEXT_FONTS.slice(0, 5)) {
      const b = el('button', 'au-font-btn');
      b.type = 'button';
      b.textContent = font.label;
      b.style.fontFamily = font.stack;
      b.dataset.font = font.id;
      b.setAttribute('aria-pressed', String(font.id === 'sys'));
      b.addEventListener('click', () => {
        const layer = this.selectedLayer();
        if (!layer) return;
        layer.font = font.id;
        for (const child of Array.from(fontSeg.children)) child.setAttribute('aria-pressed', String(child === b));
        this.syncTextLayerEl(layer);
      });
      fontSeg.appendChild(b);
    }
    const colorWrap = el('label', 'au-text-color');
    const colorDot = el('span', 'au-text-colordot');
    colorDot.style.background = '#ffffff';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#ffffff';
    colorInput.setAttribute('aria-label', this.s.textColor);
    colorInput.addEventListener('input', () => {
      const layer = this.selectedLayer();
      if (!layer) return;
      layer.color = colorInput.value;
      colorDot.style.background = colorInput.value;
      this.syncTextLayerEl(layer);
    });
    const colorLabel = el('span');
    colorLabel.textContent = this.s.textColor;
    colorWrap.append(colorDot, colorInput, colorLabel);
    meta.append(fontSeg, colorWrap);
    pane.appendChild(meta);

    const toggles = el('div', 'au-text-toggles');
    const mkToggle = (label: string, get: () => boolean, set: (v: boolean) => void) => {
      const b = el('button', 'au-chip');
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('aria-pressed', String(get()));
      b.addEventListener('click', () => {
        set(!get());
        b.setAttribute('aria-pressed', String(get()));
        const layer = this.selectedLayer();
        if (layer) this.syncTextLayerEl(layer);
      });
      toggles.appendChild(b);
      return b;
    };
    mkToggle(this.s.bold, () => this.selectedLayer()?.bold ?? false, (v) => { const l = this.selectedLayer(); if (l) l.bold = v; });
    mkToggle(this.s.italic, () => this.selectedLayer()?.italic ?? false, (v) => { const l = this.selectedLayer(); if (l) l.italic = v; });
    mkToggle(this.s.outline, () => this.selectedLayer()?.outline ?? false, (v) => { const l = this.selectedLayer(); if (l) l.outline = v; });
    mkToggle(this.s.shadow, () => this.selectedLayer()?.shadow ?? true, (v) => { const l = this.selectedLayer(); if (l) l.shadow = v; });
    mkToggle(this.s.textShowFrame, () => this.textShowFrame, (v) => {
      this.textShowFrame = v;
      try { localStorage.setItem('aurum:text-frame', v ? '1' : '0'); } catch {}
      const layer = this.selectedLayer();
      if (layer) this.syncTextLayerEl(layer);
      // refresh all nodes
      for (const n of Array.from(this.textLayer.querySelectorAll<HTMLElement>('.au-textnode'))) {
        const l = this.texts.find((t) => t.id === n.dataset.textId);
        if (l) this.syncTextLayerStyle(n, l);
      }
    });
    const dup = el('button', 'au-chip');
    dup.type = 'button';
    dup.innerHTML = `${icon('duplicate')}<span>${this.s.duplicateText}</span>`;
    dup.addEventListener('click', () => this.duplicateSelectedText());
    const del = el('button', 'au-chip au-chip--danger');
    del.type = 'button';
    del.innerHTML = `${icon('trash')}<span>${this.s.deleteText}</span>`;
    del.addEventListener('click', () => this.deleteSelectedText());
    toggles.append(dup, del);
    pane.appendChild(toggles);

    // Direct manipulation controls live ON the text (handles). Only opacity stays
    // as a slider — size/rotation are grabbed on the photo (Apple §2).
    const sliders = el('div', 'au-text-sliders');
    // Synced with Adjust/Tune: ruler mode, same tick density (step 2) and tall majors
    this.textOpacityTicks = this.makeTicks({
      label: this.s.textOpacity,
      min: 10, max: 100, step: 1, tickStep: 2, defaultValue: 100, ruler: true,
      format: (v) => `${v}%`,
      onInput: (v) => { const l = this.selectedLayer(); if (l) { l.opacity = v / 100; this.syncTextLayerEl(l); } },
    });
    // Keep stubs for syncTextControls compatibility (hidden)
    this.textSizeTicks = this.makeTicks({
      label: this.s.fontSize, min: 2, max: 24, step: 1, tickStep: 2, defaultValue: 7,
      format: (v) => `${v}%`, onInput: () => {},
    });
    this.textRotateTicks = this.makeTicks({
      label: this.s.textRotate, min: -180, max: 180, step: 1, tickStep: 10, defaultValue: 0, zero: true, ruler: true,
      format: (v) => `${Math.round(v)}°`, onInput: () => {},
    });
    sliders.append(this.textOpacityTicks.row);
    this.textControls = sliders;
    pane.appendChild(sliders);
  }

  // ------------------------------------------------------------------- AI pane
  private buildAIPane(pane: HTMLElement): void {
    // Gọn: bỏ header description, vào thẳng chọn model + thao tác (Apple Simplicity)

    // Model picker — collapsible, ISNet default (user choice: quality)
    const modelColl = el('div', 'au-collapsible au-model-coll');
    const modelHead = el('button', 'au-collapsible__head au-model-head');
    modelHead.type = 'button';
    modelHead.setAttribute('aria-expanded', 'false');
    const modelLabel = el('span', 'au-model-label');
    modelLabel.textContent = this.s.modelLabel;
    this.bgModelLabelEl = modelLabel;
    const modelChev = el('span', 'au-chev');
    modelChev.textContent = '▾';
    modelHead.append(modelLabel, modelChev);
    const modelBody = el('div', 'au-collapsible__body');
    modelBody.hidden = true;
    const seg = el('div', 'au-seg au-model-seg');
    this.bgModelSegEl = seg;
    seg.setAttribute('role', 'group');
    const models: { id: AiModelId; label: keyof UIStrings; detail: keyof UIStrings; recommended?: boolean }[] = [
      { id: 'isnet-fp16', label: 'modelQuality', detail: 'modelDetailQuality', recommended: true },
      { id: 'birefnet-lite-512-fp16', label: 'modelBalanced', detail: 'modelDetailBalanced' },
      { id: 'modnet-fp16', label: 'modelFast', detail: 'modelDetailFast' },
    ];
    for (const m of models) {
      const b = el('button', 'au-model-btn');
      b.type = 'button';
      b.dataset.model = m.id;
      b.setAttribute('aria-pressed', String(this.bgModel === m.id));
      const name = el('span', 'au-model-btn__name');
      name.textContent = this.s[m.label];
      const det = el('span', 'au-model-btn__detail');
      det.textContent = this.s[m.detail];
      b.append(name, det);
      if (m.recommended) {
        const badge = el('span', 'au-model-btn__badge');
        badge.textContent = this.s.modelRecommended || 'Khuyến nghị';
        b.appendChild(badge);
      }
      b.addEventListener('click', () => {
        this.bgModel = m.id;
        try { localStorage.setItem('aurum:ai-model', m.id); } catch {}
        for (const child of Array.from(seg.children)) child.setAttribute('aria-pressed', String(child === b));
        if (this.bgModelDetail) {
          const d = models.find((x) => x.id === m.id);
          if (d) this.bgModelDetail.textContent = `${this.s[d.label]} · ${this.s[d.detail]}`;
        }
      });
      this.bgModelButtons.set(m.id, b);
      seg.appendChild(b);
    }
    modelBody.append(seg);
    this.bgModelDetail = el('div', 'au-model-detail');
    const initD = models.find((x) => x.id === this.bgModel) ?? models[0];
    this.bgModelDetail.textContent = `${this.s[initD.label]} · ${this.s[initD.detail]}`;
    modelBody.append(this.bgModelDetail);
    modelHead.addEventListener('click', () => {
      const open = modelBody.hidden;
      modelBody.hidden = !open;
      modelHead.setAttribute('aria-expanded', String(open));
      modelChev.textContent = open ? '▴' : '▾';
      modelColl.classList.toggle('is-open', open);
    });
    modelColl.append(modelHead, modelBody);
    pane.appendChild(modelColl);

    const list = el('div', 'au-ai-pane__list au-ai-pane__list--row');
    this.bgListEl = list;
    const mkBtn = (mode: BackgroundMode, label: string, icn: IconName, primary = false) => {
      const row = el('button', `au-ai-pill ${primary ? 'is-primary' : ''}`);
      row.type = 'button';
      row.innerHTML = `${icon(icn)}<span>${escHtml(label)}</span>`;
      row.setAttribute('aria-label', label);
      row.addEventListener('click', () => void this.runBackground(mode));
      list.appendChild(row);
    };
    mkBtn('remove', this.s.bgRemoveShort, 'eraser', true);
    mkBtn('person', this.s.bgPersonShort, 'bg');
    mkBtn('blur', this.s.bgBlurShort, 'filter');
    mkBtn('replace', this.s.bgReplaceShort, 'image');
    // Divider giống Tinh chỉnh: hairline + caption Retouch
    const sep = el('span', 'au-param-sep');
    sep.dataset.group = 'retouch';
    const sepLabel = el('b');
    sepLabel.textContent = this.s.retouchTitle;
    sep.appendChild(sepLabel);
    list.appendChild(sep);
    const mkRetouch = (mode: RetouchMode, label: string, icn: IconName, primary = false) => {
      const row = el('button', `au-ai-pill ${primary ? 'is-primary' : ''}`);
      row.type = 'button';
      row.innerHTML = `${icon(icn)}<span>${escHtml(label)}</span>`;
      row.setAttribute('aria-label', label);
      row.addEventListener('click', () => void this.runRetouch(mode));
      list.appendChild(row);
    };
    mkRetouch('whiten', this.s.retouchWhiten, 'wand', true);
    mkRetouch('smooth', this.s.retouchSmooth, 'filter');
    mkRetouch('blemish', this.s.retouchBlemish, 'brush');
    mkRetouch('tone', this.s.retouchTone, 'contrast');
    this.retouchListEl = list;
    this.retouchLabelEl = sep;
    if (!this.backgroundAction) {
      const note = el('div', 'au-ai-pane__note');
      note.textContent = this.s.bgNeedHost;
      list.appendChild(note);
    }
    pane.appendChild(list);

    // Mask toolbar (visible when refineOn)
    const toolbar = el('div', 'au-mask-tools');
    toolbar.style.display = 'none';
    const toolLabel = el('div', 'au-mask-tools__label');
    toolLabel.textContent = this.s.brushLabel;
    const modeSeg = el('div', 'au-seg au-mask-seg');
    modeSeg.setAttribute('role', 'group');
    const addBtn = el('button', 'au-mask-btn');
    addBtn.type = 'button';
    addBtn.innerHTML = `${icon('brush')}<span>${this.s.brushAdd}</span>`;
    addBtn.setAttribute('aria-pressed', 'true');
    const eraseBtn = el('button', 'au-mask-btn');
    eraseBtn.type = 'button';
    eraseBtn.innerHTML = `${icon('eraser')}<span>${this.s.brushErase}</span>`;
    eraseBtn.setAttribute('aria-pressed', 'false');
    addBtn.addEventListener('click', () => {
      this.brushMode = 'add';
      addBtn.setAttribute('aria-pressed', 'true');
      eraseBtn.setAttribute('aria-pressed', 'false');
    });
    eraseBtn.addEventListener('click', () => {
      this.brushMode = 'erase';
      eraseBtn.setAttribute('aria-pressed', 'true');
      addBtn.setAttribute('aria-pressed', 'false');
    });
    modeSeg.append(addBtn, eraseBtn);
    const quickRow = el('div', 'au-mask-quickrow');
    const undoBtn = el('button', 'au-chip');
    undoBtn.type = 'button';
    undoBtn.innerHTML = `${icon('undo')}<span>${this.s.brushUndo}</span>`;
    undoBtn.addEventListener('click', () => this.refineUndo());
    const invertBtn = el('button', 'au-chip');
    invertBtn.type = 'button';
    invertBtn.innerHTML = `${icon('contrast')}<span>${this.s.brushInvert}</span>`;
    invertBtn.setAttribute('aria-label', this.s.brushInvert);
    invertBtn.title = this.s.brushInvert;
    invertBtn.addEventListener('click', () => this.refineInvert());
    const transparentBtn = el('button', 'au-chip');
    transparentBtn.type = 'button';
    transparentBtn.innerHTML = `${icon('layers')}<span>${this.s.brushTransparent}</span>`;
    transparentBtn.setAttribute('aria-pressed', 'false');
    transparentBtn.setAttribute('aria-label', this.s.brushTransparent);
    transparentBtn.title = this.s.brushTransparent;
    transparentBtn.addEventListener('click', () => this.refineToggleTransparent());
    this.maskTransparentBtn = transparentBtn;
    quickRow.append(undoBtn, invertBtn, transparentBtn);
    const hint = el('div', 'au-mask-hint');
    hint.textContent = this.s.brushHint;
    this.maskBrushTicks = this.makeTicks({
      label: this.s.brushSizeMask,
      min: 1, max: 30, step: 1, tickStep: 2, defaultValue: this.brushSize,
      format: (v) => `${Math.round(v)}px`,
      onInput: (v) => { this.brushSize = Math.round(v); },
    });
    const actions = el('div', 'au-mask-actions');
    const cancelBtn = el('button', 'au-chip au-chip--danger');
    cancelBtn.type = 'button';
    cancelBtn.innerHTML = `<span>${this.s.brushCancel}</span>`;
    cancelBtn.addEventListener('click', () => this.cancelRefine());
    const applyBtn = el('button', 'au-primary au-mask-apply');
    applyBtn.type = 'button';
    applyBtn.innerHTML = `<span>${this.s.brushApply}</span>`;
    applyBtn.addEventListener('click', () => void this.applyRefine());
    actions.append(cancelBtn, applyBtn);
    toolbar.append(toolLabel, modeSeg, quickRow, hint, this.maskBrushTicks.row, actions);
    this.maskToolbar = toolbar;
    pane.appendChild(toolbar);
  }

  // ------------------------------------------------------------ mask refine
  private brushDabLocal(cx: number, cy: number, radius: number, strength: number): void {
    if (!this.refineMask) return;
    const w = this.refineMaskWidth, h = this.refineMaskHeight;
    const data = this.refineMask;
    const r = Math.max(1, radius);
    const x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(w - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(h - 1, Math.ceil(cy + r));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx, dy = y - cy;
        const d = Math.sqrt(dx * dx + dy * dy) / r;
        if (d >= 1) continue;
        const t = 1 - d;
        const fall = t * t * (3 - 2 * t);
        const i = y * w + x;
        const v = strength * fall;
        data[i] = this.brushMode === 'add' ? Math.min(1, (data[i] ?? 0) + v) : Math.max(0, (data[i] ?? 0) - v);
      }
    }
  }

  private resizeMaskLocal(src: Float32Array, sw: number, sh: number, dw: number, dh: number): Float32Array {
    if (sw === dw && sh === dh) return new Float32Array(src);
    const out = new Float32Array(dw * dh);
    const sx = sw / dw, sy = sh / dh;
    for (let y = 0; y < dh; y++) {
      const fy = (y + 0.5) * sy - 0.5;
      const y0 = Math.max(0, Math.floor(fy)), y1 = Math.min(sh - 1, y0 + 1);
      const ty = Math.min(1, Math.max(0, fy - y0));
      for (let x = 0; x < dw; x++) {
        const fx = (x + 0.5) * sx - 0.5;
        const x0 = Math.max(0, Math.floor(fx)), x1 = Math.min(sw - 1, x0 + 1);
        const tx = Math.min(1, Math.max(0, fx - x0));
        const top = (src[y0 * sw + x0] ?? 0) * (1 - tx) + (src[y0 * sw + x1] ?? 0) * tx;
        const bottom = (src[y1 * sw + x0] ?? 0) * (1 - tx) + (src[y1 * sw + x1] ?? 0) * tx;
        out[y * dw + x] = top * (1 - ty) + bottom * ty;
      }
    }
    return out;
  }

  private drawRefinePreview(): void {
    if (!this.refineOn || !this.refineCanvas || !this.refineSource || !this.refineMask) return;
    const canvas = this.refineCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const stageSize = this.stage.clientWidth || 1;
    const stageH = this.stage.clientHeight || 1;
    const maxSide = 1080;
    const k = Math.min(1, maxSide / Math.max(this.refineWidth, this.refineHeight));
    const w = Math.max(1, Math.round(this.refineWidth * k));
    const h = Math.max(1, Math.round(this.refineHeight * k));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const rect = this.displayCropRect() ?? { x: 0, y: 0, width: stageSize, height: stageH };
    canvas.style.left = `${rect.x}px`;
    canvas.style.top = `${rect.y}px`;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    // checker background (8px cells) — for blur/replace preview uses actual bg
    if (this.refineMode === 'replace') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    } else if (this.refineMode === 'blur') {
      // Blurred background preview (downscale trick, same as engine blur)
      const small = document.createElement('canvas');
      const sw = Math.max(1, w >> 3), sh = Math.max(1, h >> 3);
      small.width = sw; small.height = sh;
      const sctx = small.getContext('2d');
      if (sctx) {
        sctx.imageSmoothingEnabled = true; sctx.imageSmoothingQuality = 'high';
        sctx.drawImage(this.refineSource, 0, 0, this.refineWidth, this.refineHeight, 0, 0, sw, sh);
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(small, 0, 0, w, h);
      }
    } else {
      const cell = Math.max(4, Math.round(w / 24));
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          ctx.fillStyle = (Math.floor(x / cell) + Math.floor(y / cell)) % 2 === 0 ? '#3a3a3f' : '#232327';
          ctx.fillRect(x, y, cell, cell);
        }
      }
    }
    // downscaled mask for preview
    // Composite: bg already drawn on ctx (checker/white/blur, fully opaque),
    // overlay fg with alpha mask. The opaque bg covers the stage's original
    // photo underneath, so transparency (mask=0) shows checker — not the
    // original image bleeding through.
    const pm = this.resizeMaskLocal(this.refineMask, this.refineMaskWidth, this.refineMaskHeight, w, h);
    const fg = document.createElement('canvas');
    fg.width = w; fg.height = h;
    const fctx = fg.getContext('2d');
    if (!fctx) return;
    fctx.drawImage(this.refineSource, 0, 0, this.refineWidth, this.refineHeight, 0, 0, w, h);
    const fgImg = fctx.getImageData(0, 0, w, h);
    const fd = fgImg.data;
    for (let i = 0, j = 0; i < pm.length; i++, j += 4) {
      fd[j + 3] = Math.round(Math.min(1, Math.max(0, pm[i] ?? 0)) * 255);
    }
    fctx.putImageData(fgImg, 0, 0);
    ctx.drawImage(fg, 0, 0);
    // brush ring hint is native cursor; keep pointer-events auto
  }

  private enterRefine(source: CanvasImageSource, w: number, h: number, mask: Float32Array, mw: number, mh: number, mode: BackgroundMode, modelId: string): void {
    this.refineOn = true;
    this.refineSource = source;
    this.refineWidth = w; this.refineHeight = h;
    this.refineMaskWidth = mw; this.refineMaskHeight = mh;
    this.refineMask = new Float32Array(mask);
    this.refineOriginalMask = new Float32Array(mask);
    this.refineMode = mode;
    this.refineBaseMode = mode;
    this.refineModelId = modelId;
    this.refineHistory = [];
    this.syncMaskTransparentBtn();
    if (!this.refineCanvas) {
      const c = document.createElement('canvas');
      c.className = 'au-maskprev';
      c.setAttribute('aria-hidden', 'true');
      // pointer handlers for brush (Apple: 1:1, offset preserved, capture)
      const onDown = (e: PointerEvent) => {
        if (!this.refineOn) return;
        e.preventDefault();
        try { c.setPointerCapture(e.pointerId); } catch {}
        if (this.refineMask) this.refineHistory.push(new Float32Array(this.refineMask));
        if (this.refineHistory.length > 20) this.refineHistory.shift();
        this.refineStroke = { pointerId: e.pointerId, snapshotTaken: true };
        this.brushAt(e);
      };
      const onMove = (e: PointerEvent) => {
        if (!this.refineStroke || this.refineStroke.pointerId !== e.pointerId) return;
        e.preventDefault();
        this.brushAt(e);
      };
      const onUp = () => { this.refineStroke = null; this.drawRefinePreview(); };
      c.addEventListener('pointerdown', onDown);
      c.addEventListener('pointermove', onMove);
      c.addEventListener('pointerup', onUp);
      c.addEventListener('pointercancel', onUp);
      this.stage.appendChild(c);
      this.refineCanvas = c;
    }
    this.refineCanvas.style.display = 'block';
    this.maskToolbar.style.display = 'block';
    // Hide model + action list while refining (dock becomes mask tools only)
    for (const el of [this.bgModelLabelEl, this.bgModelSegEl, this.bgModelDetail, this.bgListEl]) {
      if (el) el.style.display = 'none';
    }
    this.positionTexts();
    this.drawRefinePreview();
    this.showTab('ai');
  }

  private brushAt(e: PointerEvent): void {
    if (!this.refineCanvas || !this.refineMask) return;
    const rect = this.refineCanvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const fx = clamp01((e.clientX - rect.left) / rect.width);
    const fy = clamp01((e.clientY - rect.top) / rect.height);
    const cx = fx * this.refineMaskWidth;
    const cy = fy * this.refineMaskHeight;
    // brush radius in mask px: stage radius proportional to brushSize
    const radius = Math.max(4, (this.brushSize / 100) * Math.min(this.refineMaskWidth, this.refineMaskHeight) * 2);
    this.brushDabLocal(cx, cy, radius, 0.9);
    this.drawRefinePreview();
  }

  private refineUndo(): void {
    const prev = this.refineHistory.pop();
    if (!prev || !this.refineMask) return;
    this.refineMask = prev;
    this.drawRefinePreview();
  }

  private syncMaskTransparentBtn(): void {
    if (!this.maskTransparentBtn) return;
    const transparent = this.refineMode === 'remove' || this.refineMode === 'person';
    this.maskTransparentBtn.setAttribute('aria-pressed', String(transparent));
  }

  private refineInvert(): void {
    if (!this.refineOn || !this.refineMask) return;
    this.refineHistory.push(new Float32Array(this.refineMask));
    if (this.refineHistory.length > 20) this.refineHistory.shift();
    const data = this.refineMask;
    for (let i = 0; i < data.length; i++) {
      data[i] = 1 - (data[i] ?? 0);
    }
    this.drawRefinePreview();
  }

  private refineToggleTransparent(): void {
    if (!this.refineOn || !this.refineMask) return;
    const transparent = this.refineMode === 'remove' || this.refineMode === 'person';
    if (transparent) {
      // Restore the original blur/white mode; if base was already
      // transparent keep it transparent (nothing to restore).
      if (this.refineBaseMode === 'blur' || this.refineBaseMode === 'replace') {
        this.refineMode = this.refineBaseMode;
      }
    } else {
      this.refineMode = 'remove';
    }
    this.syncMaskTransparentBtn();
    this.drawRefinePreview();
  }

  private cancelRefine(): void {
    this.refineOn = false;
    this.refineMask = null;
    this.refineHistory = [];
    if (this.refineCanvas) this.refineCanvas.style.display = 'none';
    if (this.maskToolbar) this.maskToolbar.style.display = 'none';
    for (const el of [this.bgModelLabelEl, this.bgModelSegEl, this.bgModelDetail, this.bgListEl]) {
      if (el) el.style.display = '';
    }
    this.positionTexts();
  }

  private async applyRefine(): Promise<void> {
    if (!this.refineOn || !this.refineSource || !this.refineMask) return;
    const w = this.refineWidth, h = this.refineHeight;
    const fullMask = this.resizeMaskLocal(this.refineMask, this.refineMaskWidth, this.refineMaskHeight, w, h);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Build background
    if (this.refineMode === 'replace') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    } else if (this.refineMode === 'blur') {
      const small = document.createElement('canvas');
      small.width = Math.max(1, w >> 3); small.height = Math.max(1, h >> 3);
      const sctx = small.getContext('2d');
      if (sctx) {
        sctx.imageSmoothingEnabled = true; sctx.imageSmoothingQuality = 'high';
        sctx.drawImage(this.refineSource, 0, 0, this.refineWidth, this.refineHeight, 0, 0, small.width, small.height);
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(small, 0, 0, w, h);
      }
    }
    // Foreground with mask
    const fg = document.createElement('canvas');
    fg.width = w; fg.height = h;
    const fctx = fg.getContext('2d');
    if (!fctx) return;
    fctx.drawImage(this.refineSource, 0, 0);
    const img = fctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0, j = 0; i < fullMask.length; i++, j += 4) {
      d[j + 3] = Math.round(Math.min(1, Math.max(0, fullMask[i] ?? 0)) * 255);
    }
    fctx.putImageData(img, 0, 0);
    ctx.drawImage(fg, 0, 0);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) {
      this.toast(this.s.bgFailed, true);
      return;
    }
    this.cancelRefine();
    await this.load(blob);
    this.showTab('adjust');
    this.toast(this.s.bgDone);
  }

  /**
   * A horizontal ruler of vertical ticks. The selected tick is taller and gold;
   * fast drags leave a short wave behind. Pointer, touch and keyboard share the
   * same value path, so the control stays accessible without a native range.
   */
  private makeTicks(options: {
    label: string;
    min: number;
    max: number;
    step?: number;
    tickStep?: number;
    defaultValue: number;
    zero?: boolean;
    head?: boolean;
    /** Fixed gold centre line; the white tick ruler slides underneath it. */
    ruler?: boolean;
    format: (value: number) => string;
    onInput: (value: number, source: 'pointer' | 'keyboard') => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onReset?: () => void;
  }): TickControl {
    const row = el('div', 'au-ticksrow');
    let headLabel: HTMLElement | null = null;
    let valueEl: HTMLButtonElement | null = null;

    if (options.head) {
      const head = el('div', 'au-slider__head');
      headLabel = el('span', 'au-slider__label');
      headLabel.textContent = options.label;
      valueEl = el('button', 'au-slider__value');
      valueEl.type = 'button';
      valueEl.title = `${this.s.reset}: ${options.label}`;
      valueEl.setAttribute('aria-label', `${this.s.reset}: ${options.label}`);
      valueEl.addEventListener('click', () => options.onReset?.());
      head.append(headLabel, valueEl);
      row.appendChild(head);
    }

    const rail = el('div', 'au-ticks');
    const ruler = options.ruler === true;
    if (ruler) rail.classList.add('au-ticks--ruler');
    rail.tabIndex = 0;
    rail.setAttribute('role', 'slider');
    rail.setAttribute('aria-orientation', 'horizontal');
    rail.setAttribute('aria-label', options.label);
    const track = el('div', 'au-ticks__track');
    track.setAttribute('aria-hidden', 'true');
    rail.appendChild(track);
    if (ruler) {
      const center = el('span', 'au-ticks__center');
      center.setAttribute('aria-hidden', 'true');
      rail.appendChild(center);
    }
    row.appendChild(rail);

    let min = options.min;
    let max = options.max;
    let step = Math.max(0.0001, options.step ?? 1);
    let tickStep = Math.max(step, options.tickStep ?? 5);
    let zero = options.zero ?? false;
    let ticks: HTMLElement[] = [];
    let active = -1;
    let value = options.defaultValue;
    let disabled = false;
    let pointerId: number | null = null;
    let dragStartValue = value;
    let dragStartX = 0;
    let lastHaptic = 0;
    const waveTimers = new WeakMap<HTMLElement, number>();

    const reducedMotion = (): boolean =>
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const quantize = (input: number): number => {
      const snapped = Math.round((input - min) / step) * step + min;
      return clamp(Number(snapped.toFixed(6)), min, max);
    };

    const build = (): void => {
      const count = Math.max(2, Math.round((max - min) / tickStep) + 1);
      track.replaceChildren();
      ticks = [];
      for (let i = 0; i < count; i += 1) {
        const tick = el('span', 'au-tick');
        const tickValue = min + i * tickStep;
        if (zero && Math.abs(tickValue) < tickStep / 2) tick.classList.add('is-zero');
        // Major marks every 5th tick (or at 0) are taller/wider for quick reading
        if (i % 5 === 0 || (zero && Math.abs(tickValue) < tickStep / 2)) tick.classList.add('is-major');
        track.appendChild(tick);
        ticks.push(tick);
      }
      active = -1;
    };

    const indexFor = (input: number): number =>
      clamp(Math.round((input - min) / tickStep), 0, ticks.length - 1);

    const positionRuler = (): void => {
      if (!ruler) return;
      // Anchor on the active tick, not the continuous value: the tick must
      // land exactly under the fixed gold line for every integer step.
      const last = Math.max(1, ticks.length - 1);
      const ratio = clamp((active >= 0 ? active : indexFor(value)) / last, 0, 1);
      track.style.transform = `translate3d(${-ratio * 100}%,-50%,0)`;
    };

    const set = (input: number, animate = false): void => {
      value = clamp(Number.isFinite(input) ? input : min, min, max);
      const index = indexFor(value);
      const previous = active;

      if (index !== previous) {
        if (previous >= 0) ticks[previous]?.classList.remove('is-active');

        if (animate && previous >= 0 && !reducedMotion()) {
          const span = Math.max(1, Math.abs(index - previous));
          const lo = Math.min(previous, index);
          const hi = Math.max(previous, index);
          for (let i = lo; i <= hi; i += 1) {
            if (i === index) continue;
            const tick = ticks[i];
            if (!tick) continue;
            const delay = Math.round((Math.abs(i - previous) / span) * 120);
            tick.style.setProperty('--wave-delay', `${delay}ms`);
            tick.classList.remove('is-wave');
            void tick.offsetWidth;
            tick.classList.add('is-wave');
            const timer = waveTimers.get(tick);
            if (timer) window.clearTimeout(timer);
            waveTimers.set(
              tick,
              window.setTimeout(() => {
                tick.classList.remove('is-wave');
                waveTimers.delete(tick);
              }, 340 + delay),
            );
          }
        }

        const nextTick = ticks[index];
        if (nextTick) {
          nextTick.classList.remove('is-wave');
          const timer = waveTimers.get(nextTick);
          if (timer) {
            window.clearTimeout(timer);
            waveTimers.delete(nextTick);
          }
          nextTick.classList.add('is-active');
        }
        active = index;

        if (animate) {
          const now = performance.now();
          if (now - lastHaptic > 26 && typeof navigator.vibrate === 'function') {
            try {
              navigator.vibrate(3);
            } catch {
              // Vibration is a progressive enhancement only.
            }
            lastHaptic = now;
          }
        }
      }

      rail.setAttribute('aria-valuenow', String(Math.round(value)));
      rail.setAttribute('aria-valuetext', options.format(value));
      if (valueEl) valueEl.textContent = options.format(value);
      positionRuler();
    };

    const setRange = (
      nextMin: number,
      nextMax: number,
      nextStep: number,
      nextTickStep: number,
      nextZero = zero,
    ): void => {
      min = nextMin;
      max = nextMax;
      step = Math.max(0.0001, nextStep);
      tickStep = Math.max(step, nextTickStep);
      zero = nextZero;
      build();
      rail.setAttribute('aria-valuemin', String(min));
      rail.setAttribute('aria-valuemax', String(max));
      set(clamp(value, min, max), false);
    };

    const setLabel = (label: string): void => {
      rail.setAttribute('aria-label', label);
      if (headLabel) headLabel.textContent = label;
    };

    const setDisabled = (next: boolean): void => {
      disabled = next;
      row.classList.toggle('is-disabled', disabled);
      rail.tabIndex = disabled ? -1 : 0;
      rail.setAttribute('aria-disabled', String(disabled));
      if (valueEl) valueEl.disabled = disabled;
      if (disabled) pointerId = null;
    };

    const focus = (): void => {
      rail.focus({ preventScroll: true });
    };

    const valueAt = (clientX: number): number => {
      const rect = rail.getBoundingClientRect();
      const pad = 10;
      const width = Math.max(1, rect.width - pad * 2);
      const ratio = clamp((clientX - rect.left - pad) / width, 0, 1);
      return quantize(min + ratio * (max - min));
    };

    const onPointerDown = (event: PointerEvent): void => {
      if (disabled) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      rail.focus({ preventScroll: true });
      pointerId = event.pointerId;
      dragStartValue = value;
      dragStartX = event.clientX;
      try {
        rail.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is optional on older engines.
      }
      if (!ruler) {
        const next = valueAt(event.clientX);
        set(next, true);
        options.onInput(next, 'pointer');
      }
      options.onDragStart?.();
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (disabled || pointerId !== event.pointerId) return;
      event.preventDefault();
      if (ruler) {
        // The white ruler follows the finger while the gold line stays put.
        const rect = rail.getBoundingClientRect();
        const width = Math.max(1, rect.width - 20);
        const delta = (event.clientX - dragStartX) / width;
        const next = quantize(dragStartValue - delta * (max - min));
        if (Math.abs(next - value) < 0.001) return;
        set(next, true);
        options.onInput(next, 'pointer');
        return;
      }
      const next = valueAt(event.clientX);
      if (Math.abs(next - value) < 0.001) return;
      set(next, true);
      options.onInput(next, 'pointer');
    };

    const onPointerUp = (event: PointerEvent): void => {
      if (pointerId !== event.pointerId) return;
      pointerId = null;
      try {
        rail.releasePointerCapture(event.pointerId);
      } catch {
        // Already released.
      }
      options.onDragEnd?.();
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (disabled) return;
      const big = Math.max(step, step * 10);
      let next = value;
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          next -= step;
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          next += step;
          break;
        case 'PageDown':
          next -= big;
          break;
        case 'PageUp':
          next += big;
          break;
        case 'Home':
          next = min;
          break;
        case 'End':
          next = max;
          break;
        default:
          return;
      }
      event.preventDefault();
      next = quantize(next);
      set(next, true);
      options.onInput(next, 'keyboard');
    };

    rail.addEventListener('pointerdown', onPointerDown);
    rail.addEventListener('pointermove', onPointerMove);
    rail.addEventListener('pointerup', onPointerUp);
    rail.addEventListener('pointercancel', onPointerUp);
    rail.addEventListener('keydown', onKeyDown);

    build();
    rail.setAttribute('aria-valuemin', String(min));
    rail.setAttribute('aria-valuemax', String(max));
    set(clamp(options.defaultValue, min, max), false);

    return { row, rail, set, setRange, setLabel, setDisabled, focus };
  }

  private buildSheet(): void {
    const wrap = el('div', 'au-sheetwrap');
    wrap.setAttribute('aria-hidden', 'true');
    const sheet = el('div', 'au-sheet');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', this.s.exportTitle);

    const offered = FORMATS.filter((format) => this.exportTypes.includes(format.type));
    const formats = offered.map(
      (format) =>
        `<button type="button" data-format="${format.type}" aria-pressed="false">${format.label}</button>`,
    ).join('');
    const hasCopy = Boolean(this.onSaveCopyCb);

    sheet.innerHTML = `
      <div class="au-grabber"></div>
      <div class="au-sheet__title"></div>
      <div class="au-sheet__sub"></div>
      <div class="au-meta">${icon('image')}<div><b data-meta-name></b><span data-meta-info></span></div></div>
      <span class="au-label" data-format-label></span>
      <div class="au-seg" role="group" style="grid-template-columns:repeat(${offered.length},1fr)">${formats}</div>
      <div class="au-slider" data-quality-row></div>
      <div class="au-progress" data-progress hidden>
        <div class="au-progress__head">
          <span class="au-progress__label" data-progress-label></span>
          <span class="au-progress__pct" data-progress-pct>0%</span>
          <button class="au-progress__cancel" type="button" data-progress-cancel></button>
        </div>
        <div class="au-progress__track"><span data-progress-bar></span></div>
      </div>
      <div class="au-sheet__actions${hasCopy ? ' has-copy' : ''}">
        <button class="au-primary" type="button"><span data-save-label></span></button>
        ${hasCopy ? '<button class="au-copy" type="button"><span data-copy-label></span></button>' : ''}
      </div>
      <button class="au-cancel" type="button"></button>
    `;

    q<HTMLElement>(sheet, '.au-sheet__title').textContent = this.s.exportTitle;
    q<HTMLElement>(sheet, '.au-sheet__sub').textContent = this.s.exportSub;
    q<HTMLElement>(sheet, '[data-format-label]').textContent = this.s.format;

    this.metaName = q<HTMLElement>(sheet, '[data-meta-name]');
    this.metaInfo = q<HTMLElement>(sheet, '[data-meta-info]');
    this.qualityRow = q<HTMLElement>(sheet, '[data-quality-row]');
    this.progressEl = q<HTMLElement>(sheet, '[data-progress]');
    this.progressBar = q<HTMLElement>(sheet, '[data-progress-bar]');
    this.progressText = q<HTMLElement>(sheet, '[data-progress-pct]');
    this.progressLabel = q<HTMLElement>(sheet, '[data-progress-label]');
    this.progressCancel = q<HTMLButtonElement>(sheet, '[data-progress-cancel]');
    this.progressCancel.textContent = this.s.cancelExport;
    this.progressCancel.addEventListener('click', () => this.exportAbort?.abort());
    this.qualityControl = this.makeTicks({
      label: this.s.quality,
      min: 10,
      max: 100,
      step: 1,
      tickStep: 3,
      defaultValue: 92,
      head: true,
      format: (value) => `${Math.round(value)}%`,
      onInput: (value) => this.applyQuality(value),
      onReset: () => this.applyQuality(92),
    });
    this.qualityRow.appendChild(this.qualityControl.row);
    this.saveImageBtn = q<HTMLButtonElement>(sheet, '.au-primary');
    this.saveImageBtn.insertAdjacentHTML('afterbegin', icon('save'));
    this.saveLabel = q<HTMLElement>(sheet, '[data-save-label]');
    this.saveLabel.textContent = hasCopy ? this.s.overwrite : this.s.saveImage;
    if (hasCopy) {
      this.saveCopyBtn = q<HTMLButtonElement>(sheet, '.au-copy');
      this.saveCopyBtn.insertAdjacentHTML('afterbegin', icon('copy'));
      this.saveCopyLabel = q<HTMLElement>(sheet, '[data-copy-label]');
      this.saveCopyLabel.textContent = this.s.saveCopy;
    }

    const cancel = q<HTMLButtonElement>(sheet, '.au-cancel');
    cancel.textContent = this.s.cancel;

    for (const format of offered) {
      const button = q<HTMLButtonElement>(sheet, `[data-format="${format.type}"]`);
      button.addEventListener('click', () => {
        this.exportType = format.type;
        this.updateSheet();
      });
      this.formatButtons.set(format.type, button);
    }

    this.saveImageBtn.addEventListener('click', () => void this.saveImage('overwrite'));
    this.saveCopyBtn?.addEventListener('click', () => void this.saveImage('copy'));
    cancel.addEventListener('click', () => this.closeSheet());
    wrap.addEventListener('click', (event) => {
      if (event.target === wrap) this.closeSheet();
    });

    wrap.appendChild(sheet);
    this.root.appendChild(wrap);
    this.sheetWrap = wrap;
    this.applyQuality(92);
  }

  private buildTextLayer(): void {
    const layer = el('div', 'au-textlayer');
    layer.setAttribute('aria-hidden', 'true');
    this.work.appendChild(layer);
    this.textLayer = layer;
  }

  private buildBG(): void {
    const wrap = el('div', 'au-ai au-bg-panel');
    wrap.hidden = true;
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', this.s.bgTitle);
    const panel = el('div', 'au-ai__panel au-glass');
    const head = el('div', 'au-ai__head');
    const badge = el('span', 'au-ai__badge');
    badge.innerHTML = icon('bg');
    const copy = el('div', 'au-ai__copy');
    const title = el('strong');
    title.textContent = this.s.bgRunning;
    const detail = el('span', 'au-ai__detail');
    detail.textContent = this.s.bgRunning;
    copy.append(title, detail);
    head.append(badge, copy);
    const cancel = el('button', 'au-ai__cancel au-glass');
    cancel.type = 'button';
    cancel.textContent = this.s.aiCancel;
    cancel.addEventListener('click', () => this.bgAbort?.abort());
    head.appendChild(cancel);
    panel.appendChild(head);
    wrap.appendChild(panel);
    this.root.appendChild(wrap);
    this.bgPanel = wrap;
    this.bgDetail = detail;
  }

  private buildAI(): void {
    if (!this.aiAction) return;
    const wrap = el('div', 'au-ai');
    wrap.hidden = true;
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', this.s.aiRunning);

    const panel = el('div', 'au-ai__panel au-glass');
    const head = el('div', 'au-ai__head');
    const badge = el('span', 'au-ai__badge');
    badge.innerHTML = icon('ai');
    const copy = el('div', 'au-ai__copy');
    const title = el('strong');
    title.textContent = this.s.aiRunning;
    const detail = el('span', 'au-ai__detail');
    detail.textContent = this.s.aiPreparing;
    copy.append(title, detail);
    head.append(badge, copy);
    const cancel = el('button', 'au-ai__cancel au-glass');
    cancel.type = 'button';
    cancel.textContent = this.s.aiCancel;
    cancel.addEventListener('click', () => this.aiAbort?.abort());
    head.appendChild(cancel);

    const track = el('div', 'au-ai__track');
    const bar = el('span');
    track.appendChild(bar);
    panel.append(head, track);
    wrap.appendChild(panel);
    this.root.appendChild(wrap);
    this.aiPanel = wrap;
    this.aiDetail = detail;
    this.aiBar = bar;
  }

  private reportAI(progress: number, label?: string): void {
    if (!this.aiPanel || this.aiPanel.hidden) return;
    const indeterminate = !Number.isFinite(progress) || progress < 0;
    this.aiPanel.classList.toggle('is-indeterminate', indeterminate);
    this.aiBar.style.width = indeterminate ? '100%' : `${Math.round(clamp(progress, 0, 1) * 100)}%`;
    if (label) this.aiDetail.textContent = label;
    else if (!indeterminate) this.aiDetail.textContent = `${Math.round(progress * 100)}%`;
  }

  // ---------------------------------------------------------- saved filters
  private saveCurrentPreset(nameInput?: HTMLInputElement): void {
    if (!this.isReady) return;
    const input = nameInput ?? this.filterNameInput;
    const name = (input?.value ?? '').trim() || `${this.s.filterTitle} ${new Date().toLocaleTimeString(this.locale === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`;
    if (this.userPresets.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      this.toast(this.s.presetExists, true);
      input?.focus();
      return;
    }
    const st = this.getState();
    const preset: UserPreset = {
      id: `u${Date.now().toString(36)}`,
      name,
      createdAt: Date.now(),
      filter: st.filter,
      adjust: { ...st.adjust },
      enhance: JSON.parse(JSON.stringify(st.enhance)) as EditorState['enhance'],
    };
    this.userPresets = [preset, ...this.userPresets].slice(0, 24);
    storeUserPresets(this.userPresets);
    if (input) input.value = '';
    this.renderSavedPresets();
    this.toast(this.s.presetSaved);
  }

  private renderSavedPresets(): void {
    if (!this.savedList) return;
    this.buildFilters();
  }

  private applyUserPreset(p: UserPreset): void {
    if (!this.isReady) return;
    // Toggle: tap an active saved preset again to turn it off (restore state
    // from before it was applied), so the thumbnail acts as an on/off switch.
    if (this.activeSavedId === p.id) {
      const restore = this.savedReturnState;
      this.activeSavedId = null;
      this.savedReturnState = null;
      if (restore) {
        this.setState(restore);
      } else {
        this.setFilter('original');
      }
      this.syncUI();
      this.buildFilters();
      this.toast(this.s.resetFilter);
      return;
    }
    // First apply: remember where we were so the next tap can toggle back.
    this.savedReturnState = this.getState();
    this.activeSavedId = p.id;
    const current = this.getState();
    const next: EditorState = {
      ...current,
      filter: p.filter,
      adjust: { ...p.adjust },
      enhance: JSON.parse(JSON.stringify(p.enhance)) as EditorState['enhance'],
    };
    this.setState(next);
    this.syncUI();
    this.buildFilters();
    this.toast(this.s.presetApplied);
  }

  // -------------------------------------------------------------------- text
  private selectedLayer(): AurumTextLayer | undefined {
    return this.texts.find((t) => t.id === this.selectedTextId);
  }

  private addTextLayer(): void {
    if (!this.isReady) return;
    const layer = defaultTextLayer();
    // Stagger new texts so repeated taps don't stack exactly.
    const n = this.texts.length;
    layer.x = 0.5 + ((n % 3) - 1) * 0.06;
    layer.y = 0.42 + (n % 4) * 0.08;
    this.texts.push(layer);
    this.selectedTextId = layer.id;
    const node = this.createTextNode(layer);
    this.textLayer.appendChild(node);
    this.syncTextControls(layer);
    this.positionTexts();
    this.openInlineTextEditor(node, layer);
  }

  private createTextNode(layer: AurumTextLayer): HTMLElement {
    const node = el('div', 'au-textnode');
    node.dataset.textId = layer.id;
    node.setAttribute('aria-hidden', 'true');
    const textSpan = document.createElement('span');
    textSpan.className = 'au-text-span';
    textSpan.textContent = layer.text;
    node.appendChild(textSpan);
    // Selection handles (CSS pseudo visual, no layout change on edit)
    const hud = document.createElement('span');
    hud.className = 'au-text-hud';
    hud.setAttribute('aria-hidden', 'true');
    node.appendChild(hud);
    // Direct-manipulation handles: scale (bottom-right) + rotate (top-center) (Apple §2)
    const scaleHandle = document.createElement('span');
    scaleHandle.className = 'au-text-handle au-text-handle--scale';
    scaleHandle.setAttribute('aria-hidden', 'true');
    const rotHandle = document.createElement('span');
    rotHandle.className = 'au-text-handle au-text-handle--rotate';
    rotHandle.setAttribute('aria-hidden', 'true');
    const stem = document.createElement('span');
    stem.className = 'au-text-handle-stem';
    stem.setAttribute('aria-hidden', 'true');
    node.append(stem, scaleHandle, rotHandle);

    const bindHandle = (handle: HTMLElement, kind: 'scale' | 'rotate') => {
      handle.addEventListener('pointerdown', (ev) => {
        if (ev.target !== handle && !handle.contains(ev.target as Node)) return;
        ev.preventDefault(); ev.stopPropagation();
        this.selectedTextId = layer.id; this.syncTextControls(layer);
        try { handle.setPointerCapture(ev.pointerId); } catch {}
        const rect0 = this.displayCropRect();
        const c = rect0 ? { x: rect0.x + layer.x * rect0.width, y: rect0.y + layer.y * rect0.height } : null;
        if (!c || !rect0) return;
        const startX = ev.clientX, startY = ev.clientY;
        const startSize = layer.size, startRot = layer.rotation;
        const startDist = Math.max(1, Math.hypot(ev.clientX - (this.stage.getBoundingClientRect().left + c.x), ev.clientY - (this.stage.getBoundingClientRect().top + c.y)));
        const startAngle = Math.atan2(ev.clientY - (this.stage.getBoundingClientRect().top + c.y), ev.clientX - (this.stage.getBoundingClientRect().left + c.x));
        const move = (e: PointerEvent) => {
          if (e.pointerId !== ev.pointerId) return;
          e.preventDefault(); e.stopPropagation();
          const stageRect = this.stage.getBoundingClientRect();
          const curDist = Math.max(1, Math.hypot(e.clientX - (stageRect.left + c.x), e.clientY - (stageRect.top + c.y)));
          const curAngle = Math.atan2(e.clientY - (stageRect.top + c.y), e.clientX - (stageRect.left + c.x));
          if (kind === 'scale') {
            const scale = curDist / startDist;
            layer.size = clamp(startSize * scale, 0.02, 0.24);
            this.positionTexts();
          } else {
            const dDeg = ((curAngle - startAngle) * 180) / Math.PI;
            layer.rotation = Math.round(((startRot + dDeg + 540) % 360) - 180);
            this.positionTexts();
          }
          void startX; void startY;
        };
        const up = (e: PointerEvent) => {
          if (e.pointerId !== ev.pointerId) return;
          handle.removeEventListener('pointermove', move);
          handle.removeEventListener('pointerup', up);
          handle.removeEventListener('pointercancel', up);
          this.syncTextControls(layer);
        };
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', up);
        handle.addEventListener('pointercancel', up);
      });
    };
    bindHandle(scaleHandle, 'scale');
    bindHandle(rotHandle, 'rotate');
    // Multi-pointer gesture: 1 pointer = drag, 2 pointers = pinch scale + rotate (Apple §2,5,6)
    const pointers = new Map<number, { x: number; y: number }>();
    let gesture: null | {
      mode: 'drag' | 'pinch';
      ox: number; oy: number;
      startOX: number; startOY: number;
      startDist: number; startAngle: number;
      startSize: number; startRot: number;
      midX: number; midY: number;
      lastX: number; lastY: number;
      velX: number; velY: number;
    } = null;
    let lastTap = 0;

    node.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      if (now - lastTap < 320) {
        // Double-tap → edit (Apple §10: only pay disambiguation where double-tap exists)
        this.selectedTextId = layer.id;
        this.syncTextControls(layer);
        this.openInlineTextEditor(node, layer);
        lastTap = 0;
        return;
      }
      lastTap = now;
      this.selectedTextId = layer.id;
      this.syncTextControls(layer);
      try { node.setPointerCapture(event.pointerId); } catch { /* best-effort */ }
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.size === 1) {
        gesture = {
          mode: 'drag',
          ox: event.clientX, oy: event.clientY,
          startOX: layer.x, startOY: layer.y,
          startDist: 0, startAngle: 0, startSize: layer.size, startRot: layer.rotation,
          midX: event.clientX, midY: event.clientY,
          lastX: event.clientX, lastY: event.clientY, velX: 0, velY: 0,
        };
      } else if (pointers.size === 2) {
        const [a, b] = Array.from(pointers.values());
        const dx = b.x - a.x, dy = b.y - a.y;
        gesture = {
          mode: 'pinch',
          ox: 0, oy: 0,
          startOX: layer.x, startOY: layer.y,
          startDist: Math.max(1, Math.hypot(dx, dy)),
          startAngle: Math.atan2(dy, dx),
          startSize: layer.size, startRot: layer.rotation,
          midX: (a.x + b.x) / 2, midY: (a.y + b.y) / 2,
          lastX: event.clientX, lastY: event.clientY, velX: 0, velY: 0,
        };
      }
    });

    node.addEventListener('pointermove', (event) => {
      if (!gesture) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const rect = this.displayCropRect();
      if (!rect || rect.width < 2 || rect.height < 2) return;
      if (gesture.mode === 'drag') {
        // 1:1 tracking with grab offset (respect where grabbed)
        const dx = event.clientX - gesture.ox;
        const dy = event.clientY - gesture.oy;
        // Rubber-band at edges (Apple §9): progressive resistance, not hard clamp during drag
        let nx = gesture.startOX + dx / rect.width;
        let ny = gesture.startOY + dy / rect.height;
        // soft clamp with rubberband factor
        nx = nx < 0 ? nx * 0.55 : nx > 1 ? 1 + (nx - 1) * 0.55 : nx;
        ny = ny < 0 ? ny * 0.55 : ny > 1 ? 1 + (ny - 1) * 0.55 : ny;
        layer.x = clamp01(nx);
        layer.y = clamp01(ny);
        // velocity for handoff (Apple §5)
        gesture.velX = event.clientX - gesture.lastX;
        gesture.velY = event.clientY - gesture.lastY;
        gesture.lastX = event.clientX; gesture.lastY = event.clientY;
        this.positionTexts();
      } else if (gesture.mode === 'pinch') {
        const [a, b] = Array.from(pointers.values());
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const angle = Math.atan2(dy, dx);
        const scale = dist / gesture.startDist;
        // Momentum projection for scale (Apple §6, decel 0.998)
        const rawSize = gesture.startSize * scale;
        // Clamp size 2..24% with rubberband beyond
        layer.size = rawSize;
        if (layer.size < 0.02) layer.size = 0.02 + (layer.size - 0.02) * 0.5;
        if (layer.size > 0.24) layer.size = 0.24 + (layer.size - 0.24) * 0.5;
        layer.size = clamp(layer.size, 0.015, 0.30);
        const dDeg = ((angle - gesture.startAngle) * 180) / Math.PI;
        layer.rotation = Math.round(((gesture.startRot + dDeg + 540) % 360) - 180);
        // pan with mid-point movement
        const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
        const mDx = midX - gesture.midX, mDy = midY - gesture.midY;
        layer.x = clamp01(gesture.startOX + mDx / rect.width);
        layer.y = clamp01(gesture.startOY + mDy / rect.height);
        this.positionTexts();
      }
    });

    const endPointer = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size === 0 && gesture) {
        // Settle with spring: critically damped response 0.3s, no overshoot (Apple §4)
        const startSize = layer.size;
        const target = clamp(startSize, 0.02, 0.24);
        if (Math.abs(startSize - target) > 0.001) {
          let v = 0;
          let x = startSize;
          let last = performance.now();
          const tick = (t: number) => {
            const dt = Math.min(0.032, (t - last) / 1000);
            last = t;
            // simple critically damped spring: stiffness 120, damping 2*sqrt
            const stiffness = 120, damping = 22, mass = 1;
            const F = -stiffness * (x - target) - damping * v;
            v += (F / mass) * dt;
            x += v * dt;
            layer.size = x;
            this.positionTexts();
            if (Math.abs(x - target) > 0.0005 || Math.abs(v) > 0.5) requestAnimationFrame(tick);
            else { layer.size = target; this.positionTexts(); }
          };
          requestAnimationFrame(tick);
        }
        // sync sliders after gesture
        this.syncTextControls(layer);
        gesture = null;
      } else if (pointers.size === 1 && gesture) {
        // downgrade pinch → drag with new anchor
        const [p] = Array.from(pointers.values());
        gesture = {
          mode: 'drag', ox: p.x, oy: p.y, startOX: layer.x, startOY: layer.y,
          startDist: 0, startAngle: 0, startSize: layer.size, startRot: layer.rotation,
          midX: p.x, midY: p.y, lastX: p.x, lastY: p.y, velX: 0, velY: 0,
        };
      }
    };
    node.addEventListener('pointerup', endPointer);
    node.addEventListener('pointercancel', endPointer);
    node.addEventListener('dblclick', (e) => {
      e.preventDefault();
      this.selectedTextId = layer.id;
      this.syncTextControls(layer);
      this.openInlineTextEditor(node, layer);
    });
    this.syncTextLayerStyle(node, layer);
    return node;
  }

  private syncTextLayerEl(layer: AurumTextLayer): void {
    const node = this.textLayer?.querySelector<HTMLElement>(`[data-text-id="${layer.id}"]`);
    if (!node) return;
    const span = node.querySelector('.au-text-span');
    if (span) span.textContent = layer.text;
    else node.textContent = layer.text;
    // Re-append handles that textContent wipes
    if (!node.querySelector('.au-text-handle--scale')) {
      // Node was nuked — rebuild handles quickly
      // (Handled lazily by positionTexts; handles re-created on next create)
    }
    this.syncTextLayerStyle(node, layer);
    this.positionTexts();
  }

  // Tap-on-photo to place text + inline editor (Apple direct manipulation)
  private openInlineTextEditor(node: HTMLElement, layer: AurumTextLayer): void {
    // Remove existing inline editor if any
    const existing = node.querySelector('.au-text-inline');
    if (existing) { (existing as HTMLElement).focus(); return; }
    const ta = document.createElement('textarea');
    ta.className = 'au-text-inline';
    ta.value = layer.text;
    ta.rows = 1;
    ta.maxLength = 120;
    ta.spellcheck = false;
    ta.placeholder = this.s.textInput;
    ta.setAttribute('aria-label', this.s.textInput);
    ta.addEventListener('pointerdown', (e) => e.stopPropagation());
    ta.addEventListener('input', () => {
      layer.text = ta.value;
      const span = node.querySelector('.au-text-span');
      if (span) span.textContent = layer.text;
      this.positionTexts();
    });
    const done = () => {
      layer.text = ta.value;
      const span = node.querySelector('.au-text-span');
      if (span) span.textContent = layer.text;
      ta.remove();
      this.syncTextLayerEl(layer);
      this.positionTexts();
    };
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); done(); }
      if (e.key === 'Escape') { e.preventDefault(); done(); }
    });
    ta.addEventListener('blur', done);
    node.appendChild(ta);
    // Position editor over the node, keep keyboard open
    requestAnimationFrame(() => { ta.focus(); ta.select(); });
  }

  private tapToPlaceText = (event: PointerEvent): void => {
    if (this.currentTab !== 'text' || !this.isReady) return;
    // Tap outside text (and not placing) deselects — frame hides unless "Khung chữ" is on
    const target = event.target as HTMLElement | null;
    if (target?.closest('.au-textnode, .au-ticks, .au-tabs, .au-deck')) return;
    if (!this.textPlacing) {
      this.selectedTextId = null;
      for (const n of Array.from(this.textLayer.querySelectorAll<HTMLElement>('.au-textnode'))) {
        const l = this.texts.find((t) => t.id === n.dataset.textId);
        if (l) this.syncTextLayerStyle(n, l);
      }
      return;
    }
    const rect = this.displayCropRect();
    if (!rect) return;
    const stageRect = this.stage.getBoundingClientRect();
    const x = (event.clientX - stageRect.left - rect.x) / rect.width;
    const y = (event.clientY - stageRect.top - rect.y) / rect.height;
    if (x < 0.05 || x > 0.95 || y < 0.05 || y > 0.95) return;
    event.preventDefault();
    const layer = defaultTextLayer();
    layer.x = clamp01(x); layer.y = clamp01(y);
    layer.text = '';
    this.texts.push(layer);
    this.selectedTextId = layer.id;
    const node = this.createTextNode(layer);
    this.textLayer.appendChild(node);
    this.syncTextControls(layer);
    this.positionTexts();
    this.openInlineTextEditor(node, layer);
    // One-shot: placing consumes itself after a successful tap
    this.textPlacing = false;
    this.textPlaceBtn?.setAttribute('aria-pressed', 'false');
    this.textPlaceBtn?.classList.remove('is-active');
    this.root.classList.remove('au-text-placing');
  };

  private syncTextLayerStyle(node: HTMLElement, layer: AurumTextLayer): void {
    const font = TEXT_FONTS.find((f) => f.id === layer.font) ?? TEXT_FONTS[0];
    const rect = this.displayCropRect();
    const fontPx = Math.max(10, (rect ? rect.height : 320) * layer.size);
    node.style.fontFamily = font.stack;
    node.style.fontSize = `${fontPx}px`;
    node.style.color = layer.color;
    node.style.fontWeight = layer.bold ? '700' : '400';
    node.style.fontStyle = layer.italic ? 'italic' : 'normal';
    node.style.textAlign = layer.align;
    node.style.opacity = String(layer.opacity);
    node.classList.toggle('is-selected', layer.id === this.selectedTextId);
    node.classList.toggle('is-outline', layer.outline);
    node.classList.toggle('is-shadow', layer.shadow && !layer.outline);
    node.classList.toggle('show-frame', this.textShowFrame);
  }

  private syncTextControls(layer: AurumTextLayer): void {
    if (this.textInput) this.textInput.value = layer.text;
    if (this.textSizeTicks) this.textSizeTicks.set(Math.round(layer.size * 100), false);
    if (this.textOpacityTicks) {
      // Avoid fighting the user's finger: only overwrite when not actively dragging
      const isDragging = document.activeElement === this.textOpacityTicks.rail;
      if (!isDragging) this.textOpacityTicks.set(Math.round(layer.opacity * 100), false);
    }
    if (this.textRotateTicks) this.textRotateTicks.set(Math.round(layer.rotation), false);
    for (const node of Array.from(this.textLayer.querySelectorAll<HTMLElement>('.au-textnode'))) {
      const l = this.texts.find((t) => t.id === node.dataset.textId);
      if (l) this.syncTextLayerStyle(node, l);
    }
  }

  /** Rectangle of the displayed crop (result view), in stage CSS pixels. */
  private displayCropRect(): { x: number; y: number; width: number; height: number } | null {
    if (!this.isReady) return null;
    const viewport = this.viewport();
    const frame = this.currentFrame();
    if (frame.width < 2 || frame.height < 2) return null;
    const scale = Math.min(viewport.width / frame.width, viewport.height / frame.height);
    const w = frame.width * scale;
    const h = frame.height * scale;
    return {
      x: (viewport.width - w) / 2,
      y: (viewport.height - h) / 2,
      width: w,
      height: h,
    };
  }

  private positionTexts(): void {
    if (!this.textLayer) return;
    const rect = this.displayCropRect();
    const visible = this.isReady && this.currentTab !== 'crop';
    this.textLayer.style.display = visible ? 'block' : 'none';
    if (!rect) return;
    for (const node of Array.from(this.textLayer.querySelectorAll<HTMLElement>('.au-textnode'))) {
      const layer = this.texts.find((t) => t.id === node.dataset.textId);
      if (!layer) continue;
      const x = rect.x + layer.x * rect.width;
      const y = rect.y + layer.y * rect.height;
      node.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) rotate(${layer.rotation}deg)`;
      const fontPx = Math.max(10, rect.height * layer.size);
      if (node.style.fontSize !== `${fontPx}px`) node.style.fontSize = `${fontPx}px`;
    }
  }

  private deleteSelectedText(): void {
    if (!this.selectedTextId) return;
    this.texts = this.texts.filter((t) => t.id !== this.selectedTextId);
    this.selectedTextId = this.texts[0]?.id ?? null;
    this.textLayer?.querySelector(`[data-text-id="${this.selectedTextId}"]`);
    // Rebuild all nodes from state (keeps the code path singular).
    this.textLayer.replaceChildren();
    for (const layer of this.texts) this.textLayer.appendChild(this.createTextNode(layer));
    const next = this.selectedLayer();
    if (next) this.syncTextControls(next);
    else if (this.textInput) this.textInput.value = '';
    this.positionTexts();
  }

  private duplicateSelectedText(): void {
    const src = this.selectedLayer();
    if (!src) return;
    const copy: AurumTextLayer = {
      ...src,
      id: `t${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`,
      x: clamp01(src.x + 0.05),
      y: clamp01(src.y + 0.05),
    };
    this.texts.push(copy);
    this.selectedTextId = copy.id;
    this.textLayer.appendChild(this.createTextNode(copy));
    this.syncTextControls(copy);
    this.positionTexts();
  }

  private async runBackground(mode: BackgroundMode): Promise<void> {
    if (this.bgBusy || !this.isReady) return;
    if (!this.backgroundAction) {
      this.toast(this.s.bgNeedHost, true);
      return;
    }
    const controller = new AbortController();
    this.bgBusy = true;
    this.bgAbort = controller;
    this.bgPanel.hidden = false;
    this.bgPanel.classList.add('is-open');
    this.bgDetail.textContent = this.s.bgRunning;
    const sourceBefore = this.sourceBitmap();
    const sizeBefore = this.source();
    try {
      const result = await this.backgroundAction.run(this, {
        signal: controller.signal,
        report: (_p, label) => { if (label) this.bgDetail.textContent = label; },
        modelId: this.bgModel,
      }, mode, this.bgModel);
      if (controller.signal.aborted) return;
      // If host returned a mask (remove/person), enter brush refine
      if (result && (result as BackgroundMaskResult).mask) {
        const m = result as BackgroundMaskResult;
        if (sourceBefore) {
          this.enterRefine(sourceBefore, sizeBefore.width, sizeBefore.height, m.mask, m.maskWidth, m.maskHeight, mode, m.modelId);
          this.toast('AI xong — chỉnh cọ rồi Hoàn tất');
        } else {
          this.toast(this.s.bgDone);
        }
        return;
      }
      if (!controller.signal.aborted) this.toast(this.s.bgDone);
    } catch (error) {
      if (isAbortError(error) || controller.signal.aborted) this.toast(this.s.aiCancelled);
      else this.toast(this.s.bgFailed, true);
    } finally {
      this.bgBusy = false;
      this.bgAbort = null;
      this.bgPanel.classList.remove('is-open');
      this.bgPanel.hidden = true;
    }
  }

  private async runRetouch(mode: RetouchMode): Promise<void> {
    if (this.bgBusy || !this.isReady) return;
    if (!this.retouchAction) {
      this.toast(this.s.bgNeedHost, true);
      return;
    }
    const controller = new AbortController();
    this.bgBusy = true;
    this.bgAbort = controller;
    this.bgPanel.hidden = false;
    this.bgPanel.classList.add('is-open');
    this.bgDetail.textContent = this.s.bgRunning;
    try {
      await this.retouchAction.run(this, {
        signal: controller.signal,
        report: (_p, label) => { if (label) this.bgDetail.textContent = label; },
      }, mode);
      if (!controller.signal.aborted) this.toast(this.s.retouchDone);
    } catch (error) {
      if (isAbortError(error) || controller.signal.aborted) this.toast(this.s.aiCancelled);
      else {
        console.error('[aurum] retouch failed:', error);
        const msg = error instanceof Error ? error.message : String(error ?? '');
        // Surface the real cause (offline install / ORT / decode) instead of
        // hiding it behind the generic toast. Keep toast short (detail holds detail).
        this.bgDetail.textContent = `${this.s.retouchFailed} — ${msg.slice(0, 120)}`;
        this.bgPanel.classList.add('is-open');
        this.bgPanel.hidden = false;
        this.toast(msg ? `${this.s.retouchFailed} — ${msg.slice(0, 60)}` : this.s.retouchFailed, true);
        return;
      }
    } finally {
      this.bgBusy = false;
      this.bgAbort = null;
      this.bgPanel.classList.remove('is-open');
      this.bgPanel.hidden = true;
    }
  }

  /** Composite text layers onto an exported blob (called from saveImage). */
  private async compositeTexts(blob: Blob): Promise<Blob> {
    if (!this.texts.length) return blob;
    let bitmap: { width: number; height: number } & CanvasImageSource | null = null;
    try {
      bitmap = await createImageBitmap(blob);
    } catch {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      try {
        await img.decode();
        bitmap = img;
      } catch {
        bitmap = null;
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    }
    if (!bitmap) return blob;
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return blob;
    ctx.drawImage(bitmap, 0, 0);
    const W = canvas.width;
    const H = canvas.height;
    for (const layer of this.texts) {
      const text = layer.text.trim();
      if (!text) continue;
      const font = TEXT_FONTS.find((f) => f.id === layer.font) ?? TEXT_FONTS[0];
      const size = Math.max(8, H * layer.size);
      ctx.save();
      ctx.translate(layer.x * W, layer.y * H);
      ctx.rotate(((layer.rotation || 0) * Math.PI) / 180);
      ctx.globalAlpha = clamp01(layer.opacity);
      ctx.font = `${layer.italic ? 'italic ' : ''}${layer.bold ? '700 ' : '400 '}${size}px ${font.stack}`;
      ctx.textAlign = layer.align;
      ctx.textBaseline = 'middle';
      if (layer.outline) {
        ctx.lineWidth = Math.max(1, size * 0.09);
        ctx.strokeStyle = 'rgba(0,0,0,.85)';
        ctx.lineJoin = 'round';
        ctx.strokeText(text, 0, 0);
      } else if (layer.shadow) {
        ctx.shadowColor = 'rgba(0,0,0,.45)';
        ctx.shadowBlur = size * 0.18;
        ctx.shadowOffsetY = size * 0.04;
      }
      ctx.fillStyle = layer.color;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
    const type = blob.type || this.exportType;
    const quality = type === 'image/png' ? undefined : this.quality / 100;
    const out = await new Promise<Blob | null>((resolve) => {
      if (type === 'image/png') canvas.toBlob(resolve, type);
      else canvas.toBlob(resolve, type, quality);
    });
    return out ?? blob;
  }

  private async runAIAction(): Promise<void> {
    if (!this.aiAction || this.aiBusy || !this.isReady || this.saving) return;
    const controller = new AbortController();
    this.aiBusy = true;
    this.aiAbort = controller;
    if (this.aiBtn) {
      this.aiBtn.disabled = true;
      this.aiBtn.classList.add('is-busy');
    }
    this.setAICompareVisible(false);
    this.aiPanel.hidden = false;
    this.aiPanel.classList.add('is-open');
    this.reportAI(-1, this.s.aiPreparing);
    try {
      await this.aiAction.run(this, {
        signal: controller.signal,
        report: (progress, label) => this.reportAI(progress, label),
      });
      if (!controller.signal.aborted) {
        this.setAICompareVisible(this.canRevertAI());
        this.toast(this.s.aiDone);
      }
    } catch (error) {
      if (isAbortError(error) || controller.signal.aborted) {
        this.toast(this.s.aiCancelled);
      } else {
        this.toast(error instanceof Error && error.message ? error.message : this.s.aiFailed, true);
      }
    } finally {
      this.aiBusy = false;
      this.aiAbort = null;
      if (this.aiBtn) {
        this.aiBtn.disabled = false;
        this.aiBtn.classList.remove('is-busy');
      }
      this.aiPanel.classList.remove('is-open');
      this.aiPanel.hidden = true;
      this.aiPanel.classList.remove('is-indeterminate');
      this.aiBar.style.width = '0%';
    }
  }

  private buildToast(): void {
    const toast = el('div', 'au-toast');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    this.root.appendChild(toast);
    this.toastEl = toast;
  }

  private bindEvents(): void {
    this.on('ready', () => {
      this.root.classList.add('au-ready');
      this.setLiquify(false);
      // New base image: text belongs to the previous pixels.
      this.texts = [];
      this.selectedTextId = null;
      this.textLayer?.replaceChildren();
      if (this.textInput) this.textInput.value = '';
      this.positionTexts();
      // A new base image invalidates the AI comparison. The AI action re-shows
      // the bar itself after its own `ready` event has settled.
      this.setAICompareVisible(false);
      this.buildFilters();
      // The dock appears with `au-ready`, which can shrink the stage. Fit once
      // the real layout is in place so the frame and image start together.
      this.fitToFrame();
      this.positionFrame(this.currentFrame());
      this.syncUI();
      this.setCropMode(this.cropMode);
      // Wait one frame: the dock and the chips rail only get their real width
      // after `au-ready` unlocks the layout, and centring needs that width.
      window.requestAnimationFrame(() => {
        this.centerMode(this.cropMode);
        this.centerAspectChip(this.getState().crop.aspect, false);
      });
    });
    this.on('loading', ({ loading }) => {
      this.root.classList.toggle('au-busy', loading);
      if (loading) this.root.classList.remove('au-dragover');
    });
    this.on('change', () => {
      this.syncUI();
      this.positionFrame(this.currentFrame());
    });
    this.on('history', () => this.syncHistory());
    this.on('render', ({ frame }) => { this.positionFrame(frame); this.positionTexts(); });
    this.on('error', ({ error }) => this.toast(error.message || this.s.exportFailed, true));

    this.frameEl.addEventListener('pointerdown', this.onCropPointerDown);
    this.frameEl.addEventListener('keydown', this.onCropKeyDown);
    // Tap on photo in Text tab → place new text at that point (Meitu-style)
    this.stage.addEventListener('pointerdown', this.tapToPlaceText);

    this.root.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.sheetWrap.classList.contains('is-open')) {
        event.preventDefault();
        this.closeSheet();
        return;
      }
      if (event.key === 'Tab' && this.sheetWrap.classList.contains('is-open')) {
        const focusable = Array.from(
          this.sheetWrap.querySelectorAll<HTMLElement>(
            'button:not([disabled]),input:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])',
          ),
        ).filter((node) => node.getClientRects().length > 0);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey && (active === first || !this.sheetWrap.contains(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !this.sheetWrap.contains(active))) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (!event.metaKey && !event.ctrlKey) return;
      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) this.redo();
        else this.undo();
      } else if (key === 'y') {
        event.preventDefault();
        this.redo();
      }
    });
  }

  /* ---------------------------------------------------------------- behaviour */

  private aspectLabel(id: AspectId): string {
    if (id === 'free') return this.s.aspectFree;
    if (id === 'screen') return this.s.aspectScreen;
    return id;
  }

  private cancel(): void {
    if (this.onCloseCb) {
      this.onCloseCb();
      return;
    }
    this.root.dispatchEvent(new CustomEvent('aurum:cancel', { bubbles: true }));
    this.reset();
    this.setTab('crop');
    this.toast(this.s.cancelled);
  }

  private async openSource(source: ImageSource): Promise<void> {
    try {
      await this.load(source);
    } catch {
      // `error` is emitted by the core and surfaced by the toast listener.
    }
  }

  private setTab(tab: TabId): void {
    if (tab !== 'adjust') this.setLiquify(false);
    if (tab !== 'text' && this.textPlacing) {
      this.textPlacing = false;
      this.textPlaceBtn?.setAttribute('aria-pressed', 'false');
      this.textPlaceBtn?.classList.remove('is-active');
      this.root.classList.remove('au-text-placing');
    }
    if (tab !== 'crop') {
      if (this.cropDrag) this.endCropDrag();
      this.clearTransient();
    }
    this.currentTab = tab;
    for (const [id, button] of this.tabButtons) {
      const active = id === tab;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    }
    for (const [id, pane] of this.panes) {
      pane.classList.toggle('is-active', id === tab);
    }
    const result = tab !== 'crop';
    this.setResultMode(result);
    this.root.classList.toggle('is-result', result);
    if (this.refineCanvas) this.refineCanvas.style.display = this.refineOn && tab === 'ai' ? 'block' : 'none';
    if (this.refineOn && tab === 'ai') this.drawRefinePreview();
    this.positionTexts();
    if (!result) {
      this.positionFrame(this.currentFrame());
      window.requestAnimationFrame(() => {
        this.centerMode(this.cropMode);
        if (this.isReady) this.centerAspectChip(this.getState().crop.aspect, false);
      });
    }
  }

  private clearTransient(): void {
    this.root.classList.remove('au-cropping', 'au-ratioing', 'au-rotating');
    this.frameEl?.classList.remove('is-rotating');
    if (this.ratioTimer) {
      window.clearTimeout(this.ratioTimer);
      this.ratioTimer = 0;
    }
    if (this.cropKeyTimer) {
      window.clearTimeout(this.cropKeyTimer);
      this.cropKeyTimer = 0;
    }
  }

  private beginRotationDrag(): void {
    this.root.classList.add('au-rotating');
    this.frameEl.classList.add('is-rotating');
  }

  private endRotationDrag(): void {
    this.root.classList.remove('au-rotating');
    this.frameEl.classList.remove('is-rotating');
  }

  private centerMode(mode: CropMode): void {
    const active =
      mode === 'ratio'
        ? this.ratioBtn
        : mode === 'rotation'
          ? this.rotationBtn
          : mode === 'perspectiveY'
            ? this.perspectiveYBtn
            : this.perspectiveXBtn;
    if (!this.modesWrap || !this.modesTrack || !active) return;
    const width = this.modesWrap.clientWidth;
    if (width <= 0) return;
    // Four pills fit on most phones. Centre the whole track instead of sliding
    // the active pill under the gold line, which clipped the first pill.
    const trackWidth = this.modesTrack.scrollWidth;
    const offset =
      trackWidth <= width
        ? (width - trackWidth) / 2
        : clamp(
            width / 2 - (active.offsetLeft + active.offsetWidth / 2),
            width - trackWidth,
            0,
          );
    this.modesTrack.style.transform = `translate3d(${offset}px,0,0)`;
  }

  private centerAspectChip(aspect: AspectId, smooth = true): void {
    const chip = this.aspectButtons.get(aspect);
    const chips = this.chipsEl;
    if (!chip || !chips) return;
    const width = chips.clientWidth;
    if (width <= 0) return;
    const target = chip.offsetLeft - (width - chip.offsetWidth) / 2;
    const left = clamp(target, 0, Math.max(0, chips.scrollWidth - width));
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (smooth && !reduced && typeof chips.scrollTo === 'function') {
      chips.scrollTo({ left, behavior: 'smooth' });
    } else {
      chips.scrollLeft = left;
    }
  }

  private markRatioing(): void {
    this.root.classList.add('au-ratioing');
    if (this.ratioTimer) window.clearTimeout(this.ratioTimer);
    this.ratioTimer = window.setTimeout(() => {
      this.root.classList.remove('au-ratioing');
      this.ratioTimer = 0;
    }, 520);
  }

  private markCropKeying(): void {
    this.root.classList.add('au-cropping');
    if (this.cropKeyTimer) window.clearTimeout(this.cropKeyTimer);
    this.cropKeyTimer = window.setTimeout(() => {
      this.root.classList.remove('au-cropping');
      this.cropKeyTimer = 0;
    }, 420);
  }

  private chooseAspect(aspect: AspectId): void {
    if (!this.isReady) return;
    this.setAspect(aspect);
    this.markRatioing();
    this.positionFrame(this.currentFrame());
  }

  private setCropMode(mode: CropMode): void {
    this.cropMode = mode;
    const ratio = mode === 'ratio';
    const rotation = mode === 'rotation';
    const perspectiveY = mode === 'perspectiveY';
    const perspectiveX = mode === 'perspectiveX';
    this.ratioBtn.classList.toggle('is-active', ratio);
    this.ratioBtn.setAttribute('aria-pressed', String(ratio));
    this.rotationBtn.classList.toggle('is-active', rotation);
    this.rotationBtn.setAttribute('aria-pressed', String(rotation));
    this.perspectiveYBtn.classList.toggle('is-active', perspectiveY);
    this.perspectiveYBtn.setAttribute('aria-pressed', String(perspectiveY));
    this.perspectiveXBtn.classList.toggle('is-active', perspectiveX);
    this.perspectiveXBtn.setAttribute('aria-pressed', String(perspectiveX));
    this.ratioContext.classList.toggle('is-active', ratio);
    this.rotationContext.classList.toggle('is-active', rotation);
    this.perspectiveYContext.classList.toggle('is-active', perspectiveY);
    this.perspectiveXContext.classList.toggle('is-active', perspectiveX);
    // Keep the reset button on the free side so it never covers the inactive
    // mode pill while the active pill is centred over the gold line.
    this.cropResetBtn.classList.toggle('is-left', ratio);
    const resetLabel = ratio
      ? this.s.resetCrop
      : rotation
        ? this.s.resetRotation
        : perspectiveY
          ? this.s.resetPerspectiveY
          : this.s.resetPerspectiveX;
    this.cropResetBtn.title = resetLabel;
    this.cropResetBtn.setAttribute('aria-label', resetLabel);
    window.requestAnimationFrame(() => {
      this.centerMode(mode);
      if (ratio && this.isReady) this.centerAspectChip(this.getState().crop.aspect, true);
    });
  }

  private resetCropMode(): void {
    if (this.cropMode === 'rotation') {
      this.resetRotation();
    } else if (this.cropMode === 'perspectiveY') {
      this.setPerspective({ perspectiveY: 0 }, 'perspective');
      this.syncUI();
    } else if (this.cropMode === 'perspectiveX') {
      this.setPerspective({ perspectiveX: 0 }, 'perspective');
      this.syncUI();
    } else {
      this.resetCrop();
      this.markRatioing();
      this.positionFrame(this.currentFrame());
    }
  }

  private buildLiquifyOverlay(): void {
    const ring = el('div', 'au-brush-ring');
    ring.setAttribute('aria-hidden', 'true');
    this.stage.appendChild(ring);
    this.liquifyRing = ring;
    this.stage.addEventListener('pointerdown', this.onLiquifyPointerDown, { passive: false });
    this.stage.addEventListener('pointermove', this.onLiquifyPointerMove, { passive: false });
    this.stage.addEventListener('pointerup', this.onLiquifyPointerUp);
    this.stage.addEventListener('pointercancel', this.onLiquifyPointerUp);
    this.stage.addEventListener('pointerleave', () => {
      if (!this.liquifyStroke && this.liquifyRing) {
        this.liquifyRing.style.display = 'none';
      }
    });
  }

  private setLiquify(on: boolean): void {
    if (on && !this.isReady) return;
    if (this.liquifyOn === on) return;
    this.liquifyOn = on;
    this.root.classList.toggle('au-liquify', on);
    this.liquifyButton?.setAttribute('aria-pressed', String(on));
    if (this.adjustContext) this.adjustContext.style.display = on ? 'none' : '';
    if (this.liquifyContext) this.liquifyContext.style.display = on ? '' : 'none';
    this.stage.style.cursor = on ? 'crosshair' : 'grab';
    if (on) {
      this.liquifyTicks?.set(this.liquifySize, false);
      if (this.liquifyValue) this.liquifyValue.textContent = `${this.liquifySize}%`;
      if (this.liquifyButton) {
        window.requestAnimationFrame(() => this.centerAdjustChip(this.liquifyButton!));
      }
    } else {
      this.liquifyStroke = null;
      if (this.liquifyRing) this.liquifyRing.style.display = 'none';
    }
  }

  private setLiquifySize(value: number, sync = true): void {
    const next = clamp(Math.round(value), 1, 20);
    this.liquifySize = next;
    if (sync) this.liquifyTicks?.set(next, false);
    if (this.liquifyValue) this.liquifyValue.textContent = `${next}%`;
  }

  private clearLiquifyDabs(): void {
    if (!this.isReady || !this.hasLiquify()) return;
    this.clearLiquify();
    this.syncUI();
  }

  private liquifyRadius(): number {
    return this.liquifySize / 100;
  }

  /** Screen-space radius of the brush, used for dab spacing and the ring. */
  private liquifyScreenRadius(): number {
    const radius = this.liquifyRadius();
    const center = this.screenPointAt(0.5, 0.5);
    const edge = this.screenPointAt(Math.min(1, 0.5 + radius), 0.5);
    if (!center || !edge) return 24;
    return Math.max(4, Math.hypot(edge.x - center.x, edge.y - center.y));
  }

  private previewLiquifyRing(clientX: number, clientY: number): void {
    const ring = this.liquifyRing;
    if (!ring) return;
    if (!this.liquifyOn) {
      ring.style.display = 'none';
      return;
    }
    const point = this.sourcePointAt(clientX, clientY);
    const center = point ? this.screenPointAt(point.x, point.y) : null;
    if (!center) {
      ring.style.display = 'none';
      return;
    }
    const radius = this.liquifyScreenRadius();
    ring.style.display = 'block';
    ring.style.width = `${radius * 2}px`;
    ring.style.height = `${radius * 2}px`;
    ring.style.transform = `translate3d(${center.x - radius}px,${center.y - radius}px,0)`;
  }

  private onLiquifyPointerDown = (event: PointerEvent): void => {
    if (!this.liquifyOn || !this.isReady) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const point = this.sourcePointAt(event.clientX, event.clientY);
    if (!point) return;
    event.preventDefault();
    event.stopPropagation();
    try {
      this.stage.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is best-effort (older Safari).
    }
    this.liquifyStroke = {
      pointerId: event.pointerId,
      key: `liquify:${++this.liquifyGesture}`,
      x: event.clientX,
      y: event.clientY,
      u: point.x,
      v: point.y,
    };
    this.previewLiquifyRing(event.clientX, event.clientY);
  };

  private onLiquifyPointerMove = (event: PointerEvent): void => {
    if (!this.liquifyOn) return;
    this.previewLiquifyRing(event.clientX, event.clientY);
    const stroke = this.liquifyStroke;
    if (!stroke || stroke.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();

    const spacing = Math.max(1.5, this.liquifyScreenRadius() * 0.35);
    let remaining = Math.hypot(event.clientX - stroke.x, event.clientY - stroke.y);
    if (remaining < spacing) return;
    const dirX = (event.clientX - stroke.x) / remaining;
    const dirY = (event.clientY - stroke.y) / remaining;
    // Cap one event at 48 dabs. A fast flick is still sampled densely enough
    // because the next event continues from the last emitted point.
    let steps = Math.min(48, Math.floor(remaining / spacing));
    while (steps > 0) {
      steps -= 1;
      stroke.x += dirX * spacing;
      stroke.y += dirY * spacing;
      remaining -= spacing;
      const point = this.sourcePointAt(stroke.x, stroke.y);
      if (!point) continue;
      const dx = point.x - stroke.u;
      const dy = point.y - stroke.v;
      if (Math.abs(dx) + Math.abs(dy) > 1e-5) {
        this.addLiquifyDab(
          {
            x: stroke.u,
            y: stroke.v,
            dx,
            dy,
            radius: this.liquifyRadius(),
          },
          stroke.key,
        );
      }
      stroke.u = point.x;
      stroke.v = point.y;
    }
  };

  private onLiquifyPointerUp = (event: PointerEvent): void => {
    if (!this.liquifyStroke || this.liquifyStroke.pointerId !== event.pointerId) return;
    this.liquifyStroke = null;
    try {
      this.stage.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore a capture that was never taken.
    }
  };

  private selectAdjust(key: keyof Adjustments): void {
    if (this.liquifyOn) this.setLiquify(false);
    this.adjustKey = key;
    for (const [id, button] of this.adjustButtons) {
      button.setAttribute('aria-pressed', String(id === key));
    }
    const [min, max] = ADJUST_RANGES[key];
    this.adjustTicks.setRange(min, max, 1, 2, min < 0);
    this.adjustTicks.setLabel(this.s[key]);
    const value = this.isReady ? Math.round(this.getState().adjust[key]) : 0;
    this.adjustTicks.set(value, false);
    this.adjustValue.textContent = this.formatAdjust(value);
    this.adjustValue.title = `${this.s.reset}: ${this.s[key]}`;
    this.adjustValue.setAttribute('aria-label', `${this.s.reset}: ${this.s[key]}`);
    const button = this.adjustButtons.get(key);
    if (button) {
      window.requestAnimationFrame(() => this.centerAdjustChip(button));
    }
  }

  /** Bring a tapped parameter chip under the middle of the rail. */
  private centerAdjustChip(button: HTMLButtonElement): void {
    const rail = this.paramsEl;
    if (!rail || this.currentTab !== 'adjust') return;
    const rect = button.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    if (!rect.width || !railRect.width) return;
    const delta = rect.left - railRect.left - (railRect.width - rect.width) / 2;
    if (Math.abs(delta) < 1) return;
    rail.scrollBy({ left: delta, behavior: 'smooth' });
  }

  private async runAuto(): Promise<void> {
    if (this.autoBusy || !this.isReady) return;
    this.autoBusy = true;
    this.autoBtn.disabled = true;
    this.autoBtn.classList.add('is-busy');
    const previous = this.autoLabel.textContent || this.s.auto;
    this.autoLabel.textContent = this.s.autoRunning;
    try {
      await this.autoEnhance();
      this.syncUI();
      this.toast(this.s.autoDone);
    } catch (error) {
      if (!isAbortError(error)) this.toast(this.s.autoFailed, true);
    } finally {
      this.autoBusy = false;
      this.autoBtn.disabled = false;
      this.autoBtn.classList.remove('is-busy');
      this.autoLabel.textContent = previous;
    }
  }

  private formatAdjust(value: number): string {
    const [min] = ADJUST_RANGES[this.adjustKey];
    return min >= 0 ? String(Math.round(value)) : signed(Math.round(value));
  }

  private buildFilters(): void {
    const bitmap = this.getPreviewBitmap();
    if (!bitmap) return;
    const size = this.source();
    const current = this.getState().filter;
    this.filterWrap.replaceChildren();
    this.filterButtons.clear();
    this.savedFilterButtons.clear();
    // Saved presets first (like a personal row), separated from defaults by label
    if (this.userPresets.length) {
      for (const p of this.userPresets) {
        const button = el('button', 'au-filter au-filter--saved');
        button.type = 'button';
        // Thumbnail approximated from saved filter colour alone (fast)
        const canvas = presetThumbnail(bitmap, size.width, size.height, p.filter || 'original');
        const label = el('span');
        label.textContent = p.name;
        button.append(canvas, label);
        button.setAttribute('aria-pressed', String(this.activeSavedId === p.id));
        button.setAttribute('aria-label', `${p.name}`);
        button.title = `${p.name}`;
        this.savedFilterButtons.set(p.id, button);
        const deleteSaved = () => {
          this.userPresets = this.userPresets.filter((x) => x.id !== p.id);
          if (this.activeSavedId === p.id) {
            this.activeSavedId = null;
            this.savedReturnState = null;
          }
          storeUserPresets(this.userPresets);
          this.renderSavedPresets();
          this.buildFilters();
          this.toast(this.s.presetDeleted);
        };
        button.addEventListener('click', () => this.applyUserPreset(p));
        button.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          deleteSaved();
        });
        // small trash dot inside
        const trash = el('span', 'au-filter--saved-del');
        trash.textContent = '×';
        trash.setAttribute('aria-hidden', 'true');
        trash.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteSaved();
        });
        button.appendChild(trash);
        this.filterWrap.appendChild(button);
      }
      const sep = el('span', 'au-filter-sep');
      const sepLabel = el('b');
      sepLabel.textContent = this.s.defaultFilters;
      sep.appendChild(sepLabel);
      this.filterWrap.appendChild(sep);
    }
    const visible = PRESETS.filter(
      (preset) => this.filterCat === 'all' || preset.category === this.filterCat,
    );
    for (const preset of visible) {
      const button = el('button', 'au-filter');
      button.type = 'button';
      const canvas = presetThumbnail(bitmap, size.width, size.height, preset.id);
      const label = el('span');
      const presetName = this.locale === 'en' ? preset.labelEn : preset.label;
      label.textContent = presetName;
      button.append(canvas, label);
      button.setAttribute('aria-pressed', String(current === preset.id));
      button.setAttribute('aria-label', presetName);
      button.addEventListener('click', () => {
        // Toggle: tap the active tone again to turn it off (back to Nguyên bản).
        // Saved presets clear the same way via applyUserPreset(). Original
        // itself never toggles (it IS the off state).
        if (current === preset.id && preset.id !== 'original') {
          this.activeSavedId = null;
          this.savedReturnState = null;
          this.setFilter('original');
          this.syncUI();
          this.buildFilters();
          this.toast(this.s.resetFilter);
        } else {
          this.activeSavedId = null;
          this.savedReturnState = null;
          this.setFilter(preset.id);
        }
        // Give the tone hint a moment to read: specific labels, no jargon.
        const choice = PRESETS.find((p) => p.id === preset.id);
        if (this.filterHint && choice?.hint) {
          this.filterHint.textContent = choice.hint;
          this.filterHint.classList.add('is-visible');
        }
      });
      this.filterWrap.appendChild(button);
      this.filterButtons.set(preset.id, button);
    }
    const sel = PRESETS.find((p) => p.id === current);
    if (this.filterHint && sel?.hint) this.filterHint.textContent = sel.hint;
    else if (this.filterHint) this.filterHint.textContent = '';
  }

  private syncUI(): void {
    const ready = this.isReady;
    this.root.classList.toggle('au-ready', ready);
    this.saveBtn.disabled = !ready;
    if (!ready) return;

    const state = this.getState();
    const active = document.activeElement;

    for (const [id, button] of this.aspectButtons) {
      button.setAttribute('aria-pressed', String(state.crop.aspect === id));
    }
    if (this.lastAspect !== state.crop.aspect) {
      this.lastAspect = state.crop.aspect;
      if (this.currentTab === 'crop') this.centerAspectChip(state.crop.aspect, true);
    }
    this.flipButtons.get('flipH')?.classList.toggle('is-on', state.transform.flipH);
    this.flipButtons.get('flipV')?.classList.toggle('is-on', state.transform.flipV);

    const adjustValue = Math.round(state.adjust[this.adjustKey]);
    if (active !== this.adjustTicks.rail) this.adjustTicks.set(adjustValue, false);
    this.adjustValue.textContent = this.formatAdjust(adjustValue);

    const rotation = Math.round(state.transform.rotation);
    if (active !== this.rotationControl.rail) this.rotationControl.set(rotation, false);
    this.rotationValue.textContent = `${rotation}°`;
    this.rotationBtn.setAttribute('aria-label', `${this.s.rotation}: ${rotation}°`);
    this.syncPerspective();

    const ratioLabel = this.aspectLabel(state.crop.aspect);
    this.ratioValue.textContent = ratioLabel;
    this.ratioBtn.setAttribute('aria-label', `${this.s.ratioLabel}: ${ratioLabel}`);

    for (const [id, button] of this.filterButtons) {
      button.setAttribute('aria-pressed', String(state.filter === id));
    }
    for (const [id, button] of this.savedFilterButtons) {
      button.setAttribute('aria-pressed', String(this.activeSavedId === id));
      button.classList.toggle('is-active', this.activeSavedId === id);
    }
    this.syncTuneUI();
    this.positionTexts();
    this.syncHistory();
  }

  private syncPerspective(): void {
    const transform = this.getState().transform;
    const x = Math.round(transform.perspectiveX);
    const y = Math.round(transform.perspectiveY);
    this.perspectiveYControl.set(y, false);
    this.perspectiveXControl.set(x, false);
    this.perspectiveYValue.textContent = signed(y);
    this.perspectiveXValue.textContent = signed(x);
    this.perspectiveYBtn.setAttribute(
      'aria-label',
      `${this.s.perspective}: ${this.s.tiltVertical} ${signed(y)}`,
    );
    this.perspectiveXBtn.setAttribute(
      'aria-label',
      `${this.s.perspective}: ${this.s.tiltHorizontal} ${signed(x)}`,
    );
  }

  private syncHistory(): void {
    this.undoBtn.disabled = !this.canUndo();
    this.redoBtn.disabled = !this.canRedo();
  }

  private positionFrame(frame: FrameRect): void {
    const box = this.frameBox;
    if (
      frame.x === box.x &&
      frame.y === box.y &&
      frame.width === box.w &&
      frame.height === box.h
    ) {
      return;
    }
    if (frame.x !== box.x || frame.y !== box.y) {
      this.frameEl.style.transform = `translate3d(${frame.x}px,${frame.y}px,0)`;
    }
    if (frame.width !== box.w) this.frameEl.style.width = `${frame.width}px`;
    if (frame.height !== box.h) this.frameEl.style.height = `${frame.height}px`;
    box.x = frame.x;
    box.y = frame.y;
    box.w = frame.width;
    box.h = frame.height;
    this.scrimEl.style.setProperty('--au-crop-x', `${frame.x}px`);
    this.scrimEl.style.setProperty('--au-crop-y', `${frame.y}px`);
    this.scrimEl.style.setProperty('--au-crop-w', `${frame.width}px`);
    this.scrimEl.style.setProperty('--au-crop-h', `${frame.height}px`);
  }

  private onCropKeyDown = (event: KeyboardEvent): void => {
    if (!this.isReady) return;
    const grow = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const shrink = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if (!grow && !shrink) return;
    event.preventDefault();

    const frame = this.currentFrame();
    if (frame.width < 2 || frame.height < 2) return;
    const step = event.shiftKey ? 24 : 8;
    const state = this.getState();
    const fixed = state.crop.aspect !== 'free' && state.crop.aspect !== 'screen';
    const key = `crop-key:${Date.now()}`;

    if (fixed) {
      const factor = 1 + ((grow ? 1 : -1) * step * 2) / Math.max(1, frame.width);
      this.setCrop({ scale: clamp(state.crop.scale * factor, 0.2, 1) }, key);
    } else {
      const dx = event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0;
      const dy = event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0;
      const targetW = Math.max(24, frame.width + dx * 2);
      const targetH = Math.max(24, frame.height + dy * 2);
      const ratio = clamp(targetW / targetH, 0.2, 8);
      const max = maxFrame(this.viewport(), ratio);
      const scale = clamp(targetW / Math.max(1, max.width), 0.2, 1);
      this.setCrop({ aspect: 'free', ratio, scale }, key);
    }
    this.markCropKeying();
    this.positionFrame(this.currentFrame());
  };

  private onCropPointerDown = (event: PointerEvent): void => {
    const target = event.target as Element | null;
    const handleEl = target?.closest<HTMLElement>('[data-crop-handle]');
    if (!handleEl || !this.frameEl.contains(handleEl)) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (!this.isReady || this.cropDrag) return;
    event.preventDefault();
    event.stopPropagation();

    const frame = this.currentFrame();
    if (frame.width < 2 || frame.height < 2) return;
    const state = this.getState();
    const viewport = this.viewport();
    const pointerId = event.pointerId;
    const move = (moveEvent: PointerEvent): void => {
      if (moveEvent.pointerId === pointerId) this.dragCrop(moveEvent);
    };
    const end = (endEvent: PointerEvent): void => {
      if (endEvent.pointerId === pointerId) this.endCropDrag();
    };

    this.cropDrag = {
      pointerId,
      handle: handleEl.dataset.cropHandle || '',
      startX: event.clientX,
      startY: event.clientY,
      frame,
      viewport,
      aspect: state.crop.aspect,
      startScale: state.crop.scale,
      startRatio: frame.width / Math.max(1, frame.height),
      key: `crop-drag:${Date.now()}`,
      handleEl,
      move,
      end,
    };

    // Lock every other handle for the duration of the gesture. A second
    // finger cannot start a competing resize on another corner.
    this.frameEl.classList.add('is-locked');
    handleEl.classList.add('is-dragging');

    try {
      handleEl.setPointerCapture(pointerId);
    } catch {
      // Pointer capture is optional.
    }
    handleEl.addEventListener('pointermove', move);
    handleEl.addEventListener('pointerup', end);
    handleEl.addEventListener('pointercancel', end);
    if (this.cropKeyTimer) {
      window.clearTimeout(this.cropKeyTimer);
      this.cropKeyTimer = 0;
    }
    this.frameEl.classList.add('is-dragging');
    this.root.classList.add('au-cropping');
  };

  private dragCrop(event: PointerEvent): void {
    const drag = this.cropDrag;
    if (!drag) return;
    event.preventDefault();

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const dirX =
      drag.handle === 'e' || drag.handle === 'tr' || drag.handle === 'br'
        ? 1
        : drag.handle === 'w' || drag.handle === 'tl' || drag.handle === 'bl'
          ? -1
          : 0;
    const dirY =
      drag.handle === 's' || drag.handle === 'br' || drag.handle === 'bl'
        ? 1
        : drag.handle === 'n' || drag.handle === 'tl' || drag.handle === 'tr'
          ? -1
          : 0;
    const fixed = drag.aspect !== 'free' && drag.aspect !== 'screen';

    if (fixed) {
      // The frame stays centred: a 2x size delta makes the dragged edge follow
      // the finger 1:1 while the opposite edge grows symmetrically.
      let factor = 1;
      if (dirX && dirY) {
        const denom = Math.max(
          1,
          drag.frame.width * drag.frame.width + drag.frame.height * drag.frame.height,
        );
        factor =
          1 +
          (dirX * dx * 2 * drag.frame.width + dirY * dy * 2 * drag.frame.height) / denom;
      } else if (dirX) {
        factor = 1 + (dirX * dx * 2) / Math.max(1, drag.frame.width);
      } else if (dirY) {
        factor = 1 + (dirY * dy * 2) / Math.max(1, drag.frame.height);
      }
      const scale = clamp(drag.startScale * factor, 0.2, 1);
      this.setCrop({ scale }, drag.key);
    } else {
      const targetW = Math.max(24, drag.frame.width + dirX * dx * 2);
      const targetH = Math.max(24, drag.frame.height + dirY * dy * 2);
      const ratio = clamp(targetW / targetH, 0.2, 8);
      const max = maxFrame(drag.viewport, ratio);
      const scale = clamp(targetW / Math.max(1, max.width), 0.2, 1);
      this.setCrop({ aspect: 'free', ratio, scale }, drag.key);
    }
    this.positionFrame(this.currentFrame());
  }

  private endCropDrag(): void {
    const drag = this.cropDrag;
    if (!drag) return;
    this.cropDrag = null;
    drag.handleEl.removeEventListener('pointermove', drag.move);
    drag.handleEl.removeEventListener('pointerup', drag.end);
    drag.handleEl.removeEventListener('pointercancel', drag.end);
    try {
      drag.handleEl.releasePointerCapture(drag.pointerId);
    } catch {
      // Already released.
    }
    this.frameEl.classList.remove('is-dragging');
    this.frameEl.classList.remove('is-locked');
    drag.handleEl.classList.remove('is-dragging');
    this.root.classList.remove('au-cropping');
  }

  private openSheet(): void {
    if (!this.isReady) return;
    this.updateSheet();
    this.sheetWrap.classList.add('is-open');
    this.sheetWrap.setAttribute('aria-hidden', 'false');
    this.saveImageBtn.focus({ preventScroll: true });
  }

  private closeSheet(): void {
    this.sheetWrap.classList.remove('is-open');
    this.sheetWrap.setAttribute('aria-hidden', 'true');
    this.saveBtn.focus({ preventScroll: true });
  }

  private updateSheet(): void {
    const size = this.getExportSize();
    const format = FORMATS.find((item) => item.type === this.exportType) || FORMATS[0];
    this.metaName.textContent = this.fileName();
    this.metaInfo.textContent = `${size.width} × ${size.height} px · ${format.label}`;
    for (const [type, button] of this.formatButtons) {
      button.setAttribute('aria-pressed', String(type === this.exportType));
    }
    const png = this.exportType === 'image/png';
    // PNG is lossless: a quality slider would be misleading, so hide the row.
    this.qualityRow.hidden = png;
    this.qualityControl.setDisabled(png);
    this.applyQuality(this.quality);
  }

  private applyQuality(value: number): void {
    this.quality = clamp(Math.round(value), 10, 100);
    this.qualityControl.set(this.quality, false);
  }

  private fileName(): string {
    const ext =
      this.exportType === 'image/png'
        ? 'png'
        : this.exportType === 'image/webp'
          ? 'webp'
          : 'jpg';
    return `${this.fileBase}.${ext}`;
  }

  private async saveImage(mode: 'overwrite' | 'copy' = 'overwrite'): Promise<void> {
    if (this.saving || !this.isReady) return;
    const callback = mode === 'copy' ? this.onSaveCopyCb : this.onSaveCb;
    if (mode === 'copy' && !callback) return;
    this.saving = true;
    this.saveImageBtn.disabled = true;
    if (this.saveCopyBtn) this.saveCopyBtn.disabled = true;
    const activeLabel = mode === 'copy' ? this.saveCopyLabel : this.saveLabel;
    const previousLabel = activeLabel?.textContent || '';
    const activeButton = mode === 'copy' ? this.saveCopyBtn : this.saveImageBtn;
    if (activeLabel) activeLabel.textContent = this.s.saving;
    activeButton?.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    this.exportAbort = controller;
    this.updateProgress({ phase: 'render', progress: 0, tile: 0, tiles: 0 });
    this.progressEl.hidden = false;
    try {
      let blob = await this.export({
        type: this.exportType,
        quality: this.quality / 100,
        signal: controller.signal,
        onProgress: (progress) => this.updateProgress(progress),
      });
      // Text is auxiliary (display layer): composite onto the full-res export
      // so the saved file embeds the words at export resolution.
      blob = await this.compositeTexts(blob);
      const name = this.fileName();
      this.updateProgress({ phase: 'encode', progress: 1, tile: 0, tiles: 0 });
      if (callback) {
        this.progressLabel.textContent = this.s.uploading;
        await callback(blob, name);
      } else if (this.autoDownload) {
        download(blob, name);
      }
      this.closeSheet();
      this.toast(mode === 'copy' ? this.s.savedCopy : this.s.saved);
    } catch (error) {
      if (isAbortError(error)) this.toast(this.s.exportCancelled);
      else {
        const detail = error instanceof Error && error.message ? `: ${error.message}` : '';
        this.toast(`${this.s.exportFailed}${detail}`, true);
      }
    } finally {
      this.exportAbort = null;
      this.progressEl.hidden = true;
      this.saving = false;
      this.saveImageBtn.disabled = false;
      if (this.saveCopyBtn) this.saveCopyBtn.disabled = false;
      if (activeLabel) activeLabel.textContent = previousLabel;
      activeButton?.removeAttribute('aria-busy');
    }
  }

  private updateProgress(progress: ExportProgress): void {
    const pct = Math.round(clamp(progress.progress, 0, 1) * 100);
    this.progressBar.style.width = `${pct}%`;
    this.progressText.textContent = `${pct}%`;
    this.progressLabel.textContent =
      progress.progress >= 1
        ? this.s.encoding
        : progress.phase === 'encode'
          ? this.s.encoding
          : this.s.rendering;
  }

  private toast(message: string, error = false): void {
    this.toastEl.className = `au-toast${error ? ' is-error' : ''}`;
    this.toastEl.innerHTML = `${icon(error ? 'alert' : 'check')}<span></span>`;
    const text = this.toastEl.querySelector('span');
    if (text) text.textContent = message;
    this.toastEl.classList.add('is-open');
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.toastEl.classList.remove('is-open');
      this.toastTimer = 0;
    }, 2400);
  }
}
