var cache = {
	main: [],
	scene: {},
	action: {}
}
var loading = 0;

/*** util ****/
HTMLElement.prototype.appendNodes = function(nodes) {
	var fragment = document.createDocumentFragment();
	if(nodes.length) {
		for(var i = 0; i < nodes.length; i++) {
			fragment.appendChild(nodes[i].cloneNode(true));
		}
	} else {
		fragment.appendChild(nodes.cloneNode(true));
	}
	this.appendChild(fragment);
}
HTMLElement.prototype.parentNodes = function(cls) {
	var reg = new RegExp(cls);
	var node = this.parentNode;
	while(node) {
		if(reg.test(node.className)) {
			break;
		}
		node = node.parentNode;
	}
	return node;
}
function ajax(url, data, callback) {
	var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", url, true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send(data);
		callback = callback || function() {};
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			callback(JSON.parse(xmlhttp.responseText));
		}
	}
}
function getHtml(tpl, data) {
	var html = "";
	for (var i = 0; i < data.length; i++) {
		html += tplEngine(tpl, data[i]);
	}
	return html;
}
function tplEngine(tpl, data) {
	var re = /{#(\w+)?}/;
	while (match = re.exec(tpl)) {
		tpl = tpl.replace(match[0], data[match[1]]);
	}
	return tpl;
}
function genNode(html) {
	var div_tmp = document.createElement("div");
		div_tmp.innerHTML = html;
	var nodes = div_tmp.childNodes; 
	return nodes;
}
HTMLElement.prototype.addClass = function(cls) {
	var reg = new RegExp("\\s*" + cls);
	if(!reg.test(this.className)) {
		this.className += " " + cls;
	}
}
HTMLElement.prototype.removeClass = function(cls) {
	var reg = new RegExp("\\s*" + cls);
	if(reg.test(this.className)) {
		this.className = this.className.replace(reg, "");
	}
}
HTMLElement.prototype.toggleClass = function(cls) {
	var reg = new RegExp("\\s*" + cls);
	if(reg.test(this.className)) {
		this.className = this.className.replace(reg, "");
	} else {
		this.className += " " + cls;
	}
}
/*** util end ****/

var tree = {}

/* main */
var main = (function() {
	var I = {}
	var main_tpl = document.querySelector('#main-tpl').innerHTML;
	var add_main_tpl = document.querySelector('#add-main-tpl').innerHTML;

	I.get = function(no_cache) {
		if(!no_cache && cache.main.length > 0) {
			var data = cache.main;
			$page.innerHTML = '<div class="layer">' + getHtml(main_tpl, data) +  add_main_tpl + '</div>';
			return;
		}
		ajax("data/main.php", "opt=get", function(data) {
			if(data) {
				cache.main = data;
				$page.innerHTML = '<div class="layer">' + getHtml(main_tpl, data) +  add_main_tpl + '</div>';
			} else {
				$page.innerHTML = add_main_tpl;
			}
		});
	}
	I.add = function() {
		var cont = $add.value;
		if(cont.length > 100) {
			alert("超过100字了，精简一下吧");
			return;
		}
		var data = 'opt=add&cont=' + cont;
		ajax("data/main.php", data, function(data) {
			if(data == 1) {
				main.get(true);
				$add.value = "";
				$popup.style.display = "none";
			}else{
				alert("添加失败");
			}
		});
	}

	return I;
}());
/* main */
/* scene */
var scene = (function() {
	var I = {}
	var scene_tpl = document.querySelector('#scene-tpl').innerHTML;
	var add_scene_tpl = document.querySelector('#add-scene-tpl').innerHTML;
	var scene_exist_tpl = document.querySelector('#scene-exist-tpl').innerHTML;
	var $scene_exist = document.querySelector("#scene-exist");

	I.get = function(aid, mid, cur, callback) {
		if(aid != 0) {
			var post_data = "opt=aid&aid=" + aid;
		} else {
			var post_data = "opt=mid&mid=" + mid;
		}
		var add_data = [{'aid': aid, 'mid': mid}];
		cache.scene[post_data] = cache.scene[post_data] || [];
		if(cache.scene[post_data].length > 0) {
			var data = cache.scene[post_data];
			var $layer = document.querySelector('#l' + cur);
			if($layer) {
				$layer.removeClass("pass");
				$layer.innerHTML = getHtml(scene_tpl, data) + getHtml(add_scene_tpl, add_data);
				while($layer.nextSibling) {
					$page.removeChild($layer.nextSibling);
				}
			} else {
				$page.appendNodes(genNode('<div class="layer" id="l' + cur + '">' + getHtml(scene_tpl, data) + getHtml(add_scene_tpl, add_data) + '</div>'));
			}
			return;
		}
		clearTimeout(loading);
		loading = setTimeout(function() {
			$loading.style.display = "block";
		}, 600);
		ajax("data/scene.php", post_data, function(data) {
			clearTimeout(loading);
			$loading.style.display = "none";
			if(data) {
				clearStage();
				for (var i = data.length - 1; i >= 0; i--) {
					var pt = {
						"x": i * 50 + 50,
						"y": cur * 50 + 50
					}
					addPt(pt);
				}
				cache.scene[post_data] = data;
				var $layer = document.querySelector('#l' + cur);
				if($layer) {
					$layer.removeClass("pass");
					$layer.innerHTML = getHtml(scene_tpl, data) + getHtml(add_scene_tpl, add_data);
					while($layer.nextSibling) {
						$page.removeChild($layer.nextSibling);
					}
				} else {
					$page.appendNodes(genNode('<div class="layer" id="l' + cur + '">' + getHtml(scene_tpl, data) + getHtml(add_scene_tpl, add_data) + '</div>'));
				}
			} else {
				var $layer = document.querySelector('#l' + cur);
				if($layer) {
					$layer.removeClass("pass");
					$layer.innerHTML = getHtml(add_scene_tpl, add_data);
					while($layer.nextSibling) {
						$page.removeChild($layer.nextSibling);
					}
				} else {
					$page.appendNodes(genNode('<div class="layer" id="l' + cur + '">' + getHtml(add_scene_tpl, add_data) + '</div>'));
				}
			}
			callback = callback || function() {}
			callback();
		});
	}
	I.getExist = function(aid, mid, cur) {
		var post_data = "opt=exist&mid=" + mid;
		cache.scene[post_data] = cache.scene[post_data] || [];
		clearTimeout(loading);
		loading = setTimeout(function() {
			$loading.style.display = "block";
		}, 600);
		ajax("data/scene.php", post_data, function(data) {
			clearTimeout(loading);
			$loading.style.display = "none";
			var scene_html = "";
			if(data) {
				scene_html = getHtml(scene_exist_tpl, data);
				cache.scene[post_data] = data;
			}
			$scene_exist.dataset.aid = aid;
			$scene_exist.dataset.mid = mid;
			$scene_exist.dataset.cur = cur;
			$scene_exist.innerHTML = scene_html;
			$scene_exist.style.width = "100%";
		});
	}
	I.add = function(aid, mid, cur) {
		var cont = $add.value;
		if(cont.length > 50) {
			alert("超过50字了，精简一下吧");
			return;
		}
		var first = (aid == 0) ? 1 : 0;
		var post_data = 'opt=add&aid=' + aid + '&mid=' + mid + '&cont=' + cont + '&first=' + first;
		ajax("data/scene.php", post_data, function(data) {
			if(data == 1) {
				cache.scene["opt=aid&aid=" + aid] = [];
				cache.scene["opt=mid&mid=" + mid] = [];
				scene.get(aid, mid, cur, function() {
					$add.value = "";
					$popup.style.display = "none";
				});
			}else{
				alert("添加失败");
			}
		});
	}
	I.addLink = function(aid, sid, mid, cur) {
		var first = (aid == 0) ? 1 : 0;
		var post_data = 'opt=add_link&aid=' + aid + '&sid=' + sid + '&first=' + first;
		ajax("data/scene.php", post_data, function(data) {
			if(data == 1) {
				cache.scene["opt=aid&aid=" + aid] = [];
				cache.scene["opt=mid&mid=" + mid] = [];
				scene.get(aid, mid, cur, function() {
					$scene_exist.style.width = "0";
				});
			}else{
				alert("添加失败");
			}
		});
	}

	return I;
}());
/* scene */
/* action */
var action = (function() {
	var I = {}
	var action_tpl = document.querySelector('#action-tpl').innerHTML;
	var add_action_tpl = document.querySelector('#add-action-tpl').innerHTML;

	I.get = function(sid, t) {
		var add_data = [{'id': sid}];
		cache.action["s" + sid] = cache.action["s" + sid] || [];
		var $action = t;
		while($action) {
			if($action.className == "action") {
				break;
			}
			$action = $action.nextSibling;
		}
		if(cache.action["s" + sid] > 0) {
			var data = cache.action["s" + sid];
			$action.innerHTML = getHtml(action_tpl, data) + getHtml(add_action_tpl, add_data);
			return;
		}
		clearTimeout(loading);
		loading = setTimeout(function() {
			$loading.style.display = "block";
		}, 600);
		ajax("data/action.php", "opt=sid&id=" + sid, function(data) {
			clearTimeout(loading);
			if(data) {
				cache.action["s" + sid] = data;
				$action.innerHTML = getHtml(action_tpl, data) + getHtml(add_action_tpl, add_data);
			} else {
				$action.innerHTML = getHtml(add_action_tpl, add_data);
			}
		});
	}
	I.add = function(id, t) {
		var cont = $add.value;
		if(cont.length > 10) {
			alert("超过10字了，精简一下吧");
			return;
		}
		var data = 'opt=add&id=' + id + '&cont=' + cont;
		ajax("data/action.php", data, function(data) {
			if(data == 1) {
				action.get(id, t);
				$add.value = "";
				$popup.style.display = "none";
			}else{
				alert("添加失败");
			}
		});
	}

	return I;
}());
/* action */

/** dom control **/
function pageClick(e) {
	var t = e.target;
	var d = t.dataset;
	switch(t.className) {
		case "main":
			var $layer = t.parentNodes("layer");
			var $node = t.parentNodes("node");

			if(!/active/.test($node.className)) {
				//aid = 0
				scene.get(d.aid, d.mid, 0);
			}

			$layer.toggleClass("pass");
			$node.toggleClass("active");
		break;
		case "scene":
			var $node = t.parentNodes("node");
			var $option = $node.querySelector(".option.active");
			if($option) {
				var $layer = t.parentNodes("layer");

				$layer.toggleClass("pass");
				$node.toggleClass("active");
			} else {
				action.get(d.sid, t);
			}
		break;
		case "option":
		case "option active":
			var $scene = t.parentNodes("node").querySelector(".scene");	//useless
			var $layer = t.parentNodes("layer");
			var $node = t.parentNodes("node");
			var $option = t;

			$layer.addClass("pass");

			var $node_a = $layer.querySelector(".node.active");
			$node_a && $node_a.removeClass("active");
			$node.addClass("active");

			var $option_a = $layer.querySelector(".option.active");
			$option_a && $option_a.removeClass("active");
			$option.addClass("active");

			//mid = 0
			scene.get(d.aid, $scene.dataset.mid, parseInt($layer.id.substr(1)) + 1);
		break;
		case "add":
			popup(t);
		break;
	}
}

var _user = 0;
function popup(t) {
	/** add function **/
	/*if(!_user) {
		_user = prompt("随便输个id用来记录，后续添加登录功能","name");
		if( !_user || _user == "name") {
			alert("随便打几个字符就好");
			return;
		}
	}*/
	var data = t.dataset;
	switch(data.type) {
		case "main":
			$popup_tip.innerHTML = "问题请在100字内描述完";
			$add_btn.onclick = function() {
				main.add();
			}
			$popup.style.display = "block";
		break;
		case "scene":
			$popup_tip.innerHTML = "场景描述50字就够了";
			$add_btn.onclick = function() {
				scene.add(data.aid, data.mid, parseInt(t.parentNode.id.substr(1)));
			}
			$popup.style.display = "block";
		break;
		case "scene-exist":
			scene.getExist(data.aid, data.mid, parseInt(t.parentNode.id.substr(1)));
		break;
		case "action":
			$popup_tip.innerHTML = "10字以内";
			$add_btn.onclick = function() {
				action.add(data.id, t.parentNodes("action"));
			}
			$popup.style.display = "block";
		break;
	}
	$popup_len.innerHTML = "已输入0字";
}

function addLink(e) {
	var t = e.target;
	switch(t.className) {
		case "exist":
			t.style.width = "0";
			break;
		case "scene-e":
			var aid = t.parentNodes("exist").dataset.aid;
			var mid = t.parentNodes("exist").dataset.mid;
			var cur = t.parentNodes("exist").dataset.cur;
			var sid = t.dataset.sid;
			scene.addLink(aid, sid, mid, cur);
			break;
	}
}

/*** bind function ***/
var $add = document.querySelector("#add");
var $add_btn = document.querySelector("#add-btn");
var $popup = document.querySelector("#popup");
var $popup_tip = $popup.querySelector(".tip");
var $popup_len = $popup.querySelector(".length");
var $page = document.querySelector(".page");
var $loading = document.querySelector(".loading");
var $scene_exist = document.querySelector("#scene-exist");

$page.addEventListener("click", pageClick);
$popup.addEventListener("click", function(e) {
	(/popup/.test(e.target.id)) && (this.style.display = "none");
});
$loading.addEventListener("click", function(e) {
	this.style.display = "none";
});
$add.onkeyup = function() {
	$popup_len.innerHTML = "已输入" + $add.value.length + "字";
}
$scene_exist.addEventListener("click", addLink);
/*** bind function ***/

main.get();