// ==UserScript==
// @name           Show Alt Text
// @description    Show the alt text of images
// @author         Winston Smith <winston@sequential.me>, blinry <sebastian@morr.cc>
// @version        0.2.0
// @include        *://*/*
// @updateURL      https://github.com/blinry/show-alt-text-userscript/raw/main/show-alt-text.user.js
// @run-at         document-start
// @grant          GM_addStyle
// ==/UserScript==

GM_addStyle(`
/* This is the box displaying a solid color (blue or red), plus the alt text, if available. */
.alt-text-box {
  padding: 8px;
  color: black !important;
  font-family: monospace;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  transition: all 0.2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
  overflow: hidden;
}
.alt-text-box:hover {
  opacity: 0.95;
}

/* This is a container that will wrap the original image, plus the alt-text-box. */
.alt-text-container {
  display: inline-block;
  position: relative;
  opacity: 100 !important; // Fix for Twitter.
}
`)

// Helper function to wrap toWrap element with wrapper.
var wrap = function (toWrap, wrapper) {
  wrapper = wrapper || document.createElement('div')
  toWrap.parentNode.appendChild(wrapper)
  return wrapper.appendChild(toWrap)
}

var red = '#FF7575'
var blue = '#75A3FF'

function addAltTags() {
  for (let img of [...document.querySelectorAll('img, video, *[style*="background-image:"]')]) {
    if (img.parentElement.classList.contains('alt-text-container')) {
      // This element has been processed already!
      continue
    }

    var overlay = document.createElement('div')
    overlay.classList.add('alt-text-box')

    let altText = img.alt || img.getAttribute("aria-label") || img.title || img.parentElement.getAttribute("aria-label") || ''
    // The latter two options occur on Twitter.
    if (altText == '' || altText == 'Image' || altText == 'Embedded video') {
      overlay.style.background = red
    } else {
      overlay.style.background = blue
      overlay.innerHTML = altText
    }

    let container = document.createElement('div')
    container.classList = img.classList
    container.classList.add('alt-text-container')
    wrap(img, container)
    container.appendChild(overlay)
  }
}

// Look for new images every 0.1 seconds.
addAltTags()
let clickTimer = setInterval(function () {
  addAltTags()
}, 100)
