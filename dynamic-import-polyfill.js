/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export function importScript(href, onload, onerror) {
  return importModule(href, onload, onerror, true, 'application/javascript');
}

export function importFrom(base) {
  return function(href, onload, onerror) {
    return importModule(base + href, onload, onerror);
  }
}

let importGuid = 0;
const ims = window.__$importModules$ = new Map();

export function importModule(href, onload, onerror, async, type) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    const remove = _ => s.parentNode.removeChild(s);
    const guid = importGuid++;
    s.type = type || 'module';
    if (s.type == 'module') {
      s.textContent = `
        import * as module from '${href}';
        let script = window.__$importModules$.get(${guid});
        script.module = module;
        script.dispatchEvent(new CustomEvent('load'));`
    } else {
      s.src = href;
    }
    ims.set(guid, s);
    s.onload = _ => {
      remove();
      onload && onload();
      s.onload = null;
      ims.delete(guid);
      resolve(s.module);
    }
    s.onerror = _ => {
      remove();
      onerror && onerror();
      console.warn('Error loading lazy import; ensure you have a <link rel="lazy-import"> for this file:', href);
      reject();
    };
    document.head.appendChild(s);
  });
};
