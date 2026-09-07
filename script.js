function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Membaca data dari form URL Encoded
    var tanggal = e.parameter.tanggal;
    var nama = e.parameter.nama;
    var kehadiran = e.parameter.kehadiran;
    var mapel = e.parameter.mapel;
    var statusTugas = e.parameter.statusTugas;
    var fotoTugas = e.parameter.fotoTugas;
    
    sheet.appendRow([
      tanggal,
      nama,
      kehadiran,
      mapel,
      statusTugas,
      fotoTugas
    ]);
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  data.shift(); // Hapus baris header/judul
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
