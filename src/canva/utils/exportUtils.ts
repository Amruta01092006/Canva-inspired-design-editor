import { CanvasBackground, CanvasElement, ProjectData, ShapeElement, TextElement, ImageElement } from '../types/canvas';

export interface ExportOptions {
  scale?: number; // 1, 2, 3
  format?: 'png' | 'jpeg';
  quality?: number; // 0.1 - 1.0 for jpeg
  transparentBackground?: boolean;
}

export const exportUtils = {
  async renderProjectToCanvas(project: ProjectData, options: ExportOptions = {}): Promise<HTMLCanvasElement> {
    const scale = options.scale || 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(project.width * scale);
    canvas.height = Math.round(project.height * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create 2D canvas context');

    // 1. Render Background
    if (!options.transparentBackground) {
      await this.drawBackground(ctx, project.background, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Sort elements by zIndex
    const sortedElements = [...project.elements].sort((a, b) => a.zIndex - b.zIndex);

    // 3. Render each element
    for (const el of sortedElements) {
      ctx.save();
      // Translate to element center for rotation, or top-left
      const elX = el.x * scale;
      const elY = el.y * scale;
      const elW = el.width * scale;
      const elH = el.height * scale;

      ctx.globalAlpha = el.opacity ?? 1;

      if (el.rotation) {
        ctx.translate(elX + elW / 2, elY + elH / 2);
        ctx.rotate((el.rotation * Math.PI) / 180);
        ctx.translate(-(elX + elW / 2), -(elY + elH / 2));
      }

      if (el.type === 'text') {
        this.drawText(ctx, el as TextElement, elX, elY, elW, elH, scale);
      } else if (el.type === 'shape') {
        this.drawShape(ctx, el as ShapeElement, elX, elY, elW, elH);
      } else if (el.type === 'image') {
        await this.drawImage(ctx, el as ImageElement, elX, elY, elW, elH);
      }

      ctx.restore();
    }

    return canvas;
  },

  async drawBackground(ctx: CanvasRenderingContext2D, bg: CanvasBackground, w: number, h: number): Promise<void> {
    if (bg.type === 'gradient' && bg.value) {
      // Parse simple linear-gradient or fallback to elegant gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      if (bg.value.includes('#00c4cc') && bg.value.includes('#7d2ae8')) {
        grad.addColorStop(0, '#00c4cc');
        grad.addColorStop(1, '#7d2ae8');
      } else if (bg.value.includes('#ff0844') || bg.value.includes('#ffb199')) {
        grad.addColorStop(0, '#ff0844');
        grad.addColorStop(1, '#ffb199');
      } else if (bg.value.includes('#18191b') || bg.value.includes('#2d1847')) {
        grad.addColorStop(0, '#18191b');
        grad.addColorStop(1, '#2d1847');
      } else if (bg.value.includes('#4facfe') || bg.value.includes('#00f2fe')) {
        grad.addColorStop(0, '#4facfe');
        grad.addColorStop(1, '#00f2fe');
      } else if (bg.value.includes('#30cfd0') || bg.value.includes('#330867')) {
        grad.addColorStop(0, '#30cfd0');
        grad.addColorStop(1, '#330867');
      } else if (bg.value.includes('#1f2937') || bg.value.includes('#111827')) {
        grad.addColorStop(0, '#1f2937');
        grad.addColorStop(1, '#111827');
      } else {
        grad.addColorStop(0, '#0e1318');
        grad.addColorStop(1, '#1e1035');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (bg.type === 'image' && bg.value) {
      try {
        const img = await this.loadImage(bg.value);
        ctx.drawImage(img, 0, 0, w, h);
      } catch {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
    } else {
      ctx.fillStyle = bg.value || '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
  },

  drawText(
    ctx: CanvasRenderingContext2D,
    el: TextElement,
    x: number,
    y: number,
    w: number,
    _h: number,
    scale: number
  ): void {
    const fontSize = Math.round(el.fontSize * scale);
    const fontStyle = el.fontStyle === 'italic' ? 'italic' : 'normal';
    const fontWeight = el.fontWeight || 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${el.fontFamily || 'Inter, sans-serif'}`;
    ctx.fillStyle = el.color || '#000000';
    ctx.textBaseline = 'top';

    const lines = el.text.split('\n');
    const lineHeight = fontSize * (el.lineHeight || 1.25);

    lines.forEach((line, index) => {
      let renderLine = line;
      if (el.textTransform === 'uppercase') renderLine = renderLine.toUpperCase();
      if (el.textTransform === 'lowercase') renderLine = renderLine.toLowerCase();

      let lineX = x;
      if (el.textAlign === 'center') {
        const metrics = ctx.measureText(renderLine);
        lineX = x + (w - metrics.width) / 2;
      } else if (el.textAlign === 'right') {
        const metrics = ctx.measureText(renderLine);
        lineX = x + w - metrics.width;
      }

      const lineY = y + index * lineHeight;
      ctx.fillText(renderLine, lineX, lineY);

      if (el.textDecoration === 'underline') {
        const metrics = ctx.measureText(renderLine);
        ctx.strokeStyle = el.color;
        ctx.lineWidth = Math.max(1, Math.round(fontSize / 14));
        ctx.beginPath();
        ctx.moveTo(lineX, lineY + fontSize + 2);
        ctx.lineTo(lineX + metrics.width, lineY + fontSize + 2);
        ctx.stroke();
      }
    });
  },

  drawShape(
    ctx: CanvasRenderingContext2D,
    el: ShapeElement,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    ctx.fillStyle = el.fillColor || 'transparent';
    ctx.strokeStyle = el.strokeColor || 'transparent';
    ctx.lineWidth = el.strokeWidth || 0;

    if (el.strokeDash === 'dashed') ctx.setLineDash([8, 6]);
    else if (el.strokeDash === 'dotted') ctx.setLineDash([3, 3]);
    else ctx.setLineDash([]);

    const hasStroke = el.strokeWidth > 0 && el.strokeColor && el.strokeColor !== 'transparent';
    const hasFill = el.fillColor && el.fillColor !== 'transparent';

    ctx.beginPath();

    switch (el.shapeType) {
      case 'rectangle':
        ctx.rect(x, y, w, h);
        break;

      case 'rounded-rectangle': {
        const r = Math.min((el.cornerRadius || 16), w / 2, h / 2);
        if (typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(x, y, w, h, r);
        } else {
          ctx.rect(x, y, w, h);
        }
        break;
      }

      case 'circle': {
        const cx = x + w / 2;
        const cy = y + h / 2;
        ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
        break;
      }

      case 'triangle':
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        break;

      case 'star': {
        const cx = x + w / 2;
        const cy = y + h / 2;
        const outerR = Math.min(w, h) / 2;
        const innerR = outerR * 0.42;
        const points = 5;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / points;

        ctx.moveTo(cx, cy - outerR);
        for (let i = 0; i < points; i++) {
          ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
          rot += step;
          ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
          rot += step;
        }
        ctx.closePath();
        break;
      }

      case 'polygon': {
        // Hexagon
        const cx = x + w / 2;
        const cy = y + h / 2;
        const r = Math.min(w, h) / 2;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      }

      case 'heart': {
        const topCurveHeight = h * 0.3;
        ctx.moveTo(x + w / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x + w / 2, y, x, y, x, y + topCurveHeight);
        ctx.bezierCurveTo(x, y + (h + topCurveHeight) / 2, x + w / 2, y + (h + topCurveHeight) / 1.5, x + w / 2, y + h);
        ctx.bezierCurveTo(x + w / 2, y + (h + topCurveHeight) / 1.5, x + w, y + (h + topCurveHeight) / 2, x + w, y + topCurveHeight);
        ctx.bezierCurveTo(x + w, y, x + w / 2, y, x + w / 2, y + topCurveHeight);
        ctx.closePath();
        break;
      }

      case 'arrow':
        ctx.moveTo(x, y + h * 0.35);
        ctx.lineTo(x + w * 0.65, y + h * 0.35);
        ctx.lineTo(x + w * 0.65, y);
        ctx.lineTo(x + w, y + h / 2);
        ctx.lineTo(x + w * 0.65, y + h);
        ctx.lineTo(x + w * 0.65, y + h * 0.65);
        ctx.lineTo(x, y + h * 0.65);
        ctx.closePath();
        break;

      case 'line':
        ctx.moveTo(x, y + h / 2);
        ctx.lineTo(x + w, y + h / 2);
        break;

      case 'badge-sale':
      case 'badge-new':
      case 'badge-pro': {
        // Rounded badge with text
        const r = h / 2;
        if (typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(x, y, w, h, r);
        } else {
          ctx.rect(x, y, w, h);
        }
        break;
      }

      default:
        ctx.rect(x, y, w, h);
    }

    if (hasFill) ctx.fill();
    if (hasStroke) ctx.stroke();

    // Badges inner text
    if (el.shapeType === 'badge-sale' || el.shapeType === 'badge-new' || el.shapeType === 'badge-pro') {
      const badgeText =
        el.shapeType === 'badge-sale' ? '50% OFF' : el.shapeType === 'badge-new' ? 'NEW' : 'PRO';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(h * 0.5)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, x + w / 2, y + h / 2);
    }
  },

  async drawImage(
    ctx: CanvasRenderingContext2D,
    el: ImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ): Promise<void> {
    try {
      const img = await this.loadImage(el.src);

      ctx.save();

      // CSS filters
      const filterParts: string[] = [];
      if (el.brightness !== undefined && el.brightness !== 100) filterParts.push(`brightness(${el.brightness}%)`);
      if (el.contrast !== undefined && el.contrast !== 100) filterParts.push(`contrast(${el.contrast}%)`);
      if (el.saturation !== undefined && el.saturation !== 100) filterParts.push(`saturate(${el.saturation}%)`);
      if (el.blur && el.blur > 0) filterParts.push(`blur(${el.blur}px)`);
      if (el.grayscale && el.grayscale > 0) filterParts.push(`grayscale(${el.grayscale}%)`);
      if (el.sepia && el.sepia > 0) filterParts.push(`sepia(${el.sepia}%)`);

      if (filterParts.length > 0) {
        ctx.filter = filterParts.join(' ');
      }

      // Flip
      let drawX = x;
      let drawY = y;
      let drawW = w;
      let drawH = h;

      if (el.flipX || el.flipY) {
        ctx.translate(x + w / 2, y + h / 2);
        ctx.scale(el.flipX ? -1 : 1, el.flipY ? -1 : 1);
        drawX = -w / 2;
        drawY = -h / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    } catch (e) {
      console.warn('Failed to draw image:', e);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x, y, w, h);
    }
  },

  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  },

  async generateThumbnail(project: ProjectData): Promise<string> {
    try {
      const thumbScale = Math.min(240 / project.width, 240 / project.height);
      const canvas = await this.renderProjectToCanvas(project, { scale: thumbScale, format: 'jpeg', quality: 0.7 });
      return canvas.toDataURL('image/jpeg', 0.7);
    } catch {
      return '';
    }
  },

  async downloadProject(project: ProjectData, options: ExportOptions = {}): Promise<void> {
    const canvas = await this.renderProjectToCanvas(project, options);
    const format = options.format || 'png';
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, options.quality || 0.95);

    const a = document.createElement('a');
    const safeTitle = (project.title || 'untitled-design').replace(/[^a-z0-9_-]/gi, '_');
    a.download = `${safeTitle}-${project.width}x${project.height}.${format}`;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },
};
