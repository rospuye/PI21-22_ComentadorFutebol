import { Panel } from '../components/Panel.js';
import { UIUtil } from '../../utils/UIUtil.js';
import { Archive } from './Archive.js';
import { LogPlayer } from '../../model/logplayer/LogPlayer.js';


/**
 * The ArchiveExplorer class definition.
 *
 * The ArchiveExplorer provides browsing capabilities to multiple remote archives.
 *
 * @author Stefan Glaser
 */
class ArchiveExplorer extends Panel
{
  /**
   * ArchiveExplorer Constructor
   *
   * @param {!LogPlayer} logPlayer the log player model
   */
  constructor (logPlayer)
  {
    super('jsm-archive-explorer');

    /**
     * The log player model instance.
     * @type {!LogPlayer}
     */
    this.logPlayer = logPlayer;


    /**
     * The archive list.
     * @type {!Element}
     */
    this.archiveList = UIUtil.createUL('archive-list');
    this.domElement.appendChild(this.archiveList);


    /**
     * The add archive list item.
     * @type {!Element}
     */
    this.addArchiveItem = UIUtil.createLI('add-archive expandable');
    this.archiveList.appendChild(this.addArchiveItem);

    let label = UIUtil.createSpan('Add new Archive',  'no-text-select');
    label.addEventListener('click', ArchiveExplorer.toggleExpand, false);
    this.addArchiveItem.appendChild(label);


    /**
     * The add archive list item.
     * @type {!Element}
     */
    this.addArchiveBox = UIUtil.createDiv('add-box');
    UIUtil.setVisibility(this.addArchiveBox, false);
    this.addArchiveItem.appendChild(this.addArchiveBox);


    /**
     * The new archive location input field.
     * @type {!Element}
     */
    this.archiveLocationInput = UIUtil.createElement('input');
    this.archiveLocationInput.name = 'location';
    this.archiveLocationInput.type = 'url';
    this.archiveLocationInput.value = 'https://';

    label = UIUtil.createElement('label');
    label.appendChild(UIUtil.createSpan('URL:'));
    label.appendChild(this.archiveLocationInput);
    this.addArchiveBox.appendChild(label);


    /**
     * The new archive name input field.
     * @type {!Element}
     */
    this.archiveNameInput = UIUtil.createElement('input');
    this.archiveNameInput.name = 'name';
    this.archiveNameInput.type = 'text';

    label = UIUtil.createElement('label');
    label.appendChild(UIUtil.createSpan('Name:'));
    label.appendChild(this.archiveNameInput);
    this.addArchiveBox.appendChild(label);

    /** @type {!Function} */
    this.onAddNewLocationListener = this.onAddNewLocation.bind(this);


    /**
     * The add new archive button.
     * @type {!Element}
     */
    this.addArchiveBtn = UIUtil.createButton('Add', 'add-archive', 'Add new archive location to list of archives', this.onAddNewLocationListener);
    this.addArchiveBox.appendChild(this.addArchiveBtn);


    /** @type {!Function} */
    this.handleGameLogSelectedListener = this.handleGameLogSelected.bind(this);
    /** @type {!Function} */
    this.handlePlaylistSelectedListener = this.handlePlaylistSelected.bind(this);
  }

  /**
   * Add location action listener.
   *
   * @param {!Event} evt the button event
   * @return {void}
   */
  onAddNewLocation (evt)
  {
    const url = this.archiveLocationInput.value;
    let label = this.archiveNameInput.value;

    if (!url || url === 'https://' || url === 'http://') {
      return;
    }

    if (!label) {
      label = url;
    }

    // Add location
    this.addLocation(url, label);

    // Reset input elements
    this.archiveLocationInput.value = 'https://';
    this.archiveNameInput.value = '';

    // Hide input elements
    UIUtil.setVisibility(this.addArchiveBox, false);
    this.addArchiveItem.className = this.addArchiveItem.className.replace(' expanded', '');
  }

  /**
   * Add new location to list of archives.
   *
   * @param {string} url the url to the new archive location
   * @param {string} label the label text to display
   * @return {void}
   */
  addLocation (url, label)
  {
    const newArchive = new Archive(url, label);
    newArchive.gameLogSelectionCallback = this.handleGameLogSelectedListener;
    newArchive.playlistSelectionCallback = this.handlePlaylistSelectedListener;
    this.archiveList.appendChild(newArchive.domElement);
  }

  /**
   * Handle selection of a game log within one of the archives.
   *
   * @param {string} logURL the selected game log url
   * @return {void}
   */
  handleGameLogSelected (logURL)
  {
    this.logPlayer.loadGameLog(logURL);
  }

  /**
   * Handle selection of a playlist within one of the archives.
   *
   * @param {string} listURL the selected playlist url
   * @return {void}
   */
  handlePlaylistSelected (listURL)
  {
    this.logPlayer.loadPlaylist(listURL);
  }

  /**
   * Toggle expanded state of the clicked item.
   *
   * @param {!Event} evt the click event
   * @return {void}
   */
  static toggleExpand (evt)
  {
    const item = evt.target.parentNode;

    if (UIUtil.toggleVisibility(item.getElementsByTagName('div')[0])) {
      item.className = item.className.replace('expandable', 'expanded');
    } else {
      item.className = item.className.replace('expanded', 'expandable');
    }
  }
}

export { ArchiveExplorer };
