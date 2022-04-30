import { UIUtil } from '../../utils/UIUtil.js';

/**
 * The Archive class definition.
 *
 * The Archive provides browsing capabilities to one remote archive.
 *
 * @author Stefan Glaser
 */
class Archive
{
  /**
   * Archive Constructor
   *
   * @param {string} url the archive url
   * @param {string} label the archive label
   */
  constructor (url, label)
  {
    /**
     * The archive url.
     * @type {string}
     */
    this.archiveURL = url;


    /**
     * The game log selection callback.
     * @type {!Function | undefined}
     */
    this.gameLogSelectionCallback = undefined;

    /**
     * The playlist selection callback.
     * @type {!Function | undefined}
     */
    this.playlistSelectionCallback = undefined;


    /** @type {!Function} */
    this.loadFolderListener = this.loadFolder.bind(this);
    /** @type {!Function} */
    this.loadGameLogListener = this.loadGameLog.bind(this);
    /** @type {!Function} */
    this.loadPlaylistListener = this.loadPlaylist.bind(this);


    /**
     * The component root element.
     * @type {!Element}
     */
    this.domElement = this.createFolderItem(label, '/', 'archive-root');
  }

  /**
   * Create a folder item.
   *
   * @param {string} label the folder label
   * @param {string} path the folder path
   * @param {string=} className the item css class string
   * @return {!Element} the new folder item
   */
  createFolderItem (label, path, className)
  {
    let liClassName = 'folder new';
    if (className !== undefined) {
      liClassName += ' ' + className;
    }

    const newItem = UIUtil.createLI(liClassName);
    newItem.dataset.path = path;

    // Add folder label
    const titleLbl = UIUtil.createSpan(label, 'title no-text-select');
    titleLbl.tabIndex = 0;
    titleLbl.addEventListener('click', this.loadFolderListener, false);
    titleLbl.addEventListener('keydown', this.loadFolderListener, false);
    newItem.appendChild(titleLbl);

    // Check for top-level folder
    if (path === '/') {
      // Set tool tip
      titleLbl.title = this.archiveURL;

      // Create remove archive button
      const btn = UIUtil.createButton('Del', 'remove-btn', 'Remove "' + this.archiveURL + '" from list of archives.');
      btn.addEventListener('click', Archive.removeArchive, false);
      btn.addEventListener('keydown', Archive.removeArchive, false);
      titleLbl.appendChild(btn);
    }

    return newItem;
  }

  /**
   * Create a game log item.
   *
   * @param {string} label the game log label
   * @param {string} path the game log path
   * @param {string} className the additional game log item class
   * @return {!Element} the new game log item
   */
  createGameLogItem (label, path, className)
  {
    const newItem = UIUtil.createLI('game-log' + ' ' + className);
    newItem.dataset.path = path;

    // Add game log label
    const titleLbl = UIUtil.createSpan(label, 'title no-text-select');
    titleLbl.tabIndex = 0;
    titleLbl.title = label;
    titleLbl.addEventListener('click', this.loadGameLogListener, false);
    titleLbl.addEventListener('keydown', this.loadGameLogListener, false);
    newItem.appendChild(titleLbl);

    return newItem;
  }

  /**
   * Create a playlist item.
   *
   * @param {string} label the playlist label
   * @param {string} path the playlist path
   * @return {!Element} the new playlist item
   */
  createPlaylistItem (label, path)
  {
    const newItem = UIUtil.createLI('playlist');
    newItem.dataset.path = path;

    // Add game log label
    const titleLbl = UIUtil.createSpan(label, 'title no-text-select');
    titleLbl.tabIndex = 0;
    titleLbl.title = label;
    titleLbl.addEventListener('click', this.loadPlaylistListener, false);
    titleLbl.addEventListener('keydown', this.loadPlaylistListener, false);
    newItem.appendChild(titleLbl);

    return newItem;
  }

