const Excel = require('exceljs')

function ExcelExport (path) {
  this.path = path
  this.workbook = new Excel.Workbook()
  this.sheetCount = 0
  this.currentSheet = 0
}

ExcelExport.prototype.newSheet = function (){
  this.sheetCount += 1
  let sheet = this.workbook.addWorksheet(`Page[${this.sheetCount}]`)
  this.currentSheet = sheet.id

  sheet.properties = {defaultRowHeight:20}

  sheet.views = [{state: 'frozen', ySplit: 1, topLeftCell: 'A2', activeCell: 'A2'}]
  let cellStyle = {
    alignment:{ vertical: 'middle', horizontal: 'center' }
  }

  sheet.columns = [
    { header: '公司名稱', key: 'co_name', width: 48, style:cellStyle},//A
    { header: '公司電話', key: 'co_tel', width: 16, style:cellStyle},//B
    { header: '公司電話圖', key: 'co_tel_img', width: 14, style:cellStyle},//C
    { header: '公司地址', key: 'co_addr', width: 40, style:cellStyle},//D
    { header: '公司地址圖', key: 'co_addr_img', width: 40, style:cellStyle}//E
  ]

  return sheet
}

ExcelExport.prototype.activeSheet = function (){
  return this.workbook.getWorksheet(this.currentSheet)
}

ExcelExport.prototype.addImage = function(sheet,buf,ext,col,row) {
  let imgID = this.workbook.addImage({buffer: buf,extension: ext})
  sheet.addImage(imgID, {
    tl: { col: col, row: row },
    br: { col: col+1, row: row+1},
    editAs: 'oneCell'
  });
}

ExcelExport.prototype.writeFile = function() {
  return this.workbook.xlsx.writeFile(this.path)
}

module.exports = ExcelExport;
