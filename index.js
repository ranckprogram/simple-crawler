var http = require('http')
var stream = require('stream')
var fs = require('fs')

var cheerio = require('cheerio')

var base_url = 'http://www.ruanyifeng.com/blog/javascript/'

/**
 *
 * 思路:
 * 1、根据分页，拿到所有页得列表数据 {1，} => 循环结束条件
 *
 * */


http.get(base_url, function (res) {
	var resultData = ''
	
	res.on('data', function (chunk) {
		console.log('获取数据中')
		resultData += chunk
	})
	
	res.on('end', function () {
		// 数据解析
		var resultList = analyticList(resultData)
		var content = resultList.map(function (item) {
			// 这里的字符串可以用对象数据结构映射
			return '文章名称： ' + item.name + '\n' + '文章链接:  ' + item.href + '\n\n'
		})
		// 数据写入文件
		fs.writeFile('./list.txt', content.join(''), function (err) {
			if (err) {
				console.log(err)
			}
		})
		
		resultList.forEach(function (item) {
			console.log(item)
			getDetail(item.href)
		})
		
	})
})

function analyticList (html) {
	var $ = cheerio.load(html)
	var list = $('#alpha-inner .module-list-item')
	var result = []
	list.each(function () {
		console.log($(this).find('a').text())
		console.log($(this).find('a').attr('href'))
		result.push({
			name: $(this).find('a').text(),
			href: $(this).find('a').attr('href')
		})
	})
	return result
}

function getDetail (url) {
	http.get(url, function (res) {
		var resultData = ''
		
		res.on('data', function (chunk) {
			console.log('详情获取数据中')
			resultData += chunk
		})
		
		res.on('end', function () {
			console.log(resultData)
			var detail = analyticDetail(resultData)
			fs.writeFile('./file/' + detail.title + '.txt', detail.content, function (err) {
				if (err) {
					console.log(err)
				}
			})
		})
	})
}

function analyticDetail (html) {
	var $ = cheerio.load(html)
	var result = {}
	var title = $('#page-title').text()
	var content = $('#main-content').text()
	var published = $('.published').text()
	
	result.title = title
	result.content = content
	result.published = published
	return result
}