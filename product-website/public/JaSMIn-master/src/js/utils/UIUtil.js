import { KeyCodes } from '../Constants.js';
import { ThreeJsUtil } from './ThreeJsUtil.js';

/**
 * General user interface namespace, definitions, etc.
 *
 * @author Stefan Glaser
 */
class UIUtil {
  /**
   * Calculate the brightness value of a color.
   *
   * @param  {!THREE.Color} color the color to check
   * @return {number} the brightness value between 0 and 255
   */
  static getBrightness (color)
  {
    return 255 * Math.sqrt(
        color.r * color.r * 0.241 +
        color.g * color.g * 0.691 +
        color.b * color.b * 0.068);
  }

  /**
   * Retrieve the default foreground color for a given background color.
   *
   * @param  {!THREE.Color} color the background color
   * @return {!THREE.Color} the forground color
   */
  static getForegroundColor (color)
  {
    return UIUtil.getBrightness(color) < 130 ? ThreeJsUtil.Color_LightGrey() : ThreeJsUtil.Color_DarkGrey();
  }

  /**
   * Make the given element visible or invisible.
   *
   * @param {!Element} element the DOM element
   * @param {boolean=} visible true for visible, false for invisible
   */
  static setVisibility (element, visible)
  {
    if (visible === undefined || visible) {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  }

  /**
   * Check if the given component is visible.
   *
   * @param {!Element} element the DOM element
   * @return {boolean} true for visible, false for invisible
   */
  static isVisible (element)
  {
    return element.style.display != 'none';
  }

  /**
   * Toggle the visibility of the given component.
   *
   * @param {!Element} element the DOM element
   * @return {boolean} true, if the element is now visible, false otherwise
   */
  static toggleVisibility (element)
  {
    if(element.style.display != 'none') {
      element.style.display = 'none';
      return false;
    } else {
      element.style.display = '';
      return true;
    }
  }

  /**
   * Create a new DOM Element.
   *
   * @param  {string} element the tag name
   * @param  {string=} content the content of the new element
   * @param  {string=} className the css class string
   * @return {!Element}
   */
  static createElement (element, content, className)
  {
    const newElement = document.createElement(element);

    if (content !== undefined) {
      newElement.innerHTML = content;
    }

    if (className !== undefined) {
      newElement.className = className;
    }

    return newElement;
  }

  /**
   * Create a new div element.
   *
   * @param  {string=} className the css class string
   * @return {!Element} the new div element
   */
  static createDiv (className)
  {
    return UIUtil.createElement('div', undefined, className);
  }

  /**
   * Create a new span element.
   *
   * @param  {string=} text the content of the span
   * @param  {string=} className the css class string
   * @return {!Element} the new span element
   */
  static createSpan (text, className)
  {
    return UIUtil.createElement('span', text, className);
  }

  /**
   * Create a new player button input element.
   *
   * @param  {string=} text the button text
   * @param  {string=} className the button css class string
   * @param  {string=} toolTip the button tool tip
   * @param  {!Function=} action the button action
   * @param  {boolean=} preventDefault prevent the default mouse action
   * @return {!Element} the new button input element
   */
  static createPlayerButton (text, className, toolTip, action, preventDefault)
  {
    const btn = UIUtil.createElement('button', text, className);

    if (toolTip !== undefined) {
      btn.title = toolTip;
    }

    if (action !== undefined) {
      const keyListener = function () {
        const actionCB = action;

        return function (evt) {
          if (evt.keyCode == KeyCodes.ENTER ||
              evt.keyCode == KeyCodes.SPACE) {
            actionCB(evt);
          }
        };
      }();

      if (preventDefault) {
        const mouseListener = function () {
          const actionCB = action;

          return function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            actionCB(evt);
          };
        }();

        btn.addEventListener('mousedown', mouseListener);
      } else {
        btn.addEventListener('mousedown', action);
      }

      btn.addEventListener('keydown', keyListener);
    }

    return btn;
  }

