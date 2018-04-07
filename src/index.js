/*vendor*/
const DefaultUserAgent = require('default-user-agent')
const {
  JSDOM
} = require('jsdom')
const Request = require('request-promise-native')
const Tesseract = require('tesseract.js');

/*inner module*/
const _U_ = require('./util.js');
const ExcelExport = require('./ExcelExport.js');


const DefaultHost = 'https://www.iyp.com.tw'

const DefaultHeader = {
  'cache-control': 'no-cache',
  'user-agent': DefaultUserAgent()
}

const DefaultReqOpt = {
  resolveWithFullResponse: true,
  headers: DefaultHeader
}

const AREA = {
  '全區': 0,
  '宜蘭縣': 1,
  '基隆市': 3,
  '新北市': 4,
  '台北市': 6,
  '桃園市': 5,
  '新竹縣市': 7,
  '苗栗縣': 8,
  '台中市': 9,
  '彰化縣': 11,
  '南投縣': 12,
  '雲林縣': 13,
  '嘉義縣市': 14,
  '台南市': 15,
  '高雄市': 18,
  '屏東縣': 21,
  '花蓮縣': 2,
  '台東縣': 22,
  '澎湖縣': 17,
  '馬祖': 23,
  '金門縣': 20
}

async function main(param) {
  let {keyword,area,page} = param

  if(!page) page = 0

  try {

    let [searched, err0] = await search({
      k: keyword,
      a_id: AREA[area],
      p:page
    })
    if (err0) return err0

    let [parsed, err1] = await parseResultPage(searched.body)
    if (err1) return err1

    let {
      dataList,
      next
    } = parsed

    let path = `[${area}]${keyword}.xlsx`

    let excel = param.excel
    if(!excel) excel = new ExcelExport(path)

    let sheet = (excel.sheetCount === 0)? excel.newSheet():excel.activeSheet()
    if(sheet.actualRowCount >= 101) sheet = excel.newSheet()

    dataList.forEach((item, i) => {
      let {
        title,
        telImg,
        addressImg
      } = item

      if (title) sheet.addRow({
        co_name: title
      })
      console.log(title,sheet.actualRowCount-1)
      if (telImg) excel.addImage(sheet, telImg.body, /\/(.+)/.exec(telImg.contentType)[1], 2, sheet.actualRowCount-1)
      if (addressImg) excel.addImage(sheet, addressImg.body, /\/(.+)/.exec(addressImg.contentType)[1], 4, sheet.actualRowCount-1)
    })

    if(next) {
      nextParam = Object.assign(param,{page:page+1,excel:excel})
      return main(nextParam)
    }

    return excel.writeFile()
  } catch (e) {
    return e
  }

}

async function parseResultPage(body) {

  const DOM = new JSDOM(body);
  let parseResult = {
    dataList: null,
    next: null
  }

  let [nodelist, err0] = _U_.queryElChildren(DOM.window.document, '#search-res ol>li')
  if (err0) return [null, err0]

  let [nextEl] = _U_.queryElChild(DOM.window.document, '.paginator .next')

  if (_U_.hasProp(nextEl, 'href')[0]) parseResult.next = nextEl.href

  parseResult.dataList = await Promise.all(Array.from(nodelist).map(async (el) => {
    let result = {
      title: '',
      telImg: null,
      addressImg: null
    }

    let [titleEl, err0] = _U_.queryElChild(el, 'h3')

    let [telEl, err1] = _U_.queryElChild(el, '.contact-info .tel>img')

    let [AddressEl, err2] = _U_.queryElChild(el, '.contact-info .address>img')

    if (_U_.hasProp(titleEl, 'textContent')[0]) result.title = titleEl.textContent

    if (_U_.hasProp(telEl, 'src')[0])[result.telImg, err] = await getImage(`https:${telEl.src}`)

    if (_U_.hasProp(AddressEl, 'src')[0])[result.addressImg, err] = await getImage(`https:${AddressEl.src}`)

    return result
  }))

  return [parseResult, null]
}

async function getImage(url) {

  let options = Object.assign(DefaultReqOpt, {
    method: 'GET',
    baseUrl: '',
    url: url,
    encoding: null
  })

  return await doRequest(options)
}

async function search(param) {
  console.log('search', param)

  let options = Object.assign(DefaultReqOpt, {
    method: 'GET',
    baseUrl: DefaultHost,
    url: '/search.php',
    qs: param,
  })

  return await doRequest(options)

}

/**
* Send request accroding to options
* @return [Object,Error]
*/
async function doRequest(options) {
  try {
    let response = await Request(options)

    let {
      statusCode,
      statusMessage,
      headers,
      body,
      request
    } = response
    let {
      method,
      uri
    } = request
    let log = `(${statusCode} ${statusMessage}) ${method} : ${uri.href}`

    if (statusCode === 200) {
      return [{
        contentType: headers['content-type'],
        body: body,
        msg: log
      }, null]
    } else {
      return [null, new Error('[REQUEST_FAILED]' + log)]
    }
  } catch (e) {
    return [null, e]
  }
}

module.exports = {
  crawl:main
}
