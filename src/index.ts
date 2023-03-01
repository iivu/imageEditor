export type ImageEditorConfig = {
  backgroundColor?: string;
};
export type EditInfo = { x: number; y: number; scale: number; rotate: number };

export class ImageEditor {
  private canvas: HTMLCanvasElement | null;
  private image: HTMLImageElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private width = 0;
  private height = 0;
  private editInfo: EditInfo = { x: 0, y: 0, scale: 1, rotate: 0 };
  private config: ImageEditorConfig = {};

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement, config: ImageEditorConfig = {}) {
    this.canvas = canvas;
    this.image = image;
    this.config = config;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = true;
    this.width = canvas.width;
    this.height = canvas.height;
    this.editInfo = { x: this.width / 2, y: this.height / 2, scale: 1, rotate: 0 };
    this.update();
  }

  update() {
    if (this.ctx === null || this.image == null) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.config.backgroundColor) {
      this.ctx.fillStyle = this.config.backgroundColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    this.ctx.save();
    // 画布原点设置在canvas中心
    this.ctx.transform(this.editInfo.scale, 0, 0, this.editInfo.scale, this.editInfo.x, this.editInfo.y);
    this.ctx.rotate((this.editInfo.rotate * Math.PI) / 180);
    // 保证宽度不发生裁剪
    const imageRatio = this.image.width / this.image.height;
    const imageDrawWidth = Math.min(this.height * imageRatio, this.width);
    const imageDrawHeight = imageDrawWidth / imageRatio;
    this.ctx.drawImage(this.image, -imageDrawWidth / 2,-imageDrawHeight / 2, imageDrawWidth, imageDrawHeight);
    this.ctx.restore();
  }

  move(x: number, y: number) {
    this.editInfo.x = x;
    this.editInfo.y = y;
    this.update();
  }

  pinch(scale: number) {
    this.editInfo.scale = Math.max(0.2, scale);
    this.update();
  }

  rotate(r: number) {
    this.editInfo.rotate = r;
    this.update();
  }

  getEditInfo() {
    return this.editInfo;
  }

  getRotate() {
    return this.editInfo.rotate;
  }

  getScale() {
    return this.editInfo.scale;
  }

  getPosition() {
    return { x: this.editInfo.x, y: this.editInfo.y };
  }

  toDataURL() {
    return this.canvas!.toDataURL("image/jpeg", 0.8);
  }

  destroy() {
    this.canvas = null;
    this.image = null;
  }
}
