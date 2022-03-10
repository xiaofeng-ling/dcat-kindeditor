/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2020 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @website http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 * @version 5.0.2 (2020-12-08)
 *******************************************************************************/
(function (window, undefined) {
	if (window.KindEditor) {
		return;
	}


	if (!window.console) {
		window.console = {};
	}
	if (!console.log) {
		console.log = function () {};
	}
	var _VERSION = '5.0.2 (2020-12-08)',
		_ua = navigator.userAgent.toLowerCase(),
		_IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1,
		_NEWIE = _ua.indexOf('msie') == -1 && _ua.indexOf('trident') > -1,
		_GECKO = _ua.indexOf('gecko') > -1 && _ua.indexOf('khtml') == -1,
		_WEBKIT = _ua.indexOf('applewebkit') > -1,
		_OPERA = _ua.indexOf('opera') > -1,
		_MOBILE = _ua.indexOf('mobile') > -1,
		_IOS = /ipad|iphone|ipod/.test(_ua),
		_QUIRKS = document.compatMode != 'CSS1Compat',
		_IERANGE = !window.getSelection,
		_matches = /(?:msie|firefox|webkit|opera)[\/:\s](\d+)/.exec(_ua),
		_V = _matches ? _matches[1] : '0',
		_TIME = new Date().getTime();
	function _isArray(val) {
		if (!val) {
			return false;
		}
		return Object.prototype.toString.call(val) === '[object Array]';
	}
	function _isFunction(val) {
		if (!val) {
			return false;
		}
		return Object.prototype.toString.call(val) === '[object Function]';
	}
	function _inArray(val, arr) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (val === arr[i]) {
				return i;
			}
		}
		return -1;
	}
	function _each(obj, fn) {
		if (_isArray(obj)) {
			for (var i = 0, len = obj.length; i < len; i++) {
				if (fn.call(obj[i], i, obj[i]) === false) {
					break;
				}
			}
		} else {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (fn.call(obj[key], key, obj[key]) === false) {
						break;
					}
				}
			}
		}
	}
	function _trim(str) {
		return str.replace(/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, '');
	}
	function _inString(val, str, delimiter) {
		delimiter = delimiter === undefined ? ',' : delimiter;
		return (delimiter + str + delimiter).indexOf(delimiter + val + delimiter) >= 0;
	}
	function _addUnit(val, unit) {
		unit = unit || 'px';
		return val && /^-?\d+(?:\.\d+)?$/.test(val) ? val + unit : val;
	}
	function _removeUnit(val) {
		var match;
		return val && (match = /(\d+)/.exec(val)) ? parseInt(match[1], 10) : 0;
	}
	function _escape(val) {
		return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	function _unescape(val) {
		return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
	}
	function _toCamel(str) {
		var arr = str.split('-');
		str = '';
		_each(arr, function(key, val) {
			str += (key > 0) ? val.charAt(0).toUpperCase() + val.substr(1) : val;
		});
		return str;
	}
	function _toHex(val) {
		function hex(d) {
			var s = parseInt(d, 10).toString(16).toUpperCase();
			return s.length > 1 ? s : '0' + s;
		}
		return val.replace(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/ig,
			function($0, $1, $2, $3) {
				return '#' + hex($1) + hex($2) + hex($3);
			}
		);
	}
	function _toMap(val, delimiter) {
		delimiter = delimiter === undefined ? ',' : delimiter;
		var map = {}, arr = _isArray(val) ? val : val.split(delimiter), match;
		_each(arr, function(key, val) {
			if ((match = /^(\d+)\.\.(\d+)$/.exec(val))) {
				for (var i = parseInt(match[1], 10); i <= parseInt(match[2], 10); i++) {
					map[i.toString()] = true;
				}
			} else {
				map[val] = true;
			}
		});
		return map;
	}
	function _toArray(obj, offset) {
		return Array.prototype.slice.call(obj, offset || 0);
	}
	function _undef(val, defaultVal) {
		return val === undefined ? defaultVal : val;
	}
	function _invalidUrl(url) {
		return !url || /[<>"]/.test(url);
	}
	function _addParam(url, param) {
		return url.indexOf('?') >= 0 ? url + '&' + param : url + '?' + param;
	}
	function _extend(child, parent, proto) {
		if (!proto) {
			proto = parent;
			parent = null;
		}
		var childProto;
		if (parent) {
			var fn = function () {};
			fn.prototype = parent.prototype;
			childProto = new fn();
			_each(proto, function(key, val) {
				childProto[key] = val;
			});
		} else {
			childProto = proto;
		}
		childProto.constructor = child;
		child.prototype = childProto;
		child.parent = parent ? parent.prototype : null;
	}


	function _json(text) {
		var match;
		if ((match = /\{[\s\S]*\}|\[[\s\S]*\]/.exec(text))) {
			text = match[0];
		}
		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		cx.lastIndex = 0;
		if (cx.test(text)) {
			text = text.replace(cx, function (a) {
				return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			});
		}
		if (/^[\],:{}\s]*$/.
		test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
		replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
		replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
			return eval('(' + text + ')');
		}
		throw 'JSON parse error';
	}
	var _round = Math.round;
	var K = {
		DEBUG : false,
		VERSION : _VERSION,
		IE : _IE,
		GECKO : _GECKO,
		WEBKIT : _WEBKIT,
		OPERA : _OPERA,
		V : _V,
		TIME : _TIME,
		each : _each,
		isArray : _isArray,
		isFunction : _isFunction,
		inArray : _inArray,
		inString : _inString,
		trim : _trim,
		addUnit : _addUnit,
		removeUnit : _removeUnit,
		escape : _escape,
		unescape : _unescape,
		toCamel : _toCamel,
		toHex : _toHex,
		toMap : _toMap,
		toArray : _toArray,
		undef : _undef,
		invalidUrl : _invalidUrl,
		addParam : _addParam,
		extend : _extend,
		json : _json
	};
	var _INLINE_TAG_MAP = _toMap('a,abbr,acronym,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,img,input,ins,kbd,label,map,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),
		_BLOCK_TAG_MAP = _toMap('address,applet,blockquote,body,center,dd,dir,div,dl,dt,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,head,hr,html,iframe,ins,isindex,li,map,menu,meta,noframes,noscript,object,ol,p,pre,script,style,table,tbody,td,tfoot,th,thead,title,tr,ul'),
		_SINGLE_TAG_MAP = _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),
		_STYLE_TAG_MAP = _toMap('b,basefont,big,del,em,font,i,s,small,span,strike,strong,sub,sup,u'),
		_CONTROL_TAG_MAP = _toMap('img,table,input,textarea,button'),
		_PRE_TAG_MAP = _toMap('pre,style,script'),
		_NOSPLIT_TAG_MAP = _toMap('html,head,body,td,tr,table,ol,ul,li'),
		_AUTOCLOSE_TAG_MAP = _toMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),
		_FILL_ATTR_MAP = _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'),
		_VALUE_TAG_MAP = _toMap('input,button,textarea,select');


	function _getBasePath() {
		var els = document.getElementsByTagName('script'), src;
		for (var i = 0, len = els.length; i < len; i++) {
			src = els[i].src || '';
			if (/kindeditor[\w\-\.]*\.js/.test(src)) {
				return src.substring(0, src.lastIndexOf('/') + 1);
			}
		}
		return '';
	}
	K.basePath = _getBasePath();
	K.options = {
		designMode : true,
		fullscreenMode : false,
		filterMode : true,
		wellFormatMode : true,
		shadowMode : true,
		loadStyleMode : true,
		allowFileManager:false,
		basePath : K.basePath,
		themesPath : K.basePath + 'themes/',
		langPath : K.basePath + 'lang/',
		pluginsPath : K.basePath + 'plugins/',
		themeType : 'simple',
		langType : 'zh-CN',
		urlType : '',
		newlineTag : 'br',
		resizeType : 2,
		syncType : 'form',
		pasteType : 2,
		dialogAlignType : 'page',
		useContextmenu : false,
		fullscreenShortcut : false,
		bodyClass : 'ke-content',
		indentChar : '\t',
		cssPath : '',
		cssData : '',
		minWidth : 650,
		minHeight : 100,
		minChangeSize : 50,
		zIndex : 19890322,
		items : [
			'source',
			'|','formatblock', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright',
			'justifyfull', 'insertorderedlist', 'insertunorderedlist',
			'forecolor', 'hilitecolor', 'bold',
			'italic', 'underline', 'lineheight',
			'table',  'insertimages',
			'preview',
			'fullscreen',
		],
		noDisableItems : ['source', 'fullscreen'],
		colorTable : [
			['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
			['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
			['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
			['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
		],
		fontSizeTable : ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
		htmlTags : {
			font : ['id', 'class', 'color', 'size', 'face', '.background-color'],
			span : [
				'id', 'class', '.color', '.background-color', '.font-size', '.font-family', '.background',
				'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
			],
			div : [
				'id', 'class', 'align', '.border', '.margin', '.padding', '.text-align', '.color',
				'.background-color', '.font-size', '.font-family', '.font-weight', '.background',
				'.font-style', '.text-decoration', '.vertical-align', '.margin-left'
			],
			table: [
				'id', 'class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
				'.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
				'.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
				'.width', '.height', '.border-collapse'
			],
			'td,th': [
				'id', 'class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
				'.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
				'.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
			],
			a : ['id', 'class', 'href', 'target', 'name'],
			embed : ['id', 'class', 'src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', 'wmode'],
			img : ['id', 'class', 'src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
			'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
				'id', 'class', 'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
				'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
			],
			pre : ['id', 'class'],
			hr : ['id', 'class', '.page-break-after'],
			'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del' : ['id', 'class'],
			iframe : ['id', 'class', 'src', 'frameborder', 'width', 'height', '.width', '.height']
		},
		layout : '<div class="container"><div class="toolbar"></div><div class="edit"></div><div class="statusbar"></div></div>'
	};


	var _useCapture = false;


	var _INPUT_KEY_MAP = _toMap('8,9,13,32,46,48..57,59,61,65..90,106,109..111,188,190..192,219..222');

	var _CURSORMOVE_KEY_MAP = _toMap('33..40');

	var _CHANGE_KEY_MAP = {};
	_each(_INPUT_KEY_MAP, function(key, val) {
		_CHANGE_KEY_MAP[key] = val;
	});
	_each(_CURSORMOVE_KEY_MAP, function(key, val) {
		_CHANGE_KEY_MAP[key] = val;
	});


	function _bindEvent(el, type, fn) {
		if (el.addEventListener){
			el.addEventListener(type, fn, _useCapture);
		} else if (el.attachEvent){
			el.attachEvent('on' + type, fn);
		}
	}

	function _unbindEvent(el, type, fn) {
		if (el.removeEventListener){
			el.removeEventListener(type, fn, _useCapture);
		} else if (el.detachEvent){
			el.detachEvent('on' + type, fn);
		}
	}
	var _EVENT_PROPS = ('altKey,attrChange,attrName,bubbles,button,cancelable,charCode,clientX,clientY,ctrlKey,currentTarget,' +
		'data,detail,eventPhase,fromElement,handler,keyCode,metaKey,newValue,offsetX,offsetY,originalTarget,pageX,' +
		'pageY,prevValue,relatedNode,relatedTarget,screenX,screenY,shiftKey,srcElement,target,toElement,view,wheelDelta,which').split(',');


	function KEvent(el, event) {
		this.init(el, event);
	}
	_extend(KEvent, {
		init : function(el, event) {
			var self = this, doc = el.ownerDocument || el.document || el;
			self.event = event;
			_each(_EVENT_PROPS, function(key, val) {
				self[val] = event[val];
			});
			if (!self.target) {
				self.target = self.srcElement || doc;
			}
			if (self.target.nodeType === 3) {
				self.target = self.target.parentNode;
			}
			if (!self.relatedTarget && self.fromElement) {
				self.relatedTarget = self.fromElement === self.target ? self.toElement : self.fromElement;
			}
			if (self.pageX == null && self.clientX != null) {
				var d = doc.documentElement, body = doc.body;
				self.pageX = self.clientX + (d && d.scrollLeft || body && body.scrollLeft || 0) - (d && d.clientLeft || body && body.clientLeft || 0);
				self.pageY = self.clientY + (d && d.scrollTop  || body && body.scrollTop  || 0) - (d && d.clientTop  || body && body.clientTop  || 0);
			}
			if (!self.which && ((self.charCode || self.charCode === 0) ? self.charCode : self.keyCode)) {
				self.which = self.charCode || self.keyCode;
			}
			if (!self.metaKey && self.ctrlKey) {
				self.metaKey = self.ctrlKey;
			}
			if (!self.which && self.button !== undefined) {
				self.which = (self.button & 1 ? 1 : (self.button & 2 ? 3 : (self.button & 4 ? 2 : 0)));
			}
			switch (self.which) {
				case 186 :
					self.which = 59;
					break;
				case 187 :
				case 107 :
				case 43 :
					self.which = 61;
					break;
				case 189 :
				case 45 :
					self.which = 109;
					break;
				case 42 :
					self.which = 106;
					break;
				case 47 :
					self.which = 111;
					break;
				case 78 :
					self.which = 110;
					break;
			}
			if (self.which >= 96 && self.which <= 105) {
				self.which -= 48;
			}
		},
		preventDefault : function() {
			var ev = this.event;
			if (ev.preventDefault) {
				ev.preventDefault();
			} else {
				ev.returnValue = false;
			}
		},
		stopPropagation : function() {
			var ev = this.event;
			if (ev.stopPropagation) {
				ev.stopPropagation();
			} else {
				ev.cancelBubble = true;
			}
		},
		stop : function() {
			this.preventDefault();
			this.stopPropagation();
		}
	});
	var _eventExpendo = 'kindeditor_' + _TIME, _eventId = 0, _eventData = {};
	function _getId(el) {
		return el[_eventExpendo] || null;
	}
	function _setId(el) {
		el[_eventExpendo] = ++_eventId;
		return _eventId;
	}
	function _removeId(el) {
		try {
			delete el[_eventExpendo];
		} catch(e) {
			if (el.removeAttribute) {
				el.removeAttribute(_eventExpendo);
			}
		}
	}
	function _bind(el, type, fn) {
		if (type.indexOf(',') >= 0) {
			_each(type.split(','), function() {
				_bind(el, this, fn);
			});
			return;
		}
		var id = _getId(el);
		if (!id) {
			id = _setId(el);
		}
		if (_eventData[id] === undefined) {
			_eventData[id] = {};
		}
		var events = _eventData[id][type];
		if (events && events.length > 0) {
			_unbindEvent(el, type, events[0]);
		} else {
			_eventData[id][type] = [];
			_eventData[id].el = el;
		}
		events = _eventData[id][type];
		if (events.length === 0) {
			events[0] = function(e) {
				var kevent = e ? new KEvent(el, e) : undefined;
				_each(events, function(i, event) {
					if (i > 0 && event) {
						event.call(el, kevent);
					}
				});
			};
		}
		if (_inArray(fn, events) < 0) {
			events.push(fn);
		}
		_bindEvent(el, type, events[0]);
	}
	function _unbind(el, type, fn) {
		if (type && type.indexOf(',') >= 0) {
			_each(type.split(','), function() {
				_unbind(el, this, fn);
			});
			return;
		}
		var id = _getId(el);
		if (!id) {
			return;
		}
		if (type === undefined) {
			if (id in _eventData) {
				_each(_eventData[id], function(key, events) {
					if (key != 'el' && events.length > 0) {
						_unbindEvent(el, key, events[0]);
					}
				});
				delete _eventData[id];
				_removeId(el);
			}
			return;
		}
		if (!_eventData[id]) {
			return;
		}
		var events = _eventData[id][type];
		if (events && events.length > 0) {
			if (fn === undefined) {
				_unbindEvent(el, type, events[0]);
				delete _eventData[id][type];
			} else {
				_each(events, function(i, event) {
					if (i > 0 && event === fn) {
						events.splice(i, 1);
					}
				});
				if (events.length == 1) {
					_unbindEvent(el, type, events[0]);
					delete _eventData[id][type];
				}
			}
			var count = 0;
			_each(_eventData[id], function() {
				count++;
			});
			if (count < 2) {
				delete _eventData[id];
				_removeId(el);
			}
		}
	}
	function _fire(el, type) {
		if (type.indexOf(',') >= 0) {
			_each(type.split(','), function() {
				_fire(el, this);
			});
			return;
		}
		var id = _getId(el);
		if (!id) {
			return;
		}
		var events = _eventData[id][type];
		if (_eventData[id] && events && events.length > 0) {
			events[0]();
		}
	}
	function _ctrl(el, key, fn) {
		var self = this;
		key = /^\d{2,}$/.test(key) ? key : key.toUpperCase().charCodeAt(0);
		_bind(el, 'keydown', function(e) {
			if (e.ctrlKey && e.which == key && !e.shiftKey && !e.altKey) {
				fn.call(el);
				e.stop();
			}
		});
	}
	var _readyFinished = false;
	function _ready(fn) {
		if (_readyFinished) {
			fn(KindEditor);
			return;
		}
		var loaded = false;
		function readyFunc() {
			if (!loaded) {
				loaded = true;
				fn(KindEditor);
				_readyFinished = true;
			}
		}
		function ieReadyFunc() {
			if (!loaded) {
				try {
					document.documentElement.doScroll('left');
				} catch(e) {
					setTimeout(ieReadyFunc, 100);
					return;
				}
				readyFunc();
			}
		}
		function ieReadyStateFunc() {
			if (document.readyState === 'complete') {
				readyFunc();
			}
		}
		if (document.addEventListener) {
			_bind(document, 'DOMContentLoaded', readyFunc);
		} else if (document.attachEvent) {
			_bind(document, 'readystatechange', ieReadyStateFunc);
			var toplevel = false;
			try {
				toplevel = window.frameElement == null;
			} catch(e) {}
			if (document.documentElement.doScroll && toplevel) {
				ieReadyFunc();
			}
		}
		_bind(window, 'load', readyFunc);
	}
	if (window.attachEvent) {
		window.attachEvent('onunload', function() {
			_each(_eventData, function(key, events) {
				if (events.el) {
					_unbind(events.el);
				}
			});
		});
	}
	K.ctrl = _ctrl;
	K.ready = _ready;

	function _getCssList(css) {
		css = css.replace(/&quot;/g, '"');
		var list = {},
			reg = /\s*([\w\-]+)\s*:([^;]*)(;|$)/g,
			match;
		while ((match = reg.exec(css))) {
			var key = _trim(match[1].toLowerCase()),
				val = _trim(_toHex(match[2]));
			list[key] = val;
		}
		return list;
	}
	function _getAttrList(tag) {
		var list = {},
			reg = /\s+(?:([\w\-:]+)|(?:([\w\-:]+)=([^\s"'<>]+))|(?:([\w\-:"]+)="([^"]*)")|(?:([\w\-:"]+)='([^']*)'))(?=(?:\s|\/|>)+)/g,
			match;
		while ((match = reg.exec(tag))) {
			var key = (match[1] || match[2] || match[4] || match[6]).toLowerCase(),
				val = (match[2] ? match[3] : (match[4] ? match[5] : match[7])) || '';
			list[key] = val;
		}
		return list;
	}
	function _addClassToTag(tag, className) {
		if (/\s+class\s*=/.test(tag)) {
			tag = tag.replace(/(\s+class=["']?)([^"']*)(["']?[\s>])/, function($0, $1, $2, $3) {
				if ((' ' + $2 + ' ').indexOf(' ' + className + ' ') < 0) {
					return $2 === '' ? $1 + className + $3 : $1 + $2 + ' ' + className + $3;
				} else {
					return $0;
				}
			});
		} else {
			tag = tag.substr(0, tag.length - 1) + ' class="' + className + '">';
		}
		return tag;
	}
	function _formatCss(css) {
		var str = '';
		_each(_getCssList(css), function(key, val) {
			str += key + ':' + val + ';';
		});
		return str;
	}
	function _formatUrl(url, mode, host, pathname) {
		mode = _undef(mode, '').toLowerCase();
		if (url.substr(0, 5) != 'data:') {
			url = url.replace(/([^:])\/\//g, '$1/');
		}
		if (_inArray(mode, ['absolute', 'relative', 'domain']) < 0) {
			return url;
		}
		host = host || location.protocol + '//' + location.host;
		if (pathname === undefined) {
			var m = location.pathname.match(/^(\/.*)\//);
			pathname = m ? m[1] : '';
		}
		var match;
		if ((match = /^(\w+:\/\/[^\/]*)/.exec(url))) {
			if (match[1] !== host) {
				return url;
			}
		} else if (/^\w+:/.test(url)) {
			return url;
		}
		function getRealPath(path) {
			var parts = path.split('/'), paths = [];
			for (var i = 0, len = parts.length; i < len; i++) {
				var part = parts[i];
				if (part == '..') {
					if (paths.length > 0) {
						paths.pop();
					}
				} else if (part !== '' && part != '.') {
					paths.push(part);
				}
			}
			return '/' + paths.join('/');
		}
		if (/^\//.test(url)) {
			url = host + getRealPath(url.substr(1));
		} else if (!/^\w+:\/\//.test(url)) {
			url = host + getRealPath(pathname + '/' + url);
		}
		function getRelativePath(path, depth) {
			if (url.substr(0, path.length) === path) {
				var arr = [];
				for (var i = 0; i < depth; i++) {
					arr.push('..');
				}
				var prefix = '.';
				if (arr.length > 0) {
					prefix += '/' + arr.join('/');
				}
				if (pathname == '/') {
					prefix += '/';
				}
				return prefix + url.substr(path.length);
			} else {
				if ((match = /^(.*)\//.exec(path))) {
					return getRelativePath(match[1], ++depth);
				}
			}
		}
		if (mode === 'relative') {
			url = getRelativePath(host + pathname, 0).substr(2);
		} else if (mode === 'absolute') {
			if (url.substr(0, host.length) === host) {
				url = url.substr(host.length);
			}
		}
		return url;
	}
	function _formatHtml(html, htmlTags, urlType, wellFormatted, indentChar) {
		if (html == null) {
			html = '';
		}
		urlType = urlType || '';
		wellFormatted = _undef(wellFormatted, false);
		indentChar = _undef(indentChar, '\t');
		var fontSizeList = 'xx-small,x-small,small,medium,large,x-large,xx-large'.split(',');
		html = html.replace(/(<(?:pre|pre\s[^>]*)>)([\s\S]*?)(<\/pre>)/ig, function($0, $1, $2, $3) {
			return $1 + $2.replace(/<(?:br|br\s[^>]*)>/ig, '\n') + $3;
		});
		html = html.replace(/<(?:br|br\s[^>]*)\s*\/?>\s*<\/p>/ig, '</p>');
		html = html.replace(/(<(?:p|p\s[^>]*)>)\s*(<\/p>)/ig, '$1<br />$2');
		html = html.replace(/\u200B/g, '');
		html = html.replace(/\u00A9/g, '&copy;');
		html = html.replace(/\u00AE/g, '&reg;');
		html = html.replace(/\u2003/g, '&emsp;');
		html = html.replace(/\u3000/g, '&emsp;');
		html = html.replace(/<[^>]+/g, function($0) {
			return $0.replace(/\s+/g, ' ');
		});
		var htmlTagMap = {};
		if (htmlTags) {
			_each(htmlTags, function(key, val) {
				var arr = key.split(',');
				for (var i = 0, len = arr.length; i < len; i++) {
					htmlTagMap[arr[i]] = _toMap(val);
				}
			});
			if (!htmlTagMap.script) {
				html = html.replace(/(<(?:script|script\s[^>]*)>)([\s\S]*?)(<\/script>)/ig, '');
			}
			if (!htmlTagMap.style) {
				html = html.replace(/(<(?:style|style\s[^>]*)>)([\s\S]*?)(<\/style>)/ig, '');
			}
		}
		var re = /(\s*)<(\/)?([\w\-:]+)((?:\s+|(?:\s+[\w\-:]+)|(?:\s+[\w\-:]+=[^\s"'<>]+)|(?:\s+[\w\-:"]+="[^"]*")|(?:\s+[\w\-:"]+='[^']*'))*)(\/)?>(\s*)/g;
		var tagStack = [];
		html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
			var full = $0,
				startNewline = $1 || '',
				startSlash = $2 || '',
				tagName = $3.toLowerCase(),
				attr = $4 || '',
				endSlash = $5 ? ' ' + $5 : '',
				endNewline = $6 || '';
			if (htmlTags && !htmlTagMap[tagName]) {
				return '';
			}
			if (endSlash === '' && _SINGLE_TAG_MAP[tagName]) {
				endSlash = ' /';
			}
			if (_INLINE_TAG_MAP[tagName]) {
				if (startNewline) {
					startNewline = ' ';
				}
				if (endNewline) {
					endNewline = ' ';
				}
			}
			if (_PRE_TAG_MAP[tagName]) {
				if (startSlash) {
					endNewline = '\n';
				} else {
					startNewline = '\n';
				}
			}
			if (wellFormatted && tagName == 'br') {
				endNewline = '\n';
			}
			if (_BLOCK_TAG_MAP[tagName] && !_PRE_TAG_MAP[tagName]) {
				if (wellFormatted) {
					if (startSlash && tagStack.length > 0 && tagStack[tagStack.length - 1] === tagName) {
						tagStack.pop();
					} else {
						tagStack.push(tagName);
					}
					startNewline = '\n';
					endNewline = '\n';
					for (var i = 0, len = startSlash ? tagStack.length : tagStack.length - 1; i < len; i++) {
						startNewline += indentChar;
						if (!startSlash) {
							endNewline += indentChar;
						}
					}
					if (endSlash) {
						tagStack.pop();
					} else if (!startSlash) {
						endNewline += indentChar;
					}
				} else {
					startNewline = endNewline = '';
				}
			}
			if (attr !== '') {
				var attrMap = _getAttrList(full);
				if (tagName === 'font') {
					var fontStyleMap = {}, fontStyle = '';
					_each(attrMap, function(key, val) {
						if (key === 'color') {
							fontStyleMap.color = val;
							delete attrMap[key];
						}
						if (key === 'size') {
							fontStyleMap['font-size'] = fontSizeList[parseInt(val, 10) - 1] || '';
							delete attrMap[key];
						}
						if (key === 'face') {
							fontStyleMap['font-family'] = val;
							delete attrMap[key];
						}
						if (key === 'style') {
							fontStyle = val;
						}
					});
					if (fontStyle && !/;$/.test(fontStyle)) {
						fontStyle += ';';
					}
					_each(fontStyleMap, function(key, val) {
						if (val === '') {
							return;
						}
						if (/\s/.test(val)) {
							val = "'" + val + "'";
						}
						fontStyle += key + ':' + val + ';';
					});
					attrMap.style = fontStyle;
				}
				_each(attrMap, function(key, val) {
					if (_FILL_ATTR_MAP[key]) {
						attrMap[key] = key;
					}
					if (_inArray(key, ['src', 'href']) >= 0) {
						attrMap[key] = _formatUrl(val, urlType);
					}
					if (htmlTags && key !== 'style' && !htmlTagMap[tagName]['*'] && !htmlTagMap[tagName][key] ||
						tagName === 'body' && key === 'contenteditable' ||
						/^kindeditor_\d+$/.test(key)) {
						delete attrMap[key];
					}
					if (key === 'style' && val !== '') {
						var styleMap = _getCssList(val);
						_each(styleMap, function(k, v) {
							if (htmlTags && !htmlTagMap[tagName].style && !htmlTagMap[tagName]['.' + k]) {
								delete styleMap[k];
							}
						});
						var style = '';
						_each(styleMap, function(k, v) {
							style += k + ':' + v + ';';
						});
						attrMap.style = style;
					}
				});
				attr = '';
				_each(attrMap, function(key, val) {
					if (key === 'style' && val === '') {
						return;
					}
					val = val.replace(/"/g, '&quot;');
					attr += ' ' + key + '="' + val + '"';
				});
			}
			if (tagName === 'font') {
				tagName = 'span';
			}
			return startNewline + '<' + startSlash + tagName + attr + endSlash + '>' + endNewline;
		});
		html = html.replace(/(<(?:pre|pre\s[^>]*)>)([\s\S]*?)(<\/pre>)/ig, function($0, $1, $2, $3) {
			return $1 + $2.replace(/\n/g, '<span id="__kindeditor_pre_newline__">\n') + $3;
		});
		html = html.replace(/\n\s*\n/g, '\n');
		html = html.replace(/<span id="__kindeditor_pre_newline__">\n/g, '\n');
		return _trim(html);
	}

	function _clearMsWord(html, htmlTags) {
		html = html.replace(/<meta[\s\S]*?>/ig, '')
			.replace(/<![\s\S]*?>/ig, '')
			.replace(/<style[^>]*>[\s\S]*?<\/style>/ig, '')
			.replace(/<script[^>]*>[\s\S]*?<\/script>/ig, '')
			.replace(/<w:[^>]+>[\s\S]*?<\/w:[^>]+>/ig, '')
			.replace(/<o:[^>]+>[\s\S]*?<\/o:[^>]+>/ig, '')
			.replace(/<xml>[\s\S]*?<\/xml>/ig, '')
			.replace(/<(?:table|td)[^>]*>/ig, function(full) {
				return full.replace(/border-bottom:([#\w\s]+)/ig, 'border:$1');
			});
		return _formatHtml(html, htmlTags);
	}

	function _mediaType(src) {
		if (/\.(rm|rmvb)(\?|$)/i.test(src)) {
			return 'audio/x-pn-realaudio-plugin';
		}
		if (/\.(swf|flv)(\?|$)/i.test(src)) {
			return 'application/x-shockwave-flash';
		}
		return 'video/x-ms-asf-plugin';
	}

	function _mediaClass(type) {
		if (/realaudio/i.test(type)) {
			return 'ke-rm';
		}
		if (/flash/i.test(type)) {
			return 'ke-flash';
		}
		return 'ke-media';
	}
	function _mediaAttrs(srcTag) {
		return _getAttrList(unescape(srcTag));
	}
	function _mediaEmbed(attrs) {
		var html = '<embed ';
		_each(attrs, function(key, val) {
			html += key + '="' + val + '" ';
		});
		html += '/>';
		return html;
	}
	function _mediaImg(blankPath, attrs) {
		var width = attrs.width,
			height = attrs.height,
			type = attrs.type || _mediaType(attrs.src),
			srcTag = _mediaEmbed(attrs),
			style = '';
		if (/\D/.test(width)) {
			style += 'width:' + width + ';';
		} else if (width > 0) {
			style += 'width:' + width + 'px;';
		}
		if (/\D/.test(height)) {
			style += 'height:' + height + ';';
		} else if (height > 0) {
			style += 'height:' + height + 'px;';
		}
		var html = '<img class="' + _mediaClass(type) + '" src="' + blankPath + '" ';
		if (style !== '') {
			html += 'style="' + style + '" ';
		}
		html += 'data-ke-tag="' + escape(srcTag) + '" alt="" />';
		return html;
	}




	function _tmpl(str, data) {
		var fn = new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			str.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'") + "');}return p.join('');");
		return data ? fn(data) : fn;
	}
	K.formatUrl = _formatUrl;
	K.formatHtml = _formatHtml;
	K.getCssList = _getCssList;
	K.getAttrList = _getAttrList;
	K.mediaType = _mediaType;
	K.mediaAttrs = _mediaAttrs;
	K.mediaEmbed = _mediaEmbed;
	K.mediaImg = _mediaImg;
	K.clearMsWord = _clearMsWord;
	K.tmpl = _tmpl;


	function _contains(nodeA, nodeB) {
		if (nodeA.nodeType == 9 && nodeB.nodeType != 9) {
			return true;
		}
		while ((nodeB = nodeB.parentNode)) {
			if (nodeB == nodeA) {
				return true;
			}
		}
		return false;
	}
	var _getSetAttrDiv = document.createElement('div');
	_getSetAttrDiv.setAttribute('className', 't');
	var _GET_SET_ATTRIBUTE = _getSetAttrDiv.className !== 't';
	function _getAttr(el, key) {
		key = key.toLowerCase();
		var val = null;
		if (!_GET_SET_ATTRIBUTE && el.nodeName.toLowerCase() != 'script') {
			var div = el.ownerDocument.createElement('div');
			div.appendChild(el.cloneNode(false));
			var list = _getAttrList(_unescape(div.innerHTML));
			if (key in list) {
				val = list[key];
			}
		} else {
			try {
				val = el.getAttribute(key, 2);
			} catch(e) {
				val = el.getAttribute(key, 1);
			}
		}
		if (key === 'style' && val !== null) {
			val = _formatCss(val);
		}
		return val;
	}
	function _queryAll(expr, root) {
		var exprList = expr.split(',');
		if (exprList.length > 1) {
			var mergedResults = [];
			_each(exprList, function() {
				_each(_queryAll(this, root), function() {
					if (_inArray(this, mergedResults) < 0) {
						mergedResults.push(this);
					}
				});
			});
			return mergedResults;
		}
		root = root || document;
		function escape(str) {
			if (typeof str != 'string') {
				return str;
			}
			return str.replace(/([^\w\-])/g, '\\$1');
		}
		function stripslashes(str) {
			return str.replace(/\\/g, '');
		}
		function cmpTag(tagA, tagB) {
			return tagA === '*' || tagA.toLowerCase() === escape(tagB.toLowerCase());
		}
		function byId(id, tag, root) {
			var arr = [],
				doc = root.ownerDocument || root,
				el = doc.getElementById(stripslashes(id));
			if (el) {
				if (cmpTag(tag, el.nodeName) && _contains(root, el)) {
					arr.push(el);
				}
			}
			return arr;
		}
		function byClass(className, tag, root) {
			var doc = root.ownerDocument || root, arr = [], els, i, len, el;
			if (root.getElementsByClassName) {
				els = root.getElementsByClassName(stripslashes(className));
				for (i = 0, len = els.length; i < len; i++) {
					el = els[i];
					if (cmpTag(tag, el.nodeName)) {
						arr.push(el);
					}
				}
			} else if (doc.querySelectorAll) {
				els = doc.querySelectorAll((root.nodeName !== '#document' ? root.nodeName + ' ' : '') + tag + '.' + className);
				for (i = 0, len = els.length; i < len; i++) {
					el = els[i];
					if (_contains(root, el)) {
						arr.push(el);
					}
				}
			} else {
				els = root.getElementsByTagName(tag);
				className = ' ' + className + ' ';
				for (i = 0, len = els.length; i < len; i++) {
					el = els[i];
					if (el.nodeType == 1) {
						var cls = el.className;
						if (cls && (' ' + cls + ' ').indexOf(className) > -1) {
							arr.push(el);
						}
					}
				}
			}
			return arr;
		}
		function byName(name, tag, root) {
			var arr = [], doc = root.ownerDocument || root,
				els = doc.getElementsByName(stripslashes(name)), el;
			for (var i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (cmpTag(tag, el.nodeName) && _contains(root, el)) {
					if (el.getAttribute('name') !== null) {
						arr.push(el);
					}
				}
			}
			return arr;
		}
		function byAttr(key, val, tag, root) {
			var arr = [], els = root.getElementsByTagName(tag), el;
			for (var i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (el.nodeType == 1) {
					if (val === null) {
						if (_getAttr(el, key) !== null) {
							arr.push(el);
						}
					} else {
						if (val === escape(_getAttr(el, key))) {
							arr.push(el);
						}
					}
				}
			}
			return arr;
		}
		function select(expr, root) {
			var arr = [], matches;
			matches = /^((?:\\.|[^.#\s\[<>])+)/.exec(expr);
			var tag = matches ? matches[1] : '*';
			if ((matches = /#((?:[\w\-]|\\.)+)$/.exec(expr))) {
				arr = byId(matches[1], tag, root);
			} else if ((matches = /\.((?:[\w\-]|\\.)+)$/.exec(expr))) {
				arr = byClass(matches[1], tag, root);
			} else if ((matches = /\[((?:[\w\-]|\\.)+)\]/.exec(expr))) {
				arr = byAttr(matches[1].toLowerCase(), null, tag, root);
			} else if ((matches = /\[((?:[\w\-]|\\.)+)\s*=\s*['"]?((?:\\.|[^'"]+)+)['"]?\]/.exec(expr))) {
				var key = matches[1].toLowerCase(), val = matches[2];
				if (key === 'id') {
					arr = byId(val, tag, root);
				} else if (key === 'class') {
					arr = byClass(val, tag, root);
				} else if (key === 'name') {
					arr = byName(val, tag, root);
				} else {
					arr = byAttr(key, val, tag, root);
				}
			} else {
				var els = root.getElementsByTagName(tag), el;
				for (var i = 0, len = els.length; i < len; i++) {
					el = els[i];
					if (el.nodeType == 1) {
						arr.push(el);
					}
				}
			}
			return arr;
		}
		var parts = [], arr, re = /((?:\\.|[^\s>])+|[\s>])/g;
		while ((arr = re.exec(expr))) {
			if (arr[1] !== ' ') {
				parts.push(arr[1]);
			}
		}
		var results = [];
		if (parts.length == 1) {
			return select(parts[0], root);
		}
		var isChild = false, part, els, subResults, val, v, i, j, k, length, len, l;
		for (i = 0, lenth = parts.length; i < lenth; i++) {
			part = parts[i];
			if (part === '>') {
				isChild = true;
				continue;
			}
			if (i > 0) {
				els = [];
				for (j = 0, len = results.length; j < len; j++) {
					val = results[j];
					subResults = select(part, val);
					for (k = 0, l = subResults.length; k < l; k++) {
						v = subResults[k];
						if (isChild) {
							if (val === v.parentNode) {
								els.push(v);
							}
						} else {
							els.push(v);
						}
					}
				}
				results = els;
			} else {
				results = select(part, root);
			}
			if (results.length === 0) {
				return [];
			}
		}
		return results;
	}
	function _query(expr, root) {
		var arr = _queryAll(expr, root);
		return arr.length > 0 ? arr[0] : null;
	}
	K.query = _query;
	K.queryAll = _queryAll;


	function _get(val) {
		return K(val)[0];
	}
	function _getDoc(node) {
		if (!node) {
			return document;
		}
		return node.ownerDocument || node.document || node;
	}
	function _getWin(node) {
		if (!node) {
			return window;
		}
		var doc = _getDoc(node);
		return doc.parentWindow || doc.defaultView;
	}
	function _setHtml(el, html) {
		if (el.nodeType != 1) {
			return;
		}
		var doc = _getDoc(el);
		try {
			el.innerHTML = '<img id="__kindeditor_temp_tag__" width="0" height="0" style="display:none;" />' + html;
			var temp = doc.getElementById('__kindeditor_temp_tag__');
			temp.parentNode.removeChild(temp);
		} catch(e) {
			K(el).empty();
			K('@' + html, doc).each(function() {
				el.appendChild(this);
			});
		}
	}
	function _hasClass(el, cls) {
		return _inString(cls, el.className, ' ');
	}
	function _setAttr(el, key, val) {
		if (_IE && _V < 8 && key.toLowerCase() == 'class') {
			key = 'className';
		}
		el.setAttribute(key, '' + val);
	}
	function _removeAttr(el, key) {
		if (_IE && _V < 8 && key.toLowerCase() == 'class') {
			key = 'className';
		}
		_setAttr(el, key, '');
		el.removeAttribute(key);
	}
	function _getNodeName(node) {
		if (!node || !node.nodeName) {
			return '';
		}
		return node.nodeName.toLowerCase();
	}
	function _computedCss(el, key) {
		var self = this, win = _getWin(el), camelKey = _toCamel(key), val = '';
		if (win.getComputedStyle) {
			var style = win.getComputedStyle(el, null);
			val = style[camelKey] || style.getPropertyValue(key) || el.style[camelKey];
		} else if (el.currentStyle) {
			val = el.currentStyle[camelKey] || el.style[camelKey];
		}
		return val;
	}
	function _hasVal(node) {
		return !!_VALUE_TAG_MAP[_getNodeName(node)];
	}
	function _docElement(doc) {
		doc = doc || document;
		return _QUIRKS ? doc.body : doc.documentElement;
	}
	function _docHeight(doc) {
		var el = _docElement(doc);
		return Math.max(el.scrollHeight, el.clientHeight);
	}
	function _docWidth(doc) {
		var el = _docElement(doc);
		return Math.max(el.scrollWidth, el.clientWidth);
	}
	function _getScrollPos(doc) {
		doc = doc || document;
		var x, y;
		if (_IE || _NEWIE || _OPERA) {
			x = _docElement(doc).scrollLeft;
			y = _docElement(doc).scrollTop;
		} else {
			x = _getWin(doc).scrollX;
			y = _getWin(doc).scrollY;
		}
		return {x : x, y : y};
	}


	function KNode(node) {
		this.init(node);
	}
	_extend(KNode, {
		init : function(node) {
			var self = this;
			node = _isArray(node) ? node : [node];
			var length = 0;
			for (var i = 0, len = node.length; i < len; i++) {
				if (node[i]) {
					self[i] = node[i].constructor === KNode ? node[i][0] : node[i];
					length++;
				}
			}
			self.length = length;
			self.doc = _getDoc(self[0]);
			self.name = _getNodeName(self[0]);
			self.type = self.length > 0 ? self[0].nodeType : null;
			self.win = _getWin(self[0]);
		},
		each : function(fn) {
			var self = this;
			for (var i = 0; i < self.length; i++) {
				if (fn.call(self[i], i, self[i]) === false) {
					return self;
				}
			}
			return self;
		},
		bind : function(type, fn) {
			this.each(function() {
				_bind(this, type, fn);
			});
			return this;
		},
		unbind : function(type, fn) {
			this.each(function() {
				_unbind(this, type, fn);
			});
			return this;
		},
		fire : function(type) {
			if (this.length < 1) {
				return this;
			}
			_fire(this[0], type);
			return this;
		},
		hasAttr : function(key) {
			if (this.length < 1) {
				return false;
			}
			return !!_getAttr(this[0], key);
		},
		attr : function(key, val) {
			var self = this;
			if (key === undefined) {
				return _getAttrList(self.outer());
			}
			if (typeof key === 'object') {
				_each(key, function(k, v) {
					self.attr(k, v);
				});
				return self;
			}
			if (val === undefined) {
				val = self.length < 1 ? null : _getAttr(self[0], key);
				return val === null ? '' : val;
			}
			self.each(function() {
				_setAttr(this, key, val);
			});
			return self;
		},
		removeAttr : function(key) {
			this.each(function() {
				_removeAttr(this, key);
			});
			return this;
		},
		get : function(i) {
			if (this.length < 1) {
				return null;
			}
			return this[i || 0];
		},
		eq : function(i) {
			if (this.length < 1) {
				return null;
			}
			return this[i] ? new KNode(this[i]) : null;
		},
		hasClass : function(cls) {
			if (this.length < 1) {
				return false;
			}
			return _hasClass(this[0], cls);
		},
		addClass : function(cls) {
			this.each(function() {
				if (!_hasClass(this, cls)) {
					this.className = _trim(this.className + ' ' + cls);
				}
			});
			return this;
		},
		removeClass : function(cls) {
			this.each(function() {
				if (_hasClass(this, cls)) {
					this.className = _trim(this.className.replace(new RegExp('(^|\\s)' + cls + '(\\s|$)'), ' '));
				}
			});
			return this;
		},
		html : function(val) {
			var self = this;
			if (val === undefined) {
				if (self.length < 1 || self.type != 1) {
					return '';
				}
				return _formatHtml(self[0].innerHTML);
			}
			self.each(function() {
				_setHtml(this, val);
			});
			return self;
		},
		text : function() {
			var self = this;
			if (self.length < 1) {
				return '';
			}
			return _IE ? self[0].innerText : self[0].textContent;
		},
		hasVal : function() {
			if (this.length < 1) {
				return false;
			}
			return _hasVal(this[0]);
		},
		val : function(val) {
			var self = this;
			if (val === undefined) {
				if (self.length < 1) {
					return '';
				}
				return self.hasVal() ? self[0].value : self.attr('value');
			} else {
				self.each(function() {
					if (_hasVal(this)) {
						this.value = val;
					} else {
						_setAttr(this, 'value' , val);
					}
				});
				return self;
			}
		},
		css : function(key, val) {
			var self = this;
			if (key === undefined) {
				return _getCssList(self.attr('style'));
			}
			if (typeof key === 'object') {
				_each(key, function(k, v) {
					self.css(k, v);
				});
				return self;
			}
			if (val === undefined) {
				if (self.length < 1) {
					return '';
				}
				return self[0].style[_toCamel(key)] || _computedCss(self[0], key) || '';
			}
			self.each(function() {
				this.style[_toCamel(key)] = val;
			});
			return self;
		},
		width : function(val) {
			var self = this;
			if (val === undefined) {
				if (self.length < 1) {
					return 0;
				}
				return self[0].offsetWidth;
			}
			return self.css('width', _addUnit(val));
		},
		height : function(val) {
			var self = this;
			if (val === undefined) {
				if (self.length < 1) {
					return 0;
				}
				return self[0].offsetHeight;
			}
			return self.css('height', _addUnit(val));
		},
		opacity : function(val) {
			this.each(function() {
				if (this.style.opacity === undefined) {
					this.style.filter = val == 1 ? '' : 'alpha(opacity=' + (val * 100) + ')';
				} else {
					this.style.opacity = val == 1 ? '' : val;
				}
			});
			return this;
		},
		data : function(key, val) {
			var self = this;
			key = 'kindeditor_data_' + key;
			if (val === undefined) {
				if (self.length < 1) {
					return null;
				}
				return self[0][key];
			}
			this.each(function() {
				this[key] = val;
			});
			return self;
		},
		pos : function() {
			var self = this, node = self[0], x = 0, y = 0;
			if (node) {
				if (node.getBoundingClientRect) {
					var box = node.getBoundingClientRect(),
						pos = _getScrollPos(self.doc);
					x = box.left + pos.x;
					y = box.top + pos.y;
				} else {
					while (node) {
						x += node.offsetLeft;
						y += node.offsetTop;
						node = node.offsetParent;
					}
				}
			}
			return {x : _round(x), y : _round(y)};
		},
		clone : function(bool) {
			if (this.length < 1) {
				return new KNode([]);
			}
			return new KNode(this[0].cloneNode(bool));
		},
		append : function(expr) {
			this.each(function() {
				if (this.appendChild) {
					this.appendChild(_get(expr));
				}
			});
			return this;
		},
		appendTo : function(expr) {
			this.each(function() {
				_get(expr).appendChild(this);
			});
			return this;
		},
		before : function(expr) {
			this.each(function() {
				this.parentNode.insertBefore(_get(expr), this);
			});
			return this;
		},
		after : function(expr) {
			this.each(function() {
				if (this.nextSibling) {
					this.parentNode.insertBefore(_get(expr), this.nextSibling);
				} else {
					this.parentNode.appendChild(_get(expr));
				}
			});
			return this;
		},
		replaceWith : function(expr) {
			var nodes = [];
			this.each(function(i, node) {
				_unbind(node);
				var newNode = _get(expr);
				node.parentNode.replaceChild(newNode, node);
				nodes.push(newNode);
			});
			return K(nodes);
		},
		empty : function() {
			var self = this;
			self.each(function(i, node) {
				var child = node.firstChild;
				while (child) {
					if (!node.parentNode) {
						return;
					}
					var next = child.nextSibling;
					child.parentNode.removeChild(child);
					child = next;
				}
			});
			return self;
		},
		remove : function(keepChilds) {
			var self = this;
			self.each(function(i, node) {
				if (!node.parentNode) {
					return;
				}
				_unbind(node);
				if (keepChilds) {
					var child = node.firstChild;
					while (child) {
						var next = child.nextSibling;
						node.parentNode.insertBefore(child, node);
						child = next;
					}
				}
				node.parentNode.removeChild(node);
				delete self[i];
			});
			self.length = 0;
			return self;
		},
		show : function(val) {
			var self = this;
			if (val === undefined) {
				val = self._originDisplay || '';
			}
			if (self.css('display') != 'none') {
				return self;
			}
			return self.css('display', val);
		},
		hide : function() {
			var self = this;
			if (self.length < 1) {
				return self;
			}
			self._originDisplay = self[0].style.display;
			return self.css('display', 'none');
		},
		outer : function() {
			var self = this;
			if (self.length < 1) {
				return '';
			}
			var div = self.doc.createElement('div'), html;
			div.appendChild(self[0].cloneNode(true));
			html = _formatHtml(div.innerHTML);
			div = null;
			return html;
		},
		isSingle : function() {
			return !!_SINGLE_TAG_MAP[this.name];
		},
		isInline : function() {
			return !!_INLINE_TAG_MAP[this.name];
		},
		isBlock : function() {
			return !!_BLOCK_TAG_MAP[this.name];
		},
		isStyle : function() {
			return !!_STYLE_TAG_MAP[this.name];
		},
		isControl : function() {
			return !!_CONTROL_TAG_MAP[this.name];
		},
		contains : function(otherNode) {
			if (this.length < 1) {
				return false;
			}
			return _contains(this[0], _get(otherNode));
		},
		parent : function() {
			if (this.length < 1) {
				return null;
			}
			var node = this[0].parentNode;
			return node ? new KNode(node) : null;
		},
		children : function() {
			if (this.length < 1) {
				return new KNode([]);
			}
			var list = [], child = this[0].firstChild;
			while (child) {
				if (child.nodeType != 3 || _trim(child.nodeValue) !== '') {
					list.push(child);
				}
				child = child.nextSibling;
			}
			return new KNode(list);
		},
		first : function() {
			var list = this.children();
			return list.length > 0 ? list.eq(0) : null;
		},
		last : function() {
			var list = this.children();
			return list.length > 0 ? list.eq(list.length - 1) : null;
		},
		index : function() {
			if (this.length < 1) {
				return -1;
			}
			var i = -1, sibling = this[0];
			while (sibling) {
				i++;
				sibling = sibling.previousSibling;
			}
			return i;
		},
		prev : function() {
			if (this.length < 1) {
				return null;
			}
			var node = this[0].previousSibling;
			return node ? new KNode(node) : null;
		},
		next : function() {
			if (this.length < 1) {
				return null;
			}
			var node = this[0].nextSibling;
			return node ? new KNode(node) : null;
		},
		scan : function(fn, order) {
			if (this.length < 1) {
				return;
			}
			order = (order === undefined) ? true : order;
			function walk(node) {
				var n = order ? node.firstChild : node.lastChild;
				while (n) {
					var next = order ? n.nextSibling : n.previousSibling;
					if (fn(n) === false) {
						return false;
					}
					if (walk(n) === false) {
						return false;
					}
					n = next;
				}
			}
			walk(this[0]);
			return this;
		}
	});
	_each(('blur,focus,focusin,focusout,load,resize,scroll,unload,click,dblclick,' +
		'mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,' +
		'change,select,submit,keydown,keypress,keyup,error,contextmenu').split(','), function(i, type) {
		KNode.prototype[type] = function(fn) {
			return fn ? this.bind(type, fn) : this.fire(type);
		};
	});
	var _K = K;
	K = function(expr, root) {
		if (expr === undefined || expr === null) {
			return;
		}
		function newNode(node) {
			if (!node[0]) {
				node = [];
			}
			return new KNode(node);
		}
		if (typeof expr === 'string') {
			if (root) {
				root = _get(root);
			}
			var length = expr.length;
			if (expr.charAt(0) === '@') {
				expr = expr.substr(1);
			}
			if (expr.length !== length || /<.+>/.test(expr)) {
				var doc = root ? root.ownerDocument || root : document,
					div = doc.createElement('div'), list = [];
				div.innerHTML = '<img id="__kindeditor_temp_tag__" width="0" height="0" style="display:none;" />' + expr;
				for (var i = 0, len = div.childNodes.length; i < len; i++) {
					var child = div.childNodes[i];
					if (child.id == '__kindeditor_temp_tag__') {
						continue;
					}
					list.push(child);
				}
				return newNode(list);
			}
			return newNode(_queryAll(expr, root));
		}
		if (expr && expr.constructor === KNode) {
			return expr;
		}
		if (expr.toArray) {
			expr = expr.toArray();
		}
		if (_isArray(expr)) {
			return newNode(expr);
		}
		return newNode(_toArray(arguments));
	};
	_each(_K, function(key, val) {
		K[key] = val;
	});
	K.NodeClass = KNode;
	window.KindEditor = K;


	var _START_TO_START = 0,
		_START_TO_END = 1,
		_END_TO_END = 2,
		_END_TO_START = 3,
		_BOOKMARK_ID = 0;
	function _updateCollapsed(range) {
		range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
		return range;
	}
	function _copyAndDelete(range, isCopy, isDelete) {
		var doc = range.doc, nodeList = [];
		function splitTextNode(node, startOffset, endOffset) {
			var length = node.nodeValue.length, centerNode;
			if (isCopy) {
				var cloneNode = node.cloneNode(true);
				if (startOffset > 0) {
					centerNode = cloneNode.splitText(startOffset);
				} else {
					centerNode = cloneNode;
				}
				if (endOffset < length) {
					centerNode.splitText(endOffset - startOffset);
				}
			}
			if (isDelete) {
				var center = node;
				if (startOffset > 0) {
					center = node.splitText(startOffset);
					range.setStart(node, startOffset);
				}
				if (endOffset < length) {
					var right = center.splitText(endOffset - startOffset);
					range.setEnd(right, 0);
				}
				nodeList.push(center);
			}
			return centerNode;
		}
		function removeNodes() {
			if (isDelete) {
				range.up().collapse(true);
			}
			for (var i = 0, len = nodeList.length; i < len; i++) {
				var node = nodeList[i];
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}
		}
		var copyRange = range.cloneRange().down();
		var start = -1, incStart = -1, incEnd = -1, end = -1,
			ancestor = range.commonAncestor(), frag = doc.createDocumentFragment();
		if (ancestor.nodeType == 3) {
			var textNode = splitTextNode(ancestor, range.startOffset, range.endOffset);
			if (isCopy) {
				frag.appendChild(textNode);
			}
			removeNodes();
			return isCopy ? frag : range;
		}
		function extractNodes(parent, frag) {
			var node = parent.firstChild, nextNode;
			while (node) {
				var testRange = new KRange(doc).selectNode(node);
				start = testRange.compareBoundaryPoints(_START_TO_END, range);
				if (start >= 0 && incStart <= 0) {
					incStart = testRange.compareBoundaryPoints(_START_TO_START, range);
				}
				if (incStart >= 0 && incEnd <= 0) {
					incEnd = testRange.compareBoundaryPoints(_END_TO_END, range);
				}
				if (incEnd >= 0 && end <= 0) {
					end = testRange.compareBoundaryPoints(_END_TO_START, range);
				}
				if (end >= 0) {
					return false;
				}
				nextNode = node.nextSibling;
				if (start > 0) {
					if (node.nodeType == 1) {
						if (incStart >= 0 && incEnd <= 0) {
							if (isCopy) {
								frag.appendChild(node.cloneNode(true));
							}
							if (isDelete) {
								nodeList.push(node);
							}
						} else {
							var childFlag;
							if (isCopy) {
								childFlag = node.cloneNode(false);
								frag.appendChild(childFlag);
							}
							if (extractNodes(node, childFlag) === false) {
								return false;
							}
						}
					} else if (node.nodeType == 3) {
						var textNode;
						if (node == copyRange.startContainer) {
							textNode = splitTextNode(node, copyRange.startOffset, node.nodeValue.length);
						} else if (node == copyRange.endContainer) {
							textNode = splitTextNode(node, 0, copyRange.endOffset);
						} else {
							textNode = splitTextNode(node, 0, node.nodeValue.length);
						}
						if (isCopy) {
							try {
								frag.appendChild(textNode);
							} catch(e) {}
						}
					}
				}
				node = nextNode;
			}
		}
		extractNodes(ancestor, frag);
		if (isDelete) {
			range.up().collapse(true);
		}
		for (var i = 0, len = nodeList.length; i < len; i++) {
			var node = nodeList[i];
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}
		return isCopy ? frag : range;
	}

	function _moveToElementText(range, el) {
		var node = el;
		while (node) {
			var knode = K(node);
			if (knode.name == 'marquee' || knode.name == 'select') {
				return;
			}
			node = node.parentNode;
		}
		try {
			range.moveToElementText(el);
		} catch(e) {}
	}

	function _getStartEnd(rng, isStart) {
		var doc = rng.parentElement().ownerDocument,
			pointRange = rng.duplicate();
		pointRange.collapse(isStart);
		var parent = pointRange.parentElement(),
			nodes = parent.childNodes;
		if (nodes.length === 0) {
			return {node: parent.parentNode, offset: K(parent).index()};
		}
		var startNode = doc, startPos = 0, cmp = -1;
		var testRange = rng.duplicate();
		_moveToElementText(testRange, parent);
		for (var i = 0, len = nodes.length; i < len; i++) {
			var node = nodes[i];
			cmp = testRange.compareEndPoints('StartToStart', pointRange);
			if (cmp === 0) {
				return {node: node.parentNode, offset: i};
			}
			if (node.nodeType == 1) {
				var nodeRange = rng.duplicate(), dummy, knode = K(node), newNode = node;
				if (knode.isControl()) {
					dummy = doc.createElement('span');
					knode.after(dummy);
					newNode = dummy;
					startPos += knode.text().replace(/\r\n|\n|\r/g, '').length;
				}
				_moveToElementText(nodeRange, newNode);
				testRange.setEndPoint('StartToEnd', nodeRange);
				if (cmp > 0) {
					startPos += nodeRange.text.replace(/\r\n|\n|\r/g, '').length;
				} else {
					startPos = 0;
				}
				if (dummy) {
					K(dummy).remove();
				}
			} else if (node.nodeType == 3) {
				testRange.moveStart('character', node.nodeValue.length);
				startPos += node.nodeValue.length;
			}
			if (cmp < 0) {
				startNode = node;
			}
		}
		if (cmp < 0 && startNode.nodeType == 1) {
			return {node: parent, offset: K(parent.lastChild).index() + 1};
		}
		if (cmp > 0) {
			while (startNode.nextSibling && startNode.nodeType == 1) {
				startNode = startNode.nextSibling;
			}
		}
		testRange = rng.duplicate();
		_moveToElementText(testRange, parent);
		testRange.setEndPoint('StartToEnd', pointRange);
		startPos -= testRange.text.replace(/\r\n|\n|\r/g, '').length;
		if (cmp > 0 && startNode.nodeType == 3) {
			var prevNode = startNode.previousSibling;
			while (prevNode && prevNode.nodeType == 3) {
				startPos -= prevNode.nodeValue.length;
				prevNode = prevNode.previousSibling;
			}
		}
		return {node: startNode, offset: startPos};
	}

	function _getEndRange(node, offset) {
		var doc = node.ownerDocument || node,
			range = doc.body.createTextRange();
		if (doc == node) {
			range.collapse(true);
			return range;
		}
		if (node.nodeType == 1 && node.childNodes.length > 0) {
			var children = node.childNodes, isStart, child;
			if (offset === 0) {
				child = children[0];
				isStart = true;
			} else {
				child = children[offset - 1];
				isStart = false;
			}
			if (!child) {
				return range;
			}
			if (K(child).name === 'head') {
				if (offset === 1) {
					isStart = true;
				}
				if (offset === 2) {
					isStart = false;
				}
				range.collapse(isStart);
				return range;
			}
			if (child.nodeType == 1) {
				var kchild = K(child), span;
				if (kchild.isControl()) {
					span = doc.createElement('span');
					if (isStart) {
						kchild.before(span);
					} else {
						kchild.after(span);
					}
					child = span;
				}
				_moveToElementText(range, child);
				range.collapse(isStart);
				if (span) {
					K(span).remove();
				}
				return range;
			}
			node = child;
			offset = isStart ? 0 : child.nodeValue.length;
		}
		var dummy = doc.createElement('span');
		K(node).before(dummy);
		_moveToElementText(range, dummy);
		range.moveStart('character', offset);
		K(dummy).remove();
		return range;
	}

	function _toRange(rng) {
		var doc, range;
		function tr2td(start) {
			if (K(start.node).name == 'tr') {
				start.node = start.node.cells[start.offset];
				start.offset = 0;
			}
		}
		if (_IERANGE) {
			if (rng.item) {
				doc = _getDoc(rng.item(0));
				range = new KRange(doc);
				range.selectNode(rng.item(0));
				return range;
			}
			doc = rng.parentElement().ownerDocument;
			var start = _getStartEnd(rng, true),
				end = _getStartEnd(rng, false);
			tr2td(start);
			tr2td(end);
			range = new KRange(doc);
			range.setStart(start.node, start.offset);
			range.setEnd(end.node, end.offset);
			return range;
		}
		var startContainer = rng.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		range = new KRange(doc);
		range.setStart(startContainer, rng.startOffset);
		range.setEnd(rng.endContainer, rng.endOffset);
		return range;
	}


	function KRange(doc) {
		this.init(doc);
	}
	_extend(KRange, {
		init : function(doc) {
			var self = this;
			self.startContainer = doc;
			self.startOffset = 0;
			self.endContainer = doc;
			self.endOffset = 0;
			self.collapsed = true;
			self.doc = doc;
		},
		commonAncestor : function() {
			function getParents(node) {
				var parents = [];
				while (node) {
					parents.push(node);
					node = node.parentNode;
				}
				return parents;
			}
			var parentsA = getParents(this.startContainer),
				parentsB = getParents(this.endContainer),
				i = 0, lenA = parentsA.length, lenB = parentsB.length, parentA, parentB;
			while (++i) {
				parentA = parentsA[lenA - i];
				parentB = parentsB[lenB - i];
				if (!parentA || !parentB || parentA !== parentB) {
					break;
				}
			}
			return parentsA[lenA - i + 1];
		},
		setStart : function(node, offset) {
			var self = this, doc = self.doc;
			self.startContainer = node;
			self.startOffset = offset;
			if (self.endContainer === doc) {
				self.endContainer = node;
				self.endOffset = offset;
			}
			return _updateCollapsed(this);
		},
		setEnd : function(node, offset) {
			var self = this, doc = self.doc;
			self.endContainer = node;
			self.endOffset = offset;
			if (self.startContainer === doc) {
				self.startContainer = node;
				self.startOffset = offset;
			}
			return _updateCollapsed(this);
		},
		setStartBefore : function(node) {
			return this.setStart(node.parentNode || this.doc, K(node).index());
		},
		setStartAfter : function(node) {
			return this.setStart(node.parentNode || this.doc, K(node).index() + 1);
		},
		setEndBefore : function(node) {
			return this.setEnd(node.parentNode || this.doc, K(node).index());
		},
		setEndAfter : function(node) {
			return this.setEnd(node.parentNode || this.doc, K(node).index() + 1);
		},
		selectNode : function(node) {
			return this.setStartBefore(node).setEndAfter(node);
		},
		selectNodeContents : function(node) {
			var knode = K(node);
			if (knode.type == 3 || knode.isSingle()) {
				return this.selectNode(node);
			}
			var children = knode.children();
			if (children.length > 0) {
				return this.setStartBefore(children[0]).setEndAfter(children[children.length - 1]);
			}
			return this.setStart(node, 0).setEnd(node, 0);
		},
		collapse : function(toStart) {
			if (toStart) {
				return this.setEnd(this.startContainer, this.startOffset);
			}
			return this.setStart(this.endContainer, this.endOffset);
		},
		compareBoundaryPoints : function(how, range) {
			var rangeA = this.get(), rangeB = range.get();
			if (_IERANGE) {
				var arr = {};
				arr[_START_TO_START] = 'StartToStart';
				arr[_START_TO_END] = 'EndToStart';
				arr[_END_TO_END] = 'EndToEnd';
				arr[_END_TO_START] = 'StartToEnd';
				var cmp = rangeA.compareEndPoints(arr[how], rangeB);
				if (cmp !== 0) {
					return cmp;
				}
				var nodeA, nodeB, nodeC, posA, posB;
				if (how === _START_TO_START || how === _END_TO_START) {
					nodeA = this.startContainer;
					posA = this.startOffset;
				}
				if (how === _START_TO_END || how === _END_TO_END) {
					nodeA = this.endContainer;
					posA = this.endOffset;
				}
				if (how === _START_TO_START || how === _START_TO_END) {
					nodeB = range.startContainer;
					posB = range.startOffset;
				}
				if (how === _END_TO_END || how === _END_TO_START) {
					nodeB = range.endContainer;
					posB = range.endOffset;
				}
				if (nodeA === nodeB) {
					var diff = posA - posB;
					return diff > 0 ? 1 : (diff < 0 ? -1 : 0);
				}
				nodeC = nodeB;
				while (nodeC && nodeC.parentNode !== nodeA) {
					nodeC = nodeC.parentNode;
				}
				if (nodeC) {
					return K(nodeC).index() >= posA ? -1 : 1;
				}
				nodeC = nodeA;
				while (nodeC && nodeC.parentNode !== nodeB) {
					nodeC = nodeC.parentNode;
				}
				if (nodeC) {
					return K(nodeC).index() >= posB ? 1 : -1;
				}
				nodeC = K(nodeB).next();
				if (nodeC && nodeC.contains(nodeA)) {
					return 1;
				}
				nodeC = K(nodeA).next();
				if (nodeC && nodeC.contains(nodeB)) {
					return -1;
				}
			} else {
				return rangeA.compareBoundaryPoints(how, rangeB);
			}
		},
		cloneRange : function() {
			return new KRange(this.doc).setStart(this.startContainer, this.startOffset).setEnd(this.endContainer, this.endOffset);
		},
		toString : function() {
			var rng = this.get(), str = _IERANGE ? rng.text : rng.toString();
			return str.replace(/\r\n|\n|\r/g, '');
		},
		cloneContents : function() {
			return _copyAndDelete(this, true, false);
		},
		deleteContents : function() {
			return _copyAndDelete(this, false, true);
		},
		extractContents : function() {
			return _copyAndDelete(this, true, true);
		},
		insertNode : function(node) {
			var self = this,
				sc = self.startContainer, so = self.startOffset,
				ec = self.endContainer, eo = self.endOffset,
				firstChild, lastChild, c, nodeCount = 1;
			if (node.nodeName.toLowerCase() === '#document-fragment') {
				firstChild = node.firstChild;
				lastChild = node.lastChild;
				nodeCount = node.childNodes.length;
			}
			if (sc.nodeType == 1) {
				c = sc.childNodes[so];
				if (c) {
					sc.insertBefore(node, c);
					if (sc === ec) {
						eo += nodeCount;
					}
				} else {
					sc.appendChild(node);
				}
			} else if (sc.nodeType == 3) {
				if (so === 0) {
					sc.parentNode.insertBefore(node, sc);
					if (sc.parentNode === ec) {
						eo += nodeCount;
					}
				} else if (so >= sc.nodeValue.length) {
					if (sc.nextSibling) {
						sc.parentNode.insertBefore(node, sc.nextSibling);
					} else {
						sc.parentNode.appendChild(node);
					}
				} else {
					if (so > 0) {
						c = sc.splitText(so);
					} else {
						c = sc;
					}
					sc.parentNode.insertBefore(node, c);
					if (sc === ec) {
						ec = c;
						eo -= so;
					}
				}
			}
			if (firstChild) {
				self.setStartBefore(firstChild).setEndAfter(lastChild);
			} else {
				self.selectNode(node);
			}
			if (self.compareBoundaryPoints(_END_TO_END, self.cloneRange().setEnd(ec, eo)) >= 1) {
				return self;
			}
			return self.setEnd(ec, eo);
		},
		surroundContents : function(node) {
			node.appendChild(this.extractContents());
			return this.insertNode(node).selectNode(node);
		},
		isControl : function() {
			var self = this,
				sc = self.startContainer, so = self.startOffset,
				ec = self.endContainer, eo = self.endOffset, rng;
			return sc.nodeType == 1 && sc === ec && so + 1 === eo && K(sc.childNodes[so]).isControl();
		},
		get : function(hasControlRange) {
			var self = this, doc = self.doc, node, rng;
			if (!_IERANGE) {
				rng = doc.createRange();
				try {
					rng.setStart(self.startContainer, self.startOffset);
					rng.setEnd(self.endContainer, self.endOffset);
				} catch (e) {}
				return rng;
			}
			if (hasControlRange && self.isControl()) {
				rng = doc.body.createControlRange();
				rng.addElement(self.startContainer.childNodes[self.startOffset]);
				return rng;
			}
			var range = self.cloneRange().down();
			rng = doc.body.createTextRange();
			rng.setEndPoint('StartToStart', _getEndRange(range.startContainer, range.startOffset));
			rng.setEndPoint('EndToStart', _getEndRange(range.endContainer, range.endOffset));
			return rng;
		},
		html : function() {
			return K(this.cloneContents()).outer();
		},
		down : function() {
			var self = this;
			function downPos(node, pos, isStart) {
				if (node.nodeType != 1) {
					return;
				}
				var children = K(node).children();
				if (children.length === 0) {
					return;
				}
				var left, right, child, offset;
				if (pos > 0) {
					left = children.eq(pos - 1);
				}
				if (pos < children.length) {
					right = children.eq(pos);
				}
				if (left && left.type == 3) {
					child = left[0];
					offset = child.nodeValue.length;
				}
				if (right && right.type == 3) {
					child = right[0];
					offset = 0;
				}
				if (!child) {
					return;
				}
				if (isStart) {
					self.setStart(child, offset);
				} else {
					self.setEnd(child, offset);
				}
			}
			downPos(self.startContainer, self.startOffset, true);
			downPos(self.endContainer, self.endOffset, false);
			return self;
		},
		up : function() {
			var self = this;
			function upPos(node, pos, isStart) {
				if (node.nodeType != 3) {
					return;
				}
				if (pos === 0) {
					if (isStart) {
						self.setStartBefore(node);
					} else {
						self.setEndBefore(node);
					}
				} else if (pos == node.nodeValue.length) {
					if (isStart) {
						self.setStartAfter(node);
					} else {
						self.setEndAfter(node);
					}
				}
			}
			upPos(self.startContainer, self.startOffset, true);
			upPos(self.endContainer, self.endOffset, false);
			return self;
		},
		enlarge : function(toBlock) {
			var self = this;
			self.up();
			function enlargePos(node, pos, isStart) {
				var knode = K(node), parent;
				if (knode.type == 3 || _NOSPLIT_TAG_MAP[knode.name] || !toBlock && knode.isBlock()) {
					return;
				}
				if (pos === 0) {
					while (!knode.prev()) {
						parent = knode.parent();
						if (!parent || _NOSPLIT_TAG_MAP[parent.name] || !toBlock && parent.isBlock()) {
							break;
						}
						knode = parent;
					}
					if (isStart) {
						self.setStartBefore(knode[0]);
					} else {
						self.setEndBefore(knode[0]);
					}
				} else if (pos == knode.children().length) {
					while (!knode.next()) {
						parent = knode.parent();
						if (!parent || _NOSPLIT_TAG_MAP[parent.name] || !toBlock && parent.isBlock()) {
							break;
						}
						knode = parent;
					}
					if (isStart) {
						self.setStartAfter(knode[0]);
					} else {
						self.setEndAfter(knode[0]);
					}
				}
			}
			enlargePos(self.startContainer, self.startOffset, true);
			enlargePos(self.endContainer, self.endOffset, false);
			return self;
		},
		shrink : function() {
			var self = this, child, collapsed = self.collapsed;
			while (self.startContainer.nodeType == 1 && (child = self.startContainer.childNodes[self.startOffset]) && child.nodeType == 1 && !K(child).isSingle()) {
				self.setStart(child, 0);
			}
			if (collapsed) {
				return self.collapse(collapsed);
			}
			while (self.endContainer.nodeType == 1 && self.endOffset > 0 && (child = self.endContainer.childNodes[self.endOffset - 1]) && child.nodeType == 1 && !K(child).isSingle()) {
				self.setEnd(child, child.childNodes.length);
			}
			return self;
		},
		createBookmark : function(serialize) {
			var self = this, doc = self.doc, endNode,
				startNode = K('<span style="display:none;"></span>', doc)[0];
			startNode.id = '__kindeditor_bookmark_start_' + (_BOOKMARK_ID++) + '__';
			if (!self.collapsed) {
				endNode = startNode.cloneNode(true);
				endNode.id = '__kindeditor_bookmark_end_' + (_BOOKMARK_ID++) + '__';
			}
			if (endNode) {
				self.cloneRange().collapse(false).insertNode(endNode).setEndBefore(endNode);
			}
			self.insertNode(startNode).setStartAfter(startNode);
			return {
				start : serialize ? '#' + startNode.id : startNode,
				end : endNode ? (serialize ? '#' + endNode.id : endNode) : null
			};
		},
		moveToBookmark : function(bookmark) {
			var self = this, doc = self.doc,
				start = K(bookmark.start, doc), end = bookmark.end ? K(bookmark.end, doc) : null;
			if (!start || start.length < 1) {
				return self;
			}
			self.setStartBefore(start[0]);
			start.remove();
			if (end && end.length > 0) {
				self.setEndBefore(end[0]);
				end.remove();
			} else {
				self.collapse(true);
			}
			return self;
		},
		dump : function() {
			console.log('--------------------');
			console.log(this.startContainer.nodeType == 3 ? this.startContainer.nodeValue : this.startContainer, this.startOffset);
			console.log(this.endContainer.nodeType == 3 ? this.endContainer.nodeValue : this.endContainer, this.endOffset);
		}
	});
	function _range(mixed) {
		if (!mixed.nodeName) {
			return mixed.constructor === KRange ? mixed : _toRange(mixed);
		}
		return new KRange(mixed);
	}
	K.RangeClass = KRange;
	K.range = _range;
	K.START_TO_START = _START_TO_START;
	K.START_TO_END = _START_TO_END;
	K.END_TO_END = _END_TO_END;
	K.END_TO_START = _END_TO_START;



	function _nativeCommand(doc, key, val) {
		try {
			doc.execCommand(key, false, val);
		} catch(e) {}
	}

	function _nativeCommandValue(doc, key) {
		var val = '';
		try {
			val = doc.queryCommandValue(key);
		} catch (e) {}
		if (typeof val !== 'string') {
			val = '';
		}
		return val;
	}

	function _getSel(doc) {
		var win = _getWin(doc);
		return _IERANGE ? doc.selection : win.getSelection();
	}

	function _getRng(doc) {
		var sel = _getSel(doc), rng;
		try {
			if (sel.rangeCount > 0) {
				rng = sel.getRangeAt(0);
			} else {
				rng = sel.createRange();
			}
		} catch(e) {}
		if (_IERANGE && (!rng || (!rng.item && rng.parentElement().ownerDocument !== doc))) {
			return null;
		}
		return rng;
	}

	function _singleKeyMap(map) {
		var newMap = {}, arr, v;
		_each(map, function(key, val) {
			arr = key.split(',');
			for (var i = 0, len = arr.length; i < len; i++) {
				v = arr[i];
				newMap[v] = val;
			}
		});
		return newMap;
	}

	function _hasAttrOrCss(knode, map) {
		return _hasAttrOrCssByKey(knode, map, '*') || _hasAttrOrCssByKey(knode, map);
	}
	function _hasAttrOrCssByKey(knode, map, mapKey) {
		mapKey = mapKey || knode.name;
		if (knode.type !== 1) {
			return false;
		}
		var newMap = _singleKeyMap(map);
		if (!newMap[mapKey]) {
			return false;
		}
		var arr = newMap[mapKey].split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			var key = arr[i];
			if (key === '*') {
				return true;
			}
			var match = /^(\.?)([^=]+)(?:=([^=]*))?$/.exec(key);
			var method = match[1] ? 'css' : 'attr';
			key = match[2];
			var val = match[3] || '';
			if (val === '' && knode[method](key) !== '') {
				return true;
			}
			if (val !== '' && knode[method](key) === val) {
				return true;
			}
		}
		return false;
	}

	function _removeAttrOrCss(knode, map) {
		if (knode.type != 1) {
			return;
		}
		_removeAttrOrCssByKey(knode, map, '*');
		_removeAttrOrCssByKey(knode, map);
	}
	function _removeAttrOrCssByKey(knode, map, mapKey) {
		mapKey = mapKey || knode.name;
		if (knode.type !== 1) {
			return;
		}
		var newMap = _singleKeyMap(map);
		if (!newMap[mapKey]) {
			return;
		}
		var arr = newMap[mapKey].split(','), allFlag = false;
		for (var i = 0, len = arr.length; i < len; i++) {
			var key = arr[i];
			if (key === '*') {
				allFlag = true;
				break;
			}
			var match = /^(\.?)([^=]+)(?:=([^=]*))?$/.exec(key);
			key = match[2];
			if (match[1]) {
				key = _toCamel(key);
				if (knode[0].style[key]) {
					knode[0].style[key] = '';
				}
			} else {
				knode.removeAttr(key);
			}
		}
		if (allFlag) {
			knode.remove(true);
		}
	}

	function _getInnerNode(knode) {
		var inner = knode;
		while (inner.first()) {
			inner = inner.first();
		}
		return inner;
	}

	function _isEmptyNode(knode) {
		if (knode.type != 1 || knode.isSingle()) {
			return false;
		}
		return knode.html().replace(/<[^>]+>/g, '') === '';
	}




	function _mergeWrapper(a, b) {
		a = a.clone(true);
		var lastA = _getInnerNode(a), childA = a, merged = false;
		while (b) {
			while (childA) {
				if (childA.name === b.name) {
					_mergeAttrs(childA, b.attr(), b.css());
					merged = true;
				}
				childA = childA.first();
			}
			if (!merged) {
				lastA.append(b.clone(false));
			}
			merged = false;
			b = b.first();
		}
		return a;
	}

	function _wrapNode(knode, wrapper) {
		wrapper = wrapper.clone(true);
		if (knode.type == 3) {
			_getInnerNode(wrapper).append(knode.clone(false));
			knode.replaceWith(wrapper);
			return wrapper;
		}
		var nodeWrapper = knode, child;
		while ((child = knode.first()) && child.children().length == 1) {
			knode = child;
		}
		child = knode.first();
		var frag = knode.doc.createDocumentFragment();
		while (child) {
			frag.appendChild(child[0]);
			child = child.next();
		}
		wrapper = _mergeWrapper(nodeWrapper, wrapper);
		if (frag.firstChild) {
			_getInnerNode(wrapper).append(frag);
		}
		nodeWrapper.replaceWith(wrapper);
		return wrapper;
	}

	function _mergeAttrs(knode, attrs, styles) {
		_each(attrs, function(key, val) {
			if (key !== 'style') {
				knode.attr(key, val);
			}
		});
		_each(styles, function(key, val) {
			knode.css(key, val);
		});
	}

	function _inPreElement(knode) {
		while (knode && knode.name != 'body') {
			if (_PRE_TAG_MAP[knode.name] || knode.name == 'div' && knode.hasClass('ke-script')) {
				return true;
			}
			knode = knode.parent();
		}
		return false;
	}

	function KCmd(range) {
		this.init(range);
	}
	_extend(KCmd, {
		init : function(range) {
			var self = this, doc = range.doc;
			self.doc = doc;
			self.win = _getWin(doc);
			self.sel = _getSel(doc);
			self.range = range;
		},
		selection : function(forceReset) {
			var self = this, doc = self.doc, rng = _getRng(doc);
			self.sel = _getSel(doc);
			if (rng) {
				self.range = _range(rng);
				if (K(self.range.startContainer).name == 'html') {
					self.range.selectNodeContents(doc.body).collapse(false);
				}
				return self;
			}
			if (forceReset) {
				self.range.selectNodeContents(doc.body).collapse(false);
			}
			return self;
		},
		select : function(hasDummy) {
			hasDummy = _undef(hasDummy, true);
			var self = this, sel = self.sel, range = self.range.cloneRange().shrink(),
				sc = range.startContainer, so = range.startOffset,
				ec = range.endContainer, eo = range.endOffset,
				doc = _getDoc(sc), win = self.win, rng, hasU200b = false;
			if (hasDummy && sc.nodeType == 1 && range.collapsed) {
				if (_IERANGE) {
					var dummy = K('<span>&nbsp;</span>', doc);
					range.insertNode(dummy[0]);
					rng = doc.body.createTextRange();
					try {
						rng.moveToElementText(dummy[0]);
					} catch(ex) {}
					rng.collapse(false);
					rng.select();
					dummy.remove();
					win.focus();
					return self;
				}
				if (_WEBKIT) {
					var children = sc.childNodes;
					if (K(sc).isInline() || so > 0 && K(children[so - 1]).isInline() || children[so] && K(children[so]).isInline()) {
						range.insertNode(doc.createTextNode('\u200B'));
						hasU200b = true;
					}
				}
			}
			if (_IERANGE) {
				try {
					rng = range.get(true);
					rng.select();
				} catch(e) {}
			} else {
				if (hasU200b) {
					range.collapse(false);
				}
				rng = range.get(true);
				sel.removeAllRanges();
				sel.addRange(rng);
				if (doc !== document) {
					var pos = K(rng.endContainer).pos();
					win.scrollTo(pos.x, pos.y);
				}
			}
			win.focus();
			return self;
		},
		wrap : function(val) {
			var self = this, doc = self.doc, range = self.range, wrapper;
			wrapper = K(val, doc);
			if (range.collapsed) {
				range.shrink();
				range.insertNode(wrapper[0]).selectNodeContents(wrapper[0]);
				return self;
			}
			if (wrapper.isBlock()) {
				var copyWrapper = wrapper.clone(true), child = copyWrapper;
				while (child.first()) {
					child = child.first();
				}
				child.append(range.extractContents());
				range.insertNode(copyWrapper[0]).selectNode(copyWrapper[0]);
				return self;
			}
			range.enlarge();
			var bookmark = range.createBookmark(), ancestor = range.commonAncestor(), isStart = false;
			K(ancestor).scan(function(node) {
				if (!isStart && node == bookmark.start) {
					isStart = true;
					return;
				}
				if (isStart) {
					if (node == bookmark.end) {
						return false;
					}
					var knode = K(node);
					if (_inPreElement(knode)) {
						return;
					}
					if (knode.type == 3 && _trim(node.nodeValue).length > 0) {
						var parent;
						while ((parent = knode.parent()) && parent.isStyle() && parent.children().length == 1) {
							knode = parent;
						}
						_wrapNode(knode, wrapper);
					}
				}
			});
			range.moveToBookmark(bookmark);
			return self;
		},
		split : function(isStart, map) {
			var range = this.range, doc = range.doc;
			var tempRange = range.cloneRange().collapse(isStart);
			var node = tempRange.startContainer, pos = tempRange.startOffset,
				parent = node.nodeType == 3 ? node.parentNode : node,
				needSplit = false, knode;
			while (parent && parent.parentNode) {
				knode = K(parent);
				if (map) {
					if (!knode.isStyle()) {
						break;
					}
					if (!_hasAttrOrCss(knode, map)) {
						break;
					}
				} else {
					if (_NOSPLIT_TAG_MAP[knode.name]) {
						break;
					}
				}
				needSplit = true;
				parent = parent.parentNode;
			}
			if (needSplit) {
				var dummy = doc.createElement('span');
				range.cloneRange().collapse(!isStart).insertNode(dummy);
				if (isStart) {
					tempRange.setStartBefore(parent.firstChild).setEnd(node, pos);
				} else {
					tempRange.setStart(node, pos).setEndAfter(parent.lastChild);
				}
				var frag = tempRange.extractContents(),
					first = frag.firstChild, last = frag.lastChild;
				if (isStart) {
					tempRange.insertNode(frag);
					range.setStartAfter(last).setEndBefore(dummy);
				} else {
					parent.appendChild(frag);
					range.setStartBefore(dummy).setEndBefore(first);
				}
				var dummyParent = dummy.parentNode;
				if (dummyParent == range.endContainer) {
					var prev = K(dummy).prev(), next = K(dummy).next();
					if (prev && next && prev.type == 3 && next.type == 3) {
						range.setEnd(prev[0], prev[0].nodeValue.length);
					} else if (!isStart) {
						range.setEnd(range.endContainer, range.endOffset - 1);
					}
				}
				dummyParent.removeChild(dummy);
			}
			return this;
		},
		remove : function(map) {
			var self = this, doc = self.doc, range = self.range;
			range.enlarge();
			if (range.startOffset === 0) {
				var ksc = K(range.startContainer), parent;
				while ((parent = ksc.parent()) && parent.isStyle() && parent.children().length == 1) {
					ksc = parent;
				}
				range.setStart(ksc[0], 0);
				ksc = K(range.startContainer);
				if (ksc.isBlock()) {
					_removeAttrOrCss(ksc, map);
				}
				var kscp = ksc.parent();
				if (kscp && kscp.isBlock()) {
					_removeAttrOrCss(kscp, map);
				}
			}
			var sc, so;
			if (range.collapsed) {
				self.split(true, map);
				sc = range.startContainer;
				so = range.startOffset;
				if (so > 0) {
					var sb = K(sc.childNodes[so - 1]);
					if (sb && _isEmptyNode(sb)) {
						sb.remove();
						range.setStart(sc, so - 1);
					}
				}
				var sa = K(sc.childNodes[so]);
				if (sa && _isEmptyNode(sa)) {
					sa.remove();
				}
				if (_isEmptyNode(sc)) {
					range.startBefore(sc);
					sc.remove();
				}
				range.collapse(true);
				return self;
			}
			self.split(true, map);
			self.split(false, map);
			var startDummy = doc.createElement('span'), endDummy = doc.createElement('span');
			range.cloneRange().collapse(false).insertNode(endDummy);
			range.cloneRange().collapse(true).insertNode(startDummy);
			var nodeList = [], cmpStart = false;
			K(range.commonAncestor()).scan(function(node) {
				if (!cmpStart && node == startDummy) {
					cmpStart = true;
					return;
				}
				if (node == endDummy) {
					return false;
				}
				if (cmpStart) {
					nodeList.push(node);
				}
			});
			K(startDummy).remove();
			K(endDummy).remove();
			sc = range.startContainer;
			so = range.startOffset;
			var ec = range.endContainer, eo = range.endOffset;
			if (so > 0) {
				var startBefore = K(sc.childNodes[so - 1]);
				if (startBefore && _isEmptyNode(startBefore)) {
					startBefore.remove();
					range.setStart(sc, so - 1);
					if (sc == ec) {
						range.setEnd(ec, eo - 1);
					}
				}
				var startAfter = K(sc.childNodes[so]);
				if (startAfter && _isEmptyNode(startAfter)) {
					startAfter.remove();
					if (sc == ec) {
						range.setEnd(ec, eo - 1);
					}
				}
			}
			var endAfter = K(ec.childNodes[range.endOffset]);
			if (endAfter && _isEmptyNode(endAfter)) {
				endAfter.remove();
			}
			var bookmark = range.createBookmark(true);
			_each(nodeList, function(i, node) {
				_removeAttrOrCss(K(node), map);
			});
			range.moveToBookmark(bookmark);
			return self;
		},
		commonNode : function(map) {
			var range = this.range;
			var ec = range.endContainer, eo = range.endOffset,
				node = (ec.nodeType == 3 || eo === 0) ? ec : ec.childNodes[eo - 1];
			function find(node) {
				var child = node, parent = node;
				while (parent) {
					if (_hasAttrOrCss(K(parent), map)) {
						return K(parent);
					}
					parent = parent.parentNode;
				}
				while (child && (child = child.lastChild)) {
					if (_hasAttrOrCss(K(child), map)) {
						return K(child);
					}
				}
				return null;
			}
			var cNode = find(node);
			if (cNode) {
				return cNode;
			}
			if (node.nodeType == 1 || (ec.nodeType == 3 && eo === 0)) {
				var prev = K(node).prev();
				if (prev) {
					return find(prev);
				}
			}
			return null;
		},
		commonAncestor : function(tagName) {
			var range = this.range,
				sc = range.startContainer, so = range.startOffset,
				ec = range.endContainer, eo = range.endOffset,
				startNode = (sc.nodeType == 3 || so === 0) ? sc : sc.childNodes[so - 1],
				endNode = (ec.nodeType == 3 || eo === 0) ? ec : ec.childNodes[eo - 1];
			function find(node) {
				while (node) {
					if (node.nodeType == 1) {
						if (node.tagName.toLowerCase() === tagName) {
							return node;
						}
					}
					node = node.parentNode;
				}
				return null;
			}
			var start = find(startNode), end = find(endNode);
			if (start && end && start === end) {
				return K(start);
			}
			return null;
		},
		state : function(key) {
			var self = this, doc = self.doc, bool = false;
			try {
				bool = doc.queryCommandState(key);
			} catch (e) {}
			return bool;
		},
		val : function(key) {
			var self = this, doc = self.doc, range = self.range;
			function lc(val) {
				return val.toLowerCase();
			}
			key = lc(key);
			var val = '', knode;
			if (key === 'fontfamily' || key === 'fontname') {
				val = _nativeCommandValue(doc, 'fontname');
				val = val.replace(/['"]/g, '');
				return lc(val);
			}
			if (key === 'formatblock') {
				val = _nativeCommandValue(doc, key);
				if (val === '') {
					knode = self.commonNode({'h1,h2,h3,h4,h5,h6,p,div,pre,address' : '*'});
					if (knode) {
						val = knode.name;
					}
				}
				if (val === 'Normal') {
					val = 'p';
				}
				return lc(val);
			}
			if (key === 'fontsize') {
				knode = self.commonNode({'*' : '.font-size'});
				if (knode) {
					val = knode.css('font-size');
				}
				return lc(val);
			}
			if (key === 'forecolor') {
				knode = self.commonNode({'*' : '.color'});
				if (knode) {
					val = knode.css('color');
				}
				val = _toHex(val);
				if (val === '') {
					val = 'default';
				}
				return lc(val);
			}
			if (key === 'hilitecolor') {
				knode = self.commonNode({'*' : '.background-color'});
				if (knode) {
					val = knode.css('background-color');
				}
				val = _toHex(val);
				if (val === '') {
					val = 'default';
				}
				return lc(val);
			}
			return val;
		},
		toggle : function(wrapper, map) {
			var self = this;
			if (self.commonNode(map)) {
				self.remove(map);
			} else {
				self.wrap(wrapper);
			}
			return self.select();
		},
		bold : function() {
			return this.toggle('<strong></strong>', {
				span : '.font-weight=bold',
				strong : '*',
				b : '*'
			});
		},
		italic : function() {
			return this.toggle('<em></em>', {
				span : '.font-style=italic',
				em : '*',
				i : '*'
			});
		},
		underline : function() {
			return this.toggle('<u></u>', {
				span : '.text-decoration=underline',
				u : '*'
			});
		},
		strikethrough : function() {
			return this.toggle('<s></s>', {
				span : '.text-decoration=line-through',
				s : '*'
			});
		},
		forecolor : function(val) {
			return this.wrap('<span style="color:' + val + ';"></span>').select();
		},
		hilitecolor : function(val) {
			return this.wrap('<span style="background-color:' + val + ';"></span>').select();
		},
		fontsize : function(val) {
			return this.wrap('<span style="font-size:' + val + ';"></span>').select();
		},
		fontname : function(val) {
			return this.fontfamily(val);
		},
		fontfamily : function(val) {
			return this.wrap('<span style="font-family:' + val + ';"></span>').select();
		},
		removeformat : function() {
			var map = {
					'*' : '.font-weight,.font-style,.text-decoration,.color,.background-color,.font-size,.font-family,.text-indent'
				},
				tags = _STYLE_TAG_MAP;
			_each(tags, function(key, val) {
				map[key] = '*';
			});
			this.remove(map);
			return this.select();
		},
		inserthtml : function(val, quickMode) {
			var self = this, range = self.range;
			if (val === '') {
				return self;
			}
			function pasteHtml(range, val) {
				val = '<img id="__kindeditor_temp_tag__" width="0" height="0" style="display:none;" />' + val;
				var rng = range.get();
				if (rng.item) {
					rng.item(0).outerHTML = val;
				} else {
					rng.pasteHTML(val);
				}
				var temp = range.doc.getElementById('__kindeditor_temp_tag__');
				temp.parentNode.removeChild(temp);
				var newRange = _toRange(rng);
				range.setEnd(newRange.endContainer, newRange.endOffset);
				range.collapse(false);
				self.select(false);
			}
			function insertHtml(range, val) {
				var doc = range.doc,
					frag = doc.createDocumentFragment();
				K('@' + val, doc).each(function() {
					frag.appendChild(this);
				});
				range.deleteContents();
				range.insertNode(frag);
				range.collapse(false);
				self.select(false);
			}
			if (_IERANGE && quickMode) {
				try {
					pasteHtml(range, val);
				} catch(e) {
					insertHtml(range, val);
				}
				return self;
			}
			insertHtml(range, val);
			return self;
		},
		hr : function() {
			return this.inserthtml('<hr />');
		},
		print : function() {
			this.win.print();
			return this;
		},
		insertimage : function(url, title, width, height, border, align) {
			title = _undef(title, '');
			border = _undef(border, 0);
			var html = '<img src="' + _escape(url) + '" data-ke-src="' + _escape(url) + '" ';
			if (width) {
				html += 'width="' + _escape(width) + '" ';
			}
			if (height) {
				html += 'height="' + _escape(height) + '" ';
			}
			if (title) {
				html += 'title="' + _escape(title) + '" ';
			}
			if (align) {
				html += 'align="' + _escape(align) + '" ';
			}
			html += 'alt="' + _escape(title) + '" ';
			html += '/>';
			return this.inserthtml(html);
		},
		createlink : function(url, type) {
			var self = this, doc = self.doc, range = self.range;
			self.select();
			var a = self.commonNode({ a : '*' });
			if (a && !range.isControl()) {
				range.selectNode(a.get());
				self.select();
			}
			var html = '<a href="' + _escape(url) + '" data-ke-src="' + _escape(url) + '" ';
			if (type) {
				html += ' target="' + _escape(type) + '"';
			}
			if (range.collapsed) {
				html += '>' + _escape(url) + '</a>';
				return self.inserthtml(html);
			}
			if (range.isControl()) {
				var node = K(range.startContainer.childNodes[range.startOffset]);
				html += '></a>';
				node.after(K(html, doc));
				node.next().append(node);
				range.selectNode(node[0]);
				return self.select();
			}
			function setAttr(node, url, type) {
				K(node).attr('href', url).attr('data-ke-src', url);
				if (type) {
					K(node).attr('target', type);
				} else {
					K(node).removeAttr('target');
				}
			}
			var sc = range.startContainer, so = range.startOffset,
				ec = range.endContainer, eo = range.endOffset;
			if (sc.nodeType == 1 && sc === ec && so + 1 === eo) {
				var child = sc.childNodes[so];
				if (child.nodeName.toLowerCase() == 'a') {
					setAttr(child, url, type);
					return self;
				}
			}
			_nativeCommand(doc, 'createlink', '__kindeditor_temp_url__');
			K('a[href="__kindeditor_temp_url__"]', doc).each(function() {
				setAttr(this, url, type);
			});
			return self;
		},
		unlink : function() {
			var self = this, doc = self.doc, range = self.range;
			self.select();
			if (range.collapsed) {
				var a = self.commonNode({ a : '*' });
				if (a) {
					range.selectNode(a.get());
					self.select();
				}
				_nativeCommand(doc, 'unlink', null);
				if (_WEBKIT && K(range.startContainer).name === 'img') {
					var parent = K(range.startContainer).parent();
					if (parent.name === 'a') {
						parent.remove(true);
					}
				}
			} else {
				_nativeCommand(doc, 'unlink', null);
			}
			return self;
		}
	});
	_each(('formatblock,selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
		'insertunorderedlist,indent,outdent,subscript,superscript').split(','), function(i, name) {
		KCmd.prototype[name] = function(val) {
			var self = this;
			self.select();
			_nativeCommand(self.doc, name, val);
			if (_IERANGE && _inArray(name, 'justifyleft,justifycenter,justifyright,justifyfull'.split(',')) >= 0) {
				self.selection();
			}
			if (!_IERANGE || _inArray(name, 'formatblock,selectall,insertorderedlist,insertunorderedlist'.split(',')) >= 0) {
				self.selection();
			}
			return self;
		};
	});
	_each('cut,copy,paste'.split(','), function(i, name) {
		KCmd.prototype[name] = function() {
			var self = this;
			if (!self.doc.queryCommandSupported(name)) {
				throw 'not supported';
			}
			self.select();
			_nativeCommand(self.doc, name, null);
			return self;
		};
	});
	function _cmd(mixed) {
		if (mixed.nodeName) {
			var doc = _getDoc(mixed);
			mixed = _range(doc).selectNodeContents(doc.body).collapse(false);
		}
		return new KCmd(mixed);
	}
	K.CmdClass = KCmd;
	K.cmd = _cmd;


	function _drag(options) {
		var moveEl = options.moveEl,
			moveFn = options.moveFn,
			clickEl = options.clickEl || moveEl,
			beforeDrag = options.beforeDrag,
			iframeFix = options.iframeFix === undefined ? true : options.iframeFix;
		var docs = [document];
		if (iframeFix) {
			K('iframe').each(function() {
				var src = _formatUrl(this.src || '', 'absolute');
				if (/^https?:\/\//.test(src)) {
					return;
				}
				var doc;
				try {
					doc = _iframeDoc(this);
				} catch(e) {}
				if (doc) {
					var pos = K(this).pos();
					K(doc).data('pos-x', pos.x);
					K(doc).data('pos-y', pos.y);
					docs.push(doc);
				}
			});
		}
		clickEl.mousedown(function(e) {
			if(e.button !== 0 && e.button !== 1) {
				return;
			}
			e.stopPropagation();
			var self = clickEl.get(),
				x = _removeUnit(moveEl.css('left')),
				y = _removeUnit(moveEl.css('top')),
				width = moveEl.width(),
				height = moveEl.height(),
				pageX = e.pageX,
				pageY = e.pageY;
			if (beforeDrag) {
				beforeDrag();
			}
			function moveListener(e) {
				e.preventDefault();
				var kdoc = K(_getDoc(e.target));
				var diffX = _round((kdoc.data('pos-x') || 0) + e.pageX - pageX);
				var diffY = _round((kdoc.data('pos-y') || 0) + e.pageY - pageY);
				moveFn.call(clickEl, x, y, width, height, diffX, diffY);
			}
			function selectListener(e) {
				e.preventDefault();
			}
			function upListener(e) {
				e.preventDefault();
				K(docs).unbind('mousemove', moveListener)
					.unbind('mouseup', upListener)
					.unbind('selectstart', selectListener);
				if (self.releaseCapture) {
					self.releaseCapture();
				}
			}
			K(docs).mousemove(moveListener)
				.mouseup(upListener)
				.bind('selectstart', selectListener);
			if (self.setCapture) {
				self.setCapture();
			}
		});
	}


	function KWidget(options) {
		this.init(options);
	}
	_extend(KWidget, {
		init : function(options) {
			var self = this;
			self.name = options.name || '';
			self.doc = options.doc || document;
			self.win = _getWin(self.doc);
			self.x = _addUnit(options.x);
			self.y = _addUnit(options.y);
			self.z = options.z;
			self.width = _addUnit(options.width);
			self.height = _addUnit(options.height);
			self.div = K('<div style="display:block;"></div>');
			self.options = options;
			self._alignEl = options.alignEl;
			if (self.width) {
				self.div.css('width', self.width);
			}
			if (self.height) {
				self.div.css('height', self.height);
			}
			if (self.z) {
				self.div.css({
					position : 'absolute',
					left : self.x,
					top : self.y,
					'z-index' : self.z
				});
			}
			if (self.z && (self.x === undefined || self.y === undefined)) {
				self.autoPos(self.width, self.height);
			}
			if (options.cls) {
				self.div.addClass(options.cls);
			}
			if (options.shadowMode) {
				self.div.addClass('ke-shadow');
			}
			if (options.css) {
				self.div.css(options.css);
			}
			if (options.src) {
				K(options.src).replaceWith(self.div);
			} else {
				K(self.doc.body).append(self.div);
			}
			if (options.html) {
				self.div.html(options.html);
			}
			if (options.autoScroll) {
				if (_IE && _V < 7 || _QUIRKS) {
					var scrollPos = _getScrollPos();
					K(self.win).bind('scroll', function(e) {
						var pos = _getScrollPos(),
							diffX = pos.x - scrollPos.x,
							diffY = pos.y - scrollPos.y;
						self.pos(_removeUnit(self.x) + diffX, _removeUnit(self.y) + diffY, false);
					});
				} else {
					self.div.css('position', 'fixed');
				}
			}
		},
		pos : function(x, y, updateProp) {
			var self = this;
			updateProp = _undef(updateProp, true);
			if (x !== null) {
				x = x < 0 ? 0 : _addUnit(x);
				self.div.css('left', x);
				if (updateProp) {
					self.x = x;
				}
			}
			if (y !== null) {
				y = y < 0 ? 0 : _addUnit(y);
				self.div.css('top', y);
				if (updateProp) {
					self.y = y;
				}
			}
			return self;
		},
		autoPos : function(width, height) {
			var x, y, self = this,
				w = _removeUnit(width) || 0,
				h = _removeUnit(height) || 0,
				scrollPos = _getScrollPos();
			if (self._alignEl) {
				var knode = K(self._alignEl),
					pos = knode.pos(),
					diffX = _round(knode[0].clientWidth / 2 - w / 2),
					diffY = _round(knode[0].clientHeight / 2 - h / 2);
				x = diffX < 0 ? pos.x : pos.x + diffX;
				y = diffY < 0 ? pos.y : pos.y + diffY;
			} else {
				var docEl = _docElement(self.doc);
				x = _round(scrollPos.x + (docEl.clientWidth - w) / 2);
				y = _round(scrollPos.y + (docEl.clientHeight - h) / 2);
			}
			if (!(_IE && _V < 7 || _QUIRKS)) {
				x -= scrollPos.x;
				y -= scrollPos.y;
			}
			return self.pos(x, y);
		},
		remove : function() {
			var self = this;
			if (_IE && _V < 7 || _QUIRKS) {
				K(self.win).unbind('scroll');
			}
			self.div.remove();
			_each(self, function(i) {
				self[i] = null;
			});
			return this;
		},
		show : function() {
			this.div.show();
			return this;
		},
		hide : function() {
			this.div.hide();
			return this;
		},
		draggable : function(options) {
			var self = this;
			options = options || {};
			options.moveEl = self.div;
			options.moveFn = function(x, y, width, height, diffX, diffY) {
				if ((x = x + diffX) < 0) {
					x = 0;
				}
				if ((y = y + diffY) < 0) {
					y = 0;
				}
				self.pos(x, y);
			};
			_drag(options);
			return self;
		}
	});
	function _widget(options) {
		return new KWidget(options);
	}
	K.WidgetClass = KWidget;
	K.widget = _widget;


	function _iframeDoc(iframe) {
		iframe = _get(iframe);
		return iframe.contentDocument || iframe.contentWindow.document;
	}
	var html, _direction = '';
	if ((html = document.getElementsByTagName('html'))) {
		_direction = html[0].dir;
	}
	function _getInitHtml(themesPath, bodyClass, cssPath, cssData) {
		var arr = [
			(_direction === '' ? '<html>' : '<html dir="' + _direction + '">'),
			'<head><meta charset="utf-8" /><title></title>',
			'<style>',
			'html {margin:0;padding:0;}',
			'body {margin:0;padding:5px;}',
			'body, td {font:12px/1.5 "sans serif",tahoma,verdana,helvetica;}',
			'body, p, div {word-wrap: break-word;}',
			'p {margin:5px 0;}',
			'table {border-collapse:collapse;}',
			'img {border:0;}',
			'noscript {display:none;}',
			'table.ke-zeroborder td {border:1px dotted #AAA;}',
			'img.ke-flash {',
			'	border:1px solid #AAA;',
			'	background-image:url(' + themesPath + 'common/flash.gif);',
			'	background-position:center center;',
			'	background-repeat:no-repeat;',
			'	width:100px;',
			'	height:100px;',
			'}',
			'img.ke-rm {',
			'	border:1px solid #AAA;',
			'	background-image:url(' + themesPath + 'common/rm.gif);',
			'	background-position:center center;',
			'	background-repeat:no-repeat;',
			'	width:100px;',
			'	height:100px;',
			'}',
			'img.ke-media {',
			'	border:1px solid #AAA;',
			'	background-image:url(' + themesPath + 'common/media.gif);',
			'	background-position:center center;',
			'	background-repeat:no-repeat;',
			'	width:100px;',
			'	height:100px;',
			'}',
			'img.ke-anchor {',
			'	border:1px dashed #666;',
			'	width:16px;',
			'	height:16px;',
			'}',
			'.ke-script, .ke-noscript, .ke-display-none {',
			'	display:none;',
			'	font-size:0;',
			'	width:0;',
			'	height:0;',
			'}',
			'.ke-pagebreak {',
			'	border:1px dotted #AAA;',
			'	font-size:0;',
			'	height:2px;',
			'}',
			'</style>'
		];
		if (!_isArray(cssPath)) {
			cssPath = [cssPath];
		}
		_each(cssPath, function(i, path) {
			if (path) {
				arr.push('<link href="' + path + '" rel="stylesheet" />');
			}
		});
		if (cssData) {
			arr.push('<style>' + cssData + '</style>');
		}
		arr.push('</head><body ' + (bodyClass ? 'class="' + bodyClass + '"' : '') + '></body></html>');
		return arr.join('\n');
	}
	function _elementVal(knode, val) {
		if (knode.hasVal()) {
			if (val === undefined) {
				var html = knode.val();
				html = html.replace(/(<(?:p|p\s[^>]*)>) *(<\/p>)/ig, '');
				return html;
			}
			return knode.val(val);
		}
		return knode.html(val);
	}


	function KEdit(options) {
		this.init(options);
	}
	_extend(KEdit, KWidget, {
		init : function(options) {
			var self = this;
			KEdit.parent.init.call(self, options);
			self.srcElement = K(options.srcElement);
			self.div.addClass('ke-edit');
			self.designMode = _undef(options.designMode, true);
			self.beforeGetHtml = options.beforeGetHtml;
			self.beforeSetHtml = options.beforeSetHtml;
			self.afterSetHtml = options.afterSetHtml;
			var themesPath = _undef(options.themesPath, ''),
				bodyClass = options.bodyClass,
				cssPath = options.cssPath,
				cssData = options.cssData,
				isDocumentDomain = location.protocol != 'res:' && location.host.replace(/:\d+/, '') !== document.domain,
				srcScript = ('document.open();' +
					(isDocumentDomain ? 'document.domain="' + document.domain + '";' : '') +
					'document.close();'),
				iframeSrc = _IE ? ' src="javascript:void(function(){' + encodeURIComponent(srcScript) + '}())"' : '';
			self.iframe = K('<iframe class="ke-edit-iframe" hidefocus="true" frameborder="0"' + iframeSrc + '></iframe>').css('width', '100%');
			self.textarea = K('<textarea class="ke-edit-textarea" hidefocus="true"></textarea>').css('width', '100%');
			self.tabIndex = isNaN(parseInt(options.tabIndex, 10)) ? self.srcElement.attr('tabindex') : parseInt(options.tabIndex, 10);
			self.iframe.attr('tabindex', self.tabIndex);
			self.textarea.attr('tabindex', self.tabIndex);
			if (self.width) {
				self.setWidth(self.width);
			}
			if (self.height) {
				self.setHeight(self.height);
			}
			if (self.designMode) {
				self.textarea.hide();
			} else {
				self.iframe.hide();
			}
			function ready() {
				var doc = _iframeDoc(self.iframe);
				doc.open();
				if (isDocumentDomain) {
					doc.domain = document.domain;
				}
				doc.write(_getInitHtml(themesPath, bodyClass, cssPath, cssData));
				doc.close();
				self.win = self.iframe[0].contentWindow;
				self.doc = doc;
				var cmd = _cmd(doc);
				self.afterChange(function(e) {
					cmd.selection();
				});
				if (_WEBKIT) {
					K(doc).click(function(e) {
						if (K(e.target).name === 'img') {
							cmd.selection(true);
							cmd.range.selectNode(e.target);
							cmd.select();
						}
					});
				}
				if (_IE) {
					self._mousedownHandler = function() {
						var newRange = cmd.range.cloneRange();
						newRange.shrink();
						if (newRange.isControl()) {
							self.blur();
						}
					};
					K(document).mousedown(self._mousedownHandler);
					K(doc).keydown(function(e) {
						if (e.which == 8) {
							cmd.selection();
							var rng = cmd.range;
							if (rng.isControl()) {
								rng.collapse(true);
								K(rng.startContainer.childNodes[rng.startOffset]).remove();
								e.preventDefault();
							}
						}
					});
				}
				self.cmd = cmd;
				self.html(_elementVal(self.srcElement));
				if (_IE) {
					doc.body.disabled = true;
					doc.body.contentEditable = true;
					doc.body.removeAttribute('disabled');
				} else {
					doc.designMode = 'on';
				}
				if (options.afterCreate) {
					options.afterCreate.call(self);
				}
			}
			if (isDocumentDomain) {
				self.iframe.bind('load', function(e) {
					self.iframe.unbind('load');
					if (_IE) {
						ready();
					} else {
						setTimeout(ready, 0);
					}
				});
			}
			self.div.append(self.iframe);
			self.div.append(self.textarea);
			self.srcElement.hide();
			!isDocumentDomain && ready();
		},
		setWidth : function(val) {
			var self = this;
			val = _addUnit(val);
			self.width = val;
			self.div.css('width', val);
			return self;
		},
		setHeight : function(val) {
			var self = this;
			val = _addUnit(val);
			self.height = val;
			self.div.css('height', val);
			self.iframe.css('height', val);
			if ((_IE && _V < 8) || _QUIRKS) {
				val = _addUnit(_removeUnit(val) - 2);
			}
			self.textarea.css('height', val);
			return self;
		},
		remove : function() {
			var self = this, doc = self.doc;
			K(doc.body).unbind();
			K(doc).unbind();
			K(self.win).unbind();
			if (self._mousedownHandler) {
				K(document).unbind('mousedown', self._mousedownHandler);
			}
			_elementVal(self.srcElement, self.html());
			self.srcElement.show();
			self.iframe.unbind();
			self.textarea.unbind();
			KEdit.parent.remove.call(self);
		},
		html : function(val, isFull) {
			var self = this, doc = self.doc;
			if (self.designMode) {
				var body = doc.body;
				if (val === undefined) {
					if (isFull) {
						val = '<!doctype html><html>' + body.parentNode.innerHTML + '</html>';
					} else {
						val = body.innerHTML;
					}
					if (self.beforeGetHtml) {
						val = self.beforeGetHtml(val);
					}
					if (_GECKO && val == '<br />') {
						val = '';
					}
					return val;
				}
				if (self.beforeSetHtml) {
					val = self.beforeSetHtml(val);
				}
				if (_IE && _V >= 9) {
					val = val.replace(/(<.*?checked=")checked(".*>)/ig, '$1$2');
				}
				K(body).html(val);
				if (self.afterSetHtml) {
					self.afterSetHtml();
				}
				return self;
			}
			if (val === undefined) {
				return self.textarea.val();
			}
			self.textarea.val(val);
			return self;
		},
		design : function(bool) {
			var self = this, val;
			if (bool === undefined ? !self.designMode : bool) {
				if (!self.designMode) {
					val = self.html();
					self.designMode = true;
					self.textarea.hide();
					self.html(val);
					var iframe = self.iframe;
					var height = _removeUnit(self.height);
					iframe.height(height - 2);
					iframe.show();
					setTimeout(function() {
						iframe.height(height);
					}, 0);
				}
			} else {
				if (self.designMode) {
					val = self.html();
					self.designMode = false;
					self.html(val);
					self.iframe.hide();
					self.textarea.show();
				}
			}
			return self.focus();
		},
		focus : function() {
			var self = this;
			self.designMode ? self.win.focus() : self.textarea[0].focus();
			return self;
		},
		blur : function() {
			var self = this;
			if (_IE) {
				var input = K('<input type="text" style="float:left;width:0;height:0;padding:0;margin:0;border:0;" value="" />', self.div);
				self.div.append(input);
				input[0].focus();
				input.remove();
			} else {
				self.designMode ? self.win.blur() : self.textarea[0].blur();
			}
			return self;
		},
		afterChange : function(fn) {
			var self = this, doc = self.doc, body = doc.body;
			K(doc).keyup(function(e) {
				if (!e.ctrlKey && !e.altKey && _CHANGE_KEY_MAP[e.which]) {
					fn(e);
				}
			});
			K(doc).mouseup(fn).contextmenu(fn);
			K(self.win).blur(fn);
			function timeoutHandler(e) {
				setTimeout(function() {
					fn(e);
				}, 1);
			}
			K(body).bind('paste', timeoutHandler);
			K(body).bind('cut', timeoutHandler);
			return self;
		}
	});
	function _edit(options) {
		return new KEdit(options);
	}
	K.EditClass = KEdit;
	K.edit = _edit;
	K.iframeDoc = _iframeDoc;


	function _selectToolbar(name, fn) {
		var self = this,
			knode = self.get(name);
		if (knode) {
			if (knode.hasClass('ke-disabled')) {
				return;
			}
			fn(knode);
		}
	}


	function KToolbar(options) {
		this.init(options);
	}
	_extend(KToolbar, KWidget, {
		init : function(options) {
			var self = this;
			KToolbar.parent.init.call(self, options);
			self.disableMode = _undef(options.disableMode, false);
			self.noDisableItemMap = _toMap(_undef(options.noDisableItems, []));
			self._itemMap = {};
			self.div.addClass('ke-toolbar').bind('contextmenu,mousedown,mousemove', function(e) {
				e.preventDefault();
			}).attr('unselectable', 'on');
			function find(target) {
				var knode = K(target);
				if (knode.hasClass('ke-outline')) {
					return knode;
				}
				if (knode.hasClass('ke-toolbar-icon')) {
					return knode.parent();
				}
			}
			function hover(e, method) {
				var knode = find(e.target);
				if (knode) {
					if (knode.hasClass('ke-disabled')) {
						return;
					}
					if (knode.hasClass('ke-selected')) {
						return;
					}
					knode[method]('ke-on');
				}
			}
			self.div.mouseover(function(e) {
				hover(e, 'addClass');
			})
				.mouseout(function(e) {
					hover(e, 'removeClass');
				})
				.click(function(e) {
					var knode = find(e.target);
					if (knode) {
						if (knode.hasClass('ke-disabled')) {
							return;
						}
						self.options.click.call(this, e, knode.attr('data-name'));
					}
				});
		},
		get : function(name) {
			if (this._itemMap[name]) {
				return this._itemMap[name];
			}
			return (this._itemMap[name] = K('span.ke-icon-' + name, this.div).parent());
		},
		select : function(name) {
			_selectToolbar.call(this, name, function(knode) {
				knode.addClass('ke-selected');
			});
			return self;
		},
		unselect : function(name) {
			_selectToolbar.call(this, name, function(knode) {
				knode.removeClass('ke-selected').removeClass('ke-on');
			});
			return self;
		},
		enable : function(name) {
			var self = this,
				knode = name.get ? name : self.get(name);
			if (knode) {
				knode.removeClass('ke-disabled');
				knode.opacity(1);
			}
			return self;
		},
		disable : function(name) {
			var self = this,
				knode = name.get ? name : self.get(name);
			if (knode) {
				knode.removeClass('ke-selected').addClass('ke-disabled');
				knode.opacity(0.5);
			}
			return self;
		},
		disableAll : function(bool, noDisableItems) {
			var self = this, map = self.noDisableItemMap, item;
			if (noDisableItems) {
				map = _toMap(noDisableItems);
			}
			if (bool === undefined ? !self.disableMode : bool) {
				K('span.ke-outline', self.div).each(function() {
					var knode = K(this),
						name = knode[0].getAttribute('data-name', 2);
					if (!map[name]) {
						self.disable(knode);
					}
				});
				self.disableMode = true;
			} else {
				K('span.ke-outline', self.div).each(function() {
					var knode = K(this),
						name = knode[0].getAttribute('data-name', 2);
					if (!map[name]) {
						self.enable(knode);
					}
				});
				self.disableMode = false;
			}
			return self;
		}
	});
	function _toolbar(options) {
		return new KToolbar(options);
	}
	K.ToolbarClass = KToolbar;
	K.toolbar = _toolbar;



	function KMenu(options) {
		this.init(options);
	}
	_extend(KMenu, KWidget, {
		init : function(options) {
			var self = this;
			options.z = options.z || 811213;
			KMenu.parent.init.call(self, options);
			self.centerLineMode = _undef(options.centerLineMode, true);
			self.div.addClass('ke-menu').bind('click,mousedown', function(e){
				e.stopPropagation();
			}).attr('unselectable', 'on');
		},
		addItem : function(item) {
			var self = this;
			if (item.title === '-') {
				self.div.append(K('<div class="ke-menu-separator"></div>'));
				return;
			}
			var itemDiv = K('<div class="ke-menu-item" unselectable="on"></div>'),
				leftDiv = K('<div class="ke-inline-block ke-menu-item-left"></div>'),
				rightDiv = K('<div class="ke-inline-block ke-menu-item-right"></div>'),
				height = _addUnit(item.height),
				iconClass = _undef(item.iconClass, '');
			self.div.append(itemDiv);
			if (height) {
				itemDiv.css('height', height);
				rightDiv.css('line-height', height);
			}
			var centerDiv;
			if (self.centerLineMode) {
				centerDiv = K('<div class="ke-inline-block ke-menu-item-center"></div>');
				if (height) {
					centerDiv.css('height', height);
				}
			}
			itemDiv.mouseover(function(e) {
				K(this).addClass('ke-menu-item-on');
				if (centerDiv) {
					centerDiv.addClass('ke-menu-item-center-on');
				}
			})
				.mouseout(function(e) {
					K(this).removeClass('ke-menu-item-on');
					if (centerDiv) {
						centerDiv.removeClass('ke-menu-item-center-on');
					}
				})
				.click(function(e) {
					item.click.call(K(this));
					e.stopPropagation();
				})
				.append(leftDiv);
			if (centerDiv) {
				itemDiv.append(centerDiv);
			}
			itemDiv.append(rightDiv);
			if (item.checked) {
				iconClass = 'ke-icon-checked';
			}
			if (iconClass !== '') {
				leftDiv.html('<span class="ke-inline-block ke-toolbar-icon ke-toolbar-icon-url ' + iconClass + '"></span>');
			}
			rightDiv.html(item.title);
			return self;
		},
		remove : function() {
			var self = this;
			if (self.options.beforeRemove) {
				self.options.beforeRemove.call(self);
			}
			K('.ke-menu-item', self.div[0]).unbind();
			KMenu.parent.remove.call(self);
			return self;
		}
	});
	function _menu(options) {
		return new KMenu(options);
	}
	K.MenuClass = KMenu;
	K.menu = _menu;



	function KColorPicker(options) {
		this.init(options);
	}
	_extend(KColorPicker, KWidget, {
		init : function(options) {
			var self = this;
			options.z = options.z || 811213;
			KColorPicker.parent.init.call(self, options);
			var colors = options.colors || [
				['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
				['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
				['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
				['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
			];
			self.selectedColor = (options.selectedColor || '').toLowerCase();
			self._cells = [];
			self.div.addClass('ke-colorpicker').bind('click,mousedown', function(e){
				e.stopPropagation();
			}).attr('unselectable', 'on');
			var table = self.doc.createElement('table');
			self.div.append(table);
			table.className = 'ke-colorpicker-table';
			table.cellPadding = 0;
			table.cellSpacing = 0;
			table.border = 0;
			var row = table.insertRow(0), cell = row.insertCell(0);
			cell.colSpan = colors[0].length;
			self._addAttr(cell, '', 'ke-colorpicker-cell-top');
			for (var i = 0; i < colors.length; i++) {
				row = table.insertRow(i + 1);
				for (var j = 0; j < colors[i].length; j++) {
					cell = row.insertCell(j);
					self._addAttr(cell, colors[i][j], 'ke-colorpicker-cell');
				}
			}
		},
		_addAttr : function(cell, color, cls) {
			var self = this;
			cell = K(cell).addClass(cls);
			if (self.selectedColor === color.toLowerCase()) {
				cell.addClass('ke-colorpicker-cell-selected');
			}
			cell.attr('title', color || self.options.noColor);
			cell.mouseover(function(e) {
				K(this).addClass('ke-colorpicker-cell-on');
			});
			cell.mouseout(function(e) {
				K(this).removeClass('ke-colorpicker-cell-on');
			});
			cell.click(function(e) {
				e.stop();
				self.options.click.call(K(this), color);
			});
			if (color) {
				cell.append(K('<div class="ke-colorpicker-cell-color" unselectable="on"></div>').css('background-color', color));
			} else {
				cell.html(self.options.noColor);
			}
			K(cell).attr('unselectable', 'on');
			self._cells.push(cell);
		},
		remove : function() {
			var self = this;
			_each(self._cells, function() {
				this.unbind();
			});
			KColorPicker.parent.remove.call(self);
			return self;
		}
	});
	function _colorpicker(options) {
		return new KColorPicker(options);
	}
	K.ColorPickerClass = KColorPicker;
	K.colorpicker = _colorpicker;


	!function(e,t){var i=function(){var e={};return t.apply(e,arguments),e.moxie};"function"==typeof define&&define.amd?define("moxie",[],i):"object"==typeof module&&module.exports?module.exports=i():e.moxie=i()}(this||window,function(){!function(e,t){"use strict";function i(e,t){for(var i,n=[],r=0;r<e.length;++r){if(i=s[e[r]]||o(e[r]),!i)throw"module definition dependecy not found: "+e[r];n.push(i)}t.apply(null,n)}function n(e,n,r){if("string"!=typeof e)throw"invalid module definition, module id must be defined and be a string";if(n===t)throw"invalid module definition, dependencies must be specified";if(r===t)throw"invalid module definition, definition function must be specified";i(n,function(){s[e]=r.apply(null,arguments)})}function r(e){return!!s[e]}function o(t){for(var i=e,n=t.split(/[.\/]/),r=0;r<n.length;++r){if(!i[n[r]])return;i=i[n[r]]}return i}function a(i){for(var n=0;n<i.length;n++){for(var r=e,o=i[n],a=o.split(/[.\/]/),u=0;u<a.length-1;++u)r[a[u]]===t&&(r[a[u]]={}),r=r[a[u]];r[a[a.length-1]]=s[o]}}var s={};n("moxie/core/utils/Basic",[],function(){function e(e){var t;return e===t?"undefined":null===e?"null":e.nodeType?"node":{}.toString.call(e).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()}function t(){return s(!1,!1,arguments)}function i(){return s(!0,!1,arguments)}function n(){return s(!1,!0,arguments)}function r(){return s(!0,!0,arguments)}function o(t){switch(e(t)){case"array":return s(!1,!0,[[],t]);case"object":return s(!1,!0,[{},t]);default:return t}}function a(i){switch(e(i)){case"array":return Array.prototype.slice.call(i);case"object":return t({},i)}return i}function s(t,i,n){var r,o=n[0];return c(n,function(n,u){u>0&&c(n,function(n,u){var c=-1!==h(e(n),["array","object"]);return n===r||t&&o[u]===r?!0:(c&&i&&(n=a(n)),e(o[u])===e(n)&&c?s(t,i,[o[u],n]):o[u]=n,void 0)})}),o}function u(e,t){function i(){this.constructor=e}for(var n in t)({}).hasOwnProperty.call(t,n)&&(e[n]=t[n]);return i.prototype=t.prototype,e.prototype=new i,e.parent=t.prototype,e}function c(e,t){var i,n,r,o;if(e){try{i=e.length}catch(a){i=o}if(i===o||"number"!=typeof i){for(n in e)if(e.hasOwnProperty(n)&&t(e[n],n)===!1)return}else for(r=0;i>r;r++)if(t(e[r],r)===!1)return}}function l(t){var i;if(!t||"object"!==e(t))return!0;for(i in t)return!1;return!0}function d(t,i){function n(r){"function"===e(t[r])&&t[r](function(e){++r<o&&!e?n(r):i(e)})}var r=0,o=t.length;"function"!==e(i)&&(i=function(){}),t&&t.length||i(),n(r)}function m(e,t){var i=0,n=e.length,r=new Array(n);c(e,function(e,o){e(function(e){if(e)return t(e);var a=[].slice.call(arguments);a.shift(),r[o]=a,i++,i===n&&(r.unshift(null),t.apply(this,r))})})}function h(e,t){if(t){if(Array.prototype.indexOf)return Array.prototype.indexOf.call(t,e);for(var i=0,n=t.length;n>i;i++)if(t[i]===e)return i}return-1}function f(t,i){var n=[];"array"!==e(t)&&(t=[t]),"array"!==e(i)&&(i=[i]);for(var r in t)-1===h(t[r],i)&&n.push(t[r]);return n.length?n:!1}function p(e,t){var i=[];return c(e,function(e){-1!==h(e,t)&&i.push(e)}),i.length?i:null}function g(e){var t,i=[];for(t=0;t<e.length;t++)i[t]=e[t];return i}function x(e){return e?String.prototype.trim?String.prototype.trim.call(e):e.toString().replace(/^\s*/,"").replace(/\s*$/,""):e}function v(e){if("string"!=typeof e)return e;var t,i={t:1099511627776,g:1073741824,m:1048576,k:1024};return e=/^([0-9\.]+)([tmgk]?)$/.exec(e.toLowerCase().replace(/[^0-9\.tmkg]/g,"")),t=e[2],e=+e[1],i.hasOwnProperty(t)&&(e*=i[t]),Math.floor(e)}function w(e){var t=[].slice.call(arguments,1);return e.replace(/%([a-z])/g,function(e,i){var n=t.shift();switch(i){case"s":return n+"";case"d":return parseInt(n,10);case"f":return parseFloat(n);case"c":return"";default:return n}})}function y(e,t){var i=this;setTimeout(function(){e.call(i)},t||1)}var E=function(){var e=0;return function(t){var i,n=(new Date).getTime().toString(32);for(i=0;5>i;i++)n+=Math.floor(65535*Math.random()).toString(32);return(t||"o_")+n+(e++).toString(32)}}();return{guid:E,typeOf:e,extend:t,extendIf:i,extendImmutable:n,extendImmutableIf:r,clone:o,inherit:u,each:c,isEmptyObj:l,inSeries:d,inParallel:m,inArray:h,arrayDiff:f,arrayIntersect:p,toArray:g,trim:x,sprintf:w,parseSizeStr:v,delay:y}}),n("moxie/core/utils/Encode",[],function(){var e=function(e){return unescape(encodeURIComponent(e))},t=function(e){return decodeURIComponent(escape(e))},i=function(e,i){if("function"==typeof window.atob)return i?t(window.atob(e)):window.atob(e);var n,r,o,a,s,u,c,l,d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",m=0,h=0,f="",p=[];if(!e)return e;e+="";do a=d.indexOf(e.charAt(m++)),s=d.indexOf(e.charAt(m++)),u=d.indexOf(e.charAt(m++)),c=d.indexOf(e.charAt(m++)),l=a<<18|s<<12|u<<6|c,n=255&l>>16,r=255&l>>8,o=255&l,p[h++]=64==u?String.fromCharCode(n):64==c?String.fromCharCode(n,r):String.fromCharCode(n,r,o);while(m<e.length);return f=p.join(""),i?t(f):f},n=function(t,i){if(i&&(t=e(t)),"function"==typeof window.btoa)return window.btoa(t);var n,r,o,a,s,u,c,l,d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",m=0,h=0,f="",p=[];if(!t)return t;do n=t.charCodeAt(m++),r=t.charCodeAt(m++),o=t.charCodeAt(m++),l=n<<16|r<<8|o,a=63&l>>18,s=63&l>>12,u=63&l>>6,c=63&l,p[h++]=d.charAt(a)+d.charAt(s)+d.charAt(u)+d.charAt(c);while(m<t.length);f=p.join("");var g=t.length%3;return(g?f.slice(0,g-3):f)+"===".slice(g||3)};return{utf8_encode:e,utf8_decode:t,atob:i,btoa:n}}),n("moxie/core/utils/Env",["moxie/core/utils/Basic"],function(e){function i(e,t,i){var n=0,r=0,o=0,a={dev:-6,alpha:-5,a:-5,beta:-4,b:-4,RC:-3,rc:-3,"#":-2,p:1,pl:1},s=function(e){return e=(""+e).replace(/[_\-+]/g,"."),e=e.replace(/([^.\d]+)/g,".$1.").replace(/\.{2,}/g,"."),e.length?e.split("."):[-8]},u=function(e){return e?isNaN(e)?a[e]||-7:parseInt(e,10):0};for(e=s(e),t=s(t),r=Math.max(e.length,t.length),n=0;r>n;n++)if(e[n]!=t[n]){if(e[n]=u(e[n]),t[n]=u(t[n]),e[n]<t[n]){o=-1;break}if(e[n]>t[n]){o=1;break}}if(!i)return o;switch(i){case">":case"gt":return o>0;case">=":case"ge":return o>=0;case"<=":case"le":return 0>=o;case"==":case"=":case"eq":return 0===o;case"<>":case"!=":case"ne":return 0!==o;case"":case"<":case"lt":return 0>o;default:return null}}var n=function(e){var t="",i="?",n="function",r="undefined",o="object",a="name",s="version",u={has:function(e,t){return-1!==t.toLowerCase().indexOf(e.toLowerCase())},lowerize:function(e){return e.toLowerCase()}},c={rgx:function(){for(var t,i,a,s,u,c,l,d=0,m=arguments;d<m.length;d+=2){var h=m[d],f=m[d+1];if(typeof t===r){t={};for(s in f)u=f[s],typeof u===o?t[u[0]]=e:t[u]=e}for(i=a=0;i<h.length;i++)if(c=h[i].exec(this.getUA())){for(s=0;s<f.length;s++)l=c[++a],u=f[s],typeof u===o&&u.length>0?2==u.length?t[u[0]]=typeof u[1]==n?u[1].call(this,l):u[1]:3==u.length?t[u[0]]=typeof u[1]!==n||u[1].exec&&u[1].test?l?l.replace(u[1],u[2]):e:l?u[1].call(this,l,u[2]):e:4==u.length&&(t[u[0]]=l?u[3].call(this,l.replace(u[1],u[2])):e):t[u]=l?l:e;break}if(c)break}return t},str:function(t,n){for(var r in n)if(typeof n[r]===o&&n[r].length>0){for(var a=0;a<n[r].length;a++)if(u.has(n[r][a],t))return r===i?e:r}else if(u.has(n[r],t))return r===i?e:r;return t}},l={browser:{oldsafari:{major:{1:["/8","/1","/3"],2:"/4","?":"/"},version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2000:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",RT:"ARM"}}}},d={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[a,s],[/\s(opr)\/([\w\.]+)/i],[[a,"Opera"],s],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]+)*/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi)\/([\w\.-]+)/i],[a,s],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[a,"IE"],s],[/(edge)\/((\d+)?[\w\.]+)/i],[a,s],[/(yabrowser)\/([\w\.]+)/i],[[a,"Yandex"],s],[/(comodo_dragon)\/([\w\.]+)/i],[[a,/_/g," "],s],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,/(uc\s?browser|qqbrowser)[\/\s]?([\w\.]+)/i],[a,s],[/(dolfin)\/([\w\.]+)/i],[[a,"Dolphin"],s],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[a,"Chrome"],s],[/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],[s,[a,"MIUI Browser"]],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],[s,[a,"Android Browser"]],[/FBAV\/([\w\.]+);/i],[s,[a,"Facebook"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[s,[a,"Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[s,a],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[a,[s,c.str,l.browser.oldsafari.version]],[/(konqueror)\/([\w\.]+)/i,/(webkit|khtml)\/([\w\.]+)/i],[a,s],[/(navigator|netscape)\/([\w\.-]+)/i],[[a,"Netscape"],s],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]+)*/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[a,s]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[s,[a,"EdgeHTML"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[a,s],[/rv\:([\w\.]+).*(gecko)/i],[s,a]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[a,s],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[a,[s,c.str,l.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[a,"Windows"],[s,c.str,l.os.windows.version]],[/\((bb)(10);/i],[[a,"BlackBerry"],s],[/(blackberry)\w*\/?([\w\.]+)*/i,/(tizen)[\/\s]([\w\.]+)/i,/(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,/linux;.+(sailfish);/i],[a,s],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],[[a,"Symbian"],s],[/\((series40);/i],[a],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[a,"Firefox OS"],s],[/(nintendo|playstation)\s([wids3portablevu]+)/i,/(mint)[\/\s\(]?(\w+)*/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,/(hurd|linux)\s?([\w\.]+)*/i,/(gnu)\s?([\w\.]+)*/i],[a,s],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[a,"Chromium OS"],s],[/(sunos)\s?([\w\.]+\d)*/i],[[a,"Solaris"],s],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],[a,s],[/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i],[[a,"iOS"],[s,/_/g,"."]],[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i,/(macintosh|mac(?=_powerpc)\s)/i],[[a,"Mac OS"],[s,/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,/(haiku)\s(\w+)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,/(unix)\s?([\w\.]+)*/i],[a,s]]},m=function(e){var i=e||(window&&window.navigator&&window.navigator.userAgent?window.navigator.userAgent:t);this.getBrowser=function(){return c.rgx.apply(this,d.browser)},this.getEngine=function(){return c.rgx.apply(this,d.engine)},this.getOS=function(){return c.rgx.apply(this,d.os)},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS()}},this.getUA=function(){return i},this.setUA=function(e){return i=e,this},this.setUA(i)};return m}(),r=function(){var i={access_global_ns:function(){return!!window.moxie},define_property:function(){return!1}(),create_canvas:function(){var e=document.createElement("canvas"),t=!(!e.getContext||!e.getContext("2d"));return i.create_canvas=t,t},return_response_type:function(t){try{if(-1!==e.inArray(t,["","text","document"]))return!0;if(window.XMLHttpRequest){var i=new XMLHttpRequest;if(i.open("get","/"),"responseType"in i)return i.responseType=t,i.responseType!==t?!1:!0}}catch(n){}return!1},use_blob_uri:function(){var e=window.URL;return i.use_blob_uri=e&&"createObjectURL"in e&&"revokeObjectURL"in e&&("IE"!==a.browser||a.verComp(a.version,"11.0.46",">=")),i.use_blob_uri},use_data_uri:function(){var e=new Image;return e.onload=function(){i.use_data_uri=1===e.width&&1===e.height},setTimeout(function(){e.src="data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="},1),!1}(),use_data_uri_over32kb:function(){return i.use_data_uri&&("IE"!==a.browser||a.version>=9)},use_data_uri_of:function(e){return i.use_data_uri&&33e3>e||i.use_data_uri_over32kb()},use_fileinput:function(){if(navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/))return!1;var e=document.createElement("input");return e.setAttribute("type","file"),i.use_fileinput=!e.disabled},use_webgl:function(){var e,n=document.createElement("canvas"),r=null;try{r=n.getContext("webgl")||n.getContext("experimental-webgl")}catch(o){}return r||(r=null),e=!!r,i.use_webgl=e,n=t,e}};return function(t){var n=[].slice.call(arguments);return n.shift(),"function"===e.typeOf(i[t])?i[t].apply(this,n):!!i[t]}}(),o=(new n).getResult(),a={can:r,uaParser:n,browser:o.browser.name,version:o.browser.version,os:o.os.name,osVersion:o.os.version,verComp:i,swf_url:"../flash/Moxie.swf",xap_url:"../silverlight/Moxie.xap",global_event_dispatcher:"moxie.core.EventTarget.instance.dispatchEvent"};return a.OS=a.os,a}),n("moxie/core/Exceptions",["moxie/core/utils/Basic"],function(e){function t(e,t){var i;for(i in e)if(e[i]===t)return i;return null}return{RuntimeError:function(){function i(e,i){this.code=e,this.name=t(n,e),this.message=this.name+(i||": RuntimeError "+this.code)}var n={NOT_INIT_ERR:1,EXCEPTION_ERR:3,NOT_SUPPORTED_ERR:9,JS_ERR:4};return e.extend(i,n),i.prototype=Error.prototype,i}(),OperationNotAllowedException:function(){function t(e){this.code=e,this.name="OperationNotAllowedException"}return e.extend(t,{NOT_ALLOWED_ERR:1}),t.prototype=Error.prototype,t}(),ImageError:function(){function i(e){this.code=e,this.name=t(n,e),this.message=this.name+": ImageError "+this.code}var n={WRONG_FORMAT:1,MAX_RESOLUTION_ERR:2,INVALID_META_ERR:3};return e.extend(i,n),i.prototype=Error.prototype,i}(),FileException:function(){function i(e){this.code=e,this.name=t(n,e),this.message=this.name+": FileException "+this.code}var n={NOT_FOUND_ERR:1,SECURITY_ERR:2,ABORT_ERR:3,NOT_READABLE_ERR:4,ENCODING_ERR:5,NO_MODIFICATION_ALLOWED_ERR:6,INVALID_STATE_ERR:7,SYNTAX_ERR:8};return e.extend(i,n),i.prototype=Error.prototype,i}(),DOMException:function(){function i(e){this.code=e,this.name=t(n,e),this.message=this.name+": DOMException "+this.code}var n={INDEX_SIZE_ERR:1,DOMSTRING_SIZE_ERR:2,HIERARCHY_REQUEST_ERR:3,WRONG_DOCUMENT_ERR:4,INVALID_CHARACTER_ERR:5,NO_DATA_ALLOWED_ERR:6,NO_MODIFICATION_ALLOWED_ERR:7,NOT_FOUND_ERR:8,NOT_SUPPORTED_ERR:9,INUSE_ATTRIBUTE_ERR:10,INVALID_STATE_ERR:11,SYNTAX_ERR:12,INVALID_MODIFICATION_ERR:13,NAMESPACE_ERR:14,INVALID_ACCESS_ERR:15,VALIDATION_ERR:16,TYPE_MISMATCH_ERR:17,SECURITY_ERR:18,NETWORK_ERR:19,ABORT_ERR:20,URL_MISMATCH_ERR:21,QUOTA_EXCEEDED_ERR:22,TIMEOUT_ERR:23,INVALID_NODE_TYPE_ERR:24,DATA_CLONE_ERR:25};return e.extend(i,n),i.prototype=Error.prototype,i}(),EventException:function(){function t(e){this.code=e,this.name="EventException"}return e.extend(t,{UNSPECIFIED_EVENT_TYPE_ERR:0}),t.prototype=Error.prototype,t}()}}),n("moxie/core/utils/Dom",["moxie/core/utils/Env"],function(e){var t=function(e){return"string"!=typeof e?e:document.getElementById(e)},i=function(e,t){if(!e.className)return!1;var i=new RegExp("(^|\\s+)"+t+"(\\s+|$)");return i.test(e.className)},n=function(e,t){i(e,t)||(e.className=e.className?e.className.replace(/\s+$/,"")+" "+t:t)},r=function(e,t){if(e.className){var i=new RegExp("(^|\\s+)"+t+"(\\s+|$)");e.className=e.className.replace(i,function(e,t,i){return" "===t&&" "===i?" ":""})}},o=function(e,t){return e.currentStyle?e.currentStyle[t]:window.getComputedStyle?window.getComputedStyle(e,null)[t]:void 0},a=function(t,i){function n(e){var t,i,n=0,r=0;return e&&(i=e.getBoundingClientRect(),t="CSS1Compat"===c.compatMode?c.documentElement:c.body,n=i.left+t.scrollLeft,r=i.top+t.scrollTop),{x:n,y:r}}var r,o,a,s=0,u=0,c=document;if(t=t,i=i||c.body,t&&t.getBoundingClientRect&&"IE"===e.browser&&(!c.documentMode||c.documentMode<8))return o=n(t),a=n(i),{x:o.x-a.x,y:o.y-a.y};for(r=t;r&&r!=i&&r.nodeType;)s+=r.offsetLeft||0,u+=r.offsetTop||0,r=r.offsetParent;for(r=t.parentNode;r&&r!=i&&r.nodeType;)s-=r.scrollLeft||0,u-=r.scrollTop||0,r=r.parentNode;return{x:s,y:u}},s=function(e){return{w:e.offsetWidth||e.clientWidth,h:e.offsetHeight||e.clientHeight}};return{get:t,hasClass:i,addClass:n,removeClass:r,getStyle:o,getPos:a,getSize:s}}),n("moxie/core/EventTarget",["moxie/core/utils/Env","moxie/core/Exceptions","moxie/core/utils/Basic"],function(e,t,i){function n(){this.uid=i.guid()}var r={};return i.extend(n.prototype,{init:function(){this.uid||(this.uid=i.guid("uid_"))},addEventListener:function(e,t,n,o){var a,s=this;return this.hasOwnProperty("uid")||(this.uid=i.guid("uid_")),e=i.trim(e),/\s/.test(e)?(i.each(e.split(/\s+/),function(e){s.addEventListener(e,t,n,o)}),void 0):(e=e.toLowerCase(),n=parseInt(n,10)||0,a=r[this.uid]&&r[this.uid][e]||[],a.push({fn:t,priority:n,scope:o||this}),r[this.uid]||(r[this.uid]={}),r[this.uid][e]=a,void 0)},hasEventListener:function(e){var t;return e?(e=e.toLowerCase(),t=r[this.uid]&&r[this.uid][e]):t=r[this.uid],t?t:!1},removeEventListener:function(e,t){var n,o,a=this;if(e=e.toLowerCase(),/\s/.test(e))return i.each(e.split(/\s+/),function(e){a.removeEventListener(e,t)}),void 0;if(n=r[this.uid]&&r[this.uid][e]){if(t){for(o=n.length-1;o>=0;o--)if(n[o].fn===t){n.splice(o,1);break}}else n=[];n.length||(delete r[this.uid][e],i.isEmptyObj(r[this.uid])&&delete r[this.uid])}},removeAllEventListeners:function(){r[this.uid]&&delete r[this.uid]},dispatchEvent:function(e){var n,o,a,s,u,c={},l=!0;if("string"!==i.typeOf(e)){if(s=e,"string"!==i.typeOf(s.type))throw new t.EventException(t.EventException.UNSPECIFIED_EVENT_TYPE_ERR);e=s.type,s.total!==u&&s.loaded!==u&&(c.total=s.total,c.loaded=s.loaded),c.async=s.async||!1}if(-1!==e.indexOf("::")?function(t){n=t[0],e=t[1]}(e.split("::")):n=this.uid,e=e.toLowerCase(),o=r[n]&&r[n][e]){o.sort(function(e,t){return t.priority-e.priority}),a=[].slice.call(arguments),a.shift(),c.type=e,a.unshift(c);var d=[];i.each(o,function(e){a[0].target=e.scope,c.async?d.push(function(t){setTimeout(function(){t(e.fn.apply(e.scope,a)===!1)},1)}):d.push(function(t){t(e.fn.apply(e.scope,a)===!1)})}),d.length&&i.inSeries(d,function(e){l=!e})}return l},bindOnce:function(e,t,i,n){var r=this;r.bind.call(this,e,function o(){return r.unbind(e,o),t.apply(this,arguments)},i,n)},bind:function(){this.addEventListener.apply(this,arguments)},unbind:function(){this.removeEventListener.apply(this,arguments)},unbindAll:function(){this.removeAllEventListeners.apply(this,arguments)},trigger:function(){return this.dispatchEvent.apply(this,arguments)},handleEventProps:function(e){var t=this;this.bind(e.join(" "),function(e){var t="on"+e.type.toLowerCase();"function"===i.typeOf(this[t])&&this[t].apply(this,arguments)}),i.each(e,function(e){e="on"+e.toLowerCase(e),"undefined"===i.typeOf(t[e])&&(t[e]=null)})}}),n.instance=new n,n}),n("moxie/runtime/Runtime",["moxie/core/utils/Env","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/EventTarget"],function(e,t,i,n){function r(e,n,o,s,u){var c,l=this,d=t.guid(n+"_"),m=u||"browser";e=e||{},a[d]=this,o=t.extend({access_binary:!1,access_image_binary:!1,display_media:!1,do_cors:!1,drag_and_drop:!1,filter_by_extension:!0,resize_image:!1,report_upload_progress:!1,return_response_headers:!1,return_response_type:!1,return_status_code:!0,send_custom_headers:!1,select_file:!1,select_folder:!1,select_multiple:!0,send_binary_string:!1,send_browser_cookies:!0,send_multipart:!0,slice_blob:!1,stream_upload:!1,summon_file_dialog:!1,upload_filesize:!0,use_http_method:!0},o),e.preferred_caps&&(m=r.getMode(s,e.preferred_caps,m)),c=function(){var e={};return{exec:function(t,i,n,r){return c[i]&&(e[t]||(e[t]={context:this,instance:new c[i]}),e[t].instance[n])?e[t].instance[n].apply(this,r):void 0},removeInstance:function(t){delete e[t]},removeAllInstances:function(){var i=this;t.each(e,function(e,n){"function"===t.typeOf(e.instance.destroy)&&e.instance.destroy.call(e.context),i.removeInstance(n)})}}}(),t.extend(this,{initialized:!1,uid:d,type:n,mode:r.getMode(s,e.required_caps,m),shimid:d+"_container",clients:0,options:e,can:function(e,i){var n=arguments[2]||o;if("string"===t.typeOf(e)&&"undefined"===t.typeOf(i)&&(e=r.parseCaps(e)),"object"===t.typeOf(e)){for(var a in e)if(!this.can(a,e[a],n))return!1;return!0}return"function"===t.typeOf(n[e])?n[e].call(this,i):i===n[e]},getShimContainer:function(){var e,n=i.get(this.shimid);return n||(e=i.get(this.options.container)||document.body,n=document.createElement("div"),n.id=this.shimid,n.className="moxie-shim moxie-shim-"+this.type,t.extend(n.style,{position:"absolute",top:"0px",left:"0px",width:"1px",height:"1px",overflow:"hidden"}),e.appendChild(n),e=null),n},getShim:function(){return c},shimExec:function(e,t){var i=[].slice.call(arguments,2);return l.getShim().exec.call(this,this.uid,e,t,i)},exec:function(e,t){var i=[].slice.call(arguments,2);return l[e]&&l[e][t]?l[e][t].apply(this,i):l.shimExec.apply(this,arguments)},destroy:function(){if(l){var e=i.get(this.shimid);e&&e.parentNode.removeChild(e),c&&c.removeAllInstances(),this.unbindAll(),delete a[this.uid],this.uid=null,d=l=c=e=null}}}),this.mode&&e.required_caps&&!this.can(e.required_caps)&&(this.mode=!1)}var o={},a={};return r.order="html5,flash,silverlight,html4",r.getRuntime=function(e){return a[e]?a[e]:!1},r.addConstructor=function(e,t){t.prototype=n.instance,o[e]=t},r.getConstructor=function(e){return o[e]||null},r.getInfo=function(e){var t=r.getRuntime(e);return t?{uid:t.uid,type:t.type,mode:t.mode,can:function(){return t.can.apply(t,arguments)}}:null},r.parseCaps=function(e){var i={};return"string"!==t.typeOf(e)?e||{}:(t.each(e.split(","),function(e){i[e]=!0}),i)},r.can=function(e,t){var i,n,o=r.getConstructor(e);return o?(i=new o({required_caps:t}),n=i.mode,i.destroy(),!!n):!1},r.thatCan=function(e,t){var i=(t||r.order).split(/\s*,\s*/);for(var n in i)if(r.can(i[n],e))return i[n];return null},r.getMode=function(e,i,n){var r=null;if("undefined"===t.typeOf(n)&&(n="browser"),i&&!t.isEmptyObj(e)){if(t.each(i,function(i,n){if(e.hasOwnProperty(n)){var o=e[n](i);if("string"==typeof o&&(o=[o]),r){if(!(r=t.arrayIntersect(r,o)))return r=!1}else r=o}}),r)return-1!==t.inArray(n,r)?n:r[0];if(r===!1)return!1}return n},r.getGlobalEventTarget=function(){if(/^moxie\./.test(e.global_event_dispatcher)&&!e.can("access_global_ns")){var i=t.guid("moxie_event_target_");window[i]=function(e,t){n.instance.dispatchEvent(e,t)},e.global_event_dispatcher=i}return e.global_event_dispatcher},r.capTrue=function(){return!0},r.capFalse=function(){return!1},r.capTest=function(e){return function(){return!!e}},r}),n("moxie/runtime/RuntimeClient",["moxie/core/utils/Env","moxie/core/Exceptions","moxie/core/utils/Basic","moxie/runtime/Runtime"],function(e,t,i,n){return function(){var e;i.extend(this,{connectRuntime:function(r){function o(i){var a,u;return i.length?(a=i.shift().toLowerCase(),(u=n.getConstructor(a))?(e=new u(r),e.bind("Init",function(){e.initialized=!0,setTimeout(function(){e.clients++,s.ruid=e.uid,s.trigger("RuntimeInit",e)},1)}),e.bind("Error",function(){e.destroy(),o(i)}),e.bind("Exception",function(e,i){var n=i.name+"(#"+i.code+")"+(i.message?", from: "+i.message:"");s.trigger("RuntimeError",new t.RuntimeError(t.RuntimeError.EXCEPTION_ERR,n))}),e.mode?(e.init(),void 0):(e.trigger("Error"),void 0)):(o(i),void 0)):(s.trigger("RuntimeError",new t.RuntimeError(t.RuntimeError.NOT_INIT_ERR)),e=null,void 0)}var a,s=this;if("string"===i.typeOf(r)?a=r:"string"===i.typeOf(r.ruid)&&(a=r.ruid),a){if(e=n.getRuntime(a))return s.ruid=a,e.clients++,e;throw new t.RuntimeError(t.RuntimeError.NOT_INIT_ERR)}o((r.runtime_order||n.order).split(/\s*,\s*/))},disconnectRuntime:function(){e&&--e.clients<=0&&e.destroy(),e=null},getRuntime:function(){return e&&e.uid?e:e=null},exec:function(){return e?e.exec.apply(this,arguments):null},can:function(t){return e?e.can(t):!1}})}}),n("moxie/file/Blob",["moxie/core/utils/Basic","moxie/core/utils/Encode","moxie/runtime/RuntimeClient"],function(e,t,i){function n(o,a){function s(t,i,o){var a,s=r[this.uid];return"string"===e.typeOf(s)&&s.length?(a=new n(null,{type:o,size:i-t}),a.detach(s.substr(t,a.size)),a):null}i.call(this),o&&this.connectRuntime(o),a?"string"===e.typeOf(a)&&(a={data:a}):a={},e.extend(this,{uid:a.uid||e.guid("uid_"),ruid:o,size:a.size||0,type:a.type||"",slice:function(e,t,i){return this.isDetached()?s.apply(this,arguments):this.getRuntime().exec.call(this,"Blob","slice",this.getSource(),e,t,i)},getSource:function(){return r[this.uid]?r[this.uid]:null},detach:function(e){if(this.ruid&&(this.getRuntime().exec.call(this,"Blob","destroy"),this.disconnectRuntime(),this.ruid=null),e=e||"","data:"==e.substr(0,5)){var i=e.indexOf(";base64,");this.type=e.substring(5,i),e=t.atob(e.substring(i+8))}this.size=e.length,r[this.uid]=e},isDetached:function(){return!this.ruid&&"string"===e.typeOf(r[this.uid])},destroy:function(){this.detach(),delete r[this.uid]}}),a.data?this.detach(a.data):r[this.uid]=a}var r={};return n}),n("moxie/core/I18n",["moxie/core/utils/Basic"],function(e){var t={};return{addI18n:function(i){return e.extend(t,i)},translate:function(e){return t[e]||e},_:function(e){return this.translate(e)},sprintf:function(t){var i=[].slice.call(arguments,1);return t.replace(/%[a-z]/g,function(){var t=i.shift();return"undefined"!==e.typeOf(t)?t:""})}}}),n("moxie/core/utils/Mime",["moxie/core/utils/Basic","moxie/core/I18n"],function(e,t){var i="application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb xlt xla,application/vnd.ms-powerpoint,ppt pps pot ppa,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mp3 mpga mpega mp2,audio/x-wav,wav,audio/x-m4a,m4a,audio/ogg,oga ogg,audio/aiff,aiff aif,audio/flac,flac,audio/aac,aac,audio/ac3,ac3,audio/x-ms-wma,wma,image/bmp,bmp,image/gif,gif,image/jpeg,jpg jpeg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe m2v,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/3gpp,3gpp 3gp,video/3gpp2,3g2,video/vnd.rn-realvideo,rv,video/ogg,ogv,video/x-matroska,mkv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe",n={},r={},o=function(e){var t,i,o,a=e.split(/,/);for(t=0;t<a.length;t+=2){for(o=a[t+1].split(/ /),i=0;i<o.length;i++)n[o[i]]=a[t];r[a[t]]=o}},a=function(t,i){var n,r,o,a,s=[];for(r=0;r<t.length;r++)for(n=t[r].extensions.toLowerCase().split(/\s*,\s*/),o=0;o<n.length;o++){if("*"===n[o])return[];if(a=s[n[o]],i&&/^\w+$/.test(n[o]))s.push("."+n[o]);else if(a&&-1===e.inArray(a,s))s.push(a);else if(!a)return[]}return s},s=function(t){var i=[];return e.each(t,function(t){if(t=t.toLowerCase(),"*"===t)return i=[],!1;var n=t.match(/^(\w+)\/(\*|\w+)$/);n&&("*"===n[2]?e.each(r,function(e,t){new RegExp("^"+n[1]+"/").test(t)&&[].push.apply(i,r[t])}):r[t]&&[].push.apply(i,r[t]))}),i},u=function(i){var n=[],r=[];return"string"===e.typeOf(i)&&(i=e.trim(i).split(/\s*,\s*/)),r=s(i),n.push({title:t.translate("Files"),extensions:r.length?r.join(","):"*"}),n},c=function(e){var t=e&&e.match(/\.([^.]+)$/);return t?t[1].toLowerCase():""},l=function(e){return n[c(e)]||""};return o(i),{mimes:n,extensions:r,addMimeType:o,extList2mimes:a,mimes2exts:s,mimes2extList:u,getFileExtension:c,getFileMime:l}}),n("moxie/file/FileInput",["moxie/core/utils/Basic","moxie/core/utils/Env","moxie/core/utils/Mime","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/core/EventTarget","moxie/core/I18n","moxie/runtime/Runtime","moxie/runtime/RuntimeClient"],function(e,t,i,n,r,o,a,s,u){function c(t){var o,c,d;if(-1!==e.inArray(e.typeOf(t),["string","node"])&&(t={browse_button:t}),c=n.get(t.browse_button),!c)throw new r.DOMException(r.DOMException.NOT_FOUND_ERR);d={accept:[{title:a.translate("All Files"),extensions:"*"}],multiple:!1,required_caps:!1,container:c.parentNode||document.body},t=e.extend({},d,t),"string"==typeof t.required_caps&&(t.required_caps=s.parseCaps(t.required_caps)),"string"==typeof t.accept&&(t.accept=i.mimes2extList(t.accept)),o=n.get(t.container),o||(o=document.body),"static"===n.getStyle(o,"position")&&(o.style.position="relative"),o=c=null,u.call(this),e.extend(this,{uid:e.guid("uid_"),ruid:null,shimid:null,files:null,init:function(){var i=this;i.bind("RuntimeInit",function(r,o){i.ruid=o.uid,i.shimid=o.shimid,i.bind("Ready",function(){i.trigger("Refresh")},999),i.bind("Refresh",function(){var i,r,a,s,u;a=n.get(t.browse_button),s=n.get(o.shimid),a&&(i=n.getPos(a,n.get(t.container)),r=n.getSize(a),u=parseInt(n.getStyle(a,"z-index"),10)||0,s&&e.extend(s.style,{top:i.y+"px",left:i.x+"px",width:r.w+"px",height:r.h+"px",zIndex:u+1})),s=a=null}),o.exec.call(i,"FileInput","init",t)}),i.connectRuntime(e.extend({},t,{required_caps:{select_file:!0}}))},getOption:function(e){return t[e]},setOption:function(e,n){if(t.hasOwnProperty(e)){var o=t[e];switch(e){case"accept":"string"==typeof n&&(n=i.mimes2extList(n));break;case"container":case"required_caps":throw new r.FileException(r.FileException.NO_MODIFICATION_ALLOWED_ERR)}t[e]=n,this.exec("FileInput","setOption",e,n),this.trigger("OptionChanged",e,n,o)}},disable:function(t){var i=this.getRuntime();i&&this.exec("FileInput","disable","undefined"===e.typeOf(t)?!0:t)},refresh:function(){this.trigger("Refresh")},destroy:function(){var t=this.getRuntime();t&&(t.exec.call(this,"FileInput","destroy"),this.disconnectRuntime()),"array"===e.typeOf(this.files)&&e.each(this.files,function(e){e.destroy()}),this.files=null,this.unbindAll()}}),this.handleEventProps(l)}var l=["ready","change","cancel","mouseenter","mouseleave","mousedown","mouseup"];return c.prototype=o.instance,c}),n("moxie/file/File",["moxie/core/utils/Basic","moxie/core/utils/Mime","moxie/file/Blob"],function(e,t,i){function n(n,r){r||(r={}),i.apply(this,arguments),this.type||(this.type=t.getFileMime(r.name));var o;if(r.name)o=r.name.replace(/\\/g,"/"),o=o.substr(o.lastIndexOf("/")+1);else if(this.type){var a=this.type.split("/")[0];o=e.guid((""!==a?a:"file")+"_"),t.extensions[this.type]&&(o+="."+t.extensions[this.type][0])}e.extend(this,{name:o||e.guid("file_"),relativePath:"",lastModifiedDate:r.lastModifiedDate||(new Date).toLocaleString()})}return n.prototype=i.prototype,n}),n("moxie/file/FileDrop",["moxie/core/I18n","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/core/utils/Basic","moxie/core/utils/Env","moxie/file/File","moxie/runtime/RuntimeClient","moxie/core/EventTarget","moxie/core/utils/Mime"],function(e,t,i,n,r,o,a,s,u){function c(i){var r,o=this;"string"==typeof i&&(i={drop_zone:i}),r={accept:[{title:e.translate("All Files"),extensions:"*"}],required_caps:{drag_and_drop:!0}},i="object"==typeof i?n.extend({},r,i):r,i.container=t.get(i.drop_zone)||document.body,"static"===t.getStyle(i.container,"position")&&(i.container.style.position="relative"),"string"==typeof i.accept&&(i.accept=u.mimes2extList(i.accept)),a.call(o),n.extend(o,{uid:n.guid("uid_"),ruid:null,files:null,init:function(){o.bind("RuntimeInit",function(e,t){o.ruid=t.uid,t.exec.call(o,"FileDrop","init",i),o.dispatchEvent("ready")
		}),o.connectRuntime(i)},destroy:function(){var e=this.getRuntime();e&&(e.exec.call(this,"FileDrop","destroy"),this.disconnectRuntime()),this.files=null,this.unbindAll()}}),this.handleEventProps(l)}var l=["ready","dragenter","dragleave","drop","error"];return c.prototype=s.instance,c}),n("moxie/file/FileReader",["moxie/core/utils/Basic","moxie/core/utils/Encode","moxie/core/Exceptions","moxie/core/EventTarget","moxie/file/Blob","moxie/runtime/RuntimeClient"],function(e,t,i,n,r,o){function a(){function n(e,n){if(this.trigger("loadstart"),this.readyState===a.LOADING)return this.trigger("error",new i.DOMException(i.DOMException.INVALID_STATE_ERR)),this.trigger("loadend"),void 0;if(!(n instanceof r))return this.trigger("error",new i.DOMException(i.DOMException.NOT_FOUND_ERR)),this.trigger("loadend"),void 0;if(this.result=null,this.readyState=a.LOADING,n.isDetached()){var o=n.getSource();switch(e){case"readAsText":case"readAsBinaryString":this.result=o;break;case"readAsDataURL":this.result="data:"+n.type+";base64,"+t.btoa(o)}this.readyState=a.DONE,this.trigger("load"),this.trigger("loadend")}else this.connectRuntime(n.ruid),this.exec("FileReader","read",e,n)}o.call(this),e.extend(this,{uid:e.guid("uid_"),readyState:a.EMPTY,result:null,error:null,readAsBinaryString:function(e){n.call(this,"readAsBinaryString",e)},readAsDataURL:function(e){n.call(this,"readAsDataURL",e)},readAsText:function(e){n.call(this,"readAsText",e)},abort:function(){this.result=null,-1===e.inArray(this.readyState,[a.EMPTY,a.DONE])&&(this.readyState===a.LOADING&&(this.readyState=a.DONE),this.exec("FileReader","abort"),this.trigger("abort"),this.trigger("loadend"))},destroy:function(){this.abort(),this.exec("FileReader","destroy"),this.disconnectRuntime(),this.unbindAll()}}),this.handleEventProps(s),this.bind("Error",function(e,t){this.readyState=a.DONE,this.error=t},999),this.bind("Load",function(){this.readyState=a.DONE},999)}var s=["loadstart","progress","load","abort","error","loadend"];return a.EMPTY=0,a.LOADING=1,a.DONE=2,a.prototype=n.instance,a}),n("moxie/core/utils/Url",["moxie/core/utils/Basic"],function(e){var t=function(i,n){var r,o=["source","scheme","authority","userInfo","user","pass","host","port","relative","path","directory","file","query","fragment"],a=o.length,s={http:80,https:443},u={},c=/^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@\/]*):?([^:@\/]*))?@)?(\[[\da-fA-F:]+\]|[^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/,l=c.exec(i||""),d=/^\/\/\w/.test(i);switch(e.typeOf(n)){case"undefined":n=t(document.location.href,!1);break;case"string":n=t(n,!1)}for(;a--;)l[a]&&(u[o[a]]=l[a]);if(r=!d&&!u.scheme,(d||r)&&(u.scheme=n.scheme),r){u.host=n.host,u.port=n.port;var m="";/^[^\/]/.test(u.path)&&(m=n.path,m=/\/[^\/]*\.[^\/]*$/.test(m)?m.replace(/\/[^\/]+$/,"/"):m.replace(/\/?$/,"/")),u.path=m+(u.path||"")}return u.port||(u.port=s[u.scheme]||80),u.port=parseInt(u.port,10),u.path||(u.path="/"),delete u.source,u},i=function(e){var i={http:80,https:443},n="object"==typeof e?e:t(e);return n.scheme+"://"+n.host+(n.port!==i[n.scheme]?":"+n.port:"")+n.path+(n.query?n.query:"")},n=function(e){function i(e){return[e.scheme,e.host,e.port].join("/")}return"string"==typeof e&&(e=t(e)),i(t())===i(e)};return{parseUrl:t,resolveUrl:i,hasSameOrigin:n}}),n("moxie/runtime/RuntimeTarget",["moxie/core/utils/Basic","moxie/runtime/RuntimeClient","moxie/core/EventTarget"],function(e,t,i){function n(){this.uid=e.guid("uid_"),t.call(this),this.destroy=function(){this.disconnectRuntime(),this.unbindAll()}}return n.prototype=i.instance,n}),n("moxie/file/FileReaderSync",["moxie/core/utils/Basic","moxie/runtime/RuntimeClient","moxie/core/utils/Encode"],function(e,t,i){return function(){function n(e,t){if(!t.isDetached()){var n=this.connectRuntime(t.ruid).exec.call(this,"FileReaderSync","read",e,t);return this.disconnectRuntime(),n}var r=t.getSource();switch(e){case"readAsBinaryString":return r;case"readAsDataURL":return"data:"+t.type+";base64,"+i.btoa(r);case"readAsText":for(var o="",a=0,s=r.length;s>a;a++)o+=String.fromCharCode(r[a]);return o}}t.call(this),e.extend(this,{uid:e.guid("uid_"),readAsBinaryString:function(e){return n.call(this,"readAsBinaryString",e)},readAsDataURL:function(e){return n.call(this,"readAsDataURL",e)},readAsText:function(e){return n.call(this,"readAsText",e)}})}}),n("moxie/xhr/FormData",["moxie/core/Exceptions","moxie/core/utils/Basic","moxie/file/Blob"],function(e,t,i){function n(){var e,n=[];t.extend(this,{append:function(r,o){var a=this,s=t.typeOf(o);o instanceof i?e={name:r,value:o}:"array"===s?(r+="[]",t.each(o,function(e){a.append(r,e)})):"object"===s?t.each(o,function(e,t){a.append(r+"["+t+"]",e)}):"null"===s||"undefined"===s||"number"===s&&isNaN(o)?a.append(r,"false"):n.push({name:r,value:o.toString()})},hasBlob:function(){return!!this.getBlob()},getBlob:function(){return e&&e.value||null},getBlobName:function(){return e&&e.name||null},each:function(i){t.each(n,function(e){i(e.value,e.name)}),e&&i(e.value,e.name)},destroy:function(){e=null,n=[]}})}return n}),n("moxie/xhr/XMLHttpRequest",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/core/EventTarget","moxie/core/utils/Encode","moxie/core/utils/Url","moxie/runtime/Runtime","moxie/runtime/RuntimeTarget","moxie/file/Blob","moxie/file/FileReaderSync","moxie/xhr/FormData","moxie/core/utils/Env","moxie/core/utils/Mime"],function(e,t,i,n,r,o,a,s,u,c,l,d){function m(){this.uid=e.guid("uid_")}function h(){function i(e,t){return I.hasOwnProperty(e)?1===arguments.length?l.can("define_property")?I[e]:A[e]:(l.can("define_property")?I[e]=t:A[e]=t,void 0):void 0}function u(t){function n(){_&&(_.destroy(),_=null),s.dispatchEvent("loadend"),s=null}function r(r){_.bind("LoadStart",function(e){i("readyState",h.LOADING),s.dispatchEvent("readystatechange"),s.dispatchEvent(e),L&&s.upload.dispatchEvent(e)}),_.bind("Progress",function(e){i("readyState")!==h.LOADING&&(i("readyState",h.LOADING),s.dispatchEvent("readystatechange")),s.dispatchEvent(e)}),_.bind("UploadProgress",function(e){L&&s.upload.dispatchEvent({type:"progress",lengthComputable:!1,total:e.total,loaded:e.loaded})}),_.bind("Load",function(t){i("readyState",h.DONE),i("status",Number(r.exec.call(_,"XMLHttpRequest","getStatus")||0)),i("statusText",f[i("status")]||""),i("response",r.exec.call(_,"XMLHttpRequest","getResponse",i("responseType"))),~e.inArray(i("responseType"),["text",""])?i("responseText",i("response")):"document"===i("responseType")&&i("responseXML",i("response")),U=r.exec.call(_,"XMLHttpRequest","getAllResponseHeaders"),s.dispatchEvent("readystatechange"),i("status")>0?(L&&s.upload.dispatchEvent(t),s.dispatchEvent(t)):(F=!0,s.dispatchEvent("error")),n()}),_.bind("Abort",function(e){s.dispatchEvent(e),n()}),_.bind("Error",function(e){F=!0,i("readyState",h.DONE),s.dispatchEvent("readystatechange"),M=!0,s.dispatchEvent(e),n()}),r.exec.call(_,"XMLHttpRequest","send",{url:x,method:v,async:T,user:w,password:y,headers:S,mimeType:D,encoding:O,responseType:s.responseType,withCredentials:s.withCredentials,options:k},t)}var s=this;E=(new Date).getTime(),_=new a,"string"==typeof k.required_caps&&(k.required_caps=o.parseCaps(k.required_caps)),k.required_caps=e.extend({},k.required_caps,{return_response_type:s.responseType}),t instanceof c&&(k.required_caps.send_multipart=!0),e.isEmptyObj(S)||(k.required_caps.send_custom_headers=!0),B||(k.required_caps.do_cors=!0),k.ruid?r(_.connectRuntime(k)):(_.bind("RuntimeInit",function(e,t){r(t)}),_.bind("RuntimeError",function(e,t){s.dispatchEvent("RuntimeError",t)}),_.connectRuntime(k))}function g(){i("responseText",""),i("responseXML",null),i("response",null),i("status",0),i("statusText",""),E=b=null}var x,v,w,y,E,b,_,R,A=this,I={timeout:0,readyState:h.UNSENT,withCredentials:!1,status:0,statusText:"",responseType:"",responseXML:null,responseText:null,response:null},T=!0,S={},O=null,D=null,N=!1,C=!1,L=!1,M=!1,F=!1,B=!1,P=null,H=null,k={},U="";e.extend(this,I,{uid:e.guid("uid_"),upload:new m,open:function(o,a,s,u,c){var l;if(!o||!a)throw new t.DOMException(t.DOMException.SYNTAX_ERR);if(/[\u0100-\uffff]/.test(o)||n.utf8_encode(o)!==o)throw new t.DOMException(t.DOMException.SYNTAX_ERR);if(~e.inArray(o.toUpperCase(),["CONNECT","DELETE","GET","HEAD","OPTIONS","POST","PUT","TRACE","TRACK"])&&(v=o.toUpperCase()),~e.inArray(v,["CONNECT","TRACE","TRACK"]))throw new t.DOMException(t.DOMException.SECURITY_ERR);if(a=n.utf8_encode(a),l=r.parseUrl(a),B=r.hasSameOrigin(l),x=r.resolveUrl(a),(u||c)&&!B)throw new t.DOMException(t.DOMException.INVALID_ACCESS_ERR);if(w=u||l.user,y=c||l.pass,T=s||!0,T===!1&&(i("timeout")||i("withCredentials")||""!==i("responseType")))throw new t.DOMException(t.DOMException.INVALID_ACCESS_ERR);N=!T,C=!1,S={},g.call(this),i("readyState",h.OPENED),this.dispatchEvent("readystatechange")},setRequestHeader:function(r,o){var a=["accept-charset","accept-encoding","access-control-request-headers","access-control-request-method","connection","content-length","cookie","cookie2","content-transfer-encoding","date","expect","host","keep-alive","origin","referer","te","trailer","transfer-encoding","upgrade","user-agent","via"];if(i("readyState")!==h.OPENED||C)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(/[\u0100-\uffff]/.test(r)||n.utf8_encode(r)!==r)throw new t.DOMException(t.DOMException.SYNTAX_ERR);return r=e.trim(r).toLowerCase(),~e.inArray(r,a)||/^(proxy\-|sec\-)/.test(r)?!1:(S[r]?S[r]+=", "+o:S[r]=o,!0)},hasRequestHeader:function(e){return e&&S[e.toLowerCase()]||!1},getAllResponseHeaders:function(){return U||""},getResponseHeader:function(t){return t=t.toLowerCase(),F||~e.inArray(t,["set-cookie","set-cookie2"])?null:U&&""!==U&&(R||(R={},e.each(U.split(/\r\n/),function(t){var i=t.split(/:\s+/);2===i.length&&(i[0]=e.trim(i[0]),R[i[0].toLowerCase()]={header:i[0],value:e.trim(i[1])})})),R.hasOwnProperty(t))?R[t].header+": "+R[t].value:null},overrideMimeType:function(n){var r,o;if(~e.inArray(i("readyState"),[h.LOADING,h.DONE]))throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(n=e.trim(n.toLowerCase()),/;/.test(n)&&(r=n.match(/^([^;]+)(?:;\scharset\=)?(.*)$/))&&(n=r[1],r[2]&&(o=r[2])),!d.mimes[n])throw new t.DOMException(t.DOMException.SYNTAX_ERR);P=n,H=o},send:function(i,r){if(k="string"===e.typeOf(r)?{ruid:r}:r?r:{},this.readyState!==h.OPENED||C)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(i instanceof s)k.ruid=i.ruid,D=i.type||"application/octet-stream";else if(i instanceof c){if(i.hasBlob()){var o=i.getBlob();k.ruid=o.ruid,D=o.type||"application/octet-stream"}}else"string"==typeof i&&(O="UTF-8",D="text/plain;charset=UTF-8",i=n.utf8_encode(i));this.withCredentials||(this.withCredentials=k.required_caps&&k.required_caps.send_browser_cookies&&!B),L=!N&&this.upload.hasEventListener(),F=!1,M=!i,N||(C=!0),u.call(this,i)},abort:function(){if(F=!0,N=!1,~e.inArray(i("readyState"),[h.UNSENT,h.OPENED,h.DONE]))i("readyState",h.UNSENT);else{if(i("readyState",h.DONE),C=!1,!_)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);_.getRuntime().exec.call(_,"XMLHttpRequest","abort",M),M=!0}},destroy:function(){_&&("function"===e.typeOf(_.destroy)&&_.destroy(),_=null),this.unbindAll(),this.upload&&(this.upload.unbindAll(),this.upload=null)}}),this.handleEventProps(p.concat(["readystatechange"])),this.upload.handleEventProps(p)}var f={100:"Continue",101:"Switching Protocols",102:"Processing",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",306:"Reserved",307:"Temporary Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Request Entity Too Large",414:"Request-URI Too Long",415:"Unsupported Media Type",416:"Requested Range Not Satisfiable",417:"Expectation Failed",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",426:"Upgrade Required",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",510:"Not Extended"};m.prototype=i.instance;var p=["loadstart","progress","abort","error","load","timeout","loadend"];return h.UNSENT=0,h.OPENED=1,h.HEADERS_RECEIVED=2,h.LOADING=3,h.DONE=4,h.prototype=i.instance,h}),n("moxie/runtime/Transporter",["moxie/core/utils/Basic","moxie/core/utils/Encode","moxie/runtime/RuntimeClient","moxie/core/EventTarget"],function(e,t,i,n){function r(){function n(){l=d=0,c=this.result=null}function o(t,i){var n=this;u=i,n.bind("TransportingProgress",function(t){d=t.loaded,l>d&&-1===e.inArray(n.state,[r.IDLE,r.DONE])&&a.call(n)},999),n.bind("TransportingComplete",function(){d=l,n.state=r.DONE,c=null,n.result=u.exec.call(n,"Transporter","getAsBlob",t||"")},999),n.state=r.BUSY,n.trigger("TransportingStarted"),a.call(n)}function a(){var e,i=this,n=l-d;m>n&&(m=n),e=t.btoa(c.substr(d,m)),u.exec.call(i,"Transporter","receive",e,l)}var s,u,c,l,d,m;i.call(this),e.extend(this,{uid:e.guid("uid_"),state:r.IDLE,result:null,transport:function(t,i,r){var a=this;if(r=e.extend({chunk_size:204798},r),(s=r.chunk_size%3)&&(r.chunk_size+=3-s),m=r.chunk_size,n.call(this),c=t,l=t.length,"string"===e.typeOf(r)||r.ruid)o.call(a,i,this.connectRuntime(r));else{var u=function(e,t){a.unbind("RuntimeInit",u),o.call(a,i,t)};this.bind("RuntimeInit",u),this.connectRuntime(r)}},abort:function(){var e=this;e.state=r.IDLE,u&&(u.exec.call(e,"Transporter","clear"),e.trigger("TransportingAborted")),n.call(e)},destroy:function(){this.unbindAll(),u=null,this.disconnectRuntime(),n.call(this)}})}return r.IDLE=0,r.BUSY=1,r.DONE=2,r.prototype=n.instance,r}),n("moxie/image/Image",["moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/file/FileReaderSync","moxie/xhr/XMLHttpRequest","moxie/runtime/Runtime","moxie/runtime/RuntimeClient","moxie/runtime/Transporter","moxie/core/utils/Env","moxie/core/EventTarget","moxie/file/Blob","moxie/file/File","moxie/core/utils/Encode"],function(e,t,i,n,r,o,a,s,u,c,l,d,m){function h(){function n(e){try{return e||(e=this.exec("Image","getInfo")),this.size=e.size,this.width=e.width,this.height=e.height,this.type=e.type,this.meta=e.meta,""===this.name&&(this.name=e.name),!0}catch(t){return this.trigger("error",t.code),!1}}function c(t){var n=e.typeOf(t);try{if(t instanceof h){if(!t.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);p.apply(this,arguments)}else if(t instanceof l){if(!~e.inArray(t.type,["image/jpeg","image/png"]))throw new i.ImageError(i.ImageError.WRONG_FORMAT);g.apply(this,arguments)}else if(-1!==e.inArray(n,["blob","file"]))c.call(this,new d(null,t),arguments[1]);else if("string"===n)"data:"===t.substr(0,5)?c.call(this,new l(null,{data:t}),arguments[1]):x.apply(this,arguments);else{if("node"!==n||"img"!==t.nodeName.toLowerCase())throw new i.DOMException(i.DOMException.TYPE_MISMATCH_ERR);c.call(this,t.src,arguments[1])}}catch(r){this.trigger("error",r.code)}}function p(t,i){var n=this.connectRuntime(t.ruid);this.ruid=n.uid,n.exec.call(this,"Image","loadFromImage",t,"undefined"===e.typeOf(i)?!0:i)}function g(t,i){function n(e){r.ruid=e.uid,e.exec.call(r,"Image","loadFromBlob",t)}var r=this;r.name=t.name||"",t.isDetached()?(this.bind("RuntimeInit",function(e,t){n(t)}),i&&"string"==typeof i.required_caps&&(i.required_caps=o.parseCaps(i.required_caps)),this.connectRuntime(e.extend({required_caps:{access_image_binary:!0,resize_image:!0}},i))):n(this.connectRuntime(t.ruid))}function x(e,t){var i,n=this;i=new r,i.open("get",e),i.responseType="blob",i.onprogress=function(e){n.trigger(e)},i.onload=function(){g.call(n,i.response,!0)},i.onerror=function(e){n.trigger(e)},i.onloadend=function(){i.destroy()},i.bind("RuntimeError",function(e,t){n.trigger("RuntimeError",t)}),i.send(null,t)}a.call(this),e.extend(this,{uid:e.guid("uid_"),ruid:null,name:"",size:0,width:0,height:0,type:"",meta:{},clone:function(){this.load.apply(this,arguments)},load:function(){c.apply(this,arguments)},resize:function(t){var n,r,o=this,a={x:0,y:0,width:o.width,height:o.height},s=e.extendIf({width:o.width,height:o.height,type:o.type||"image/jpeg",quality:90,crop:!1,fit:!0,preserveHeaders:!0,resample:"default",multipass:!0},t);try{if(!o.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);if(o.width>h.MAX_RESIZE_WIDTH||o.height>h.MAX_RESIZE_HEIGHT)throw new i.ImageError(i.ImageError.MAX_RESOLUTION_ERR);if(n=o.meta&&o.meta.tiff&&o.meta.tiff.Orientation||1,-1!==e.inArray(n,[5,6,7,8])){var u=s.width;s.width=s.height,s.height=u}if(s.crop){switch(r=Math.max(s.width/o.width,s.height/o.height),t.fit?(a.width=Math.min(Math.ceil(s.width/r),o.width),a.height=Math.min(Math.ceil(s.height/r),o.height),r=s.width/a.width):(a.width=Math.min(s.width,o.width),a.height=Math.min(s.height,o.height),r=1),"boolean"==typeof s.crop&&(s.crop="cc"),s.crop.toLowerCase().replace(/_/,"-")){case"rb":case"right-bottom":a.x=o.width-a.width,a.y=o.height-a.height;break;case"cb":case"center-bottom":a.x=Math.floor((o.width-a.width)/2),a.y=o.height-a.height;break;case"lb":case"left-bottom":a.x=0,a.y=o.height-a.height;break;case"lt":case"left-top":a.x=0,a.y=0;break;case"ct":case"center-top":a.x=Math.floor((o.width-a.width)/2),a.y=0;break;case"rt":case"right-top":a.x=o.width-a.width,a.y=0;break;case"rc":case"right-center":case"right-middle":a.x=o.width-a.width,a.y=Math.floor((o.height-a.height)/2);break;case"lc":case"left-center":case"left-middle":a.x=0,a.y=Math.floor((o.height-a.height)/2);break;case"cc":case"center-center":case"center-middle":default:a.x=Math.floor((o.width-a.width)/2),a.y=Math.floor((o.height-a.height)/2)}a.x=Math.max(a.x,0),a.y=Math.max(a.y,0)}else r=Math.min(s.width/o.width,s.height/o.height),r>1&&!s.fit&&(r=1);this.exec("Image","resize",a,r,s)}catch(c){o.trigger("error",c.code)}},downsize:function(t){var i,n={width:this.width,height:this.height,type:this.type||"image/jpeg",quality:90,crop:!1,fit:!1,preserveHeaders:!0,resample:"default"};i="object"==typeof t?e.extend(n,t):e.extend(n,{width:arguments[0],height:arguments[1],crop:arguments[2],preserveHeaders:arguments[3]}),this.resize(i)},crop:function(e,t,i){this.downsize(e,t,!0,i)},getAsCanvas:function(){if(!u.can("create_canvas"))throw new i.RuntimeError(i.RuntimeError.NOT_SUPPORTED_ERR);return this.exec("Image","getAsCanvas")},getAsBlob:function(e,t){if(!this.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);return this.exec("Image","getAsBlob",e||"image/jpeg",t||90)},getAsDataURL:function(e,t){if(!this.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);return this.exec("Image","getAsDataURL",e||"image/jpeg",t||90)},getAsBinaryString:function(e,t){var i=this.getAsDataURL(e,t);return m.atob(i.substring(i.indexOf("base64,")+7))},embed:function(n,r){function o(t,r){var o=this;if(u.can("create_canvas")){var l=o.getAsCanvas();if(l)return n.appendChild(l),l=null,o.destroy(),c.trigger("embedded"),void 0}var d=o.getAsDataURL(t,r);if(!d)throw new i.ImageError(i.ImageError.WRONG_FORMAT);if(u.can("use_data_uri_of",d.length))n.innerHTML='<img src="'+d+'" width="'+o.width+'" height="'+o.height+'" alt="" />',o.destroy(),c.trigger("embedded");else{var h=new s;h.bind("TransportingComplete",function(){a=c.connectRuntime(this.result.ruid),c.bind("Embedded",function(){e.extend(a.getShimContainer().style,{top:"0px",left:"0px",width:o.width+"px",height:o.height+"px"}),a=null},999),a.exec.call(c,"ImageView","display",this.result.uid,width,height),o.destroy()}),h.transport(m.atob(d.substring(d.indexOf("base64,")+7)),t,{required_caps:{display_media:!0},runtime_order:"flash,silverlight",container:n})}}var a,c=this,l=e.extend({width:this.width,height:this.height,type:this.type||"image/jpeg",quality:90,fit:!0,resample:"nearest"},r);try{if(!(n=t.get(n)))throw new i.DOMException(i.DOMException.INVALID_NODE_TYPE_ERR);if(!this.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);this.width>h.MAX_RESIZE_WIDTH||this.height>h.MAX_RESIZE_HEIGHT;var d=new h;return d.bind("Resize",function(){o.call(this,l.type,l.quality)}),d.bind("Load",function(){this.downsize(l)}),this.meta.thumb&&this.meta.thumb.width>=l.width&&this.meta.thumb.height>=l.height?d.load(this.meta.thumb.data):d.clone(this,!1),d}catch(f){this.trigger("error",f.code)}},destroy:function(){this.ruid&&(this.getRuntime().exec.call(this,"Image","destroy"),this.disconnectRuntime()),this.meta&&this.meta.thumb&&this.meta.thumb.data.destroy(),this.unbindAll()}}),this.handleEventProps(f),this.bind("Load Resize",function(){return n.call(this)},999)}var f=["progress","load","error","resize","embedded"];return h.MAX_RESIZE_WIDTH=8192,h.MAX_RESIZE_HEIGHT=8192,h.prototype=c.instance,h}),n("moxie/runtime/html5/Runtime",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/runtime/Runtime","moxie/core/utils/Env"],function(e,t,i,n){function o(t){var o=this,u=i.capTest,c=i.capTrue,l=e.extend({access_binary:u(window.FileReader||window.File&&window.File.getAsDataURL),access_image_binary:function(){return o.can("access_binary")&&!!s.Image},display_media:u((n.can("create_canvas")||n.can("use_data_uri_over32kb"))&&r("moxie/image/Image")),do_cors:u(window.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest),drag_and_drop:u(function(){var e=document.createElement("div");return("draggable"in e||"ondragstart"in e&&"ondrop"in e)&&("IE"!==n.browser||n.verComp(n.version,9,">"))}()),filter_by_extension:u(function(){return!("Chrome"===n.browser&&n.verComp(n.version,28,"<")||"IE"===n.browser&&n.verComp(n.version,10,"<")||"Safari"===n.browser&&n.verComp(n.version,7,"<")||"Firefox"===n.browser&&n.verComp(n.version,37,"<"))}()),return_response_headers:c,return_response_type:function(e){return"json"===e&&window.JSON?!0:n.can("return_response_type",e)},return_status_code:c,report_upload_progress:u(window.XMLHttpRequest&&(new XMLHttpRequest).upload),resize_image:function(){return o.can("access_binary")&&n.can("create_canvas")},select_file:function(){return n.can("use_fileinput")&&window.File},select_folder:function(){return o.can("select_file")&&("Chrome"===n.browser&&n.verComp(n.version,21,">=")||"Firefox"===n.browser&&n.verComp(n.version,42,">="))},select_multiple:function(){return!(!o.can("select_file")||"Safari"===n.browser&&"Windows"===n.os||"iOS"===n.os&&n.verComp(n.osVersion,"7.0.0",">")&&n.verComp(n.osVersion,"8.0.0","<"))},send_binary_string:u(window.XMLHttpRequest&&((new XMLHttpRequest).sendAsBinary||window.Uint8Array&&window.ArrayBuffer)),send_custom_headers:u(window.XMLHttpRequest),send_multipart:function(){return!!(window.XMLHttpRequest&&(new XMLHttpRequest).upload&&window.FormData)||o.can("send_binary_string")},slice_blob:u(window.File&&(File.prototype.mozSlice||File.prototype.webkitSlice||File.prototype.slice)),stream_upload:function(){return o.can("slice_blob")&&o.can("send_multipart")},summon_file_dialog:function(){return o.can("select_file")&&!("Firefox"===n.browser&&n.verComp(n.version,4,"<")||"Opera"===n.browser&&n.verComp(n.version,12,"<")||"IE"===n.browser&&n.verComp(n.version,10,"<"))},upload_filesize:c,use_http_method:c},arguments[2]);i.call(this,t,arguments[1]||a,l),e.extend(this,{init:function(){this.trigger("Init")},destroy:function(e){return function(){e.call(o),e=o=null}}(this.destroy)}),e.extend(this.getShim(),s)}var a="html5",s={};return i.addConstructor(a,o),s}),n("moxie/runtime/html5/file/Blob",["moxie/runtime/html5/Runtime","moxie/file/Blob"],function(e,t){function i(){function e(e,t,i){var n;if(!window.File.prototype.slice)return(n=window.File.prototype.webkitSlice||window.File.prototype.mozSlice)?n.call(e,t,i):null;try{return e.slice(),e.slice(t,i)}catch(r){return e.slice(t,i-t)}}this.slice=function(){return new t(this.getRuntime().uid,e.apply(this,arguments))},this.destroy=function(){this.getRuntime().getShim().removeInstance(this.uid)}}return e.Blob=i}),n("moxie/core/utils/Events",["moxie/core/utils/Basic"],function(e){function t(){this.returnValue=!1}function i(){this.cancelBubble=!0}var n={},r="moxie_"+e.guid(),o=function(o,a,s,u){var c,l;a=a.toLowerCase(),o.addEventListener?(c=s,o.addEventListener(a,c,!1)):o.attachEvent&&(c=function(){var e=window.event;e.target||(e.target=e.srcElement),e.preventDefault=t,e.stopPropagation=i,s(e)},o.attachEvent("on"+a,c)),o[r]||(o[r]=e.guid()),n.hasOwnProperty(o[r])||(n[o[r]]={}),l=n[o[r]],l.hasOwnProperty(a)||(l[a]=[]),l[a].push({func:c,orig:s,key:u})},a=function(t,i,o){var a,s;if(i=i.toLowerCase(),t[r]&&n[t[r]]&&n[t[r]][i]){a=n[t[r]][i];for(var u=a.length-1;u>=0&&(a[u].orig!==o&&a[u].key!==o||(t.removeEventListener?t.removeEventListener(i,a[u].func,!1):t.detachEvent&&t.detachEvent("on"+i,a[u].func),a[u].orig=null,a[u].func=null,a.splice(u,1),o===s));u--);if(a.length||delete n[t[r]][i],e.isEmptyObj(n[t[r]])){delete n[t[r]];try{delete t[r]}catch(c){t[r]=s}}}},s=function(t,i){t&&t[r]&&e.each(n[t[r]],function(e,n){a(t,n,i)})};return{addEvent:o,removeEvent:a,removeAllEvents:s}}),n("moxie/runtime/html5/file/FileInput",["moxie/runtime/html5/Runtime","moxie/file/File","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/utils/Events","moxie/core/utils/Mime","moxie/core/utils/Env"],function(e,t,i,n,r,o,a){function s(){var e,s;i.extend(this,{init:function(u){var c,l,d,m,h,f,p=this,g=p.getRuntime();e=u,d=o.extList2mimes(e.accept,g.can("filter_by_extension")),l=g.getShimContainer(),l.innerHTML='<input id="'+g.uid+'" type="file" style="font-size:999px;opacity:0;"'+(e.multiple&&g.can("select_multiple")?"multiple":"")+(e.directory&&g.can("select_folder")?"webkitdirectory directory":"")+(d?' accept="'+d.join(",")+'"':"")+" />",c=n.get(g.uid),i.extend(c.style,{position:"absolute",top:0,left:0,width:"100%",height:"100%"}),m=n.get(e.browse_button),s=n.getStyle(m,"z-index")||"auto",g.can("summon_file_dialog")&&("static"===n.getStyle(m,"position")&&(m.style.position="relative"),r.addEvent(m,"click",function(e){var t=n.get(g.uid);t&&!t.disabled&&t.click(),e.preventDefault()},p.uid),p.bind("Refresh",function(){h=parseInt(s,10)||1,n.get(e.browse_button).style.zIndex=h,this.getRuntime().getShimContainer().style.zIndex=h-1})),f=g.can("summon_file_dialog")?m:l,r.addEvent(f,"mouseover",function(){p.trigger("mouseenter")},p.uid),r.addEvent(f,"mouseout",function(){p.trigger("mouseleave")},p.uid),r.addEvent(f,"mousedown",function(){p.trigger("mousedown")},p.uid),r.addEvent(n.get(e.container),"mouseup",function(){p.trigger("mouseup")},p.uid),(g.can("summon_file_dialog")?c:m).setAttribute("tabindex",-1),c.onchange=function x(){if(p.files=[],i.each(this.files,function(i){var n="";return e.directory&&"."==i.name?!0:(i.webkitRelativePath&&(n="/"+i.webkitRelativePath.replace(/^\//,"")),i=new t(g.uid,i),i.relativePath=n,p.files.push(i),void 0)}),"IE"!==a.browser&&"IEMobile"!==a.browser)this.value="";else{var n=this.cloneNode(!0);this.parentNode.replaceChild(n,this),n.onchange=x}p.files.length&&p.trigger("change")},p.trigger({type:"ready",async:!0}),l=null},setOption:function(e,t){var i=this.getRuntime(),r=n.get(i.uid);switch(e){case"accept":if(t){var a=t.mimes||o.extList2mimes(t,i.can("filter_by_extension"));r.setAttribute("accept",a.join(","))}else r.removeAttribute("accept");break;case"directory":t&&i.can("select_folder")?(r.setAttribute("directory",""),r.setAttribute("webkitdirectory","")):(r.removeAttribute("directory"),r.removeAttribute("webkitdirectory"));break;case"multiple":t&&i.can("select_multiple")?r.setAttribute("multiple",""):r.removeAttribute("multiple")}},disable:function(e){var t,i=this.getRuntime();(t=n.get(i.uid))&&(t.disabled=!!e)},destroy:function(){var t=this.getRuntime(),i=t.getShim(),o=t.getShimContainer(),a=e&&n.get(e.container),u=e&&n.get(e.browse_button);a&&r.removeAllEvents(a,this.uid),u&&(r.removeAllEvents(u,this.uid),u.style.zIndex=s),o&&(r.removeAllEvents(o,this.uid),o.innerHTML=""),i.removeInstance(this.uid),e=o=a=u=i=null}})}return e.FileInput=s}),n("moxie/runtime/html5/file/FileDrop",["moxie/runtime/html5/Runtime","moxie/file/File","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/utils/Events","moxie/core/utils/Mime"],function(e,t,i,n,r,o){function a(){function e(e){if(!e.dataTransfer||!e.dataTransfer.types)return!1;var t=i.toArray(e.dataTransfer.types||[]);return-1!==i.inArray("Files",t)||-1!==i.inArray("public.file-url",t)||-1!==i.inArray("application/x-moz-file",t)}function a(e,i){if(u(e)){var n=new t(f,e);n.relativePath=i||"",p.push(n)}}function s(e){for(var t=[],n=0;n<e.length;n++)[].push.apply(t,e[n].extensions.split(/\s*,\s*/));return-1===i.inArray("*",t)?t:[]}function u(e){if(!g.length)return!0;var t=o.getFileExtension(e.name);return!t||-1!==i.inArray(t,g)}function c(e,t){var n=[];i.each(e,function(e){var t=e.webkitGetAsEntry();t&&(t.isFile?a(e.getAsFile(),t.fullPath):n.push(t))}),n.length?l(n,t):t()}function l(e,t){var n=[];i.each(e,function(e){n.push(function(t){d(e,t)})}),i.inSeries(n,function(){t()})}function d(e,t){e.isFile?e.file(function(i){a(i,e.fullPath),t()},function(){t()}):e.isDirectory?m(e,t):t()}function m(e,t){function i(e){r.readEntries(function(t){t.length?([].push.apply(n,t),i(e)):e()},e)}var n=[],r=e.createReader();i(function(){l(n,t)})}var h,f,p=[],g=[];i.extend(this,{init:function(t){var n,o=this;h=t,f=o.ruid,g=s(h.accept),n=h.container,r.addEvent(n,"dragover",function(t){e(t)&&(t.preventDefault(),t.dataTransfer.dropEffect="copy")},o.uid),r.addEvent(n,"drop",function(t){e(t)&&(t.preventDefault(),p=[],t.dataTransfer.items&&t.dataTransfer.items[0].webkitGetAsEntry?c(t.dataTransfer.items,function(){o.files=p,o.trigger("drop")}):(i.each(t.dataTransfer.files,function(e){a(e)}),o.files=p,o.trigger("drop")))},o.uid),r.addEvent(n,"dragenter",function(){o.trigger("dragenter")},o.uid),r.addEvent(n,"dragleave",function(){o.trigger("dragleave")},o.uid)},destroy:function(){r.removeAllEvents(h&&n.get(h.container),this.uid),f=p=g=h=null,this.getRuntime().getShim().removeInstance(this.uid)}})}return e.FileDrop=a}),n("moxie/runtime/html5/file/FileReader",["moxie/runtime/html5/Runtime","moxie/core/utils/Encode","moxie/core/utils/Basic"],function(e,t,i){function n(){function e(e){return t.atob(e.substring(e.indexOf("base64,")+7))}var n,r=!1;i.extend(this,{read:function(t,o){var a=this;a.result="",n=new window.FileReader,n.addEventListener("progress",function(e){a.trigger(e)}),n.addEventListener("load",function(t){a.result=r?e(n.result):n.result,a.trigger(t)}),n.addEventListener("error",function(e){a.trigger(e,n.error)}),n.addEventListener("loadend",function(e){n=null,a.trigger(e)}),"function"===i.typeOf(n[t])?(r=!1,n[t](o.getSource())):"readAsBinaryString"===t&&(r=!0,n.readAsDataURL(o.getSource()))},abort:function(){n&&n.abort()},destroy:function(){n=null,this.getRuntime().getShim().removeInstance(this.uid)}})}return e.FileReader=n}),n("moxie/runtime/html5/xhr/XMLHttpRequest",["moxie/runtime/html5/Runtime","moxie/core/utils/Basic","moxie/core/utils/Mime","moxie/core/utils/Url","moxie/file/File","moxie/file/Blob","moxie/xhr/FormData","moxie/core/Exceptions","moxie/core/utils/Env"],function(e,t,i,n,r,o,a,s,u){function c(){function e(e,t){var i,n,r=this;i=t.getBlob().getSource(),n=new window.FileReader,n.onload=function(){t.append(t.getBlobName(),new o(null,{type:i.type,data:n.result})),f.send.call(r,e,t)},n.readAsBinaryString(i)}function c(){return!window.XMLHttpRequest||"IE"===u.browser&&u.verComp(u.version,8,"<")?function(){for(var e=["Msxml2.XMLHTTP.6.0","Microsoft.XMLHTTP"],t=0;t<e.length;t++)try{return new ActiveXObject(e[t])}catch(i){}}():new window.XMLHttpRequest}function l(e){var t=e.responseXML,i=e.responseText;return"IE"===u.browser&&i&&t&&!t.documentElement&&/[^\/]+\/[^\+]+\+xml/.test(e.getResponseHeader("Content-Type"))&&(t=new window.ActiveXObject("Microsoft.XMLDOM"),t.async=!1,t.validateOnParse=!1,t.loadXML(i)),t&&("IE"===u.browser&&0!==t.parseError||!t.documentElement||"parsererror"===t.documentElement.tagName)?null:t
	}function d(e){var t="----moxieboundary"+(new Date).getTime(),i="--",n="\r\n",r="",a=this.getRuntime();if(!a.can("send_binary_string"))throw new s.RuntimeError(s.RuntimeError.NOT_SUPPORTED_ERR);return m.setRequestHeader("Content-Type","multipart/form-data; boundary="+t),e.each(function(e,a){r+=e instanceof o?i+t+n+'Content-Disposition: form-data; name="'+a+'"; filename="'+unescape(encodeURIComponent(e.name||"blob"))+'"'+n+"Content-Type: "+(e.type||"application/octet-stream")+n+n+e.getSource()+n:i+t+n+'Content-Disposition: form-data; name="'+a+'"'+n+n+unescape(encodeURIComponent(e))+n}),r+=i+t+i+n}var m,h,f=this;t.extend(this,{send:function(i,r){var s=this,l="Mozilla"===u.browser&&u.verComp(u.version,4,">=")&&u.verComp(u.version,7,"<"),f="Android Browser"===u.browser,p=!1;if(h=i.url.replace(/^.+?\/([\w\-\.]+)$/,"$1").toLowerCase(),m=c(),m.open(i.method,i.url,i.async,i.user,i.password),r instanceof o)r.isDetached()&&(p=!0),r=r.getSource();else if(r instanceof a){if(r.hasBlob())if(r.getBlob().isDetached())r=d.call(s,r),p=!0;else if((l||f)&&"blob"===t.typeOf(r.getBlob().getSource())&&window.FileReader)return e.call(s,i,r),void 0;if(r instanceof a){var g=new window.FormData;r.each(function(e,t){e instanceof o?g.append(t,e.getSource()):g.append(t,e)}),r=g}}m.upload?(i.withCredentials&&(m.withCredentials=!0),m.addEventListener("load",function(e){s.trigger(e)}),m.addEventListener("error",function(e){s.trigger(e)}),m.addEventListener("progress",function(e){s.trigger(e)}),m.upload.addEventListener("progress",function(e){s.trigger({type:"UploadProgress",loaded:e.loaded,total:e.total})})):m.onreadystatechange=function(){switch(m.readyState){case 1:break;case 2:break;case 3:var e,t;try{n.hasSameOrigin(i.url)&&(e=m.getResponseHeader("Content-Length")||0),m.responseText&&(t=m.responseText.length)}catch(r){e=t=0}s.trigger({type:"progress",lengthComputable:!!e,total:parseInt(e,10),loaded:t});break;case 4:m.onreadystatechange=function(){};try{if(m.status>=200&&m.status<400){s.trigger("load");break}}catch(r){}s.trigger("error")}},t.isEmptyObj(i.headers)||t.each(i.headers,function(e,t){m.setRequestHeader(t,e)}),""!==i.responseType&&"responseType"in m&&(m.responseType="json"!==i.responseType||u.can("return_response_type","json")?i.responseType:"text"),p?m.sendAsBinary?m.sendAsBinary(r):function(){for(var e=new Uint8Array(r.length),t=0;t<r.length;t++)e[t]=255&r.charCodeAt(t);m.send(e.buffer)}():m.send(r),s.trigger("loadstart")},getStatus:function(){try{if(m)return m.status}catch(e){}return 0},getResponse:function(e){var t=this.getRuntime();try{switch(e){case"blob":var n=new r(t.uid,m.response),o=m.getResponseHeader("Content-Disposition");if(o){var a=o.match(/filename=([\'\"'])([^\1]+)\1/);a&&(h=a[2])}return n.name=h,n.type||(n.type=i.getFileMime(h)),n;case"json":return u.can("return_response_type","json")?m.response:200===m.status&&window.JSON?JSON.parse(m.responseText):null;case"document":return l(m);default:return""!==m.responseText?m.responseText:null}}catch(s){return null}},getAllResponseHeaders:function(){try{return m.getAllResponseHeaders()}catch(e){}return""},abort:function(){m&&m.abort()},destroy:function(){f=h=null,this.getRuntime().getShim().removeInstance(this.uid)}})}return e.XMLHttpRequest=c}),n("moxie/runtime/html5/utils/BinaryReader",["moxie/core/utils/Basic"],function(e){function t(e){e instanceof ArrayBuffer?i.apply(this,arguments):n.apply(this,arguments)}function i(t){var i=new DataView(t);e.extend(this,{readByteAt:function(e){return i.getUint8(e)},writeByteAt:function(e,t){i.setUint8(e,t)},SEGMENT:function(e,n,r){switch(arguments.length){case 2:return t.slice(e,e+n);case 1:return t.slice(e);case 3:if(null===r&&(r=new ArrayBuffer),r instanceof ArrayBuffer){var o=new Uint8Array(this.length()-n+r.byteLength);e>0&&o.set(new Uint8Array(t.slice(0,e)),0),o.set(new Uint8Array(r),e),o.set(new Uint8Array(t.slice(e+n)),e+r.byteLength),this.clear(),t=o.buffer,i=new DataView(t);break}default:return t}},length:function(){return t?t.byteLength:0},clear:function(){i=t=null}})}function n(t){function i(e,i,n){n=3===arguments.length?n:t.length-i-1,t=t.substr(0,i)+e+t.substr(n+i)}e.extend(this,{readByteAt:function(e){return t.charCodeAt(e)},writeByteAt:function(e,t){i(String.fromCharCode(t),e,1)},SEGMENT:function(e,n,r){switch(arguments.length){case 1:return t.substr(e);case 2:return t.substr(e,n);case 3:i(null!==r?r:"",e,n);break;default:return t}},length:function(){return t?t.length:0},clear:function(){t=null}})}return e.extend(t.prototype,{littleEndian:!1,read:function(e,t){var i,n,r;if(e+t>this.length())throw new Error("You are trying to read outside the source boundaries.");for(n=this.littleEndian?0:-8*(t-1),r=0,i=0;t>r;r++)i|=this.readByteAt(e+r)<<Math.abs(n+8*r);return i},write:function(e,t,i){var n,r;if(e>this.length())throw new Error("You are trying to write outside the source boundaries.");for(n=this.littleEndian?0:-8*(i-1),r=0;i>r;r++)this.writeByteAt(e+r,255&t>>Math.abs(n+8*r))},BYTE:function(e){return this.read(e,1)},SHORT:function(e){return this.read(e,2)},LONG:function(e){return this.read(e,4)},SLONG:function(e){var t=this.read(e,4);return t>2147483647?t-4294967296:t},CHAR:function(e){return String.fromCharCode(this.read(e,1))},STRING:function(e,t){return this.asArray("CHAR",e,t).join("")},asArray:function(e,t,i){for(var n=[],r=0;i>r;r++)n[r]=this[e](t+r);return n}}),t}),n("moxie/runtime/html5/image/JPEGHeaders",["moxie/runtime/html5/utils/BinaryReader","moxie/core/Exceptions"],function(e,t){return function i(n){var r,o,a,s=[],u=0;if(r=new e(n),65496!==r.SHORT(0))throw r.clear(),new t.ImageError(t.ImageError.WRONG_FORMAT);for(o=2;o<=r.length();)if(a=r.SHORT(o),a>=65488&&65495>=a)o+=2;else{if(65498===a||65497===a)break;u=r.SHORT(o+2)+2,a>=65505&&65519>=a&&s.push({hex:a,name:"APP"+(15&a),start:o,length:u,segment:r.SEGMENT(o,u)}),o+=u}return r.clear(),{headers:s,restore:function(t){var i,n,r;for(r=new e(t),o=65504==r.SHORT(2)?4+r.SHORT(4):2,n=0,i=s.length;i>n;n++)r.SEGMENT(o,0,s[n].segment),o+=s[n].length;return t=r.SEGMENT(),r.clear(),t},strip:function(t){var n,r,o,a;for(o=new i(t),r=o.headers,o.purge(),n=new e(t),a=r.length;a--;)n.SEGMENT(r[a].start,r[a].length,"");return t=n.SEGMENT(),n.clear(),t},get:function(e){for(var t=[],i=0,n=s.length;n>i;i++)s[i].name===e.toUpperCase()&&t.push(s[i].segment);return t},set:function(e,t){var i,n,r,o=[];for("string"==typeof t?o.push(t):o=t,i=n=0,r=s.length;r>i&&(s[i].name===e.toUpperCase()&&(s[i].segment=o[n],s[i].length=o[n].length,n++),!(n>=o.length));i++);},purge:function(){this.headers=s=[]}}}}),n("moxie/runtime/html5/image/ExifParser",["moxie/core/utils/Basic","moxie/runtime/html5/utils/BinaryReader","moxie/core/Exceptions"],function(e,i,n){function r(o){function a(i,r){var o,a,s,u,c,m,h,f,p=this,g=[],x={},v={1:"BYTE",7:"UNDEFINED",2:"ASCII",3:"SHORT",4:"LONG",5:"RATIONAL",9:"SLONG",10:"SRATIONAL"},w={BYTE:1,UNDEFINED:1,ASCII:1,SHORT:2,LONG:4,RATIONAL:8,SLONG:4,SRATIONAL:8};for(o=p.SHORT(i),a=0;o>a;a++)if(g=[],h=i+2+12*a,s=r[p.SHORT(h)],s!==t){if(u=v[p.SHORT(h+=2)],c=p.LONG(h+=2),m=w[u],!m)throw new n.ImageError(n.ImageError.INVALID_META_ERR);if(h+=4,m*c>4&&(h=p.LONG(h)+d.tiffHeader),h+m*c>=this.length())throw new n.ImageError(n.ImageError.INVALID_META_ERR);"ASCII"!==u?(g=p.asArray(u,h,c),f=1==c?g[0]:g,x[s]=l.hasOwnProperty(s)&&"object"!=typeof f?l[s][f]:f):x[s]=e.trim(p.STRING(h,c).replace(/\0$/,""))}return x}function s(e,t,i){var n,r,o,a=0;if("string"==typeof t){var s=c[e.toLowerCase()];for(var u in s)if(s[u]===t){t=u;break}}n=d[e.toLowerCase()+"IFD"],r=this.SHORT(n);for(var l=0;r>l;l++)if(o=n+12*l+2,this.SHORT(o)==t){a=o+8;break}if(!a)return!1;try{this.write(a,i,4)}catch(m){return!1}return!0}var u,c,l,d,m,h;if(i.call(this,o),c={tiff:{274:"Orientation",270:"ImageDescription",271:"Make",272:"Model",305:"Software",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer"},exif:{36864:"ExifVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",36867:"DateTimeOriginal",33434:"ExposureTime",33437:"FNumber",34855:"ISOSpeedRatings",37377:"ShutterSpeedValue",37378:"ApertureValue",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37386:"FocalLength",41986:"ExposureMode",41987:"WhiteBalance",41990:"SceneCaptureType",41988:"DigitalZoomRatio",41992:"Contrast",41993:"Saturation",41994:"Sharpness"},gps:{0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude"},thumb:{513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength"}},l={ColorSpace:{1:"sRGB",0:"Uncalibrated"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{1:"Daylight",2:"Fliorescent",3:"Tungsten",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 -5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},ExposureMode:{0:"Auto exposure",1:"Manual exposure",2:"Auto bracket"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},GPSLatitudeRef:{N:"North latitude",S:"South latitude"},GPSLongitudeRef:{E:"East longitude",W:"West longitude"}},d={tiffHeader:10},m=d.tiffHeader,u={clear:this.clear},e.extend(this,{read:function(){try{return r.prototype.read.apply(this,arguments)}catch(e){throw new n.ImageError(n.ImageError.INVALID_META_ERR)}},write:function(){try{return r.prototype.write.apply(this,arguments)}catch(e){throw new n.ImageError(n.ImageError.INVALID_META_ERR)}},UNDEFINED:function(){return this.BYTE.apply(this,arguments)},RATIONAL:function(e){return this.LONG(e)/this.LONG(e+4)},SRATIONAL:function(e){return this.SLONG(e)/this.SLONG(e+4)},ASCII:function(e){return this.CHAR(e)},TIFF:function(){return h||null},EXIF:function(){var t=null;if(d.exifIFD){try{t=a.call(this,d.exifIFD,c.exif)}catch(i){return null}if(t.ExifVersion&&"array"===e.typeOf(t.ExifVersion)){for(var n=0,r="";n<t.ExifVersion.length;n++)r+=String.fromCharCode(t.ExifVersion[n]);t.ExifVersion=r}}return t},GPS:function(){var t=null;if(d.gpsIFD){try{t=a.call(this,d.gpsIFD,c.gps)}catch(i){return null}t.GPSVersionID&&"array"===e.typeOf(t.GPSVersionID)&&(t.GPSVersionID=t.GPSVersionID.join("."))}return t},thumb:function(){if(d.IFD1)try{var e=a.call(this,d.IFD1,c.thumb);if("JPEGInterchangeFormat"in e)return this.SEGMENT(d.tiffHeader+e.JPEGInterchangeFormat,e.JPEGInterchangeFormatLength)}catch(t){}return null},setExif:function(e,t){return"PixelXDimension"!==e&&"PixelYDimension"!==e?!1:s.call(this,"exif",e,t)},clear:function(){u.clear(),o=c=l=h=d=u=null}}),65505!==this.SHORT(0)||"EXIF\0"!==this.STRING(4,5).toUpperCase())throw new n.ImageError(n.ImageError.INVALID_META_ERR);if(this.littleEndian=18761==this.SHORT(m),42!==this.SHORT(m+=2))throw new n.ImageError(n.ImageError.INVALID_META_ERR);d.IFD0=d.tiffHeader+this.LONG(m+=2),h=a.call(this,d.IFD0,c.tiff),"ExifIFDPointer"in h&&(d.exifIFD=d.tiffHeader+h.ExifIFDPointer,delete h.ExifIFDPointer),"GPSInfoIFDPointer"in h&&(d.gpsIFD=d.tiffHeader+h.GPSInfoIFDPointer,delete h.GPSInfoIFDPointer),e.isEmptyObj(h)&&(h=null);var f=this.LONG(d.IFD0+12*this.SHORT(d.IFD0)+2);f&&(d.IFD1=d.tiffHeader+f)}return r.prototype=i.prototype,r}),n("moxie/runtime/html5/image/JPEG",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/runtime/html5/image/JPEGHeaders","moxie/runtime/html5/utils/BinaryReader","moxie/runtime/html5/image/ExifParser"],function(e,t,i,n,r){function o(o){function a(e){var t,i,n=0;for(e||(e=c);n<=e.length();){if(t=e.SHORT(n+=2),t>=65472&&65475>=t)return n+=5,{height:e.SHORT(n),width:e.SHORT(n+=2)};i=e.SHORT(n+=2),n+=i-2}return null}function s(){var e,t,i=d.thumb();return i&&(e=new n(i),t=a(e),e.clear(),t)?(t.data=i,t):null}function u(){d&&l&&c&&(d.clear(),l.purge(),c.clear(),m=l=d=c=null)}var c,l,d,m;if(c=new n(o),65496!==c.SHORT(0))throw new t.ImageError(t.ImageError.WRONG_FORMAT);l=new i(o);try{d=new r(l.get("app1")[0])}catch(h){}m=a.call(this),e.extend(this,{type:"image/jpeg",size:c.length(),width:m&&m.width||0,height:m&&m.height||0,setExif:function(t,i){return d?("object"===e.typeOf(t)?e.each(t,function(e,t){d.setExif(t,e)}):d.setExif(t,i),l.set("app1",d.SEGMENT()),void 0):!1},writeHeaders:function(){return arguments.length?l.restore(arguments[0]):l.restore(o)},stripHeaders:function(e){return l.strip(e)},purge:function(){u.call(this)}}),d&&(this.meta={tiff:d.TIFF(),exif:d.EXIF(),gps:d.GPS(),thumb:s()})}return o}),n("moxie/runtime/html5/image/PNG",["moxie/core/Exceptions","moxie/core/utils/Basic","moxie/runtime/html5/utils/BinaryReader"],function(e,t,i){function n(n){function r(){var e,t;return e=a.call(this,8),"IHDR"==e.type?(t=e.start,{width:s.LONG(t),height:s.LONG(t+=4)}):null}function o(){s&&(s.clear(),n=l=u=c=s=null)}function a(e){var t,i,n,r;return t=s.LONG(e),i=s.STRING(e+=4,4),n=e+=4,r=s.LONG(e+t),{length:t,type:i,start:n,CRC:r}}var s,u,c,l;s=new i(n),function(){var t=0,i=0,n=[35152,20039,3338,6666];for(i=0;i<n.length;i++,t+=2)if(n[i]!=s.SHORT(t))throw new e.ImageError(e.ImageError.WRONG_FORMAT)}(),l=r.call(this),t.extend(this,{type:"image/png",size:s.length(),width:l.width,height:l.height,purge:function(){o.call(this)}}),o.call(this)}return n}),n("moxie/runtime/html5/image/ImageInfo",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/runtime/html5/image/JPEG","moxie/runtime/html5/image/PNG"],function(e,t,i,n){return function(r){var o,a=[i,n];o=function(){for(var e=0;e<a.length;e++)try{return new a[e](r)}catch(i){}throw new t.ImageError(t.ImageError.WRONG_FORMAT)}(),e.extend(this,{type:"",size:0,width:0,height:0,setExif:function(){},writeHeaders:function(e){return e},stripHeaders:function(e){return e},purge:function(){r=null}}),e.extend(this,o),this.purge=function(){o.purge(),o=null}}}),n("moxie/runtime/html5/image/ResizerCanvas",[],function(){function e(i,n,r){var o=i.width>i.height?"width":"height",a=Math.round(i[o]*n),s=!1;"nearest"!==r&&(.5>n||n>2)&&(n=.5>n?.5:2,s=!0);var u=t(i,n);return s?e(u,a/u[o],r):u}function t(e,t){var i=e.width,n=e.height,r=Math.round(i*t),o=Math.round(n*t),a=document.createElement("canvas");return a.width=r,a.height=o,a.getContext("2d").drawImage(e,0,0,i,n,0,0,r,o),e=null,a}return{scale:e}}),n("moxie/runtime/html5/image/Image",["moxie/runtime/html5/Runtime","moxie/core/utils/Basic","moxie/core/Exceptions","moxie/core/utils/Encode","moxie/file/Blob","moxie/file/File","moxie/runtime/html5/image/ImageInfo","moxie/runtime/html5/image/ResizerCanvas","moxie/core/utils/Mime","moxie/core/utils/Env"],function(e,t,i,n,r,o,a,s,u){function c(){function e(){if(!v&&!g)throw new i.ImageError(i.DOMException.INVALID_STATE_ERR);return v||g}function c(){var t=e();return"canvas"==t.nodeName.toLowerCase()?t:(v=document.createElement("canvas"),v.width=t.width,v.height=t.height,v.getContext("2d").drawImage(t,0,0),v)}function l(e){return n.atob(e.substring(e.indexOf("base64,")+7))}function d(e,t){return"data:"+(t||"")+";base64,"+n.btoa(e)}function m(e){var t=this;g=new Image,g.onerror=function(){p.call(this),t.trigger("error",i.ImageError.WRONG_FORMAT)},g.onload=function(){t.trigger("load")},g.src="data:"==e.substr(0,5)?e:d(e,y.type)}function h(e,t){var n,r=this;return window.FileReader?(n=new FileReader,n.onload=function(){t.call(r,this.result)},n.onerror=function(){r.trigger("error",i.ImageError.WRONG_FORMAT)},n.readAsDataURL(e),void 0):t.call(this,e.getAsDataURL())}function f(e,i){var n=Math.PI/180,r=document.createElement("canvas"),o=r.getContext("2d"),a=e.width,s=e.height;switch(t.inArray(i,[5,6,7,8])>-1?(r.width=s,r.height=a):(r.width=a,r.height=s),i){case 2:o.translate(a,0),o.scale(-1,1);break;case 3:o.translate(a,s),o.rotate(180*n);break;case 4:o.translate(0,s),o.scale(1,-1);break;case 5:o.rotate(90*n),o.scale(1,-1);break;case 6:o.rotate(90*n),o.translate(0,-s);break;case 7:o.rotate(90*n),o.translate(a,-s),o.scale(-1,1);break;case 8:o.rotate(-90*n),o.translate(-a,0)}return o.drawImage(e,0,0,a,s),r}function p(){x&&(x.purge(),x=null),w=g=v=y=null,b=!1}var g,x,v,w,y,E=this,b=!1,_=!0;t.extend(this,{loadFromBlob:function(e){var t=this.getRuntime(),n=arguments.length>1?arguments[1]:!0;if(!t.can("access_binary"))throw new i.RuntimeError(i.RuntimeError.NOT_SUPPORTED_ERR);return y=e,e.isDetached()?(w=e.getSource(),m.call(this,w),void 0):(h.call(this,e.getSource(),function(e){n&&(w=l(e)),m.call(this,e)}),void 0)},loadFromImage:function(e,t){this.meta=e.meta,y=new o(null,{name:e.name,size:e.size,type:e.type}),m.call(this,t?w=e.getAsBinaryString():e.getAsDataURL())},getInfo:function(){var t,i=this.getRuntime();return!x&&w&&i.can("access_image_binary")&&(x=new a(w)),t={width:e().width||0,height:e().height||0,type:y.type||u.getFileMime(y.name),size:w&&w.length||y.size||0,name:y.name||"",meta:null},_&&(t.meta=x&&x.meta||this.meta||{},!t.meta||!t.meta.thumb||t.meta.thumb.data instanceof r||(t.meta.thumb.data=new r(null,{type:"image/jpeg",data:t.meta.thumb.data}))),t},resize:function(t,i,n){var r=document.createElement("canvas");if(r.width=t.width,r.height=t.height,r.getContext("2d").drawImage(e(),t.x,t.y,t.width,t.height,0,0,r.width,r.height),v=s.scale(r,i),_=n.preserveHeaders,!_){var o=this.meta&&this.meta.tiff&&this.meta.tiff.Orientation||1;v=f(v,o)}this.width=v.width,this.height=v.height,b=!0,this.trigger("Resize")},getAsCanvas:function(){return v||(v=c()),v.id=this.uid+"_canvas",v},getAsBlob:function(e,t){return e!==this.type?(b=!0,new o(null,{name:y.name||"",type:e,data:E.getAsDataURL(e,t)})):new o(null,{name:y.name||"",type:e,data:E.getAsBinaryString(e,t)})},getAsDataURL:function(e){var t=arguments[1]||90;if(!b)return g.src;if(c(),"image/jpeg"!==e)return v.toDataURL("image/png");try{return v.toDataURL("image/jpeg",t/100)}catch(i){return v.toDataURL("image/jpeg")}},getAsBinaryString:function(e,t){if(!b)return w||(w=l(E.getAsDataURL(e,t))),w;if("image/jpeg"!==e)w=l(E.getAsDataURL(e,t));else{var i;t||(t=90),c();try{i=v.toDataURL("image/jpeg",t/100)}catch(n){i=v.toDataURL("image/jpeg")}w=l(i),x&&(w=x.stripHeaders(w),_&&(x.meta&&x.meta.exif&&x.setExif({PixelXDimension:this.width,PixelYDimension:this.height}),w=x.writeHeaders(w)),x.purge(),x=null)}return b=!1,w},destroy:function(){E=null,p.call(this),this.getRuntime().getShim().removeInstance(this.uid)}})}return e.Image=c}),n("moxie/runtime/flash/Runtime",["moxie/core/utils/Basic","moxie/core/utils/Env","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/runtime/Runtime"],function(e,t,i,n,o){function a(){var e;try{e=navigator.plugins["Shockwave Flash"],e=e.description}catch(t){try{e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")}catch(i){e="0.0"}}return e=e.match(/\d+/g),parseFloat(e[0]+"."+e[1])}function s(e){var n=i.get(e);n&&"OBJECT"==n.nodeName&&("IE"===t.browser?(n.style.display="none",function r(){4==n.readyState?u(e):setTimeout(r,10)}()):n.parentNode.removeChild(n))}function u(e){var t=i.get(e);if(t){for(var n in t)"function"==typeof t[n]&&(t[n]=null);t.parentNode.removeChild(t)}}function c(u){var c,m=this;u=e.extend({swf_url:t.swf_url},u),o.call(this,u,l,{access_binary:function(e){return e&&"browser"===m.mode},access_image_binary:function(e){return e&&"browser"===m.mode},display_media:o.capTest(r("moxie/image/Image")),do_cors:o.capTrue,drag_and_drop:!1,report_upload_progress:function(){return"client"===m.mode},resize_image:o.capTrue,return_response_headers:!1,return_response_type:function(t){return"json"===t&&window.JSON?!0:!e.arrayDiff(t,["","text","document"])||"browser"===m.mode},return_status_code:function(t){return"browser"===m.mode||!e.arrayDiff(t,[200,404])},select_file:o.capTrue,select_multiple:o.capTrue,send_binary_string:function(e){return e&&"browser"===m.mode},send_browser_cookies:function(e){return e&&"browser"===m.mode},send_custom_headers:function(e){return e&&"browser"===m.mode},send_multipart:o.capTrue,slice_blob:function(e){return e&&"browser"===m.mode},stream_upload:function(e){return e&&"browser"===m.mode},summon_file_dialog:!1,upload_filesize:function(t){return e.parseSizeStr(t)<=2097152||"client"===m.mode},use_http_method:function(t){return!e.arrayDiff(t,["GET","POST"])}},{access_binary:function(e){return e?"browser":"client"},access_image_binary:function(e){return e?"browser":"client"},report_upload_progress:function(e){return e?"browser":"client"},return_response_type:function(t){return e.arrayDiff(t,["","text","json","document"])?"browser":["client","browser"]},return_status_code:function(t){return e.arrayDiff(t,[200,404])?"browser":["client","browser"]},send_binary_string:function(e){return e?"browser":"client"},send_browser_cookies:function(e){return e?"browser":"client"},send_custom_headers:function(e){return e?"browser":"client"},slice_blob:function(e){return e?"browser":"client"},stream_upload:function(e){return e?"client":"browser"},upload_filesize:function(t){return e.parseSizeStr(t)>=2097152?"client":"browser"}},"client"),a()<11.3&&(this.mode=!1),e.extend(this,{getShim:function(){return i.get(this.uid)},shimExec:function(e,t){var i=[].slice.call(arguments,2);return m.getShim().exec(this.uid,e,t,i)},init:function(){var i,r,a;a=this.getShimContainer(),e.extend(a.style,{position:"absolute",top:"-8px",left:"-8px",width:"9px",height:"9px",overflow:"hidden"}),i='<object id="'+this.uid+'" type="application/x-shockwave-flash" data="'+u.swf_url+'" ',"IE"===t.browser&&(i+='classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '),i+='width="100%" height="100%" style="outline:0"><param name="movie" value="'+u.swf_url+'" />'+'<param name="flashvars" value="uid='+escape(this.uid)+"&target="+o.getGlobalEventTarget()+'" />'+'<param name="wmode" value="transparent" />'+'<param name="allowscriptaccess" value="always" />'+"</object>","IE"===t.browser?(r=document.createElement("div"),a.appendChild(r),r.outerHTML=i,r=a=null):a.innerHTML=i,c=setTimeout(function(){m&&!m.initialized&&m.trigger("Error",new n.RuntimeError(n.RuntimeError.NOT_INIT_ERR))},5e3)},destroy:function(e){return function(){s(m.uid),e.call(m),clearTimeout(c),u=c=e=m=null}}(this.destroy)},d)}var l="flash",d={};return o.addConstructor(l,c),d}),n("moxie/runtime/flash/file/Blob",["moxie/runtime/flash/Runtime","moxie/file/Blob"],function(e,t){var i={slice:function(e,i,n,r){var o=this.getRuntime();return 0>i?i=Math.max(e.size+i,0):i>0&&(i=Math.min(i,e.size)),0>n?n=Math.max(e.size+n,0):n>0&&(n=Math.min(n,e.size)),e=o.shimExec.call(this,"Blob","slice",i,n,r||""),e&&(e=new t(o.uid,e)),e}};return e.Blob=i}),n("moxie/runtime/flash/file/FileInput",["moxie/runtime/flash/Runtime","moxie/file/File","moxie/core/utils/Dom","moxie/core/utils/Basic"],function(e,t,i,n){var r={init:function(e){var r=this,o=this.getRuntime(),a=i.get(e.browse_button);a&&(a.setAttribute("tabindex",-1),a=null),this.bind("Change",function(){var e=o.shimExec.call(r,"FileInput","getFiles");r.files=[],n.each(e,function(e){r.files.push(new t(o.uid,e))})},999),this.getRuntime().shimExec.call(this,"FileInput","init",{accept:e.accept,multiple:e.multiple}),this.trigger("ready")}};return e.FileInput=r}),n("moxie/runtime/flash/file/FileReader",["moxie/runtime/flash/Runtime","moxie/core/utils/Encode"],function(e,t){function i(e,i){switch(i){case"readAsText":return t.atob(e,"utf8");case"readAsBinaryString":return t.atob(e);case"readAsDataURL":return e}return null}var n={read:function(e,t){var n=this;return n.result="","readAsDataURL"===e&&(n.result="data:"+(t.type||"")+";base64,"),n.bind("Progress",function(t,r){r&&(n.result+=i(r,e))},999),n.getRuntime().shimExec.call(this,"FileReader","readAsBase64",t.uid)}};return e.FileReader=n}),n("moxie/runtime/flash/file/FileReaderSync",["moxie/runtime/flash/Runtime","moxie/core/utils/Encode"],function(e,t){function i(e,i){switch(i){case"readAsText":return t.atob(e,"utf8");case"readAsBinaryString":return t.atob(e);case"readAsDataURL":return e}return null}var n={read:function(e,t){var n,r=this.getRuntime();return(n=r.shimExec.call(this,"FileReaderSync","readAsBase64",t.uid))?("readAsDataURL"===e&&(n="data:"+(t.type||"")+";base64,"+n),i(n,e,t.type)):null}};return e.FileReaderSync=n}),n("moxie/runtime/flash/runtime/Transporter",["moxie/runtime/flash/Runtime","moxie/file/Blob"],function(e,t){var i={getAsBlob:function(e){var i=this.getRuntime(),n=i.shimExec.call(this,"Transporter","getAsBlob",e);return n?new t(i.uid,n):null}};return e.Transporter=i}),n("moxie/runtime/flash/xhr/XMLHttpRequest",["moxie/runtime/flash/Runtime","moxie/core/utils/Basic","moxie/file/Blob","moxie/file/File","moxie/file/FileReaderSync","moxie/runtime/flash/file/FileReaderSync","moxie/xhr/FormData","moxie/runtime/Transporter","moxie/runtime/flash/runtime/Transporter"],function(e,t,i,n,r,o,a,s){var u={send:function(e,n){function r(){e.transport=l.mode,l.shimExec.call(c,"XMLHttpRequest","send",e,n)}function o(e,t){l.shimExec.call(c,"XMLHttpRequest","appendBlob",e,t.uid),n=null,r()}function u(e,t){var i=new s;i.bind("TransportingComplete",function(){t(this.result)}),i.transport(e.getSource(),e.type,{ruid:l.uid})}var c=this,l=c.getRuntime();if(t.isEmptyObj(e.headers)||t.each(e.headers,function(e,t){l.shimExec.call(c,"XMLHttpRequest","setRequestHeader",t,e.toString())}),n instanceof a){var d;if(n.each(function(e,t){e instanceof i?d=t:l.shimExec.call(c,"XMLHttpRequest","append",t,e)}),n.hasBlob()){var m=n.getBlob();m.isDetached()?u(m,function(e){m.destroy(),o(d,e)}):o(d,m)}else n=null,r()}else n instanceof i?n.isDetached()?u(n,function(e){n.destroy(),n=e.uid,r()}):(n=n.uid,r()):r()},getResponse:function(e){var i,o,a=this.getRuntime();if(o=a.shimExec.call(this,"XMLHttpRequest","getResponseAsBlob")){if(o=new n(a.uid,o),"blob"===e)return o;try{if(i=new r,~t.inArray(e,["","text"]))return i.readAsText(o);if("json"===e&&window.JSON)return JSON.parse(i.readAsText(o))}finally{o.destroy()}}return null},abort:function(){var e=this.getRuntime();e.shimExec.call(this,"XMLHttpRequest","abort"),this.dispatchEvent("readystatechange"),this.dispatchEvent("abort")}};return e.XMLHttpRequest=u}),n("moxie/runtime/flash/image/Image",["moxie/runtime/flash/Runtime","moxie/core/utils/Basic","moxie/runtime/Transporter","moxie/file/Blob","moxie/file/FileReaderSync"],function(e,t,i,n,r){var o={loadFromBlob:function(e){function t(e){r.shimExec.call(n,"Image","loadFromBlob",e.uid),n=r=null}var n=this,r=n.getRuntime();if(e.isDetached()){var o=new i;o.bind("TransportingComplete",function(){t(o.result.getSource())}),o.transport(e.getSource(),e.type,{ruid:r.uid})}else t(e.getSource())},loadFromImage:function(e){var t=this.getRuntime();return t.shimExec.call(this,"Image","loadFromImage",e.uid)},getInfo:function(){var e=this.getRuntime(),t=e.shimExec.call(this,"Image","getInfo");return t.meta&&t.meta.thumb&&t.meta.thumb.data&&!(e.meta.thumb.data instanceof n)&&(t.meta.thumb.data=new n(e.uid,t.meta.thumb.data)),t},getAsBlob:function(e,t){var i=this.getRuntime(),r=i.shimExec.call(this,"Image","getAsBlob",e,t);return r?new n(i.uid,r):null},getAsDataURL:function(){var e,t=this.getRuntime(),i=t.Image.getAsBlob.apply(this,arguments);return i?(e=new r,e.readAsDataURL(i)):null}};return e.Image=o}),n("moxie/runtime/silverlight/Runtime",["moxie/core/utils/Basic","moxie/core/utils/Env","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/runtime/Runtime"],function(e,t,i,n,o){function a(e){var t,i,n,r,o,a=!1,s=null,u=0;try{try{s=new ActiveXObject("AgControl.AgControl"),s.IsVersionSupported(e)&&(a=!0),s=null}catch(c){var l=navigator.plugins["Silverlight Plug-In"];if(l){for(t=l.description,"1.0.30226.2"===t&&(t="2.0.30226.2"),i=t.split(".");i.length>3;)i.pop();for(;i.length<4;)i.push(0);for(n=e.split(".");n.length>4;)n.pop();do r=parseInt(n[u],10),o=parseInt(i[u],10),u++;while(u<n.length&&r===o);o>=r&&!isNaN(r)&&(a=!0)}}}catch(d){a=!1}return a}function s(s){var l,d=this;s=e.extend({xap_url:t.xap_url},s),o.call(this,s,u,{access_binary:o.capTrue,access_image_binary:o.capTrue,display_media:o.capTest(r("moxie/image/Image")),do_cors:o.capTrue,drag_and_drop:!1,report_upload_progress:o.capTrue,resize_image:o.capTrue,return_response_headers:function(e){return e&&"client"===d.mode},return_response_type:function(e){return"json"!==e?!0:!!window.JSON},return_status_code:function(t){return"client"===d.mode||!e.arrayDiff(t,[200,404])},select_file:o.capTrue,select_multiple:o.capTrue,send_binary_string:o.capTrue,send_browser_cookies:function(e){return e&&"browser"===d.mode},send_custom_headers:function(e){return e&&"client"===d.mode},send_multipart:o.capTrue,slice_blob:o.capTrue,stream_upload:!0,summon_file_dialog:!1,upload_filesize:o.capTrue,use_http_method:function(t){return"client"===d.mode||!e.arrayDiff(t,["GET","POST"])}},{return_response_headers:function(e){return e?"client":"browser"},return_status_code:function(t){return e.arrayDiff(t,[200,404])?"client":["client","browser"]},send_browser_cookies:function(e){return e?"browser":"client"},send_custom_headers:function(e){return e?"client":"browser"},use_http_method:function(t){return e.arrayDiff(t,["GET","POST"])?"client":["client","browser"]}}),a("2.0.31005.0")&&"Opera"!==t.browser||(this.mode=!1),e.extend(this,{getShim:function(){return i.get(this.uid).content.Moxie},shimExec:function(e,t){var i=[].slice.call(arguments,2);return d.getShim().exec(this.uid,e,t,i)},init:function(){var e;e=this.getShimContainer(),e.innerHTML='<object id="'+this.uid+'" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;">'+'<param name="source" value="'+s.xap_url+'"/>'+'<param name="background" value="Transparent"/>'+'<param name="windowless" value="true"/>'+'<param name="enablehtmlaccess" value="true"/>'+'<param name="initParams" value="uid='+this.uid+",target="+o.getGlobalEventTarget()+'"/>'+"</object>",l=setTimeout(function(){d&&!d.initialized&&d.trigger("Error",new n.RuntimeError(n.RuntimeError.NOT_INIT_ERR))},"Windows"!==t.OS?1e4:5e3)},destroy:function(e){return function(){e.call(d),clearTimeout(l),s=l=e=d=null}}(this.destroy)},c)}var u="silverlight",c={};return o.addConstructor(u,s),c}),n("moxie/runtime/silverlight/file/Blob",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/file/Blob"],function(e,t,i){return e.Blob=t.extend({},i)}),n("moxie/runtime/silverlight/file/FileInput",["moxie/runtime/silverlight/Runtime","moxie/file/File","moxie/core/utils/Dom","moxie/core/utils/Basic"],function(e,t,i,n){function r(e){for(var t="",i=0;i<e.length;i++)t+=(""!==t?"|":"")+e[i].title+" | *."+e[i].extensions.replace(/,/g,";*.");return t}var o={init:function(e){var o=this,a=this.getRuntime(),s=i.get(e.browse_button);s&&(s.setAttribute("tabindex",-1),s=null),this.bind("Change",function(){var e=a.shimExec.call(o,"FileInput","getFiles");
			o.files=[],n.each(e,function(e){o.files.push(new t(a.uid,e))})},999),a.shimExec.call(this,"FileInput","init",r(e.accept),e.multiple),this.trigger("ready")},setOption:function(e,t){"accept"==e&&(t=r(t)),this.getRuntime().shimExec.call(this,"FileInput","setOption",e,t)}};return e.FileInput=o}),n("moxie/runtime/silverlight/file/FileDrop",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Dom","moxie/core/utils/Events"],function(e,t,i){var n={init:function(){var e,n=this,r=n.getRuntime();return e=r.getShimContainer(),i.addEvent(e,"dragover",function(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="copy"},n.uid),i.addEvent(e,"dragenter",function(e){e.preventDefault();var i=t.get(r.uid).dragEnter(e);i&&e.stopPropagation()},n.uid),i.addEvent(e,"drop",function(e){e.preventDefault();var i=t.get(r.uid).dragDrop(e);i&&e.stopPropagation()},n.uid),r.shimExec.call(this,"FileDrop","init")}};return e.FileDrop=n}),n("moxie/runtime/silverlight/file/FileReader",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/file/FileReader"],function(e,t,i){return e.FileReader=t.extend({},i)}),n("moxie/runtime/silverlight/file/FileReaderSync",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/file/FileReaderSync"],function(e,t,i){return e.FileReaderSync=t.extend({},i)}),n("moxie/runtime/silverlight/runtime/Transporter",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/runtime/Transporter"],function(e,t,i){return e.Transporter=t.extend({},i)}),n("moxie/runtime/silverlight/xhr/XMLHttpRequest",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/xhr/XMLHttpRequest","moxie/runtime/silverlight/file/FileReaderSync","moxie/runtime/silverlight/runtime/Transporter"],function(e,t,i){return e.XMLHttpRequest=t.extend({},i)}),n("moxie/runtime/silverlight/image/Image",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/file/Blob","moxie/runtime/flash/image/Image"],function(e,t,i,n){return e.Image=t.extend({},n,{getInfo:function(){var e=this.getRuntime(),n=["tiff","exif","gps","thumb"],r={meta:{}},o=e.shimExec.call(this,"Image","getInfo");return o.meta&&(t.each(n,function(e){var t,i,n,a,s=o.meta[e];if(s&&s.keys)for(r.meta[e]={},i=0,n=s.keys.length;n>i;i++)t=s.keys[i],a=s[t],a&&(/^(\d|[1-9]\d+)$/.test(a)?a=parseInt(a,10):/^\d*\.\d+$/.test(a)&&(a=parseFloat(a)),r.meta[e][t]=a)}),r.meta&&r.meta.thumb&&r.meta.thumb.data&&!(e.meta.thumb.data instanceof i)&&(r.meta.thumb.data=new i(e.uid,r.meta.thumb.data))),r.width=parseInt(o.width,10),r.height=parseInt(o.height,10),r.size=parseInt(o.size,10),r.type=o.type,r.name=o.name,r},resize:function(e,t,i){this.getRuntime().shimExec.call(this,"Image","resize",e.x,e.y,e.width,e.height,t,i.preserveHeaders,i.resample)}})}),n("moxie/runtime/html4/Runtime",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/runtime/Runtime","moxie/core/utils/Env"],function(e,t,i,n){function o(t){var o=this,u=i.capTest,c=i.capTrue;i.call(this,t,a,{access_binary:u(window.FileReader||window.File&&File.getAsDataURL),access_image_binary:!1,display_media:u((n.can("create_canvas")||n.can("use_data_uri_over32kb"))&&r("moxie/image/Image")),do_cors:!1,drag_and_drop:!1,filter_by_extension:u(function(){return!("Chrome"===n.browser&&n.verComp(n.version,28,"<")||"IE"===n.browser&&n.verComp(n.version,10,"<")||"Safari"===n.browser&&n.verComp(n.version,7,"<")||"Firefox"===n.browser&&n.verComp(n.version,37,"<"))}()),resize_image:function(){return s.Image&&o.can("access_binary")&&n.can("create_canvas")},report_upload_progress:!1,return_response_headers:!1,return_response_type:function(t){return"json"===t&&window.JSON?!0:!!~e.inArray(t,["text","document",""])},return_status_code:function(t){return!e.arrayDiff(t,[200,404])},select_file:function(){return n.can("use_fileinput")},select_multiple:!1,send_binary_string:!1,send_custom_headers:!1,send_multipart:!0,slice_blob:!1,stream_upload:function(){return o.can("select_file")},summon_file_dialog:function(){return o.can("select_file")&&!("Firefox"===n.browser&&n.verComp(n.version,4,"<")||"Opera"===n.browser&&n.verComp(n.version,12,"<")||"IE"===n.browser&&n.verComp(n.version,10,"<"))},upload_filesize:c,use_http_method:function(t){return!e.arrayDiff(t,["GET","POST"])}}),e.extend(this,{init:function(){this.trigger("Init")},destroy:function(e){return function(){e.call(o),e=o=null}}(this.destroy)}),e.extend(this.getShim(),s)}var a="html4",s={};return i.addConstructor(a,o),s}),n("moxie/runtime/html4/file/FileInput",["moxie/runtime/html4/Runtime","moxie/file/File","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/utils/Events","moxie/core/utils/Mime","moxie/core/utils/Env"],function(e,t,i,n,r,o,a){function s(){function e(){var o,c,d,m,h,f,p=this,g=p.getRuntime();f=i.guid("uid_"),o=g.getShimContainer(),s&&(d=n.get(s+"_form"),d&&(i.extend(d.style,{top:"100%"}),d.firstChild.setAttribute("tabindex",-1))),m=document.createElement("form"),m.setAttribute("id",f+"_form"),m.setAttribute("method","post"),m.setAttribute("enctype","multipart/form-data"),m.setAttribute("encoding","multipart/form-data"),i.extend(m.style,{overflow:"hidden",position:"absolute",top:0,left:0,width:"100%",height:"100%"}),h=document.createElement("input"),h.setAttribute("id",f),h.setAttribute("type","file"),h.setAttribute("accept",l.join(",")),g.can("summon_file_dialog")&&h.setAttribute("tabindex",-1),i.extend(h.style,{fontSize:"999px",opacity:0}),m.appendChild(h),o.appendChild(m),i.extend(h.style,{position:"absolute",top:0,left:0,width:"100%",height:"100%"}),"IE"===a.browser&&a.verComp(a.version,10,"<")&&i.extend(h.style,{filter:"progid:DXImageTransform.Microsoft.Alpha(opacity=0)"}),h.onchange=function(){var i;this.value&&(i=this.files?this.files[0]:{name:this.value},i=new t(g.uid,i),this.onchange=function(){},e.call(p),p.files=[i],h.setAttribute("id",i.uid),m.setAttribute("id",i.uid+"_form"),p.trigger("change"),h=m=null)},g.can("summon_file_dialog")&&(c=n.get(u.browse_button),r.removeEvent(c,"click",p.uid),r.addEvent(c,"click",function(e){h&&!h.disabled&&h.click(),e.preventDefault()},p.uid)),s=f,o=d=c=null}var s,u,c,l=[];i.extend(this,{init:function(t){var i,a=this,s=a.getRuntime();u=t,l=o.extList2mimes(t.accept,s.can("filter_by_extension")),i=s.getShimContainer(),function(){var e,o,l;e=n.get(t.browse_button),c=n.getStyle(e,"z-index")||"auto",s.can("summon_file_dialog")?("static"===n.getStyle(e,"position")&&(e.style.position="relative"),a.bind("Refresh",function(){o=parseInt(c,10)||1,n.get(u.browse_button).style.zIndex=o,this.getRuntime().getShimContainer().style.zIndex=o-1})):e.setAttribute("tabindex",-1),l=s.can("summon_file_dialog")?e:i,r.addEvent(l,"mouseover",function(){a.trigger("mouseenter")},a.uid),r.addEvent(l,"mouseout",function(){a.trigger("mouseleave")},a.uid),r.addEvent(l,"mousedown",function(){a.trigger("mousedown")},a.uid),r.addEvent(n.get(t.container),"mouseup",function(){a.trigger("mouseup")},a.uid),e=null}(),e.call(this),i=null,a.trigger({type:"ready",async:!0})},setOption:function(e,t){var i,r=this.getRuntime();"accept"==e&&(l=t.mimes||o.extList2mimes(t,r.can("filter_by_extension"))),i=n.get(s),i&&i.setAttribute("accept",l.join(","))},disable:function(e){var t;(t=n.get(s))&&(t.disabled=!!e)},destroy:function(){var e=this.getRuntime(),t=e.getShim(),i=e.getShimContainer(),o=u&&n.get(u.container),a=u&&n.get(u.browse_button);o&&r.removeAllEvents(o,this.uid),a&&(r.removeAllEvents(a,this.uid),a.style.zIndex=c),i&&(r.removeAllEvents(i,this.uid),i.innerHTML=""),t.removeInstance(this.uid),s=l=u=i=o=a=t=null}})}return e.FileInput=s}),n("moxie/runtime/html4/file/FileReader",["moxie/runtime/html4/Runtime","moxie/runtime/html5/file/FileReader"],function(e,t){return e.FileReader=t}),n("moxie/runtime/html4/xhr/XMLHttpRequest",["moxie/runtime/html4/Runtime","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/utils/Url","moxie/core/Exceptions","moxie/core/utils/Events","moxie/file/Blob","moxie/xhr/FormData"],function(e,t,i,n,r,o,a,s){function u(){function e(e){var t,n,r,a,s=this,u=!1;if(l){if(t=l.id.replace(/_iframe$/,""),n=i.get(t+"_form")){for(r=n.getElementsByTagName("input"),a=r.length;a--;)switch(r[a].getAttribute("type")){case"hidden":r[a].parentNode.removeChild(r[a]);break;case"file":u=!0}r=[],u||n.parentNode.removeChild(n),n=null}setTimeout(function(){o.removeEvent(l,"load",s.uid),l.parentNode&&l.parentNode.removeChild(l);var t=s.getRuntime().getShimContainer();t.children.length||t.parentNode.removeChild(t),t=l=null,e()},1)}}var u,c,l;t.extend(this,{send:function(d,m){function h(){var i=w.getShimContainer()||document.body,r=document.createElement("div");r.innerHTML='<iframe id="'+f+'_iframe" name="'+f+'_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>',l=r.firstChild,i.appendChild(l),o.addEvent(l,"load",function(){var i;try{i=l.contentWindow.document||l.contentDocument||window.frames[l.id].document,/^4(0[0-9]|1[0-7]|2[2346])\s/.test(i.title)?u=i.title.replace(/^(\d+).*$/,"$1"):(u=200,c=t.trim(i.body.innerHTML),v.trigger({type:"progress",loaded:c.length,total:c.length}),x&&v.trigger({type:"uploadprogress",loaded:x.size||1025,total:x.size||1025}))}catch(r){if(!n.hasSameOrigin(d.url))return e.call(v,function(){v.trigger("error")}),void 0;u=404}e.call(v,function(){v.trigger("load")})},v.uid)}var f,p,g,x,v=this,w=v.getRuntime();if(u=c=null,m instanceof s&&m.hasBlob()){if(x=m.getBlob(),f=x.uid,g=i.get(f),p=i.get(f+"_form"),!p)throw new r.DOMException(r.DOMException.NOT_FOUND_ERR)}else f=t.guid("uid_"),p=document.createElement("form"),p.setAttribute("id",f+"_form"),p.setAttribute("method",d.method),p.setAttribute("enctype","multipart/form-data"),p.setAttribute("encoding","multipart/form-data"),w.getShimContainer().appendChild(p);p.setAttribute("target",f+"_iframe"),m instanceof s&&m.each(function(e,i){if(e instanceof a)g&&g.setAttribute("name",i);else{var n=document.createElement("input");t.extend(n,{type:"hidden",name:i,value:e}),g?p.insertBefore(n,g):p.appendChild(n)}}),p.setAttribute("action",d.url),h(),p.submit(),v.trigger("loadstart")},getStatus:function(){return u},getResponse:function(e){if("json"===e&&"string"===t.typeOf(c)&&window.JSON)try{return JSON.parse(c.replace(/^\s*<pre[^>]*>/,"").replace(/<\/pre>\s*$/,""))}catch(i){return null}return c},abort:function(){var t=this;l&&l.contentWindow&&(l.contentWindow.stop?l.contentWindow.stop():l.contentWindow.document.execCommand?l.contentWindow.document.execCommand("Stop"):l.src="about:blank"),e.call(this,function(){t.dispatchEvent("abort")})},destroy:function(){this.getRuntime().getShim().removeInstance(this.uid)}})}return e.XMLHttpRequest=u}),n("moxie/runtime/html4/image/Image",["moxie/runtime/html4/Runtime","moxie/runtime/html5/image/Image"],function(e,t){return e.Image=t}),a(["moxie/core/utils/Basic","moxie/core/utils/Encode","moxie/core/utils/Env","moxie/core/Exceptions","moxie/core/utils/Dom","moxie/core/EventTarget","moxie/runtime/Runtime","moxie/runtime/RuntimeClient","moxie/file/Blob","moxie/core/I18n","moxie/core/utils/Mime","moxie/file/FileInput","moxie/file/File","moxie/file/FileDrop","moxie/file/FileReader","moxie/core/utils/Url","moxie/runtime/RuntimeTarget","moxie/xhr/FormData","moxie/xhr/XMLHttpRequest","moxie/image/Image","moxie/core/utils/Events","moxie/runtime/html5/image/ResizerCanvas"])}(this)});
	!function(e,t){var i=function(){var e={};return t.apply(e,arguments),e.plupload};"function"==typeof define&&define.amd?define("plupload",["./moxie"],i):"object"==typeof module&&module.exports?module.exports=i(require("./moxie")):e.plupload=i(e.moxie)}(this||window,function(e){!function(e,t,i){function n(e){function t(e,t,i){var r={chunks:"slice_blob",jpgresize:"send_binary_string",pngresize:"send_binary_string",progress:"report_upload_progress",multi_selection:"select_multiple",dragdrop:"drag_and_drop",drop_element:"drag_and_drop",headers:"send_custom_headers",urlstream_upload:"send_binary_string",canSendBinary:"send_binary",triggerDialog:"summon_file_dialog"};r[e]?n[r[e]]=t:i||(n[e]=t)}var i=e.required_features,n={};return"string"==typeof i?l.each(i.split(/\s*,\s*/),function(e){t(e,!0)}):"object"==typeof i?l.each(i,function(e,i){t(i,e)}):i===!0&&(e.chunk_size&&e.chunk_size>0&&(n.slice_blob=!0),l.isEmptyObj(e.resize)&&e.multipart!==!1||(n.send_binary_string=!0),e.http_method&&(n.use_http_method=e.http_method),l.each(e,function(e,i){t(i,!!e,!0)})),n}var r=window.setTimeout,s={},a=t.core.utils,o=t.runtime.Runtime,l={VERSION:"2.3.6",STOPPED:1,STARTED:2,QUEUED:1,UPLOADING:2,FAILED:4,DONE:5,GENERIC_ERROR:-100,HTTP_ERROR:-200,IO_ERROR:-300,SECURITY_ERROR:-400,INIT_ERROR:-500,FILE_SIZE_ERROR:-600,FILE_EXTENSION_ERROR:-601,FILE_DUPLICATE_ERROR:-602,IMAGE_FORMAT_ERROR:-700,MEMORY_ERROR:-701,IMAGE_DIMENSIONS_ERROR:-702,moxie:t,mimeTypes:a.Mime.mimes,ua:a.Env,typeOf:a.Basic.typeOf,extend:a.Basic.extend,guid:a.Basic.guid,getAll:function(e){var t,i=[];"array"!==l.typeOf(e)&&(e=[e]);for(var n=e.length;n--;)t=l.get(e[n]),t&&i.push(t);return i.length?i:null},get:a.Dom.get,each:a.Basic.each,getPos:a.Dom.getPos,getSize:a.Dom.getSize,xmlEncode:function(e){var t={"<":"lt",">":"gt","&":"amp",'"':"quot","'":"#39"},i=/[<>&\"\']/g;return e?(""+e).replace(i,function(e){return t[e]?"&"+t[e]+";":e}):e},toArray:a.Basic.toArray,inArray:a.Basic.inArray,inSeries:a.Basic.inSeries,addI18n:t.core.I18n.addI18n,translate:t.core.I18n.translate,sprintf:a.Basic.sprintf,isEmptyObj:a.Basic.isEmptyObj,hasClass:a.Dom.hasClass,addClass:a.Dom.addClass,removeClass:a.Dom.removeClass,getStyle:a.Dom.getStyle,addEvent:a.Events.addEvent,removeEvent:a.Events.removeEvent,removeAllEvents:a.Events.removeAllEvents,cleanName:function(e){var t,i;for(i=[/[\300-\306]/g,"A",/[\340-\346]/g,"a",/\307/g,"C",/\347/g,"c",/[\310-\313]/g,"E",/[\350-\353]/g,"e",/[\314-\317]/g,"I",/[\354-\357]/g,"i",/\321/g,"N",/\361/g,"n",/[\322-\330]/g,"O",/[\362-\370]/g,"o",/[\331-\334]/g,"U",/[\371-\374]/g,"u"],t=0;t<i.length;t+=2)e=e.replace(i[t],i[t+1]);return e=e.replace(/\s+/g,"_"),e=e.replace(/[^a-z0-9_\-\.]+/gi,"")},buildUrl:function(e,t){var i="";return l.each(t,function(e,t){i+=(i?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(e)}),i&&(e+=(e.indexOf("?")>0?"&":"?")+i),e},formatSize:function(e){function t(e,t){return Math.round(e*Math.pow(10,t))/Math.pow(10,t)}if(e===i||/\D/.test(e))return l.translate("N/A");var n=Math.pow(1024,4);return e>n?t(e/n,1)+" "+l.translate("tb"):e>(n/=1024)?t(e/n,1)+" "+l.translate("gb"):e>(n/=1024)?t(e/n,1)+" "+l.translate("mb"):e>1024?Math.round(e/1024)+" "+l.translate("kb"):e+" "+l.translate("b")},parseSize:a.Basic.parseSizeStr,predictRuntime:function(e,t){var i,n;return i=new l.Uploader(e),n=o.thatCan(i.getOption().required_features,t||e.runtimes),i.destroy(),n},addFileFilter:function(e,t){s[e]=t}};l.addFileFilter("mime_types",function(e,t,i){e.length&&!e.regexp.test(t.name)?(this.trigger("Error",{code:l.FILE_EXTENSION_ERROR,message:l.translate("File extension error."),file:t}),i(!1)):i(!0)}),l.addFileFilter("max_file_size",function(e,t,i){var n;e=l.parseSize(e),t.size!==n&&e&&t.size>e?(this.trigger("Error",{code:l.FILE_SIZE_ERROR,message:l.translate("File size error."),file:t}),i(!1)):i(!0)}),l.addFileFilter("prevent_duplicates",function(e,t,i){if(e)for(var n=this.files.length;n--;)if(t.name===this.files[n].name&&t.size===this.files[n].size)return this.trigger("Error",{code:l.FILE_DUPLICATE_ERROR,message:l.translate("Duplicate file error."),file:t}),i(!1),void 0;i(!0)}),l.addFileFilter("prevent_empty",function(e,t,n){e&&!t.size&&t.size!==i?(this.trigger("Error",{code:l.FILE_SIZE_ERROR,message:l.translate("File size error."),file:t}),n(!1)):n(!0)}),l.Uploader=function(e){function a(){var e,t,i=0;if(this.state==l.STARTED){for(t=0;t<D.length;t++)e||D[t].status!=l.QUEUED?i++:(e=D[t],this.trigger("BeforeUpload",e)&&(e.status=l.UPLOADING,this.trigger("UploadFile",e)));i==D.length&&(this.state!==l.STOPPED&&(this.state=l.STOPPED,this.trigger("StateChanged")),this.trigger("UploadComplete",D))}}function u(e){e.percent=e.size>0?Math.ceil(100*(e.loaded/e.size)):100,d()}function d(){var e,t,n,r=0;for(I.reset(),e=0;e<D.length;e++)t=D[e],t.size!==i?(I.size+=t.origSize,n=t.loaded*t.origSize/t.size,(!t.completeTimestamp||t.completeTimestamp>S)&&(r+=n),I.loaded+=n):I.size=i,t.status==l.DONE?I.uploaded++:t.status==l.FAILED?I.failed++:I.queued++;I.size===i?I.percent=D.length>0?Math.ceil(100*(I.uploaded/D.length)):0:(I.bytesPerSec=Math.ceil(r/((+new Date-S||1)/1e3)),I.percent=I.size>0?Math.ceil(100*(I.loaded/I.size)):0)}function c(){var e=F[0]||P[0];return e?e.getRuntime().uid:!1}function f(){this.bind("FilesAdded FilesRemoved",function(e){e.trigger("QueueChanged"),e.refresh()}),this.bind("CancelUpload",b),this.bind("BeforeUpload",m),this.bind("UploadFile",_),this.bind("UploadProgress",E),this.bind("StateChanged",v),this.bind("QueueChanged",d),this.bind("Error",R),this.bind("FileUploaded",y),this.bind("Destroy",z)}function p(e,i){var n=this,r=0,s=[],a={runtime_order:e.runtimes,required_caps:e.required_features,preferred_caps:x,swf_url:e.flash_swf_url,xap_url:e.silverlight_xap_url};l.each(e.runtimes.split(/\s*,\s*/),function(t){e[t]&&(a[t]=e[t])}),e.browse_button&&l.each(e.browse_button,function(i){s.push(function(s){var u=new t.file.FileInput(l.extend({},a,{accept:e.filters.mime_types,name:e.file_data_name,multiple:e.multi_selection,container:e.container,browse_button:i}));u.onready=function(){var e=o.getInfo(this.ruid);l.extend(n.features,{chunks:e.can("slice_blob"),multipart:e.can("send_multipart"),multi_selection:e.can("select_multiple")}),r++,F.push(this),s()},u.onchange=function(){n.addFile(this.files)},u.bind("mouseenter mouseleave mousedown mouseup",function(t){U||(e.browse_button_hover&&("mouseenter"===t.type?l.addClass(i,e.browse_button_hover):"mouseleave"===t.type&&l.removeClass(i,e.browse_button_hover)),e.browse_button_active&&("mousedown"===t.type?l.addClass(i,e.browse_button_active):"mouseup"===t.type&&l.removeClass(i,e.browse_button_active)))}),u.bind("mousedown",function(){n.trigger("Browse")}),u.bind("error runtimeerror",function(){u=null,s()}),u.init()})}),e.drop_element&&l.each(e.drop_element,function(e){s.push(function(i){var s=new t.file.FileDrop(l.extend({},a,{drop_zone:e}));s.onready=function(){var e=o.getInfo(this.ruid);l.extend(n.features,{chunks:e.can("slice_blob"),multipart:e.can("send_multipart"),dragdrop:e.can("drag_and_drop")}),r++,P.push(this),i()},s.ondrop=function(){n.addFile(this.files)},s.bind("error runtimeerror",function(){s=null,i()}),s.init()})}),l.inSeries(s,function(){"function"==typeof i&&i(r)})}function g(e,n,r,s){var a=new t.image.Image;try{a.onload=function(){n.width>this.width&&n.height>this.height&&n.quality===i&&n.preserve_headers&&!n.crop?(this.destroy(),s(e)):a.downsize(n.width,n.height,n.crop,n.preserve_headers)},a.onresize=function(){var t=this.getAsBlob(e.type,n.quality);this.destroy(),s(t)},a.bind("error runtimeerror",function(){this.destroy(),s(e)}),a.load(e,r)}catch(o){s(e)}}function h(e,i,r){function s(e,i,n){var r=O[e];switch(e){case"max_file_size":"max_file_size"===e&&(O.max_file_size=O.filters.max_file_size=i);break;case"chunk_size":(i=l.parseSize(i))&&(O[e]=i,O.send_file_name=!0);break;case"multipart":O[e]=i,i||(O.send_file_name=!0);break;case"http_method":O[e]="PUT"===i.toUpperCase()?"PUT":"POST";break;case"unique_names":O[e]=i,i&&(O.send_file_name=!0);break;case"filters":"array"===l.typeOf(i)&&(i={mime_types:i}),n?l.extend(O.filters,i):O.filters=i,i.mime_types&&("string"===l.typeOf(i.mime_types)&&(i.mime_types=t.core.utils.Mime.mimes2extList(i.mime_types)),i.mime_types.regexp=function(e){var t=[];return l.each(e,function(e){l.each(e.extensions.split(/,/),function(e){/^\s*\*\s*$/.test(e)?t.push("\\.*"):t.push("\\."+e.replace(new RegExp("["+"/^$.*+?|()[]{}\\".replace(/./g,"\\$&")+"]","g"),"\\$&"))})}),new RegExp("("+t.join("|")+")$","i")}(i.mime_types),O.filters.mime_types=i.mime_types);break;case"resize":O.resize=i?l.extend({preserve_headers:!0,crop:!1},i):!1;break;case"prevent_duplicates":O.prevent_duplicates=O.filters.prevent_duplicates=!!i;break;case"container":case"browse_button":case"drop_element":i="container"===e?l.get(i):l.getAll(i);case"runtimes":case"multi_selection":case"flash_swf_url":case"silverlight_xap_url":O[e]=i,n||(u=!0);break;default:O[e]=i}n||a.trigger("OptionChanged",e,i,r)}var a=this,u=!1;"object"==typeof e?l.each(e,function(e,t){s(t,e,r)}):s(e,i,r),r?(O.required_features=n(l.extend({},O)),x=n(l.extend({},O,{required_features:!0}))):u&&(a.trigger("Destroy"),p.call(a,O,function(e){e?(a.runtime=o.getInfo(c()).type,a.trigger("Init",{runtime:a.runtime}),a.trigger("PostInit")):a.trigger("Error",{code:l.INIT_ERROR,message:l.translate("Init error.")})}))}function m(e,t){if(e.settings.unique_names){var i=t.name.match(/\.([^.]+)$/),n="part";i&&(n=i[1]),t.target_name=t.id+"."+n}}function _(e,i){function n(){c-->0?r(s,1e3):(i.loaded=p,e.trigger("Error",{code:l.HTTP_ERROR,message:l.translate("HTTP Error."),file:i,response:T.responseText,status:T.status,responseHeaders:T.getAllResponseHeaders()}))}function s(){var t,n,r={};i.status===l.UPLOADING&&e.state!==l.STOPPED&&(e.settings.send_file_name&&(r.name=i.target_name||i.name),d&&f.chunks&&o.size>d?(n=Math.min(d,o.size-p),t=o.slice(p,p+n)):(n=o.size,t=o),d&&f.chunks&&(e.settings.send_chunk_number?(r.chunk=Math.ceil(p/d),r.chunks=Math.ceil(o.size/d)):(r.offset=p,r.total=o.size)),e.trigger("BeforeChunkUpload",i,r,t,p)&&a(r,t,n))}function a(a,d,g){var m;T=new t.xhr.XMLHttpRequest,T.upload&&(T.upload.onprogress=function(t){i.loaded=Math.min(i.size,p+t.loaded),e.trigger("UploadProgress",i)}),T.onload=function(){return T.status<200||T.status>=400?(n(),void 0):(c=e.settings.max_retries,g<o.size?(d.destroy(),p+=g,i.loaded=Math.min(p,o.size),e.trigger("ChunkUploaded",i,{offset:i.loaded,total:o.size,response:T.responseText,status:T.status,responseHeaders:T.getAllResponseHeaders()}),"Android Browser"===l.ua.browser&&e.trigger("UploadProgress",i)):i.loaded=i.size,d=m=null,!p||p>=o.size?(i.size!=i.origSize&&(o.destroy(),o=null),e.trigger("UploadProgress",i),i.status=l.DONE,i.completeTimestamp=+new Date,e.trigger("FileUploaded",i,{response:T.responseText,status:T.status,responseHeaders:T.getAllResponseHeaders()})):r(s,1),void 0)},T.onerror=function(){n()},T.onloadend=function(){this.destroy()},e.settings.multipart&&f.multipart?(T.open(e.settings.http_method,u,!0),l.each(e.settings.headers,function(e,t){T.setRequestHeader(t,e)}),m=new t.xhr.FormData,l.each(l.extend(a,e.settings.multipart_params),function(e,t){m.append(t,e)}),m.append(e.settings.file_data_name,d),T.send(m,h)):(u=l.buildUrl(e.settings.url,l.extend(a,e.settings.multipart_params)),T.open(e.settings.http_method,u,!0),l.each(e.settings.headers,function(e,t){T.setRequestHeader(t,e)}),T.hasRequestHeader("Content-Type")||T.setRequestHeader("Content-Type","application/octet-stream"),T.send(d,h))}var o,u=e.settings.url,d=e.settings.chunk_size,c=e.settings.max_retries,f=e.features,p=0,h={runtime_order:e.settings.runtimes,required_caps:e.settings.required_features,preferred_caps:x,swf_url:e.settings.flash_swf_url,xap_url:e.settings.silverlight_xap_url};i.loaded&&(p=i.loaded=d?d*Math.floor(i.loaded/d):0),o=i.getSource(),l.isEmptyObj(e.settings.resize)||-1===l.inArray(o.type,["image/jpeg","image/png"])?s():g(o,e.settings.resize,h,function(e){o=e,i.size=e.size,s()})}function E(e,t){u(t)}function v(e){if(e.state==l.STARTED)S=+new Date;else if(e.state==l.STOPPED)for(var t=e.files.length-1;t>=0;t--)e.files[t].status==l.UPLOADING&&(e.files[t].status=l.QUEUED,d())}function b(){T&&T.abort()}function y(e){d(),r(function(){a.call(e)},1)}function R(e,t){t.code===l.INIT_ERROR?e.destroy():t.code===l.HTTP_ERROR&&(t.file.status=l.FAILED,t.file.completeTimestamp=+new Date,u(t.file),e.state==l.STARTED&&(e.trigger("CancelUpload"),r(function(){a.call(e)},1)))}function z(e){e.stop(),l.each(D,function(e){e.destroy()}),D=[],F.length&&(l.each(F,function(e){e.destroy()}),F=[]),P.length&&(l.each(P,function(e){e.destroy()}),P=[]),x={},U=!1,S=T=null,I.reset()}var O,S,I,T,w=l.guid(),D=[],x={},F=[],P=[],U=!1;O={chunk_size:0,file_data_name:"file",filters:{mime_types:[],max_file_size:0,prevent_duplicates:!1,prevent_empty:!0},flash_swf_url:"js/Moxie.swf",http_method:"POST",max_retries:0,multipart:!0,multi_selection:!0,resize:!1,runtimes:o.order,send_file_name:!0,send_chunk_number:!0,silverlight_xap_url:"js/Moxie.xap"},h.call(this,e,null,!0),I=new l.QueueProgress,l.extend(this,{id:w,uid:w,state:l.STOPPED,features:{},runtime:null,files:D,settings:O,total:I,init:function(){var e,t,i=this;return e=i.getOption("preinit"),"function"==typeof e?e(i):l.each(e,function(e,t){i.bind(t,e)}),f.call(i),l.each(["container","browse_button","drop_element"],function(e){return null===i.getOption(e)?(t={code:l.INIT_ERROR,message:l.sprintf(l.translate("%s specified, but cannot be found."),e)},!1):void 0}),t?i.trigger("Error",t):O.browse_button||O.drop_element?(p.call(i,O,function(e){var t=i.getOption("init");"function"==typeof t?t(i):l.each(t,function(e,t){i.bind(t,e)}),e?(i.runtime=o.getInfo(c()).type,i.trigger("Init",{runtime:i.runtime}),i.trigger("PostInit")):i.trigger("Error",{code:l.INIT_ERROR,message:l.translate("Init error.")})}),void 0):i.trigger("Error",{code:l.INIT_ERROR,message:l.translate("You must specify either browse_button or drop_element.")})},setOption:function(e,t){h.call(this,e,t,!this.runtime)},getOption:function(e){return e?O[e]:O},refresh:function(){F.length&&l.each(F,function(e){e.trigger("Refresh")}),this.trigger("Refresh")},start:function(){this.state!=l.STARTED&&(this.state=l.STARTED,this.trigger("StateChanged"),a.call(this))},stop:function(){this.state!=l.STOPPED&&(this.state=l.STOPPED,this.trigger("StateChanged"),this.trigger("CancelUpload"))},disableBrowse:function(){U=arguments[0]!==i?arguments[0]:!0,F.length&&l.each(F,function(e){e.disable(U)}),this.trigger("DisableBrowse",U)},getFile:function(e){var t;for(t=D.length-1;t>=0;t--)if(D[t].id===e)return D[t]},addFile:function(e,i){function n(e,t){var i=[];l.each(u.settings.filters,function(t,n){s[n]&&i.push(function(i){s[n].call(u,t,e,function(e){i(!e)})})}),l.inSeries(i,t)}function a(e){var s=l.typeOf(e);if(e instanceof t.file.File){if(!e.ruid&&!e.isDetached()){if(!o)return!1;e.ruid=o,e.connectRuntime(o)}a(new l.File(e))}else e instanceof t.file.Blob?(a(e.getSource()),e.destroy()):e instanceof l.File?(i&&(e.name=i),d.push(function(t){n(e,function(i){i||(D.push(e),f.push(e),u.trigger("FileFiltered",e)),r(t,1)})})):-1!==l.inArray(s,["file","blob"])?a(new t.file.File(null,e)):"node"===s&&"filelist"===l.typeOf(e.files)?l.each(e.files,a):"array"===s&&(i=null,l.each(e,a))}var o,u=this,d=[],f=[];o=c(),a(e),d.length&&l.inSeries(d,function(){f.length&&u.trigger("FilesAdded",f)})},removeFile:function(e){for(var t="string"==typeof e?e:e.id,i=D.length-1;i>=0;i--)if(D[i].id===t)return this.splice(i,1)[0]},splice:function(e,t){var n=D.splice(e===i?0:e,t===i?D.length:t),r=!1;return this.state==l.STARTED&&(l.each(n,function(e){return e.status===l.UPLOADING?(r=!0,!1):void 0}),r&&this.stop()),this.trigger("FilesRemoved",n),l.each(n,function(e){e.destroy()}),r&&this.start(),n},dispatchEvent:function(e){var t,i;if(e=e.toLowerCase(),t=this.hasEventListener(e)){t.sort(function(e,t){return t.priority-e.priority}),i=[].slice.call(arguments),i.shift(),i.unshift(this);for(var n=0;n<t.length;n++)if(t[n].fn.apply(t[n].scope,i)===!1)return!1}return!0},bind:function(e,t,i,n){l.Uploader.prototype.bind.call(this,e,t,n,i)},destroy:function(){this.trigger("Destroy"),O=I=null,this.unbindAll()}})},l.Uploader.prototype=t.core.EventTarget.instance,l.File=function(){function e(e){l.extend(this,{id:l.guid(),name:e.name||e.fileName,type:e.type||"",relativePath:e.relativePath||"",size:e.fileSize||e.size,origSize:e.fileSize||e.size,loaded:0,percent:0,status:l.QUEUED,lastModifiedDate:e.lastModifiedDate||(new Date).toLocaleString(),completeTimestamp:0,getNative:function(){var e=this.getSource().getSource();return-1!==l.inArray(l.typeOf(e),["blob","file"])?e:null},getSource:function(){return t[this.id]?t[this.id]:null},destroy:function(){var e=this.getSource();e&&(e.destroy(),delete t[this.id])}}),t[this.id]=e}var t={};return e}(),l.QueueProgress=function(){var e=this;e.size=0,e.loaded=0,e.uploaded=0,e.failed=0,e.queued=0,e.percent=0,e.bytesPerSec=0,e.reset=function(){e.size=e.loaded=e.uploaded=e.failed=e.queued=e.percent=e.bytesPerSec=0}},e.plupload=l}(this,e)});

	plupload.addI18n({"Stop Upload":"停止上传","Upload URL might be wrong or doesn't exist.":"上传的URL可能是错误的或不存在。","tb":"tb","Size":"大小","Close":"关闭","You must specify either browse_button or drop_element.":"您必须指定 browse_button 或者 drop_element。","Init error.":"初始化错误。","Add files to the upload queue and click the start button.":"将文件添加到上传队列，然后点击”开始上传“按钮。","List":"列表","Filename":"文件名","%s specified, but cannot be found.":"%s 已指定，但是没有找到。","Image format either wrong or not supported.":"图片格式错误或者不支持。","Status":"状态","HTTP Error.":"HTTP 错误。","Start Upload":"开始上传","Error: File too large:":"错误: 文件太大:","kb":"kb","Duplicate file error.":"重复文件错误。","File size error.":"文件大小错误。","N/A":"N/A","gb":"gb","Error: Invalid file extension:":"错误：无效的文件扩展名:","Select files":"选择文件","%s already present in the queue.":"%s 已经在当前队列里。","Resoultion out of boundaries! <b>%s</b> runtime supports images only up to %wx%hpx.":"超限。<b>%s</b> 支持最大 %wx%hpx 的图片。","File: %s":"文件: %s","b":"b","Uploaded %d/%d files":"已上传 %d/%d 个文件","Upload element accepts only %d file(s) at a time. Extra files were stripped.":"每次只接受同时上传 %d 个文件，多余的文件将会被删除。","%d files queued":"%d 个文件加入到队列","File: %s, size: %d, max file size: %d":"文件: %s, 大小: %d, 最大文件大小: %d","Thumbnails":"缩略图","Drag files here.":"把文件拖到这里。","Runtime ran out of available memory.":"运行时已消耗所有可用内存。","File count error.":"文件数量错误。","File extension error.":"文件扩展名错误。","mb":"mb","Add Files":"增加文件"});
	function KUploadButton(options) {
		this.init(options);
	}
	_extend(KUploadButton, {
		alert: function(text){
			var dialog = K.dialog({
				width : 300,
				height: 150,
				title : '提示',
				themeType:'simple',
				body : '<div style="padding:20px;">'+text+'</div>',
				z:19890323,
				closeBtn : {
					name : '关闭',
					click : function(e) {
						dialog.remove();
					}
				},
				noBtn : {
					name : '取消',
					click : function(e) {
						dialog.remove();
					}
				}
			});
			return dialog;
		},
		init : function(options) {
			var self = this,
				button = options.button,
				fieldName = options.fieldName || 'file',
				url = options.url || '',
				fileUploadLimit = options.fileUploadLimit || 1,
				autoUpload = options.autoUpload|| true,
				extraParams = options.extraParams || {};
			options.afterError = options.afterError || function(str) {
				self.alert(str);
			};
			var dialog = K.createDialog({
				title:'上传文件',
				width : 450,
			});
			self.uploader = new plupload.Uploader({
				browse_button: button,
				url:url,
				file_data_name: fieldName,
				flash_swf_url: self.pluginsPath + 'upload/Moxie.swf',
				silverlight_xap_url: self.pluginsPath + 'upload/Moxie.xap',
				multi_selection:false,
				filters:{
					prevent_duplicates:true,
					max_file_size : options.fileSizeLimit,
					mime_types:[
						{ title:'图片文件',extensions:'jpg,jpeg,png,bmp'},
					]
				},
				init: {
					FilesAdded:function(up,files){
						plupload.each(files, function(file) {
							file.size =  plupload.formatSize(file.size);
						});
						if(self.uploader.files.length > fileUploadLimit) {
							var num = self.uploader.files.length - fileUploadLimit;
							for (var i = num; i > 0; i--) {
								self.uploader.files.pop();
							}
							self.alert('只能上传'+fileUploadLimit+'个文件，已自动删除多余文件！');
							return;
						}
						if(autoUpload){
							self.uploader.start();
							dialog.showLoading(self.lang('uploadLoading'));
						}
					},
					UploadProgress:function(up,file){
						console.log('progress: ',file);
					},
					FileUploaded:function(up,file,result){
						console.log('file: ',file);
						console.log('Info: ',result);
						dialog.hideLoading();
						self.uploader.removeFile(file);
						var data = {};
						try {
							data = K.json(result.response);
						} catch (e) {
							options.afterError.call(this, result.response);
						}
						if (data.error !== 0) {
							options.afterError.call(this, data.message);
						}else{
							options.afterUpload.call(self, data);
						}
					},
					Error:function(up,args)
					{
						options.afterError.call(this, args);
					},
				}
			});
			self.uploader.init();
		},
	});
	function _uploadbutton(options) {
		return new KUploadButton(options);
	}
	K.UploadButtonClass = KUploadButton;
	K.uploadbutton = _uploadbutton;


	function _createButton(arg) {
		arg = arg || {};
		var name = arg.name || '',
			span = K('<span class="ke-button-common ke-button-outer" title="' + name + '"></span>'),
			btn = K('<input class="ke-button-common ke-button" type="button" value="' + name + '" />');
		if (arg.click) {
			btn.click(arg.click);
		}
		span.append(btn);
		return span;
	}


	function KDialog(options) {
		this.init(options);
	}
	_extend(KDialog, KWidget, {
		init : function(options) {
			var self = this;
			var shadowMode = _undef(options.shadowMode, true);
			options.z = options.z || 811213;
			options.shadowMode = false;
			options.autoScroll = _undef(options.autoScroll, true);
			KDialog.parent.init.call(self, options);
			var title = options.title,
				body = K(options.body, self.doc),
				previewBtn = options.previewBtn,
				yesBtn = options.yesBtn,
				noBtn = options.noBtn,
				closeBtn = options.closeBtn,
				showMask = _undef(options.showMask, true);
			self.div.addClass('ke-dialog').bind('click,mousedown', function(e){
				e.stopPropagation();
			});
			var contentDiv = K('<div class="ke-dialog-content"></div>').appendTo(self.div);
			if (_IE && _V < 7) {
				self.iframeMask = K('<iframe src="about:blank" class="ke-dialog-shadow"></iframe>').appendTo(self.div);
			} else if (shadowMode) {
				K('<div class="ke-dialog-shadow"></div>').appendTo(self.div);
			}
			var headerDiv = K('<div class="ke-dialog-header"></div>');
			contentDiv.append(headerDiv);
			headerDiv.html(title);
			self.closeIcon = K('<span class="ke-dialog-icon-close" title="' + closeBtn.name + '"></span>').click(closeBtn.click);
			headerDiv.append(self.closeIcon);
			self.draggable({
				clickEl : headerDiv,
				beforeDrag : options.beforeDrag
			});
			var bodyDiv = K('<div class="ke-dialog-body"></div>');
			contentDiv.append(bodyDiv);
			bodyDiv.append(body);
			var footerDiv = K('<div class="ke-dialog-footer"></div>');
			if (previewBtn || yesBtn || noBtn) {
				contentDiv.append(footerDiv);
			}
			_each([
				{ btn : previewBtn, name : 'preview' },
				{ btn : yesBtn, name : 'yes' },
				{ btn : noBtn, name : 'no' }
			], function() {
				if (this.btn) {
					var button = _createButton(this.btn);
					button.addClass('ke-dialog-' + this.name);
					footerDiv.append(button);
				}
			});
			if (self.height) {
				bodyDiv.height(_removeUnit(self.height) - headerDiv.height() - footerDiv.height());
			}
			self.div.width(self.div.width());
			self.div.height(self.div.height());
			self.mask = null;
			if (showMask) {
				var docEl = _docElement(self.doc),
					docWidth = Math.max(docEl.scrollWidth, docEl.clientWidth),
					docHeight = Math.max(docEl.scrollHeight, docEl.clientHeight);
				self.mask = _widget({
					x : 0,
					y : 0,
					z : self.z - 1,
					cls : 'ke-dialog-mask',
					width : docWidth,
					height : docHeight
				});
			}
			self.autoPos(self.div.width(), self.div.height());
			self.footerDiv = footerDiv;
			self.bodyDiv = bodyDiv;
			self.headerDiv = headerDiv;
			self.isLoading = false;
		},
		setMaskIndex : function(z) {
			var self = this;
			self.mask.div.css('z-index', z);
		},
		showLoading : function(msg) {
			msg = _undef(msg, '');
			var self = this, body = self.bodyDiv;
			self.loading = K('<div class="ke-dialog-loading"><div class="ke-inline-block ke-dialog-loading-content" style="margin-top:' + Math.round(body.height() / 3) + 'px;">' + msg + '</div></div>')
				.width(body.width()).height(body.height())
				.css('top', self.headerDiv.height() + 'px');
			body.css('visibility', 'hidden').after(self.loading);
			self.isLoading = true;
			return self;
		},
		hideLoading : function() {
			this.loading && this.loading.remove();
			this.bodyDiv.css('visibility', 'visible');
			this.isLoading = false;
			return this;
		},
		remove : function() {
			var self = this;
			if (self.options.beforeRemove) {
				self.options.beforeRemove.call(self);
			}
			self.mask && self.mask.remove();
			self.iframeMask && self.iframeMask.remove();
			self.closeIcon.unbind();
			K('input', self.div).unbind();
			K('button', self.div).unbind();
			self.footerDiv.unbind();
			self.bodyDiv.unbind();
			self.headerDiv.unbind();
			K('iframe', self.div).each(function() {
				K(this).remove();
			});
			KDialog.parent.remove.call(self);
			return self;
		}
	});
	function _dialog(options) {
		return new KDialog(options);
	}
	K.DialogClass = KDialog;
	K.dialog = _dialog;


	function _tabs(options) {
		var self = _widget(options),
			remove = self.remove,
			afterSelect = options.afterSelect,
			div = self.div,
			liList = [];
		div.addClass('ke-tabs')
			.bind('contextmenu,mousedown,mousemove', function(e) {
				e.preventDefault();
			});
		var ul = K('<ul class="ke-tabs-ul ke-clearfix"></ul>');
		div.append(ul);
		self.add = function(tab) {
			var li = K('<li class="ke-tabs-li">' + tab.title + '</li>');
			li.data('tab', tab);
			liList.push(li);
			ul.append(li);
		};
		self.selectedIndex = 0;
		self.select = function(index) {
			self.selectedIndex = index;
			_each(liList, function(i, li) {
				li.unbind();
				if (i === index) {
					li.addClass('ke-tabs-li-selected');
					K(li.data('tab').panel).show('');
				} else {
					li.removeClass('ke-tabs-li-selected').removeClass('ke-tabs-li-on')
						.mouseover(function() {
							K(this).addClass('ke-tabs-li-on');
						})
						.mouseout(function() {
							K(this).removeClass('ke-tabs-li-on');
						})
						.click(function() {
							self.select(i);
						});
					K(li.data('tab').panel).hide();
				}
			});
			if (afterSelect) {
				afterSelect.call(self, index);
			}
		};
		self.remove = function() {
			_each(liList, function() {
				this.remove();
			});
			ul.remove();
			remove.call(self);
		};
		return self;
	}
	K.tabs = _tabs;


	function _loadScript(url, fn) {
		var head = document.getElementsByTagName('head')[0] || (_QUIRKS ? document.body : document.documentElement),
			script = document.createElement('script');
		head.appendChild(script);
		script.src = url;
		script.charset = 'utf-8';
		script.onload = script.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded') {
				if (fn) {
					fn();
				}
				script.onload = script.onreadystatechange = null;
				head.removeChild(script);
			}
		};
	}


	function _chopQuery(url) {
		var index = url.indexOf('?');
		return index > 0 ? url.substr(0, index) : url;
	}
	function _loadStyle(url) {
		var head = document.getElementsByTagName('head')[0] || (_QUIRKS ? document.body : document.documentElement),
			link = document.createElement('link'),
			absoluteUrl = _chopQuery(_formatUrl(url, 'absolute'));
		var links = K('link[rel="stylesheet"]', head);
		for (var i = 0, len = links.length; i < len; i++) {
			if (_chopQuery(_formatUrl(links[i].href, 'absolute')) === absoluteUrl) {
				return;
			}
		}
		head.appendChild(link);
		link.href = url;
		link.rel = 'stylesheet';
	}
	function _ajax(url, fn, method, param, dataType) {
		method = method || 'GET';
		dataType = dataType || 'json';
		var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		xhr.open(method, url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if (fn) {
					var data = _trim(xhr.responseText);
					if (dataType == 'json') {
						data = _json(data);
					}
					fn(data);
				}
			}
		};
		if (method == 'POST') {
			var params = [];
			_each(param, function(key, val) {
				params.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
			});
			try {
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			} catch (e) {}
			xhr.send(params.join('&'));
		} else {
			xhr.send(null);
		}
	}
	K.loadScript = _loadScript;
	K.loadStyle = _loadStyle;
	K.ajax = _ajax;


	function _dataURLtoBlob(dataURL) {
		var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {type: mime});
	}
	function _ajaxImageUpload(self,html)
	{
		var doc = self.edit.doc;
		var formdata = new FormData();
		formdata.append('name','snapshot.png');
		formdata.append('file',_dataURLtoBlob($(html).attr('src')),'snapshot.png');
		$.ajax({
			url: self.uploadJson,
			type:"POST",
			Accept: 'text/html;charset=UTF-8',
			cache:false,
			async:true,
			processData:false,
			contentType: false,
			crossDomain:true,
			data:formdata,
			xhr:function(){
				var myXhr = $.ajaxSettings.xhr();
				if (myXhr.upload){
					myXhr.upload.addEventListener('progress',function(e){
						var loaded = e.loaded;//已经上传大小情况
						var total = e.total;//附件总大小
						var per = Math.floor(100*loaded/total);
						K('#__kindeditor_paste_image_mask__',doc).css('height',(100-per)+'%');
					}, false);
				}
				return myXhr;
			},
			beforeSend:function(xhr,setting){
				// self.insertHtml('<div id="__kindeditor_paste_image__" style="display: inline-block;position: relative;"><div id="__kindeditor_paste_image_mask__" style="position: absolute;background: rgba(0,0,0,0.3);height: 100%;width: 100%; "></div>'+html+'</div>',true);
				self.insertHtml('<div id="__kindeditor_paste_image__" style="display: inline-block;position: relative;">' +
					'<div id="__kindeditor_paste_image_mask__" ' +
					'style="position: absolute;background: rgba(0,0,0,0.3);height: 100%;width: 100%; ">' +
					'</div>粘贴图片上传中...</div>',true);
			},
			success:function(data){
				K.query('#__kindeditor_paste_image__',doc).remove();
				if (typeof self.options.afterUploaded === 'function'){
					data = self.options.afterUploaded(data);
				}
				if (data.error !== 0) {
					alert('上传失败:'+data.message);
					return;
				}else{
					html= '<img src="'+data.url+'">';
					self.insertHtml(html, true);
				}
			},
			error:function(e){
				K('#__kindeditor_paste_image__').remove();
			}
		});
	}
	var _plugins = {};
	function _plugin(name, fn) {
		if (name === undefined) {
			return _plugins;
		}
		if (!fn) {
			return _plugins[name];
		}
		_plugins[name] = fn;
	}
	var _language = {};
	function _parseLangKey(key) {
		var match, ns = 'core';
		if ((match = /^(\w+)\.(\w+)$/.exec(key))) {
			ns = match[1];
			key = match[2];
		}
		return { ns : ns, key : key };
	}
	function _lang(mixed, langType) {
		langType = langType === undefined ? K.options.langType : langType;
		if (typeof mixed === 'string') {
			if (!_language[langType]) {
				return 'no language';
			}
			var pos = mixed.length - 1;
			if (mixed.substr(pos) === '.') {
				return _language[langType][mixed.substr(0, pos)];
			}
			var obj = _parseLangKey(mixed);
			return _language[langType][obj.ns][obj.key];
		}
		_each(mixed, function(key, val) {
			var obj = _parseLangKey(key);
			if (!_language[langType]) {
				_language[langType] = {};
			}
			if (!_language[langType][obj.ns]) {
				_language[langType][obj.ns] = {};
			}
			_language[langType][obj.ns][obj.key] = val;
		});
	}


	function _getImageFromRange(range, fn) {
		if (range.collapsed) {
			return;
		}
		range = range.cloneRange().up();
		var sc = range.startContainer, so = range.startOffset;
		if (!_WEBKIT && !range.isControl()) {
			return;
		}
		var img = K(sc.childNodes[so]);
		if (!img || img.name != 'img') {
			return;
		}
		if (fn(img)) {
			return img;
		}
	}
	function _bindContextmenuEvent() {
		var self = this, doc = self.edit.doc;
		K(doc).contextmenu(function(e) {
			if (self.menu) {
				self.hideMenu();
			}
			if (!self.useContextmenu) {
				e.preventDefault();
				return;
			}
			if (self._contextmenus.length === 0) {
				return;
			}
			var maxWidth = 0, items = [];
			_each(self._contextmenus, function() {
				if (this.title == '-') {
					items.push(this);
					return;
				}
				if (this.cond && this.cond()) {
					items.push(this);
					if (this.width && this.width > maxWidth) {
						maxWidth = this.width;
					}
				}
			});
			while (items.length > 0 && items[0].title == '-') {
				items.shift();
			}
			while (items.length > 0 && items[items.length - 1].title == '-') {
				items.pop();
			}
			var prevItem = null;
			_each(items, function(i) {
				if (this.title == '-' && prevItem.title == '-') {
					delete items[i];
				}
				prevItem = this;
			});
			if (items.length > 0) {
				e.preventDefault();
				var pos = K(self.edit.iframe).pos(),
					menu = _menu({
						x : pos.x + e.clientX,
						y : pos.y + e.clientY,
						width : maxWidth,
						css : { visibility: 'hidden' },
						shadowMode : self.shadowMode
					});
				_each(items, function() {
					if (this.title) {
						menu.addItem(this);
					}
				});
				var docEl = _docElement(menu.doc),
					menuHeight = menu.div.height();
				if (e.clientY + menuHeight >= docEl.clientHeight - 100) {
					menu.pos(menu.x, _removeUnit(menu.y) - menuHeight);
				}
				menu.div.css('visibility', 'visible');
				self.menu = menu;
			}
		});
	}
	function _bindNewlineEvent() {
		var self = this, doc = self.edit.doc, newlineTag = self.newlineTag;
		if (_IE && newlineTag !== 'br') {
			return;
		}
		if (_GECKO && _V < 3 && newlineTag !== 'p') {
			return;
		}
		if (_OPERA && _V < 9) {
			return;
		}
		var brSkipTagMap = _toMap('h1,h2,h3,h4,h5,h6,pre,li'),
			pSkipTagMap = _toMap('p,h1,h2,h3,h4,h5,h6,pre,li,blockquote');
		function getAncestorTagName(range) {
			var ancestor = K(range.commonAncestor());
			while (ancestor) {
				if (ancestor.type == 1 && !ancestor.isStyle()) {
					break;
				}
				ancestor = ancestor.parent();
			}
			return ancestor.name;
		}
		K(doc).keydown(function(e) {
			if (e.which != 13 || e.shiftKey || e.ctrlKey || e.altKey) {
				return;
			}
			self.cmd.selection();
			var tagName = getAncestorTagName(self.cmd.range);
			if (tagName == 'marquee' || tagName == 'select') {
				return;
			}
			if (newlineTag === 'br' && !brSkipTagMap[tagName]) {
				e.preventDefault();
				self.insertHtml('<br />' + (_IE && _V < 9 ? '' : '\u200B'));
				return;
			}
			if (!pSkipTagMap[tagName]) {
				_nativeCommand(doc, 'formatblock', '<p>');
			}
		});
		K(doc).keyup(function(e) {
			if (e.which != 13 || e.shiftKey || e.ctrlKey || e.altKey) {
				return;
			}
			if (newlineTag == 'br') {
				return;
			}
			if (_GECKO) {
				var root = self.cmd.commonAncestor('p');
				var a = self.cmd.commonAncestor('a');
				if (a && a.text() == '') {
					a.remove(true);
					self.cmd.range.selectNodeContents(root[0]).collapse(true);
					self.cmd.select();
				}
				return;
			}
			self.cmd.selection();
			var tagName = getAncestorTagName(self.cmd.range);
			if (tagName == 'marquee' || tagName == 'select') {
				return;
			}
			if (!pSkipTagMap[tagName]) {
				_nativeCommand(doc, 'formatblock', '<p>');
			}
		});
	}
	function _bindTabEvent() {
		var self = this, doc = self.edit.doc;
		K(doc).keydown(function(e) {
			if (e.which == 9) {
				e.preventDefault();
				if (self.afterTab) {
					self.afterTab.call(self, e);
					return;
				}
				var cmd = self.cmd, range = cmd.range;
				range.shrink();
				if (range.collapsed && range.startContainer.nodeType == 1) {
					range.insertNode(K('@&nbsp;', doc)[0]);
					cmd.select();
				}
				self.insertHtml('&nbsp;&nbsp;&nbsp;&nbsp;');
			}
		});
	}
	function _bindFocusEvent() {
		var self = this;
		K(self.edit.textarea[0], self.edit.win).focus(function(e) {
			if (self.afterFocus) {
				self.afterFocus.call(self, e);
			}
		}).blur(function(e) {
			if (self.afterBlur) {
				self.afterBlur.call(self, e);
			}
		});
	}
	function _removeBookmarkTag(html) {
		return _trim(html.replace(/<span [^>]*id="?__kindeditor_bookmark_\w+_\d+__"?[^>]*><\/span>/ig, ''));
	}
	function _removeTempTag(html) {
		return html.replace(/<div[^>]+class="?__kindeditor_paste__"?[^>]*>[\s\S]*?<\/div>/ig, '');
	}
	function _addBookmarkToStack(stack, bookmark) {
		if (stack.length === 0) {
			stack.push(bookmark);
			return;
		}
		var prev = stack[stack.length - 1];
		if (_removeBookmarkTag(bookmark.html) !== _removeBookmarkTag(prev.html)) {
			stack.push(bookmark);
		}
	}



	function _undoToRedo(fromStack, toStack) {
		var self = this, edit = self.edit,
			body = edit.doc.body,
			range, bookmark;
		if (fromStack.length === 0) {
			return self;
		}
		if (edit.designMode) {
			range = self.cmd.range;
			bookmark = range.createBookmark(true);
			bookmark.html = body.innerHTML;
		} else {
			bookmark = {
				html : body.innerHTML
			};
		}
		_addBookmarkToStack(toStack, bookmark);
		var prev = fromStack.pop();
		if (_removeBookmarkTag(bookmark.html) === _removeBookmarkTag(prev.html) && fromStack.length > 0) {
			prev = fromStack.pop();
		}
		if (edit.designMode) {
			edit.html(prev.html);
			if (prev.start) {
				range.moveToBookmark(prev);
				self.select();
			}
		} else {
			K(body).html(_removeBookmarkTag(prev.html));
		}
		return self;
	}
	function KEditor(options) {
		var self = this;
		self.options = {};
		function setOption(key, val) {
			if (KEditor.prototype[key] === undefined) {
				self[key] = val;
			}
			self.options[key] = val;
		}
		_each(options, function(key, val) {
			setOption(key, options[key]);
		});
		_each(K.options, function(key, val) {
			if (self[key] === undefined) {
				setOption(key, val);
			}
		});
		var se = K(self.srcElement || '<textarea/>');
		if (!self.width) {
			self.width = se[0].style.width || se.width();
		}
		if (!self.height) {
			self.height = se[0].style.height || se.height();
		}
		setOption('width', _undef(self.width, self.minWidth));
		setOption('height', _undef(self.height, self.minHeight));
		setOption('width', _addUnit(self.width));
		setOption('height', _addUnit(self.height));
		if (_MOBILE && (!_IOS || _V < 534)) {
			self.designMode = false;
		}
		self.srcElement = se;
		self.initContent = '';
		self.plugin = {};
		self.isCreated = false;
		self._handlers = {};
		self._contextmenus = [];
		self._undoStack = [];
		self._redoStack = [];
		self._firstAddBookmark = true;
		self.menu = self.contextmenu = null;
		self.dialogs = [];
	}
	KEditor.prototype = {
		lang : function(mixed) {
			return _lang(mixed, this.langType);
		},
		loadPlugin : function(name, fn) {
			var self = this;
			var _pluginStatus = this._pluginStatus;
			if (!_pluginStatus) {
				_pluginStatus = this._pluginStatus = {};
			}
			if (_plugins[name]) {
				if (!_isFunction(_plugins[name])) {
					setTimeout(function() {
						self.loadPlugin(name, fn);
					}, 100);
					return self;
				}
				if(!_pluginStatus[name]) {
					_plugins[name].call(self, KindEditor);
					_pluginStatus[name] = 'inited';
				}
				if (fn) {
					fn.call(self);
				}
				return self;
			}
			_plugins[name] = 'loading';
			_loadScript(self.pluginsPath + name + '/' + name + '.js?ver=' + encodeURIComponent(K.DEBUG ? _TIME : _VERSION), function() {
				setTimeout(function() {
					if (_plugins[name]) {
						self.loadPlugin(name, fn);
					}
				}, 0);
			});
			return self;
		},
		handler : function(key, fn) {
			var self = this;
			if (!self._handlers[key]) {
				self._handlers[key] = [];
			}
			if (_isFunction(fn)) {
				self._handlers[key].push(fn);
				return self;
			}
			_each(self._handlers[key], function() {
				fn = this.call(self, fn);
			});
			return fn;
		},
		clickToolbar : function(name, fn) {
			var self = this, key = 'clickToolbar' + name;
			if (fn === undefined) {
				if (self._handlers[key]) {
					return self.handler(key);
				}
				self.loadPlugin(name, function() {
					self.handler(key);
				});
				return self;
			}
			return self.handler(key, fn);
		},
		updateState : function() {
			var self = this;
			_each(('justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,insertunorderedlist,' +
				'subscript,superscript,bold,italic,underline,strikethrough').split(','), function(i, name) {
				self.cmd.state(name) ? self.toolbar.select(name) : self.toolbar.unselect(name);
			});
			return self;
		},
		addContextmenu : function(item) {
			this._contextmenus.push(item);
			return this;
		},
		afterCreate : function(fn) {
			return this.handler('afterCreate', fn);
		},
		beforeRemove : function(fn) {
			return this.handler('beforeRemove', fn);
		},
		beforeGetHtml : function(fn) {
			return this.handler('beforeGetHtml', fn);
		},
		beforeSetHtml : function(fn) {
			return this.handler('beforeSetHtml', fn);
		},
		afterSetHtml : function(fn) {
			return this.handler('afterSetHtml', fn);
		},
		create : function() {
			var self = this, fullscreenMode = self.fullscreenMode;
			if (self.isCreated) {
				return self;
			}
			if (self.srcElement.data('kindeditor')) {
				return self;
			}
			self.srcElement.data('kindeditor', 'true');
			if (fullscreenMode) {
				_docElement().style.overflow = 'hidden';
			} else {
				_docElement().style.overflow = '';
			}
			var width = fullscreenMode ? _docElement().clientWidth + 'px' : self.width,
				height = fullscreenMode ? _docElement().clientHeight + 'px' : self.height;
			if ((_IE && _V < 8) || _QUIRKS) {
				height = _addUnit(_removeUnit(height) + 2);
			}
			var container = self.container = K(self.layout);
			if (fullscreenMode) {
				K(document.body).append(container);
			} else {
				self.srcElement.before(container);
			}
			var toolbarDiv = K('.toolbar', container),
				editDiv = K('.edit', container),
				statusbar = self.statusbar = K('.statusbar', container);
			container.removeClass('container')
				.addClass('ke-container ke-container-' + self.themeType).css('width', width);
			if (fullscreenMode) {
				container.css({
					position : 'absolute',
					left : 0,
					top : 0,
					'z-index' : 811211
				});
				if (!_GECKO) {
					self._scrollPos = _getScrollPos();
				}
				window.scrollTo(0, 0);
				K(document.body).css({
					'height' : '1px',
					'overflow' : 'hidden'
				});
				K(document.body.parentNode).css('overflow', 'hidden');
				self._fullscreenExecuted = true;
			} else {
				if (self._fullscreenExecuted) {
					K(document.body).css({
						'height' : '',
						'overflow' : ''
					});
					K(document.body.parentNode).css('overflow', '');
				}
				if (self._scrollPos) {
					window.scrollTo(self._scrollPos.x, self._scrollPos.y);
				}
			}
			var htmlList = [];
			K.each(self.items, function(i, name) {
				if (name == '|') {
					htmlList.push('<span class="ke-inline-block ke-separator"></span>');
				} else if (name == '/') {
					htmlList.push('<div class="ke-hr"></div>');
				} else {
					htmlList.push('<span class="ke-outline" data-name="' + name + '" title="' + self.lang(name) + '" unselectable="on">');
					htmlList.push('<span class="ke-toolbar-icon ke-toolbar-icon-url ke-icon-' + name + '" unselectable="on"></span></span>');
				}
			});
			var toolbar = self.toolbar = _toolbar({
				src : toolbarDiv,
				html : htmlList.join(''),
				noDisableItems : self.noDisableItems,
				click : function(e, name) {
					e.stop();
					if (self.menu) {
						var menuName = self.menu.name;
						self.hideMenu();
						if (menuName === name) {
							return;
						}
					}
					self.clickToolbar(name);
				}
			});
			var editHeight = _removeUnit(height) - toolbar.div.height();
			var edit = self.edit = _edit({
				height : editHeight > 0 && _removeUnit(height) > self.minHeight ? editHeight : self.minHeight,
				src : editDiv,
				srcElement : self.srcElement,
				designMode : self.designMode,
				themesPath : self.themesPath,
				bodyClass : self.bodyClass,
				cssPath : self.cssPath,
				cssData : self.cssData,
				beforeGetHtml : function(html) {
					html = self.beforeGetHtml(html);
					html = _removeBookmarkTag(_removeTempTag(html));
					return _formatHtml(html, self.filterMode ? self.htmlTags : null, self.urlType, self.wellFormatMode, self.indentChar);
				},
				beforeSetHtml : function(html) {
					html = _formatHtml(html, self.filterMode ? self.htmlTags : null, '', false);
					return self.beforeSetHtml(html);
				},
				afterSetHtml : function() {
					self.edit = edit = this;
					self.afterSetHtml();
				},
				afterCreate : function() {
					self.edit = edit = this;
					self.cmd = edit.cmd;
					self._docMousedownFn = function(e) {
						if (self.menu) {
							self.hideMenu();
						}
					};
					K(edit.doc, document).mousedown(self._docMousedownFn);
					_bindContextmenuEvent.call(self);
					_bindNewlineEvent.call(self);
					_bindTabEvent.call(self);
					_bindFocusEvent.call(self);
					edit.afterChange(function(e) {
						if (!edit.designMode) {
							return;
						}
						self.updateState();
						self.addBookmark();
						if (self.options.afterChange) {
							self.options.afterChange.call(self);
						}
					});
					edit.textarea.keyup(function(e) {
						if (!e.ctrlKey && !e.altKey && _INPUT_KEY_MAP[e.which]) {
							if (self.options.afterChange) {
								self.options.afterChange.call(self);
							}
						}
					});
					if (self.readonlyMode) {
						self.readonly();
					}
					self.isCreated = true;
					if (self.initContent === '') {
						self.initContent = self.html();
					}
					if (self._undoStack.length > 0) {
						var prev = self._undoStack.pop();
						if (prev.start) {
							self.html(prev.html);
							edit.cmd.range.moveToBookmark(prev);
							self.select();
						}
					}
					self.afterCreate();
					if (self.options.afterCreate) {
						self.options.afterCreate.call(self);
					}
				}
			});
			statusbar.removeClass('statusbar').addClass('ke-statusbar')
				.append('<span class="ke-inline-block ke-statusbar-center-icon"></span>')
				.append('<span class="ke-inline-block ke-statusbar-right-icon"></span>');
			if (self._fullscreenResizeHandler) {
				K(window).unbind('resize', self._fullscreenResizeHandler);
				self._fullscreenResizeHandler = null;
			}
			function initResize() {
				if (statusbar.height() === 0) {
					setTimeout(initResize, 100);
					return;
				}
				self.resize(width, height, false);
			}
			initResize();
			if (fullscreenMode) {
				self._fullscreenResizeHandler = function(e) {
					if (self.isCreated) {
						self.resize(_docElement().clientWidth, _docElement().clientHeight, false);
					}
				};
				K(window).bind('resize', self._fullscreenResizeHandler);
				toolbar.select('fullscreen');
				statusbar.first().css('visibility', 'hidden');
				statusbar.last().css('visibility', 'hidden');
			} else {
				if (_GECKO) {
					K(window).bind('scroll', function(e) {
						self._scrollPos = _getScrollPos();
					});
				}
				if (self.resizeType > 0) {
					_drag({
						moveEl : container,
						clickEl : statusbar,
						moveFn : function(x, y, width, height, diffX, diffY) {
							height += diffY;
							self.resize(null, height);
						}
					});
				} else {
					statusbar.first().css('visibility', 'hidden');
				}
				if (self.resizeType === 2) {
					_drag({
						moveEl : container,
						clickEl : statusbar.last(),
						moveFn : function(x, y, width, height, diffX, diffY) {
							width += diffX;
							height += diffY;
							self.resize(width, height);
						}
					});
				} else {
					statusbar.last().css('visibility', 'hidden');
				}
			}
			return self;
		},
		remove : function() {
			var self = this;
			if (!self.isCreated) {
				return self;
			}
			self.beforeRemove();
			self.srcElement.data('kindeditor', '');
			if (self.menu) {
				self.hideMenu();
			}
			_each(self.dialogs, function() {
				self.hideDialog();
			});
			K(document).unbind('mousedown', self._docMousedownFn);
			self.toolbar.remove();
			self.edit.remove();
			self.statusbar.last().unbind();
			self.statusbar.unbind();
			self.container.remove();
			self.container = self.toolbar = self.edit = self.menu = null;
			self.dialogs = [];
			self.isCreated = false;
			return self;
		},
		resize : function(width, height, updateProp) {
			var self = this;
			updateProp = _undef(updateProp, true);
			if (width) {
				if (!/%/.test(width)) {
					width = _removeUnit(width);
					width = width < self.minWidth ? self.minWidth : width;
				}
				self.container.css('width', _addUnit(width));
				if (updateProp) {
					self.width = _addUnit(width);
				}
			}
			if (height) {
				height = _removeUnit(height);
				var editHeight = _removeUnit(height) - self.toolbar.div.height() - self.statusbar.height();
				editHeight = editHeight < self.minHeight ? self.minHeight : editHeight;
				self.edit.setHeight(editHeight);
				if (updateProp) {
					self.height = _addUnit(height);
				}
			}
			return self;
		},
		select : function() {
			this.isCreated && this.cmd.select();
			return this;
		},
		html : function(val) {
			var self = this;
			if (val === undefined) {
				return self.isCreated ? self.edit.html() : _elementVal(self.srcElement);
			}
			self.isCreated ? self.edit.html(val) : _elementVal(self.srcElement, val);
			if (self.isCreated) {
				self.cmd.selection();
			}
			return self;
		},
		fullHtml : function() {
			return this.isCreated ? this.edit.html(undefined, true) : '';
		},
		text : function(val) {
			var self = this;
			if (val === undefined) {
				return _trim(self.html().replace(/<(?!img|embed).*?>/ig, '').replace(/&nbsp;/ig, ' '));
			} else {
				return self.html(_escape(val));
			}
		},
		isEmpty : function() {
			return _trim(this.text().replace(/\r\n|\n|\r/, '')) === '';
		},
		isDirty : function() {
			return _trim(this.initContent.replace(/\r\n|\n|\r|t/g, '')) !== _trim(this.html().replace(/\r\n|\n|\r|t/g, ''));
		},
		selectedHtml : function() {
			var val = this.isCreated ? this.cmd.range.html() : '';
			val = _removeBookmarkTag(_removeTempTag(val));
			return val;
		},
		count : function(mode) {
			var self = this;
			mode = (mode || 'html').toLowerCase();
			if (mode === 'html') {
				return self.html().length;
			}
			if (mode === 'text') {
				return self.text().replace(/<(?:img|embed).*?>/ig, 'K').replace(/\r\n|\n|\r/g, '').length;
			}
			return 0;
		},
		exec : function(key) {
			key = key.toLowerCase();
			var self = this, cmd = self.cmd,
				changeFlag = _inArray(key, 'selectall,copy,paste,print'.split(',')) < 0;
			if (changeFlag) {
				self.addBookmark(false);
			}
			cmd[key].apply(cmd, _toArray(arguments, 1));
			if (changeFlag) {
				self.updateState();
				self.addBookmark(false);
				if (self.options.afterChange) {
					self.options.afterChange.call(self);
				}
			}
			return self;
		},
		insertHtml : function(val, quickMode) {
			if (!this.isCreated) {
				return this;
			}
			val = this.beforeSetHtml(val);
			this.exec('inserthtml', val, quickMode);
			return this;
		},
		appendHtml : function(val) {
			this.html(this.html() + val);
			if (this.isCreated) {
				var cmd = this.cmd;
				cmd.range.selectNodeContents(cmd.doc.body).collapse(false);
				cmd.select();
			}
			return this;
		},
		sync : function() {
			_elementVal(this.srcElement, this.html());
			return this;
		},
		focus : function() {
			this.isCreated ? this.edit.focus() : this.srcElement[0].focus();
			return this;
		},
		blur : function() {
			this.isCreated ? this.edit.blur() : this.srcElement[0].blur();
			return this;
		},
		addBookmark : function(checkSize) {
			checkSize = _undef(checkSize, true);
			var self = this, edit = self.edit,
				body = edit.doc.body,
				html = _removeTempTag(body.innerHTML), bookmark;
			if (checkSize && self._undoStack.length > 0) {
				var prev = self._undoStack[self._undoStack.length - 1];
				if (Math.abs(html.length - _removeBookmarkTag(prev.html).length) < self.minChangeSize) {
					return self;
				}
			}
			if (edit.designMode && !self._firstAddBookmark) {
				var range = self.cmd.range;
				bookmark = range.createBookmark(true);
				bookmark.html = _removeTempTag(body.innerHTML);
				range.moveToBookmark(bookmark);
			} else {
				bookmark = {
					html : html
				};
			}
			self._firstAddBookmark = false;
			_addBookmarkToStack(self._undoStack, bookmark);
			return self;
		},
		undo : function() {
			return _undoToRedo.call(this, this._undoStack, this._redoStack);
		},
		redo : function() {
			return _undoToRedo.call(this, this._redoStack, this._undoStack);
		},
		fullscreen : function(bool) {
			this.fullscreenMode = (bool === undefined ? !this.fullscreenMode : bool);
			this.addBookmark(false);
			return this.remove().create();
		},
		readonly : function(isReadonly) {
			isReadonly = _undef(isReadonly, true);
			var self = this, edit = self.edit, doc = edit.doc;
			if (self.designMode) {
				self.toolbar.disableAll(isReadonly, []);
			} else {
				_each(self.noDisableItems, function() {
					self.toolbar[isReadonly ? 'disable' : 'enable'](this);
				});
			}
			if (_IE) {
				doc.body.contentEditable = !isReadonly;
			} else {
				doc.designMode = isReadonly ? 'off' : 'on';
			}
			edit.textarea[0].disabled = isReadonly;
		},
		createMenu : function(options) {
			var self = this,
				name = options.name,
				knode = self.toolbar.get(name),
				pos = knode.pos();
			options.x = pos.x;
			options.y = pos.y + knode.height();
			options.z = self.options.zIndex;
			options.shadowMode = _undef(options.shadowMode, self.shadowMode);
			if (options.selectedColor !== undefined) {
				options.cls = 'ke-colorpicker-' + self.themeType;
				options.noColor = self.lang('noColor');
				self.menu = _colorpicker(options);
			} else {
				options.cls = 'ke-menu-' + self.themeType;
				options.centerLineMode = false;
				self.menu = _menu(options);
			}
			return self.menu;
		},
		hideMenu : function() {
			this.menu.remove();
			this.menu = null;
			return this;
		},
		hideContextmenu : function() {
			this.contextmenu.remove();
			this.contextmenu = null;
			return this;
		},
		createDialog : function(options) {
			var self = this, name = options.name;
			options.z = self.options.zIndex;
			options.shadowMode = _undef(options.shadowMode, self.shadowMode);
			options.closeBtn = _undef(options.closeBtn, {
				name : self.lang('close'),
				click : function(e) {
					self.hideDialog();
					if (_IE && self.cmd) {
						self.cmd.select();
					}
				}
			});
			options.noBtn = _undef(options.noBtn, {
				name : self.lang(options.yesBtn ? 'no' : 'close'),
				click : function(e) {
					self.hideDialog();
					if (_IE && self.cmd) {
						self.cmd.select();
					}
				}
			});
			if (self.dialogAlignType != 'page') {
				options.alignEl = self.container;
			}
			options.cls = 'ke-dialog-' + self.themeType;
			if (self.dialogs.length > 0) {
				var firstDialog = self.dialogs[0],
					parentDialog = self.dialogs[self.dialogs.length - 1];
				firstDialog.setMaskIndex(parentDialog.z + 2);
				options.z = parentDialog.z + 3;
				options.showMask = false;
			}
			var dialog = _dialog(options);
			self.dialogs.push(dialog);
			return dialog;
		},
		hideDialog : function() {
			var self = this;
			if (self.dialogs.length > 0) {
				self.dialogs.pop().remove();
			}
			if (self.dialogs.length > 0) {
				var firstDialog = self.dialogs[0],
					parentDialog = self.dialogs[self.dialogs.length - 1];
				firstDialog.setMaskIndex(parentDialog.z - 1);
			}
			return self;
		},
		errorDialog : function(html) {
			var self = this;
			var dialog = self.createDialog({
				width : 750,
				title : self.lang('uploadError'),
				body : '<div style="padding:10px 20px;"><iframe frameborder="0" style="width:708px;height:400px;"></iframe></div>'
			});
			var iframe = K('iframe', dialog.div), doc = K.iframeDoc(iframe);
			doc.open();
			doc.write(html);
			doc.close();
			K(doc.body).css('background-color', '#FFF');
			iframe[0].contentWindow.focus();
			return self;
		}
	};
	function _editor(options) {
		return new KEditor(options);
	}
	var _instances = [];
	function _create(expr, options) {
		options = options || {};
		options.basePath = _undef(options.basePath, K.basePath);
		options.themesPath = _undef(options.themesPath, options.basePath + 'themes/');
		options.langPath = _undef(options.langPath, options.basePath + 'lang/');
		options.pluginsPath = _undef(options.pluginsPath, options.basePath + 'plugins/');
		if (_undef(options.loadStyleMode, K.options.loadStyleMode)) {
			var themeType = _undef(options.themeType, K.options.themeType);
			_loadStyle(options.themesPath + 'default/default.css');
			_loadStyle(options.themesPath + themeType + '/' + themeType + '.css');
		}
		function create(editor) {
			_each(_plugins, function(name, fn) {
				if (_isFunction(fn)) {
					fn.call(editor, KindEditor);
					if (!editor._pluginStatus) {
						editor._pluginStatus = {};
					}
					editor._pluginStatus[name] = 'inited';
				}
			});
			return editor.create();
		}
		var knode = K(expr);
		if (!knode || knode.length === 0) {
			return;
		}
		if (knode.length > 1) {
			knode.each(function() {
				_create(this, options);
			});
			return _instances[0];
		}
		options.srcElement = knode[0];
		var editor = new KEditor(options);
		_instances.push(editor);
		if (_language[editor.langType]) {
			return create(editor);
		}
		_loadScript(editor.langPath + editor.langType + '.js?ver=' + encodeURIComponent(K.DEBUG ? _TIME : _VERSION), function() {
			create(editor);
		});
		return editor;
	}
	function _eachEditor(expr, fn) {
		K(expr).each(function(i, el) {
			K.each(_instances, function(j, editor) {
				if (editor && editor.srcElement[0] == el) {
					fn.call(editor, j);
					return false;
				}
			});
		});
	}
	K.remove = function(expr) {
		_eachEditor(expr, function(i) {
			this.remove();
			_instances.splice(i, 1);
		});
	};
	K.sync = function(expr) {
		_eachEditor(expr, function() {
			this.sync();
		});
	};
	K.html = function(expr, val) {
		_eachEditor(expr, function() {
			this.html(val);
		});
	};
	K.insertHtml = function(expr, val) {
		_eachEditor(expr, function() {
			this.insertHtml(val);
		});
	};
	K.appendHtml = function(expr, val) {
		_eachEditor(expr, function() {
			this.appendHtml(val);
		});
	};


	if (_IE && _V < 7) {
		_nativeCommand(document, 'BackgroundImageCache', true);
	}
	K.EditorClass = KEditor;
	K.editor = _editor;
	K.create = _create;
	K.instances = _instances;
	K.plugin = _plugin;
	K.lang = _lang;


	_plugin('core', function(K) {
		var self = this,
			shortcutKeys = {
				undo : 'Z', redo : 'Y', bold : 'B', italic : 'I', underline : 'U', print : 'P', selectall : 'A'
			};
		self.afterSetHtml(function() {
			if (self.options.afterChange) {
				self.options.afterChange.call(self);
			}
		});
		self.afterCreate(function() {
			if (self.syncType != 'form') {
				return;
			}
			var el = K(self.srcElement), hasForm = false;
			while ((el = el.parent())) {
				if (el.name == 'form') {
					hasForm = true;
					break;
				}
			}
			if (hasForm) {
				el.bind('submit', function(e) {
					self.sync();
					K(window).bind('unload', function() {
						self.edit.textarea.remove();
					});
				});
				var resetBtn = K('[type="reset"]', el);
				resetBtn.click(function() {
					self.html(self.initContent);
					self.cmd.selection();
				});
				self.beforeRemove(function() {
					el.unbind();
					resetBtn.unbind();
				});
			}
		});
		self.clickToolbar('source', function() {
			if (self.edit.designMode) {
				self.toolbar.disableAll(true);
				self.edit.design(false);
				self.toolbar.select('source');
			} else {
				self.toolbar.disableAll(false);
				self.edit.design(true);
				self.toolbar.unselect('source');
				if (_GECKO) {
					setTimeout(function() {
						self.cmd.selection();
					}, 0);
				} else {
					self.cmd.selection();
				}
			}
			self.designMode = self.edit.designMode;
		});
		self.afterCreate(function() {
			if (!self.designMode) {
				self.toolbar.disableAll(true).select('source');
			}
		});
		self.clickToolbar('fullscreen', function() {
			self.fullscreen();
		});
		if (self.fullscreenShortcut) {
			var loaded = false;
			self.afterCreate(function() {
				K(self.edit.doc, self.edit.textarea).keyup(function(e) {
					if (e.which == 27) {
						setTimeout(function() {
							self.fullscreen();
						}, 0);
					}
				});
				if (loaded) {
					if (_IE && !self.designMode) {
						return;
					}
					self.focus();
				}
				if (!loaded) {
					loaded = true;
				}
			});
		}
		_each('undo,redo'.split(','), function(i, name) {
			if (shortcutKeys[name]) {
				self.afterCreate(function() {
					_ctrl(this.edit.doc, shortcutKeys[name], function() {
						self.clickToolbar(name);
					});
				});
			}
			self.clickToolbar(name, function() {
				self[name]();
			});
		});
		self.clickToolbar('formatblock', function() {
			var blocks = self.lang('formatblock.formatBlock'),
				heights = {
					h1 : 28,
					h2 : 24,
					h3 : 18,
					H4 : 14,
					p : 12
				},
				curVal = self.cmd.val('formatblock'),
				menu = self.createMenu({
					name : 'formatblock',
					width : self.langType == 'en' ? 200 : 150
				});
			_each(blocks, function(key, val) {
				var style = 'font-size:' + heights[key] + 'px;';
				if (key.charAt(0) === 'h') {
					style += 'font-weight:bold;';
				}
				menu.addItem({
					title : '<span style="' + style + '" unselectable="on">' + val + '</span>',
					height : heights[key] + 12,
					checked : (curVal === key || curVal === val),
					click : function() {
						self.select().exec('formatblock', '<' + key + '>').hideMenu();
					}
				});
			});
		});
		self.clickToolbar('fontname', function() {
			var curVal = self.cmd.val('fontname'),
				menu = self.createMenu({
					name : 'fontname',
					width : 150
				});
			_each(self.lang('fontname.fontName'), function(key, val) {
				menu.addItem({
					title : '<span style="font-family: ' + key + ';" unselectable="on">' + val + '</span>',
					checked : (curVal === key.toLowerCase() || curVal === val.toLowerCase()),
					click : function() {
						self.exec('fontname', key).hideMenu();
					}
				});
			});
		});
		self.clickToolbar('fontsize', function() {
			var curVal = self.cmd.val('fontsize'),
				menu = self.createMenu({
					name : 'fontsize',
					width : 150
				});
			_each(self.fontSizeTable, function(i, val) {
				menu.addItem({
					title : '<span style="font-size:' + val + ';" unselectable="on">' + val + '</span>',
					height : _removeUnit(val) + 12,
					checked : curVal === val,
					click : function() {
						self.exec('fontsize', val).hideMenu();
					}
				});
			});
		});
		_each('forecolor,hilitecolor'.split(','), function(i, name) {
			self.clickToolbar(name, function() {
				self.createMenu({
					name : name,
					selectedColor : self.cmd.val(name) || 'default',
					colors : self.colorTable,
					click : function(color) {
						self.exec(name, color).hideMenu();
					}
				});
			});
		});
		_each(('cut,copy,paste').split(','), function(i, name) {
			self.clickToolbar(name, function() {
				self.focus();
				try {
					self.exec(name, null);
				} catch(e) {
					alert(self.lang(name + 'Error'));
				}
			});
		});
		self.clickToolbar('about', function() {
			var html = '<div style="margin:20px;">' +
				'<div>KindEditor ' + _VERSION + '</div>' +
				'<div>Copyright &copy; <a href="http://www.kindsoft.net/" target="_blank">kindsoft.net</a> All rights reserved.</div>' +
				'</div>';
			self.createDialog({
				name : 'about',
				width : 350,
				title : self.lang('about'),
				body : html
			});
		});
		self.plugin.getSelectedLink = function() {
			return self.cmd.commonAncestor('a');
		};
		self.plugin.getSelectedImage = function() {
			return _getImageFromRange(self.edit.cmd.range, function(img) {
				return !/^ke-\w+$/i.test(img[0].className);
			});
		};
		self.plugin.getSelectedFlash = function() {
			return _getImageFromRange(self.edit.cmd.range, function(img) {
				return img[0].className == 'ke-flash';
			});
		};
		self.plugin.getSelectedMedia = function() {
			return _getImageFromRange(self.edit.cmd.range, function(img) {
				return img[0].className == 'ke-media' || img[0].className == 'ke-rm';
			});
		};
		self.plugin.getSelectedAnchor = function() {
			return _getImageFromRange(self.edit.cmd.range, function(img) {
				return img[0].className == 'ke-anchor';
			});
		};
		_each('link,image,flash,media,anchor'.split(','), function(i, name) {
			var uName = name.charAt(0).toUpperCase() + name.substr(1);
			_each('edit,delete'.split(','), function(j, val) {
				self.addContextmenu({
					title : self.lang(val + uName),
					click : function() {
						self.loadPlugin(name, function() {
							self.plugin[name][val]();
							self.hideMenu();
						});
					},
					cond : self.plugin['getSelected' + uName],
					width : 150,
					iconClass : val == 'edit' ? 'ke-icon-' + name : undefined
				});
			});
			self.addContextmenu({ title : '-' });
		});
		self.plugin.getSelectedTable = function() {
			return self.cmd.commonAncestor('table');
		};
		self.plugin.getSelectedRow = function() {
			return self.cmd.commonAncestor('tr');
		};
		self.plugin.getSelectedCell = function() {
			return self.cmd.commonAncestor('td');
		};
		_each(('prop,cellprop,colinsertleft,colinsertright,rowinsertabove,rowinsertbelow,rowmerge,colmerge,' +
			'rowsplit,colsplit,coldelete,rowdelete,insert,delete').split(','), function(i, val) {
			var cond = _inArray(val, ['prop', 'delete']) < 0 ? self.plugin.getSelectedCell : self.plugin.getSelectedTable;
			self.addContextmenu({
				title : self.lang('table' + val),
				click : function() {
					self.loadPlugin('table', function() {
						self.plugin.table[val]();
						self.hideMenu();
					});
				},
				cond : cond,
				width : 170,
				iconClass : 'ke-icon-table' + val
			});
		});
		self.addContextmenu({ title : '-' });
		_each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
			'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,' +
			'bold,italic,underline,strikethrough,removeformat,unlink').split(','), function(i, name) {
			if (shortcutKeys[name]) {
				self.afterCreate(function() {
					_ctrl(this.edit.doc, shortcutKeys[name], function() {
						self.cmd.selection();
						self.clickToolbar(name);
					});
				});
			}
			self.clickToolbar(name, function() {
				self.focus().exec(name, null);
			});
		});
		self.afterCreate(function() {
			var doc = self.edit.doc, cmd, bookmark, div,
				cls = '__kindeditor_paste__', pasting = false;
			function movePastedData() {
				cmd.range.moveToBookmark(bookmark);
				cmd.select();
				if (_WEBKIT) {
					K('div.' + cls, div).each(function() {
						K(this).after('<br />').remove(true);
					});
					K('span.Apple-style-span', div).remove(true);
					K('span.Apple-tab-span', div).remove(true);
					K('span[style]', div).each(function() {
						if (K(this).css('white-space') == 'nowrap') {
							K(this).remove(true);
						}
					});
					K('meta', div).remove();
				}
				var html = div[0].innerHTML;
				div.remove();
				if (html === '') {
					return;
				}
				if (_WEBKIT) {
					html = html.replace(/(<br>)\1/ig, '$1');
				}
				if (self.pasteType === 2) {
					html = html.replace(/(<(?:p|p\s[^>]*)>) *(<\/p>)/ig, '');
					if (/schemas-microsoft-com|worddocument|mso-\w+/i.test(html)) {
						html = _clearMsWord(html, self.filterMode ? self.htmlTags : K.options.htmlTags);
					} else {
						html = _formatHtml(html, self.filterMode ? self.htmlTags : null);
						html = self.beforeSetHtml(html);
					}
				}
				if (self.pasteType === 1) {
					html = html.replace(/&nbsp;/ig, ' ');
					html = html.replace(/\n\s*\n/g, '\n');
					html = html.replace(/<br[^>]*>/ig, '\n');
					html = html.replace(/<\/p><p[^>]*>/ig, '\n');
					html = html.replace(/<[^>]+>/g, '');
					html = html.replace(/ {2}/g, ' &nbsp;');
					if (self.newlineTag == 'p') {
						if (/\n/.test(html)) {
							html = html.replace(/^/, '<p>').replace(/$/, '<br /></p>').replace(/\n/g, '<br /></p><p>');
						}
					} else {
						html = html.replace(/\n/g, '<br />$&');
					}
				}
				var imgPattern = /<img\s+src="data:image\/png;base64/;
				var filePattern = /<img\s+src="file:\/\//g;
				if (imgPattern.test(html)){
					_ajaxImageUpload(self,html);
				}else if(filePattern.test(html)){
					alert('本地图片建议使用图片上传');
				}else{
					self.insertHtml(html, true);
				}
			}
			K(doc.body).bind('paste', function(e){
				if (self.pasteType === 0) {
					e.stop();
					return;
				}
				if (pasting) {
					return;
				}
				pasting = true;
				K('div.' + cls, doc).remove();
				cmd = self.cmd.selection();
				bookmark = cmd.range.createBookmark();
				div = K('<div class="' + cls + '"></div>', doc).css({
					position : 'absolute',
					width : '1px',
					height : '1px',
					overflow : 'hidden',
					left : '-1981px',
					top : K(bookmark.start).pos().y + 'px',
					'white-space' : 'nowrap'
				});
				K(doc.body).append(div);
				if (_IE) {
					var rng = cmd.range.get(true);
					rng.moveToElementText(div[0]);
					rng.select();
					rng.execCommand('paste');
					e.preventDefault();
				} else {
					cmd.range.selectNodeContents(div[0]);
					cmd.select();
					div[0].tabIndex = -1;
					div[0].focus();
				}
				setTimeout(function() {
					movePastedData();
					pasting = false;
				}, 0);
			});
		});
		self.beforeGetHtml(function(html) {
			if (_IE && _V <= 8) {
				html = html.replace(/<div\s+[^>]*data-ke-input-tag="([^"]*)"[^>]*>([\s\S]*?)<\/div>/ig, function(full, tag) {
					return unescape(tag);
				});
				html = html.replace(/(<input)((?:\s+[^>]*)?>)/ig, function($0, $1, $2) {
					if (!/\s+type="[^"]+"/i.test($0)) {
						return $1 + ' type="text"' + $2;
					}
					return $0;
				});
			}
			return html.replace(/(<(?:noscript|noscript\s[^>]*)>)([\s\S]*?)(<\/noscript>)/ig, function($0, $1, $2, $3) {
				return $1 + _unescape($2).replace(/\s+/g, ' ') + $3;
			})
				.replace(/<img[^>]*class="?ke-(flash|rm|media)"?[^>]*>/ig, function(full) {
					var imgAttrs = _getAttrList(full);
					var styles = _getCssList(imgAttrs.style || '');
					var attrs = _mediaAttrs(imgAttrs['data-ke-tag']);
					var width = _undef(styles.width, '');
					var height = _undef(styles.height, '');
					if (/px/i.test(width)) {
						width = _removeUnit(width);
					}
					if (/px/i.test(height)) {
						height = _removeUnit(height);
					}
					attrs.width = _undef(imgAttrs.width, width);
					attrs.height = _undef(imgAttrs.height, height);
					return _mediaEmbed(attrs);
				})
				.replace(/<img[^>]*class="?ke-anchor"?[^>]*>/ig, function(full) {
					var imgAttrs = _getAttrList(full);
					return '<a name="' + unescape(imgAttrs['data-ke-name']) + '"></a>';
				})
				.replace(/<div\s+[^>]*data-ke-script-attr="([^"]*)"[^>]*>([\s\S]*?)<\/div>/ig, function(full, attr, code) {
					return '<script' + unescape(attr) + '>' + unescape(code) + '</script>';
				})
				.replace(/<div\s+[^>]*data-ke-noscript-attr="([^"]*)"[^>]*>([\s\S]*?)<\/div>/ig, function(full, attr, code) {
					return '<noscript' + unescape(attr) + '>' + unescape(code) + '</noscript>';
				})
				.replace(/(<[^>]*)data-ke-src="([^"]*)"([^>]*>)/ig, function(full, start, src, end) {
					full = full.replace(/(\s+(?:href|src)=")[^"]*(")/i, function($0, $1, $2) {
						return $1 + _unescape(src) + $2;
					});
					full = full.replace(/\s+data-ke-src="[^"]*"/i, '');
					return full;
				})
				.replace(/(<[^>]+\s)data-ke-(on\w+="[^"]*"[^>]*>)/ig, function(full, start, end) {
					return start + end;
				});
		});
		self.beforeSetHtml(function(html) {
			if (_IE && _V <= 8) {
				html = html.replace(/<input[^>]*>|<(select|button)[^>]*>[\s\S]*?<\/\1>/ig, function(full) {
					var attrs = _getAttrList(full);
					var styles = _getCssList(attrs.style || '');
					if (styles.display == 'none') {
						return '<div class="ke-display-none" data-ke-input-tag="' + escape(full) + '"></div>';
					}
					return full;
				});
			}
			return html.replace(/<embed[^>]*type="([^"]+)"[^>]*>(?:<\/embed>)?/ig, function(full) {
				var attrs = _getAttrList(full);
				attrs.src = _undef(attrs.src, '');
				attrs.width = _undef(attrs.width, 0);
				attrs.height = _undef(attrs.height, 0);
				return _mediaImg(self.themesPath + 'common/blank.gif', attrs);
			})
				.replace(/<a[^>]*name="([^"]+)"[^>]*>(?:<\/a>)?/ig, function(full) {
					var attrs = _getAttrList(full);
					if (attrs.href !== undefined) {
						return full;
					}
					return '<img class="ke-anchor" src="' + self.themesPath + 'common/anchor.gif" data-ke-name="' + escape(attrs.name) + '" />';
				})
				.replace(/<script([^>]*)>([\s\S]*?)<\/script>/ig, function(full, attr, code) {
					return '<div class="ke-script" data-ke-script-attr="' + escape(attr) + '">' + escape(code) + '</div>';
				})
				.replace(/<noscript([^>]*)>([\s\S]*?)<\/noscript>/ig, function(full, attr, code) {
					return '<div class="ke-noscript" data-ke-noscript-attr="' + escape(attr) + '">' + escape(code) + '</div>';
				})
				.replace(/(<[^>]*)(href|src)="([^"]*)"([^>]*>)/ig, function(full, start, key, src, end) {
					if (full.match(/\sdata-ke-src="[^"]*"/i)) {
						return full;
					}
					full = start + key + '="' + src + '"' + ' data-ke-src="' + _escape(src) + '"' + end;
					return full;
				})
				.replace(/(<[^>]+\s)(on\w+="[^"]*"[^>]*>)/ig, function(full, start, end) {
					return start + 'data-ke-' + end;
				})
				.replace(/<table[^>]*\s+border="0"[^>]*>/ig, function(full) {
					if (full.indexOf('ke-zeroborder') >= 0) {
						return full;
					}
					return _addClassToTag(full, 'ke-zeroborder');
				});
		});
	});


})(window);

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.lang({
	'insertimages' : '批量图片上传',
	'insertimages.uploadDesc' : '允许用户同时上传<%=uploadLimit%>张图片，单张图片容量不超过<%=sizeLimit%>',
	'insertimages.startUpload' : '开始上传',
	'insertimages.clearAll' : '全部清空',
	'insertimages.insertAll' : '全部插入',
	'insertimages.queueLimitExceeded' : '文件数量超过限制。',
	'insertimages.fileExceedsSizeLimit' : '文件大小超过限制。',
	'insertimages.zeroByteFile' : '无法上传空文件。',
	'insertimages.invalidFiletype' : '文件类型不正确。',
	'insertimages.unknownError' : '发生异常，无法上传。',
	'insertimages.pending' : '等待上传',
	'insertimages.uploadError' : '上传失败',
	source : 'HTML代码',
	preview : '预览',
	undo : '后退(Ctrl+Z)',
	redo : '前进(Ctrl+Y)',
	cut : '剪切(Ctrl+X)',
	copy : '复制(Ctrl+C)',
	paste : '粘贴(Ctrl+V)',
	plainpaste : '粘贴为无格式文本',
	wordpaste : '从Word粘贴',
	selectall : '全选(Ctrl+A)',
	justifyleft : '左对齐',
	justifycenter : '居中',
	justifyright : '右对齐',
	justifyfull : '两端对齐',
	insertorderedlist : '编号',
	insertunorderedlist : '项目符号',
	indent : '增加缩进',
	outdent : '减少缩进',
	subscript : '下标',
	superscript : '上标',
	formatblock : '段落',
	fontname : '字体',
	fontsize : '文字大小',
	forecolor : '文字颜色',
	hilitecolor : '文字背景',
	bold : '粗体(Ctrl+B)',
	italic : '斜体(Ctrl+I)',
	underline : '下划线(Ctrl+U)',
	strikethrough : '删除线',
	removeformat : '删除格式',
	image : '图片',
	multiimage : '批量图片上传',
	flash : 'Flash',
	media : '视音频',
	table : '表格',
	tablecell : '单元格',
	hr : '插入横线',
	emoticons : '插入表情',
	link : '超级链接',
	unlink : '取消超级链接',
	fullscreen : '全屏显示',
	about : '关于',
	print : '打印(Ctrl+P)',
	filemanager : '文件空间',
	code : '插入程序代码',
	map : 'Google地图',
	baidumap : '百度地图',
	lineheight : '行距',
	clearhtml : '清理HTML代码',
	pagebreak : '插入分页符',
	quickformat : '一键排版',
	insertfile : '插入文件',
	template : '插入模板',
	anchor : '锚点',
	yes : '确定',
	no : '取消',
	close : '关闭',
	editImage : '图片属性',
	deleteImage : '删除图片',
	editFlash : 'Flash属性',
	deleteFlash : '删除Flash',
	editMedia : '视音频属性',
	deleteMedia : '删除视音频',
	editLink : '超级链接属性',
	deleteLink : '取消超级链接',
	editAnchor : '锚点属性',
	deleteAnchor : '删除锚点',
	tableprop : '表格属性',
	tablecellprop : '单元格属性',
	tableinsert : '插入表格',
	tabledelete : '删除表格',
	tablecolinsertleft : '左侧插入列',
	tablecolinsertright : '右侧插入列',
	tablerowinsertabove : '上方插入行',
	tablerowinsertbelow : '下方插入行',
	tablerowmerge : '向下合并单元格',
	tablecolmerge : '向右合并单元格',
	tablerowsplit : '拆分行',
	tablecolsplit : '拆分列',
	tablecoldelete : '删除列',
	tablerowdelete : '删除行',
	noColor : '无颜色',
	pleaseSelectFile : '请选择文件。',
	invalidImg : "请输入有效的URL地址。\n只允许jpg,gif,bmp,png格式。",
	invalidMedia : "请输入有效的URL地址。\n只允许swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb格式。",
	invalidWidth : "宽度必须为数字。",
	invalidHeight : "高度必须为数字。",
	invalidBorder : "边框必须为数字。",
	invalidUrl : "请输入有效的URL地址。",
	invalidRows : '行数为必选项，只允许输入大于0的数字。',
	invalidCols : '列数为必选项，只允许输入大于0的数字。',
	invalidPadding : '边距必须为数字。',
	invalidSpacing : '间距必须为数字。',
	invalidJson : '服务器发生故障。',
	uploadSuccess : '上传成功。',
	cutError : '您的浏览器安全设置不允许使用剪切操作，请使用快捷键(Ctrl+X)来完成。',
	copyError : '您的浏览器安全设置不允许使用复制操作，请使用快捷键(Ctrl+C)来完成。',
	pasteError : '您的浏览器安全设置不允许使用粘贴操作，请使用快捷键(Ctrl+V)来完成。',
	ajaxLoading : '加载中，请稍候 ...',
	uploadLoading : '上传中，请稍候 ...',
	uploadError : '上传错误',
	'plainpaste.comment' : '请使用快捷键(Ctrl+V)把内容粘贴到下面的方框里。',
	'wordpaste.comment' : '请使用快捷键(Ctrl+V)把内容粘贴到下面的方框里。',
	'code.pleaseInput' : '请输入程序代码。',
	'link.url' : 'URL',
	'link.linkType' : '打开类型',
	'link.newWindow' : '新窗口',
	'link.selfWindow' : '当前窗口',
	'flash.url' : 'URL',
	'flash.width' : '宽度',
	'flash.height' : '高度',
	'flash.upload' : '上传',
	'flash.viewServer' : '文件空间',
	'media.url' : 'URL',
	'media.width' : '宽度',
	'media.height' : '高度',
	'media.autostart' : '自动播放',
	'media.upload' : '上传',
	'media.viewServer' : '文件空间',
	'image.remoteImage' : '网络图片',
	'image.localImage' : '本地上传',
	'image.remoteUrl' : '图片地址',
	'image.localUrl' : '上传文件',
	'image.size' : '图片大小',
	'image.width' : '宽',
	'image.height' : '高',
	'image.resetSize' : '重置大小',
	'image.align' : '对齐方式',
	'image.defaultAlign' : '默认方式',
	'image.leftAlign' : '左对齐',
	'image.rightAlign' : '右对齐',
	'image.imgTitle' : '图片说明',
	'image.upload' : '浏览...',
	'image.viewServer' : '图片空间',
	'multiimage.uploadDesc' : '允许用户同时上传<%=uploadLimit%>张图片，单张图片容量不超过<%=sizeLimit%>',
	'multiimage.startUpload' : '开始上传',
	'multiimage.clearAll' : '全部清空',
	'multiimage.insertAll' : '全部插入',
	'multiimage.queueLimitExceeded' : '文件数量超过限制。',
	'multiimage.fileExceedsSizeLimit' : '文件大小超过限制。',
	'multiimage.zeroByteFile' : '无法上传空文件。',
	'multiimage.invalidFiletype' : '文件类型不正确。',
	'multiimage.unknownError' : '发生异常，无法上传。',
	'multiimage.pending' : '等待上传',
	'multiimage.uploadError' : '上传失败',
	'filemanager.emptyFolder' : '空文件夹',
	'filemanager.moveup' : '移到上一级文件夹',
	'filemanager.viewType' : '显示方式：',
	'filemanager.viewImage' : '缩略图',
	'filemanager.listImage' : '详细信息',
	'filemanager.orderType' : '排序方式：',
	'filemanager.fileName' : '名称',
	'filemanager.fileSize' : '大小',
	'filemanager.fileType' : '类型',
	'insertfile.url' : 'URL',
	'insertfile.title' : '文件说明',
	'insertfile.upload' : '上传',
	'insertfile.viewServer' : '文件空间',
	'table.cells' : '单元格数',
	'table.rows' : '行数',
	'table.cols' : '列数',
	'table.size' : '大小',
	'table.width' : '宽度',
	'table.height' : '高度',
	'table.percent' : '%',
	'table.px' : 'px',
	'table.space' : '边距间距',
	'table.padding' : '边距',
	'table.spacing' : '间距',
	'table.align' : '对齐方式',
	'table.textAlign' : '水平对齐',
	'table.verticalAlign' : '垂直对齐',
	'table.alignDefault' : '默认',
	'table.alignLeft' : '左对齐',
	'table.alignCenter' : '居中',
	'table.alignRight' : '右对齐',
	'table.alignTop' : '顶部',
	'table.alignMiddle' : '中部',
	'table.alignBottom' : '底部',
	'table.alignBaseline' : '基线',
	'table.border' : '边框',
	'table.borderWidth' : '边框',
	'table.borderColor' : '颜色',
	'table.backgroundColor' : '背景颜色',
	'map.address' : '地址: ',
	'map.search' : '搜索',
	'baidumap.address' : '地址: ',
	'baidumap.search' : '搜索',
	'baidumap.insertDynamicMap' : '插入动态地图',
	'anchor.name' : '锚点名称',
	'formatblock.formatBlock' : {
		h1 : '标题 1',
		h2 : '标题 2',
		h3 : '标题 3',
		h4 : '标题 4',
		p : '正 文'
	},
	'fontname.fontName' : {
		'SimSun' : '宋体',
		'NSimSun' : '新宋体',
		'FangSong_GB2312' : '仿宋_GB2312',
		'KaiTi_GB2312' : '楷体_GB2312',
		'SimHei' : '黑体',
		'Microsoft YaHei' : '微软雅黑',
		'Arial' : 'Arial',
		'Arial Black' : 'Arial Black',
		'Times New Roman' : 'Times New Roman',
		'Courier New' : 'Courier New',
		'Tahoma' : 'Tahoma',
		'Verdana' : 'Verdana'
	},
	'lineheight.lineHeight' : [
		{'1' : '单倍行距'},
		{'1.5' : '1.5倍行距'},
		{'2' : '2倍行距'},
		{'2.5' : '2.5倍行距'},
		{'3' : '3倍行距'}
	],
	'template.selectTemplate' : '可选模板',
	'template.replaceContent' : '替换当前内容',
	'template.fileList' : {
		'1.html' : '图片和文字',
		'2.html' : '表格',
		'3.html' : '项目编号'
	}
}, 'zh-CN');
KindEditor.options.langType = 'zh-CN';
/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('anchor', function(K) {
	var self = this, name = 'anchor', lang = self.lang(name + '.');
	self.plugin.anchor = {
		edit : function() {
			var html = ['<div style="padding:20px;">',
				'<div class="ke-dialog-row">',
				'<label for="keName">' + lang.name + '</label>',
				'<input class="ke-input-text" type="text" id="keName" name="name" value="" style="width:100px;" />',
				'</div>',
				'</div>'].join('');
			var dialog = self.createDialog({
				name : name,
				width : 300,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						self.insertHtml('<a name="' + nameBox.val() + '">').hideDialog().focus();
					}
				}
			});
			var div = dialog.div,
				nameBox = K('input[name="name"]', div);
			var img = self.plugin.getSelectedAnchor();
			if (img) {
				nameBox.val(unescape(img.attr('data-ke-name')));
			}
			nameBox[0].focus();
			nameBox[0].select();
		},
		'delete' : function() {
			self.plugin.getSelectedAnchor().remove();
		}
	};
	self.clickToolbar(name, self.plugin.anchor.edit);
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('autoheight', function(K) {
	var self = this;
	if (!self.autoHeightMode) {
		return;
	}
	var minHeight;
	function hideScroll() {
		var edit = self.edit;
		var body = edit.doc.body;
		edit.iframe[0].scroll = 'no';
		body.style.overflowY = 'hidden';
	}
	function resetHeight() {
		if(self.fullscreenMode){
			return;
		}
		var edit = self.edit;
		var body = edit.doc.body;
		edit.iframe.height(minHeight);
		self.resize(null, Math.max((K.IE ? body.scrollHeight : body.offsetHeight) + 76, minHeight));
	}
	function init() {
		minHeight = K.removeUnit(self.height);
		self.edit.afterChange(resetHeight);
		if(!self.fullscreenMode){
			hideScroll();
		}
		resetHeight();
	}
	if (self.isCreated) {
		init();
	} else {
		self.afterCreate(init);
	}
});
/*
* 如何实现真正的自动高度？
* 修改编辑器高度之后，再次获取body内容高度时，最小值只会是当前iframe的设置高度，这样就导致高度只增不减。
* 所以每次获取body内容高度之前，先将iframe的高度重置为最小高度，这样就能获取body的实际高度。
* 由此就实现了真正的自动高度
* 测试：chrome、firefox、IE9、IE8
* */

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('baidumap', function(K) {
	var self = this, name = 'baidumap', lang = self.lang(name + '.');
	var mapWidth = K.undef(self.mapWidth, 558);
	var mapHeight = K.undef(self.mapHeight, 360);
	self.clickToolbar(name, function() {
		var html = ['<div style="padding:10px 20px;">',
			'<div class="ke-header">',
			'<div class="ke-left">',
			lang.address + ' <input id="kindeditor_plugin_map_address" name="address" class="ke-input-text" value="" style="width:200px;" /> ',
			'<span class="ke-button-common ke-button-outer">',
			'<input type="button" name="searchBtn" class="ke-button-common ke-button" value="' + lang.search + '" />',
			'</span>',
			'</div>',
			'<div class="ke-right">',
			'<input type="checkbox" id="keInsertDynamicMap" name="insertDynamicMap" value="1" /> <label for="keInsertDynamicMap">' + lang.insertDynamicMap + '</label>',
			'</div>',
			'<div class="ke-clearfix"></div>',
			'</div>',
			'<div class="ke-map" style="width:' + mapWidth + 'px;height:' + mapHeight + 'px;"></div>',
			'</div>'].join('');
		var dialog = self.createDialog({
			name : name,
			width : mapWidth + 42,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var map = win.map;
					var centerObj = map.getCenter();
					var center = centerObj.lng + ',' + centerObj.lat;
					var zoom = map.getZoom();
					var url = [checkbox[0].checked ? self.pluginsPath + 'baidumap/index.html' : 'http://api.map.baidu.com/staticimage',
						'?center=' + encodeURIComponent(center),
						'&zoom=' + encodeURIComponent(zoom),
						'&width=' + mapWidth,
						'&height=' + mapHeight,
						'&markers=' + encodeURIComponent(center),
						'&markerStyles=' + encodeURIComponent('l,A')].join('');
					if (checkbox[0].checked) {
						self.insertHtml('<iframe src="' + url + '" frameborder="0" style="width:' + (mapWidth + 2) + 'px;height:' + (mapHeight + 2) + 'px;"></iframe>');
					} else {
						self.exec('insertimage', url);
					}
					self.hideDialog().focus();
				}
			},
			beforeRemove : function() {
				searchBtn.remove();
				if (doc) {
					doc.write('');
				}
				iframe.remove();
			}
		});
		var div = dialog.div,
			addressBox = K('[name="address"]', div),
			searchBtn = K('[name="searchBtn"]', div),
			checkbox = K('[name="insertDynamicMap"]', dialog.div),
			win, doc;
		var iframe = K('<iframe class="ke-textarea" frameborder="0" src="' + self.pluginsPath + 'baidumap/map.html" style="width:' + mapWidth + 'px;height:' + mapHeight + 'px;"></iframe>');
		function ready() {
			win = iframe[0].contentWindow;
			doc = K.iframeDoc(iframe);
		}
		iframe.bind('load', function() {
			iframe.unbind('load');
			if (K.IE) {
				ready();
			} else {
				setTimeout(ready, 0);
			}
		});
		K('.ke-map', div).replaceWith(iframe);
		searchBtn.click(function() {
			win.search(addressBox.val());
		});
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/


KindEditor.plugin('map', function(K) {
	var self = this, name = 'map', lang = self.lang(name + '.');
	self.clickToolbar(name, function() {
		var html = ['<div style="padding:10px 20px;">',
			'<div class="ke-dialog-row">',
			lang.address + ' <input id="kindeditor_plugin_map_address" name="address" class="ke-input-text" value="" style="width:200px;" /> ',
			'<span class="ke-button-common ke-button-outer">',
			'<input type="button" name="searchBtn" class="ke-button-common ke-button" value="' + lang.search + '" />',
			'</span>',
			'</div>',
			'<div class="ke-map" style="width:558px;height:360px;"></div>',
			'</div>'].join('');
		var dialog = self.createDialog({
			name : name,
			width : 600,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var geocoder = win.geocoder,
						map = win.map,
						center = map.getCenter().lat() + ',' + map.getCenter().lng(),
						zoom = map.getZoom(),
						maptype = map.getMapTypeId(),
						url = 'http://maps.googleapis.com/maps/api/staticmap';
					url += '?center=' + encodeURIComponent(center);
					url += '&zoom=' + encodeURIComponent(zoom);
					url += '&size=558x360';
					url += '&maptype=' + encodeURIComponent(maptype);
					url += '&markers=' + encodeURIComponent(center);
					url += '&language=' + self.langType;
					url += '&sensor=false';
					self.exec('insertimage', url).hideDialog().focus();
				}
			},
			beforeRemove : function() {
				searchBtn.remove();
				if (doc) {
					doc.write('');
				}
				iframe.remove();
			}
		});
		var div = dialog.div,
			addressBox = K('[name="address"]', div),
			searchBtn = K('[name="searchBtn"]', div),
			win, doc;
		var iframeHtml = ['<!doctype html><html><head>',
			'<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />',
			'<style>',
			'	html { height: 100% }',
			'	body { height: 100%; margin: 0; padding: 0; background-color: #FFF }',
			'	#map_canvas { height: 100% }',
			'</style>',
			'<script src="http://maps.googleapis.com/maps/api/js?sensor=false&language=' + self.langType + '"></script>',
			'<script>',
			'var map, geocoder;',
			'function initialize() {',
			'	var latlng = new google.maps.LatLng(31.230393, 121.473704);',
			'	var options = {',
			'		zoom: 11,',
			'		center: latlng,',
			'		disableDefaultUI: true,',
			'		panControl: true,',
			'		zoomControl: true,',
			'		mapTypeControl: true,',
			'		scaleControl: true,',
			'		streetViewControl: false,',
			'		overviewMapControl: true,',
			'		mapTypeId: google.maps.MapTypeId.ROADMAP',
			'	};',
			'	map = new google.maps.Map(document.getElementById("map_canvas"), options);',
			'	geocoder = new google.maps.Geocoder();',
			'	geocoder.geocode({latLng: latlng}, function(results, status) {',
			'		if (status == google.maps.GeocoderStatus.OK) {',
			'			if (results[3]) {',
			'				parent.document.getElementById("kindeditor_plugin_map_address").value = results[3].formatted_address;',
			'			}',
			'		}',
			'	});',
			'}',
			'function search(address) {',
			'	if (!map) return;',
			'	geocoder.geocode({address : address}, function(results, status) {',
			'		if (status == google.maps.GeocoderStatus.OK) {',
			'			map.setZoom(11);',
			'			map.setCenter(results[0].geometry.location);',
			'			var marker = new google.maps.Marker({',
			'				map: map,',
			'				position: results[0].geometry.location',
			'			});',
			'		} else {',
			'			alert("Invalid address: " + address);',
			'		}',
			'	});',
			'}',
			'</script>',
			'</head>',
			'<body onload="initialize();">',
			'<div id="map_canvas" style="width:100%; height:100%"></div>',
			'</body></html>'].join('\n');
		var iframe = K('<iframe class="ke-textarea" frameborder="0" src="' + self.pluginsPath + 'map/map.html" style="width:558px;height:360px;"></iframe>');
		function ready() {
			win = iframe[0].contentWindow;
			doc = K.iframeDoc(iframe);
		}
		iframe.bind('load', function() {
			iframe.unbind('load');
			if (K.IE) {
				ready();
			} else {
				setTimeout(ready, 0);
			}
		});
		K('.ke-map', div).replaceWith(iframe);
		searchBtn.click(function() {
			win.search(addressBox.val());
		});
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('clearhtml', function(K) {
	var self = this, name = 'clearhtml';
	self.clickToolbar(name, function() {
		self.focus();
		var html = self.html();
		html = html.replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/ig, '');
		html = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/ig, '');
		html = K.formatHtml(html, {
			a : ['href', 'target'],
			embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
			img : ['src', 'width', 'height', 'border', 'alt', 'title', '.width', '.height'],
			table : ['border'],
			'td,th' : ['rowspan', 'colspan'],
			'div,hr,br,tbody,tr,p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : []
		});
		self.html(html);
		self.cmd.selection(true);
		self.addBookmark();
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/



KindEditor.plugin('code', function(K) {
	var self = this, name = 'code';
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = ['<div style="padding:10px 20px;">',
				'<div class="ke-dialog-row">',
				'<select class="ke-code-type">',
				'<option value="js">JavaScript</option>',
				'<option value="html">HTML</option>',
				'<option value="css">CSS</option>',
				'<option value="php">PHP</option>',
				'<option value="pl">Perl</option>',
				'<option value="py">Python</option>',
				'<option value="rb">Ruby</option>',
				'<option value="java">Java</option>',
				'<option value="vb">ASP/VB</option>',
				'<option value="cpp">C/C++</option>',
				'<option value="cs">C#</option>',
				'<option value="xml">XML</option>',
				'<option value="bsh">Shell</option>',
				'<option value="">Other</option>',
				'</select>',
				'</div>',
				'<textarea class="ke-textarea" style="width:408px;height:260px;"></textarea>',
				'</div>'].join(''),
			dialog = self.createDialog({
				name : name,
				width : 450,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var type = K('.ke-code-type', dialog.div).val(),
							code = textarea.val(),
							cls = type === '' ? '' :  ' lang-' + type,
							html = '<pre class="prettyprint' + cls + '">\n' + K.escape(code) + '</pre> ';
						if (K.trim(code) === '') {
							alert(lang.pleaseInput);
							textarea[0].focus();
							return;
						}
						self.insertHtml(html).hideDialog().focus();
					}
				}
			}),
			textarea = K('textarea', dialog.div);
		textarea[0].focus();
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('emoticons', function(K) {
	var self = this, name = 'emoticons',
		path = (self.emoticonsPath || self.pluginsPath + 'emoticons/images/'),
		allowPreview = self.allowPreviewEmoticons === undefined ? true : self.allowPreviewEmoticons,
		currentPageNum = 1;
	self.clickToolbar(name, function() {
		var rows = 5, cols = 9, total = 135, startNum = 0,
			cells = rows * cols, pages = Math.ceil(total / cells),
			colsHalf = Math.floor(cols / 2),
			wrapperDiv = K('<div class="ke-plugin-emoticons"></div>'),
			elements = [],
			menu = self.createMenu({
				name : name,
				beforeRemove : function() {
					removeEvent();
				}
			});
		menu.div.append(wrapperDiv);
		var previewDiv, previewImg;
		if (allowPreview) {
			previewDiv = K('<div class="ke-preview"></div>').css('right', 0);
			previewImg = K('<img class="ke-preview-img" src="' + path + startNum + '.gif" />');
			wrapperDiv.append(previewDiv);
			previewDiv.append(previewImg);
		}
		function bindCellEvent(cell, j, num) {
			if (previewDiv) {
				cell.mouseover(function() {
					if (j > colsHalf) {
						previewDiv.css('left', 0);
						previewDiv.css('right', '');
					} else {
						previewDiv.css('left', '');
						previewDiv.css('right', 0);
					}
					previewImg.attr('src', path + num + '.gif');
					K(this).addClass('ke-on');
				});
			} else {
				cell.mouseover(function() {
					K(this).addClass('ke-on');
				});
			}
			cell.mouseout(function() {
				K(this).removeClass('ke-on');
			});
			cell.click(function(e) {
				self.insertHtml('<img src="' + path + num + '.gif" border="0" alt="" />').hideMenu().focus();
				e.stop();
			});
		}
		function createEmoticonsTable(pageNum, parentDiv) {
			var table = document.createElement('table');
			parentDiv.append(table);
			if (previewDiv) {
				K(table).mouseover(function() {
					previewDiv.show('block');
				});
				K(table).mouseout(function() {
					previewDiv.hide();
				});
				elements.push(K(table));
			}
			table.className = 'ke-table';
			table.cellPadding = 0;
			table.cellSpacing = 0;
			table.border = 0;
			var num = (pageNum - 1) * cells + startNum;
			for (var i = 0; i < rows; i++) {
				var row = table.insertRow(i);
				for (var j = 0; j < cols; j++) {
					var cell = K(row.insertCell(j));
					cell.addClass('ke-cell');
					bindCellEvent(cell, j, num);
					var span = K('<span class="ke-img"></span>')
						.css('background-position', '-' + (24 * num) + 'px 0px')
						.css('background-image', 'url(' + path + 'static.gif)');
					cell.append(span);
					elements.push(cell);
					num++;
				}
			}
			return table;
		}
		var table = createEmoticonsTable(currentPageNum, wrapperDiv);
		function removeEvent() {
			K.each(elements, function() {
				this.unbind();
			});
		}
		var pageDiv;
		function bindPageEvent(el, pageNum) {
			el.click(function(e) {
				removeEvent();
				table.parentNode.removeChild(table);
				pageDiv.remove();
				table = createEmoticonsTable(pageNum, wrapperDiv);
				createPageTable(pageNum);
				currentPageNum = pageNum;
				e.stop();
			});
		}
		function createPageTable(currentPageNum) {
			pageDiv = K('<div class="ke-page"></div>');
			wrapperDiv.append(pageDiv);
			for (var pageNum = 1; pageNum <= pages; pageNum++) {
				if (currentPageNum !== pageNum) {
					var a = K('<a href="javascript:;">[' + pageNum + ']</a>');
					bindPageEvent(a, pageNum);
					pageDiv.append(a);
					elements.push(a);
				} else {
					pageDiv.append(K('@[' + pageNum + ']'));
				}
				pageDiv.append(K('@&nbsp;'));
			}
		}
		createPageTable(currentPageNum);
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('filemanager', function(K) {
	var self = this, name = 'filemanager',
		fileManagerJson = K.undef(self.fileManagerJson, self.basePath + 'php/file_manager_json.php'),
		imgPath = self.pluginsPath + name + '/images/',
		lang = self.lang(name + '.');
	function makeFileTitle(filename, filesize, datetime) {
		return filename + ' (' + Math.ceil(filesize / 1024) + 'KB, ' + datetime + ')';
	}
	function bindTitle(el, data) {
		if (data.is_dir) {
			el.attr('title', data.filename);
		} else {
			el.attr('title', makeFileTitle(data.filename, data.filesize, data.datetime));
		}
	}
	self.plugin.filemanagerDialog = function(options) {
		var width = K.undef(options.width, 650),
			height = K.undef(options.height, 510),
			dirName = K.undef(options.dirName, ''),
			viewType = K.undef(options.viewType, 'VIEW').toUpperCase(),
			clickFn = options.clickFn;
		var html = [
			'<div style="padding:10px 20px;">',
			'<div class="ke-plugin-filemanager-header">',
			'<div class="ke-left">',
			'<img class="ke-inline-block" name="moveupImg" src="' + imgPath + 'go-up.gif" width="16" height="16" border="0" alt="" /> ',
			'<a class="ke-inline-block" name="moveupLink" href="javascript:;">' + lang.moveup + '</a>',
			'</div>',
			'<div class="ke-right">',
			lang.viewType + ' <select class="ke-inline-block" name="viewType">',
			'<option value="VIEW">' + lang.viewImage + '</option>',
			'<option value="LIST">' + lang.listImage + '</option>',
			'</select> ',
			lang.orderType + ' <select class="ke-inline-block" name="orderType">',
			'<option value="NAME">' + lang.fileName + '</option>',
			'<option value="SIZE">' + lang.fileSize + '</option>',
			'<option value="TYPE">' + lang.fileType + '</option>',
			'</select>',
			'</div>',
			'<div class="ke-clearfix"></div>',
			'</div>',
			'<div class="ke-plugin-filemanager-body"></div>',
			'</div>'
		].join('');
		var dialog = self.createDialog({
				name : name,
				width : width,
				height : height,
				title : self.lang(name),
				body : html
			}),
			div = dialog.div,
			bodyDiv = K('.ke-plugin-filemanager-body', div),
			moveupImg = K('[name="moveupImg"]', div),
			moveupLink = K('[name="moveupLink"]', div),
			viewServerBtn = K('[name="viewServer"]', div),
			viewTypeBox = K('[name="viewType"]', div),
			orderTypeBox = K('[name="orderType"]', div);
		function reloadPage(path, order, func) {
			var param = 'path=' + path + '&order=' + order + '&dir=' + dirName;
			dialog.showLoading(self.lang('ajaxLoading'));
			K.ajax(K.addParam(fileManagerJson, param + '&' + new Date().getTime()), function(data) {
				dialog.hideLoading();
				func(data);
			});
		}
		var elList = [];
		function bindEvent(el, result, data, createFunc) {
			var fileUrl = K.formatUrl(result.current_url + data.filename, 'absolute'),
				dirPath = encodeURIComponent(result.current_dir_path + data.filename + '/');
			if (data.is_dir) {
				el.click(function(e) {
					reloadPage(dirPath, orderTypeBox.val(), createFunc);
				});
			} else if (data.is_photo) {
				el.click(function(e) {
					clickFn.call(this, fileUrl, data.filename);
				});
			} else {
				el.click(function(e) {
					clickFn.call(this, fileUrl, data.filename);
				});
			}
			elList.push(el);
		}
		function createCommon(result, createFunc) {
			K.each(elList, function() {
				this.unbind();
			});
			moveupLink.unbind();
			viewTypeBox.unbind();
			orderTypeBox.unbind();
			if (result.current_dir_path) {
				moveupLink.click(function(e) {
					reloadPage(result.moveup_dir_path, orderTypeBox.val(), createFunc);
				});
			}
			function changeFunc() {
				if (viewTypeBox.val() == 'VIEW') {
					reloadPage(result.current_dir_path, orderTypeBox.val(), createView);
				} else {
					reloadPage(result.current_dir_path, orderTypeBox.val(), createList);
				}
			}
			viewTypeBox.change(changeFunc);
			orderTypeBox.change(changeFunc);
			bodyDiv.html('');
		}
		function createList(result) {
			createCommon(result, createList);
			var table = document.createElement('table');
			table.className = 'ke-table';
			table.cellPadding = 0;
			table.cellSpacing = 0;
			table.border = 0;
			bodyDiv.append(table);
			var fileList = result.file_list;
			for (var i = 0, len = fileList.length; i < len; i++) {
				var data = fileList[i], row = K(table.insertRow(i));
				row.mouseover(function(e) {
					K(this).addClass('ke-on');
				})
					.mouseout(function(e) {
						K(this).removeClass('ke-on');
					});
				var iconUrl = imgPath + (data.is_dir ? 'folder-16.gif' : 'file-16.gif'),
					img = K('<img src="' + iconUrl + '" width="16" height="16" alt="' + data.filename + '" align="absmiddle" />'),
					cell0 = K(row[0].insertCell(0)).addClass('ke-cell ke-name').append(img).append(document.createTextNode(' ' + data.filename));
				if (!data.is_dir || data.has_file) {
					row.css('cursor', 'pointer');
					cell0.attr('title', data.filename);
					bindEvent(cell0, result, data, createList);
				} else {
					cell0.attr('title', lang.emptyFolder);
				}
				K(row[0].insertCell(1)).addClass('ke-cell ke-size').html(data.is_dir ? '-' : Math.ceil(data.filesize / 1024) + 'KB');
				K(row[0].insertCell(2)).addClass('ke-cell ke-datetime').html(data.datetime);
			}
		}
		function createView(result) {
			createCommon(result, createView);
			var fileList = result.file_list;
			for (var i = 0, len = fileList.length; i < len; i++) {
				var data = fileList[i],
					div = K('<div class="ke-inline-block ke-item"></div>');
				bodyDiv.append(div);
				var photoDiv = K('<div class="ke-inline-block ke-photo"></div>')
					.mouseover(function(e) {
						K(this).addClass('ke-on');
					})
					.mouseout(function(e) {
						K(this).removeClass('ke-on');
					});
				div.append(photoDiv);
				var fileUrl = result.current_url + data.filename,
					iconUrl = data.is_dir ? imgPath + 'folder-64.gif' : (data.is_photo ? fileUrl : imgPath + 'file-64.gif');
				var img = K('<img src="' + iconUrl + '" width="80" height="80" alt="' + data.filename + '" />');
				if (!data.is_dir || data.has_file) {
					photoDiv.css('cursor', 'pointer');
					bindTitle(photoDiv, data);
					bindEvent(photoDiv, result, data, createView);
				} else {
					photoDiv.attr('title', lang.emptyFolder);
				}
				photoDiv.append(img);
				div.append('<div class="ke-name" title="' + data.filename + '">' + data.filename + '</div>');
			}
		}
		viewTypeBox.val(viewType);
		reloadPage('', orderTypeBox.val(), viewType == 'VIEW' ? createView : createList);
		return dialog;
	}
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('image', function(K) {
	var self = this, name = 'image',
		allowImageUpload = K.undef(self.allowImageUpload, true),
		allowImageRemote = K.undef(self.allowImageRemote, true),
		formatUploadUrl = K.undef(self.formatUploadUrl, true),
		allowFileManager = K.undef(self.allowFileManager, false),
		uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php'),
		imageTabIndex = K.undef(self.imageTabIndex, 0),
		imgPath = self.pluginsPath + 'image/images/',
		extraParams = K.undef(self.extraFileUploadParams, {}),
		filePostName = K.undef(self.filePostName, 'file'),
		fillDescAfterUploadImage = K.undef(self.fillDescAfterUploadImage, false),
		lang = self.lang(name + '.');
	self.plugin.imageDialog = function(options) {
		var imageUrl = options.imageUrl,
			imageWidth = K.undef(options.imageWidth, ''),
			imageHeight = K.undef(options.imageHeight, ''),
			imageTitle = K.undef(options.imageTitle, ''),
			imageAlign = K.undef(options.imageAlign, ''),
			showRemote = K.undef(options.showRemote, true),
			showLocal = K.undef(options.showLocal, true),
			tabIndex = K.undef(options.tabIndex, 0),
			clickFn = options.clickFn;
		var target = 'kindeditor_upload_iframe_' + new Date().getTime();
		var hiddenElements = [];
		for(var k in extraParams){
			hiddenElements.push('<input type="hidden" name="' + k + '" value="' + extraParams[k] + '" />');
		}
		var html = [
			'<div style="padding:20px;">',
			'<div class="tabs"></div>',
			'<div class="tab1" style="display:none;">',
			'<div class="ke-dialog-row">',
			'<label for="remoteUrl" style="width:60px;">' + lang.remoteUrl + '</label>',
			'<input type="text" id="remoteUrl" class="ke-input-text" name="url" value="" style="width:200px;" /> &nbsp;',
			'<span class="ke-button-common ke-button-outer">',
			'<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
			'</span>',
			'</div>',
			'<div class="ke-dialog-row">',
			'<label for="remoteWidth" style="width:60px;">' + lang.size + '</label>',
			lang.width + ' <input type="text" id="remoteWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="4" /> ',
			lang.height + ' <input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" /> ',
			'<img class="ke-refresh-btn" src="' + imgPath + 'refresh.png" width="16" height="16" alt="" style="cursor:pointer;" title="' + lang.resetSize + '" />',
			'</div>',
			'<div class="ke-dialog-row">',
			'<label style="width:60px;">' + lang.align + '</label>',
			'<input type="radio" name="align" class="ke-inline-block" value="" checked="checked" /> <img name="defaultImg" src="' + imgPath + 'align_top.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" class="ke-inline-block" value="left" /> <img name="leftImg" src="' + imgPath + 'align_left.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" class="ke-inline-block" value="right" /> <img name="rightImg" src="' + imgPath + 'align_right.gif" width="23" height="25" alt="" />',
			'</div>',
			'<div class="ke-dialog-row">',
			'<label for="remoteTitle" style="width:60px;">' + lang.imgTitle + '</label>',
			'<input type="text" id="remoteTitle" class="ke-input-text" name="title" value="" style="width:200px;" />',
			'</div>',
			'</div>',
			'<div class="tab2" style="display:none;">',
			'<iframe name="' + target + '" style="display:none;"></iframe>',
			'<form class="ke-upload-area ke-form" method="post" enctype="multipart/form-data" target="' + target + '" action="' + K.addParam(uploadJson, 'dir=image') + '">',
			'<div class="ke-dialog-row">',
			hiddenElements.join(''),
			'<label style="width:60px;">' + lang.localUrl + '</label>',
			'<input type="text" name="localUrl" class="ke-input-text" tabindex="-1" style="width:200px;" readonly="true" /> &nbsp;',
			'<input type="button" class="ke-upload-button" value="' + lang.upload + '" />',
			'</div>',
			'</form>',
			'</div>',
			'</div>'
		].join('');
		var dialogWidth = showLocal || allowFileManager ? 450 : 400,
			dialogHeight = showLocal && showRemote ? 300 : 250;
		var dialog = self.createDialog({
				name : name,
				width : dialogWidth,
				height : dialogHeight,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						if (dialog.isLoading) {
							return;
						}
						if (showLocal && showRemote && tabs && tabs.selectedIndex === 1 || !showRemote) {
							if (uploadbutton.fileBox.val() == '') {
								alert(self.lang('pleaseSelectFile'));
								return;
							}
							dialog.showLoading(self.lang('uploadLoading'));
							uploadbutton.submit();
							localUrlBox.val('');
							return;
						}
						var url = K.trim(urlBox.val()),
							width = widthBox.val(),
							height = heightBox.val(),
							title = titleBox.val(),
							align = '';
						alignBox.each(function() {
							if (this.checked) {
								align = this.value;
								return false;
							}
						});
						if (url == 'http://' || K.invalidUrl(url)) {
							alert(self.lang('invalidUrl'));
							urlBox[0].focus();
							return;
						}
						if (!/^\d*$/.test(width)) {
							alert(self.lang('invalidWidth'));
							widthBox[0].focus();
							return;
						}
						if (!/^\d*$/.test(height)) {
							alert(self.lang('invalidHeight'));
							heightBox[0].focus();
							return;
						}
						clickFn.call(self, url, title, width, height, 0, align);
					}
				},
				beforeRemove : function() {
					viewServerBtn.unbind();
					widthBox.unbind();
					heightBox.unbind();
					refreshBtn.unbind();
				}
			}),
			div = dialog.div;
		var urlBox = K('[name="url"]', div),
			localUrlBox = K('[name="localUrl"]', div),
			viewServerBtn = K('[name="viewServer"]', div),
			widthBox = K('.tab1 [name="width"]', div),
			heightBox = K('.tab1 [name="height"]', div),
			refreshBtn = K('.ke-refresh-btn', div),
			titleBox = K('.tab1 [name="title"]', div),
			alignBox = K('.tab1 [name="align"]', div);
		var tabs;
		if (showRemote && showLocal) {
			tabs = K.tabs({
				src : K('.tabs', div),
				afterSelect : function(i) {}
			});
			tabs.add({
				title : lang.remoteImage,
				panel : K('.tab1', div)
			});
			tabs.add({
				title : lang.localImage,
				panel : K('.tab2', div)
			});
			tabs.select(tabIndex);
		} else if (showRemote) {
			K('.tab1', div).show();
		} else if (showLocal) {
			K('.tab2', div).show();
		}
		var uploadbutton = K.uploadbutton({
			button : K('.ke-upload-button', div)[0],
			fieldName : filePostName,
			form : K('.ke-form', div),
			target : target,
			width: 60,
			afterUpload : function(data) {
				dialog.hideLoading();
				if (data.error === 0) {
					var url = data.url;
					if (formatUploadUrl) {
						url = K.formatUrl(url, 'absolute');
					}
					if (self.afterUpload) {
						self.afterUpload.call(self, url, data, name);
					}
					if (!fillDescAfterUploadImage) {
						clickFn.call(self, url, data.title, data.width, data.height, data.border, data.align);
					} else {
						K(".ke-dialog-row #remoteUrl", div).val(url);
						K(".ke-tabs-li", div)[0].click();
						K(".ke-refresh-btn", div).click();
					}
				} else {
					alert(data.message);
				}
			},
			afterError : function(html) {
				dialog.hideLoading();
				self.errorDialog(html);
			}
		});
		uploadbutton.fileBox.change(function(e) {
			localUrlBox.val(uploadbutton.fileBox.val());
		});
		if (allowFileManager) {
			viewServerBtn.click(function(e) {
				self.loadPlugin('filemanager', function() {
					self.plugin.filemanagerDialog({
						viewType : 'VIEW',
						dirName : 'image',
						clickFn : function(url, title) {
							if (self.dialogs.length > 1) {
								K('[name="url"]', div).val(url);
								if (self.afterSelectFile) {
									self.afterSelectFile.call(self, url);
								}
								self.hideDialog();
							}
						}
					});
				});
			});
		} else {
			viewServerBtn.hide();
		}
		var originalWidth = 0, originalHeight = 0;
		function setSize(width, height) {
			widthBox.val(width);
			heightBox.val(height);
			originalWidth = width;
			originalHeight = height;
		}
		refreshBtn.click(function(e) {
			var tempImg = K('<img src="' + urlBox.val() + '" />', document).css({
				position : 'absolute',
				visibility : 'hidden',
				top : 0,
				left : '-1000px'
			});
			tempImg.bind('load', function() {
				setSize(tempImg.width(), tempImg.height());
				tempImg.remove();
			});
			K(document.body).append(tempImg);
		});
		widthBox.change(function(e) {
			if (originalWidth > 0) {
				heightBox.val(Math.round(originalHeight / originalWidth * parseInt(this.value, 10)));
			}
		});
		heightBox.change(function(e) {
			if (originalHeight > 0) {
				widthBox.val(Math.round(originalWidth / originalHeight * parseInt(this.value, 10)));
			}
		});
		urlBox.val(options.imageUrl);
		setSize(options.imageWidth, options.imageHeight);
		titleBox.val(options.imageTitle);
		alignBox.each(function() {
			if (this.value === options.imageAlign) {
				this.checked = true;
				return false;
			}
		});
		if (showRemote && tabIndex === 0) {
			urlBox[0].focus();
			urlBox[0].select();
		}
		return dialog;
	};
	self.plugin.image = {
		edit : function() {
			var img = self.plugin.getSelectedImage();
			self.plugin.imageDialog({
				imageUrl : img ? img.attr('data-ke-src') : 'http://',
				imageWidth : img ? img.width() : '',
				imageHeight : img ? img.height() : '',
				imageTitle : img ? img.attr('title') : '',
				imageAlign : img ? img.attr('align') : '',
				showRemote : allowImageRemote,
				showLocal : allowImageUpload,
				tabIndex: img ? 0 : imageTabIndex,
				clickFn : function(url, title, width, height, border, align) {
					if (img) {
						img.attr('src', url);
						img.attr('data-ke-src', url);
						img.attr('width', width);
						img.attr('height', height);
						img.attr('title', title);
						img.attr('align', align);
						img.attr('alt', title);
					} else {
						self.exec('insertimage', url, title, width, height, border, align);
					}
					setTimeout(function() {
						self.hideDialog().focus();
					}, 0);
				}
			});
		},
		'delete' : function() {
			var target = self.plugin.getSelectedImage();
			if (target.parent().name == 'a') {
				target = target.parent();
			}
			target.remove();
			self.addBookmark();
		}
	};
	self.clickToolbar(name, self.plugin.image.edit);
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('insertfile', function(K) {
	var self = this, name = 'insertfile',
		allowFileUpload = K.undef(self.allowFileUpload, true),
		allowFileManager = K.undef(self.allowFileManager, false),
		formatUploadUrl = K.undef(self.formatUploadUrl, true),
		uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php'),
		extraParams = K.undef(self.extraFileUploadParams, {}),
		filePostName = K.undef(self.filePostName, 'imgFile'),
		lang = self.lang(name + '.');
	self.plugin.fileDialog = function(options) {
		var fileUrl = K.undef(options.fileUrl, 'http://'),
			fileTitle = K.undef(options.fileTitle, ''),
			clickFn = options.clickFn;
		var html = [
			'<div style="padding:20px;">',
			'<div class="ke-dialog-row">',
			'<label for="keUrl" style="width:60px;">' + lang.url + '</label>',
			'<input type="text" id="keUrl" name="url" class="ke-input-text" style="width:160px;" /> &nbsp;',
			'<input type="button" class="ke-upload-button" value="' + lang.upload + '" /> &nbsp;',
			'<span class="ke-button-common ke-button-outer">',
			'<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
			'</span>',
			'</div>',
			'<div class="ke-dialog-row">',
			'<label for="keTitle" style="width:60px;">' + lang.title + '</label>',
			'<input type="text" id="keTitle" class="ke-input-text" name="title" value="" style="width:160px;" /></div>',
			'</div>',
			'</form>',
			'</div>'
		].join('');
		var dialog = self.createDialog({
				name : name,
				width : 450,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var url = K.trim(urlBox.val()),
							title = titleBox.val();
						if (url == 'http://' || K.invalidUrl(url)) {
							alert(self.lang('invalidUrl'));
							urlBox[0].focus();
							return;
						}
						if (K.trim(title) === '') {
							title = url;
						}
						clickFn.call(self, url, title);
					}
				}
			}),
			div = dialog.div;
		var urlBox = K('[name="url"]', div),
			viewServerBtn = K('[name="viewServer"]', div),
			titleBox = K('[name="title"]', div);
		if (allowFileUpload) {
			var uploadbutton = K.uploadbutton({
				button : K('.ke-upload-button', div)[0],
				fieldName : filePostName,
				url : K.addParam(uploadJson, 'dir=file'),
				extraParams : extraParams,
				afterUpload : function(data) {
					dialog.hideLoading();
					if (data.error === 0) {
						var url = data.url;
						if (formatUploadUrl) {
							url = K.formatUrl(url, 'absolute');
						}
						urlBox.val(url);
						if (self.afterUpload) {
							self.afterUpload.call(self, url, data, name);
						}
						alert(self.lang('uploadSuccess'));
					} else {
						alert(data.message);
					}
				},
				afterError : function(html) {
					dialog.hideLoading();
					self.errorDialog(html);
				}
			});
			uploadbutton.fileBox.change(function(e) {
				dialog.showLoading(self.lang('uploadLoading'));
				uploadbutton.submit();
			});
		} else {
			K('.ke-upload-button', div).hide();
		}
		if (allowFileManager) {
			viewServerBtn.click(function(e) {
				self.loadPlugin('filemanager', function() {
					self.plugin.filemanagerDialog({
						viewType : 'LIST',
						dirName : 'file',
						clickFn : function(url, title) {
							if (self.dialogs.length > 1) {
								K('[name="url"]', div).val(url);
								if (self.afterSelectFile) {
									self.afterSelectFile.call(self, url);
								}
								self.hideDialog();
							}
						}
					});
				});
			});
		} else {
			viewServerBtn.hide();
		}
		urlBox.val(fileUrl);
		titleBox.val(fileTitle);
		urlBox[0].focus();
		urlBox[0].select();
	};
	self.clickToolbar(name, function() {
		self.plugin.fileDialog({
			clickFn : function(url, title) {
				var html = '<a class="ke-insertfile" href="' + url + '" data-ke-src="' + url + '" target="_blank">' + title + '</a>';
				self.insertHtml(html).hideDialog().focus();
			}
		});
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('lineheight', function(K) {
	var self = this, name = 'lineheight', lang = self.lang(name + '.');
	self.clickToolbar(name, function() {
		var curVal = '', commonNode = self.cmd.commonNode({'*' : '.line-height'});
		if (commonNode) {
			curVal = commonNode.css('line-height');
		}
		var menu = self.createMenu({
			name : name,
			width : 150
		});
		K.each(lang.lineHeight, function(i, row) {
			K.each(row, function(key, val) {
				menu.addItem({
					title : val,
					checked : curVal === key,
					click : function() {
						self.cmd.toggle('<span style="line-height:' + key + ';"></span>', {
							span : '.line-height=' + key
						});
						self.updateState();
						self.addBookmark();
						self.hideMenu();
					}
				});
			});
		});
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('link', function(K) {
	var self = this, name = 'link';
	self.plugin.link = {
		edit : function() {
			var lang = self.lang(name + '.'),
				html = '<div style="padding:20px;">' +
					'<div class="ke-dialog-row">' +
					'<label for="keUrl" style="width:60px;">' + lang.url + '</label>' +
					'<input class="ke-input-text" type="text" id="keUrl" name="url" value="" style="width:260px;" /></div>' +
					'<div class="ke-dialog-row"">' +
					'<label for="keType" style="width:60px;">' + lang.linkType + '</label>' +
					'<select id="keType" name="type"></select>' +
					'</div>' +
					'</div>',
				dialog = self.createDialog({
					name : name,
					width : 450,
					title : self.lang(name),
					body : html,
					yesBtn : {
						name : self.lang('yes'),
						click : function(e) {
							var url = K.trim(urlBox.val());
							if (url == 'http://' || K.invalidUrl(url)) {
								alert(self.lang('invalidUrl'));
								urlBox[0].focus();
								return;
							}
							self.exec('createlink', url, typeBox.val()).hideDialog().focus();
						}
					}
				}),
				div = dialog.div,
				urlBox = K('input[name="url"]', div),
				typeBox = K('select[name="type"]', div);
			urlBox.val('http://');
			typeBox[0].options[0] = new Option(lang.newWindow, '_blank');
			typeBox[0].options[1] = new Option(lang.selfWindow, '');
			self.cmd.selection();
			var a = self.plugin.getSelectedLink();
			if (a) {
				self.cmd.range.selectNode(a[0]);
				self.cmd.select();
				urlBox.val(a.attr('data-ke-src'));
				typeBox.val(a.attr('target'));
			}
			urlBox[0].focus();
			urlBox[0].select();
		},
		'delete' : function() {
			self.exec('unlink', null);
		}
	};
	self.clickToolbar(name, self.plugin.link.edit);
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('pagebreak', function(K) {
	var self = this;
	var name = 'pagebreak';
	var pagebreakHtml = K.undef(self.pagebreakHtml, '<hr style="page-break-after: always;" class="ke-pagebreak" />');
	self.clickToolbar(name, function() {
		var cmd = self.cmd, range = cmd.range;
		self.focus();
		var tail = self.newlineTag == 'br' || K.WEBKIT ? '' : '<span id="__kindeditor_tail_tag__"></span>';
		self.insertHtml(pagebreakHtml + tail);
		if (tail !== '') {
			var p = K('#__kindeditor_tail_tag__', self.edit.doc);
			range.selectNodeContents(p[0]);
			p.removeAttr('id');
			cmd.select();
		}
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('plainpaste', function(K) {
	var self = this, name = 'plainpaste';
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = '<div style="padding:10px 20px;">' +
				'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
				'<textarea class="ke-textarea" style="width:408px;height:260px;"></textarea>' +
				'</div>',
			dialog = self.createDialog({
				name : name,
				width : 450,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var html = textarea.val();
						html = K.escape(html);
						html = html.replace(/ {2}/g, ' &nbsp;');
						if (self.newlineTag == 'p') {
							html = html.replace(/^/, '<p>').replace(/$/, '</p>').replace(/\n/g, '</p><p>');
						} else {
							html = html.replace(/\n/g, '<br />$&');
						}
						self.insertHtml(html).hideDialog().focus();
					}
				}
			}),
			textarea = K('textarea', dialog.div);
		textarea[0].focus();
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('preview', function(K) {
	var self = this, name = 'preview', undefined;
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = '<div style="padding:10px 20px;">' +
				'<iframe class="ke-textarea" frameborder="0" style="width:708px;height:400px;"></iframe>' +
				'</div>',
			dialog = self.createDialog({
				name : name,
				width : 750,
				title : self.lang(name),
				body : html
			}),
			iframe = K('iframe', dialog.div),
			doc = K.iframeDoc(iframe);
		doc.open();
		doc.write(self.fullHtml());
		doc.close();
		K(doc.body).css('background-color', '#FFF');
		iframe[0].contentWindow.focus();
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('quickformat', function(K) {
	var self = this, name = 'quickformat',
		blockMap = K.toMap('blockquote,center,div,h1,h2,h3,h4,h5,h6,p');
	function getFirstChild(knode) {
		var child = knode.first();
		while (child && child.first()) {
			child = child.first();
		}
		return child;
	}
	self.clickToolbar(name, function() {
		self.focus();
		var doc = self.edit.doc,
			range = self.cmd.range,
			child = K(doc.body).first(), next,
			nodeList = [], subList = [],
			bookmark = range.createBookmark(true);
		while(child) {
			next = child.next();
			var firstChild = getFirstChild(child);
			if (!firstChild || firstChild.name != 'img') {
				if (blockMap[child.name]) {
					child.html(child.html().replace(/^(\s|&nbsp;|　)+/ig, ''));
					child.css('text-indent', '2em');
				} else {
					subList.push(child);
				}
				if (!next || (blockMap[next.name] || blockMap[child.name] && !blockMap[next.name])) {
					if (subList.length > 0) {
						nodeList.push(subList);
					}
					subList = [];
				}
			}
			child = next;
		}
		K.each(nodeList, function(i, subList) {
			var wrapper = K('<p style="text-indent:2em;"></p>', doc);
			subList[0].before(wrapper);
			K.each(subList, function(i, knode) {
				wrapper.append(knode);
			});
		});
		range.moveToBookmark(bookmark);
		self.addBookmark();
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('table', function(K) {
	var self = this, name = 'table', lang = self.lang(name + '.'), zeroborder = 'ke-zeroborder';
	function _setColor(box, color) {
		color = color.toUpperCase();
		box.css('background-color', color);
		box.css('color', color === '#000000' ? '#FFFFFF' : '#000000');
		box.html(color);
	}
	var pickerList = [];
	function _initColorPicker(dialogDiv, colorBox) {
		colorBox.bind('click,mousedown', function(e){
			e.stopPropagation();
		});
		function removePicker() {
			K.each(pickerList, function() {
				this.remove();
			});
			pickerList = [];
			K(document).unbind('click,mousedown', removePicker);
			dialogDiv.unbind('click,mousedown', removePicker);
		}
		colorBox.click(function(e) {
			removePicker();
			var box = K(this),
				pos = box.pos();
			var picker = K.colorpicker({
				x : pos.x,
				y : pos.y + box.height(),
				z : 811214,
				selectedColor : K(this).html(),
				colors : self.colorTable,
				noColor : self.lang('noColor'),
				shadowMode : self.shadowMode,
				click : function(color) {
					_setColor(box, color);
					removePicker();
				}
			});
			pickerList.push(picker);
			K(document).bind('click,mousedown', removePicker);
			dialogDiv.bind('click,mousedown', removePicker);
		});
	}
	function _getCellIndex(table, row, cell) {
		var rowSpanCount = 0;
		for (var i = 0, len = row.cells.length; i < len; i++) {
			if (row.cells[i] == cell) {
				break;
			}
			rowSpanCount += row.cells[i].rowSpan - 1;
		}
		return cell.cellIndex - rowSpanCount;
	}
	self.plugin.table = {
		prop : function(isInsert) {
			var html = [
				'<div style="padding:20px;">',
				'<div class="ke-dialog-row">',
				'<label for="keRows" style="width:90px;">' + lang.cells + '</label>',
				lang.rows + ' <input type="text" id="keRows" class="ke-input-text ke-input-number" name="rows" value="" maxlength="4" /> &nbsp; ',
				lang.cols + ' <input type="text" class="ke-input-text ke-input-number" name="cols" value="" maxlength="4" />',
				'</div>',
				'<div class="ke-dialog-row">',
				'<label for="keWidth" style="width:90px;">' + lang.size + '</label>',
				lang.width + ' <input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="4" /> &nbsp; ',
				'<select name="widthType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select> &nbsp; ',
				lang.height + ' <input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" /> &nbsp; ',
				'<select name="heightType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select>',
				'</div>',
				'<div class="ke-dialog-row">',
				'<label for="kePadding" style="width:90px;">' + lang.space + '</label>',
				lang.padding + ' <input type="text" id="kePadding" class="ke-input-text ke-input-number" name="padding" value="" maxlength="4" /> &nbsp; ',
				lang.spacing + ' <input type="text" class="ke-input-text ke-input-number" name="spacing" value="" maxlength="4" />',
				'</div>',
				'<div class="ke-dialog-row">',
				'<label for="keAlign" style="width:90px;">' + lang.align + '</label>',
				'<select id="keAlign" name="align">',
				'<option value="">' + lang.alignDefault + '</option>',
				'<option value="left">' + lang.alignLeft + '</option>',
				'<option value="center">' + lang.alignCenter + '</option>',
				'<option value="right">' + lang.alignRight + '</option>',
				'</select>',
				'</div>',
				'<div class="ke-dialog-row">',
				'<label for="keBorder" style="width:90px;">' + lang.border + '</label>',
				lang.borderWidth + ' <input type="text" id="keBorder" class="ke-input-text ke-input-number" name="border" value="" maxlength="4" /> &nbsp; ',
				lang.borderColor + ' <span class="ke-inline-block ke-input-color"></span>',
				'</div>',
				'<div class="ke-dialog-row">',
				'<label for="keBgColor" style="width:90px;">' + lang.backgroundColor + '</label>',
				'<span class="ke-inline-block ke-input-color"></span>',
				'</div>',
				'</div>'
			].join('');
			var bookmark = self.cmd.range.createBookmark();
			var dialog = self.createDialog({
					name : name,
					width : 500,
					title : self.lang(name),
					body : html,
					beforeRemove : function() {
						colorBox.unbind();
					},
					yesBtn : {
						name : self.lang('yes'),
						click : function(e) {
							var rows = rowsBox.val(),
								cols = colsBox.val(),
								width = widthBox.val(),
								height = heightBox.val(),
								widthType = widthTypeBox.val(),
								heightType = heightTypeBox.val(),
								padding = paddingBox.val(),
								spacing = spacingBox.val(),
								align = alignBox.val(),
								border = borderBox.val(),
								borderColor = K(colorBox[0]).html() || '',
								bgColor = K(colorBox[1]).html() || '';
							if (rows == 0 || !/^\d+$/.test(rows)) {
								alert(self.lang('invalidRows'));
								rowsBox[0].focus();
								return;
							}
							if (cols == 0 || !/^\d+$/.test(cols)) {
								alert(self.lang('invalidRows'));
								colsBox[0].focus();
								return;
							}
							if (!/^\d*$/.test(width)) {
								alert(self.lang('invalidWidth'));
								widthBox[0].focus();
								return;
							}
							if (!/^\d*$/.test(height)) {
								alert(self.lang('invalidHeight'));
								heightBox[0].focus();
								return;
							}
							if (!/^\d*$/.test(padding)) {
								alert(self.lang('invalidPadding'));
								paddingBox[0].focus();
								return;
							}
							if (!/^\d*$/.test(spacing)) {
								alert(self.lang('invalidSpacing'));
								spacingBox[0].focus();
								return;
							}
							if (!/^\d*$/.test(border)) {
								alert(self.lang('invalidBorder'));
								borderBox[0].focus();
								return;
							}
							if (table) {
								if (width !== '') {
									table.width(width + widthType);
								} else {
									table.css('width', '');
								}
								if (table[0].width !== undefined) {
									table.removeAttr('width');
								}
								if (height !== '') {
									table.height(height + heightType);
								} else {
									table.css('height', '');
								}
								if (table[0].height !== undefined) {
									table.removeAttr('height');
								}
								table.css('background-color', bgColor);
								if (table[0].bgColor !== undefined) {
									table.removeAttr('bgColor');
								}
								if (padding !== '') {
									table[0].cellPadding = padding;
								} else {
									table.removeAttr('cellPadding');
								}
								if (spacing !== '') {
									table[0].cellSpacing = spacing;
								} else {
									table.removeAttr('cellSpacing');
								}
								if (align !== '') {
									table[0].align = align;
								} else {
									table.removeAttr('align');
								}
								if (border !== '') {
									table.attr('border', border);
								} else {
									table.removeAttr('border');
								}
								if (border === '' || border === '0') {
									table.addClass(zeroborder);
								} else {
									table.removeClass(zeroborder);
								}
								if (borderColor !== '') {
									table.attr('borderColor', borderColor);
								} else {
									table.removeAttr('borderColor');
								}
								self.hideDialog().focus();
								self.cmd.range.moveToBookmark(bookmark);
								self.cmd.select();
								self.addBookmark();
								return;
							}
							var style = '';
							if (width !== '') {
								style += 'width:' + width + widthType + ';';
							}
							if (height !== '') {
								style += 'height:' + height + heightType + ';';
							}
							if (bgColor !== '') {
								style += 'background-color:' + bgColor + ';';
							}
							var html = '<table';
							if (style !== '') {
								html += ' style="' + style + '"';
							}
							if (padding !== '') {
								html += ' cellpadding="' + padding + '"';
							}
							if (spacing !== '') {
								html += ' cellspacing="' + spacing + '"';
							}
							if (align !== '') {
								html += ' align="' + align + '"';
							}
							if (border !== '') {
								html += ' border="' + border + '"';
							}
							if (border === '' || border === '0') {
								html += ' class="' + zeroborder + '"';
							}
							if (borderColor !== '') {
								html += ' bordercolor="' + borderColor + '"';
							}
							html += '>';
							for (var i = 0; i < rows; i++) {
								html += '<tr>';
								for (var j = 0; j < cols; j++) {
									html += '<td>' + (K.IE ? '&nbsp;' : '<br />') + '</td>';
								}
								html += '</tr>';
							}
							html += '</table>';
							if (!K.IE) {
								html += '<br />';
							}
							self.insertHtml(html);
							self.select().hideDialog().focus();
							self.addBookmark();
						}
					}
				}),
				div = dialog.div,
				rowsBox = K('[name="rows"]', div).val(3),
				colsBox = K('[name="cols"]', div).val(2),
				widthBox = K('[name="width"]', div).val(100),
				heightBox = K('[name="height"]', div),
				widthTypeBox = K('[name="widthType"]', div),
				heightTypeBox = K('[name="heightType"]', div),
				paddingBox = K('[name="padding"]', div).val(2),
				spacingBox = K('[name="spacing"]', div).val(0),
				alignBox = K('[name="align"]', div),
				borderBox = K('[name="border"]', div).val(1),
				colorBox = K('.ke-input-color', div);
			_initColorPicker(div, colorBox.eq(0));
			_initColorPicker(div, colorBox.eq(1));
			_setColor(colorBox.eq(0), '#000000');
			_setColor(colorBox.eq(1), '');
			rowsBox[0].focus();
			rowsBox[0].select();
			var table;
			if (isInsert) {
				return;
			}
			table = self.plugin.getSelectedTable();
			if (table) {
				rowsBox.val(table[0].rows.length);
				colsBox.val(table[0].rows.length > 0 ? table[0].rows[0].cells.length : 0);
				rowsBox.attr('disabled', true);
				colsBox.attr('disabled', true);
				var match,
					tableWidth = table[0].style.width || table[0].width,
					tableHeight = table[0].style.height || table[0].height;
				if (tableWidth !== undefined && (match = /^(\d+)((?:px|%)*)$/.exec(tableWidth))) {
					widthBox.val(match[1]);
					widthTypeBox.val(match[2]);
				} else {
					widthBox.val('');
				}
				if (tableHeight !== undefined && (match = /^(\d+)((?:px|%)*)$/.exec(tableHeight))) {
					heightBox.val(match[1]);
					heightTypeBox.val(match[2]);
				}
				paddingBox.val(table[0].cellPadding || '');
				spacingBox.val(table[0].cellSpacing || '');
				alignBox.val(table[0].align || '');
				borderBox.val(table[0].border === undefined ? '' : table[0].border);
				_setColor(colorBox.eq(0), K.toHex(table.attr('borderColor') || ''));
				_setColor(colorBox.eq(1), K.toHex(table[0].style.backgroundColor || table[0].bgColor || ''));
				widthBox[0].focus();
				widthBox[0].select();
			}
		},
		cellprop : function() {
			var html = [
				'<div style="padding:20px;">',
				'<div class="ke-dialog-row">',
				'<label for="keWidth" style="width:90px;">' + lang.size + '</label>',
				lang.width + ' <input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="4" /> &nbsp; ',
				'<select name="widthType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select> &nbsp; ',
				lang.height + ' <input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" /> &nbsp; ',
				'<select name="heightType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select>',
				'</div>',
				'<div class="ke-dialog-row">',
				'<label for="keAlign" style="width:90px;">' + lang.align + '</label>',
				lang.textAlign + ' <select id="keAlign" name="textAlign">',
				'<option value="">' + lang.alignDefault + '</option>',
				'<option value="left">' + lang.alignLeft + '</option>',
				'<option value="center">' + lang.alignCenter + '</option>',
				'<option value="right">' + lang.alignRight + '</option>',
				'</select> ',
				lang.verticalAlign + ' <select name="verticalAlign">',
				'<option value="">' + lang.alignDefault + '</option>',
				'<option value="top">' + lang.alignTop + '</option>',
				'<option value="middle">' + lang.alignMiddle + '</option>',
				'<option value="bottom">' + lang.alignBottom + '</option>',
				'<option value="baseline">' + lang.alignBaseline + '</option>',
				'</select>',
				'</div>',
				'<div class="ke-dialog-row">',
				'<label for="keBorder" style="width:90px;">' + lang.border + '</label>',
				lang.borderWidth + ' <input type="text" id="keBorder" class="ke-input-text ke-input-number" name="border" value="" maxlength="4" /> &nbsp; ',
				lang.borderColor + ' <span class="ke-inline-block ke-input-color"></span>',
				'</div>',
				'<div class="ke-dialog-row">',
				'<label for="keBgColor" style="width:90px;">' + lang.backgroundColor + '</label>',
				'<span class="ke-inline-block ke-input-color"></span>',
				'</div>',
				'</div>'
			].join('');
			var bookmark = self.cmd.range.createBookmark();
			var dialog = self.createDialog({
					name : name,
					width : 500,
					title : self.lang('tablecell'),
					body : html,
					beforeRemove : function() {
						colorBox.unbind();
					},
					yesBtn : {
						name : self.lang('yes'),
						click : function(e) {
							var width = widthBox.val(),
								height = heightBox.val(),
								widthType = widthTypeBox.val(),
								heightType = heightTypeBox.val(),
								padding = paddingBox.val(),
								spacing = spacingBox.val(),
								textAlign = textAlignBox.val(),
								verticalAlign = verticalAlignBox.val(),
								border = borderBox.val(),
								borderColor = K(colorBox[0]).html() || '',
								bgColor = K(colorBox[1]).html() || '';
							if (!/^\d*$/.test(width)) {
								alert(self.lang('invalidWidth'));
								widthBox[0].focus();
								return;
							}
							if (!/^\d*$/.test(height)) {
								alert(self.lang('invalidHeight'));
								heightBox[0].focus();
								return;
							}
							if (!/^\d*$/.test(border)) {
								alert(self.lang('invalidBorder'));
								borderBox[0].focus();
								return;
							}
							cell.css({
								width : width !== '' ? (width + widthType) : '',
								height : height !== '' ? (height + heightType) : '',
								'background-color' : bgColor,
								'text-align' : textAlign,
								'vertical-align' : verticalAlign,
								'border-width' : border,
								'border-style' : border !== '' ? 'solid' : '',
								'border-color' : borderColor
							});
							self.hideDialog().focus();
							self.cmd.range.moveToBookmark(bookmark);
							self.cmd.select();
							self.addBookmark();
						}
					}
				}),
				div = dialog.div,
				widthBox = K('[name="width"]', div).val(100),
				heightBox = K('[name="height"]', div),
				widthTypeBox = K('[name="widthType"]', div),
				heightTypeBox = K('[name="heightType"]', div),
				paddingBox = K('[name="padding"]', div).val(2),
				spacingBox = K('[name="spacing"]', div).val(0),
				textAlignBox = K('[name="textAlign"]', div),
				verticalAlignBox = K('[name="verticalAlign"]', div),
				borderBox = K('[name="border"]', div).val(1),
				colorBox = K('.ke-input-color', div);
			_initColorPicker(div, colorBox.eq(0));
			_initColorPicker(div, colorBox.eq(1));
			_setColor(colorBox.eq(0), '#000000');
			_setColor(colorBox.eq(1), '');
			widthBox[0].focus();
			widthBox[0].select();
			var cell = self.plugin.getSelectedCell();
			var match,
				cellWidth = cell[0].style.width || cell[0].width || '',
				cellHeight = cell[0].style.height || cell[0].height || '';
			if ((match = /^(\d+)((?:px|%)*)$/.exec(cellWidth))) {
				widthBox.val(match[1]);
				widthTypeBox.val(match[2]);
			} else {
				widthBox.val('');
			}
			if ((match = /^(\d+)((?:px|%)*)$/.exec(cellHeight))) {
				heightBox.val(match[1]);
				heightTypeBox.val(match[2]);
			}
			textAlignBox.val(cell[0].style.textAlign || '');
			verticalAlignBox.val(cell[0].style.verticalAlign || '');
			var border = cell[0].style.borderWidth || '';
			if (border) {
				border = parseInt(border);
			}
			borderBox.val(border);
			_setColor(colorBox.eq(0), K.toHex(cell[0].style.borderColor || ''));
			_setColor(colorBox.eq(1), K.toHex(cell[0].style.backgroundColor || ''));
			widthBox[0].focus();
			widthBox[0].select();
		},
		insert : function() {
			this.prop(true);
		},
		'delete' : function() {
			var table = self.plugin.getSelectedTable();
			self.cmd.range.setStartBefore(table[0]).collapse(true);
			self.cmd.select();
			table.remove();
			self.addBookmark();
		},
		colinsert : function(offset) {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				index = cell.cellIndex + offset;
			index += table.rows[0].cells.length - row.cells.length;
			for (var i = 0, len = table.rows.length; i < len; i++) {
				var newRow = table.rows[i],
					newCell = newRow.insertCell(index);
				newCell.innerHTML = K.IE ? '' : '<br />';
				index = _getCellIndex(table, newRow, newCell);
			}
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		colinsertleft : function() {
			this.colinsert(0);
		},
		colinsertright : function() {
			this.colinsert(1);
		},
		rowinsert : function(offset) {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0];
			var rowIndex = row.rowIndex;
			if (offset === 1) {
				rowIndex = row.rowIndex + (cell.rowSpan - 1) + offset;
			}
			var newRow = table.insertRow(rowIndex);
			for (var i = 0, len = row.cells.length; i < len; i++) {
				if (row.cells[i].rowSpan > 1) {
					len -= row.cells[i].rowSpan - 1;
				}
				var newCell = newRow.insertCell(i);
				if (offset === 1 && row.cells[i].colSpan > 1) {
					newCell.colSpan = row.cells[i].colSpan;
				}
				newCell.innerHTML = K.IE ? '' : '<br />';
			}
			for (var j = rowIndex; j >= 0; j--) {
				var cells = table.rows[j].cells;
				if (cells.length > i) {
					for (var k = cell.cellIndex; k >= 0; k--) {
						if (cells[k].rowSpan > 1) {
							cells[k].rowSpan += 1;
						}
					}
					break;
				}
			}
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		rowinsertabove : function() {
			this.rowinsert(0);
		},
		rowinsertbelow : function() {
			this.rowinsert(1);
		},
		rowmerge : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				rowIndex = row.rowIndex,
				nextRowIndex = rowIndex + cell.rowSpan,
				nextRow = table.rows[nextRowIndex];
			if (table.rows.length <= nextRowIndex) {
				return;
			}
			var cellIndex = cell.cellIndex;
			if (nextRow.cells.length <= cellIndex) {
				return;
			}
			var nextCell = nextRow.cells[cellIndex];
			if (cell.colSpan !== nextCell.colSpan) {
				return;
			}
			cell.rowSpan += nextCell.rowSpan;
			nextRow.deleteCell(cellIndex);
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		colmerge : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				rowIndex = row.rowIndex,
				cellIndex = cell.cellIndex,
				nextCellIndex = cellIndex + 1;
			if (row.cells.length <= nextCellIndex) {
				return;
			}
			var nextCell = row.cells[nextCellIndex];
			if (cell.rowSpan !== nextCell.rowSpan) {
				return;
			}
			cell.colSpan += nextCell.colSpan;
			row.deleteCell(nextCellIndex);
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		rowsplit : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				rowIndex = row.rowIndex;
			if (cell.rowSpan === 1) {
				return;
			}
			var cellIndex = _getCellIndex(table, row, cell);
			for (var i = 1, len = cell.rowSpan; i < len; i++) {
				var newRow = table.rows[rowIndex + i],
					newCell = newRow.insertCell(cellIndex);
				if (cell.colSpan > 1) {
					newCell.colSpan = cell.colSpan;
				}
				newCell.innerHTML = K.IE ? '' : '<br />';
				cellIndex = _getCellIndex(table, newRow, newCell);
			}
			K(cell).removeAttr('rowSpan');
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		colsplit : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				cellIndex = cell.cellIndex;
			if (cell.colSpan === 1) {
				return;
			}
			for (var i = 1, len = cell.colSpan; i < len; i++) {
				var newCell = row.insertCell(cellIndex + i);
				if (cell.rowSpan > 1) {
					newCell.rowSpan = cell.rowSpan;
				}
				newCell.innerHTML = K.IE ? '' : '<br />';
			}
			K(cell).removeAttr('colSpan');
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		coldelete : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				index = cell.cellIndex;
			for (var i = 0, len = table.rows.length; i < len; i++) {
				var newRow = table.rows[i],
					newCell = newRow.cells[index];
				if (newCell.colSpan > 1) {
					newCell.colSpan -= 1;
					if (newCell.colSpan === 1) {
						K(newCell).removeAttr('colSpan');
					}
				} else {
					newRow.deleteCell(index);
				}
				if (newCell.rowSpan > 1) {
					i += newCell.rowSpan - 1;
				}
			}
			if (row.cells.length === 0) {
				self.cmd.range.setStartBefore(table).collapse(true);
				self.cmd.select();
				K(table).remove();
			} else {
				self.cmd.selection(true);
			}
			self.addBookmark();
		},
		rowdelete : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				rowIndex = row.rowIndex;
			for (var i = cell.rowSpan - 1; i >= 0; i--) {
				table.deleteRow(rowIndex + i);
			}
			if (table.rows.length === 0) {
				self.cmd.range.setStartBefore(table).collapse(true);
				self.cmd.select();
				K(table).remove();
			} else {
				self.cmd.selection(true);
			}
			self.addBookmark();
		}
	};
	self.clickToolbar(name, self.plugin.table.prop);
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('template', function(K) {
	var self = this, name = 'template', lang = self.lang(name + '.'),
		htmlPath = self.pluginsPath + name + '/html/';
	function getFilePath(fileName) {
		return htmlPath + fileName + '?ver=' + encodeURIComponent(K.DEBUG ? K.TIME : K.VERSION);
	}
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			arr = ['<div style="padding:10px 20px;">',
				'<div class="ke-header">',
				'<div class="ke-left">',
				lang. selectTemplate + ' <select>'];
		K.each(lang.fileList, function(key, val) {
			arr.push('<option value="' + key + '">' + val + '</option>');
		});
		html = [arr.join(''),
			'</select></div>',
			'<div class="ke-right">',
			'<input type="checkbox" id="keReplaceFlag" name="replaceFlag" value="1" /> <label for="keReplaceFlag">' + lang.replaceContent + '</label>',
			'</div>',
			'<div class="ke-clearfix"></div>',
			'</div>',
			'<iframe class="ke-textarea" frameborder="0" style="width:458px;height:260px;background-color:#FFF;"></iframe>',
			'</div>'].join('');
		var dialog = self.createDialog({
			name : name,
			width : 500,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var doc = K.iframeDoc(iframe);
					self[checkbox[0].checked ? 'html' : 'insertHtml'](doc.body.innerHTML).hideDialog().focus();
				}
			}
		});
		var selectBox = K('select', dialog.div),
			checkbox = K('[name="replaceFlag"]', dialog.div),
			iframe = K('iframe', dialog.div);
		checkbox[0].checked = true;
		iframe.attr('src', getFilePath(selectBox.val()));
		selectBox.change(function() {
			iframe.attr('src', getFilePath(this.value));
		});
	});
});

/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
KindEditor.plugin('wordpaste', function(K) {
	var self = this, name = 'wordpaste';
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = '<div style="padding:10px 20px;">' +
				'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
				'<iframe class="ke-textarea" frameborder="0" style="width:408px;height:260px;"></iframe>' +
				'</div>',
			dialog = self.createDialog({
				name : name,
				width : 450,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var str = doc.body.innerHTML;
						str = K.clearMsWord(str, self.filterMode ? self.htmlTags : K.options.htmlTags);
						self.insertHtml(str).hideDialog().focus();
					}
				}
			}),
			div = dialog.div,
			iframe = K('iframe', div),
			doc = K.iframeDoc(iframe);
		if (!K.IE) {
			doc.designMode = 'on';
		}
		doc.open();
		doc.write('<!doctype html><html><head><title>WordPaste</title></head>');
		doc.write('<body style="background-color:#FFF;font-size:12px;margin:2px;">');
		if (!K.IE) {
			doc.write('<br />');
		}
		doc.write('</body></html>');
		doc.close();
		if (K.IE) {
			doc.body.contentEditable = 'true';
		}
		iframe[0].contentWindow.focus();
	});
});


KindEditor.plugin('fixtoolbar', function (K) {
	var self = this;
	if (!self.fixToolBar) {
		return;
	}
	function init() {
		var toolbar = K('.ke-toolbar');
		var originY = toolbar.pos().y;
		K(window).bind('scroll', function () {
			if (toolbar.css('position') == 'fixed') {
				if(document.body.scrollTop - originY < 0){
					toolbar.css('position', 'static');
					toolbar.css('top', 'auto');
				}
			} else {
				if (toolbar.pos().y - document.body.scrollTop < 0) {
					toolbar.css('position', 'fixed');
					toolbar.css('top', 0);
				}
			}
		});
	}
	if (self.isCreated) {
		init();
	} else {
		self.afterCreate(init);
	}
});
