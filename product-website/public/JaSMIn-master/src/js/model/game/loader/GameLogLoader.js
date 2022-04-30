import { EventDispatcher } from '../../../utils/EventDispatcher.js';
import { GameLog } from '../GameLog.js';
import { GameLogParser } from '../parser/GameLogParser.js';
import { ReplayParser } from '../replay/ReplayParser.js';
import { ULGParser } from '../sserver/ULGParser.js';
import { FileUtil } from '../../../utils/FileUtil.js';
import { DataExtent } from '../../../utils/DataIterator.js';


/**
 * @enum {string}
 */
export const GameLogLoaderEvents = {
  START: 'start',
  NEW_GAME_LOG: 'new-game-log',
  PROGRESS: 'progress',
  FINISHED: 'finished',
  ERROR: 'error'
};

/**
 * The GameLogLoader class definition.
 *
 * @author Stefan Glaser
 */
class GameLogLoader extends EventDispatcher
{
  /**
   * ::implements {IPublisher}
   * ::implements {IEventDispatcher}
   */
  constructor ()
  {
    super();

    /**
     * The game log parser instance.
     * @type {?GameLogParser}
     */
    this.parser = null;

    /**
     * The XMLHttpRequest object used to load remote game log files.
     * @type {?XMLHttpRequest}
     */
    this.xhr = null;

    /**
     * The FileReader object used to load the local game log files.
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

    // Create a parser instance
    if (!this.createParserFor(url, true)) {
      return;
    }

    // Publish start event
    this.dispatchEvent({
      type: GameLogLoaderEvents.START,
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

    // Create a parser instance
    if (!this.createParserFor(file.name)) {
      return;
    }

    if (this.fileReader === null) {
      this.fileReader = new FileReader();
      this.fileReader.addEventListener('loadend', this.fileReaderOnLoadEndListener, false);
    }

    // Publish start event
    this.dispatchEvent({
      type: GameLogLoaderEvents.START,
      url: file.name
    });

    // Read file
    // this.fileReader.readAsBinaryString(file);
    this.fileReader.readAsText(file);
  }

  /**
   * Load a game log file from the local file system.
   *
   * @param  {string} name the file name / url / etc.
   * @param  {boolean=} gzipAllowed indicator if gzipped file versions are accepted
   * @return {boolean}
   */
  createParserFor (name, gzipAllowed)
  {
    if (FileUtil.isSServerLogFile(name, gzipAllowed)) {
      // Try ulg parser
      this.parser = new ULGParser();
    } else if (FileUtil.isReplayFile(name, gzipAllowed)) {
      // Use replay parser
      this.parser = new ReplayParser();
    } else {
      this.dispatchEvent({
          type: GameLogLoaderEvents.ERROR,
          msg: 'Error while loading file! Failed to create game log parser!'
        });
    }

    return this.parser !== null;
  }

  /**
   * Clear the loader instance.
   *
   * @param {boolean=} keepIteratorAlive indicator if iterator should not be disposed
   * @return {void}
   */
  clear (keepIteratorAlive)
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

    // TODO: Clear file loader instance

    if (this.parser !== null) {
      this.parser.dispose(keepIteratorAlive);
    }

    this.parser = null;
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
      // Parse remaining response
      this.parse(event.target.response, DataExtent.COMPLETE);

      // Dispatch finished event
      this.dispatchEvent({
          type: GameLogLoaderEvents.FINISHED
        });
    } else {
      // Error during loading
      this.dispatchEvent({
          type: GameLogLoaderEvents.ERROR,
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
      this.parse(event.target.result, DataExtent.COMPLETE);

      // Dispatch finished event
      this.dispatchEvent({
          type: GameLogLoaderEvents.FINISHED
        });
    } else {
      // Clear loader instance
      this.clear();

      // Error during loading
      this.dispatchEvent({
          type: GameLogLoaderEvents.ERROR,
          msg: 'Loading file failed!'
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
        type: GameLogLoaderEvents.PROGRESS,
        total: event.total,
        loaded: event.loaded
      });

    if (event.target.status === 200 || event.target.status === 0) {
      this.parse(event.target.response, DataExtent.PARTIAL);
    }
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
        type: GameLogLoaderEvents.ERROR,
        msg: this.getXHRErrorMessage()
      });
  }

  /**
   * Try or continue parsing a game log.
   *
   * @param  {?string} data the current data
   * @param  {!DataExtent} extent the data extent (complete, partial, incremental)
   * @return {void}
   */
  parse (data, extent)
  {
    if (!data || this.parser === null) {
      // Nothing to parse
      return;
    }

    try {
      if (this.parser.parse(data, extent)) {
        // A new game log instance was successfully created
        this.dispatchEvent({
            type: GameLogLoaderEvents.NEW_GAME_LOG,
            gameLog: this.parser.getGameLog()
          });
      }

      if (extent === DataExtent.COMPLETE) {
        // Clear loader instance
        this.clear(true);
      }
    } catch (ex) {
      // Clear loader instance
      this.clear();

      // Dispatch errer event
      this.dispatchEvent({
          type: GameLogLoaderEvents.ERROR,
          msg: ex.toString()
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

export { GameLogLoader };
