/**
 * The ParserException class definition.
 *
 * @author Stefan Glaser
 */
class ParserException
{
  /**
   * ParserException Constructor
   *
   * @param {string=} msg the exception message
   */
  constructor (msg)
  {
    /**
     * The name of the exception.
     * @type {string}
     */
    this.name = 'ParserException';

    /**
     * The exception message.
     * @type {string}
     */
    this.message = msg !== undefined ? msg : this.name;
  }

  /**
   * @override
   * @return {string}
   */
  toString ()
  {
    return this.message;
  }
}

export { ParserException };
