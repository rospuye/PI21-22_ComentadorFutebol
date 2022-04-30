import { SingleChoiceItem } from './SingleChoiceItem.js';

class ToggleItem extends SingleChoiceItem
{
  /**
   * ToggleItem Constructor
   *
   * @param {string} name the name to display
   * @param {string} on the label title on the on choice
   * @param {string} off the label title on the off choice
   * @param {boolean=} state the initial state of the item (true: on, false: off (default))
   * @param {string=} itemClass the css class string
   */
  constructor (name, on, off, state, itemClass)
  {
    super(name, [on, off], state ? 0 : 1, 'toggle-item' + (itemClass === undefined ? '' : ' ' + itemClass));


    // Add item onclick listener
    this.domElement.onclick = this.toggle.bind(this);
  }

  /**
   * @override
   */
  onFormChangeListener ()
  {
    if (this.onChanged) {
      this.onChanged(this.form.elements['userOptions'][0].checked == true);
    }
  }

  /**
   * Toggle the state of this item.
   *
   * @return {void}
   */
  toggle ()
  {
    const wasOn = this.form.elements['userOptions'][0].checked == true;
    if (wasOn) {
      this.form.elements['userOptions'][1].checked = true;
    } else {
      this.form.elements['userOptions'][0].checked = true;
    }

    if (this.onChanged) {
      this.onChanged(!wasOn);
    }
  }

  /**
   * Toggle the state of this item.
   *
   * @param {boolean} on true if the toggle item is on, false if off
   * @return {void}
   */
  setState (on)
  {
    if (on) {
      this.form.elements['userOptions'][0].checked = true;
    } else {
      this.form.elements['userOptions'][1].checked = true;
    }
  }
}

export { ToggleItem };
