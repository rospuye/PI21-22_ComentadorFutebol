import { UIUtil } from '../../utils/UIUtil.js';

class SingleChoiceItem
{
  /**
   * SingleChoiceItem Constructor
   *
   * @param {string} name the name to display
   * @param {!Array<string>} options the options to display
   * @param {number=} preSelected the index of the preselected entry
   * @param {string=} itemClass the css class string
   */
  constructor (name, options, preSelected, itemClass)
  {
    /**
     * The form element.
     * @type {!Element}
     */
    this.domElement = UIUtil.createLI(itemClass);

    // Add a label
    this.domElement.appendChild(UIUtil.createSpan(name));

    // Add a spacer
    this.domElement.appendChild(UIUtil.createDiv('spcaer'));

    /**
     * The single choice form element.
     * @type {!Element}
     */
    this.form = UIUtil.createSingleChoiceForm(options, preSelected);
    this.domElement.appendChild(this.form);


    // Add form change listener
    this.form.onchange = this.onFormChangeListener.bind(this);


    /**
     * The callback funtion when the selection of this item changed.
     * @type {!Function | undefined}
     */
    this.onChanged = undefined;
  }

  /**
   * Change listener callback function for single choice form element.
   *
   * @return {void}
   */
  onFormChangeListener ()
  {
    const options = this.form.elements['userOptions'];
    let i = options.length;

    while (i--) {
      if (options[i].checked) {
        if (this.onChanged) {
          this.onChanged(i, options[i].value);
        }
        return;
      }
    }

    if (this.onChanged) {
      this.onChanged();
    }
  }

  /**
   * Select the option with the given index.
   *
   * @param  {number} idx the index to select
   * @return {void}
   */
  selectIndex (idx)
  {
    const option = this.form.elements['userOptions'][idx];

    if (option !== undefined) {
      option.checked = true;
    }
  }

  /**
   * Select the option with the given value.
   *
   * @param  {string} value the value of the checkbox to select
   * @return {void}
   */
  selectOption (value)
  {
    const options = this.form.elements['userOptions'];
    let i = options.length;

    while (i--) {
      if (options[i].value == value) {
        if (options[i].checked != true) {
          options[i].checked = true;
        }
        return;
      }
    }
  }
}

export { SingleChoiceItem };