  /**
   * Create a new button input element.
   *
   * @param  {string=} text the button text
   * @param  {string=} className the button css class string
   * @param  {string=} toolTip the button tool tip
   * @param  {!Function=} action the button action
   * @return {!Element} the new button input element
   */
  static createButton (text, className, toolTip, action)
  {
    const btn = UIUtil.createElement('button', text, className);

    if (toolTip !== undefined) {
      btn.title = toolTip;
    }

    if (action !== undefined) {
      const keyListener = function () {
        const actionCB = action;

        return function (evt) {
          if (evt.keyCode == KeyCodes.ENTER ||
              evt.keyCode == KeyCodes.SPACE) {
            actionCB(evt);
          }
        };
      }();

      btn.addEventListener('click', action);
      btn.addEventListener('keydown', keyListener);
    }

    return btn;
  }

  /**
   * Check if the given event relates to a button action.
   *
   * @param  {!Event} evt the event instance
   * @return {boolean}
   */
  static isButtonAction (evt)
  {
    // Check for key-code in event
    if (evt !== undefined) {
      if (evt.keyCode !== undefined) {
        // Key evnet
        return evt.keyCode == KeyCodes.ENTER || evt.keyCode == KeyCodes.SPACE;
      } else if (evt.button !== undefined) {
        // Mouse event
        return evt.button === 0;
      }
    }

    return false;
  }

  /**
   * Create a new ul element.
   *
   * @param  {string=} className the css class string
   * @return {!Element} the new ul element
   */
  static createUL (className)
  {
    return UIUtil.createElement('ul', undefined, className);
  }

  /**
   * Create a new li element.
   *
   * @param  {string=} className the css class string
   * @return {!Element} the new li element
   */
  static createLI (className)
  {
    return UIUtil.createElement('li', undefined, className);
  }

  /**
   * Create a new button input element.
   *
   * @param  {string=} text the link text
   * @param  {string=} href the link href attribute
   * @param  {string=} className the link css class string
   * @param  {string=} toolTip the link tool tip
   * @return {!Element} the new anchor (a) element
   */
  static createHref (text, href, className, toolTip)
  {
    const link = UIUtil.createElement('a', text, className);

    if (href !== undefined) {
      link.href = href;
    }

    if (toolTip !== undefined) {
      link.title = toolTip;
    }

    return link;
  }

  /**
   * Create a new single choice form element.
   *
   * @param  {!Array<string>} options the options to display
   * @param  {number=} preSelected the index of the preselected entry
   * @return {!Element} the new single choice form
   */
  static createSingleChoiceForm (options, preSelected)
  {
    if (preSelected === undefined) {
      preSelected = 0;
    }

    const form = UIUtil.createElement('form', undefined, 'jsm-s-choice');

    for (let i = 0; i < options.length; ++i) {
      const btnID = THREE.Math.generateUUID();

      const label = UIUtil.createElement('label');
      label.innerHTML = options[i];
      label.htmlFor = btnID;

      const btn = UIUtil.createElement('input');
      btn.id = btnID;
      btn.type = 'radio';
      btn.name = 'userOptions';
      btn.value = options[i];

      if (i === preSelected) {
        btn.checked = true;
      }

      form.appendChild(btn);
      form.appendChild(label);
    }

    form.onclick = function(event) { event.stopPropagation(); };

    return form;
  }

  /**
   * Create a new color chooser element.
   *
   * @param  {string} value the initial value
   * @param  {string=} title the tool tip text
   * @param  {string=} className the css class string
   * @return {!Element} the new li element
   */
  static createColorChooser (value, title, className)
  {
    const chooser = UIUtil.createElement('input', undefined, className);
    chooser.type = 'color';
    chooser.value = value;

    if (title) {
      chooser.title = title;
    }

    return chooser;
  }

  /**
   * Set the icon of an element.
   *
   * @param {!Element} element the element to set the icon class on
   * @param {string} iconClass the new icon class
   */
  static setIcon (element, iconClass)
  {
    const iconClassIdx = element.className.indexOf('icon-');

    if (iconClassIdx === -1) {
      element.className += ' ' + iconClass;
    } else {
      const spaceCharIdx = element.className.indexOf(' ', iconClassIdx);

      //console.log('Classes: ' + element.className + ' || IconIdx: ' + iconClassIdx + ' || SpaceIdx: ' + spaceCharIdx);

      if (spaceCharIdx !== -1) {
        // Intermediate class
        element.className = element.className.slice(0, iconClassIdx) + iconClass + element.className.slice(spaceCharIdx - 1);
      } else {
        // Last class
        element.className = element.className.slice(0, iconClassIdx) + iconClass;
      }

      //console.log('Classes-after: ' + element.className);
    }
  }

