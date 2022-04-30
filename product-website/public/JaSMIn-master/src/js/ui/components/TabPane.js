import { UIUtil } from '../../utils/UIUtil.js';
import { Panel } from './Panel.js';
import { PanelGroup } from './PanelGroup.js';

/**
 *
 * @author Stefan Glaser
 */
class Tab
{
  /**
   * Tab Constructor
   *
   * @param {!Panel} head the tab header panel
   * @param {!Panel} content the tab content panel
   */
  constructor (head, content)
  {
    /**
     * The tab header panel.
     * @type {!Panel}
     */
    this.head = head;

    /**
     * The tab content panel.
     * @type {!Panel}
     */
    this.content = content;
  }
}

export { Tab };



/**
 * The TabPane class definition.
 *
 * The TabPane abstracts
 *
 * @author Stefan Glaser
 */
class TabPane extends Panel
{
  /**
   * TabPane Constructor
   *
   * @param {string=} className the css class string
   */
  constructor (className)
  {
    super('jsm-tab-pane' + (className === undefined ? '' : ' ' + className));

    // Create header row
    let row = UIUtil.createDiv('t-row');
    this.domElement.appendChild(row);

    const cell = UIUtil.createDiv('tab-header');
    row.appendChild(cell);


    /**
     * The tab header container.
     * @type {!Element}
     */
    this.tabHeaderList = UIUtil.createUL();
    cell.appendChild(this.tabHeaderList);

    // Create content row
    row = UIUtil.createDiv('t-row');
    this.domElement.appendChild(row);

    /**
     * The tab header container.
     * @type {!Element}
     */
    this.tabContent = UIUtil.createDiv('tab-content');
    row.appendChild(this.tabContent);

    /**
     * The tabs of this tab pane.
     * @type {!Array<!Tab>}
     */
    this.tabs = [];

    /**
     * The tab group, managing visibility of content panels.
     * @type {!PanelGroup}
     */
    this.tabGroup = new PanelGroup();
  }

  /**
   * Add the given tab to the tab-pane.
   *
   * @param  {!Tab} tab the new tab to add
   */
  add (tab)
  {
    // Store new tab
    this.tabs.push(tab);

    // Add content to tab panel group
    this.tabGroup.add(tab.content);

    // Add new tab to containers
    const li = UIUtil.createLI();
    li.onclick = function (evt) {
      tab.content.setVisible();

      // Deactivate all header items
      const tabHeaders = li.parentNode.childNodes;
      for (let i = 0; i < tabHeaders.length; ++i) {
        if (tabHeaders[i].nodeName === 'LI') {
          tabHeaders[i].className = tabHeaders[i].className.replace('active', '');
        }
      }

      // Reactivate selected item
      li.className += ' active';
    }

    li.appendChild(tab.head.domElement);
    this.tabHeaderList.appendChild(li);
    this.tabContent.appendChild(tab.content.domElement);

    // Activate first tab
    if (this.tabs.length === 1) {
      // By default show first tab
      tab.content.setVisible();
      li.className = 'active';
    }
  }

  /**
   * Add the given panels as tab to the tab-pane.
   *
   * @param  {!Panel} head the tab header panel
   * @param  {!Panel} content the tab content panel
   * @return {!Tab} the newly created and added tab
   */
  addPanels (head, content)
  {
    const newTab = new Tab(head, content);

    this.add(newTab);

    return newTab;
  }

  /**
   * Wrap the given elements in panels and add them as tab to the tab-pane.
   *
   * @param  {!Element} head the tab header element
   * @param  {!Element} content the tab content element
   * @return {!Tab} the newly created and added tab
   */
  addElements (head, content)
  {
    const headPanel = new Panel();
    headPanel.appendChild(head);

    const contentPanel = new Panel();
    contentPanel.appendChild(content);

    return this.addPanels(headPanel, contentPanel);
  }
}

export { TabPane };