  /**
   * Action handler for loading a folder.
   *
   * @param {!Event} evt the click event
   * @return {void}
   */
  loadFolder (evt)
  {
    if (!UIUtil.isButtonAction(evt)) {
      return;
    }

    const item = evt.target.parentNode;
    const path = item.dataset.path;
    const scope = this;

    const handleLoad = function() {
      const archive = scope;
      const folderItem = item;

      return function (evt) {
        let newClass = '';

        if (evt.target.status === 200 || evt.target.status === 0) {
          // Successfully loaded
          /** @type {!Object} */
          let listing = {};

          try {
            listing = /** @type {!Object} */ (JSON.parse(evt.target.response));
          } catch(e) {
            // Parsing error
            console.log(e);
          }

          if (listing['type'] === 'archive') {
            const sublist = UIUtil.createUL('folder-listing');
            const folders = listing['folders'];
            const replays = listing['replays'];
            const sserverLogs = listing['sserverlogs'];
            const playlists = listing['playlists'];

            if (folders !== undefined) {
              for (let i = 0; i < folders.length; ++i) {
                sublist.appendChild(archive.createFolderItem(folders[i]['label'], folders[i]['path']));
              }
            }

            if (replays !== undefined) {
              for (let i = 0; i < replays.length; ++i) {
                sublist.appendChild(archive.createGameLogItem(replays[i]['label'], replays[i]['path'], 'replay'));
              }
            }

            if (sserverLogs !== undefined) {
              for (let i = 0; i < sserverLogs.length; ++i) {
                sublist.appendChild(archive.createGameLogItem(sserverLogs[i]['label'], sserverLogs[i]['path'], 'sserver-log'));
              }
            }

            if (playlists !== undefined) {
              for (let i = 0; i < playlists.length; ++i) {
                sublist.appendChild(archive.createPlaylistItem(playlists[i]['label'], playlists[i]['path']));
              }
            }

            if (sublist.children.length > 0) {
              folderItem.appendChild(sublist)
              newClass = 'expanded';

              const titleLbl = UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0];
              titleLbl.addEventListener('click', Archive.toggleExpand, false);
              titleLbl.addEventListener('keydown', Archive.toggleExpand, false);
            } else {
              newClass = 'empty';

              UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0].tabIndex = -1;
            }
          } else {
            // Invalid response
          }
        } else if (evt.target.status === 404) {
          // Archive not found
          newClass = 'not-found';

          UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0].tabIndex = -1;
        } else {
          // Error during loading
          console.log('Error ajax resonse for "' + folderItem.dataset.path + '"!');
          newClass = 'error';

          // Add load listener again
          const titleLbl = UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0];
          titleLbl.addEventListener('click', archive.loadFolderListener, false);
          titleLbl.addEventListener('keydown', archive.loadFolderListener, false);
        }

        folderItem.className = folderItem.className.replace('loading', newClass);
      };
    }();

    const handleError = function() {
      const archive = scope;
      const folderItem = item;

      return function (evt) {
        console.log('Error ajax resonse for "' + folderItem.dataset.path + '"!');
        folderItem.className = folderItem.className.replace('loading', 'error');

        // Add load listener again
        const titleLbl = UIUtil.filterElements(folderItem.childNodes, 'SPAN')[0];
        titleLbl.addEventListener('click', archive.loadFolderListener, false);
        titleLbl.addEventListener('keydown', archive.loadFolderListener, false);
      };
    }();

    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.archiveURL + '?path=' + encodeURIComponent(path), true);

    // Add event listeners
    xhr.addEventListener('load', handleLoad, false);
    xhr.addEventListener('error', handleError, false);

    // Set mime type
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('text/plain');
    }

    // Send request
    xhr.send(null);

    // Indicate loading of item
    item.className = item.className.replace('new', 'loading').replace('error', 'loading');

    // Remove load listener
    evt.target.removeEventListener('click', this.loadFolderListener, false);
    evt.target.removeEventListener('keydown', this.loadFolderListener, false);
  }

  /**
   * Action handler for loading a game log file.
   *
   * @param {!Event} evt the click event
   * @return {void}
   */
  loadGameLog (evt)
  {
    if (!UIUtil.isButtonAction(evt)) {
      return;
    }

    if (this.gameLogSelectionCallback) {
      const path = evt.target.parentNode.dataset.path;
      const idx = this.archiveURL.lastIndexOf('/');

      this.gameLogSelectionCallback(this.archiveURL.slice(0, idx + 1) + path);
    }
  }

  /**
   * Action handler for loading a playlist file.
   *
   * @param {!Event} evt the click event
   * @return {void}
   */
  loadPlaylist (evt)
  {
    if (!UIUtil.isButtonAction(evt)) {
      return;
    }

    if (this.playlistSelectionCallback) {
      const path = evt.target.parentNode.dataset.path;
      const idx = this.archiveURL.lastIndexOf('/');

      this.playlistSelectionCallback(this.archiveURL.slice(0, idx + 1) + path);
    }
  }

  /**
   * Toggle expanded state of the clicked item.
   *
   * @param {!Event} evt the click event
   * @return {void}
   */
  static toggleExpand (evt)
  {
    if (!UIUtil.isButtonAction(evt)) {
      return;
    }

    const item = evt.target.parentNode;

    if (UIUtil.toggleVisibility(item.getElementsByTagName('ul')[0])) {
      item.className = item.className.replace('expandable', 'expanded');
    } else {
      item.className = item.className.replace('expanded', 'expandable');
    }
  }

  /**
   * Toggle expanded state of the clicked item.
   *
   * @param {!Event} evt the click event
   * @return {void}
   */
  static removeArchive (evt)
  {
    if (!UIUtil.isButtonAction(evt)) {
      return;
    }

    // Remove dom node
    const item = evt.target.parentNode.parentNode;
    item.parentNode.removeChild(item);
  }
}

export { Archive };
