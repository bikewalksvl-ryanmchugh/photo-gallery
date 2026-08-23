const FOLDER_ID = "1oVkmHmvvzWhZc6h6ew0gq1-bPLl-rttC";

function doGet(e) {
  // Proxy endpoint for serving images
  if (e && e.parameter && e.parameter.action === "serve") {
    return serveImage(e.parameter.id);
  }

  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Photo Gallery")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function serveImage(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    return ContentService.createTextOutput(blob.getBytes()).setMimeType(
      blob.getContentType(),
    );
  } catch (err) {
    return HtmlService.createHtmlOutput(
      "<h1>Error: " + err.message + "</h1>",
    ).setContentType("text/html");
  }
}

function ensureFolderAccess() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  try {
    // Try to access the folder to verify permissions
    folder.getName();
    Logger.log("Folder access verified");
  } catch (err) {
    Logger.log("Error accessing folder: " + err.message);
  }
}

function shareFolderPublicly() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  // Set folder to be accessible by anyone with the link
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // Also share all files in the folder
  const files = folder.getFiles();
  let count = 0;
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType().indexOf("image/") === 0) {
      file.setSharing(
        DriveApp.Access.ANYONE_WITH_LINK,
        DriveApp.Permission.VIEW,
      );
      count++;
    }
  }
  Logger.log("Shared folder and " + count + " images publicly");
  return "Folder and " + count + " images shared publicly";
}

function getPhotos() {
  Logger.log("Entering getPhotos");
  ensureFolderAccess();

  // Get the web app URL from properties (set during deployment)
  const props = PropertiesService.getScriptProperties();
  const webAppUrl = props.getProperty("webAppUrl");

  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  const photos = [];

  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();
    if (mimeType.indexOf("image/") === 0) {
      const fileId = file.getId();
      // Use Google Drive thumbnail endpoint (sz controls size: w=width, h=height)
      const thumbnailUrl =
        "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w500";
      // Larger thumbnail for lightgallery full-size view
      const fullSizeUrl =
        "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w2048";
      // Direct link to view/download the file
      const viewUrl = "https://drive.google.com/file/d/" + fileId + "/view";

      photos.push({
        id: fileId,
        thumbnailUrl: thumbnailUrl,
        fullSizeUrl: fullSizeUrl,
        viewUrl: viewUrl,
        name: file.getName(),
        mimeType: mimeType,
      });
    }
  }

  Logger.log("Found " + photos.length + " photos");
  return photos;
}

function setWebAppUrl() {
  const url = ScriptApp.getService().getUrl();
  PropertiesService.getScriptProperties().setProperty("webAppUrl", url);
  Logger.log("Web app URL stored: " + url);
  return url;
}
