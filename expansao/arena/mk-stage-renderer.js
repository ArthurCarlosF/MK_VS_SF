/* Native UMK3 stage assets. Match camera and viewport conversion stay with the arena. */
(function (scope) {
  'use strict';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function makeCanvas(width, height) {
    if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  class NativeMkStage {
    constructor(manifest, images) {
      this.manifest = manifest;
      this.images = images;
      this.buffer = null;
    }

    static async load(manifestUrl) {
      const url = new URL(manifestUrl, scope.location?.href || 'http://localhost/');
      const response = await fetch(url);
      if (!response.ok) throw new Error('Could not load native UMK3 stage manifest');
      const manifest = await response.json();
      if (manifest.schema !== 1 || manifest.game !== 'umk3' || !manifest.layers?.length) {
        throw new Error('Invalid native UMK3 stage manifest');
      }
      const textures = new Map();
      for (const layer of manifest.layers) {
        for (const texture of layer.type === 'animation' ? layer.frames.map(frame => frame.texture) : [layer.texture]) {
          textures.set(texture.file, texture);
        }
      }
      const images = new Map();
      await Promise.all([...textures.values()].map(async texture => {
        const image = new Image();
        image.src = new URL(texture.file, url).href;
        await image.decode();
        if (image.naturalWidth !== texture.width || image.naturalHeight !== texture.height) {
          throw new Error('Unexpected native stage image dimensions');
        }
        images.set(texture.file, image);
      }));
      return new NativeMkStage(manifest, images);
    }

    drawFloor(ctx, layer, delta, width, extraLeft) {
      const image = this.images.get(layer.texture.file);
      const stride = layer.sourceStridePixels;
      for (let row = 0; row < layer.visibleRows; row++) {
        const shift = Math.ceil(delta * (1 + row / layer.parallaxDivisor));
        const basePhase = layer.initialPhaseFixed16 === undefined ? 0 :
          Math.floor((layer.initialPhaseFixed16 + row * layer.rowPhaseStepFixed16) / 65536);
        let source = row * stride + layer.sourceColumnAtBase + shift - extraLeft - basePhase;
        let destination = 0;
        while (destination < width) {
          const sourceY = Math.floor(source / stride);
          const sourceX = source % stride;
          if (sourceY < 0 || sourceY >= image.height) throw new Error('Native floor scanline exceeds its ROM strip');
          const length = Math.min(width - destination, stride - sourceX);
          ctx.drawImage(image, sourceX, sourceY, length, 1, destination, layer.y + row, length, 1);
          destination += length;
          source += length;
        }
      }
    }

    validateWidth(width) {
      const camera = this.manifest.camera;
      const worldRight = camera.max + this.manifest.nativeViewport[0];
      if (!Number.isInteger(width) || width < 1 || width > worldRight - camera.min) {
        throw new RangeError('Invalid native stage viewport width');
      }
      return worldRight;
    }

    renderNative(ctx, {nativeWidth = this.manifest.nativeViewport[0], cameraX, elapsed = 0, frameIndex} = {}) {
      const [baseWidth, height] = this.manifest.nativeViewport;
      const camera = this.manifest.camera;
      const width = nativeWidth;
      const worldRight = this.validateWidth(width);
      const extraLeft = Math.floor((width - baseWidth) / 2);
      cameraX ??= camera.base - extraLeft;
      if (!Number.isFinite(cameraX) || !Number.isFinite(elapsed) || (frameIndex !== undefined && !Number.isFinite(frameIndex))) {
        throw new Error('Invalid native stage camera or time');
      }
      const cameraLeft = Math.floor(clamp(cameraX, camera.min, worldRight - width));
      const delta = cameraLeft + extraLeft - camera.base;
      const tick = Math.max(0, Math.floor(frameIndex ?? elapsed * this.manifest.nativeFps));
      ctx.save();
      try {
        ctx.imageSmoothingEnabled = false;
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.clip();
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        for (const layer of this.manifest.layers) {
          if (layer.type === 'floor') {
            this.drawFloor(ctx, layer, delta, width, extraLeft);
            continue;
          }
          const x = layer.scrollAtBase[0] + Math.floor(delta * layer.scrollXPerCameraPixel) - extraLeft;
          const y = layer.scrollAtBase[1];
          if (layer.type === 'module') {
            const image = this.images.get(layer.texture.file);
            const left = layer.origin[0] - x;
            const top = layer.origin[1] - y;
            ctx.drawImage(image, left, top);
            if (layer.wideViewportRepeatX && width > baseWidth) {
              // The original far layer covers one arcade screen. Tile only its extensions.
              ctx.save();
              ctx.beginPath();
              ctx.rect(0, 0, extraLeft, height);
              ctx.rect(extraLeft + baseWidth, 0, width - extraLeft - baseWidth, height);
              ctx.clip();
              const first = left - Math.ceil(left / image.naturalWidth) * image.naturalWidth;
              for (let repeat = first; repeat < width; repeat += image.naturalWidth) {
                ctx.drawImage(image, repeat, top);
              }
              ctx.restore();
            }
          } else if (layer.type === 'animation') {
            const index = Math.floor(tick / layer.frameDelayNativeTicks) % layer.frames.length;
            const frame = layer.frames[index];
            const texture = this.images.get(frame.texture.file);
            for (const position of layer.positions) {
              ctx.drawImage(texture, position.x - x + frame.origin[0], position.y - y + frame.origin[1]);
            }
          } else {
            throw new Error('Unknown native stage layer');
          }
        }
      } finally {
        ctx.restore();
      }
    }

    draw(ctx, {x = 0, y = 0, width, height, nativeWidth = this.manifest.nativeViewport[0], cameraX, elapsed, frameIndex} = {}) {
      const nativeHeight = this.manifest.nativeViewport[1];
      this.validateWidth(nativeWidth);
      this.buffer ??= makeCanvas(nativeWidth, nativeHeight);
      if (this.buffer.width !== nativeWidth) this.buffer.width = nativeWidth;
      this.renderNative(this.buffer.getContext('2d'), {nativeWidth, cameraX, elapsed, frameIndex});
      ctx.save();
      try {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.buffer, x, y, width ?? nativeWidth, height ?? nativeHeight);
      } finally {
        ctx.restore();
      }
    }

    musicForRound(round) {
      return round === 1 ? this.manifest.music.roundOne : this.manifest.music.laterRound;
    }
  }

  scope.NativeMkStage = NativeMkStage;
})(typeof window === 'undefined' ? globalThis : window);
