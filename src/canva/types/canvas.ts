export type ElementType = 'text' | 'shape' | 'image';

export type ShapeType =
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'polygon'
  | 'heart'
  | 'arrow'
  | 'line'
  | 'badge-sale'
  | 'badge-new'
  | 'badge-pro';

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees 0-360
  opacity: number; // 0-1
  zIndex: number;
  locked?: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold' | '500' | '600' | '700' | '800';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  letterSpacing: number; // in px
  lineHeight: number; // e.g. 1.2
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDash?: 'solid' | 'dashed' | 'dotted';
  cornerRadius?: number; // for rounded rectangles
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  aspectRatio?: number;
  brightness: number; // 100 is normal
  contrast: number; // 100 is normal
  saturation: number; // 100 is normal
  blur: number; // in px, default 0
  grayscale: number; // 0-100%
  sepia: number; // 0-100%
  flipX: boolean;
  flipY: boolean;
}

export type CanvasElement = TextElement | ShapeElement | ImageElement;

export interface CanvasBackground {
  type: 'color' | 'gradient' | 'image';
  value: string; // hex color, CSS gradient, or image URL
  opacity?: number;
}

export interface CanvasPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  iconName: string;
  category: 'social' | 'print' | 'presentation' | 'custom';
}

export interface ProjectMetadata {
  id: string;
  title: string;
  width: number;
  height: number;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string; // data URL preview
}

export interface ProjectData extends ProjectMetadata {
  background: CanvasBackground;
  elements: CanvasElement[];
}

export interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number;
}
