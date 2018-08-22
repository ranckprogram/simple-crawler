var http = require('http')
var stream = require('stream')
var fs = require('fs')

var cheerio = require('cheerio')

var base_url = 'http://naizi555.xyz?page=1'

var v = 'http://r3.zzz1111.xyz/archived/13335_15dfa9fbabf9c36af0e812fb34576b65.jpg'
/**
 *
 * 思路:
 * 1、根据分页，拿到所有页得列表数据 {1，} => 循环结束条件
 *
 * */

var data = {
	video: {
		list: [{
			name: '',
			src: '',
			url: ''
		}]
	}
}

http.get(base_url, function (res) {
	var resultData = ''
	
	res.on('data', function (chunk) {
		console.log('获取数据中')
		resultData += chunk
	})
	
	res.on('end', function () {
		// 数据解析
		var resultList = analyticData(resultData)
		var content = resultList.map(function (item) {
			return '文件名： '+ item.title + '\n' + 'src:' + item.src +'\n\n'
		})
		// 数据写入文件
		fs.writeFile('./data.tt', content.join(''), function (err) {
			console.log(err)
		})
		
	})
})

function analyticData (html) {
	var $ = cheerio.load(html)
	var list = $('.content .row > a')
	var result = []
	for (var i = 0; i < list.length; i++) {
		result.push({
			title: $(list[i]).find('.title').text(),
			src: $(list[i]).find('img').attr('src')
		})
	}
	return result
}