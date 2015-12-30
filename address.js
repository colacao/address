/**
* 同程城市选择器
*
*     @example
*      new Address({
*        onCreate: function(dom) {
*       
*        },
*        onChange: function(value) {
*          document.getElementById("test").innerHTML = (value);
*        }
*     });
*
* 1,需要分词服务
* 2,如果没有分词服务，就需要两个两个字的匹配
* @class Address
* @author colacao <cy14477@ly.com>
*/
var Address = function(options) {
	var defaults = {
		select: null,
		wrapper: document.documentElement,
		target: null,
		key:null,
		cityTagName:"LI",
		data: {
			"阿克苏|akesu|aks":"阿克苏|akesu|aks",
			"成都|chengdu|cd":"成都|chengdu|cd",
			"达家沟|dajiagou|djg":"达家沟|dajiagou|djg",
			"峨眉山|emeishan|ems":"峨眉山|emeishan|ems",
			"繁昌西|fanchangxi|fcx":"繁昌西|fanchangxi|fcx",
			"上海|shanghai|sh": "上海虹桥|shanghaihongqiao|shhq@上海南|shanghainan|shn@上海西|shanghaixi|shx",
			"苏州|shuzhou|sz": "苏州北|shuzhoubei|szb@苏州新区|shuzhouxingqu|szxq@苏州园区|shuzhouyuanqu|szyq",
			"北京|beijing|bj": "北京东|beijingdong|bjd@北京南|beijingnan|bjn@北京西|beijingxi|bjx@北京北|beijingbei|bjb",
			"南京|nanjing|nj": "南京东|nanjingdong|njd@南京南|nanjingnan|njn@南京西|nanjingxi|njx@南京北|nanjingbei|njb",
			"西安|xian|xa": "西安|xian|xa@西安北|xianbei|xab@西安南|xiannan|xan",
		},
		hotData:"北京|beijing@上海|shanghai@杭州|hangzhou@广州|guangzhou@南京|nanjing@武汉|wuhan@郑州|zhengzhou@长沙|changsha@深圳|shenzhen@深圳|shenzhen@成都|chengdu",
		historyData:"南京|nanjing@武汉|wuhan@郑州|zhengzhou@长沙|changsha@深圳|shenzhen@深圳|shenzhen@黄山|huangshang",
		pyData: {},
		events: {
			touchstart: "touchstart",
			touchmove: "touchmove",
			touchend: "touchend"
		},
		//initials: ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "r", "z", "c", "s", "y", "w"],
		classNames: {
			all: "calendars",
			sunday: "sunday",
			disabled: "disabled",
			saturday: "saturday",
			today: "nian_select",
			select: "nian_select",
			tomorrow: "",
			festival: "festival",
			enter: "fadeInUpBig",
			out: "fadeOutDownBig"
		},
		txt: {
			location: "定位",
			getlocation: "点击获取当前位置",
			hot: "热门",
			history: "最近",
			dcity: "出发城市",
			acity: "到达城市",
			searchbtn: "确定",
			station:"站"
		},
		template: {
			header: '<h3 class="float-header"></h3>',
			wrappers: '<div id="cityPage" class="page current" style="display: block;">{$wrapper}{$header}{$searchbar}{$citynav}</div>',
			searchbar: '<div class="search"><div data-id="t_from" data-index="1" class="wrapinput t_from active"><input placeholder="{$dcity}"><span class="clear"><i>×</i></span></div><div data-id="t_to" data-index="2" class="wrapinput t_to"><input placeholder="{$acity}"><span class="clear"><i>×</i></span></div><div  class="wrapinput searchbtn"><label>{$searchbtn}</label></div></div>',
			wrapper: '<div id="city-wrapper" class="city-wrapper">{$location}{$history}{$hot}{$address}</div>',
			location: '<h3 class="city-key-dw">{$location}</h3><ul class="dw-city">{$getlocation}</ul>',
			locationlist: '<li class="disabled get-location">{$getlocation}</li>',
			history: '<h3 class="city-key-dw">{$history}<span class="action remove"><i></i></span></h3><ul class="rm-city-list">{$historylist}</ul>',
			historylist: '<li data-id="null" data-name="{$name}" data-qpy="bj" data-fullpy="beijing">{$name}</li>',
			hot: '<h3 class="city-key-rm">{$hot}</h3><ul class="rm-city-list">{$hostlist}</ul>',
			hostlist: '<li data-id="null" data-name="{$name}" data-qpy="bj" data-fullpy="beijing">{$name}</li>',
			cityswrapper:'<div class="cityslist">{$citys}</div>',
			city: '<h3 class="city-key-{$py}">{$py}</h3><ul>{$citylist}</ul>',
			citylist: '<li data-id="{$id}" data-name="{$name}" data-qpy="0" data-fullpy="{$fullpy}">{$name}</li>',
			citynav: '<ul class="city-nav"><li data-key="dw" class="txt">{$location}</li><li data-key="rm" class="txt">{$hot}</li><li data-key="dw" class="txt">{$history}</li>{$citynavlist}</ul>',
			citynavlist: '<li data-key="{$py}">{$py}</li>',
			station:'<span>{$station}({$jp})</span>',
			citystation:'<span>(包含：{$stations})</span>',
		},
		canChange: function(data, el) {
			return true;
		},
		onChange: function() {},
		onChangeCity:function(){},
		onCreate: function() {}
	}
	var opt = extend(defaults, options);
	this.initialize(opt)
}
Address.prototype = {
	initialize: function(options) {
		this.setOptions(options);
		this.render();
		this.bind();
	},
	setOptions: function(options) {
		extend(this, options);
	},
	keyup:function(e){
		e = e||window.event;
		var code = e.keyCode;
		var tag = e.target||e.srcElement;
		if(tag.lastValue!=tag.value){
		var _key = tag.value.replace(this.txt.station,"").trim();
		this.key=[_key];
		if(/^[\u4e00-\u9fa5]+$/.test(_key) && _key.length>2){
			var __key = [];
			for(var i=0;i<_key.length;i++){
				__key.push(_key.substr(i,2))
			}
			this.key=__key;
		}
		console.time(this.key);
		this.create();
		console.timeEnd(this.key);
		}
	},
	inputFocus:function(tag){

		var ipts = this.target.querySelectorAll('input');
		for(var i=0;i<ipts.length;i++){
			if(tag==ipts[i]){
				addClass(ipts[i].parentNode,"active")
			}else{
				removeClass(ipts[i].parentNode,"active")
			}
		}
	},
	bind: function() {
		addEvent(this.target.querySelectorAll('input')[0],"focus",function(e){
			this.inputFocus(e.target);
		}.bind(this));
		addEvent(this.target.querySelectorAll('input')[1],"focus",function(e){
			this.inputFocus(e.target);
		}.bind(this));
		addEvent(this.target.querySelectorAll('input')[0],"keyup",function(e){
			this.keyup();
		}.bind(this));
		addEvent(this.target.querySelectorAll('input')[1],"keyup",function(e){
			this.keyup();
		}.bind(this));
		addEvent(document.documentElement, this.events.touchmove, function(e) {
			e.preventDefault();
		});
		addEvent(this.target, this.events.touchstart, function(e) {
			this.touchstart(e);
		}.bind(this));
		addEvent(this.wrapper, this.events.touchmove, function(e) {
			this.touchmove(e);
		}.bind(this));
		addEvent(this.target, this.events.touchend, function(e) {

			this.touchend(e);
		}.bind(this));
	},

	touchstart: function(e) {
		var px = (e.changedTouches.length ? e.changedTouches[0].pageX : 0);
		var py = (e.changedTouches.length ? e.changedTouches[0].pageY : 0);

		this.beginEL = e.target;
		this.px = px;
		this.py = py;
	},

	touchmove: function(e) {
		var px = (e.changedTouches.length ? e.changedTouches[0].pageX : 0);
		var py = (e.changedTouches.length ? e.changedTouches[0].pageY : 0);
		if (Math.abs(px - this.px) > 10 || Math.abs(py - this.py) > 10) {
			this.beginEL = null;
		}
	},

	touchend: function(e) {
		if(hasClass(e.target,"action") || hasClass(e.target.parentNode,"action")){
			this[e.target.parentNode.className.replace("action ","")](e.target.parentNode);
			return;
		}

		if(hasClass(e.target,"city-nav") || hasClass(e.target.parentNode,"city-nav")){
			var key = e.target.getAttribute('data-key')||e.target.parentNode.getAttribute('data-key');
			
			this.onChangeCity(key);
			return;
		}


		var tag = parents(e.target, this.cityTagName);
		if (e.target == this.beginEL && tag) {
			var _value = tag.getAttribute(this.dateAttr);
			var check = this.canChange.call(this, _value, tag);
			if (check) {
				this.onChange(_value);
				this.close();
			}
		}
	},
	remove:function(obj){
		obj.parentNode.nextSibling.style.visibility="hidden";
		obj.parentNode.removeChild(obj);
	},
	close:function(){

	},
	render: function() {
		this.create();
	},
	winHeight: function() {
		var _h = window.innerHeight
		return ((_h > 0) ? _h : screen.height);
	},
	create: function() {
		if(!this.target){
			//console.log("first");
			for (var c in this.data) {
				this.test("a", c, this.data[c]);
			}
			var str = this.template.wrappers.replaceWith({
				header: this.template.header,
				searchbar: this.template.searchbar.replaceWith({
					dcity: this.txt.dcity,
					acity: this.txt.acity,
					searchbtn: this.txt.searchbtn
				}),
				wrapper: this.template.wrapper.replaceWith({
					location: this.template.location.replaceWith({
						location: this.txt.location,
						getlocation: this.template.locationlist.replaceWith({
							getlocation: this.txt.getlocation
						})
					}),
					hot: this.template.hot.replaceWith({
						hot: this.txt.hot,
						hostlist: this.getHot(this.hotData),
					}),
					history: this.template.history.replaceWith({
						history: this.txt.history,
						historylist: this.getHistory(this.historyData)
					}),
					address: this.template.cityswrapper.replaceWith({
						citys:this.getCityPY(this.key,this.pyData)
					})
				}),
				citynav: this.template.citynav.replaceWith({
					location: this.txt.location,
					hot: this.txt.hot,
					history: this.txt.history,
					citynavlist: this.getCityNavList(this.pyData)
				})

			})
			var _tempwrapper = document.createElement("div");
			_tempwrapper.innerHTML = str;
			this.target = _tempwrapper.removeChild(_tempwrapper.firstChild);

			this.wrapper.appendChild(this.target);
			this.target.style.height = this.winHeight() + 'px';

			var fixHeight = this.target.childNodes[2].offsetHeight;
	    	this.target.childNodes[0].style.paddingTop = fixHeight +'px';
	    	this.target.childNodes[1].style.top = fixHeight+'px';

			this.onCreate.call(this);

			var cityslist = this.target.querySelector('.cityslist');
			this.showOther(cityslist);
		}else{
			var cityslist = this.target.querySelector('.cityslist');
			if(this.key && this.key.length>1){
				var self = this;
				cityslist.innerHTML = (function(){
					var arr=[];
					for(var i=0;i<self.key.length;i++){
						if(self.key[i].length>1){
							arr.push(self.getCityPY(self.key[i],self.pyData));
						}
					}
					return arr.join('');
				})();
			}else if(this.key){
				cityslist.innerHTML = this.getCityPY(this.key[0],this.pyData);
			}
			//console.log("filter"+this.key.length);
			if(this.key[0]!=""){
				this.hideOther(cityslist);
			}else{
				this.showOther(cityslist);
			}
		}
	},
	showOther:function(el){
		var pel = el.parentNode;
		var subs = pel.childNodes;
		for(var i = 0;i<subs.length;i++ ){
			if(subs[i]!=el){
				subs[i].style.display="";
			}
		}
		var h3s  = this.target.querySelectorAll('h3');
		for(var i=0;i<h3s.length;i++){
			h3s[i].style.height="30px";
		}
		this.target.querySelector('.city-nav').style.display="";
	},
	hideOther:function(el){
		var pel = el.parentNode;
		var subs = pel.childNodes;
		for(var i = 0;i<subs.length;i++ ){
			if(subs[i]!=el){
				subs[i].style.display="none";
			}
		}
		var h3s  = this.target.querySelectorAll('h3');
		for(var i =0;i<h3s.length;i++){
			h3s[i].style.height="0px";
		}
		this.target.querySelector('.city-nav').style.display="none";
	},
	getHot: function(data) {
		var _data = data.split('@');
		var ret = [];
		for (var i=0;i<_data.length;i++) {
			var s = _data[i].split('|');
			ret.push(this.template.hostlist.replaceWith({
				py: s[1],
				name:s[0]
			}));
		}
		return ret.join('');
	},
	getHistory: function(data) {
		var _data = data.split('@');
		var ret = [];
		for (var i=0;i<_data.length;i++) {
			var s = _data[i].split('|');
			ret.push(this.template.historylist.replaceWith({
				py: s[1],
				name:s[0]
			}));
		}
		return ret.join('');
	},
	getCityNavList: function(data) {
		var ret = [];
		for (var b in data) {
			ret.push(this.template.citynavlist.replaceWith({
				py: b.toUpperCase()
			}));
		}
		return ret.join('');
	},
	getStation:function(py,city){
		var data = this.data[city];
		// if(!data){
		// 	return "";
		// }else{
		// 	// return this.template.citystation.replaceWith({
		// 	// 	stations:data.match(/[\u4e00-\u9fa5]+/gi).join(this.txt.station+',')+this.txt.station
		// 	// })
		// }
		return data?this.template.citystation.replaceWith({
			stations:data.match(/[\u4e00-\u9fa5]+/gi).join(this.txt.station+',')+this.txt.station
		}):"";
	},
	check:function(data,py,key){
		var citys = data.split('|');
		return true;
		//return (citys[0].substr(0,1)==py||citys[0].substr(0,1)==key||citys[1].substr(0,1)==py || citys[1].substr(0,1)==key.substr(0,1));
	},
	tempObj : {},
	getCityList: function(key,py, data) {
		key=key||"";
		var ret = [];
		for (var b in data) {
			if (data[b].data.length ) {
				var citys = (this.regcity(key||py, data[b].citys.join('@')));
				var datas = (this.regcity(key||py, data[b].data.join('@')));
				//有城市
				for (var i = 0; i < citys.length; i++) {
					var stations = (this.data[citys[i]]||"").split('@');
					var _check = this.check(citys[i],py,key);
					var _stations = this.getStation(py,citys[i]);

					(_check && _stations) && ret.push(this.template.citylist.replaceWith({
						id: 1,
						name: citys[i].split('|')[0]+(key?_stations:""),
						fullpy: citys[i].split('|')[1]
					}));
					if(key){
						for (var j = 0; j < stations.length; j++) {
							var stationsArr = stations[j].split('|');
							(_check && _stations)&& ret.push(this.template.citylist.replaceWith({
								id: 1,
								name: stationsArr[0]+this.template.station.replaceWith({station:this.txt.station,jp:stationsArr[2]}),
								fullpy: stationsArr[1]
							}));
						}
					}
				}
				//没有城市,只有站
				if(key && citys.length==0 && datas.length){
					for (var j = 0; j < datas.length; j++) {
						var stations = datas[j].split('@');
						if(!this.tempObj[stations]){
							var stationsArr = (stations[j]||"").split('|');
							if(stations[j])
							 stations[j] && ret.push(this.template.citylist.replaceWith({
								id: 1,
								name: stationsArr[0]+this.template.station.replaceWith({station:this.txt.station,jp:stationsArr[2]}),
								fullpy: stationsArr[1]
							}));
							this.tempObj[stations] = stations[0];
						}
					}
				}	
			}
		}

		return ret;
	},
	getCityPY: function(key,data) {
		var ret = [];
		if(!this.key || !this.key[0]){
			for (var b in data) {
				data[b].data.length && ret.push(this.template.city.replaceWith({
					py: b.toUpperCase(),
					citylist: this.getCityList(key,b, data).join('')
				}));
			}
		} else {

			this.tempObj={};
			var _data = this.getCityList(key,"", data).join('');
			 ret.push(this.template.city.replaceWith({
				citylist: _data
			}));
		}
		return ret.join('');
	},
	test: function(key, city, data) {
		for (var i = 0; i < 26; i++) {
			var py = (String.fromCharCode((97 + i)));
			var regcity = new RegExp('[\\u4e00-\\u9fa5]*\\|' + py + '.*', "gi");
			var regdata = new RegExp('[\\u4e00-\\u9fa5]*\\|' + py + '.*', "gi");
			this.pyData[py] = {
				citys: (this.pyData[py] ? this.pyData[py]["citys"] ? this.pyData[py]["citys"] : [] : []),
				data: (this.pyData[py] ? this.pyData[py]["data"] ? this.pyData[py]["data"] : [] : [])
			}
			var matchcity = regcity.exec(city);

			if (matchcity) {
				this.pyData[py]["citys"].push(matchcity[0])
			}
			var matchdata = regdata.exec(data);
			if (matchdata) {
				this.pyData[py]['data'].push(matchdata[0]);
			}
		}
	},
	regcity: function(text, data) {
		if (!text || !data) return [];
		var reg = null;
		if (/([\u4e00-\u9fa5]+)/.exec(text)) { //chinese, hightest priority level
			var chinesematch = escape(RegExp.$1).replace(/%/g, "\\").toLowerCase();
			reg = new RegExp('([\\u4e00-\\u9fa5]*(' + chinesematch + ')[\\u4e00-\\u9fa5]*)\\|[a-z]+\\|[a-z]+', "gi");
		} else if (/([a-z]+)/i.exec(text)) {
			var fullmatch = RegExp.$1, //full matching
				partmatch = fullmatch.replace(/([a-z])/gi, "($1[a-z]*)"); //part matching
				jpmatch = fullmatch.replace(/([a-z])/gi, "($1[a-z]*)|"); //part matching

			reg = new RegExp("[\\u4e00-\\u9fa5]*\\|([a-z]*(" + fullmatch + ")[a-z]*|[a-z]*" + partmatch + ")\\|([a-z]*(" + fullmatch + ")[a-z]*|[a-z]*" + fullmatch + ")", "gi");
		}
		//console.log(reg);
		if (!reg) {
			return [];
		} else { //sort by match index asc
			var matches = [];
			var match = reg.exec(data);
			while (match) {
				matches.push({
					index: match[2] || Infinity,
					text: match[0]
				})
				match = reg.exec(data);
			}
			matches.length && matches.sort(function(a, b) {
				return a.index - b.index;
			});
			return matches.length && matches.map(function(match) {
				return match.text;
			}) || [];
		}
	}
}