import { EventDispatcher } from '../../utils/EventDispatcher.js';
import { Playlist } from './Playlist.js';


/**
 * @enum {string}
 */
export const PlaylistLoaderEvents = {
  START: 'start',
  PROGRESS: 'progress',
  FINISHED: 'finished',
  ERROR: 'error'
};

/**
 * The PlaylistLoader class definition.
 *
 * The PlaylistLoader provides
 *
 * @author Stefan Glaser / http://chaosscripting.net
 */
class PlaylistLoader extends EventDispatcher
{
  /**
   * [PlaylistLoader description]
   *
   * ::implements {IPublisher}
   * ::implements {IEventDispatcher}
   */
  constructor ()
  {
    super();

    /**
     * The XMLHttpRequest object used to load remote playlists.
     * @type {?XMLHttpRequest}
     */
    this.xhr = null;

    /**
     * The FileReader object used to load the local playlist files.
     * @type {?FileReader}
     */
    this.fileReader = null;



    /** @type {!Function} */
    this.xhrOnLoadListener = this.xhrOnLoad.bind(this);
    /** @type {!Function} */
    this.xhrOnProgressListener = this.xhrOnProgress.bind(this);
    /** @type {!Function} */
    this.xhrOnErrorListener = this.xhrOnError.bind(this);

    /** @type {!Function} */
    this.fileReaderOnLoadEndListener = this.fileReaderOnLoadEnd.bind(this);
  }

  /**
   * Load a game log from the specified url.
   *
   * @param  {string} url the URL to the game log file
   * @return {void}
   */
  load (url)
  {
    // Clear loader instance
    this.clear();

    // Publish start event
    this.dispatchEvent({
      type: PlaylistLoaderEvents.START,
      url: url
    });

    // Create Request
    this.xhr = new XMLHttpRequest();
    this.xhr.open('GET', url, true);

    // Add event listeners
    this.xhr.addEventListener('load', this.xhrOnLoadListener, false);
    this.xhr.addEventListener('progress', this.xhrOnProgressListener, false);
    this.xhr.addEventListener('error', this.xhrOnErrorListener, false);

    // Set mime type
    if (this.xhr.overrideMimeType) {
      this.xhr.overrideMimeType('text/plain');
    }

    // Send request
    this.xhr.send(null);
  }

  /**
   * Load a game log file from the local file system.
   *
   * @param  {!File} file the file to load
   * @return {void}
   */
  loadFile (file)
  {
    // Clear loader instance
    this.clear();

    if (this.fileReader === null) {
      this.fileReader = new FileReader();
      this.fileReader.addEventListener('loadend', this.fileReaderOnLoadEndListener, false);
    }

    // Publish start event
    this.dispatchEvent({
      type: PlaylistLoaderEvents.START,
      url: file.name
    });

    // Read file
    // this.fileReader.readAsBinaryString(file);
    this.fileReader.readAsText(file);
  }

  /**
   * Clear the loader instance.
   *
   * @return {void}
   */
  clear ()
  {
    if (this.xhr !== null) {
      // Remove event listeners
      this.xhr.removeEventListener('load', this.xhrOnLoadListener);
      this.xhr.removeEventListener('progress', this.xhrOnProgressListener);
      this.xhr.removeEventListener('error', this.xhrOnErrorListener);

      // Abort active request
      this.xhr.abort();
      this.xhr = null;
    }
  }

  /**
   * The XHR onLoad callback.
   *
   * @param  {!Event} event the xhr event
   * @return {void}
   */
  xhrOnLoad (event)
  {
    if (event.target.status === 200 || event.target.status === 0) {

      // Parse response
      this.createPlaylist(event.target.response);
    } else {
      // Error during loading
      this.dispatchEvent({
          type: PlaylistLoaderEvents.ERROR,
          msg: this.getXHRErrorMessage()
        });
    }
  }

  /**
   * The FileReader onLoadEnd callback.
   *
   * @param  {!Event} event the FileReader event
   * @return {void}
   */
  fileReaderOnLoadEnd (event)
  {
    if (event.target.readyState == FileReader.DONE) { // DONE == 2
      // Parse file content
      this.createPlaylist(event.target.result);
    } else {
      // Clear loader instance
      this.clear();

      // Error during loading
      this.dispatchEvent({
          type: PlaylistLoaderEvents.ERROR,
          msg: 'ERROR: Loading file failed!'
        });
    }
  }

  /**
   * The XHR onProgress callback.
   *
   * @param  {!Event} event the xhr event
   * @return {void}
   */
  xhrOnProgress (event)
  {
    // Dispatch progress event
    this.dispatchEvent({
        type: PlaylistLoaderEvents.PROGRESS,
        total: event.total,
        loaded: event.loaded
      });
  }

  /**
   * The XHR onError callback.
   *
   * @param  {!Event} event the xhr event
   * @return {void}
   */
  xhrOnError (event)
  {
    // Dispatch errer event
    this.dispatchEvent({
        type: PlaylistLoaderEvents.ERROR,
        msg: this.getXHRErrorMessage()
      });
  }

  /**
   * Create a playlist instance from the given data.
   *
   * @param  {string} data the current data
   * @return {void}
   */
  createPlaylist (data)
  {
    const playlist = Playlist.fromJSONString(data);

    // Clear loader instance
    this.clear();

    if (playlist !== null) {
      this.dispatchEvent({
          type: PlaylistLoaderEvents.FINISHED,
          list: playlist
        });
    } else {
      this.dispatchEvent({
          type: PlaylistLoaderEvents.ERROR,
          msg: 'ERROR while parsing Playlist data!'
        });
    }
  }

  /**
   * Retrieve the error message of the active XHR object, or create some default message if there is no error message available.
   *
   * @return {string} the error/status message
   */
  getXHRErrorMessage ()
  {
    let message = 'No active XMLHttpRequest to check for an error!';

    if (this.xhr !== null) {
      message = this.xhr.statusText;

      if (!message || message === '') {
        message = 'Unknown reason!';
      }
    }

    // Clear loader instance
    this.clear();

    return message;
  }
}

export { PlaylistLoader };
