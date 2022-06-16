/**
 * The DataIterator class definition.
 *
 * @author Stefan Glaser
 */
class DataIterator
{
  /**
   * DataIterator Constructor
   * Create a new data interator.
   *
   * @param {string} data the data string
   * @param {!DataExtent} extent the data extent
   */
  constructor (data, extent)
  {
    /**
     * The data to iterate.
     * @type {string}
     */
    this.data = data;

    /**
     * The regular expression used to split the data into line tokens.
     * @type {!RegExp}
     */
    this.regExp = new RegExp('[^\r\n]+', 'g');

    /**
     * The current data line.
     * @type {?string}
     */
    this.line = null;

    /**
     * The data extent (complete, partial, incremental).
     * @type {!DataExtent}
     */
    this.extent = extent;


    // Update initial data
    this.update(data, extent);

    // console.log('New data iterator instance created!');
  }

  /**
   * @return {void}
   */
  dispose ()
  {
    // console.log('Dispose data iterator instance!');

    // Clear RegExp instance and buffers
    // I feel kind of strange to add this code, but apparently it readuces memory usage
    this.regExp.lastIndex = 0;
    let i = 10;
    while (--i) {
      this.regExp.exec('TRY\nTO\nEMPTY\nCACHE\n!!!');
    }

    this.data = '';
    this.regExp.lastIndex = 0;
    this.line = null;
    this.extent = DataExtent.COMPLETE;
  }

  /**
   * Update the iterator data.
   *
   * @param {string} data updated data
   * @param {!DataExtent} extent the data extent
   * @return {boolean} true, if iterator reached end of data before update, false otherwise
   */
  update (data, extent)
  {
    switch (this.extent) {
      case DataExtent.INCREMENTAL:
        this.data = this.data.slice(this.regExp.lastIndex) + data;
        this.regExp.lastIndex = 0;
        break;
      case DataExtent.PARTIAL:
      case DataExtent.COMPLETE:
      default:
        this.data = data;
        break;
    }

    this.extent = extent;

    return this.line === null;
  }

  /**
   * Check if the exists a next line.
   *
   * @return {boolean}
   */
  hasNext ()
  {
    const idx = this.regExp.lastIndex;
    let result = this.regExp.test(this.data);

    if (this.extent !== DataExtent.COMPLETE && this.regExp.lastIndex === this.data.length) {
      result = false;
    }

    // Reset running index in regular expression
    this.regExp.lastIndex = idx;

    return result;
  }

  /**
   * Progress the iterator to the next position (if possible)
   * and return the line array at the new position.
   *
   * @return {?string} the current line array
   */
  next ()
  {
    const idx = this.regExp.lastIndex;
    let tokens = this.regExp.exec(this.data);

    if (this.extent !== DataExtent.COMPLETE && this.regExp.lastIndex === this.data.length) {
      // Reached end of partial data, but no terminating line ending found, thus reset tokens
      tokens = null;
    }

    // Reached end of data, thus reset regex index
    if (tokens === null || tokens.length === 0) {
      this.regExp.lastIndex = idx;
      this.line = null;
    } else {
      this.line = tokens[0];
    }

    return this.line;
  }
}

export { DataIterator };

/**
 * An enum for possible data extents.
 * @enum {number}
 */
export const DataExtent = {
  COMPLETE: 0,
  PARTIAL: 1,
  INCREMENTAL: 2
};
