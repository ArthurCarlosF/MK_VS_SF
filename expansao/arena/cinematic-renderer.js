(function (scope) {
  'use strict';

  const profiles = new Map();
  const imageRequests = new Map();

  function loadImage(url) {
    if (!imageRequests.has(url)) {
      const request = new Promise((resolve, reject) => {
        const image = new scope.Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Cinematic sprite unavailable: ${url}`));
        image.src = url;
      });
      imageRequests.set(url, request);
      request.catch(() => imageRequests.delete(url));
    }
    return imageRequests.get(url);
  }

  function validateProfile(profile, profileId) {
    if (profile?.id !== profileId || profile.schema !== 1 ||
        !Number.isFinite(profile.nativeFps) || profile.nativeFps <= 0 ||
        ![1, -1].includes(profile.origin?.sourceFacing) ||
        !Array.isArray(profile.frames) || !profile.frames.length ||
        profile.frameCount !== profile.frames.length || !profile.assets) {
      throw new Error(`Invalid flat cinematic profile: ${profileId}`);
    }
    for (const [index, frame] of profile.frames.entries()) {
      if (frame.frame !== index || !Array.isArray(frame.objects)) {
        throw new Error(`Invalid cinematic frame ${index}: ${profileId}`);
      }
      let lastOrder = -Infinity;
      for (const object of frame.objects) {
        const position = object.stageAlignedWorldFromOwnerInitial;
        if (!position || ![position.x, position.rootY, object.order].every(Number.isFinite) ||
            object.order < lastOrder || !Object.hasOwn(profile.assets, object.asset) ||
            !Array.isArray(object.anchor) || object.anchor.length !== 2 ||
            !object.anchor.every(Number.isFinite)) {
          throw new Error(`Invalid cinematic object in frame ${index}: ${profileId}`);
        }
        lastOrder = object.order;
      }
    }
  }

  function load(baseURL, profileId) {
    // A directory URL ends in slash. A JSON URL may point to a renamed profile.
    const base = new URL(baseURL, scope.document?.baseURI ?? scope.location?.href);
    if (!base.pathname.endsWith('.json') && !base.pathname.endsWith('/')) base.pathname += '/';
    const profileURL = base.pathname.endsWith('.json') ? base : new URL('profile-flat.json', base);
    const existing = profiles.get(profileId);
    if (existing) {
      if (existing.url !== profileURL.href) {
        return Promise.reject(new Error(`Cinematic profile ID already loaded: ${profileId}`));
      }
      return existing.request;
    }

    const entry = {url: profileURL.href, ready: null};
    entry.request = (async () => {
      const response = await scope.fetch(profileURL.href);
      if (!response.ok) throw new Error(`Cinematic profile unavailable: ${profileURL.href}`);
      const profile = await response.json();
      validateProfile(profile, profileId);
      const spritePairs = await Promise.all(Object.entries(profile.assets).map(async ([id, asset]) => {
        if (typeof asset.file !== 'string' || !asset.file) throw new Error(`Invalid cinematic sprite: ${id}`);
        const image = await loadImage(new URL(asset.file, profileURL).href);
        if (image.naturalWidth !== asset.width || image.naturalHeight !== asset.height) {
          throw new Error(`Cinematic sprite dimensions differ: ${id}`);
        }
        return [id, image];
      }));
      entry.ready = {profile, sprites: new Map(spritePairs)};
      return profile;
    })();
    profiles.set(profileId, entry);
    entry.request.catch(() => profiles.delete(profileId));
    return entry.request;
  }

  function draw(ctx, {cinematics = [], cameraLeft, cameraY = 0, scale, floor, drawVictim, drawOwner, localizeEffects = false}) {
    if (![cameraLeft, cameraY, scale, floor].every(Number.isFinite) || scale <= 0) return 0;
    let drawn = 0;
    for (const scene of cinematics) {
      const entry = profiles.get(scene.profile)?.ready;
      if (!entry || !Number.isInteger(scene.frame) || ![1, -1].includes(scene.facing) ||
          !Number.isFinite(scene.originX) || !Number.isFinite(scene.originY)) continue;
      const frame = entry.profile.frames[scene.frame];
      if (!frame) continue;
      const mirror = scene.facing * entry.profile.origin.sourceFacing;
      const originScreenX = Math.round((scene.originX - cameraLeft) * scale);
      const originScreenY = floor + (cameraY - scene.originY) * scale;

      ctx.save();
      try {
        ctx.imageSmoothingEnabled = false;
        ctx.translate(originScreenX, originScreenY);
        // MK's presentation uses one native pixel per world unit. The scene
        // transform mirrors every root and sprite around the initial owner.
        ctx.scale(mirror * scale, scale);
        if(frame.screenFade>0){
          ctx.save();ctx.globalAlpha=Math.min(1,frame.screenFade);ctx.fillStyle='#000';
          if(localizeEffects){const left=-(entry.profile.origin.nativeOwnerInitialX-entry.profile.origin.nativeCameraInitialX);ctx.fillRect(left,-260,400,300);}else ctx.fillRect(-3000,-3000,6000,6000);
          ctx.restore();
        }
        for (const object of frame.objects) {
          const {x, rootY} = object.stageAlignedWorldFromOwnerInitial;
          const baby = entry.profile.babySourcePose===object.nativePose;
          if(scene.adaptOwner&&object.role==='owner'&&drawOwner){
            drawOwner(ctx,{scene,object,x,feetY:object.stageAlignedWorldFromOwnerInitial.feetY,sourceFacing:entry.profile.origin.sourceFacing});
            drawn++;continue;
          }
          if (scene.adaptVictim && (object.role==='victim'||baby)) {
            const babyId=baby&&entry.profile.babyVictims?.[scene.victimFighter];
            const feetY=baby ? rootY-object.anchor[1]-entry.profile.assets[object.asset].height
                             : object.stageAlignedWorldFromOwnerInitial.feetY;
            if (babyId) {
              const image=entry.sprites.get(babyId);
              ctx.drawImage(image,x-image.naturalWidth/2,-feetY-image.naturalHeight);
            } else if (drawVictim) {
              drawVictim(ctx,{scene,object,x,feetY,baby,sourceFacing:entry.profile.origin.sourceFacing});
            }
            drawn++;
            continue;
          }
          const [anchorX, anchorY] = object.anchor;
          const image = entry.sprites.get(object.asset);
          if (object.flipX) {
            ctx.save();
            try {
              ctx.translate(x, -rootY);
              ctx.scale(-1, 1);
              ctx.drawImage(image, -anchorX, -anchorY);
            } finally {
              ctx.restore();
            }
          } else {
            ctx.drawImage(image, x - anchorX, -rootY - anchorY);
          }
          drawn++;
        }
      } finally {
        ctx.restore();
      }
    }
    return drawn;
  }

  function drawScenery(ctx, {cinematics, cameraLeft, cameraY, scale, floor, isolatedDuel}) {
    for (const scene of cinematics) {
      const entry=profiles.get(scene.profile)?.ready;
      const frame=entry?.profile.frames[scene.frame];
      if (!frame?.scenery?.length || frame.sceneryMode==='descent'&&!isolatedDuel) continue;
      ctx.save();
      if (frame.sceneryMode==='descent') {
        ctx.fillStyle='#000';
        ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
      }
      ctx.translate((scene.originX-cameraLeft)*scale, floor+(cameraY-scene.originY)*scale);
      ctx.scale(scene.facing*entry.profile.origin.sourceFacing*scale,scale);
      for (const [asset,x,y] of frame.scenery) ctx.drawImage(entry.sprites.get(asset),x,y);
      ctx.restore();
    }
  }

  function bounds(cinematics) {
    let left=Infinity,right=-Infinity;
    for(const scene of cinematics){
      const profile=profiles.get(scene.profile)?.ready?.profile,frame=profile?.frames[scene.frame];
      if(!frame)continue;
      const mirror=scene.facing*profile.origin.sourceFacing;
      for(const object of frame.objects){
        const x=object.stageAlignedWorldFromOwnerInitial.x,w=profile.assets[object.asset].width;
        const dx=object.flipX?x+object.anchor[0]-w:x-object.anchor[0];
        const a=scene.originX+mirror*dx,b=scene.originX+mirror*(dx+w);
        left=Math.min(left,a,b);right=Math.max(right,a,b);
      }
    }
    return Number.isFinite(left)?{left,right}:null;
  }

  scope.NativeCinematics = Object.freeze({load, draw, drawScenery, bounds});
})(typeof window === 'undefined' ? globalThis : window);
