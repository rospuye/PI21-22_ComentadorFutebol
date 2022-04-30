/**
 * The SymbolNode class definition.
 *
 * The SymbolNode represents a symbolic node in a symbol tree, holding values and child nodes.
 *
 * @author Stefan Glaser
 */
class SymbolNode
{
  /**
   * SymbolNode Constructor - create a new SymbolNode.
   */
  constructor ()
  {
    /**
     * The symbol node values.
     * @type {!Array<string>}
     */
    this.values = [];

    /**
     * The symbol node children.
     * @type {!Array<!SymbolNode>}
     */
    this.children = [];
  }
}

export { SymbolNode };
