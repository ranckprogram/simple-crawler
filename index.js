var https = require('https')
var stream = require('stream')
var fs = require('fs')

var cheerio = require('cheerio')

var base_url = 'https://www.ourocg.cn/card/list-5/1'

/**
 *
 * 思路:
 * 1、根据分页，拿到所有页得列表数据 {1，} => 循环结束条件
 *
 * */

var data = {
	list: [{
		name: '',   // 卡名字
		attr: '',   // 属性  光，火，水....
		effect: '',  // 效果描述
		src: '',
		ATK: '',    // 攻击力
		DEFL: ''    // 防御力
	}]
}

https.get(base_url, function (res) {
	var resultData = ''
	
	res.on('data', function (chunk) {
		console.log('获取数据中')
		resultData += chunk
	})
	
	res.on('end', function () {
		// 数据解析
		var resultList = analyticData(resultData)
		var content = resultList.map(function (item) {
			// 这里的字符串可以用对象数据结构映射
			return '卡名字： '+ item.name + '\n' + 'src:' + item.attr +'\n\n'
		})
		// 数据写入文件
		fs.writeFile('./data.txt', content.join(''),function (err) {
			if (err) {
				console.log(err)
			}
		})
		
	})
})

function analyticData (html) {
	var $ = cheerio.load(html)
	console.log(html)
	fs.writeFile('./1.html', html)
	var list = $('.card-list').find('.card-item')
	var effect = $('.effect')
	console.log(list.length)
	var result = []
	// for (var i = 0; i < list.length; i++) {
	// 	console.log($(list[i]).find('a').text())
	// 	console.log(effect)
	//
	// 	console.log($(list[i]).children('img').attr('src'))
	// 	result.push({
	// 		name: $(list[i]).find('a').text(),
	// 		attr: $(list[i]).find('.ak').text()
	// 	})
	// }
	
	list.each(function (item) {
		console.log($(this).find('a').text())
		console.log($(this).find('img').attr('src'))
		console.log($(this).toString())
		
	})

	return result
}