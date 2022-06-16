import { Panel } from './Panel.js';
import { UIUtil } from '../../utils/UIUtil.js';

class PanelGroup
{
  /**
   * PanelGroup Constructor
   */
  constructor ()
  {
    /**
     * The list of panels in this group.
     * @type {!Array<!Panel>}
     */
    this.panels = [];


    /**
     * The currently active panel.
     * @type {?Panel}
     */
    this.activePanel = null;



    // -------------------- Listeners -------------------- //
    /** @type {!Function} */
    this.visibilityListener = this.onVisibilityChanged.bind(this);
  }

  /**
   * Add the given panel to the group.
   *
   * @param  {!Panel} panel the panel to add
   */
  add (panel)
  {
    // Check if panel is already in the list of panels
    if (this.panels.indexOf(panel) !== -1) {
      return;
    }

    // Hide new panel
    UIUtil.setVisibility(panel.domElement, false);

    // Add new panel to group list
    this.panels.push(panel);

    // Add visibility change listener
    panel.onVisibilityChanged = this.visibilityListener;
  };



  /**
   * Check if this group has an active (visible) panel.
   *
   * @return {boolean} true if an panel in this group is active (visible), false otherwise
   */
  hasActivePanel ()
  {
    return this.activePanel !== null;
  };



  /**
   * Hide all (the currently active) panel.
   */
  hideAll ()
  {
    if (this.activePanel !== null) {
      UIUtil.setVisibility(this.activePanel.domElement, false);
      this.activePanel = null;
    }
  };



  /**
   * Panel visibility change listener.
   *
   * @param  {!Panel} panel the panel which visibility changed
   */
  onVisibilityChanged (panel)
  {
    if (panel.isVisible()) {
      for (let i = 0; i < this.panels.length; i++) {
        if (this.panels[i] !== panel) {
          UIUtil.setVisibility(this.panels[i].domElement, false);
        }
      }

      this.activePanel = panel;
    } else if (this.activePanel === panel) {
      this.activePanel = null;
    }
  }
}

export { PanelGroup };
