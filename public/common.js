String.prototype.replaceWith = function(d) {
  return this.replace(/\{\$(\w+)\}/g, function(a, c) {
    if (c in d) {
      return d[c];
    } else {
      return a;
    }
  });
}
String.prototype.trim = String.prototype.trim || function() {
  return this.replace(/(^\s*)|(\s*$)/g, "");
};
Function.prototype.bind = function(a) {
  var c = this;
  var d = [].slice.call(arguments, 1);
  return function() {
    return c.apply(a, d.concat([].slice.call(arguments, 0)));
  };
}

var extend = function(obja, objb) {
  for (var b in objb) {
    if (objb[b] && objb[b].constructor == Object) {
      if (!obja[b]) {
        obja[b] = {};
      }
      arguments.callee(obja[b], objb[b])
    } else {
      obja[b] = objb[b];
    }
  }
  return obja;
};
var addClass = function() {
  if (!hasClass(arguments[0], arguments[1])) {
    arguments[0].className = [arguments[0].className.trim(), arguments[1].trim()]
      .join(" ");
  }
}
var removeClass = function() {
  if (hasClass(arguments[0], arguments[1])) {
    var reg = new RegExp('(\\s|^)' + arguments[1] + '(\\s|$)');
    arguments[0].className = arguments[0].className.replace(reg, ' ').split(
      " ").join(" ").trim();
  }
}
var hasClass = function() {
  return (arguments[0].className || "").match(new RegExp('(\\s|^)' +
    arguments[1] + '(\\s|$)'));
}
var addEvent = function(o, eType, fn) {
  if (o.addEventListener) {
    o.addEventListener(eType, fn, false);
  } else if (o.attachEvent) {
    o.attachEvent("on" + eType, fn);
  } else {
    o["on" + eType] = fn;
  }
}
var removeEvent = function(obj, type, fn) {
  if (obj.removeEventListener) obj.removeEventListener(type, fn, false);
  else if (obj.detachEvent) {
    obj.detachEvent("on" + type, obj[type + fn]);
    obj[type + fn] = null;
    obj["e" + type + fn] = null;
  }
}
String.prototype.padLeft = function (t, p) {
    var e = []; p = p || "0";
    for (var d = 0, a = t - this.length; d < a; d++) {
        e.push(p);
    }
    e.push(this).j;
    return e.join('');
}
String.prototype.padRight = function (t, p) {
    var e = [this]; p = p || "0";
    for (var d = 0, a = t - this.length; d < a; d++) {
        e.push(p);
    }
    return e.join('');
}
var triggerEvent = function() {
  if (document.createEvent) {
    var evt = document.createEvent("TouchEvent");
    evt.initEvent(arguments[1], true, true);
    arguments[0].dispatchEvent(evt);
  } else {
    arguments[0].fireEvent('on' + arguments[1]);
  }
}
var  parents = function() {
  if (arguments.length > 1) {
      var tempNode = arguments[0].parentNode;
      if(arguments[0].tagName == arguments[1].toUpperCase()){
          return arguments[0];
      }
      while (tempNode && tempNode.tagName != arguments[1].toUpperCase()) {
          tempNode = tempNode.parentNode;
      }
      return tempNode;
  } else {
      return arguments[0].parentNode;
  }
}
// (function(window) {
//   if ( "onhashchange" in window.document.body ) { return; }
//   var location = window.location,
//     oldURL = location.href,
//     oldHash = location.hash;

//   setInterval(function() {
//     var newURL = location.href,
//       newHash = location.hash;
//     if ( newHash != oldHash && typeof window.onhashchange === "function" ) {
//       window.onhashchange({
//         type: "hashchange",
//         oldURL: oldURL,
//         newURL: newURL
//       });

//       oldURL = newURL;
//       oldHash = newHash;
//     }
//   }, 100);
// })(window);
