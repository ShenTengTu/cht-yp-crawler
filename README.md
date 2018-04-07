# cht-yp-crawler
根據[中華黃頁](www.iyp.com.tw)的搜尋結果，擷取每一頁的公司名稱、電話(圖)、地址(圖)並匯出成XLSX檔案。
> Simple Crawler of www.iyp.com.tw.
> According to the search results ,company name, phone number(image), address(image) of each page are retrieved and exported into the XLSX file.

## Unrealized but planned features
- 使用OCR從電話號碼圖像和地址圖像中獲取文字
> - Using OCR to get text from phone number image & address image

## Issue
- Microsoft Excel needs to recover XLSX before opening([exceljs/issues/106](https://github.com/guyonroche/exceljs/issues/106))

## Example
執行完成後你會看到`[新北市]保險.xlsx`出現在專案根目錄中。
> 如果開啟檔案出現『我們發現.xlsx的部分內容有問題您要我們盡可能嘗試復原?』的訊息，請選擇“是”即可。

```js
const {crawl}  = require('./src/index.js');

crawl({keyword:'保險',area:'新北市',page:0}).then(function(err) {
  console.log(err?err:'xlsx done.')
});

/*Log
search { k: '保險', a_id: 4, p: 0 }
寶祥保險經紀人股份有限公司 1
富邦產物保險股份有限公司 2
富邦產物保險股份有限公司 3
富邦產物保險股份有限公司 4
兆鎮國際保險經紀人有限公司 5
保誠人壽保險股份有限公司 6
國泰世紀產物保險股份有限公司 7
國泰世紀產物保險股份有限公司 8
新光產物保險股份有限公司 9
新光產物保險股份有限公司 10
search { k: '保險', a_id: 4, p: 1 }
南山人壽保險股份有限公司 11
合佳保險代理人有限公司 12
大誠保險經紀人股份有限公司 13
...
...
...
xlsx done.
*/
```
## table of area
|area|a_id|area|a_id|area|a_id|
|:-:|:-:|:-:|:-:|:-:|:-:|
|全區|0|苗栗縣|8|高雄市|18|
|宜蘭縣|1|台中市|9|屏東縣|21|
|基隆市|3|彰化縣|11|花蓮縣|2|
|新北市|4|南投縣|12|台東縣|22|
|台北市|6|雲林縣|13|澎湖縣|17|
|桃園市|5|嘉義縣市|14|馬祖|23|
|新竹縣市|7|台南市|15|金門縣|20|
