import { EventDispatcher } from '../../utils/EventDispatcher.js';
import { GameLogInfo } from '../../utils/GameLogInfo.js';


/**
 * @enum {string}
 */
export const PlaylistEvents = {
  CHANGE: 'change',
  UPDATE: 'update',
  ACTIVE_CHANGE: 'active-change',
  AUTOPLAY_CHANGE: 'autoplay-change'
};

/**
 * The GameLogEntry class definition.
 *
 * @author Stefan Glaser
 */
class GameLogEntry
{
  /**
   * GameLogEntry Constructor
   *
   * @param {string} title the entry title
   * @param {string | !File} resource the game log resource url or file
   */
  constructor (title, resource)
  {
    /**
     * The playlist entry title.
     * @type {string}
     */
    this.title = title;

    /**
     * The playlist entry resource.
     * @type {(string | !File)}
     */
    this.resource = resource;

    /**
     * The error message for this entry (null -> no error).
     * @type {?string}
     */
    this.errorMsg = null;

    /**
     * The game log info instance to this entry.
     * @type {?GameLogInfo}
     */
    this.info = null;

    // Try to extract the game log info from the resource name
    if (resource instanceof File) {
      this.info = GameLogInfo.fromFileName(resource.name);
    } else {
      this.info = GameLogInfo.fromURL(resource);
    }
  }
}

export { GameLogEntry };


/**
 * The Playlist class definition.
 *
 * The Playlist is the central class representing the player logic, canvas handling, etc.
 *
 * @author Stefan Glaser
 */
class Playlist extends EventDispatcher
{
  /**
   * Playlist Constructor
   *
   * ::implements {IPublisher}
   * ::implements {IEventDispatcher}
   * @param {string} title the title of the playlist
   */
  constructor (title)
  {
    super();

    /**
     * The playlist title.
     * @type {string}
     */
    this.title = title;

    /**
     * The playlist entries.
     * @type {!Array<!GameLogEntry>}
     */
    this.entries = [];

    /**
     * The index of the active playlist entry.
     * @type {number}
     */
    this.activeIndex = -1;

    /**
     * Indicator if this list is in autoplay mode.
     * @type {boolean}
     */
    this.autoplay = false;
  }

  /**
   * Set the autoplay property of this playlist.
   *
   * @param {boolean=} autoplay true or undefined to enable autoplay, false to disable
   * @return {void}
   */
  setAutoplay (autoplay)
  {
    const newValue = autoplay === undefined ? true : autoplay;

    if (this.autoplay !== newValue) {
      this.autoplay = newValue;

      // Publish autoplay change event
      this.dispatchEvent({
        type: PlaylistEvents.AUTOPLAY_CHANGE
      });
    }
  }

  /**
   * Retrieve the active entry.
   *
   * @return {?GameLogEntry} the active entry, or null if currently no entry is active
   */
  getActiveEntry ()
  {
    return this.activeIndex < 0 ? null : this.entries[this.activeIndex];
  }

  /**
   * Add a new entry to this playlist.
   *
   * @param {string} title the title of the new entry
   * @param {(string | !File)} resource the game log resource url or file
   * @return {boolean} true, if a new entry was created, false otherwise
   */
  addEntry (title, resource)
  {
    // Check if entry for the given resource already exists
    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i].resource === resource) {
        return false;
      }
    }

    // TODO: Think about enforcing a hard upper limit of allowed entries, as we do not have any influence on the loaded playlist definition

    // Add new resource entry
    this.entries.push(new GameLogEntry(title, resource));


    // Publish change event
    this.dispatchEvent({
      type: PlaylistEvents.CHANGE,
      index: this.entries.length - 1
    });

    return true;
  }

  /**
   * Add the given list of game log files as entries to this playlist.
   *
   * @param {!Array<!File>} files a list of files to add
   */
  addFiles (files)
  {
    for (let i = 0; i < files.length; i++) {
      this.addEntry(files[i].name, files[i]);
    }
  }

  /**
   * Mark the entry at the given index as invalid.
   * Invalid entries can occur during processing of the entry resource.
   *
   * @param {string} msg the error message
   */
  markAsInvalid (msg)
  {
    if (this.activeIndex < 0) {
      return;
    }

    const entry = this.entries[this.activeIndex];

    if (entry !== undefined && entry.errorMsg === null) {
      entry.errorMsg = msg;

      // Publish update event
      this.dispatchEvent({
        type: PlaylistEvents.UPDATE,
        entry: entry,
        index: this.activeIndex
      });
    }
  }



  // ============================== PLAYLIST CONTROL FUNCTIONS ==============================
  /**
   * Try to select the next element in the playlist.
   *
   * @param {number} idx the index to select
   * @param {boolean=} ascending the direction to proceed if the specified index is invalid
   * @return {void}
   */
  setActiveIndex (idx, ascending)
  {
    // Check is the new index is actually new and within the range of the entries list
    if (this.activeIndex === idx || idx < 0 || idx >= this.entries.length) {
      return;
    }

    // Set default direction if not specified
    if (ascending === undefined) {
      ascending = true;
    }

    // Check if entry is valid
    if (this.entries[idx].errorMsg === null) {
      this.activeIndex = idx;

      // Publish active change event
      this.dispatchEvent({
        type: PlaylistEvents.ACTIVE_CHANGE
      });
    } else {
      // Try forward to the previous/next entry...
      this.setActiveIndex(idx + (ascending ? 1 : -1));
    }
  }

  /**
   * Try to select the next element in the playlist.
   *
   * @return {void}
   */
  nextEntry ()
  {
    this.setActiveIndex(this.activeIndex + 1, true);
  }

  /**
   * Try to select the previous element in the playlist.
   *
   * @return {void}
   */
  previousEntry ()
  {
    this.setActiveIndex(this.activeIndex - 1, false);
  }



  // ============================== STATIC PARSING FUNCTION ==============================
  /**
   * Create a new playlist based on a playlist JSON string.
   *
   * @param {string} jsonString the source json string
   * @return {?Playlist} the new playlist
   */
  static fromJSONString (jsonString)
  {
    let list = null;

    try {
      const source = JSON.parse(jsonString);

      if (source['type'] === 'playlist') {
        list = new Playlist(source['title'] !== undefined ? source['title'] : 'My Playlist');
        const logs = source['gamelogs'];

        for (let i = 0; i < logs.length; i++) {
          if (logs[i]['title'] && logs[i]['url']) {
            list.addEntry(logs[i]['title'], logs[i]['url']);
          } else {
            console.log('Invalid playlist entry format.');
          }
        }
      } else {
        console.log('Invalid playlist format.');
      }
    } catch (ex) {
      console.log('ERROR: Parsing playlist json failed!');
    }

    return list;
  }
}

export { Playlist };
