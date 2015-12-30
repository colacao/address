/**
* 同程滚动列表
* 该组件需依赖iscroll-lite
*
*     @example
*		new List({
*			floatContainer: document.querySelectorAll(".float-header")[0],
*			Scroll: (function() {
*			    var listeners = [];
*		    	var top;
*		 	   	var scroll = new iScroll("wrapper", {
*		        	onScrollMove: function(e) {
*		            	top = -this.y;
*		            	listeners.forEach(function(fn) {
*		                	fn.call(window);
*		            	});
*		        	}
*		    	});
*		    	return {
*		        	onscroll: function(fn) {
*		            	listeners.push(fn);
*		        	},
*		        	getScrollTop: function() {
*		            	return top;
*		        	},
*		        	getOffsetTop: function(target) {
*		            	return target.offsetTop;
*		        	}
*		    	}
*			})(),
*			targets: document.querySelectorAll("ul h3")
*		});
*
* @class List
* @author colacao <cy14477@ly.com>
*/
function List(options) {
	var defaults = {
		/**
		 * 需要浮动的头元素
		 * @type {Array}
		 */
		items: null,
		/**
		 * 外层的固定浮动元素
		 * @type {HTMLElement}
		 */
		floatContainer: null,
		/**
		 * 当前浮动头元素的索引值
		 * @type {Number}
		 */
		currentIndex: -1,
		/**
		 * 浮动的头元素的高度
		 * @type {Number}
		 */
		headerHeight: 0,
		/**
		 * 滚动插件(iScroll)
		 * @type {Object}
		 */
		Scroll:null
	}
	var opt = extend(defaults, options);
	this.initialize(opt);
}
List.prototype = {
 	/**
   * 构造函数
   * @param  {Object} options
   */
	initialize: function(options) {
		this.setOptions(options);
		this.fix();
		this.bind();
	},
	/**
   * 设置初始值
   * @param  {Object} options
   */
	setOptions: function(options) {
		extend(this, options);
		this.items = this.createItems();
		
	},
	/**
	 * 修正方法 
	 */
	fix:function(){
		if (this.targets.length) {
			this.floatContainer.innerHTML = this.targets[0].innerHTML;
		}
	},
	/**
	 * 生成头集合
	 * @return {Array}
	 */
	createItems:function(){
		var items = [];
		for(var i=0;i<this.targets.length;i++){
			items.push({
				node:this.targets[i],
				top:this.Scroll.getOffsetTop(this.targets[i])
			})
		}
		return items;
	},
	/**
	 * 绑定事件
	 */
	bind: function() {
		this.Scroll.onscroll(this.onScroll.bind(this));
	},
	 /**
    * 滚动事件 
    */ 
	onScroll:function(){
		
		var _top = this.Scroll.getScrollTop();
		var top = _top + this.Scroll.getOffsetTop(this.floatContainer);


		if (_top <= 0) {
			this.floatContainer.style.opacity = 0;
		}
		this.render(top);
		var nextNode = this.items[this.currentIndex + 1];
		top += this.headerHeight;
		//document.querySelector(".float-header").innerHTML = "aa"+((nextNode && nextNode.top)+":"+top);

		if (nextNode && (nextNode.top < top)) {
		//document.querySelector(".float-header").innerHTML = "bb"+((nextNode && nextNode.top)+":"+top+":"+(nextNode.top - top));
			this.floatContainer.style.WebkitTransform = "translate(0," + (nextNode.top - top) + "px)";
			this.floatContainer.style.transform = "translate(0," + (nextNode.top - top) + "px)";

		} else {
			this.floatContainer.style.WebkitTransform = "";	
			this.floatContainer.style.transform = "";
		}
	},
	/**
	 * 查找当前的高度是第几个头
	 * @param  {Number}
	 * @return {Number}
	 */
	findIndex: function(top) {
		for (var i = 0, l = this.items.length; i < l; i++) {
			if (this.items[i].top > top) {
				break;
			}
		}
		return i - 1;
	},
	/**
	 * 渲染头
	 * @param  {Number}
	 */
	render: function(top) {
		var index = this.findIndex(top);
		if (index === this.currentIndex) {
			return;
		}
		if (index === -1) {
			this.floatContainer.style.opacity = 0
		} else {
			this.floatContainer.innerHTML = "";
			this.floatContainer.appendChild(this.items[index].node.firstChild.cloneNode(true))
			this.floatContainer.style.opacity = 1
			this.headerHeight = this.floatContainer.offsetHeight;

		}
		this.currentIndex = index;
	}
}