  /**
   * Convert the given time into MM:SS.cs format. E.g. 02:14.84
   *
   * @param  {number} time the time to convert
   * @param  {boolean=} fillZero fill leading zero minutes
   * @return {string} the time string
   */
  static toMMSScs (time, fillZero)
  {
    const millsNum = Math.round(time * 100);
    let minutes = Math.floor(millsNum / 6000);
    let seconds = Math.floor((millsNum - (minutes * 6000)) / 100);
    let mills = millsNum - (seconds * 100) - (minutes * 6000);

    if (fillZero && minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }
    if (mills < 10) { mills = '0' + mills; }

    return minutes + ':' + seconds + '.<small>' + mills + '</small>';
  }

  /**
   * Convert the given time into MM:SS format. E.g. 02:14
   *
   * @param  {number} time the time to convert
   * @param  {boolean=} fillZero fill leading zero minutes
   * @return {string} the time string
   */
  static toMMSS (time, fillZero)
  {
    const secNum = Math.floor(time);
    let minutes = Math.floor(secNum / 60);
    let seconds = secNum - (minutes * 60);

    if (fillZero && minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }

    return minutes + ':' + seconds;
  }

  /**
   * Simple event listener function to prevent further event propagation.
   *
   * @param {!Event} event the event
   * @return {void}
   */
  static StopEventPropagationListener (event)
  {
    event.stopPropagation();
  }

  /**
   * Filter a given list of elements by their tag name.
   *
   * @param  {!Array<!Element>} elements the elements to filter
   * @param  {string} tagName the tag name of the elements of interest
   * @return {!Array<!Element>}
   */
  static filterElements (elements, tagName)
  {
    const result = [];

    for (let i = 0; i < elements.length; i++) {
      if (elements[i].nodeName === tagName) {
        result.push(elements[i]);
      }
    }

    return result;
  }

  /**
   * Check if the browser supports a fullscreen mode.
   *
   * @return {boolean} true if the browser supports a fullscreen mode, false if not
   */
  static isFullscreenEnabled ()
  {
    return document.fullscreenEnabled === true ||
           document.mozFullScreenEnabled === true ||
           document.msFullscreenEnabled === true ||
           document.webkitFullscreenEnabled === true;
  }

  /**
   * Check if the browser is currently in fullscreen mode.
   *
   * @return {boolean} true if the browser is currently in fullscreen mode, false if not
   */
  static inFullscreen ()
  {
    const fullscreenElement = UIUtil.getFullscreenElement();

    return fullscreenElement !== undefined && fullscreenElement !== null;
  }

  /**
   * Check if the browser supports a fullscreen mode.
   *
   * @return {(?Element | undefined)} the fullscreen element or undefined if no such element exists
   */
  static getFullscreenElement ()
  {
    if (document.fullscreenElement !== undefined) {
      return document.fullscreenElement;
    } else if (document.mozFullScreenElement !== undefined) {
      return document.mozFullScreenElement;
    } else if (document.msFullscreenElement !== undefined) {
      return document.msFullscreenElement;
    } else if (document.webkitFullscreenElement !== undefined) {
      return document.webkitFullscreenElement;
    } else {
      return undefined;
    }
  }

  /**
   * Request fullscreen mode for the given element.
   *
   * @param {!Element} element the element to request fullscreen for
   * @return {void}
   */
  static requestFullscreenFor (element)
  {
    if (element.requestFullscreen !== undefined) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen !== undefined) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen !== undefined) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen !== undefined) {
      element.msRequestFullscreen();
    }
  }

  /**
   * Cancel the fullscreen mode.
   *
   * @return {void}
   */
  static cancelFullscreen ()
  {
    if (document.fullscreen && document.exitFullscreen !== undefined) {
      document.exitFullscreen();
    } else if (document.mozFullScreen && document.mozCancelFullScreen !== undefined) {
      document.mozCancelFullScreen();
    } else if (document.webkitIsFullScreen && document.webkitCancelFullScreen !== undefined) {
      document.webkitCancelFullScreen();
    } else if (document.msFullscreenEnabled && document.msExitFullscreen !== undefined) {
      document.msExitFullscreen();
    }
  }
}

export { UIUtil };