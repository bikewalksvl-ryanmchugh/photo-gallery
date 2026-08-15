const FOLDER_ID = "1ZdSy1QsA0P0vNXw__-23gZXFAXrTm6Ck";

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Photo Gallery")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getPhotos() {
  Logger.log("Entering getPhotos");
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  const photos = [];

  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();
    if (mimeType.indexOf("image/") === 0) {
      photos.push({
        id: file.getId(),
      });
    }
  }

  console.log(photos);
  return photos;
}
