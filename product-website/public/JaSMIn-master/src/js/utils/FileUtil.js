/**
 * Simple file helpers.
 * 
 * @author Stefan Glaser
 */
class FileUtil
{
  /**
   * Extract the file name from an url string.
   *
   * @param  {string} url the url to extract the file name from
   * @return {string} the file name or the given url if the url doesn't contain any subfolders
   */
  static getFileName (url)
  {
    let endIdx = url.indexOf('?');
    if (endIdx === -1) {
      // No parameter indication character found
      endIdx = url.length;
    }

    const startIdx = url.slice(0, endIdx).lastIndexOf('/');

    return url.slice(startIdx + 1, endIdx);
  }

  /**
   * Extract the file type from an url string.
   *
   * @param  {string} url the url to extract the file type from
   * @return {?string} the file type or null if the path doesn't refer a file
   */
  static getFileType (url)
  {
    // TODO: Find a proper solution...
    const lastDotIdx = url.lastIndexOf('.');

    if (lastDotIdx !== -1) {
      return url.slice(lastDotIdx + 1);
    } else {
      return null;
    }
  }

  /**
   * Filter a list of files according to their name suffixes.
   *
   * @param  {!Array<!File>} files a list of files
   * @param  {!Array<string>} suffixes the list of suffixes to filter for
   * @return {!Array<!File>} a list of files with the given suffixes
   */
  static filterFiles (files, suffixes) {
    const filteredFiles = [];

    for (let i = 0; i < files.length; i++) {
      for (let j = 0; j < suffixes.length; j++) {
        if (files[i].name.slice(-suffixes[j].length) === suffixes[j]) {
          filteredFiles.push(files[i]);
          break;
        }
      }
    }

    return filteredFiles;
  }

  /**
   * Check if the given url/path/file references a known replay file ending.
   *
   * @param  {string} url the url to check
   * @param  {boolean=} gzipAllowed indicator if gzipped versions are accepted
   * @return {boolean} true, if the given url references a known replay file ending, false otherwise
   */
  static isReplayFile (url, gzipAllowed) {
    const fileName = FileUtil.getFileName(url);
    const suffix9 = fileName.slice(-9);
    const suffix6 = fileName.slice(-6);

    if (suffix6 === '.rpl3d' || suffix6 === '.rpl2d' || fileName.slice(-7) === '.replay') {
      return true;
    } else if (gzipAllowed && (suffix9 === '.rpl3d.gz' || suffix9 === '.rpl2d.gz' || fileName.slice(-10) === '.replay.gz')) {
      return true;
    }

    return false;
  }

  /**
   * Check if the given url/path/file references a known sserver log file ending.
   *
   * @param  {string} url the url to check
   * @param  {boolean=} gzipAllowed indicator if gzipped file versions are accepted
   * @return {boolean} true, if the given url references a known sserver log file ending, false otherwise
   */
  static isSServerLogFile (url, gzipAllowed) {
    const fileName = FileUtil.getFileName(url);

    return fileName.slice(-4) === '.rcg' || (gzipAllowed !== undefined && fileName.slice(-7) === '.rcg.gz');
  }
}

export { FileUtil };
