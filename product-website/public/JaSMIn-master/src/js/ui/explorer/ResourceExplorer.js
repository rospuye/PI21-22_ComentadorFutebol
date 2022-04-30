import { TabPane } from '../components/TabPane.js';
import { Panel } from '../components/Panel.js';
import { UIUtil } from '../../utils/UIUtil.js';
import { ArchiveExplorer } from './ArchiveExplorer.js';
import { MonitorModel } from '../../model/MonitorModel.js';

/**
 * The ResourceExplorer class definition.
 *
 * The ResourceExplorer provides browsing capabilities to various sources.
 *
 * @author Stefan Glaser
 */
class ResourceExplorer extends TabPane
{
  /**
   * ResourceExplorer Constructor
   *
   * @param {!MonitorModel} model the monitor model instance
   */
  constructor (model)
  {
    super('jsm-explorer');

    /**
     * The monitor model instance.
     * @type {!MonitorModel}
     */
    this.model = model;

    /**
     * The archive explorer instance.
     * @type {!ArchiveExplorer}
     */
    this.archiveExplorer = new ArchiveExplorer(this.model.logPlayer);
    /*this.archiveExplorer.onGameLogSelected = function () {
      const mm = model;

      return function (url) {
        mm.loadGameLog(url);
      }
    }();*/
    // this.archiveExplorer.addLocation('http://archive.robocup.info/app/JaSMIn/archive.php', 'archive.robocup.info');
    // this.archiveExplorer.addLocation('http://localhost:8080/build/archive.php');
    // this.archiveExplorer.addLocation('archive.php', 'Archive');


    // Create Archive tab
    const headerPanel = new Panel();
    let label = UIUtil.createSpan('Archives');
    label.title = 'Browse Replay Archives';
    headerPanel.appendChild(label);

    this.addPanels(headerPanel, this.archiveExplorer);

    // Create Simulators tab
    // this.addElements(UIUtil.createSpan('Simulators'), UIUtil.createSpan('Simulator Browser'));

    // Create Streams tab
    // this.addElements(UIUtil.createSpan('Streams'), UIUtil.createSpan('Stream Browser'));


    /**
     * The file chooser input line, for selecting local files.
     * @type {!Element}
     */
    this.fileInput = UIUtil.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = '.rpl3d, .rpl2d, .replay, .rcg, .json';
    this.fileInput.multiple = true;
    this.fileInput.onchange = function () {
      const mm = model;

      return function (evt) {
        const files = evt.target.files;

        if (files && files.length > 0) {
          mm.loadFiles(files);
        }
      };
    }();

    /**
     * The binded listener method for showing the file chooser dialog.
     * @type {!Function}
     */
    this.showFileChooserListener = this.showFileChooser.bind(this);


    /**
     * The open local resource button.
     * @type {!Element}
     */
    this.openResourceItem = UIUtil.createLI('open-resource');
    this.openResourceItem.onclick = this.showFileChooserListener;
    label = UIUtil.createSpan('Open');
    label.title = 'Open local resource...';
    this.openResourceItem.appendChild(label);
    this.openResourceItem.appendChild(this.fileInput);
    this.tabHeaderList.appendChild(this.openResourceItem);
  }

  /**
   * Show file chooser.
   *
   * @return {void}
   */
  showFileChooser ()
  {
    this.fileInput.click();
  }
}

export { ResourceExplorer };
