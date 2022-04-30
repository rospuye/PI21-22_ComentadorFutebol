/**
 * The DnDHandler class definition.
 *
 * @author Stefan Glaser
 */
class DnDHandler
{
  /**
   * DnDHandler Constructor
   */
  constructor ()
  {
    /**
     * The callback for publishing dropped files.
     * @type {!Function | undefined}
     */
    this.onNewFilesDropped = undefined;


    // -------------------- Listeners -------------------- //
    /** @type {!Function} */
    this.handleDragEnterListener = this.handleDragEnter.bind(this);
    /** @type {!Function} */
    this.handleDragEndListener = this.handleDragEnd.bind(this);
    /** @type {!Function} */
    this.handleDragOverListener = this.handleDragOver.bind(this);
    /** @type {!Function} */
    this.handleDropListener = this.handleDrop.bind(this);
  }

  /**
   * Add Drag and Drop event listeners to the given element.
   *
   * @param {!Element} element the element to observe for dnd-events
   */
  addListeners (element)
  {
    element.addEventListener('dragenter', this.handleDragEnterListener, false);
    element.addEventListener('dragover', this.handleDragOverListener, false);
    element.addEventListener('dragleave', this.handleDragEndListener, false);
    element.addEventListener('dragend', this.handleDragEndListener, false);
    element.addEventListener('drop', this.handleDropListener, false);
  }

  /**
   * Remove Drag and Drop event listeners from the given element.
   *
   * @param {!Element} element the element to unobserve
   */
  removeListeners (element)
  {
    element.removeEventListener('dragenter', this.handleDragEnterListener, false);
    element.removeEventListener('dragover', this.handleDragOverListener, false);
    element.removeEventListener('dragleave', this.handleDragEndListener, false);
    element.removeEventListener('dragend', this.handleDragEndListener, false);
    element.removeEventListener('drop', this.handleDropListener, false);
  }

  /**
   * Reset a target element.
   *
   * @param {?EventTarget | ?Element} target the target element to reset
   */
  resetTarget (target)
  {
    if (target !== null) {
      target.className = target.className.replace('dragging-over', '');
    }
  }

  /**
   * Handle a file drop event.
   *
   * @param {!Event} evt the drop event
   */
  handleDrop (evt)
  {
    evt.stopPropagation();
    evt.preventDefault();

    // rest target
    this.resetTarget(evt.target);

    if (this.onNewFilesDropped && evt.dataTransfer.files.length > 0) {
      this.onNewFilesDropped(evt.dataTransfer.files);
    }
  }

  /**
   * Handle dragging enter.
   *
   * @param {!Event} evt the drag over event
   */
  handleDragEnter (evt)
  {
    // console.log('Drag Enter');
    // console.log(evt.dataTransfer);

    const dtItem = evt.dataTransfer.items[0];

    if (dtItem && dtItem.kind === 'file') {
      evt.target.className += ' dragging-over';
    }
  }

  /**
   * Handle dragging end/exit.
   *
   * @param {!Event} evt the drag event
   */
  handleDragEnd (evt)
  {
    // console.log('Drag End');
    // console.log(evt.dataTransfer);

    // rest target
    this.resetTarget(evt.target);
  }

  /**
   * Handle dragging over.
   *
   * @param {!Event} evt the drag over event
   */
  handleDragOver (evt)
  {
    // console.log('Drag over');
    // console.log(evt.dataTransfer);

    const dtItem = evt.dataTransfer.items[0];

    if (dtItem && dtItem.kind === 'file') {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    }
  }
}

export { DnDHandler };
