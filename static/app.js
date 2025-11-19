(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from2, except, desc) => {
    if (from2 && typeof from2 === "object" || typeof from2 === "function") {
      for (let key of __getOwnPropNames(from2))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/codemirror/lib/codemirror.js
  var require_codemirror = __commonJS({
    "node_modules/codemirror/lib/codemirror.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = global2 || self, global2.CodeMirror = factory());
      })(exports, (function() {
        "use strict";
        var userAgent = navigator.userAgent;
        var platform = navigator.platform;
        var gecko = /gecko\/\d/i.test(userAgent);
        var ie_upto10 = /MSIE \d/.test(userAgent);
        var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
        var edge = /Edge\/(\d+)/.exec(userAgent);
        var ie = ie_upto10 || ie_11up || edge;
        var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]);
        var webkit = !edge && /WebKit\//.test(userAgent);
        var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
        var chrome = !edge && /Chrome\/(\d+)/.exec(userAgent);
        var chrome_version = chrome && +chrome[1];
        var presto = /Opera\//.test(userAgent);
        var safari = /Apple Computer/.test(navigator.vendor);
        var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
        var phantom = /PhantomJS/.test(userAgent);
        var ios = safari && (/Mobile\/\w+/.test(userAgent) || navigator.maxTouchPoints > 2);
        var android = /Android/.test(userAgent);
        var mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
        var mac = ios || /Mac/.test(platform);
        var chromeOS = /\bCrOS\b/.test(userAgent);
        var windows = /win/i.test(platform);
        var presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
        if (presto_version) {
          presto_version = Number(presto_version[1]);
        }
        if (presto_version && presto_version >= 15) {
          presto = false;
          webkit = true;
        }
        var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
        var captureRightClick = gecko || ie && ie_version >= 9;
        function classTest(cls) {
          return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*");
        }
        var rmClass = function(node, cls) {
          var current = node.className;
          var match = classTest(cls).exec(current);
          if (match) {
            var after = current.slice(match.index + match[0].length);
            node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
          }
        };
        function removeChildren(e) {
          for (var count = e.childNodes.length; count > 0; --count) {
            e.removeChild(e.firstChild);
          }
          return e;
        }
        function removeChildrenAndAdd(parent, e) {
          return removeChildren(parent).appendChild(e);
        }
        function elt(tag, content, className, style) {
          var e = document.createElement(tag);
          if (className) {
            e.className = className;
          }
          if (style) {
            e.style.cssText = style;
          }
          if (typeof content == "string") {
            e.appendChild(document.createTextNode(content));
          } else if (content) {
            for (var i2 = 0; i2 < content.length; ++i2) {
              e.appendChild(content[i2]);
            }
          }
          return e;
        }
        function eltP(tag, content, className, style) {
          var e = elt(tag, content, className, style);
          e.setAttribute("role", "presentation");
          return e;
        }
        var range;
        if (document.createRange) {
          range = function(node, start, end, endNode) {
            var r = document.createRange();
            r.setEnd(endNode || node, end);
            r.setStart(node, start);
            return r;
          };
        } else {
          range = function(node, start, end) {
            var r = document.body.createTextRange();
            try {
              r.moveToElementText(node.parentNode);
            } catch (e) {
              return r;
            }
            r.collapse(true);
            r.moveEnd("character", end);
            r.moveStart("character", start);
            return r;
          };
        }
        function contains(parent, child) {
          if (child.nodeType == 3) {
            child = child.parentNode;
          }
          if (parent.contains) {
            return parent.contains(child);
          }
          do {
            if (child.nodeType == 11) {
              child = child.host;
            }
            if (child == parent) {
              return true;
            }
          } while (child = child.parentNode);
        }
        function activeElt(rootNode2) {
          var doc3 = rootNode2.ownerDocument || rootNode2;
          var activeElement;
          try {
            activeElement = rootNode2.activeElement;
          } catch (e) {
            activeElement = doc3.body || null;
          }
          while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
            activeElement = activeElement.shadowRoot.activeElement;
          }
          return activeElement;
        }
        function addClass(node, cls) {
          var current = node.className;
          if (!classTest(cls).test(current)) {
            node.className += (current ? " " : "") + cls;
          }
        }
        function joinClasses(a, b) {
          var as = a.split(" ");
          for (var i2 = 0; i2 < as.length; i2++) {
            if (as[i2] && !classTest(as[i2]).test(b)) {
              b += " " + as[i2];
            }
          }
          return b;
        }
        var selectInput = function(node) {
          node.select();
        };
        if (ios) {
          selectInput = function(node) {
            node.selectionStart = 0;
            node.selectionEnd = node.value.length;
          };
        } else if (ie) {
          selectInput = function(node) {
            try {
              node.select();
            } catch (_e) {
            }
          };
        }
        function doc2(cm) {
          return cm.display.wrapper.ownerDocument;
        }
        function root(cm) {
          return rootNode(cm.display.wrapper);
        }
        function rootNode(element2) {
          return element2.getRootNode ? element2.getRootNode() : element2.ownerDocument;
        }
        function win(cm) {
          return doc2(cm).defaultView;
        }
        function bind(f) {
          var args2 = Array.prototype.slice.call(arguments, 1);
          return function() {
            return f.apply(null, args2);
          };
        }
        function copyObj(obj, target, overwrite) {
          if (!target) {
            target = {};
          }
          for (var prop2 in obj) {
            if (obj.hasOwnProperty(prop2) && (overwrite !== false || !target.hasOwnProperty(prop2))) {
              target[prop2] = obj[prop2];
            }
          }
          return target;
        }
        function countColumn(string, end, tabSize, startIndex, startValue) {
          if (end == null) {
            end = string.search(/[^\s\u00a0]/);
            if (end == -1) {
              end = string.length;
            }
          }
          for (var i2 = startIndex || 0, n = startValue || 0; ; ) {
            var nextTab = string.indexOf("	", i2);
            if (nextTab < 0 || nextTab >= end) {
              return n + (end - i2);
            }
            n += nextTab - i2;
            n += tabSize - n % tabSize;
            i2 = nextTab + 1;
          }
        }
        var Delayed = function() {
          this.id = null;
          this.f = null;
          this.time = 0;
          this.handler = bind(this.onTimeout, this);
        };
        Delayed.prototype.onTimeout = function(self2) {
          self2.id = 0;
          if (self2.time <= +/* @__PURE__ */ new Date()) {
            self2.f();
          } else {
            setTimeout(self2.handler, self2.time - +/* @__PURE__ */ new Date());
          }
        };
        Delayed.prototype.set = function(ms, f) {
          this.f = f;
          var time = +/* @__PURE__ */ new Date() + ms;
          if (!this.id || time < this.time) {
            clearTimeout(this.id);
            this.id = setTimeout(this.handler, ms);
            this.time = time;
          }
        };
        function indexOf(array, elt2) {
          for (var i2 = 0; i2 < array.length; ++i2) {
            if (array[i2] == elt2) {
              return i2;
            }
          }
          return -1;
        }
        var scrollerGap = 50;
        var Pass = { toString: function() {
          return "CodeMirror.Pass";
        } };
        var sel_dontScroll = { scroll: false }, sel_mouse = { origin: "*mouse" }, sel_move = { origin: "+move" };
        function findColumn(string, goal, tabSize) {
          for (var pos = 0, col = 0; ; ) {
            var nextTab = string.indexOf("	", pos);
            if (nextTab == -1) {
              nextTab = string.length;
            }
            var skipped = nextTab - pos;
            if (nextTab == string.length || col + skipped >= goal) {
              return pos + Math.min(skipped, goal - col);
            }
            col += nextTab - pos;
            col += tabSize - col % tabSize;
            pos = nextTab + 1;
            if (col >= goal) {
              return pos;
            }
          }
        }
        var spaceStrs = [""];
        function spaceStr(n) {
          while (spaceStrs.length <= n) {
            spaceStrs.push(lst(spaceStrs) + " ");
          }
          return spaceStrs[n];
        }
        function lst(arr) {
          return arr[arr.length - 1];
        }
        function map3(array, f) {
          var out = [];
          for (var i2 = 0; i2 < array.length; i2++) {
            out[i2] = f(array[i2], i2);
          }
          return out;
        }
        function insertSorted(array, value, score) {
          var pos = 0, priority = score(value);
          while (pos < array.length && score(array[pos]) <= priority) {
            pos++;
          }
          array.splice(pos, 0, value);
        }
        function nothing() {
        }
        function createObj(base, props) {
          var inst;
          if (Object.create) {
            inst = Object.create(base);
          } else {
            nothing.prototype = base;
            inst = new nothing();
          }
          if (props) {
            copyObj(props, inst);
          }
          return inst;
        }
        var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
        function isWordCharBasic(ch) {
          return /\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
        }
        function isWordChar(ch, helper) {
          if (!helper) {
            return isWordCharBasic(ch);
          }
          if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) {
            return true;
          }
          return helper.test(ch);
        }
        function isEmpty2(obj) {
          for (var n in obj) {
            if (obj.hasOwnProperty(n) && obj[n]) {
              return false;
            }
          }
          return true;
        }
        var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
        function isExtendingChar(ch) {
          return ch.charCodeAt(0) >= 768 && extendingChars.test(ch);
        }
        function skipExtendingChars(str, pos, dir) {
          while ((dir < 0 ? pos > 0 : pos < str.length) && isExtendingChar(str.charAt(pos))) {
            pos += dir;
          }
          return pos;
        }
        function findFirst(pred, from2, to) {
          var dir = from2 > to ? -1 : 1;
          for (; ; ) {
            if (from2 == to) {
              return from2;
            }
            var midF = (from2 + to) / 2, mid = dir < 0 ? Math.ceil(midF) : Math.floor(midF);
            if (mid == from2) {
              return pred(mid) ? from2 : to;
            }
            if (pred(mid)) {
              to = mid;
            } else {
              from2 = mid + dir;
            }
          }
        }
        function iterateBidiSections(order, from2, to, f) {
          if (!order) {
            return f(from2, to, "ltr", 0);
          }
          var found = false;
          for (var i2 = 0; i2 < order.length; ++i2) {
            var part = order[i2];
            if (part.from < to && part.to > from2 || from2 == to && part.to == from2) {
              f(Math.max(part.from, from2), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr", i2);
              found = true;
            }
          }
          if (!found) {
            f(from2, to, "ltr");
          }
        }
        var bidiOther = null;
        function getBidiPartAt(order, ch, sticky) {
          var found;
          bidiOther = null;
          for (var i2 = 0; i2 < order.length; ++i2) {
            var cur = order[i2];
            if (cur.from < ch && cur.to > ch) {
              return i2;
            }
            if (cur.to == ch) {
              if (cur.from != cur.to && sticky == "before") {
                found = i2;
              } else {
                bidiOther = i2;
              }
            }
            if (cur.from == ch) {
              if (cur.from != cur.to && sticky != "before") {
                found = i2;
              } else {
                bidiOther = i2;
              }
            }
          }
          return found != null ? found : bidiOther;
        }
        var bidiOrdering = /* @__PURE__ */ (function() {
          var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
          var arabicTypes = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";
          function charType(code) {
            if (code <= 247) {
              return lowTypes.charAt(code);
            } else if (1424 <= code && code <= 1524) {
              return "R";
            } else if (1536 <= code && code <= 1785) {
              return arabicTypes.charAt(code - 1536);
            } else if (1774 <= code && code <= 2220) {
              return "r";
            } else if (8192 <= code && code <= 8203) {
              return "w";
            } else if (code == 8204) {
              return "b";
            } else {
              return "L";
            }
          }
          var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
          var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
          function BidiSpan(level, from2, to) {
            this.level = level;
            this.from = from2;
            this.to = to;
          }
          return function(str, direction) {
            var outerType = direction == "ltr" ? "L" : "R";
            if (str.length == 0 || direction == "ltr" && !bidiRE.test(str)) {
              return false;
            }
            var len = str.length, types = [];
            for (var i2 = 0; i2 < len; ++i2) {
              types.push(charType(str.charCodeAt(i2)));
            }
            for (var i$12 = 0, prev = outerType; i$12 < len; ++i$12) {
              var type = types[i$12];
              if (type == "m") {
                types[i$12] = prev;
              } else {
                prev = type;
              }
            }
            for (var i$22 = 0, cur = outerType; i$22 < len; ++i$22) {
              var type$1 = types[i$22];
              if (type$1 == "1" && cur == "r") {
                types[i$22] = "n";
              } else if (isStrong.test(type$1)) {
                cur = type$1;
                if (type$1 == "r") {
                  types[i$22] = "R";
                }
              }
            }
            for (var i$3 = 1, prev$1 = types[0]; i$3 < len - 1; ++i$3) {
              var type$2 = types[i$3];
              if (type$2 == "+" && prev$1 == "1" && types[i$3 + 1] == "1") {
                types[i$3] = "1";
              } else if (type$2 == "," && prev$1 == types[i$3 + 1] && (prev$1 == "1" || prev$1 == "n")) {
                types[i$3] = prev$1;
              }
              prev$1 = type$2;
            }
            for (var i$4 = 0; i$4 < len; ++i$4) {
              var type$3 = types[i$4];
              if (type$3 == ",") {
                types[i$4] = "N";
              } else if (type$3 == "%") {
                var end = void 0;
                for (end = i$4 + 1; end < len && types[end] == "%"; ++end) {
                }
                var replace = i$4 && types[i$4 - 1] == "!" || end < len && types[end] == "1" ? "1" : "N";
                for (var j = i$4; j < end; ++j) {
                  types[j] = replace;
                }
                i$4 = end - 1;
              }
            }
            for (var i$5 = 0, cur$1 = outerType; i$5 < len; ++i$5) {
              var type$4 = types[i$5];
              if (cur$1 == "L" && type$4 == "1") {
                types[i$5] = "L";
              } else if (isStrong.test(type$4)) {
                cur$1 = type$4;
              }
            }
            for (var i$6 = 0; i$6 < len; ++i$6) {
              if (isNeutral.test(types[i$6])) {
                var end$1 = void 0;
                for (end$1 = i$6 + 1; end$1 < len && isNeutral.test(types[end$1]); ++end$1) {
                }
                var before = (i$6 ? types[i$6 - 1] : outerType) == "L";
                var after = (end$1 < len ? types[end$1] : outerType) == "L";
                var replace$1 = before == after ? before ? "L" : "R" : outerType;
                for (var j$1 = i$6; j$1 < end$1; ++j$1) {
                  types[j$1] = replace$1;
                }
                i$6 = end$1 - 1;
              }
            }
            var order = [], m;
            for (var i$7 = 0; i$7 < len; ) {
              if (countsAsLeft.test(types[i$7])) {
                var start = i$7;
                for (++i$7; i$7 < len && countsAsLeft.test(types[i$7]); ++i$7) {
                }
                order.push(new BidiSpan(0, start, i$7));
              } else {
                var pos = i$7, at = order.length, isRTL = direction == "rtl" ? 1 : 0;
                for (++i$7; i$7 < len && types[i$7] != "L"; ++i$7) {
                }
                for (var j$2 = pos; j$2 < i$7; ) {
                  if (countsAsNum.test(types[j$2])) {
                    if (pos < j$2) {
                      order.splice(at, 0, new BidiSpan(1, pos, j$2));
                      at += isRTL;
                    }
                    var nstart = j$2;
                    for (++j$2; j$2 < i$7 && countsAsNum.test(types[j$2]); ++j$2) {
                    }
                    order.splice(at, 0, new BidiSpan(2, nstart, j$2));
                    at += isRTL;
                    pos = j$2;
                  } else {
                    ++j$2;
                  }
                }
                if (pos < i$7) {
                  order.splice(at, 0, new BidiSpan(1, pos, i$7));
                }
              }
            }
            if (direction == "ltr") {
              if (order[0].level == 1 && (m = str.match(/^\s+/))) {
                order[0].from = m[0].length;
                order.unshift(new BidiSpan(0, 0, m[0].length));
              }
              if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
                lst(order).to -= m[0].length;
                order.push(new BidiSpan(0, len - m[0].length, len));
              }
            }
            return direction == "rtl" ? order.reverse() : order;
          };
        })();
        function getOrder(line, direction) {
          var order = line.order;
          if (order == null) {
            order = line.order = bidiOrdering(line.text, direction);
          }
          return order;
        }
        var noHandlers = [];
        var on = function(emitter, type, f) {
          if (emitter.addEventListener) {
            emitter.addEventListener(type, f, false);
          } else if (emitter.attachEvent) {
            emitter.attachEvent("on" + type, f);
          } else {
            var map4 = emitter._handlers || (emitter._handlers = {});
            map4[type] = (map4[type] || noHandlers).concat(f);
          }
        };
        function getHandlers(emitter, type) {
          return emitter._handlers && emitter._handlers[type] || noHandlers;
        }
        function off(emitter, type, f) {
          if (emitter.removeEventListener) {
            emitter.removeEventListener(type, f, false);
          } else if (emitter.detachEvent) {
            emitter.detachEvent("on" + type, f);
          } else {
            var map4 = emitter._handlers, arr = map4 && map4[type];
            if (arr) {
              var index = indexOf(arr, f);
              if (index > -1) {
                map4[type] = arr.slice(0, index).concat(arr.slice(index + 1));
              }
            }
          }
        }
        function signal(emitter, type) {
          var handlers = getHandlers(emitter, type);
          if (!handlers.length) {
            return;
          }
          var args2 = Array.prototype.slice.call(arguments, 2);
          for (var i2 = 0; i2 < handlers.length; ++i2) {
            handlers[i2].apply(null, args2);
          }
        }
        function signalDOMEvent(cm, e, override) {
          if (typeof e == "string") {
            e = { type: e, preventDefault: function() {
              this.defaultPrevented = true;
            } };
          }
          signal(cm, override || e.type, cm, e);
          return e_defaultPrevented(e) || e.codemirrorIgnore;
        }
        function signalCursorActivity(cm) {
          var arr = cm._handlers && cm._handlers.cursorActivity;
          if (!arr) {
            return;
          }
          var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
          for (var i2 = 0; i2 < arr.length; ++i2) {
            if (indexOf(set, arr[i2]) == -1) {
              set.push(arr[i2]);
            }
          }
        }
        function hasHandler(emitter, type) {
          return getHandlers(emitter, type).length > 0;
        }
        function eventMixin(ctor) {
          ctor.prototype.on = function(type, f) {
            on(this, type, f);
          };
          ctor.prototype.off = function(type, f) {
            off(this, type, f);
          };
        }
        function e_preventDefault(e) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
        function e_stopPropagation(e) {
          if (e.stopPropagation) {
            e.stopPropagation();
          } else {
            e.cancelBubble = true;
          }
        }
        function e_defaultPrevented(e) {
          return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
        }
        function e_stop(e) {
          e_preventDefault(e);
          e_stopPropagation(e);
        }
        function e_target(e) {
          return e.target || e.srcElement;
        }
        function e_button(e) {
          var b = e.which;
          if (b == null) {
            if (e.button & 1) {
              b = 1;
            } else if (e.button & 2) {
              b = 3;
            } else if (e.button & 4) {
              b = 2;
            }
          }
          if (mac && e.ctrlKey && b == 1) {
            b = 3;
          }
          return b;
        }
        var dragAndDrop = (function() {
          if (ie && ie_version < 9) {
            return false;
          }
          var div = elt("div");
          return "draggable" in div || "dragDrop" in div;
        })();
        var zwspSupported;
        function zeroWidthElement(measure) {
          if (zwspSupported == null) {
            var test = elt("span", "\u200B");
            removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
            if (measure.firstChild.offsetHeight != 0) {
              zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8);
            }
          }
          var node = zwspSupported ? elt("span", "\u200B") : elt("span", "\xA0", null, "display: inline-block; width: 1px; margin-right: -1px");
          node.setAttribute("cm-text", "");
          return node;
        }
        var badBidiRects;
        function hasBadBidiRects(measure) {
          if (badBidiRects != null) {
            return badBidiRects;
          }
          var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062EA"));
          var r0 = range(txt, 0, 1).getBoundingClientRect();
          var r1 = range(txt, 1, 2).getBoundingClientRect();
          removeChildren(measure);
          if (!r0 || r0.left == r0.right) {
            return false;
          }
          return badBidiRects = r1.right - r0.right < 3;
        }
        var splitLinesAuto = "\n\nb".split(/\n/).length != 3 ? function(string) {
          var pos = 0, result = [], l = string.length;
          while (pos <= l) {
            var nl = string.indexOf("\n", pos);
            if (nl == -1) {
              nl = string.length;
            }
            var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
            var rt = line.indexOf("\r");
            if (rt != -1) {
              result.push(line.slice(0, rt));
              pos += rt + 1;
            } else {
              result.push(line);
              pos = nl + 1;
            }
          }
          return result;
        } : function(string) {
          return string.split(/\r\n?|\n/);
        };
        var hasSelection = window.getSelection ? function(te) {
          try {
            return te.selectionStart != te.selectionEnd;
          } catch (e) {
            return false;
          }
        } : function(te) {
          var range2;
          try {
            range2 = te.ownerDocument.selection.createRange();
          } catch (e) {
          }
          if (!range2 || range2.parentElement() != te) {
            return false;
          }
          return range2.compareEndPoints("StartToEnd", range2) != 0;
        };
        var hasCopyEvent = (function() {
          var e = elt("div");
          if ("oncopy" in e) {
            return true;
          }
          e.setAttribute("oncopy", "return;");
          return typeof e.oncopy == "function";
        })();
        var badZoomedRects = null;
        function hasBadZoomedRects(measure) {
          if (badZoomedRects != null) {
            return badZoomedRects;
          }
          var node = removeChildrenAndAdd(measure, elt("span", "x"));
          var normal = node.getBoundingClientRect();
          var fromRange = range(node, 0, 1).getBoundingClientRect();
          return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
        }
        var modes = {}, mimeModes = {};
        function defineMode(name, mode) {
          if (arguments.length > 2) {
            mode.dependencies = Array.prototype.slice.call(arguments, 2);
          }
          modes[name] = mode;
        }
        function defineMIME(mime, spec) {
          mimeModes[mime] = spec;
        }
        function resolveMode(spec) {
          if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
            spec = mimeModes[spec];
          } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
            var found = mimeModes[spec.name];
            if (typeof found == "string") {
              found = { name: found };
            }
            spec = createObj(found, spec);
            spec.name = found.name;
          } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
            return resolveMode("application/xml");
          } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(spec)) {
            return resolveMode("application/json");
          }
          if (typeof spec == "string") {
            return { name: spec };
          } else {
            return spec || { name: "null" };
          }
        }
        function getMode(options, spec) {
          spec = resolveMode(spec);
          var mfactory = modes[spec.name];
          if (!mfactory) {
            return getMode(options, "text/plain");
          }
          var modeObj = mfactory(options, spec);
          if (modeExtensions.hasOwnProperty(spec.name)) {
            var exts = modeExtensions[spec.name];
            for (var prop2 in exts) {
              if (!exts.hasOwnProperty(prop2)) {
                continue;
              }
              if (modeObj.hasOwnProperty(prop2)) {
                modeObj["_" + prop2] = modeObj[prop2];
              }
              modeObj[prop2] = exts[prop2];
            }
          }
          modeObj.name = spec.name;
          if (spec.helperType) {
            modeObj.helperType = spec.helperType;
          }
          if (spec.modeProps) {
            for (var prop$1 in spec.modeProps) {
              modeObj[prop$1] = spec.modeProps[prop$1];
            }
          }
          return modeObj;
        }
        var modeExtensions = {};
        function extendMode(mode, properties) {
          var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : modeExtensions[mode] = {};
          copyObj(properties, exts);
        }
        function copyState(mode, state) {
          if (state === true) {
            return state;
          }
          if (mode.copyState) {
            return mode.copyState(state);
          }
          var nstate = {};
          for (var n in state) {
            var val = state[n];
            if (val instanceof Array) {
              val = val.concat([]);
            }
            nstate[n] = val;
          }
          return nstate;
        }
        function innerMode(mode, state) {
          var info;
          while (mode.innerMode) {
            info = mode.innerMode(state);
            if (!info || info.mode == mode) {
              break;
            }
            state = info.state;
            mode = info.mode;
          }
          return info || { mode, state };
        }
        function startState(mode, a1, a2) {
          return mode.startState ? mode.startState(a1, a2) : true;
        }
        var StringStream = function(string, tabSize, lineOracle) {
          this.pos = this.start = 0;
          this.string = string;
          this.tabSize = tabSize || 8;
          this.lastColumnPos = this.lastColumnValue = 0;
          this.lineStart = 0;
          this.lineOracle = lineOracle;
        };
        StringStream.prototype.eol = function() {
          return this.pos >= this.string.length;
        };
        StringStream.prototype.sol = function() {
          return this.pos == this.lineStart;
        };
        StringStream.prototype.peek = function() {
          return this.string.charAt(this.pos) || void 0;
        };
        StringStream.prototype.next = function() {
          if (this.pos < this.string.length) {
            return this.string.charAt(this.pos++);
          }
        };
        StringStream.prototype.eat = function(match) {
          var ch = this.string.charAt(this.pos);
          var ok;
          if (typeof match == "string") {
            ok = ch == match;
          } else {
            ok = ch && (match.test ? match.test(ch) : match(ch));
          }
          if (ok) {
            ++this.pos;
            return ch;
          }
        };
        StringStream.prototype.eatWhile = function(match) {
          var start = this.pos;
          while (this.eat(match)) {
          }
          return this.pos > start;
        };
        StringStream.prototype.eatSpace = function() {
          var start = this.pos;
          while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) {
            ++this.pos;
          }
          return this.pos > start;
        };
        StringStream.prototype.skipToEnd = function() {
          this.pos = this.string.length;
        };
        StringStream.prototype.skipTo = function(ch) {
          var found = this.string.indexOf(ch, this.pos);
          if (found > -1) {
            this.pos = found;
            return true;
          }
        };
        StringStream.prototype.backUp = function(n) {
          this.pos -= n;
        };
        StringStream.prototype.column = function() {
          if (this.lastColumnPos < this.start) {
            this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
            this.lastColumnPos = this.start;
          }
          return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
        };
        StringStream.prototype.indentation = function() {
          return countColumn(this.string, null, this.tabSize) - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
        };
        StringStream.prototype.match = function(pattern, consume, caseInsensitive) {
          if (typeof pattern == "string") {
            var cased = function(str) {
              return caseInsensitive ? str.toLowerCase() : str;
            };
            var substr = this.string.substr(this.pos, pattern.length);
            if (cased(substr) == cased(pattern)) {
              if (consume !== false) {
                this.pos += pattern.length;
              }
              return true;
            }
          } else {
            var match = this.string.slice(this.pos).match(pattern);
            if (match && match.index > 0) {
              return null;
            }
            if (match && consume !== false) {
              this.pos += match[0].length;
            }
            return match;
          }
        };
        StringStream.prototype.current = function() {
          return this.string.slice(this.start, this.pos);
        };
        StringStream.prototype.hideFirstChars = function(n, inner) {
          this.lineStart += n;
          try {
            return inner();
          } finally {
            this.lineStart -= n;
          }
        };
        StringStream.prototype.lookAhead = function(n) {
          var oracle = this.lineOracle;
          return oracle && oracle.lookAhead(n);
        };
        StringStream.prototype.baseToken = function() {
          var oracle = this.lineOracle;
          return oracle && oracle.baseToken(this.pos);
        };
        function getLine(doc3, n) {
          n -= doc3.first;
          if (n < 0 || n >= doc3.size) {
            throw new Error("There is no line " + (n + doc3.first) + " in the document.");
          }
          var chunk = doc3;
          while (!chunk.lines) {
            for (var i2 = 0; ; ++i2) {
              var child = chunk.children[i2], sz = child.chunkSize();
              if (n < sz) {
                chunk = child;
                break;
              }
              n -= sz;
            }
          }
          return chunk.lines[n];
        }
        function getBetween(doc3, start, end) {
          var out = [], n = start.line;
          doc3.iter(start.line, end.line + 1, function(line) {
            var text2 = line.text;
            if (n == end.line) {
              text2 = text2.slice(0, end.ch);
            }
            if (n == start.line) {
              text2 = text2.slice(start.ch);
            }
            out.push(text2);
            ++n;
          });
          return out;
        }
        function getLines(doc3, from2, to) {
          var out = [];
          doc3.iter(from2, to, function(line) {
            out.push(line.text);
          });
          return out;
        }
        function updateLineHeight(line, height) {
          var diff = height - line.height;
          if (diff) {
            for (var n = line; n; n = n.parent) {
              n.height += diff;
            }
          }
        }
        function lineNo(line) {
          if (line.parent == null) {
            return null;
          }
          var cur = line.parent, no = indexOf(cur.lines, line);
          for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
            for (var i2 = 0; ; ++i2) {
              if (chunk.children[i2] == cur) {
                break;
              }
              no += chunk.children[i2].chunkSize();
            }
          }
          return no + cur.first;
        }
        function lineAtHeight(chunk, h) {
          var n = chunk.first;
          outer: do {
            for (var i$12 = 0; i$12 < chunk.children.length; ++i$12) {
              var child = chunk.children[i$12], ch = child.height;
              if (h < ch) {
                chunk = child;
                continue outer;
              }
              h -= ch;
              n += child.chunkSize();
            }
            return n;
          } while (!chunk.lines);
          var i2 = 0;
          for (; i2 < chunk.lines.length; ++i2) {
            var line = chunk.lines[i2], lh = line.height;
            if (h < lh) {
              break;
            }
            h -= lh;
          }
          return n + i2;
        }
        function isLine(doc3, l) {
          return l >= doc3.first && l < doc3.first + doc3.size;
        }
        function lineNumberFor(options, i2) {
          return String(options.lineNumberFormatter(i2 + options.firstLineNumber));
        }
        function Pos(line, ch, sticky) {
          if (sticky === void 0) sticky = null;
          if (!(this instanceof Pos)) {
            return new Pos(line, ch, sticky);
          }
          this.line = line;
          this.ch = ch;
          this.sticky = sticky;
        }
        function cmp(a, b) {
          return a.line - b.line || a.ch - b.ch;
        }
        function equalCursorPos(a, b) {
          return a.sticky == b.sticky && cmp(a, b) == 0;
        }
        function copyPos(x) {
          return Pos(x.line, x.ch);
        }
        function maxPos(a, b) {
          return cmp(a, b) < 0 ? b : a;
        }
        function minPos(a, b) {
          return cmp(a, b) < 0 ? a : b;
        }
        function clipLine(doc3, n) {
          return Math.max(doc3.first, Math.min(n, doc3.first + doc3.size - 1));
        }
        function clipPos(doc3, pos) {
          if (pos.line < doc3.first) {
            return Pos(doc3.first, 0);
          }
          var last2 = doc3.first + doc3.size - 1;
          if (pos.line > last2) {
            return Pos(last2, getLine(doc3, last2).text.length);
          }
          return clipToLen(pos, getLine(doc3, pos.line).text.length);
        }
        function clipToLen(pos, linelen) {
          var ch = pos.ch;
          if (ch == null || ch > linelen) {
            return Pos(pos.line, linelen);
          } else if (ch < 0) {
            return Pos(pos.line, 0);
          } else {
            return pos;
          }
        }
        function clipPosArray(doc3, array) {
          var out = [];
          for (var i2 = 0; i2 < array.length; i2++) {
            out[i2] = clipPos(doc3, array[i2]);
          }
          return out;
        }
        var SavedContext = function(state, lookAhead) {
          this.state = state;
          this.lookAhead = lookAhead;
        };
        var Context = function(doc3, state, line, lookAhead) {
          this.state = state;
          this.doc = doc3;
          this.line = line;
          this.maxLookAhead = lookAhead || 0;
          this.baseTokens = null;
          this.baseTokenPos = 1;
        };
        Context.prototype.lookAhead = function(n) {
          var line = this.doc.getLine(this.line + n);
          if (line != null && n > this.maxLookAhead) {
            this.maxLookAhead = n;
          }
          return line;
        };
        Context.prototype.baseToken = function(n) {
          if (!this.baseTokens) {
            return null;
          }
          while (this.baseTokens[this.baseTokenPos] <= n) {
            this.baseTokenPos += 2;
          }
          var type = this.baseTokens[this.baseTokenPos + 1];
          return {
            type: type && type.replace(/( |^)overlay .*/, ""),
            size: this.baseTokens[this.baseTokenPos] - n
          };
        };
        Context.prototype.nextLine = function() {
          this.line++;
          if (this.maxLookAhead > 0) {
            this.maxLookAhead--;
          }
        };
        Context.fromSaved = function(doc3, saved, line) {
          if (saved instanceof SavedContext) {
            return new Context(doc3, copyState(doc3.mode, saved.state), line, saved.lookAhead);
          } else {
            return new Context(doc3, copyState(doc3.mode, saved), line);
          }
        };
        Context.prototype.save = function(copy2) {
          var state = copy2 !== false ? copyState(this.doc.mode, this.state) : this.state;
          return this.maxLookAhead > 0 ? new SavedContext(state, this.maxLookAhead) : state;
        };
        function highlightLine(cm, line, context, forceToEnd) {
          var st = [cm.state.modeGen], lineClasses = {};
          runMode(
            cm,
            line.text,
            cm.doc.mode,
            context,
            function(end, style) {
              return st.push(end, style);
            },
            lineClasses,
            forceToEnd
          );
          var state = context.state;
          var loop = function(o2) {
            context.baseTokens = st;
            var overlay = cm.state.overlays[o2], i2 = 1, at = 0;
            context.state = true;
            runMode(cm, line.text, overlay.mode, context, function(end, style) {
              var start = i2;
              while (at < end) {
                var i_end = st[i2];
                if (i_end > end) {
                  st.splice(i2, 1, end, st[i2 + 1], i_end);
                }
                i2 += 2;
                at = Math.min(end, i_end);
              }
              if (!style) {
                return;
              }
              if (overlay.opaque) {
                st.splice(start, i2 - start, end, "overlay " + style);
                i2 = start + 2;
              } else {
                for (; start < i2; start += 2) {
                  var cur = st[start + 1];
                  st[start + 1] = (cur ? cur + " " : "") + "overlay " + style;
                }
              }
            }, lineClasses);
            context.state = state;
            context.baseTokens = null;
            context.baseTokenPos = 1;
          };
          for (var o = 0; o < cm.state.overlays.length; ++o) loop(o);
          return { styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null };
        }
        function getLineStyles(cm, line, updateFrontier) {
          if (!line.styles || line.styles[0] != cm.state.modeGen) {
            var context = getContextBefore(cm, lineNo(line));
            var resetState = line.text.length > cm.options.maxHighlightLength && copyState(cm.doc.mode, context.state);
            var result = highlightLine(cm, line, context);
            if (resetState) {
              context.state = resetState;
            }
            line.stateAfter = context.save(!resetState);
            line.styles = result.styles;
            if (result.classes) {
              line.styleClasses = result.classes;
            } else if (line.styleClasses) {
              line.styleClasses = null;
            }
            if (updateFrontier === cm.doc.highlightFrontier) {
              cm.doc.modeFrontier = Math.max(cm.doc.modeFrontier, ++cm.doc.highlightFrontier);
            }
          }
          return line.styles;
        }
        function getContextBefore(cm, n, precise) {
          var doc3 = cm.doc, display = cm.display;
          if (!doc3.mode.startState) {
            return new Context(doc3, true, n);
          }
          var start = findStartLine(cm, n, precise);
          var saved = start > doc3.first && getLine(doc3, start - 1).stateAfter;
          var context = saved ? Context.fromSaved(doc3, saved, start) : new Context(doc3, startState(doc3.mode), start);
          doc3.iter(start, n, function(line) {
            processLine(cm, line.text, context);
            var pos = context.line;
            line.stateAfter = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo ? context.save() : null;
            context.nextLine();
          });
          if (precise) {
            doc3.modeFrontier = context.line;
          }
          return context;
        }
        function processLine(cm, text2, context, startAt) {
          var mode = cm.doc.mode;
          var stream = new StringStream(text2, cm.options.tabSize, context);
          stream.start = stream.pos = startAt || 0;
          if (text2 == "") {
            callBlankLine(mode, context.state);
          }
          while (!stream.eol()) {
            readToken(mode, stream, context.state);
            stream.start = stream.pos;
          }
        }
        function callBlankLine(mode, state) {
          if (mode.blankLine) {
            return mode.blankLine(state);
          }
          if (!mode.innerMode) {
            return;
          }
          var inner = innerMode(mode, state);
          if (inner.mode.blankLine) {
            return inner.mode.blankLine(inner.state);
          }
        }
        function readToken(mode, stream, state, inner) {
          for (var i2 = 0; i2 < 10; i2++) {
            if (inner) {
              inner[0] = innerMode(mode, state).mode;
            }
            var style = mode.token(stream, state);
            if (stream.pos > stream.start) {
              return style;
            }
          }
          throw new Error("Mode " + mode.name + " failed to advance stream.");
        }
        var Token = function(stream, type, state) {
          this.start = stream.start;
          this.end = stream.pos;
          this.string = stream.current();
          this.type = type || null;
          this.state = state;
        };
        function takeToken(cm, pos, precise, asArray) {
          var doc3 = cm.doc, mode = doc3.mode, style;
          pos = clipPos(doc3, pos);
          var line = getLine(doc3, pos.line), context = getContextBefore(cm, pos.line, precise);
          var stream = new StringStream(line.text, cm.options.tabSize, context), tokens;
          if (asArray) {
            tokens = [];
          }
          while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
            stream.start = stream.pos;
            style = readToken(mode, stream, context.state);
            if (asArray) {
              tokens.push(new Token(stream, style, copyState(doc3.mode, context.state)));
            }
          }
          return asArray ? tokens : new Token(stream, style, context.state);
        }
        function extractLineClasses(type, output) {
          if (type) {
            for (; ; ) {
              var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
              if (!lineClass) {
                break;
              }
              type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
              var prop2 = lineClass[1] ? "bgClass" : "textClass";
              if (output[prop2] == null) {
                output[prop2] = lineClass[2];
              } else if (!new RegExp("(?:^|\\s)" + lineClass[2] + "(?:$|\\s)").test(output[prop2])) {
                output[prop2] += " " + lineClass[2];
              }
            }
          }
          return type;
        }
        function runMode(cm, text2, mode, context, f, lineClasses, forceToEnd) {
          var flattenSpans = mode.flattenSpans;
          if (flattenSpans == null) {
            flattenSpans = cm.options.flattenSpans;
          }
          var curStart = 0, curStyle = null;
          var stream = new StringStream(text2, cm.options.tabSize, context), style;
          var inner = cm.options.addModeClass && [null];
          if (text2 == "") {
            extractLineClasses(callBlankLine(mode, context.state), lineClasses);
          }
          while (!stream.eol()) {
            if (stream.pos > cm.options.maxHighlightLength) {
              flattenSpans = false;
              if (forceToEnd) {
                processLine(cm, text2, context, stream.pos);
              }
              stream.pos = text2.length;
              style = null;
            } else {
              style = extractLineClasses(readToken(mode, stream, context.state, inner), lineClasses);
            }
            if (inner) {
              var mName = inner[0].name;
              if (mName) {
                style = "m-" + (style ? mName + " " + style : mName);
              }
            }
            if (!flattenSpans || curStyle != style) {
              while (curStart < stream.start) {
                curStart = Math.min(stream.start, curStart + 5e3);
                f(curStart, curStyle);
              }
              curStyle = style;
            }
            stream.start = stream.pos;
          }
          while (curStart < stream.pos) {
            var pos = Math.min(stream.pos, curStart + 5e3);
            f(pos, curStyle);
            curStart = pos;
          }
        }
        function findStartLine(cm, n, precise) {
          var minindent, minline, doc3 = cm.doc;
          var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1e3 : 100);
          for (var search = n; search > lim; --search) {
            if (search <= doc3.first) {
              return doc3.first;
            }
            var line = getLine(doc3, search - 1), after = line.stateAfter;
            if (after && (!precise || search + (after instanceof SavedContext ? after.lookAhead : 0) <= doc3.modeFrontier)) {
              return search;
            }
            var indented = countColumn(line.text, null, cm.options.tabSize);
            if (minline == null || minindent > indented) {
              minline = search - 1;
              minindent = indented;
            }
          }
          return minline;
        }
        function retreatFrontier(doc3, n) {
          doc3.modeFrontier = Math.min(doc3.modeFrontier, n);
          if (doc3.highlightFrontier < n - 10) {
            return;
          }
          var start = doc3.first;
          for (var line = n - 1; line > start; line--) {
            var saved = getLine(doc3, line).stateAfter;
            if (saved && (!(saved instanceof SavedContext) || line + saved.lookAhead < n)) {
              start = line + 1;
              break;
            }
          }
          doc3.highlightFrontier = Math.min(doc3.highlightFrontier, start);
        }
        var sawReadOnlySpans = false, sawCollapsedSpans = false;
        function seeReadOnlySpans() {
          sawReadOnlySpans = true;
        }
        function seeCollapsedSpans() {
          sawCollapsedSpans = true;
        }
        function MarkedSpan(marker, from2, to) {
          this.marker = marker;
          this.from = from2;
          this.to = to;
        }
        function getMarkedSpanFor(spans, marker) {
          if (spans) {
            for (var i2 = 0; i2 < spans.length; ++i2) {
              var span = spans[i2];
              if (span.marker == marker) {
                return span;
              }
            }
          }
        }
        function removeMarkedSpan(spans, span) {
          var r;
          for (var i2 = 0; i2 < spans.length; ++i2) {
            if (spans[i2] != span) {
              (r || (r = [])).push(spans[i2]);
            }
          }
          return r;
        }
        function addMarkedSpan(line, span, op) {
          var inThisOp = op && window.WeakSet && (op.markedSpans || (op.markedSpans = /* @__PURE__ */ new WeakSet()));
          if (inThisOp && line.markedSpans && inThisOp.has(line.markedSpans)) {
            line.markedSpans.push(span);
          } else {
            line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
            if (inThisOp) {
              inThisOp.add(line.markedSpans);
            }
          }
          span.marker.attachLine(line);
        }
        function markedSpansBefore(old, startCh, isInsert) {
          var nw;
          if (old) {
            for (var i2 = 0; i2 < old.length; ++i2) {
              var span = old[i2], marker = span.marker;
              var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
              if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
                var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
                (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
              }
            }
          }
          return nw;
        }
        function markedSpansAfter(old, endCh, isInsert) {
          var nw;
          if (old) {
            for (var i2 = 0; i2 < old.length; ++i2) {
              var span = old[i2], marker = span.marker;
              var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
              if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
                var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
                (nw || (nw = [])).push(new MarkedSpan(
                  marker,
                  startsBefore ? null : span.from - endCh,
                  span.to == null ? null : span.to - endCh
                ));
              }
            }
          }
          return nw;
        }
        function stretchSpansOverChange(doc3, change) {
          if (change.full) {
            return null;
          }
          var oldFirst = isLine(doc3, change.from.line) && getLine(doc3, change.from.line).markedSpans;
          var oldLast = isLine(doc3, change.to.line) && getLine(doc3, change.to.line).markedSpans;
          if (!oldFirst && !oldLast) {
            return null;
          }
          var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
          var first = markedSpansBefore(oldFirst, startCh, isInsert);
          var last2 = markedSpansAfter(oldLast, endCh, isInsert);
          var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
          if (first) {
            for (var i2 = 0; i2 < first.length; ++i2) {
              var span = first[i2];
              if (span.to == null) {
                var found = getMarkedSpanFor(last2, span.marker);
                if (!found) {
                  span.to = startCh;
                } else if (sameLine) {
                  span.to = found.to == null ? null : found.to + offset;
                }
              }
            }
          }
          if (last2) {
            for (var i$12 = 0; i$12 < last2.length; ++i$12) {
              var span$1 = last2[i$12];
              if (span$1.to != null) {
                span$1.to += offset;
              }
              if (span$1.from == null) {
                var found$1 = getMarkedSpanFor(first, span$1.marker);
                if (!found$1) {
                  span$1.from = offset;
                  if (sameLine) {
                    (first || (first = [])).push(span$1);
                  }
                }
              } else {
                span$1.from += offset;
                if (sameLine) {
                  (first || (first = [])).push(span$1);
                }
              }
            }
          }
          if (first) {
            first = clearEmptySpans(first);
          }
          if (last2 && last2 != first) {
            last2 = clearEmptySpans(last2);
          }
          var newMarkers = [first];
          if (!sameLine) {
            var gap = change.text.length - 2, gapMarkers;
            if (gap > 0 && first) {
              for (var i$22 = 0; i$22 < first.length; ++i$22) {
                if (first[i$22].to == null) {
                  (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i$22].marker, null, null));
                }
              }
            }
            for (var i$3 = 0; i$3 < gap; ++i$3) {
              newMarkers.push(gapMarkers);
            }
            newMarkers.push(last2);
          }
          return newMarkers;
        }
        function clearEmptySpans(spans) {
          for (var i2 = 0; i2 < spans.length; ++i2) {
            var span = spans[i2];
            if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false) {
              spans.splice(i2--, 1);
            }
          }
          if (!spans.length) {
            return null;
          }
          return spans;
        }
        function removeReadOnlyRanges(doc3, from2, to) {
          var markers = null;
          doc3.iter(from2.line, to.line + 1, function(line) {
            if (line.markedSpans) {
              for (var i3 = 0; i3 < line.markedSpans.length; ++i3) {
                var mark = line.markedSpans[i3].marker;
                if (mark.readOnly && (!markers || indexOf(markers, mark) == -1)) {
                  (markers || (markers = [])).push(mark);
                }
              }
            }
          });
          if (!markers) {
            return null;
          }
          var parts = [{ from: from2, to }];
          for (var i2 = 0; i2 < markers.length; ++i2) {
            var mk = markers[i2], m = mk.find(0);
            for (var j = 0; j < parts.length; ++j) {
              var p = parts[j];
              if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) {
                continue;
              }
              var newParts = [j, 1], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
              if (dfrom < 0 || !mk.inclusiveLeft && !dfrom) {
                newParts.push({ from: p.from, to: m.from });
              }
              if (dto > 0 || !mk.inclusiveRight && !dto) {
                newParts.push({ from: m.to, to: p.to });
              }
              parts.splice.apply(parts, newParts);
              j += newParts.length - 3;
            }
          }
          return parts;
        }
        function detachMarkedSpans(line) {
          var spans = line.markedSpans;
          if (!spans) {
            return;
          }
          for (var i2 = 0; i2 < spans.length; ++i2) {
            spans[i2].marker.detachLine(line);
          }
          line.markedSpans = null;
        }
        function attachMarkedSpans(line, spans) {
          if (!spans) {
            return;
          }
          for (var i2 = 0; i2 < spans.length; ++i2) {
            spans[i2].marker.attachLine(line);
          }
          line.markedSpans = spans;
        }
        function extraLeft(marker) {
          return marker.inclusiveLeft ? -1 : 0;
        }
        function extraRight(marker) {
          return marker.inclusiveRight ? 1 : 0;
        }
        function compareCollapsedMarkers(a, b) {
          var lenDiff = a.lines.length - b.lines.length;
          if (lenDiff != 0) {
            return lenDiff;
          }
          var aPos = a.find(), bPos = b.find();
          var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
          if (fromCmp) {
            return -fromCmp;
          }
          var toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
          if (toCmp) {
            return toCmp;
          }
          return b.id - a.id;
        }
        function collapsedSpanAtSide(line, start) {
          var sps = sawCollapsedSpans && line.markedSpans, found;
          if (sps) {
            for (var sp = void 0, i2 = 0; i2 < sps.length; ++i2) {
              sp = sps[i2];
              if (sp.marker.collapsed && (start ? sp.from : sp.to) == null && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) {
                found = sp.marker;
              }
            }
          }
          return found;
        }
        function collapsedSpanAtStart(line) {
          return collapsedSpanAtSide(line, true);
        }
        function collapsedSpanAtEnd(line) {
          return collapsedSpanAtSide(line, false);
        }
        function collapsedSpanAround(line, ch) {
          var sps = sawCollapsedSpans && line.markedSpans, found;
          if (sps) {
            for (var i2 = 0; i2 < sps.length; ++i2) {
              var sp = sps[i2];
              if (sp.marker.collapsed && (sp.from == null || sp.from < ch) && (sp.to == null || sp.to > ch) && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) {
                found = sp.marker;
              }
            }
          }
          return found;
        }
        function conflictingCollapsedRange(doc3, lineNo2, from2, to, marker) {
          var line = getLine(doc3, lineNo2);
          var sps = sawCollapsedSpans && line.markedSpans;
          if (sps) {
            for (var i2 = 0; i2 < sps.length; ++i2) {
              var sp = sps[i2];
              if (!sp.marker.collapsed) {
                continue;
              }
              var found = sp.marker.find(0);
              var fromCmp = cmp(found.from, from2) || extraLeft(sp.marker) - extraLeft(marker);
              var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
              if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) {
                continue;
              }
              if (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.to, from2) >= 0 : cmp(found.to, from2) > 0) || fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.from, to) <= 0 : cmp(found.from, to) < 0)) {
                return true;
              }
            }
          }
        }
        function visualLine(line) {
          var merged;
          while (merged = collapsedSpanAtStart(line)) {
            line = merged.find(-1, true).line;
          }
          return line;
        }
        function visualLineEnd(line) {
          var merged;
          while (merged = collapsedSpanAtEnd(line)) {
            line = merged.find(1, true).line;
          }
          return line;
        }
        function visualLineContinued(line) {
          var merged, lines;
          while (merged = collapsedSpanAtEnd(line)) {
            line = merged.find(1, true).line;
            (lines || (lines = [])).push(line);
          }
          return lines;
        }
        function visualLineNo(doc3, lineN) {
          var line = getLine(doc3, lineN), vis = visualLine(line);
          if (line == vis) {
            return lineN;
          }
          return lineNo(vis);
        }
        function visualLineEndNo(doc3, lineN) {
          if (lineN > doc3.lastLine()) {
            return lineN;
          }
          var line = getLine(doc3, lineN), merged;
          if (!lineIsHidden(doc3, line)) {
            return lineN;
          }
          while (merged = collapsedSpanAtEnd(line)) {
            line = merged.find(1, true).line;
          }
          return lineNo(line) + 1;
        }
        function lineIsHidden(doc3, line) {
          var sps = sawCollapsedSpans && line.markedSpans;
          if (sps) {
            for (var sp = void 0, i2 = 0; i2 < sps.length; ++i2) {
              sp = sps[i2];
              if (!sp.marker.collapsed) {
                continue;
              }
              if (sp.from == null) {
                return true;
              }
              if (sp.marker.widgetNode) {
                continue;
              }
              if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc3, line, sp)) {
                return true;
              }
            }
          }
        }
        function lineIsHiddenInner(doc3, line, span) {
          if (span.to == null) {
            var end = span.marker.find(1, true);
            return lineIsHiddenInner(doc3, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
          }
          if (span.marker.inclusiveRight && span.to == line.text.length) {
            return true;
          }
          for (var sp = void 0, i2 = 0; i2 < line.markedSpans.length; ++i2) {
            sp = line.markedSpans[i2];
            if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to && (sp.to == null || sp.to != span.from) && (sp.marker.inclusiveLeft || span.marker.inclusiveRight) && lineIsHiddenInner(doc3, line, sp)) {
              return true;
            }
          }
        }
        function heightAtLine(lineObj) {
          lineObj = visualLine(lineObj);
          var h = 0, chunk = lineObj.parent;
          for (var i2 = 0; i2 < chunk.lines.length; ++i2) {
            var line = chunk.lines[i2];
            if (line == lineObj) {
              break;
            } else {
              h += line.height;
            }
          }
          for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
            for (var i$12 = 0; i$12 < p.children.length; ++i$12) {
              var cur = p.children[i$12];
              if (cur == chunk) {
                break;
              } else {
                h += cur.height;
              }
            }
          }
          return h;
        }
        function lineLength(line) {
          if (line.height == 0) {
            return 0;
          }
          var len = line.text.length, merged, cur = line;
          while (merged = collapsedSpanAtStart(cur)) {
            var found = merged.find(0, true);
            cur = found.from.line;
            len += found.from.ch - found.to.ch;
          }
          cur = line;
          while (merged = collapsedSpanAtEnd(cur)) {
            var found$1 = merged.find(0, true);
            len -= cur.text.length - found$1.from.ch;
            cur = found$1.to.line;
            len += cur.text.length - found$1.to.ch;
          }
          return len;
        }
        function findMaxLine(cm) {
          var d = cm.display, doc3 = cm.doc;
          d.maxLine = getLine(doc3, doc3.first);
          d.maxLineLength = lineLength(d.maxLine);
          d.maxLineChanged = true;
          doc3.iter(function(line) {
            var len = lineLength(line);
            if (len > d.maxLineLength) {
              d.maxLineLength = len;
              d.maxLine = line;
            }
          });
        }
        var Line = function(text2, markedSpans, estimateHeight2) {
          this.text = text2;
          attachMarkedSpans(this, markedSpans);
          this.height = estimateHeight2 ? estimateHeight2(this) : 1;
        };
        Line.prototype.lineNo = function() {
          return lineNo(this);
        };
        eventMixin(Line);
        function updateLine(line, text2, markedSpans, estimateHeight2) {
          line.text = text2;
          if (line.stateAfter) {
            line.stateAfter = null;
          }
          if (line.styles) {
            line.styles = null;
          }
          if (line.order != null) {
            line.order = null;
          }
          detachMarkedSpans(line);
          attachMarkedSpans(line, markedSpans);
          var estHeight = estimateHeight2 ? estimateHeight2(line) : 1;
          if (estHeight != line.height) {
            updateLineHeight(line, estHeight);
          }
        }
        function cleanUpLine(line) {
          line.parent = null;
          detachMarkedSpans(line);
        }
        var styleToClassCache = {}, styleToClassCacheWithMode = {};
        function interpretTokenStyle(style, options) {
          if (!style || /^\s*$/.test(style)) {
            return null;
          }
          var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
          return cache[style] || (cache[style] = style.replace(/\S+/g, "cm-$&"));
        }
        function buildLineContent(cm, lineView) {
          var content = eltP("span", null, null, webkit ? "padding-right: .1px" : null);
          var builder = {
            pre: eltP("pre", [content], "CodeMirror-line"),
            content,
            col: 0,
            pos: 0,
            cm,
            trailingSpace: false,
            splitSpaces: cm.getOption("lineWrapping")
          };
          lineView.measure = {};
          for (var i2 = 0; i2 <= (lineView.rest ? lineView.rest.length : 0); i2++) {
            var line = i2 ? lineView.rest[i2 - 1] : lineView.line, order = void 0;
            builder.pos = 0;
            builder.addToken = buildToken;
            if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line, cm.doc.direction))) {
              builder.addToken = buildTokenBadBidi(builder.addToken, order);
            }
            builder.map = [];
            var allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
            insertLineContent(line, builder, getLineStyles(cm, line, allowFrontierUpdate));
            if (line.styleClasses) {
              if (line.styleClasses.bgClass) {
                builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
              }
              if (line.styleClasses.textClass) {
                builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
              }
            }
            if (builder.map.length == 0) {
              builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure)));
            }
            if (i2 == 0) {
              lineView.measure.map = builder.map;
              lineView.measure.cache = {};
            } else {
              (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
              (lineView.measure.caches || (lineView.measure.caches = [])).push({});
            }
          }
          if (webkit) {
            var last2 = builder.content.lastChild;
            if (/\bcm-tab\b/.test(last2.className) || last2.querySelector && last2.querySelector(".cm-tab")) {
              builder.content.className = "cm-tab-wrap-hack";
            }
          }
          signal(cm, "renderLine", cm, lineView.line, builder.pre);
          if (builder.pre.className) {
            builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");
          }
          return builder;
        }
        function defaultSpecialCharPlaceholder(ch) {
          var token = elt("span", "\u2022", "cm-invalidchar");
          token.title = "\\u" + ch.charCodeAt(0).toString(16);
          token.setAttribute("aria-label", token.title);
          return token;
        }
        function buildToken(builder, text2, style, startStyle, endStyle, css, attributes) {
          if (!text2) {
            return;
          }
          var displayText = builder.splitSpaces ? splitSpaces(text2, builder.trailingSpace) : text2;
          var special = builder.cm.state.specialChars, mustWrap = false;
          var content;
          if (!special.test(text2)) {
            builder.col += text2.length;
            content = document.createTextNode(displayText);
            builder.map.push(builder.pos, builder.pos + text2.length, content);
            if (ie && ie_version < 9) {
              mustWrap = true;
            }
            builder.pos += text2.length;
          } else {
            content = document.createDocumentFragment();
            var pos = 0;
            while (true) {
              special.lastIndex = pos;
              var m = special.exec(text2);
              var skipped = m ? m.index - pos : text2.length - pos;
              if (skipped) {
                var txt = document.createTextNode(displayText.slice(pos, pos + skipped));
                if (ie && ie_version < 9) {
                  content.appendChild(elt("span", [txt]));
                } else {
                  content.appendChild(txt);
                }
                builder.map.push(builder.pos, builder.pos + skipped, txt);
                builder.col += skipped;
                builder.pos += skipped;
              }
              if (!m) {
                break;
              }
              pos += skipped + 1;
              var txt$1 = void 0;
              if (m[0] == "	") {
                var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
                txt$1 = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
                txt$1.setAttribute("role", "presentation");
                txt$1.setAttribute("cm-text", "	");
                builder.col += tabWidth;
              } else if (m[0] == "\r" || m[0] == "\n") {
                txt$1 = content.appendChild(elt("span", m[0] == "\r" ? "\u240D" : "\u2424", "cm-invalidchar"));
                txt$1.setAttribute("cm-text", m[0]);
                builder.col += 1;
              } else {
                txt$1 = builder.cm.options.specialCharPlaceholder(m[0]);
                txt$1.setAttribute("cm-text", m[0]);
                if (ie && ie_version < 9) {
                  content.appendChild(elt("span", [txt$1]));
                } else {
                  content.appendChild(txt$1);
                }
                builder.col += 1;
              }
              builder.map.push(builder.pos, builder.pos + 1, txt$1);
              builder.pos++;
            }
          }
          builder.trailingSpace = displayText.charCodeAt(text2.length - 1) == 32;
          if (style || startStyle || endStyle || mustWrap || css || attributes) {
            var fullStyle = style || "";
            if (startStyle) {
              fullStyle += startStyle;
            }
            if (endStyle) {
              fullStyle += endStyle;
            }
            var token = elt("span", [content], fullStyle, css);
            if (attributes) {
              for (var attr in attributes) {
                if (attributes.hasOwnProperty(attr) && attr != "style" && attr != "class") {
                  token.setAttribute(attr, attributes[attr]);
                }
              }
            }
            return builder.content.appendChild(token);
          }
          builder.content.appendChild(content);
        }
        function splitSpaces(text2, trailingBefore) {
          if (text2.length > 1 && !/  /.test(text2)) {
            return text2;
          }
          var spaceBefore = trailingBefore, result = "";
          for (var i2 = 0; i2 < text2.length; i2++) {
            var ch = text2.charAt(i2);
            if (ch == " " && spaceBefore && (i2 == text2.length - 1 || text2.charCodeAt(i2 + 1) == 32)) {
              ch = "\xA0";
            }
            result += ch;
            spaceBefore = ch == " ";
          }
          return result;
        }
        function buildTokenBadBidi(inner, order) {
          return function(builder, text2, style, startStyle, endStyle, css, attributes) {
            style = style ? style + " cm-force-border" : "cm-force-border";
            var start = builder.pos, end = start + text2.length;
            for (; ; ) {
              var part = void 0;
              for (var i2 = 0; i2 < order.length; i2++) {
                part = order[i2];
                if (part.to > start && part.from <= start) {
                  break;
                }
              }
              if (part.to >= end) {
                return inner(builder, text2, style, startStyle, endStyle, css, attributes);
              }
              inner(builder, text2.slice(0, part.to - start), style, startStyle, null, css, attributes);
              startStyle = null;
              text2 = text2.slice(part.to - start);
              start = part.to;
            }
          };
        }
        function buildCollapsedSpan(builder, size2, marker, ignoreWidget) {
          var widget = !ignoreWidget && marker.widgetNode;
          if (widget) {
            builder.map.push(builder.pos, builder.pos + size2, widget);
          }
          if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
            if (!widget) {
              widget = builder.content.appendChild(document.createElement("span"));
            }
            widget.setAttribute("cm-marker", marker.id);
          }
          if (widget) {
            builder.cm.display.input.setUneditable(widget);
            builder.content.appendChild(widget);
          }
          builder.pos += size2;
          builder.trailingSpace = false;
        }
        function insertLineContent(line, builder, styles) {
          var spans = line.markedSpans, allText = line.text, at = 0;
          if (!spans) {
            for (var i$12 = 1; i$12 < styles.length; i$12 += 2) {
              builder.addToken(builder, allText.slice(at, at = styles[i$12]), interpretTokenStyle(styles[i$12 + 1], builder.cm.options));
            }
            return;
          }
          var len = allText.length, pos = 0, i2 = 1, text2 = "", style, css;
          var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, collapsed, attributes;
          for (; ; ) {
            if (nextChange == pos) {
              spanStyle = spanEndStyle = spanStartStyle = css = "";
              attributes = null;
              collapsed = null;
              nextChange = Infinity;
              var foundBookmarks = [], endStyles = void 0;
              for (var j = 0; j < spans.length; ++j) {
                var sp = spans[j], m = sp.marker;
                if (m.type == "bookmark" && sp.from == pos && m.widgetNode) {
                  foundBookmarks.push(m);
                } else if (sp.from <= pos && (sp.to == null || sp.to > pos || m.collapsed && sp.to == pos && sp.from == pos)) {
                  if (sp.to != null && sp.to != pos && nextChange > sp.to) {
                    nextChange = sp.to;
                    spanEndStyle = "";
                  }
                  if (m.className) {
                    spanStyle += " " + m.className;
                  }
                  if (m.css) {
                    css = (css ? css + ";" : "") + m.css;
                  }
                  if (m.startStyle && sp.from == pos) {
                    spanStartStyle += " " + m.startStyle;
                  }
                  if (m.endStyle && sp.to == nextChange) {
                    (endStyles || (endStyles = [])).push(m.endStyle, sp.to);
                  }
                  if (m.title) {
                    (attributes || (attributes = {})).title = m.title;
                  }
                  if (m.attributes) {
                    for (var attr in m.attributes) {
                      (attributes || (attributes = {}))[attr] = m.attributes[attr];
                    }
                  }
                  if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0)) {
                    collapsed = sp;
                  }
                } else if (sp.from > pos && nextChange > sp.from) {
                  nextChange = sp.from;
                }
              }
              if (endStyles) {
                for (var j$1 = 0; j$1 < endStyles.length; j$1 += 2) {
                  if (endStyles[j$1 + 1] == nextChange) {
                    spanEndStyle += " " + endStyles[j$1];
                  }
                }
              }
              if (!collapsed || collapsed.from == pos) {
                for (var j$2 = 0; j$2 < foundBookmarks.length; ++j$2) {
                  buildCollapsedSpan(builder, 0, foundBookmarks[j$2]);
                }
              }
              if (collapsed && (collapsed.from || 0) == pos) {
                buildCollapsedSpan(
                  builder,
                  (collapsed.to == null ? len + 1 : collapsed.to) - pos,
                  collapsed.marker,
                  collapsed.from == null
                );
                if (collapsed.to == null) {
                  return;
                }
                if (collapsed.to == pos) {
                  collapsed = false;
                }
              }
            }
            if (pos >= len) {
              break;
            }
            var upto = Math.min(len, nextChange);
            while (true) {
              if (text2) {
                var end = pos + text2.length;
                if (!collapsed) {
                  var tokenText = end > upto ? text2.slice(0, upto - pos) : text2;
                  builder.addToken(
                    builder,
                    tokenText,
                    style ? style + spanStyle : spanStyle,
                    spanStartStyle,
                    pos + tokenText.length == nextChange ? spanEndStyle : "",
                    css,
                    attributes
                  );
                }
                if (end >= upto) {
                  text2 = text2.slice(upto - pos);
                  pos = upto;
                  break;
                }
                pos = end;
                spanStartStyle = "";
              }
              text2 = allText.slice(at, at = styles[i2++]);
              style = interpretTokenStyle(styles[i2++], builder.cm.options);
            }
          }
        }
        function LineView(doc3, line, lineN) {
          this.line = line;
          this.rest = visualLineContinued(line);
          this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
          this.node = this.text = null;
          this.hidden = lineIsHidden(doc3, line);
        }
        function buildViewArray(cm, from2, to) {
          var array = [], nextPos;
          for (var pos = from2; pos < to; pos = nextPos) {
            var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
            nextPos = pos + view.size;
            array.push(view);
          }
          return array;
        }
        var operationGroup = null;
        function pushOperation(op) {
          if (operationGroup) {
            operationGroup.ops.push(op);
          } else {
            op.ownsGroup = operationGroup = {
              ops: [op],
              delayedCallbacks: []
            };
          }
        }
        function fireCallbacksForOps(group) {
          var callbacks = group.delayedCallbacks, i2 = 0;
          do {
            for (; i2 < callbacks.length; i2++) {
              callbacks[i2].call(null);
            }
            for (var j = 0; j < group.ops.length; j++) {
              var op = group.ops[j];
              if (op.cursorActivityHandlers) {
                while (op.cursorActivityCalled < op.cursorActivityHandlers.length) {
                  op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
                }
              }
            }
          } while (i2 < callbacks.length);
        }
        function finishOperation(op, endCb) {
          var group = op.ownsGroup;
          if (!group) {
            return;
          }
          try {
            fireCallbacksForOps(group);
          } finally {
            operationGroup = null;
            endCb(group);
          }
        }
        var orphanDelayedCallbacks = null;
        function signalLater(emitter, type) {
          var arr = getHandlers(emitter, type);
          if (!arr.length) {
            return;
          }
          var args2 = Array.prototype.slice.call(arguments, 2), list;
          if (operationGroup) {
            list = operationGroup.delayedCallbacks;
          } else if (orphanDelayedCallbacks) {
            list = orphanDelayedCallbacks;
          } else {
            list = orphanDelayedCallbacks = [];
            setTimeout(fireOrphanDelayed, 0);
          }
          var loop = function(i3) {
            list.push(function() {
              return arr[i3].apply(null, args2);
            });
          };
          for (var i2 = 0; i2 < arr.length; ++i2)
            loop(i2);
        }
        function fireOrphanDelayed() {
          var delayed = orphanDelayedCallbacks;
          orphanDelayedCallbacks = null;
          for (var i2 = 0; i2 < delayed.length; ++i2) {
            delayed[i2]();
          }
        }
        function updateLineForChanges(cm, lineView, lineN, dims) {
          for (var j = 0; j < lineView.changes.length; j++) {
            var type = lineView.changes[j];
            if (type == "text") {
              updateLineText(cm, lineView);
            } else if (type == "gutter") {
              updateLineGutter(cm, lineView, lineN, dims);
            } else if (type == "class") {
              updateLineClasses(cm, lineView);
            } else if (type == "widget") {
              updateLineWidgets(cm, lineView, dims);
            }
          }
          lineView.changes = null;
        }
        function ensureLineWrapped(lineView) {
          if (lineView.node == lineView.text) {
            lineView.node = elt("div", null, null, "position: relative");
            if (lineView.text.parentNode) {
              lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
            }
            lineView.node.appendChild(lineView.text);
            if (ie && ie_version < 8) {
              lineView.node.style.zIndex = 2;
            }
          }
          return lineView.node;
        }
        function updateLineBackground(cm, lineView) {
          var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
          if (cls) {
            cls += " CodeMirror-linebackground";
          }
          if (lineView.background) {
            if (cls) {
              lineView.background.className = cls;
            } else {
              lineView.background.parentNode.removeChild(lineView.background);
              lineView.background = null;
            }
          } else if (cls) {
            var wrap = ensureLineWrapped(lineView);
            lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
            cm.display.input.setUneditable(lineView.background);
          }
        }
        function getLineContent(cm, lineView) {
          var ext = cm.display.externalMeasured;
          if (ext && ext.line == lineView.line) {
            cm.display.externalMeasured = null;
            lineView.measure = ext.measure;
            return ext.built;
          }
          return buildLineContent(cm, lineView);
        }
        function updateLineText(cm, lineView) {
          var cls = lineView.text.className;
          var built = getLineContent(cm, lineView);
          if (lineView.text == lineView.node) {
            lineView.node = built.pre;
          }
          lineView.text.parentNode.replaceChild(built.pre, lineView.text);
          lineView.text = built.pre;
          if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
            lineView.bgClass = built.bgClass;
            lineView.textClass = built.textClass;
            updateLineClasses(cm, lineView);
          } else if (cls) {
            lineView.text.className = cls;
          }
        }
        function updateLineClasses(cm, lineView) {
          updateLineBackground(cm, lineView);
          if (lineView.line.wrapClass) {
            ensureLineWrapped(lineView).className = lineView.line.wrapClass;
          } else if (lineView.node != lineView.text) {
            lineView.node.className = "";
          }
          var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
          lineView.text.className = textClass || "";
        }
        function updateLineGutter(cm, lineView, lineN, dims) {
          if (lineView.gutter) {
            lineView.node.removeChild(lineView.gutter);
            lineView.gutter = null;
          }
          if (lineView.gutterBackground) {
            lineView.node.removeChild(lineView.gutterBackground);
            lineView.gutterBackground = null;
          }
          if (lineView.line.gutterClass) {
            var wrap = ensureLineWrapped(lineView);
            lineView.gutterBackground = elt(
              "div",
              null,
              "CodeMirror-gutter-background " + lineView.line.gutterClass,
              "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px; width: " + dims.gutterTotalWidth + "px"
            );
            cm.display.input.setUneditable(lineView.gutterBackground);
            wrap.insertBefore(lineView.gutterBackground, lineView.text);
          }
          var markers = lineView.line.gutterMarkers;
          if (cm.options.lineNumbers || markers) {
            var wrap$1 = ensureLineWrapped(lineView);
            var gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px");
            gutterWrap.setAttribute("aria-hidden", "true");
            cm.display.input.setUneditable(gutterWrap);
            wrap$1.insertBefore(gutterWrap, lineView.text);
            if (lineView.line.gutterClass) {
              gutterWrap.className += " " + lineView.line.gutterClass;
            }
            if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"])) {
              lineView.lineNumber = gutterWrap.appendChild(
                elt(
                  "div",
                  lineNumberFor(cm.options, lineN),
                  "CodeMirror-linenumber CodeMirror-gutter-elt",
                  "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + cm.display.lineNumInnerWidth + "px"
                )
              );
            }
            if (markers) {
              for (var k = 0; k < cm.display.gutterSpecs.length; ++k) {
                var id2 = cm.display.gutterSpecs[k].className, found = markers.hasOwnProperty(id2) && markers[id2];
                if (found) {
                  gutterWrap.appendChild(elt(
                    "div",
                    [found],
                    "CodeMirror-gutter-elt",
                    "left: " + dims.gutterLeft[id2] + "px; width: " + dims.gutterWidth[id2] + "px"
                  ));
                }
              }
            }
          }
        }
        function updateLineWidgets(cm, lineView, dims) {
          if (lineView.alignable) {
            lineView.alignable = null;
          }
          var isWidget = classTest("CodeMirror-linewidget");
          for (var node = lineView.node.firstChild, next = void 0; node; node = next) {
            next = node.nextSibling;
            if (isWidget.test(node.className)) {
              lineView.node.removeChild(node);
            }
          }
          insertLineWidgets(cm, lineView, dims);
        }
        function buildLineElement(cm, lineView, lineN, dims) {
          var built = getLineContent(cm, lineView);
          lineView.text = lineView.node = built.pre;
          if (built.bgClass) {
            lineView.bgClass = built.bgClass;
          }
          if (built.textClass) {
            lineView.textClass = built.textClass;
          }
          updateLineClasses(cm, lineView);
          updateLineGutter(cm, lineView, lineN, dims);
          insertLineWidgets(cm, lineView, dims);
          return lineView.node;
        }
        function insertLineWidgets(cm, lineView, dims) {
          insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
          if (lineView.rest) {
            for (var i2 = 0; i2 < lineView.rest.length; i2++) {
              insertLineWidgetsFor(cm, lineView.rest[i2], lineView, dims, false);
            }
          }
        }
        function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
          if (!line.widgets) {
            return;
          }
          var wrap = ensureLineWrapped(lineView);
          for (var i2 = 0, ws = line.widgets; i2 < ws.length; ++i2) {
            var widget = ws[i2], node = elt("div", [widget.node], "CodeMirror-linewidget" + (widget.className ? " " + widget.className : ""));
            if (!widget.handleMouseEvents) {
              node.setAttribute("cm-ignore-events", "true");
            }
            positionLineWidget(widget, node, lineView, dims);
            cm.display.input.setUneditable(node);
            if (allowAbove && widget.above) {
              wrap.insertBefore(node, lineView.gutter || lineView.text);
            } else {
              wrap.appendChild(node);
            }
            signalLater(widget, "redraw");
          }
        }
        function positionLineWidget(widget, node, lineView, dims) {
          if (widget.noHScroll) {
            (lineView.alignable || (lineView.alignable = [])).push(node);
            var width = dims.wrapperWidth;
            node.style.left = dims.fixedPos + "px";
            if (!widget.coverGutter) {
              width -= dims.gutterTotalWidth;
              node.style.paddingLeft = dims.gutterTotalWidth + "px";
            }
            node.style.width = width + "px";
          }
          if (widget.coverGutter) {
            node.style.zIndex = 5;
            node.style.position = "relative";
            if (!widget.noHScroll) {
              node.style.marginLeft = -dims.gutterTotalWidth + "px";
            }
          }
        }
        function widgetHeight(widget) {
          if (widget.height != null) {
            return widget.height;
          }
          var cm = widget.doc.cm;
          if (!cm) {
            return 0;
          }
          if (!contains(document.body, widget.node)) {
            var parentStyle = "position: relative;";
            if (widget.coverGutter) {
              parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;";
            }
            if (widget.noHScroll) {
              parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;";
            }
            removeChildrenAndAdd(cm.display.measure, elt("div", [widget.node], null, parentStyle));
          }
          return widget.height = widget.node.parentNode.offsetHeight;
        }
        function eventInWidget(display, e) {
          for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
            if (!n || n.nodeType == 1 && n.getAttribute("cm-ignore-events") == "true" || n.parentNode == display.sizer && n != display.mover) {
              return true;
            }
          }
        }
        function paddingTop(display) {
          return display.lineSpace.offsetTop;
        }
        function paddingVert(display) {
          return display.mover.offsetHeight - display.lineSpace.offsetHeight;
        }
        function paddingH(display) {
          if (display.cachedPaddingH) {
            return display.cachedPaddingH;
          }
          var e = removeChildrenAndAdd(display.measure, elt("pre", "x", "CodeMirror-line-like"));
          var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
          var data = { left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight) };
          if (!isNaN(data.left) && !isNaN(data.right)) {
            display.cachedPaddingH = data;
          }
          return data;
        }
        function scrollGap(cm) {
          return scrollerGap - cm.display.nativeBarWidth;
        }
        function displayWidth(cm) {
          return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
        }
        function displayHeight(cm) {
          return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
        }
        function ensureLineHeights(cm, lineView, rect) {
          var wrapping = cm.options.lineWrapping;
          var curWidth = wrapping && displayWidth(cm);
          if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
            var heights = lineView.measure.heights = [];
            if (wrapping) {
              lineView.measure.width = curWidth;
              var rects = lineView.text.firstChild.getClientRects();
              for (var i2 = 0; i2 < rects.length - 1; i2++) {
                var cur = rects[i2], next = rects[i2 + 1];
                if (Math.abs(cur.bottom - next.bottom) > 2) {
                  heights.push((cur.bottom + next.top) / 2 - rect.top);
                }
              }
            }
            heights.push(rect.bottom - rect.top);
          }
        }
        function mapFromLineView(lineView, line, lineN) {
          if (lineView.line == line) {
            return { map: lineView.measure.map, cache: lineView.measure.cache };
          }
          if (lineView.rest) {
            for (var i2 = 0; i2 < lineView.rest.length; i2++) {
              if (lineView.rest[i2] == line) {
                return { map: lineView.measure.maps[i2], cache: lineView.measure.caches[i2] };
              }
            }
            for (var i$12 = 0; i$12 < lineView.rest.length; i$12++) {
              if (lineNo(lineView.rest[i$12]) > lineN) {
                return { map: lineView.measure.maps[i$12], cache: lineView.measure.caches[i$12], before: true };
              }
            }
          }
        }
        function updateExternalMeasurement(cm, line) {
          line = visualLine(line);
          var lineN = lineNo(line);
          var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
          view.lineN = lineN;
          var built = view.built = buildLineContent(cm, view);
          view.text = built.pre;
          removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
          return view;
        }
        function measureChar(cm, line, ch, bias) {
          return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
        }
        function findViewForLine(cm, lineN) {
          if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo) {
            return cm.display.view[findViewIndex(cm, lineN)];
          }
          var ext = cm.display.externalMeasured;
          if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size) {
            return ext;
          }
        }
        function prepareMeasureForLine(cm, line) {
          var lineN = lineNo(line);
          var view = findViewForLine(cm, lineN);
          if (view && !view.text) {
            view = null;
          } else if (view && view.changes) {
            updateLineForChanges(cm, view, lineN, getDimensions(cm));
            cm.curOp.forceUpdate = true;
          }
          if (!view) {
            view = updateExternalMeasurement(cm, line);
          }
          var info = mapFromLineView(view, line, lineN);
          return {
            line,
            view,
            rect: null,
            map: info.map,
            cache: info.cache,
            before: info.before,
            hasHeights: false
          };
        }
        function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
          if (prepared.before) {
            ch = -1;
          }
          var key = ch + (bias || ""), found;
          if (prepared.cache.hasOwnProperty(key)) {
            found = prepared.cache[key];
          } else {
            if (!prepared.rect) {
              prepared.rect = prepared.view.text.getBoundingClientRect();
            }
            if (!prepared.hasHeights) {
              ensureLineHeights(cm, prepared.view, prepared.rect);
              prepared.hasHeights = true;
            }
            found = measureCharInner(cm, prepared, ch, bias);
            if (!found.bogus) {
              prepared.cache[key] = found;
            }
          }
          return {
            left: found.left,
            right: found.right,
            top: varHeight ? found.rtop : found.top,
            bottom: varHeight ? found.rbottom : found.bottom
          };
        }
        var nullRect = { left: 0, right: 0, top: 0, bottom: 0 };
        function nodeAndOffsetInLineMap(map4, ch, bias) {
          var node, start, end, collapse, mStart, mEnd;
          for (var i2 = 0; i2 < map4.length; i2 += 3) {
            mStart = map4[i2];
            mEnd = map4[i2 + 1];
            if (ch < mStart) {
              start = 0;
              end = 1;
              collapse = "left";
            } else if (ch < mEnd) {
              start = ch - mStart;
              end = start + 1;
            } else if (i2 == map4.length - 3 || ch == mEnd && map4[i2 + 3] > ch) {
              end = mEnd - mStart;
              start = end - 1;
              if (ch >= mEnd) {
                collapse = "right";
              }
            }
            if (start != null) {
              node = map4[i2 + 2];
              if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right")) {
                collapse = bias;
              }
              if (bias == "left" && start == 0) {
                while (i2 && map4[i2 - 2] == map4[i2 - 3] && map4[i2 - 1].insertLeft) {
                  node = map4[(i2 -= 3) + 2];
                  collapse = "left";
                }
              }
              if (bias == "right" && start == mEnd - mStart) {
                while (i2 < map4.length - 3 && map4[i2 + 3] == map4[i2 + 4] && !map4[i2 + 5].insertLeft) {
                  node = map4[(i2 += 3) + 2];
                  collapse = "right";
                }
              }
              break;
            }
          }
          return { node, start, end, collapse, coverStart: mStart, coverEnd: mEnd };
        }
        function getUsefulRect(rects, bias) {
          var rect = nullRect;
          if (bias == "left") {
            for (var i2 = 0; i2 < rects.length; i2++) {
              if ((rect = rects[i2]).left != rect.right) {
                break;
              }
            }
          } else {
            for (var i$12 = rects.length - 1; i$12 >= 0; i$12--) {
              if ((rect = rects[i$12]).left != rect.right) {
                break;
              }
            }
          }
          return rect;
        }
        function measureCharInner(cm, prepared, ch, bias) {
          var place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
          var node = place.node, start = place.start, end = place.end, collapse = place.collapse;
          var rect;
          if (node.nodeType == 3) {
            for (var i$12 = 0; i$12 < 4; i$12++) {
              while (start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start))) {
                --start;
              }
              while (place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end))) {
                ++end;
              }
              if (ie && ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart) {
                rect = node.parentNode.getBoundingClientRect();
              } else {
                rect = getUsefulRect(range(node, start, end).getClientRects(), bias);
              }
              if (rect.left || rect.right || start == 0) {
                break;
              }
              end = start;
              start = start - 1;
              collapse = "right";
            }
            if (ie && ie_version < 11) {
              rect = maybeUpdateRectForZooming(cm.display.measure, rect);
            }
          } else {
            if (start > 0) {
              collapse = bias = "right";
            }
            var rects;
            if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1) {
              rect = rects[bias == "right" ? rects.length - 1 : 0];
            } else {
              rect = node.getBoundingClientRect();
            }
          }
          if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
            var rSpan = node.parentNode.getClientRects()[0];
            if (rSpan) {
              rect = { left: rSpan.left, right: rSpan.left + charWidth(cm.display), top: rSpan.top, bottom: rSpan.bottom };
            } else {
              rect = nullRect;
            }
          }
          var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
          var mid = (rtop + rbot) / 2;
          var heights = prepared.view.measure.heights;
          var i2 = 0;
          for (; i2 < heights.length - 1; i2++) {
            if (mid < heights[i2]) {
              break;
            }
          }
          var top = i2 ? heights[i2 - 1] : 0, bot = heights[i2];
          var result = {
            left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
            right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
            top,
            bottom: bot
          };
          if (!rect.left && !rect.right) {
            result.bogus = true;
          }
          if (!cm.options.singleCursorHeightPerLine) {
            result.rtop = rtop;
            result.rbottom = rbot;
          }
          return result;
        }
        function maybeUpdateRectForZooming(measure, rect) {
          if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure)) {
            return rect;
          }
          var scaleX = screen.logicalXDPI / screen.deviceXDPI;
          var scaleY = screen.logicalYDPI / screen.deviceYDPI;
          return {
            left: rect.left * scaleX,
            right: rect.right * scaleX,
            top: rect.top * scaleY,
            bottom: rect.bottom * scaleY
          };
        }
        function clearLineMeasurementCacheFor(lineView) {
          if (lineView.measure) {
            lineView.measure.cache = {};
            lineView.measure.heights = null;
            if (lineView.rest) {
              for (var i2 = 0; i2 < lineView.rest.length; i2++) {
                lineView.measure.caches[i2] = {};
              }
            }
          }
        }
        function clearLineMeasurementCache(cm) {
          cm.display.externalMeasure = null;
          removeChildren(cm.display.lineMeasure);
          for (var i2 = 0; i2 < cm.display.view.length; i2++) {
            clearLineMeasurementCacheFor(cm.display.view[i2]);
          }
        }
        function clearCaches(cm) {
          clearLineMeasurementCache(cm);
          cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
          if (!cm.options.lineWrapping) {
            cm.display.maxLineChanged = true;
          }
          cm.display.lineNumChars = null;
        }
        function pageScrollX(doc3) {
          if (chrome && android) {
            return -(doc3.body.getBoundingClientRect().left - parseInt(getComputedStyle(doc3.body).marginLeft));
          }
          return doc3.defaultView.pageXOffset || (doc3.documentElement || doc3.body).scrollLeft;
        }
        function pageScrollY(doc3) {
          if (chrome && android) {
            return -(doc3.body.getBoundingClientRect().top - parseInt(getComputedStyle(doc3.body).marginTop));
          }
          return doc3.defaultView.pageYOffset || (doc3.documentElement || doc3.body).scrollTop;
        }
        function widgetTopHeight(lineObj) {
          var ref = visualLine(lineObj);
          var widgets = ref.widgets;
          var height = 0;
          if (widgets) {
            for (var i2 = 0; i2 < widgets.length; ++i2) {
              if (widgets[i2].above) {
                height += widgetHeight(widgets[i2]);
              }
            }
          }
          return height;
        }
        function intoCoordSystem(cm, lineObj, rect, context, includeWidgets) {
          if (!includeWidgets) {
            var height = widgetTopHeight(lineObj);
            rect.top += height;
            rect.bottom += height;
          }
          if (context == "line") {
            return rect;
          }
          if (!context) {
            context = "local";
          }
          var yOff = heightAtLine(lineObj);
          if (context == "local") {
            yOff += paddingTop(cm.display);
          } else {
            yOff -= cm.display.viewOffset;
          }
          if (context == "page" || context == "window") {
            var lOff = cm.display.lineSpace.getBoundingClientRect();
            yOff += lOff.top + (context == "window" ? 0 : pageScrollY(doc2(cm)));
            var xOff = lOff.left + (context == "window" ? 0 : pageScrollX(doc2(cm)));
            rect.left += xOff;
            rect.right += xOff;
          }
          rect.top += yOff;
          rect.bottom += yOff;
          return rect;
        }
        function fromCoordSystem(cm, coords, context) {
          if (context == "div") {
            return coords;
          }
          var left = coords.left, top = coords.top;
          if (context == "page") {
            left -= pageScrollX(doc2(cm));
            top -= pageScrollY(doc2(cm));
          } else if (context == "local" || !context) {
            var localBox = cm.display.sizer.getBoundingClientRect();
            left += localBox.left;
            top += localBox.top;
          }
          var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
          return { left: left - lineSpaceBox.left, top: top - lineSpaceBox.top };
        }
        function charCoords(cm, pos, context, lineObj, bias) {
          if (!lineObj) {
            lineObj = getLine(cm.doc, pos.line);
          }
          return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
        }
        function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
          lineObj = lineObj || getLine(cm.doc, pos.line);
          if (!preparedMeasure) {
            preparedMeasure = prepareMeasureForLine(cm, lineObj);
          }
          function get(ch2, right) {
            var m = measureCharPrepared(cm, preparedMeasure, ch2, right ? "right" : "left", varHeight);
            if (right) {
              m.left = m.right;
            } else {
              m.right = m.left;
            }
            return intoCoordSystem(cm, lineObj, m, context);
          }
          var order = getOrder(lineObj, cm.doc.direction), ch = pos.ch, sticky = pos.sticky;
          if (ch >= lineObj.text.length) {
            ch = lineObj.text.length;
            sticky = "before";
          } else if (ch <= 0) {
            ch = 0;
            sticky = "after";
          }
          if (!order) {
            return get(sticky == "before" ? ch - 1 : ch, sticky == "before");
          }
          function getBidi(ch2, partPos2, invert) {
            var part = order[partPos2], right = part.level == 1;
            return get(invert ? ch2 - 1 : ch2, right != invert);
          }
          var partPos = getBidiPartAt(order, ch, sticky);
          var other = bidiOther;
          var val = getBidi(ch, partPos, sticky == "before");
          if (other != null) {
            val.other = getBidi(ch, other, sticky != "before");
          }
          return val;
        }
        function estimateCoords(cm, pos) {
          var left = 0;
          pos = clipPos(cm.doc, pos);
          if (!cm.options.lineWrapping) {
            left = charWidth(cm.display) * pos.ch;
          }
          var lineObj = getLine(cm.doc, pos.line);
          var top = heightAtLine(lineObj) + paddingTop(cm.display);
          return { left, right: left, top, bottom: top + lineObj.height };
        }
        function PosWithInfo(line, ch, sticky, outside, xRel) {
          var pos = Pos(line, ch, sticky);
          pos.xRel = xRel;
          if (outside) {
            pos.outside = outside;
          }
          return pos;
        }
        function coordsChar(cm, x, y) {
          var doc3 = cm.doc;
          y += cm.display.viewOffset;
          if (y < 0) {
            return PosWithInfo(doc3.first, 0, null, -1, -1);
          }
          var lineN = lineAtHeight(doc3, y), last2 = doc3.first + doc3.size - 1;
          if (lineN > last2) {
            return PosWithInfo(doc3.first + doc3.size - 1, getLine(doc3, last2).text.length, null, 1, 1);
          }
          if (x < 0) {
            x = 0;
          }
          var lineObj = getLine(doc3, lineN);
          for (; ; ) {
            var found = coordsCharInner(cm, lineObj, lineN, x, y);
            var collapsed = collapsedSpanAround(lineObj, found.ch + (found.xRel > 0 || found.outside > 0 ? 1 : 0));
            if (!collapsed) {
              return found;
            }
            var rangeEnd = collapsed.find(1);
            if (rangeEnd.line == lineN) {
              return rangeEnd;
            }
            lineObj = getLine(doc3, lineN = rangeEnd.line);
          }
        }
        function wrappedLineExtent(cm, lineObj, preparedMeasure, y) {
          y -= widgetTopHeight(lineObj);
          var end = lineObj.text.length;
          var begin = findFirst(function(ch) {
            return measureCharPrepared(cm, preparedMeasure, ch - 1).bottom <= y;
          }, end, 0);
          end = findFirst(function(ch) {
            return measureCharPrepared(cm, preparedMeasure, ch).top > y;
          }, begin, end);
          return { begin, end };
        }
        function wrappedLineExtentChar(cm, lineObj, preparedMeasure, target) {
          if (!preparedMeasure) {
            preparedMeasure = prepareMeasureForLine(cm, lineObj);
          }
          var targetTop = intoCoordSystem(cm, lineObj, measureCharPrepared(cm, preparedMeasure, target), "line").top;
          return wrappedLineExtent(cm, lineObj, preparedMeasure, targetTop);
        }
        function boxIsAfter(box, x, y, left) {
          return box.bottom <= y ? false : box.top > y ? true : (left ? box.left : box.right) > x;
        }
        function coordsCharInner(cm, lineObj, lineNo2, x, y) {
          y -= heightAtLine(lineObj);
          var preparedMeasure = prepareMeasureForLine(cm, lineObj);
          var widgetHeight2 = widgetTopHeight(lineObj);
          var begin = 0, end = lineObj.text.length, ltr = true;
          var order = getOrder(lineObj, cm.doc.direction);
          if (order) {
            var part = (cm.options.lineWrapping ? coordsBidiPartWrapped : coordsBidiPart)(cm, lineObj, lineNo2, preparedMeasure, order, x, y);
            ltr = part.level != 1;
            begin = ltr ? part.from : part.to - 1;
            end = ltr ? part.to : part.from - 1;
          }
          var chAround = null, boxAround = null;
          var ch = findFirst(function(ch2) {
            var box = measureCharPrepared(cm, preparedMeasure, ch2);
            box.top += widgetHeight2;
            box.bottom += widgetHeight2;
            if (!boxIsAfter(box, x, y, false)) {
              return false;
            }
            if (box.top <= y && box.left <= x) {
              chAround = ch2;
              boxAround = box;
            }
            return true;
          }, begin, end);
          var baseX, sticky, outside = false;
          if (boxAround) {
            var atLeft = x - boxAround.left < boxAround.right - x, atStart = atLeft == ltr;
            ch = chAround + (atStart ? 0 : 1);
            sticky = atStart ? "after" : "before";
            baseX = atLeft ? boxAround.left : boxAround.right;
          } else {
            if (!ltr && (ch == end || ch == begin)) {
              ch++;
            }
            sticky = ch == 0 ? "after" : ch == lineObj.text.length ? "before" : measureCharPrepared(cm, preparedMeasure, ch - (ltr ? 1 : 0)).bottom + widgetHeight2 <= y == ltr ? "after" : "before";
            var coords = cursorCoords(cm, Pos(lineNo2, ch, sticky), "line", lineObj, preparedMeasure);
            baseX = coords.left;
            outside = y < coords.top ? -1 : y >= coords.bottom ? 1 : 0;
          }
          ch = skipExtendingChars(lineObj.text, ch, 1);
          return PosWithInfo(lineNo2, ch, sticky, outside, x - baseX);
        }
        function coordsBidiPart(cm, lineObj, lineNo2, preparedMeasure, order, x, y) {
          var index = findFirst(function(i2) {
            var part2 = order[i2], ltr2 = part2.level != 1;
            return boxIsAfter(cursorCoords(
              cm,
              Pos(lineNo2, ltr2 ? part2.to : part2.from, ltr2 ? "before" : "after"),
              "line",
              lineObj,
              preparedMeasure
            ), x, y, true);
          }, 0, order.length - 1);
          var part = order[index];
          if (index > 0) {
            var ltr = part.level != 1;
            var start = cursorCoords(
              cm,
              Pos(lineNo2, ltr ? part.from : part.to, ltr ? "after" : "before"),
              "line",
              lineObj,
              preparedMeasure
            );
            if (boxIsAfter(start, x, y, true) && start.top > y) {
              part = order[index - 1];
            }
          }
          return part;
        }
        function coordsBidiPartWrapped(cm, lineObj, _lineNo, preparedMeasure, order, x, y) {
          var ref = wrappedLineExtent(cm, lineObj, preparedMeasure, y);
          var begin = ref.begin;
          var end = ref.end;
          if (/\s/.test(lineObj.text.charAt(end - 1))) {
            end--;
          }
          var part = null, closestDist = null;
          for (var i2 = 0; i2 < order.length; i2++) {
            var p = order[i2];
            if (p.from >= end || p.to <= begin) {
              continue;
            }
            var ltr = p.level != 1;
            var endX = measureCharPrepared(cm, preparedMeasure, ltr ? Math.min(end, p.to) - 1 : Math.max(begin, p.from)).right;
            var dist = endX < x ? x - endX + 1e9 : endX - x;
            if (!part || closestDist > dist) {
              part = p;
              closestDist = dist;
            }
          }
          if (!part) {
            part = order[order.length - 1];
          }
          if (part.from < begin) {
            part = { from: begin, to: part.to, level: part.level };
          }
          if (part.to > end) {
            part = { from: part.from, to: end, level: part.level };
          }
          return part;
        }
        var measureText;
        function textHeight(display) {
          if (display.cachedTextHeight != null) {
            return display.cachedTextHeight;
          }
          if (measureText == null) {
            measureText = elt("pre", null, "CodeMirror-line-like");
            for (var i2 = 0; i2 < 49; ++i2) {
              measureText.appendChild(document.createTextNode("x"));
              measureText.appendChild(elt("br"));
            }
            measureText.appendChild(document.createTextNode("x"));
          }
          removeChildrenAndAdd(display.measure, measureText);
          var height = measureText.offsetHeight / 50;
          if (height > 3) {
            display.cachedTextHeight = height;
          }
          removeChildren(display.measure);
          return height || 1;
        }
        function charWidth(display) {
          if (display.cachedCharWidth != null) {
            return display.cachedCharWidth;
          }
          var anchor = elt("span", "xxxxxxxxxx");
          var pre = elt("pre", [anchor], "CodeMirror-line-like");
          removeChildrenAndAdd(display.measure, pre);
          var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
          if (width > 2) {
            display.cachedCharWidth = width;
          }
          return width || 10;
        }
        function getDimensions(cm) {
          var d = cm.display, left = {}, width = {};
          var gutterLeft = d.gutters.clientLeft;
          for (var n = d.gutters.firstChild, i2 = 0; n; n = n.nextSibling, ++i2) {
            var id2 = cm.display.gutterSpecs[i2].className;
            left[id2] = n.offsetLeft + n.clientLeft + gutterLeft;
            width[id2] = n.clientWidth;
          }
          return {
            fixedPos: compensateForHScroll(d),
            gutterTotalWidth: d.gutters.offsetWidth,
            gutterLeft: left,
            gutterWidth: width,
            wrapperWidth: d.wrapper.clientWidth
          };
        }
        function compensateForHScroll(display) {
          return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
        }
        function estimateHeight(cm) {
          var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
          var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
          return function(line) {
            if (lineIsHidden(cm.doc, line)) {
              return 0;
            }
            var widgetsHeight = 0;
            if (line.widgets) {
              for (var i2 = 0; i2 < line.widgets.length; i2++) {
                if (line.widgets[i2].height) {
                  widgetsHeight += line.widgets[i2].height;
                }
              }
            }
            if (wrapping) {
              return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
            } else {
              return widgetsHeight + th;
            }
          };
        }
        function estimateLineHeights(cm) {
          var doc3 = cm.doc, est = estimateHeight(cm);
          doc3.iter(function(line) {
            var estHeight = est(line);
            if (estHeight != line.height) {
              updateLineHeight(line, estHeight);
            }
          });
        }
        function posFromMouse(cm, e, liberal, forRect) {
          var display = cm.display;
          if (!liberal && e_target(e).getAttribute("cm-not-content") == "true") {
            return null;
          }
          var x, y, space = display.lineSpace.getBoundingClientRect();
          try {
            x = e.clientX - space.left;
            y = e.clientY - space.top;
          } catch (e$1) {
            return null;
          }
          var coords = coordsChar(cm, x, y), line;
          if (forRect && coords.xRel > 0 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
            var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
            coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
          }
          return coords;
        }
        function findViewIndex(cm, n) {
          if (n >= cm.display.viewTo) {
            return null;
          }
          n -= cm.display.viewFrom;
          if (n < 0) {
            return null;
          }
          var view = cm.display.view;
          for (var i2 = 0; i2 < view.length; i2++) {
            n -= view[i2].size;
            if (n < 0) {
              return i2;
            }
          }
        }
        function regChange(cm, from2, to, lendiff) {
          if (from2 == null) {
            from2 = cm.doc.first;
          }
          if (to == null) {
            to = cm.doc.first + cm.doc.size;
          }
          if (!lendiff) {
            lendiff = 0;
          }
          var display = cm.display;
          if (lendiff && to < display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers > from2)) {
            display.updateLineNumbers = from2;
          }
          cm.curOp.viewChanged = true;
          if (from2 >= display.viewTo) {
            if (sawCollapsedSpans && visualLineNo(cm.doc, from2) < display.viewTo) {
              resetView(cm);
            }
          } else if (to <= display.viewFrom) {
            if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
              resetView(cm);
            } else {
              display.viewFrom += lendiff;
              display.viewTo += lendiff;
            }
          } else if (from2 <= display.viewFrom && to >= display.viewTo) {
            resetView(cm);
          } else if (from2 <= display.viewFrom) {
            var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
            if (cut) {
              display.view = display.view.slice(cut.index);
              display.viewFrom = cut.lineN;
              display.viewTo += lendiff;
            } else {
              resetView(cm);
            }
          } else if (to >= display.viewTo) {
            var cut$1 = viewCuttingPoint(cm, from2, from2, -1);
            if (cut$1) {
              display.view = display.view.slice(0, cut$1.index);
              display.viewTo = cut$1.lineN;
            } else {
              resetView(cm);
            }
          } else {
            var cutTop = viewCuttingPoint(cm, from2, from2, -1);
            var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
            if (cutTop && cutBot) {
              display.view = display.view.slice(0, cutTop.index).concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN)).concat(display.view.slice(cutBot.index));
              display.viewTo += lendiff;
            } else {
              resetView(cm);
            }
          }
          var ext = display.externalMeasured;
          if (ext) {
            if (to < ext.lineN) {
              ext.lineN += lendiff;
            } else if (from2 < ext.lineN + ext.size) {
              display.externalMeasured = null;
            }
          }
        }
        function regLineChange(cm, line, type) {
          cm.curOp.viewChanged = true;
          var display = cm.display, ext = cm.display.externalMeasured;
          if (ext && line >= ext.lineN && line < ext.lineN + ext.size) {
            display.externalMeasured = null;
          }
          if (line < display.viewFrom || line >= display.viewTo) {
            return;
          }
          var lineView = display.view[findViewIndex(cm, line)];
          if (lineView.node == null) {
            return;
          }
          var arr = lineView.changes || (lineView.changes = []);
          if (indexOf(arr, type) == -1) {
            arr.push(type);
          }
        }
        function resetView(cm) {
          cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
          cm.display.view = [];
          cm.display.viewOffset = 0;
        }
        function viewCuttingPoint(cm, oldN, newN, dir) {
          var index = findViewIndex(cm, oldN), diff, view = cm.display.view;
          if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size) {
            return { index, lineN: newN };
          }
          var n = cm.display.viewFrom;
          for (var i2 = 0; i2 < index; i2++) {
            n += view[i2].size;
          }
          if (n != oldN) {
            if (dir > 0) {
              if (index == view.length - 1) {
                return null;
              }
              diff = n + view[index].size - oldN;
              index++;
            } else {
              diff = n - oldN;
            }
            oldN += diff;
            newN += diff;
          }
          while (visualLineNo(cm.doc, newN) != newN) {
            if (index == (dir < 0 ? 0 : view.length - 1)) {
              return null;
            }
            newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
            index += dir;
          }
          return { index, lineN: newN };
        }
        function adjustView(cm, from2, to) {
          var display = cm.display, view = display.view;
          if (view.length == 0 || from2 >= display.viewTo || to <= display.viewFrom) {
            display.view = buildViewArray(cm, from2, to);
            display.viewFrom = from2;
          } else {
            if (display.viewFrom > from2) {
              display.view = buildViewArray(cm, from2, display.viewFrom).concat(display.view);
            } else if (display.viewFrom < from2) {
              display.view = display.view.slice(findViewIndex(cm, from2));
            }
            display.viewFrom = from2;
            if (display.viewTo < to) {
              display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));
            } else if (display.viewTo > to) {
              display.view = display.view.slice(0, findViewIndex(cm, to));
            }
          }
          display.viewTo = to;
        }
        function countDirtyView(cm) {
          var view = cm.display.view, dirty = 0;
          for (var i2 = 0; i2 < view.length; i2++) {
            var lineView = view[i2];
            if (!lineView.hidden && (!lineView.node || lineView.changes)) {
              ++dirty;
            }
          }
          return dirty;
        }
        function updateSelection(cm) {
          cm.display.input.showSelection(cm.display.input.prepareSelection());
        }
        function prepareSelection(cm, primary) {
          if (primary === void 0) primary = true;
          var doc3 = cm.doc, result = {};
          var curFragment = result.cursors = document.createDocumentFragment();
          var selFragment = result.selection = document.createDocumentFragment();
          var customCursor = cm.options.$customCursor;
          if (customCursor) {
            primary = true;
          }
          for (var i2 = 0; i2 < doc3.sel.ranges.length; i2++) {
            if (!primary && i2 == doc3.sel.primIndex) {
              continue;
            }
            var range2 = doc3.sel.ranges[i2];
            if (range2.from().line >= cm.display.viewTo || range2.to().line < cm.display.viewFrom) {
              continue;
            }
            var collapsed = range2.empty();
            if (customCursor) {
              var head = customCursor(cm, range2);
              if (head) {
                drawSelectionCursor(cm, head, curFragment);
              }
            } else if (collapsed || cm.options.showCursorWhenSelecting) {
              drawSelectionCursor(cm, range2.head, curFragment);
            }
            if (!collapsed) {
              drawSelectionRange(cm, range2, selFragment);
            }
          }
          return result;
        }
        function drawSelectionCursor(cm, head, output) {
          var pos = cursorCoords(cm, head, "div", null, null, !cm.options.singleCursorHeightPerLine);
          var cursor = output.appendChild(elt("div", "\xA0", "CodeMirror-cursor"));
          cursor.style.left = pos.left + "px";
          cursor.style.top = pos.top + "px";
          cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";
          if (/\bcm-fat-cursor\b/.test(cm.getWrapperElement().className)) {
            var charPos = charCoords(cm, head, "div", null, null);
            var width = charPos.right - charPos.left;
            cursor.style.width = (width > 0 ? width : cm.defaultCharWidth()) + "px";
          }
          if (pos.other) {
            var otherCursor = output.appendChild(elt("div", "\xA0", "CodeMirror-cursor CodeMirror-secondarycursor"));
            otherCursor.style.display = "";
            otherCursor.style.left = pos.other.left + "px";
            otherCursor.style.top = pos.other.top + "px";
            otherCursor.style.height = (pos.other.bottom - pos.other.top) * 0.85 + "px";
          }
        }
        function cmpCoords(a, b) {
          return a.top - b.top || a.left - b.left;
        }
        function drawSelectionRange(cm, range2, output) {
          var display = cm.display, doc3 = cm.doc;
          var fragment = document.createDocumentFragment();
          var padding = paddingH(cm.display), leftSide = padding.left;
          var rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right;
          var docLTR = doc3.direction == "ltr";
          function add2(left, top, width, bottom) {
            if (top < 0) {
              top = 0;
            }
            top = Math.round(top);
            bottom = Math.round(bottom);
            fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left + "px;\n                             top: " + top + "px; width: " + (width == null ? rightSide - left : width) + "px;\n                             height: " + (bottom - top) + "px"));
          }
          function drawForLine(line, fromArg, toArg) {
            var lineObj = getLine(doc3, line);
            var lineLen = lineObj.text.length;
            var start, end;
            function coords(ch, bias) {
              return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
            }
            function wrapX(pos, dir, side) {
              var extent = wrappedLineExtentChar(cm, lineObj, null, pos);
              var prop2 = dir == "ltr" == (side == "after") ? "left" : "right";
              var ch = side == "after" ? extent.begin : extent.end - (/\s/.test(lineObj.text.charAt(extent.end - 1)) ? 2 : 1);
              return coords(ch, prop2)[prop2];
            }
            var order = getOrder(lineObj, doc3.direction);
            iterateBidiSections(order, fromArg || 0, toArg == null ? lineLen : toArg, function(from2, to, dir, i2) {
              var ltr = dir == "ltr";
              var fromPos = coords(from2, ltr ? "left" : "right");
              var toPos = coords(to - 1, ltr ? "right" : "left");
              var openStart = fromArg == null && from2 == 0, openEnd = toArg == null && to == lineLen;
              var first = i2 == 0, last2 = !order || i2 == order.length - 1;
              if (toPos.top - fromPos.top <= 3) {
                var openLeft = (docLTR ? openStart : openEnd) && first;
                var openRight = (docLTR ? openEnd : openStart) && last2;
                var left = openLeft ? leftSide : (ltr ? fromPos : toPos).left;
                var right = openRight ? rightSide : (ltr ? toPos : fromPos).right;
                add2(left, fromPos.top, right - left, fromPos.bottom);
              } else {
                var topLeft, topRight, botLeft, botRight;
                if (ltr) {
                  topLeft = docLTR && openStart && first ? leftSide : fromPos.left;
                  topRight = docLTR ? rightSide : wrapX(from2, dir, "before");
                  botLeft = docLTR ? leftSide : wrapX(to, dir, "after");
                  botRight = docLTR && openEnd && last2 ? rightSide : toPos.right;
                } else {
                  topLeft = !docLTR ? leftSide : wrapX(from2, dir, "before");
                  topRight = !docLTR && openStart && first ? rightSide : fromPos.right;
                  botLeft = !docLTR && openEnd && last2 ? leftSide : toPos.left;
                  botRight = !docLTR ? rightSide : wrapX(to, dir, "after");
                }
                add2(topLeft, fromPos.top, topRight - topLeft, fromPos.bottom);
                if (fromPos.bottom < toPos.top) {
                  add2(leftSide, fromPos.bottom, null, toPos.top);
                }
                add2(botLeft, toPos.top, botRight - botLeft, toPos.bottom);
              }
              if (!start || cmpCoords(fromPos, start) < 0) {
                start = fromPos;
              }
              if (cmpCoords(toPos, start) < 0) {
                start = toPos;
              }
              if (!end || cmpCoords(fromPos, end) < 0) {
                end = fromPos;
              }
              if (cmpCoords(toPos, end) < 0) {
                end = toPos;
              }
            });
            return { start, end };
          }
          var sFrom = range2.from(), sTo = range2.to();
          if (sFrom.line == sTo.line) {
            drawForLine(sFrom.line, sFrom.ch, sTo.ch);
          } else {
            var fromLine = getLine(doc3, sFrom.line), toLine = getLine(doc3, sTo.line);
            var singleVLine = visualLine(fromLine) == visualLine(toLine);
            var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
            var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
            if (singleVLine) {
              if (leftEnd.top < rightStart.top - 2) {
                add2(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
                add2(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
              } else {
                add2(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
              }
            }
            if (leftEnd.bottom < rightStart.top) {
              add2(leftSide, leftEnd.bottom, null, rightStart.top);
            }
          }
          output.appendChild(fragment);
        }
        function restartBlink(cm) {
          if (!cm.state.focused) {
            return;
          }
          var display = cm.display;
          clearInterval(display.blinker);
          var on2 = true;
          display.cursorDiv.style.visibility = "";
          if (cm.options.cursorBlinkRate > 0) {
            display.blinker = setInterval(function() {
              if (!cm.hasFocus()) {
                onBlur(cm);
              }
              display.cursorDiv.style.visibility = (on2 = !on2) ? "" : "hidden";
            }, cm.options.cursorBlinkRate);
          } else if (cm.options.cursorBlinkRate < 0) {
            display.cursorDiv.style.visibility = "hidden";
          }
        }
        function ensureFocus(cm) {
          if (!cm.hasFocus()) {
            cm.display.input.focus();
            if (!cm.state.focused) {
              onFocus(cm);
            }
          }
        }
        function delayBlurEvent(cm) {
          cm.state.delayingBlurEvent = true;
          setTimeout(function() {
            if (cm.state.delayingBlurEvent) {
              cm.state.delayingBlurEvent = false;
              if (cm.state.focused) {
                onBlur(cm);
              }
            }
          }, 100);
        }
        function onFocus(cm, e) {
          if (cm.state.delayingBlurEvent && !cm.state.draggingText) {
            cm.state.delayingBlurEvent = false;
          }
          if (cm.options.readOnly == "nocursor") {
            return;
          }
          if (!cm.state.focused) {
            signal(cm, "focus", cm, e);
            cm.state.focused = true;
            addClass(cm.display.wrapper, "CodeMirror-focused");
            if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
              cm.display.input.reset();
              if (webkit) {
                setTimeout(function() {
                  return cm.display.input.reset(true);
                }, 20);
              }
            }
            cm.display.input.receivedFocus();
          }
          restartBlink(cm);
        }
        function onBlur(cm, e) {
          if (cm.state.delayingBlurEvent) {
            return;
          }
          if (cm.state.focused) {
            signal(cm, "blur", cm, e);
            cm.state.focused = false;
            rmClass(cm.display.wrapper, "CodeMirror-focused");
          }
          clearInterval(cm.display.blinker);
          setTimeout(function() {
            if (!cm.state.focused) {
              cm.display.shift = false;
            }
          }, 150);
        }
        function updateHeightsInViewport(cm) {
          var display = cm.display;
          var prevBottom = display.lineDiv.offsetTop;
          var viewTop = Math.max(0, display.scroller.getBoundingClientRect().top);
          var oldHeight = display.lineDiv.getBoundingClientRect().top;
          var mustScroll = 0;
          for (var i2 = 0; i2 < display.view.length; i2++) {
            var cur = display.view[i2], wrapping = cm.options.lineWrapping;
            var height = void 0, width = 0;
            if (cur.hidden) {
              continue;
            }
            oldHeight += cur.line.height;
            if (ie && ie_version < 8) {
              var bot = cur.node.offsetTop + cur.node.offsetHeight;
              height = bot - prevBottom;
              prevBottom = bot;
            } else {
              var box = cur.node.getBoundingClientRect();
              height = box.bottom - box.top;
              if (!wrapping && cur.text.firstChild) {
                width = cur.text.firstChild.getBoundingClientRect().right - box.left - 1;
              }
            }
            var diff = cur.line.height - height;
            if (diff > 5e-3 || diff < -5e-3) {
              if (oldHeight < viewTop) {
                mustScroll -= diff;
              }
              updateLineHeight(cur.line, height);
              updateWidgetHeight(cur.line);
              if (cur.rest) {
                for (var j = 0; j < cur.rest.length; j++) {
                  updateWidgetHeight(cur.rest[j]);
                }
              }
            }
            if (width > cm.display.sizerWidth) {
              var chWidth = Math.ceil(width / charWidth(cm.display));
              if (chWidth > cm.display.maxLineLength) {
                cm.display.maxLineLength = chWidth;
                cm.display.maxLine = cur.line;
                cm.display.maxLineChanged = true;
              }
            }
          }
          if (Math.abs(mustScroll) > 2) {
            display.scroller.scrollTop += mustScroll;
          }
        }
        function updateWidgetHeight(line) {
          if (line.widgets) {
            for (var i2 = 0; i2 < line.widgets.length; ++i2) {
              var w = line.widgets[i2], parent = w.node.parentNode;
              if (parent) {
                w.height = parent.offsetHeight;
              }
            }
          }
        }
        function visibleLines(display, doc3, viewport) {
          var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
          top = Math.floor(top - paddingTop(display));
          var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;
          var from2 = lineAtHeight(doc3, top), to = lineAtHeight(doc3, bottom);
          if (viewport && viewport.ensure) {
            var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
            if (ensureFrom < from2) {
              from2 = ensureFrom;
              to = lineAtHeight(doc3, heightAtLine(getLine(doc3, ensureFrom)) + display.wrapper.clientHeight);
            } else if (Math.min(ensureTo, doc3.lastLine()) >= to) {
              from2 = lineAtHeight(doc3, heightAtLine(getLine(doc3, ensureTo)) - display.wrapper.clientHeight);
              to = ensureTo;
            }
          }
          return { from: from2, to: Math.max(to, from2 + 1) };
        }
        function maybeScrollWindow(cm, rect) {
          if (signalDOMEvent(cm, "scrollCursorIntoView")) {
            return;
          }
          var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
          var doc3 = display.wrapper.ownerDocument;
          if (rect.top + box.top < 0) {
            doScroll = true;
          } else if (rect.bottom + box.top > (doc3.defaultView.innerHeight || doc3.documentElement.clientHeight)) {
            doScroll = false;
          }
          if (doScroll != null && !phantom) {
            var scrollNode = elt("div", "\u200B", null, "position: absolute;\n                         top: " + (rect.top - display.viewOffset - paddingTop(cm.display)) + "px;\n                         height: " + (rect.bottom - rect.top + scrollGap(cm) + display.barHeight) + "px;\n                         left: " + rect.left + "px; width: " + Math.max(2, rect.right - rect.left) + "px;");
            cm.display.lineSpace.appendChild(scrollNode);
            scrollNode.scrollIntoView(doScroll);
            cm.display.lineSpace.removeChild(scrollNode);
          }
        }
        function scrollPosIntoView(cm, pos, end, margin) {
          if (margin == null) {
            margin = 0;
          }
          var rect;
          if (!cm.options.lineWrapping && pos == end) {
            end = pos.sticky == "before" ? Pos(pos.line, pos.ch + 1, "before") : pos;
            pos = pos.ch ? Pos(pos.line, pos.sticky == "before" ? pos.ch - 1 : pos.ch, "after") : pos;
          }
          for (var limit = 0; limit < 5; limit++) {
            var changed = false;
            var coords = cursorCoords(cm, pos);
            var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
            rect = {
              left: Math.min(coords.left, endCoords.left),
              top: Math.min(coords.top, endCoords.top) - margin,
              right: Math.max(coords.left, endCoords.left),
              bottom: Math.max(coords.bottom, endCoords.bottom) + margin
            };
            var scrollPos = calculateScrollPos(cm, rect);
            var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
            if (scrollPos.scrollTop != null) {
              updateScrollTop(cm, scrollPos.scrollTop);
              if (Math.abs(cm.doc.scrollTop - startTop) > 1) {
                changed = true;
              }
            }
            if (scrollPos.scrollLeft != null) {
              setScrollLeft(cm, scrollPos.scrollLeft);
              if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) {
                changed = true;
              }
            }
            if (!changed) {
              break;
            }
          }
          return rect;
        }
        function scrollIntoView(cm, rect) {
          var scrollPos = calculateScrollPos(cm, rect);
          if (scrollPos.scrollTop != null) {
            updateScrollTop(cm, scrollPos.scrollTop);
          }
          if (scrollPos.scrollLeft != null) {
            setScrollLeft(cm, scrollPos.scrollLeft);
          }
        }
        function calculateScrollPos(cm, rect) {
          var display = cm.display, snapMargin = textHeight(cm.display);
          if (rect.top < 0) {
            rect.top = 0;
          }
          var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
          var screen2 = displayHeight(cm), result = {};
          if (rect.bottom - rect.top > screen2) {
            rect.bottom = rect.top + screen2;
          }
          var docBottom = cm.doc.height + paddingVert(display);
          var atTop = rect.top < snapMargin, atBottom = rect.bottom > docBottom - snapMargin;
          if (rect.top < screentop) {
            result.scrollTop = atTop ? 0 : rect.top;
          } else if (rect.bottom > screentop + screen2) {
            var newTop = Math.min(rect.top, (atBottom ? docBottom : rect.bottom) - screen2);
            if (newTop != screentop) {
              result.scrollTop = newTop;
            }
          }
          var gutterSpace = cm.options.fixedGutter ? 0 : display.gutters.offsetWidth;
          var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft - gutterSpace;
          var screenw = displayWidth(cm) - display.gutters.offsetWidth;
          var tooWide = rect.right - rect.left > screenw;
          if (tooWide) {
            rect.right = rect.left + screenw;
          }
          if (rect.left < 10) {
            result.scrollLeft = 0;
          } else if (rect.left < screenleft) {
            result.scrollLeft = Math.max(0, rect.left + gutterSpace - (tooWide ? 0 : 10));
          } else if (rect.right > screenw + screenleft - 3) {
            result.scrollLeft = rect.right + (tooWide ? 0 : 10) - screenw;
          }
          return result;
        }
        function addToScrollTop(cm, top) {
          if (top == null) {
            return;
          }
          resolveScrollToPos(cm);
          cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
        }
        function ensureCursorVisible(cm) {
          resolveScrollToPos(cm);
          var cur = cm.getCursor();
          cm.curOp.scrollToPos = { from: cur, to: cur, margin: cm.options.cursorScrollMargin };
        }
        function scrollToCoords(cm, x, y) {
          if (x != null || y != null) {
            resolveScrollToPos(cm);
          }
          if (x != null) {
            cm.curOp.scrollLeft = x;
          }
          if (y != null) {
            cm.curOp.scrollTop = y;
          }
        }
        function scrollToRange(cm, range2) {
          resolveScrollToPos(cm);
          cm.curOp.scrollToPos = range2;
        }
        function resolveScrollToPos(cm) {
          var range2 = cm.curOp.scrollToPos;
          if (range2) {
            cm.curOp.scrollToPos = null;
            var from2 = estimateCoords(cm, range2.from), to = estimateCoords(cm, range2.to);
            scrollToCoordsRange(cm, from2, to, range2.margin);
          }
        }
        function scrollToCoordsRange(cm, from2, to, margin) {
          var sPos = calculateScrollPos(cm, {
            left: Math.min(from2.left, to.left),
            top: Math.min(from2.top, to.top) - margin,
            right: Math.max(from2.right, to.right),
            bottom: Math.max(from2.bottom, to.bottom) + margin
          });
          scrollToCoords(cm, sPos.scrollLeft, sPos.scrollTop);
        }
        function updateScrollTop(cm, val) {
          if (Math.abs(cm.doc.scrollTop - val) < 2) {
            return;
          }
          if (!gecko) {
            updateDisplaySimple(cm, { top: val });
          }
          setScrollTop(cm, val, true);
          if (gecko) {
            updateDisplaySimple(cm);
          }
          startWorker(cm, 100);
        }
        function setScrollTop(cm, val, forceScroll) {
          val = Math.max(0, Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, val));
          if (cm.display.scroller.scrollTop == val && !forceScroll) {
            return;
          }
          cm.doc.scrollTop = val;
          cm.display.scrollbars.setScrollTop(val);
          if (cm.display.scroller.scrollTop != val) {
            cm.display.scroller.scrollTop = val;
          }
        }
        function setScrollLeft(cm, val, isScroller, forceScroll) {
          val = Math.max(0, Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth));
          if ((isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) && !forceScroll) {
            return;
          }
          cm.doc.scrollLeft = val;
          alignHorizontally(cm);
          if (cm.display.scroller.scrollLeft != val) {
            cm.display.scroller.scrollLeft = val;
          }
          cm.display.scrollbars.setScrollLeft(val);
        }
        function measureForScrollbars(cm) {
          var d = cm.display, gutterW = d.gutters.offsetWidth;
          var docH = Math.round(cm.doc.height + paddingVert(cm.display));
          return {
            clientHeight: d.scroller.clientHeight,
            viewHeight: d.wrapper.clientHeight,
            scrollWidth: d.scroller.scrollWidth,
            clientWidth: d.scroller.clientWidth,
            viewWidth: d.wrapper.clientWidth,
            barLeft: cm.options.fixedGutter ? gutterW : 0,
            docHeight: docH,
            scrollHeight: docH + scrollGap(cm) + d.barHeight,
            nativeBarWidth: d.nativeBarWidth,
            gutterWidth: gutterW
          };
        }
        var NativeScrollbars = function(place, scroll, cm) {
          this.cm = cm;
          var vert = this.vert = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
          var horiz = this.horiz = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
          vert.tabIndex = horiz.tabIndex = -1;
          place(vert);
          place(horiz);
          on(vert, "scroll", function() {
            if (vert.clientHeight) {
              scroll(vert.scrollTop, "vertical");
            }
          });
          on(horiz, "scroll", function() {
            if (horiz.clientWidth) {
              scroll(horiz.scrollLeft, "horizontal");
            }
          });
          this.checkedZeroWidth = false;
          if (ie && ie_version < 8) {
            this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
          }
        };
        NativeScrollbars.prototype.update = function(measure) {
          var needsH = measure.scrollWidth > measure.clientWidth + 1;
          var needsV = measure.scrollHeight > measure.clientHeight + 1;
          var sWidth = measure.nativeBarWidth;
          if (needsV) {
            this.vert.style.display = "block";
            this.vert.style.bottom = needsH ? sWidth + "px" : "0";
            var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
            this.vert.firstChild.style.height = Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
          } else {
            this.vert.scrollTop = 0;
            this.vert.style.display = "";
            this.vert.firstChild.style.height = "0";
          }
          if (needsH) {
            this.horiz.style.display = "block";
            this.horiz.style.right = needsV ? sWidth + "px" : "0";
            this.horiz.style.left = measure.barLeft + "px";
            var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
            this.horiz.firstChild.style.width = Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
          } else {
            this.horiz.style.display = "";
            this.horiz.firstChild.style.width = "0";
          }
          if (!this.checkedZeroWidth && measure.clientHeight > 0) {
            if (sWidth == 0) {
              this.zeroWidthHack();
            }
            this.checkedZeroWidth = true;
          }
          return { right: needsV ? sWidth : 0, bottom: needsH ? sWidth : 0 };
        };
        NativeScrollbars.prototype.setScrollLeft = function(pos) {
          if (this.horiz.scrollLeft != pos) {
            this.horiz.scrollLeft = pos;
          }
          if (this.disableHoriz) {
            this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
          }
        };
        NativeScrollbars.prototype.setScrollTop = function(pos) {
          if (this.vert.scrollTop != pos) {
            this.vert.scrollTop = pos;
          }
          if (this.disableVert) {
            this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
          }
        };
        NativeScrollbars.prototype.zeroWidthHack = function() {
          var w = mac && !mac_geMountainLion ? "12px" : "18px";
          this.horiz.style.height = this.vert.style.width = w;
          this.horiz.style.visibility = this.vert.style.visibility = "hidden";
          this.disableHoriz = new Delayed();
          this.disableVert = new Delayed();
        };
        NativeScrollbars.prototype.enableZeroWidthBar = function(bar, delay, type) {
          bar.style.visibility = "";
          function maybeDisable() {
            var box = bar.getBoundingClientRect();
            var elt2 = type == "vert" ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2) : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
            if (elt2 != bar) {
              bar.style.visibility = "hidden";
            } else {
              delay.set(1e3, maybeDisable);
            }
          }
          delay.set(1e3, maybeDisable);
        };
        NativeScrollbars.prototype.clear = function() {
          var parent = this.horiz.parentNode;
          parent.removeChild(this.horiz);
          parent.removeChild(this.vert);
        };
        var NullScrollbars = function() {
        };
        NullScrollbars.prototype.update = function() {
          return { bottom: 0, right: 0 };
        };
        NullScrollbars.prototype.setScrollLeft = function() {
        };
        NullScrollbars.prototype.setScrollTop = function() {
        };
        NullScrollbars.prototype.clear = function() {
        };
        function updateScrollbars(cm, measure) {
          if (!measure) {
            measure = measureForScrollbars(cm);
          }
          var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
          updateScrollbarsInner(cm, measure);
          for (var i2 = 0; i2 < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i2++) {
            if (startWidth != cm.display.barWidth && cm.options.lineWrapping) {
              updateHeightsInViewport(cm);
            }
            updateScrollbarsInner(cm, measureForScrollbars(cm));
            startWidth = cm.display.barWidth;
            startHeight = cm.display.barHeight;
          }
        }
        function updateScrollbarsInner(cm, measure) {
          var d = cm.display;
          var sizes = d.scrollbars.update(measure);
          d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
          d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";
          d.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent";
          if (sizes.right && sizes.bottom) {
            d.scrollbarFiller.style.display = "block";
            d.scrollbarFiller.style.height = sizes.bottom + "px";
            d.scrollbarFiller.style.width = sizes.right + "px";
          } else {
            d.scrollbarFiller.style.display = "";
          }
          if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
            d.gutterFiller.style.display = "block";
            d.gutterFiller.style.height = sizes.bottom + "px";
            d.gutterFiller.style.width = measure.gutterWidth + "px";
          } else {
            d.gutterFiller.style.display = "";
          }
        }
        var scrollbarModel = { "native": NativeScrollbars, "null": NullScrollbars };
        function initScrollbars(cm) {
          if (cm.display.scrollbars) {
            cm.display.scrollbars.clear();
            if (cm.display.scrollbars.addClass) {
              rmClass(cm.display.wrapper, cm.display.scrollbars.addClass);
            }
          }
          cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](function(node) {
            cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
            on(node, "mousedown", function() {
              if (cm.state.focused) {
                setTimeout(function() {
                  return cm.display.input.focus();
                }, 0);
              }
            });
            node.setAttribute("cm-not-content", "true");
          }, function(pos, axis) {
            if (axis == "horizontal") {
              setScrollLeft(cm, pos);
            } else {
              updateScrollTop(cm, pos);
            }
          }, cm);
          if (cm.display.scrollbars.addClass) {
            addClass(cm.display.wrapper, cm.display.scrollbars.addClass);
          }
        }
        var nextOpId = 0;
        function startOperation(cm) {
          cm.curOp = {
            cm,
            viewChanged: false,
            // Flag that indicates that lines might need to be redrawn
            startHeight: cm.doc.height,
            // Used to detect need to update scrollbar
            forceUpdate: false,
            // Used to force a redraw
            updateInput: 0,
            // Whether to reset the input textarea
            typing: false,
            // Whether this reset should be careful to leave existing text (for compositing)
            changeObjs: null,
            // Accumulated changes, for firing change events
            cursorActivityHandlers: null,
            // Set of handlers to fire cursorActivity on
            cursorActivityCalled: 0,
            // Tracks which cursorActivity handlers have been called already
            selectionChanged: false,
            // Whether the selection needs to be redrawn
            updateMaxLine: false,
            // Set when the widest line needs to be determined anew
            scrollLeft: null,
            scrollTop: null,
            // Intermediate scroll position, not pushed to DOM yet
            scrollToPos: null,
            // Used to scroll to a specific position
            focus: false,
            id: ++nextOpId,
            // Unique ID
            markArrays: null
            // Used by addMarkedSpan
          };
          pushOperation(cm.curOp);
        }
        function endOperation(cm) {
          var op = cm.curOp;
          if (op) {
            finishOperation(op, function(group) {
              for (var i2 = 0; i2 < group.ops.length; i2++) {
                group.ops[i2].cm.curOp = null;
              }
              endOperations(group);
            });
          }
        }
        function endOperations(group) {
          var ops = group.ops;
          for (var i2 = 0; i2 < ops.length; i2++) {
            endOperation_R1(ops[i2]);
          }
          for (var i$12 = 0; i$12 < ops.length; i$12++) {
            endOperation_W1(ops[i$12]);
          }
          for (var i$22 = 0; i$22 < ops.length; i$22++) {
            endOperation_R2(ops[i$22]);
          }
          for (var i$3 = 0; i$3 < ops.length; i$3++) {
            endOperation_W2(ops[i$3]);
          }
          for (var i$4 = 0; i$4 < ops.length; i$4++) {
            endOperation_finish(ops[i$4]);
          }
        }
        function endOperation_R1(op) {
          var cm = op.cm, display = cm.display;
          maybeClipScrollbars(cm);
          if (op.updateMaxLine) {
            findMaxLine(cm);
          }
          op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null || op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom || op.scrollToPos.to.line >= display.viewTo) || display.maxLineChanged && cm.options.lineWrapping;
          op.update = op.mustUpdate && new DisplayUpdate(cm, op.mustUpdate && { top: op.scrollTop, ensure: op.scrollToPos }, op.forceUpdate);
        }
        function endOperation_W1(op) {
          op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
        }
        function endOperation_R2(op) {
          var cm = op.cm, display = cm.display;
          if (op.updatedDisplay) {
            updateHeightsInViewport(cm);
          }
          op.barMeasure = measureForScrollbars(cm);
          if (display.maxLineChanged && !cm.options.lineWrapping) {
            op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
            cm.display.sizerWidth = op.adjustWidthTo;
            op.barMeasure.scrollWidth = Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
            op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
          }
          if (op.updatedDisplay || op.selectionChanged) {
            op.preparedSelection = display.input.prepareSelection();
          }
        }
        function endOperation_W2(op) {
          var cm = op.cm;
          if (op.adjustWidthTo != null) {
            cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
            if (op.maxScrollLeft < cm.doc.scrollLeft) {
              setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
            }
            cm.display.maxLineChanged = false;
          }
          var takeFocus = op.focus && op.focus == activeElt(root(cm));
          if (op.preparedSelection) {
            cm.display.input.showSelection(op.preparedSelection, takeFocus);
          }
          if (op.updatedDisplay || op.startHeight != cm.doc.height) {
            updateScrollbars(cm, op.barMeasure);
          }
          if (op.updatedDisplay) {
            setDocumentHeight(cm, op.barMeasure);
          }
          if (op.selectionChanged) {
            restartBlink(cm);
          }
          if (cm.state.focused && op.updateInput) {
            cm.display.input.reset(op.typing);
          }
          if (takeFocus) {
            ensureFocus(op.cm);
          }
        }
        function endOperation_finish(op) {
          var cm = op.cm, display = cm.display, doc3 = cm.doc;
          if (op.updatedDisplay) {
            postUpdateDisplay(cm, op.update);
          }
          if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos)) {
            display.wheelStartX = display.wheelStartY = null;
          }
          if (op.scrollTop != null) {
            setScrollTop(cm, op.scrollTop, op.forceScroll);
          }
          if (op.scrollLeft != null) {
            setScrollLeft(cm, op.scrollLeft, true, true);
          }
          if (op.scrollToPos) {
            var rect = scrollPosIntoView(
              cm,
              clipPos(doc3, op.scrollToPos.from),
              clipPos(doc3, op.scrollToPos.to),
              op.scrollToPos.margin
            );
            maybeScrollWindow(cm, rect);
          }
          var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
          if (hidden) {
            for (var i2 = 0; i2 < hidden.length; ++i2) {
              if (!hidden[i2].lines.length) {
                signal(hidden[i2], "hide");
              }
            }
          }
          if (unhidden) {
            for (var i$12 = 0; i$12 < unhidden.length; ++i$12) {
              if (unhidden[i$12].lines.length) {
                signal(unhidden[i$12], "unhide");
              }
            }
          }
          if (display.wrapper.offsetHeight) {
            doc3.scrollTop = cm.display.scroller.scrollTop;
          }
          if (op.changeObjs) {
            signal(cm, "changes", cm, op.changeObjs);
          }
          if (op.update) {
            op.update.finish();
          }
        }
        function runInOp(cm, f) {
          if (cm.curOp) {
            return f();
          }
          startOperation(cm);
          try {
            return f();
          } finally {
            endOperation(cm);
          }
        }
        function operation(cm, f) {
          return function() {
            if (cm.curOp) {
              return f.apply(cm, arguments);
            }
            startOperation(cm);
            try {
              return f.apply(cm, arguments);
            } finally {
              endOperation(cm);
            }
          };
        }
        function methodOp(f) {
          return function() {
            if (this.curOp) {
              return f.apply(this, arguments);
            }
            startOperation(this);
            try {
              return f.apply(this, arguments);
            } finally {
              endOperation(this);
            }
          };
        }
        function docMethodOp(f) {
          return function() {
            var cm = this.cm;
            if (!cm || cm.curOp) {
              return f.apply(this, arguments);
            }
            startOperation(cm);
            try {
              return f.apply(this, arguments);
            } finally {
              endOperation(cm);
            }
          };
        }
        function startWorker(cm, time) {
          if (cm.doc.highlightFrontier < cm.display.viewTo) {
            cm.state.highlight.set(time, bind(highlightWorker, cm));
          }
        }
        function highlightWorker(cm) {
          var doc3 = cm.doc;
          if (doc3.highlightFrontier >= cm.display.viewTo) {
            return;
          }
          var end = +/* @__PURE__ */ new Date() + cm.options.workTime;
          var context = getContextBefore(cm, doc3.highlightFrontier);
          var changedLines = [];
          doc3.iter(context.line, Math.min(doc3.first + doc3.size, cm.display.viewTo + 500), function(line) {
            if (context.line >= cm.display.viewFrom) {
              var oldStyles = line.styles;
              var resetState = line.text.length > cm.options.maxHighlightLength ? copyState(doc3.mode, context.state) : null;
              var highlighted = highlightLine(cm, line, context, true);
              if (resetState) {
                context.state = resetState;
              }
              line.styles = highlighted.styles;
              var oldCls = line.styleClasses, newCls = highlighted.classes;
              if (newCls) {
                line.styleClasses = newCls;
              } else if (oldCls) {
                line.styleClasses = null;
              }
              var ischange = !oldStyles || oldStyles.length != line.styles.length || oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
              for (var i2 = 0; !ischange && i2 < oldStyles.length; ++i2) {
                ischange = oldStyles[i2] != line.styles[i2];
              }
              if (ischange) {
                changedLines.push(context.line);
              }
              line.stateAfter = context.save();
              context.nextLine();
            } else {
              if (line.text.length <= cm.options.maxHighlightLength) {
                processLine(cm, line.text, context);
              }
              line.stateAfter = context.line % 5 == 0 ? context.save() : null;
              context.nextLine();
            }
            if (+/* @__PURE__ */ new Date() > end) {
              startWorker(cm, cm.options.workDelay);
              return true;
            }
          });
          doc3.highlightFrontier = context.line;
          doc3.modeFrontier = Math.max(doc3.modeFrontier, context.line);
          if (changedLines.length) {
            runInOp(cm, function() {
              for (var i2 = 0; i2 < changedLines.length; i2++) {
                regLineChange(cm, changedLines[i2], "text");
              }
            });
          }
        }
        var DisplayUpdate = function(cm, viewport, force) {
          var display = cm.display;
          this.viewport = viewport;
          this.visible = visibleLines(display, cm.doc, viewport);
          this.editorIsHidden = !display.wrapper.offsetWidth;
          this.wrapperHeight = display.wrapper.clientHeight;
          this.wrapperWidth = display.wrapper.clientWidth;
          this.oldDisplayWidth = displayWidth(cm);
          this.force = force;
          this.dims = getDimensions(cm);
          this.events = [];
        };
        DisplayUpdate.prototype.signal = function(emitter, type) {
          if (hasHandler(emitter, type)) {
            this.events.push(arguments);
          }
        };
        DisplayUpdate.prototype.finish = function() {
          for (var i2 = 0; i2 < this.events.length; i2++) {
            signal.apply(null, this.events[i2]);
          }
        };
        function maybeClipScrollbars(cm) {
          var display = cm.display;
          if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
            display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
            display.heightForcer.style.height = scrollGap(cm) + "px";
            display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
            display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
            display.scrollbarsClipped = true;
          }
        }
        function selectionSnapshot(cm) {
          if (cm.hasFocus()) {
            return null;
          }
          var active = activeElt(root(cm));
          if (!active || !contains(cm.display.lineDiv, active)) {
            return null;
          }
          var result = { activeElt: active };
          if (window.getSelection) {
            var sel = win(cm).getSelection();
            if (sel.anchorNode && sel.extend && contains(cm.display.lineDiv, sel.anchorNode)) {
              result.anchorNode = sel.anchorNode;
              result.anchorOffset = sel.anchorOffset;
              result.focusNode = sel.focusNode;
              result.focusOffset = sel.focusOffset;
            }
          }
          return result;
        }
        function restoreSelection(snapshot) {
          if (!snapshot || !snapshot.activeElt || snapshot.activeElt == activeElt(rootNode(snapshot.activeElt))) {
            return;
          }
          snapshot.activeElt.focus();
          if (!/^(INPUT|TEXTAREA)$/.test(snapshot.activeElt.nodeName) && snapshot.anchorNode && contains(document.body, snapshot.anchorNode) && contains(document.body, snapshot.focusNode)) {
            var doc3 = snapshot.activeElt.ownerDocument;
            var sel = doc3.defaultView.getSelection(), range2 = doc3.createRange();
            range2.setEnd(snapshot.anchorNode, snapshot.anchorOffset);
            range2.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range2);
            sel.extend(snapshot.focusNode, snapshot.focusOffset);
          }
        }
        function updateDisplayIfNeeded(cm, update) {
          var display = cm.display, doc3 = cm.doc;
          if (update.editorIsHidden) {
            resetView(cm);
            return false;
          }
          if (!update.force && update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) && display.renderedView == display.view && countDirtyView(cm) == 0) {
            return false;
          }
          if (maybeUpdateLineNumberWidth(cm)) {
            resetView(cm);
            update.dims = getDimensions(cm);
          }
          var end = doc3.first + doc3.size;
          var from2 = Math.max(update.visible.from - cm.options.viewportMargin, doc3.first);
          var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
          if (display.viewFrom < from2 && from2 - display.viewFrom < 20) {
            from2 = Math.max(doc3.first, display.viewFrom);
          }
          if (display.viewTo > to && display.viewTo - to < 20) {
            to = Math.min(end, display.viewTo);
          }
          if (sawCollapsedSpans) {
            from2 = visualLineNo(cm.doc, from2);
            to = visualLineEndNo(cm.doc, to);
          }
          var different = from2 != display.viewFrom || to != display.viewTo || display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
          adjustView(cm, from2, to);
          display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
          cm.display.mover.style.top = display.viewOffset + "px";
          var toUpdate = countDirtyView(cm);
          if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo)) {
            return false;
          }
          var selSnapshot = selectionSnapshot(cm);
          if (toUpdate > 4) {
            display.lineDiv.style.display = "none";
          }
          patchDisplay(cm, display.updateLineNumbers, update.dims);
          if (toUpdate > 4) {
            display.lineDiv.style.display = "";
          }
          display.renderedView = display.view;
          restoreSelection(selSnapshot);
          removeChildren(display.cursorDiv);
          removeChildren(display.selectionDiv);
          display.gutters.style.height = display.sizer.style.minHeight = 0;
          if (different) {
            display.lastWrapHeight = update.wrapperHeight;
            display.lastWrapWidth = update.wrapperWidth;
            startWorker(cm, 400);
          }
          display.updateLineNumbers = null;
          return true;
        }
        function postUpdateDisplay(cm, update) {
          var viewport = update.viewport;
          for (var first = true; ; first = false) {
            if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == displayWidth(cm)) {
              if (viewport && viewport.top != null) {
                viewport = { top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top) };
              }
              update.visible = visibleLines(cm.display, cm.doc, viewport);
              if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo) {
                break;
              }
            } else if (first) {
              update.visible = visibleLines(cm.display, cm.doc, viewport);
            }
            if (!updateDisplayIfNeeded(cm, update)) {
              break;
            }
            updateHeightsInViewport(cm);
            var barMeasure = measureForScrollbars(cm);
            updateSelection(cm);
            updateScrollbars(cm, barMeasure);
            setDocumentHeight(cm, barMeasure);
            update.force = false;
          }
          update.signal(cm, "update", cm);
          if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
            update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
            cm.display.reportedViewFrom = cm.display.viewFrom;
            cm.display.reportedViewTo = cm.display.viewTo;
          }
        }
        function updateDisplaySimple(cm, viewport) {
          var update = new DisplayUpdate(cm, viewport);
          if (updateDisplayIfNeeded(cm, update)) {
            updateHeightsInViewport(cm);
            postUpdateDisplay(cm, update);
            var barMeasure = measureForScrollbars(cm);
            updateSelection(cm);
            updateScrollbars(cm, barMeasure);
            setDocumentHeight(cm, barMeasure);
            update.finish();
          }
        }
        function patchDisplay(cm, updateNumbersFrom, dims) {
          var display = cm.display, lineNumbers = cm.options.lineNumbers;
          var container = display.lineDiv, cur = container.firstChild;
          function rm(node2) {
            var next = node2.nextSibling;
            if (webkit && mac && cm.display.currentWheelTarget == node2) {
              node2.style.display = "none";
            } else {
              node2.parentNode.removeChild(node2);
            }
            return next;
          }
          var view = display.view, lineN = display.viewFrom;
          for (var i2 = 0; i2 < view.length; i2++) {
            var lineView = view[i2];
            if (lineView.hidden) ;
            else if (!lineView.node || lineView.node.parentNode != container) {
              var node = buildLineElement(cm, lineView, lineN, dims);
              container.insertBefore(node, cur);
            } else {
              while (cur != lineView.node) {
                cur = rm(cur);
              }
              var updateNumber = lineNumbers && updateNumbersFrom != null && updateNumbersFrom <= lineN && lineView.lineNumber;
              if (lineView.changes) {
                if (indexOf(lineView.changes, "gutter") > -1) {
                  updateNumber = false;
                }
                updateLineForChanges(cm, lineView, lineN, dims);
              }
              if (updateNumber) {
                removeChildren(lineView.lineNumber);
                lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
              }
              cur = lineView.node.nextSibling;
            }
            lineN += lineView.size;
          }
          while (cur) {
            cur = rm(cur);
          }
        }
        function updateGutterSpace(display) {
          var width = display.gutters.offsetWidth;
          display.sizer.style.marginLeft = width + "px";
          signalLater(display, "gutterChanged", display);
        }
        function setDocumentHeight(cm, measure) {
          cm.display.sizer.style.minHeight = measure.docHeight + "px";
          cm.display.heightForcer.style.top = measure.docHeight + "px";
          cm.display.gutters.style.height = measure.docHeight + cm.display.barHeight + scrollGap(cm) + "px";
        }
        function alignHorizontally(cm) {
          var display = cm.display, view = display.view;
          if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) {
            return;
          }
          var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
          var gutterW = display.gutters.offsetWidth, left = comp + "px";
          for (var i2 = 0; i2 < view.length; i2++) {
            if (!view[i2].hidden) {
              if (cm.options.fixedGutter) {
                if (view[i2].gutter) {
                  view[i2].gutter.style.left = left;
                }
                if (view[i2].gutterBackground) {
                  view[i2].gutterBackground.style.left = left;
                }
              }
              var align = view[i2].alignable;
              if (align) {
                for (var j = 0; j < align.length; j++) {
                  align[j].style.left = left;
                }
              }
            }
          }
          if (cm.options.fixedGutter) {
            display.gutters.style.left = comp + gutterW + "px";
          }
        }
        function maybeUpdateLineNumberWidth(cm) {
          if (!cm.options.lineNumbers) {
            return false;
          }
          var doc3 = cm.doc, last2 = lineNumberFor(cm.options, doc3.first + doc3.size - 1), display = cm.display;
          if (last2.length != display.lineNumChars) {
            var test = display.measure.appendChild(elt(
              "div",
              [elt("div", last2)],
              "CodeMirror-linenumber CodeMirror-gutter-elt"
            ));
            var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
            display.lineGutter.style.width = "";
            display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
            display.lineNumWidth = display.lineNumInnerWidth + padding;
            display.lineNumChars = display.lineNumInnerWidth ? last2.length : -1;
            display.lineGutter.style.width = display.lineNumWidth + "px";
            updateGutterSpace(cm.display);
            return true;
          }
          return false;
        }
        function getGutters(gutters, lineNumbers) {
          var result = [], sawLineNumbers = false;
          for (var i2 = 0; i2 < gutters.length; i2++) {
            var name = gutters[i2], style = null;
            if (typeof name != "string") {
              style = name.style;
              name = name.className;
            }
            if (name == "CodeMirror-linenumbers") {
              if (!lineNumbers) {
                continue;
              } else {
                sawLineNumbers = true;
              }
            }
            result.push({ className: name, style });
          }
          if (lineNumbers && !sawLineNumbers) {
            result.push({ className: "CodeMirror-linenumbers", style: null });
          }
          return result;
        }
        function renderGutters(display) {
          var gutters = display.gutters, specs = display.gutterSpecs;
          removeChildren(gutters);
          display.lineGutter = null;
          for (var i2 = 0; i2 < specs.length; ++i2) {
            var ref = specs[i2];
            var className = ref.className;
            var style = ref.style;
            var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + className));
            if (style) {
              gElt.style.cssText = style;
            }
            if (className == "CodeMirror-linenumbers") {
              display.lineGutter = gElt;
              gElt.style.width = (display.lineNumWidth || 1) + "px";
            }
          }
          gutters.style.display = specs.length ? "" : "none";
          updateGutterSpace(display);
        }
        function updateGutters(cm) {
          renderGutters(cm.display);
          regChange(cm);
          alignHorizontally(cm);
        }
        function Display(place, doc3, input, options) {
          var d = this;
          this.input = input;
          d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
          d.scrollbarFiller.setAttribute("cm-not-content", "true");
          d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
          d.gutterFiller.setAttribute("cm-not-content", "true");
          d.lineDiv = eltP("div", null, "CodeMirror-code");
          d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
          d.cursorDiv = elt("div", null, "CodeMirror-cursors");
          d.measure = elt("div", null, "CodeMirror-measure");
          d.lineMeasure = elt("div", null, "CodeMirror-measure");
          d.lineSpace = eltP(
            "div",
            [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv],
            null,
            "position: relative; outline: none"
          );
          var lines = eltP("div", [d.lineSpace], "CodeMirror-lines");
          d.mover = elt("div", [lines], null, "position: relative");
          d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
          d.sizerWidth = null;
          d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;");
          d.gutters = elt("div", null, "CodeMirror-gutters");
          d.lineGutter = null;
          d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
          d.scroller.setAttribute("tabIndex", "-1");
          d.wrapper = elt("div", [d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");
          if (chrome && chrome_version === 105) {
            d.wrapper.style.clipPath = "inset(0px)";
          }
          d.wrapper.setAttribute("translate", "no");
          if (ie && ie_version < 8) {
            d.gutters.style.zIndex = -1;
            d.scroller.style.paddingRight = 0;
          }
          if (!webkit && !(gecko && mobile)) {
            d.scroller.draggable = true;
          }
          if (place) {
            if (place.appendChild) {
              place.appendChild(d.wrapper);
            } else {
              place(d.wrapper);
            }
          }
          d.viewFrom = d.viewTo = doc3.first;
          d.reportedViewFrom = d.reportedViewTo = doc3.first;
          d.view = [];
          d.renderedView = null;
          d.externalMeasured = null;
          d.viewOffset = 0;
          d.lastWrapHeight = d.lastWrapWidth = 0;
          d.updateLineNumbers = null;
          d.nativeBarWidth = d.barHeight = d.barWidth = 0;
          d.scrollbarsClipped = false;
          d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
          d.alignWidgets = false;
          d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
          d.maxLine = null;
          d.maxLineLength = 0;
          d.maxLineChanged = false;
          d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;
          d.shift = false;
          d.selForContextMenu = null;
          d.activeTouch = null;
          d.gutterSpecs = getGutters(options.gutters, options.lineNumbers);
          renderGutters(d);
          input.init(d);
        }
        var wheelSamples = 0, wheelPixelsPerUnit = null;
        if (ie) {
          wheelPixelsPerUnit = -0.53;
        } else if (gecko) {
          wheelPixelsPerUnit = 15;
        } else if (chrome) {
          wheelPixelsPerUnit = -0.7;
        } else if (safari) {
          wheelPixelsPerUnit = -1 / 3;
        }
        function wheelEventDelta(e) {
          var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
          if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) {
            dx = e.detail;
          }
          if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) {
            dy = e.detail;
          } else if (dy == null) {
            dy = e.wheelDelta;
          }
          return { x: dx, y: dy };
        }
        function wheelEventPixels(e) {
          var delta = wheelEventDelta(e);
          delta.x *= wheelPixelsPerUnit;
          delta.y *= wheelPixelsPerUnit;
          return delta;
        }
        function onScrollWheel(cm, e) {
          if (chrome && chrome_version == 102) {
            if (cm.display.chromeScrollHack == null) {
              cm.display.sizer.style.pointerEvents = "none";
            } else {
              clearTimeout(cm.display.chromeScrollHack);
            }
            cm.display.chromeScrollHack = setTimeout(function() {
              cm.display.chromeScrollHack = null;
              cm.display.sizer.style.pointerEvents = "";
            }, 100);
          }
          var delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;
          var pixelsPerUnit = wheelPixelsPerUnit;
          if (e.deltaMode === 0) {
            dx = e.deltaX;
            dy = e.deltaY;
            pixelsPerUnit = 1;
          }
          var display = cm.display, scroll = display.scroller;
          var canScrollX = scroll.scrollWidth > scroll.clientWidth;
          var canScrollY = scroll.scrollHeight > scroll.clientHeight;
          if (!(dx && canScrollX || dy && canScrollY)) {
            return;
          }
          if (dy && mac && webkit) {
            outer: for (var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
              for (var i2 = 0; i2 < view.length; i2++) {
                if (view[i2].node == cur) {
                  cm.display.currentWheelTarget = cur;
                  break outer;
                }
              }
            }
          }
          if (dx && !gecko && !presto && pixelsPerUnit != null) {
            if (dy && canScrollY) {
              updateScrollTop(cm, Math.max(0, scroll.scrollTop + dy * pixelsPerUnit));
            }
            setScrollLeft(cm, Math.max(0, scroll.scrollLeft + dx * pixelsPerUnit));
            if (!dy || dy && canScrollY) {
              e_preventDefault(e);
            }
            display.wheelStartX = null;
            return;
          }
          if (dy && pixelsPerUnit != null) {
            var pixels = dy * pixelsPerUnit;
            var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
            if (pixels < 0) {
              top = Math.max(0, top + pixels - 50);
            } else {
              bot = Math.min(cm.doc.height, bot + pixels + 50);
            }
            updateDisplaySimple(cm, { top, bottom: bot });
          }
          if (wheelSamples < 20 && e.deltaMode !== 0) {
            if (display.wheelStartX == null) {
              display.wheelStartX = scroll.scrollLeft;
              display.wheelStartY = scroll.scrollTop;
              display.wheelDX = dx;
              display.wheelDY = dy;
              setTimeout(function() {
                if (display.wheelStartX == null) {
                  return;
                }
                var movedX = scroll.scrollLeft - display.wheelStartX;
                var movedY = scroll.scrollTop - display.wheelStartY;
                var sample = movedY && display.wheelDY && movedY / display.wheelDY || movedX && display.wheelDX && movedX / display.wheelDX;
                display.wheelStartX = display.wheelStartY = null;
                if (!sample) {
                  return;
                }
                wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
                ++wheelSamples;
              }, 200);
            } else {
              display.wheelDX += dx;
              display.wheelDY += dy;
            }
          }
        }
        var Selection = function(ranges, primIndex) {
          this.ranges = ranges;
          this.primIndex = primIndex;
        };
        Selection.prototype.primary = function() {
          return this.ranges[this.primIndex];
        };
        Selection.prototype.equals = function(other) {
          if (other == this) {
            return true;
          }
          if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) {
            return false;
          }
          for (var i2 = 0; i2 < this.ranges.length; i2++) {
            var here = this.ranges[i2], there = other.ranges[i2];
            if (!equalCursorPos(here.anchor, there.anchor) || !equalCursorPos(here.head, there.head)) {
              return false;
            }
          }
          return true;
        };
        Selection.prototype.deepCopy = function() {
          var out = [];
          for (var i2 = 0; i2 < this.ranges.length; i2++) {
            out[i2] = new Range(copyPos(this.ranges[i2].anchor), copyPos(this.ranges[i2].head));
          }
          return new Selection(out, this.primIndex);
        };
        Selection.prototype.somethingSelected = function() {
          for (var i2 = 0; i2 < this.ranges.length; i2++) {
            if (!this.ranges[i2].empty()) {
              return true;
            }
          }
          return false;
        };
        Selection.prototype.contains = function(pos, end) {
          if (!end) {
            end = pos;
          }
          for (var i2 = 0; i2 < this.ranges.length; i2++) {
            var range2 = this.ranges[i2];
            if (cmp(end, range2.from()) >= 0 && cmp(pos, range2.to()) <= 0) {
              return i2;
            }
          }
          return -1;
        };
        var Range = function(anchor, head) {
          this.anchor = anchor;
          this.head = head;
        };
        Range.prototype.from = function() {
          return minPos(this.anchor, this.head);
        };
        Range.prototype.to = function() {
          return maxPos(this.anchor, this.head);
        };
        Range.prototype.empty = function() {
          return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
        };
        function normalizeSelection(cm, ranges, primIndex) {
          var mayTouch = cm && cm.options.selectionsMayTouch;
          var prim = ranges[primIndex];
          ranges.sort(function(a, b) {
            return cmp(a.from(), b.from());
          });
          primIndex = indexOf(ranges, prim);
          for (var i2 = 1; i2 < ranges.length; i2++) {
            var cur = ranges[i2], prev = ranges[i2 - 1];
            var diff = cmp(prev.to(), cur.from());
            if (mayTouch && !cur.empty() ? diff > 0 : diff >= 0) {
              var from2 = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
              var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
              if (i2 <= primIndex) {
                --primIndex;
              }
              ranges.splice(--i2, 2, new Range(inv ? to : from2, inv ? from2 : to));
            }
          }
          return new Selection(ranges, primIndex);
        }
        function simpleSelection(anchor, head) {
          return new Selection([new Range(anchor, head || anchor)], 0);
        }
        function changeEnd(change) {
          if (!change.text) {
            return change.to;
          }
          return Pos(
            change.from.line + change.text.length - 1,
            lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0)
          );
        }
        function adjustForChange(pos, change) {
          if (cmp(pos, change.from) < 0) {
            return pos;
          }
          if (cmp(pos, change.to) <= 0) {
            return changeEnd(change);
          }
          var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
          if (pos.line == change.to.line) {
            ch += changeEnd(change).ch - change.to.ch;
          }
          return Pos(line, ch);
        }
        function computeSelAfterChange(doc3, change) {
          var out = [];
          for (var i2 = 0; i2 < doc3.sel.ranges.length; i2++) {
            var range2 = doc3.sel.ranges[i2];
            out.push(new Range(
              adjustForChange(range2.anchor, change),
              adjustForChange(range2.head, change)
            ));
          }
          return normalizeSelection(doc3.cm, out, doc3.sel.primIndex);
        }
        function offsetPos(pos, old, nw) {
          if (pos.line == old.line) {
            return Pos(nw.line, pos.ch - old.ch + nw.ch);
          } else {
            return Pos(nw.line + (pos.line - old.line), pos.ch);
          }
        }
        function computeReplacedSel(doc3, changes, hint) {
          var out = [];
          var oldPrev = Pos(doc3.first, 0), newPrev = oldPrev;
          for (var i2 = 0; i2 < changes.length; i2++) {
            var change = changes[i2];
            var from2 = offsetPos(change.from, oldPrev, newPrev);
            var to = offsetPos(changeEnd(change), oldPrev, newPrev);
            oldPrev = change.to;
            newPrev = to;
            if (hint == "around") {
              var range2 = doc3.sel.ranges[i2], inv = cmp(range2.head, range2.anchor) < 0;
              out[i2] = new Range(inv ? to : from2, inv ? from2 : to);
            } else {
              out[i2] = new Range(from2, from2);
            }
          }
          return new Selection(out, doc3.sel.primIndex);
        }
        function loadMode(cm) {
          cm.doc.mode = getMode(cm.options, cm.doc.modeOption);
          resetModeState(cm);
        }
        function resetModeState(cm) {
          cm.doc.iter(function(line) {
            if (line.stateAfter) {
              line.stateAfter = null;
            }
            if (line.styles) {
              line.styles = null;
            }
          });
          cm.doc.modeFrontier = cm.doc.highlightFrontier = cm.doc.first;
          startWorker(cm, 100);
          cm.state.modeGen++;
          if (cm.curOp) {
            regChange(cm);
          }
        }
        function isWholeLineUpdate(doc3, change) {
          return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" && (!doc3.cm || doc3.cm.options.wholeLineUpdateBefore);
        }
        function updateDoc(doc3, change, markedSpans, estimateHeight2) {
          function spansFor(n) {
            return markedSpans ? markedSpans[n] : null;
          }
          function update(line, text3, spans) {
            updateLine(line, text3, spans, estimateHeight2);
            signalLater(line, "change", line, change);
          }
          function linesFor(start, end) {
            var result = [];
            for (var i2 = start; i2 < end; ++i2) {
              result.push(new Line(text2[i2], spansFor(i2), estimateHeight2));
            }
            return result;
          }
          var from2 = change.from, to = change.to, text2 = change.text;
          var firstLine = getLine(doc3, from2.line), lastLine = getLine(doc3, to.line);
          var lastText = lst(text2), lastSpans = spansFor(text2.length - 1), nlines = to.line - from2.line;
          if (change.full) {
            doc3.insert(0, linesFor(0, text2.length));
            doc3.remove(text2.length, doc3.size - text2.length);
          } else if (isWholeLineUpdate(doc3, change)) {
            var added = linesFor(0, text2.length - 1);
            update(lastLine, lastLine.text, lastSpans);
            if (nlines) {
              doc3.remove(from2.line, nlines);
            }
            if (added.length) {
              doc3.insert(from2.line, added);
            }
          } else if (firstLine == lastLine) {
            if (text2.length == 1) {
              update(firstLine, firstLine.text.slice(0, from2.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
            } else {
              var added$1 = linesFor(1, text2.length - 1);
              added$1.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight2));
              update(firstLine, firstLine.text.slice(0, from2.ch) + text2[0], spansFor(0));
              doc3.insert(from2.line + 1, added$1);
            }
          } else if (text2.length == 1) {
            update(firstLine, firstLine.text.slice(0, from2.ch) + text2[0] + lastLine.text.slice(to.ch), spansFor(0));
            doc3.remove(from2.line + 1, nlines);
          } else {
            update(firstLine, firstLine.text.slice(0, from2.ch) + text2[0], spansFor(0));
            update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
            var added$2 = linesFor(1, text2.length - 1);
            if (nlines > 1) {
              doc3.remove(from2.line + 1, nlines - 1);
            }
            doc3.insert(from2.line + 1, added$2);
          }
          signalLater(doc3, "change", doc3, change);
        }
        function linkedDocs(doc3, f, sharedHistOnly) {
          function propagate(doc4, skip, sharedHist) {
            if (doc4.linked) {
              for (var i2 = 0; i2 < doc4.linked.length; ++i2) {
                var rel = doc4.linked[i2];
                if (rel.doc == skip) {
                  continue;
                }
                var shared = sharedHist && rel.sharedHist;
                if (sharedHistOnly && !shared) {
                  continue;
                }
                f(rel.doc, shared);
                propagate(rel.doc, doc4, shared);
              }
            }
          }
          propagate(doc3, null, true);
        }
        function attachDoc(cm, doc3) {
          if (doc3.cm) {
            throw new Error("This document is already in use.");
          }
          cm.doc = doc3;
          doc3.cm = cm;
          estimateLineHeights(cm);
          loadMode(cm);
          setDirectionClass(cm);
          cm.options.direction = doc3.direction;
          if (!cm.options.lineWrapping) {
            findMaxLine(cm);
          }
          cm.options.mode = doc3.modeOption;
          regChange(cm);
        }
        function setDirectionClass(cm) {
          (cm.doc.direction == "rtl" ? addClass : rmClass)(cm.display.lineDiv, "CodeMirror-rtl");
        }
        function directionChanged(cm) {
          runInOp(cm, function() {
            setDirectionClass(cm);
            regChange(cm);
          });
        }
        function History(prev) {
          this.done = [];
          this.undone = [];
          this.undoDepth = prev ? prev.undoDepth : Infinity;
          this.lastModTime = this.lastSelTime = 0;
          this.lastOp = this.lastSelOp = null;
          this.lastOrigin = this.lastSelOrigin = null;
          this.generation = this.maxGeneration = prev ? prev.maxGeneration : 1;
        }
        function historyChangeFromChange(doc3, change) {
          var histChange = { from: copyPos(change.from), to: changeEnd(change), text: getBetween(doc3, change.from, change.to) };
          attachLocalSpans(doc3, histChange, change.from.line, change.to.line + 1);
          linkedDocs(doc3, function(doc4) {
            return attachLocalSpans(doc4, histChange, change.from.line, change.to.line + 1);
          }, true);
          return histChange;
        }
        function clearSelectionEvents(array) {
          while (array.length) {
            var last2 = lst(array);
            if (last2.ranges) {
              array.pop();
            } else {
              break;
            }
          }
        }
        function lastChangeEvent(hist, force) {
          if (force) {
            clearSelectionEvents(hist.done);
            return lst(hist.done);
          } else if (hist.done.length && !lst(hist.done).ranges) {
            return lst(hist.done);
          } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
            hist.done.pop();
            return lst(hist.done);
          }
        }
        function addChangeToHistory(doc3, change, selAfter, opId) {
          var hist = doc3.history;
          hist.undone.length = 0;
          var time = +/* @__PURE__ */ new Date(), cur;
          var last2;
          if ((hist.lastOp == opId || hist.lastOrigin == change.origin && change.origin && (change.origin.charAt(0) == "+" && hist.lastModTime > time - (doc3.cm ? doc3.cm.options.historyEventDelay : 500) || change.origin.charAt(0) == "*")) && (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
            last2 = lst(cur.changes);
            if (cmp(change.from, change.to) == 0 && cmp(change.from, last2.to) == 0) {
              last2.to = changeEnd(change);
            } else {
              cur.changes.push(historyChangeFromChange(doc3, change));
            }
          } else {
            var before = lst(hist.done);
            if (!before || !before.ranges) {
              pushSelectionToHistory(doc3.sel, hist.done);
            }
            cur = {
              changes: [historyChangeFromChange(doc3, change)],
              generation: hist.generation
            };
            hist.done.push(cur);
            while (hist.done.length > hist.undoDepth) {
              hist.done.shift();
              if (!hist.done[0].ranges) {
                hist.done.shift();
              }
            }
          }
          hist.done.push(selAfter);
          hist.generation = ++hist.maxGeneration;
          hist.lastModTime = hist.lastSelTime = time;
          hist.lastOp = hist.lastSelOp = opId;
          hist.lastOrigin = hist.lastSelOrigin = change.origin;
          if (!last2) {
            signal(doc3, "historyAdded");
          }
        }
        function selectionEventCanBeMerged(doc3, origin, prev, sel) {
          var ch = origin.charAt(0);
          return ch == "*" || ch == "+" && prev.ranges.length == sel.ranges.length && prev.somethingSelected() == sel.somethingSelected() && /* @__PURE__ */ new Date() - doc3.history.lastSelTime <= (doc3.cm ? doc3.cm.options.historyEventDelay : 500);
        }
        function addSelectionToHistory(doc3, sel, opId, options) {
          var hist = doc3.history, origin = options && options.origin;
          if (opId == hist.lastSelOp || origin && hist.lastSelOrigin == origin && (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin || selectionEventCanBeMerged(doc3, origin, lst(hist.done), sel))) {
            hist.done[hist.done.length - 1] = sel;
          } else {
            pushSelectionToHistory(sel, hist.done);
          }
          hist.lastSelTime = +/* @__PURE__ */ new Date();
          hist.lastSelOrigin = origin;
          hist.lastSelOp = opId;
          if (options && options.clearRedo !== false) {
            clearSelectionEvents(hist.undone);
          }
        }
        function pushSelectionToHistory(sel, dest) {
          var top = lst(dest);
          if (!(top && top.ranges && top.equals(sel))) {
            dest.push(sel);
          }
        }
        function attachLocalSpans(doc3, change, from2, to) {
          var existing = change["spans_" + doc3.id], n = 0;
          doc3.iter(Math.max(doc3.first, from2), Math.min(doc3.first + doc3.size, to), function(line) {
            if (line.markedSpans) {
              (existing || (existing = change["spans_" + doc3.id] = {}))[n] = line.markedSpans;
            }
            ++n;
          });
        }
        function removeClearedSpans(spans) {
          if (!spans) {
            return null;
          }
          var out;
          for (var i2 = 0; i2 < spans.length; ++i2) {
            if (spans[i2].marker.explicitlyCleared) {
              if (!out) {
                out = spans.slice(0, i2);
              }
            } else if (out) {
              out.push(spans[i2]);
            }
          }
          return !out ? spans : out.length ? out : null;
        }
        function getOldSpans(doc3, change) {
          var found = change["spans_" + doc3.id];
          if (!found) {
            return null;
          }
          var nw = [];
          for (var i2 = 0; i2 < change.text.length; ++i2) {
            nw.push(removeClearedSpans(found[i2]));
          }
          return nw;
        }
        function mergeOldSpans(doc3, change) {
          var old = getOldSpans(doc3, change);
          var stretched = stretchSpansOverChange(doc3, change);
          if (!old) {
            return stretched;
          }
          if (!stretched) {
            return old;
          }
          for (var i2 = 0; i2 < old.length; ++i2) {
            var oldCur = old[i2], stretchCur = stretched[i2];
            if (oldCur && stretchCur) {
              spans: for (var j = 0; j < stretchCur.length; ++j) {
                var span = stretchCur[j];
                for (var k = 0; k < oldCur.length; ++k) {
                  if (oldCur[k].marker == span.marker) {
                    continue spans;
                  }
                }
                oldCur.push(span);
              }
            } else if (stretchCur) {
              old[i2] = stretchCur;
            }
          }
          return old;
        }
        function copyHistoryArray(events, newGroup, instantiateSel) {
          var copy2 = [];
          for (var i2 = 0; i2 < events.length; ++i2) {
            var event = events[i2];
            if (event.ranges) {
              copy2.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
              continue;
            }
            var changes = event.changes, newChanges = [];
            copy2.push({ changes: newChanges });
            for (var j = 0; j < changes.length; ++j) {
              var change = changes[j], m = void 0;
              newChanges.push({ from: change.from, to: change.to, text: change.text });
              if (newGroup) {
                for (var prop2 in change) {
                  if (m = prop2.match(/^spans_(\d+)$/)) {
                    if (indexOf(newGroup, Number(m[1])) > -1) {
                      lst(newChanges)[prop2] = change[prop2];
                      delete change[prop2];
                    }
                  }
                }
              }
            }
          }
          return copy2;
        }
        function extendRange(range2, head, other, extend) {
          if (extend) {
            var anchor = range2.anchor;
            if (other) {
              var posBefore = cmp(head, anchor) < 0;
              if (posBefore != cmp(other, anchor) < 0) {
                anchor = head;
                head = other;
              } else if (posBefore != cmp(head, other) < 0) {
                head = other;
              }
            }
            return new Range(anchor, head);
          } else {
            return new Range(other || head, head);
          }
        }
        function extendSelection(doc3, head, other, options, extend) {
          if (extend == null) {
            extend = doc3.cm && (doc3.cm.display.shift || doc3.extend);
          }
          setSelection(doc3, new Selection([extendRange(doc3.sel.primary(), head, other, extend)], 0), options);
        }
        function extendSelections(doc3, heads, options) {
          var out = [];
          var extend = doc3.cm && (doc3.cm.display.shift || doc3.extend);
          for (var i2 = 0; i2 < doc3.sel.ranges.length; i2++) {
            out[i2] = extendRange(doc3.sel.ranges[i2], heads[i2], null, extend);
          }
          var newSel = normalizeSelection(doc3.cm, out, doc3.sel.primIndex);
          setSelection(doc3, newSel, options);
        }
        function replaceOneSelection(doc3, i2, range2, options) {
          var ranges = doc3.sel.ranges.slice(0);
          ranges[i2] = range2;
          setSelection(doc3, normalizeSelection(doc3.cm, ranges, doc3.sel.primIndex), options);
        }
        function setSimpleSelection(doc3, anchor, head, options) {
          setSelection(doc3, simpleSelection(anchor, head), options);
        }
        function filterSelectionChange(doc3, sel, options) {
          var obj = {
            ranges: sel.ranges,
            update: function(ranges) {
              this.ranges = [];
              for (var i2 = 0; i2 < ranges.length; i2++) {
                this.ranges[i2] = new Range(
                  clipPos(doc3, ranges[i2].anchor),
                  clipPos(doc3, ranges[i2].head)
                );
              }
            },
            origin: options && options.origin
          };
          signal(doc3, "beforeSelectionChange", doc3, obj);
          if (doc3.cm) {
            signal(doc3.cm, "beforeSelectionChange", doc3.cm, obj);
          }
          if (obj.ranges != sel.ranges) {
            return normalizeSelection(doc3.cm, obj.ranges, obj.ranges.length - 1);
          } else {
            return sel;
          }
        }
        function setSelectionReplaceHistory(doc3, sel, options) {
          var done = doc3.history.done, last2 = lst(done);
          if (last2 && last2.ranges) {
            done[done.length - 1] = sel;
            setSelectionNoUndo(doc3, sel, options);
          } else {
            setSelection(doc3, sel, options);
          }
        }
        function setSelection(doc3, sel, options) {
          setSelectionNoUndo(doc3, sel, options);
          addSelectionToHistory(doc3, doc3.sel, doc3.cm ? doc3.cm.curOp.id : NaN, options);
        }
        function setSelectionNoUndo(doc3, sel, options) {
          if (hasHandler(doc3, "beforeSelectionChange") || doc3.cm && hasHandler(doc3.cm, "beforeSelectionChange")) {
            sel = filterSelectionChange(doc3, sel, options);
          }
          var bias = options && options.bias || (cmp(sel.primary().head, doc3.sel.primary().head) < 0 ? -1 : 1);
          setSelectionInner(doc3, skipAtomicInSelection(doc3, sel, bias, true));
          if (!(options && options.scroll === false) && doc3.cm && doc3.cm.getOption("readOnly") != "nocursor") {
            ensureCursorVisible(doc3.cm);
          }
        }
        function setSelectionInner(doc3, sel) {
          if (sel.equals(doc3.sel)) {
            return;
          }
          doc3.sel = sel;
          if (doc3.cm) {
            doc3.cm.curOp.updateInput = 1;
            doc3.cm.curOp.selectionChanged = true;
            signalCursorActivity(doc3.cm);
          }
          signalLater(doc3, "cursorActivity", doc3);
        }
        function reCheckSelection(doc3) {
          setSelectionInner(doc3, skipAtomicInSelection(doc3, doc3.sel, null, false));
        }
        function skipAtomicInSelection(doc3, sel, bias, mayClear) {
          var out;
          for (var i2 = 0; i2 < sel.ranges.length; i2++) {
            var range2 = sel.ranges[i2];
            var old = sel.ranges.length == doc3.sel.ranges.length && doc3.sel.ranges[i2];
            var newAnchor = skipAtomic(doc3, range2.anchor, old && old.anchor, bias, mayClear);
            var newHead = range2.head == range2.anchor ? newAnchor : skipAtomic(doc3, range2.head, old && old.head, bias, mayClear);
            if (out || newAnchor != range2.anchor || newHead != range2.head) {
              if (!out) {
                out = sel.ranges.slice(0, i2);
              }
              out[i2] = new Range(newAnchor, newHead);
            }
          }
          return out ? normalizeSelection(doc3.cm, out, sel.primIndex) : sel;
        }
        function skipAtomicInner(doc3, pos, oldPos, dir, mayClear) {
          var line = getLine(doc3, pos.line);
          if (line.markedSpans) {
            for (var i2 = 0; i2 < line.markedSpans.length; ++i2) {
              var sp = line.markedSpans[i2], m = sp.marker;
              var preventCursorLeft = "selectLeft" in m ? !m.selectLeft : m.inclusiveLeft;
              var preventCursorRight = "selectRight" in m ? !m.selectRight : m.inclusiveRight;
              if ((sp.from == null || (preventCursorLeft ? sp.from <= pos.ch : sp.from < pos.ch)) && (sp.to == null || (preventCursorRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
                if (mayClear) {
                  signal(m, "beforeCursorEnter");
                  if (m.explicitlyCleared) {
                    if (!line.markedSpans) {
                      break;
                    } else {
                      --i2;
                      continue;
                    }
                  }
                }
                if (!m.atomic) {
                  continue;
                }
                if (oldPos) {
                  var near = m.find(dir < 0 ? 1 : -1), diff = void 0;
                  if (dir < 0 ? preventCursorRight : preventCursorLeft) {
                    near = movePos(doc3, near, -dir, near && near.line == pos.line ? line : null);
                  }
                  if (near && near.line == pos.line && (diff = cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0)) {
                    return skipAtomicInner(doc3, near, pos, dir, mayClear);
                  }
                }
                var far = m.find(dir < 0 ? -1 : 1);
                if (dir < 0 ? preventCursorLeft : preventCursorRight) {
                  far = movePos(doc3, far, dir, far.line == pos.line ? line : null);
                }
                return far ? skipAtomicInner(doc3, far, pos, dir, mayClear) : null;
              }
            }
          }
          return pos;
        }
        function skipAtomic(doc3, pos, oldPos, bias, mayClear) {
          var dir = bias || 1;
          var found = skipAtomicInner(doc3, pos, oldPos, dir, mayClear) || !mayClear && skipAtomicInner(doc3, pos, oldPos, dir, true) || skipAtomicInner(doc3, pos, oldPos, -dir, mayClear) || !mayClear && skipAtomicInner(doc3, pos, oldPos, -dir, true);
          if (!found) {
            doc3.cantEdit = true;
            return Pos(doc3.first, 0);
          }
          return found;
        }
        function movePos(doc3, pos, dir, line) {
          if (dir < 0 && pos.ch == 0) {
            if (pos.line > doc3.first) {
              return clipPos(doc3, Pos(pos.line - 1));
            } else {
              return null;
            }
          } else if (dir > 0 && pos.ch == (line || getLine(doc3, pos.line)).text.length) {
            if (pos.line < doc3.first + doc3.size - 1) {
              return Pos(pos.line + 1, 0);
            } else {
              return null;
            }
          } else {
            return new Pos(pos.line, pos.ch + dir);
          }
        }
        function selectAll(cm) {
          cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);
        }
        function filterChange(doc3, change, update) {
          var obj = {
            canceled: false,
            from: change.from,
            to: change.to,
            text: change.text,
            origin: change.origin,
            cancel: function() {
              return obj.canceled = true;
            }
          };
          if (update) {
            obj.update = function(from2, to, text2, origin) {
              if (from2) {
                obj.from = clipPos(doc3, from2);
              }
              if (to) {
                obj.to = clipPos(doc3, to);
              }
              if (text2) {
                obj.text = text2;
              }
              if (origin !== void 0) {
                obj.origin = origin;
              }
            };
          }
          signal(doc3, "beforeChange", doc3, obj);
          if (doc3.cm) {
            signal(doc3.cm, "beforeChange", doc3.cm, obj);
          }
          if (obj.canceled) {
            if (doc3.cm) {
              doc3.cm.curOp.updateInput = 2;
            }
            return null;
          }
          return { from: obj.from, to: obj.to, text: obj.text, origin: obj.origin };
        }
        function makeChange(doc3, change, ignoreReadOnly) {
          if (doc3.cm) {
            if (!doc3.cm.curOp) {
              return operation(doc3.cm, makeChange)(doc3, change, ignoreReadOnly);
            }
            if (doc3.cm.state.suppressEdits) {
              return;
            }
          }
          if (hasHandler(doc3, "beforeChange") || doc3.cm && hasHandler(doc3.cm, "beforeChange")) {
            change = filterChange(doc3, change, true);
            if (!change) {
              return;
            }
          }
          var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc3, change.from, change.to);
          if (split) {
            for (var i2 = split.length - 1; i2 >= 0; --i2) {
              makeChangeInner(doc3, { from: split[i2].from, to: split[i2].to, text: i2 ? [""] : change.text, origin: change.origin });
            }
          } else {
            makeChangeInner(doc3, change);
          }
        }
        function makeChangeInner(doc3, change) {
          if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) {
            return;
          }
          var selAfter = computeSelAfterChange(doc3, change);
          addChangeToHistory(doc3, change, selAfter, doc3.cm ? doc3.cm.curOp.id : NaN);
          makeChangeSingleDoc(doc3, change, selAfter, stretchSpansOverChange(doc3, change));
          var rebased = [];
          linkedDocs(doc3, function(doc4, sharedHist) {
            if (!sharedHist && indexOf(rebased, doc4.history) == -1) {
              rebaseHist(doc4.history, change);
              rebased.push(doc4.history);
            }
            makeChangeSingleDoc(doc4, change, null, stretchSpansOverChange(doc4, change));
          });
        }
        function makeChangeFromHistory(doc3, type, allowSelectionOnly) {
          var suppress = doc3.cm && doc3.cm.state.suppressEdits;
          if (suppress && !allowSelectionOnly) {
            return;
          }
          var hist = doc3.history, event, selAfter = doc3.sel;
          var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;
          var i2 = 0;
          for (; i2 < source.length; i2++) {
            event = source[i2];
            if (allowSelectionOnly ? event.ranges && !event.equals(doc3.sel) : !event.ranges) {
              break;
            }
          }
          if (i2 == source.length) {
            return;
          }
          hist.lastOrigin = hist.lastSelOrigin = null;
          for (; ; ) {
            event = source.pop();
            if (event.ranges) {
              pushSelectionToHistory(event, dest);
              if (allowSelectionOnly && !event.equals(doc3.sel)) {
                setSelection(doc3, event, { clearRedo: false });
                return;
              }
              selAfter = event;
            } else if (suppress) {
              source.push(event);
              return;
            } else {
              break;
            }
          }
          var antiChanges = [];
          pushSelectionToHistory(selAfter, dest);
          dest.push({ changes: antiChanges, generation: hist.generation });
          hist.generation = event.generation || ++hist.maxGeneration;
          var filter = hasHandler(doc3, "beforeChange") || doc3.cm && hasHandler(doc3.cm, "beforeChange");
          var loop = function(i3) {
            var change = event.changes[i3];
            change.origin = type;
            if (filter && !filterChange(doc3, change, false)) {
              source.length = 0;
              return {};
            }
            antiChanges.push(historyChangeFromChange(doc3, change));
            var after = i3 ? computeSelAfterChange(doc3, change) : lst(source);
            makeChangeSingleDoc(doc3, change, after, mergeOldSpans(doc3, change));
            if (!i3 && doc3.cm) {
              doc3.cm.scrollIntoView({ from: change.from, to: changeEnd(change) });
            }
            var rebased = [];
            linkedDocs(doc3, function(doc4, sharedHist) {
              if (!sharedHist && indexOf(rebased, doc4.history) == -1) {
                rebaseHist(doc4.history, change);
                rebased.push(doc4.history);
              }
              makeChangeSingleDoc(doc4, change, null, mergeOldSpans(doc4, change));
            });
          };
          for (var i$12 = event.changes.length - 1; i$12 >= 0; --i$12) {
            var returned = loop(i$12);
            if (returned) return returned.v;
          }
        }
        function shiftDoc(doc3, distance) {
          if (distance == 0) {
            return;
          }
          doc3.first += distance;
          doc3.sel = new Selection(map3(doc3.sel.ranges, function(range2) {
            return new Range(
              Pos(range2.anchor.line + distance, range2.anchor.ch),
              Pos(range2.head.line + distance, range2.head.ch)
            );
          }), doc3.sel.primIndex);
          if (doc3.cm) {
            regChange(doc3.cm, doc3.first, doc3.first - distance, distance);
            for (var d = doc3.cm.display, l = d.viewFrom; l < d.viewTo; l++) {
              regLineChange(doc3.cm, l, "gutter");
            }
          }
        }
        function makeChangeSingleDoc(doc3, change, selAfter, spans) {
          if (doc3.cm && !doc3.cm.curOp) {
            return operation(doc3.cm, makeChangeSingleDoc)(doc3, change, selAfter, spans);
          }
          if (change.to.line < doc3.first) {
            shiftDoc(doc3, change.text.length - 1 - (change.to.line - change.from.line));
            return;
          }
          if (change.from.line > doc3.lastLine()) {
            return;
          }
          if (change.from.line < doc3.first) {
            var shift = change.text.length - 1 - (doc3.first - change.from.line);
            shiftDoc(doc3, shift);
            change = {
              from: Pos(doc3.first, 0),
              to: Pos(change.to.line + shift, change.to.ch),
              text: [lst(change.text)],
              origin: change.origin
            };
          }
          var last2 = doc3.lastLine();
          if (change.to.line > last2) {
            change = {
              from: change.from,
              to: Pos(last2, getLine(doc3, last2).text.length),
              text: [change.text[0]],
              origin: change.origin
            };
          }
          change.removed = getBetween(doc3, change.from, change.to);
          if (!selAfter) {
            selAfter = computeSelAfterChange(doc3, change);
          }
          if (doc3.cm) {
            makeChangeSingleDocInEditor(doc3.cm, change, spans);
          } else {
            updateDoc(doc3, change, spans);
          }
          setSelectionNoUndo(doc3, selAfter, sel_dontScroll);
          if (doc3.cantEdit && skipAtomic(doc3, Pos(doc3.firstLine(), 0))) {
            doc3.cantEdit = false;
          }
        }
        function makeChangeSingleDocInEditor(cm, change, spans) {
          var doc3 = cm.doc, display = cm.display, from2 = change.from, to = change.to;
          var recomputeMaxLength = false, checkWidthStart = from2.line;
          if (!cm.options.lineWrapping) {
            checkWidthStart = lineNo(visualLine(getLine(doc3, from2.line)));
            doc3.iter(checkWidthStart, to.line + 1, function(line) {
              if (line == display.maxLine) {
                recomputeMaxLength = true;
                return true;
              }
            });
          }
          if (doc3.sel.contains(change.from, change.to) > -1) {
            signalCursorActivity(cm);
          }
          updateDoc(doc3, change, spans, estimateHeight(cm));
          if (!cm.options.lineWrapping) {
            doc3.iter(checkWidthStart, from2.line + change.text.length, function(line) {
              var len = lineLength(line);
              if (len > display.maxLineLength) {
                display.maxLine = line;
                display.maxLineLength = len;
                display.maxLineChanged = true;
                recomputeMaxLength = false;
              }
            });
            if (recomputeMaxLength) {
              cm.curOp.updateMaxLine = true;
            }
          }
          retreatFrontier(doc3, from2.line);
          startWorker(cm, 400);
          var lendiff = change.text.length - (to.line - from2.line) - 1;
          if (change.full) {
            regChange(cm);
          } else if (from2.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change)) {
            regLineChange(cm, from2.line, "text");
          } else {
            regChange(cm, from2.line, to.line + 1, lendiff);
          }
          var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
          if (changeHandler || changesHandler) {
            var obj = {
              from: from2,
              to,
              text: change.text,
              removed: change.removed,
              origin: change.origin
            };
            if (changeHandler) {
              signalLater(cm, "change", cm, obj);
            }
            if (changesHandler) {
              (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
            }
          }
          cm.display.selForContextMenu = null;
        }
        function replaceRange(doc3, code, from2, to, origin) {
          var assign2;
          if (!to) {
            to = from2;
          }
          if (cmp(to, from2) < 0) {
            assign2 = [to, from2], from2 = assign2[0], to = assign2[1];
          }
          if (typeof code == "string") {
            code = doc3.splitLines(code);
          }
          makeChange(doc3, { from: from2, to, text: code, origin });
        }
        function rebaseHistSelSingle(pos, from2, to, diff) {
          if (to < pos.line) {
            pos.line += diff;
          } else if (from2 < pos.line) {
            pos.line = from2;
            pos.ch = 0;
          }
        }
        function rebaseHistArray(array, from2, to, diff) {
          for (var i2 = 0; i2 < array.length; ++i2) {
            var sub = array[i2], ok = true;
            if (sub.ranges) {
              if (!sub.copied) {
                sub = array[i2] = sub.deepCopy();
                sub.copied = true;
              }
              for (var j = 0; j < sub.ranges.length; j++) {
                rebaseHistSelSingle(sub.ranges[j].anchor, from2, to, diff);
                rebaseHistSelSingle(sub.ranges[j].head, from2, to, diff);
              }
              continue;
            }
            for (var j$1 = 0; j$1 < sub.changes.length; ++j$1) {
              var cur = sub.changes[j$1];
              if (to < cur.from.line) {
                cur.from = Pos(cur.from.line + diff, cur.from.ch);
                cur.to = Pos(cur.to.line + diff, cur.to.ch);
              } else if (from2 <= cur.to.line) {
                ok = false;
                break;
              }
            }
            if (!ok) {
              array.splice(0, i2 + 1);
              i2 = 0;
            }
          }
        }
        function rebaseHist(hist, change) {
          var from2 = change.from.line, to = change.to.line, diff = change.text.length - (to - from2) - 1;
          rebaseHistArray(hist.done, from2, to, diff);
          rebaseHistArray(hist.undone, from2, to, diff);
        }
        function changeLine(doc3, handle, changeType, op) {
          var no = handle, line = handle;
          if (typeof handle == "number") {
            line = getLine(doc3, clipLine(doc3, handle));
          } else {
            no = lineNo(handle);
          }
          if (no == null) {
            return null;
          }
          if (op(line, no) && doc3.cm) {
            regLineChange(doc3.cm, no, changeType);
          }
          return line;
        }
        function LeafChunk(lines) {
          this.lines = lines;
          this.parent = null;
          var height = 0;
          for (var i2 = 0; i2 < lines.length; ++i2) {
            lines[i2].parent = this;
            height += lines[i2].height;
          }
          this.height = height;
        }
        LeafChunk.prototype = {
          chunkSize: function() {
            return this.lines.length;
          },
          // Remove the n lines at offset 'at'.
          removeInner: function(at, n) {
            for (var i2 = at, e = at + n; i2 < e; ++i2) {
              var line = this.lines[i2];
              this.height -= line.height;
              cleanUpLine(line);
              signalLater(line, "delete");
            }
            this.lines.splice(at, n);
          },
          // Helper used to collapse a small branch into a single leaf.
          collapse: function(lines) {
            lines.push.apply(lines, this.lines);
          },
          // Insert the given array of lines at offset 'at', count them as
          // having the given height.
          insertInner: function(at, lines, height) {
            this.height += height;
            this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
            for (var i2 = 0; i2 < lines.length; ++i2) {
              lines[i2].parent = this;
            }
          },
          // Used to iterate over a part of the tree.
          iterN: function(at, n, op) {
            for (var e = at + n; at < e; ++at) {
              if (op(this.lines[at])) {
                return true;
              }
            }
          }
        };
        function BranchChunk(children) {
          this.children = children;
          var size2 = 0, height = 0;
          for (var i2 = 0; i2 < children.length; ++i2) {
            var ch = children[i2];
            size2 += ch.chunkSize();
            height += ch.height;
            ch.parent = this;
          }
          this.size = size2;
          this.height = height;
          this.parent = null;
        }
        BranchChunk.prototype = {
          chunkSize: function() {
            return this.size;
          },
          removeInner: function(at, n) {
            this.size -= n;
            for (var i2 = 0; i2 < this.children.length; ++i2) {
              var child = this.children[i2], sz = child.chunkSize();
              if (at < sz) {
                var rm = Math.min(n, sz - at), oldHeight = child.height;
                child.removeInner(at, rm);
                this.height -= oldHeight - child.height;
                if (sz == rm) {
                  this.children.splice(i2--, 1);
                  child.parent = null;
                }
                if ((n -= rm) == 0) {
                  break;
                }
                at = 0;
              } else {
                at -= sz;
              }
            }
            if (this.size - n < 25 && (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
              var lines = [];
              this.collapse(lines);
              this.children = [new LeafChunk(lines)];
              this.children[0].parent = this;
            }
          },
          collapse: function(lines) {
            for (var i2 = 0; i2 < this.children.length; ++i2) {
              this.children[i2].collapse(lines);
            }
          },
          insertInner: function(at, lines, height) {
            this.size += lines.length;
            this.height += height;
            for (var i2 = 0; i2 < this.children.length; ++i2) {
              var child = this.children[i2], sz = child.chunkSize();
              if (at <= sz) {
                child.insertInner(at, lines, height);
                if (child.lines && child.lines.length > 50) {
                  var remaining = child.lines.length % 25 + 25;
                  for (var pos = remaining; pos < child.lines.length; ) {
                    var leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
                    child.height -= leaf.height;
                    this.children.splice(++i2, 0, leaf);
                    leaf.parent = this;
                  }
                  child.lines = child.lines.slice(0, remaining);
                  this.maybeSpill();
                }
                break;
              }
              at -= sz;
            }
          },
          // When a node has grown, check whether it should be split.
          maybeSpill: function() {
            if (this.children.length <= 10) {
              return;
            }
            var me = this;
            do {
              var spilled = me.children.splice(me.children.length - 5, 5);
              var sibling = new BranchChunk(spilled);
              if (!me.parent) {
                var copy2 = new BranchChunk(me.children);
                copy2.parent = me;
                me.children = [copy2, sibling];
                me = copy2;
              } else {
                me.size -= sibling.size;
                me.height -= sibling.height;
                var myIndex = indexOf(me.parent.children, me);
                me.parent.children.splice(myIndex + 1, 0, sibling);
              }
              sibling.parent = me.parent;
            } while (me.children.length > 10);
            me.parent.maybeSpill();
          },
          iterN: function(at, n, op) {
            for (var i2 = 0; i2 < this.children.length; ++i2) {
              var child = this.children[i2], sz = child.chunkSize();
              if (at < sz) {
                var used = Math.min(n, sz - at);
                if (child.iterN(at, used, op)) {
                  return true;
                }
                if ((n -= used) == 0) {
                  break;
                }
                at = 0;
              } else {
                at -= sz;
              }
            }
          }
        };
        var LineWidget = function(doc3, node, options) {
          if (options) {
            for (var opt in options) {
              if (options.hasOwnProperty(opt)) {
                this[opt] = options[opt];
              }
            }
          }
          this.doc = doc3;
          this.node = node;
        };
        LineWidget.prototype.clear = function() {
          var cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
          if (no == null || !ws) {
            return;
          }
          for (var i2 = 0; i2 < ws.length; ++i2) {
            if (ws[i2] == this) {
              ws.splice(i2--, 1);
            }
          }
          if (!ws.length) {
            line.widgets = null;
          }
          var height = widgetHeight(this);
          updateLineHeight(line, Math.max(0, line.height - height));
          if (cm) {
            runInOp(cm, function() {
              adjustScrollWhenAboveVisible(cm, line, -height);
              regLineChange(cm, no, "widget");
            });
            signalLater(cm, "lineWidgetCleared", cm, this, no);
          }
        };
        LineWidget.prototype.changed = function() {
          var this$1 = this;
          var oldH = this.height, cm = this.doc.cm, line = this.line;
          this.height = null;
          var diff = widgetHeight(this) - oldH;
          if (!diff) {
            return;
          }
          if (!lineIsHidden(this.doc, line)) {
            updateLineHeight(line, line.height + diff);
          }
          if (cm) {
            runInOp(cm, function() {
              cm.curOp.forceUpdate = true;
              adjustScrollWhenAboveVisible(cm, line, diff);
              signalLater(cm, "lineWidgetChanged", cm, this$1, lineNo(line));
            });
          }
        };
        eventMixin(LineWidget);
        function adjustScrollWhenAboveVisible(cm, line, diff) {
          if (heightAtLine(line) < (cm.curOp && cm.curOp.scrollTop || cm.doc.scrollTop)) {
            addToScrollTop(cm, diff);
          }
        }
        function addLineWidget(doc3, handle, node, options) {
          var widget = new LineWidget(doc3, node, options);
          var cm = doc3.cm;
          if (cm && widget.noHScroll) {
            cm.display.alignWidgets = true;
          }
          changeLine(doc3, handle, "widget", function(line) {
            var widgets = line.widgets || (line.widgets = []);
            if (widget.insertAt == null) {
              widgets.push(widget);
            } else {
              widgets.splice(Math.min(widgets.length, Math.max(0, widget.insertAt)), 0, widget);
            }
            widget.line = line;
            if (cm && !lineIsHidden(doc3, line)) {
              var aboveVisible = heightAtLine(line) < doc3.scrollTop;
              updateLineHeight(line, line.height + widgetHeight(widget));
              if (aboveVisible) {
                addToScrollTop(cm, widget.height);
              }
              cm.curOp.forceUpdate = true;
            }
            return true;
          });
          if (cm) {
            signalLater(cm, "lineWidgetAdded", cm, widget, typeof handle == "number" ? handle : lineNo(handle));
          }
          return widget;
        }
        var nextMarkerId = 0;
        var TextMarker = function(doc3, type) {
          this.lines = [];
          this.type = type;
          this.doc = doc3;
          this.id = ++nextMarkerId;
        };
        TextMarker.prototype.clear = function() {
          if (this.explicitlyCleared) {
            return;
          }
          var cm = this.doc.cm, withOp = cm && !cm.curOp;
          if (withOp) {
            startOperation(cm);
          }
          if (hasHandler(this, "clear")) {
            var found = this.find();
            if (found) {
              signalLater(this, "clear", found.from, found.to);
            }
          }
          var min2 = null, max2 = null;
          for (var i2 = 0; i2 < this.lines.length; ++i2) {
            var line = this.lines[i2];
            var span = getMarkedSpanFor(line.markedSpans, this);
            if (cm && !this.collapsed) {
              regLineChange(cm, lineNo(line), "text");
            } else if (cm) {
              if (span.to != null) {
                max2 = lineNo(line);
              }
              if (span.from != null) {
                min2 = lineNo(line);
              }
            }
            line.markedSpans = removeMarkedSpan(line.markedSpans, span);
            if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm) {
              updateLineHeight(line, textHeight(cm.display));
            }
          }
          if (cm && this.collapsed && !cm.options.lineWrapping) {
            for (var i$12 = 0; i$12 < this.lines.length; ++i$12) {
              var visual = visualLine(this.lines[i$12]), len = lineLength(visual);
              if (len > cm.display.maxLineLength) {
                cm.display.maxLine = visual;
                cm.display.maxLineLength = len;
                cm.display.maxLineChanged = true;
              }
            }
          }
          if (min2 != null && cm && this.collapsed) {
            regChange(cm, min2, max2 + 1);
          }
          this.lines.length = 0;
          this.explicitlyCleared = true;
          if (this.atomic && this.doc.cantEdit) {
            this.doc.cantEdit = false;
            if (cm) {
              reCheckSelection(cm.doc);
            }
          }
          if (cm) {
            signalLater(cm, "markerCleared", cm, this, min2, max2);
          }
          if (withOp) {
            endOperation(cm);
          }
          if (this.parent) {
            this.parent.clear();
          }
        };
        TextMarker.prototype.find = function(side, lineObj) {
          if (side == null && this.type == "bookmark") {
            side = 1;
          }
          var from2, to;
          for (var i2 = 0; i2 < this.lines.length; ++i2) {
            var line = this.lines[i2];
            var span = getMarkedSpanFor(line.markedSpans, this);
            if (span.from != null) {
              from2 = Pos(lineObj ? line : lineNo(line), span.from);
              if (side == -1) {
                return from2;
              }
            }
            if (span.to != null) {
              to = Pos(lineObj ? line : lineNo(line), span.to);
              if (side == 1) {
                return to;
              }
            }
          }
          return from2 && { from: from2, to };
        };
        TextMarker.prototype.changed = function() {
          var this$1 = this;
          var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
          if (!pos || !cm) {
            return;
          }
          runInOp(cm, function() {
            var line = pos.line, lineN = lineNo(pos.line);
            var view = findViewForLine(cm, lineN);
            if (view) {
              clearLineMeasurementCacheFor(view);
              cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
            }
            cm.curOp.updateMaxLine = true;
            if (!lineIsHidden(widget.doc, line) && widget.height != null) {
              var oldHeight = widget.height;
              widget.height = null;
              var dHeight = widgetHeight(widget) - oldHeight;
              if (dHeight) {
                updateLineHeight(line, line.height + dHeight);
              }
            }
            signalLater(cm, "markerChanged", cm, this$1);
          });
        };
        TextMarker.prototype.attachLine = function(line) {
          if (!this.lines.length && this.doc.cm) {
            var op = this.doc.cm.curOp;
            if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1) {
              (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
            }
          }
          this.lines.push(line);
        };
        TextMarker.prototype.detachLine = function(line) {
          this.lines.splice(indexOf(this.lines, line), 1);
          if (!this.lines.length && this.doc.cm) {
            var op = this.doc.cm.curOp;
            (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
          }
        };
        eventMixin(TextMarker);
        function markText(doc3, from2, to, options, type) {
          if (options && options.shared) {
            return markTextShared(doc3, from2, to, options, type);
          }
          if (doc3.cm && !doc3.cm.curOp) {
            return operation(doc3.cm, markText)(doc3, from2, to, options, type);
          }
          var marker = new TextMarker(doc3, type), diff = cmp(from2, to);
          if (options) {
            copyObj(options, marker, false);
          }
          if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false) {
            return marker;
          }
          if (marker.replacedWith) {
            marker.collapsed = true;
            marker.widgetNode = eltP("span", [marker.replacedWith], "CodeMirror-widget");
            if (!options.handleMouseEvents) {
              marker.widgetNode.setAttribute("cm-ignore-events", "true");
            }
            if (options.insertLeft) {
              marker.widgetNode.insertLeft = true;
            }
          }
          if (marker.collapsed) {
            if (conflictingCollapsedRange(doc3, from2.line, from2, to, marker) || from2.line != to.line && conflictingCollapsedRange(doc3, to.line, from2, to, marker)) {
              throw new Error("Inserting collapsed marker partially overlapping an existing one");
            }
            seeCollapsedSpans();
          }
          if (marker.addToHistory) {
            addChangeToHistory(doc3, { from: from2, to, origin: "markText" }, doc3.sel, NaN);
          }
          var curLine = from2.line, cm = doc3.cm, updateMaxLine;
          doc3.iter(curLine, to.line + 1, function(line) {
            if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine) {
              updateMaxLine = true;
            }
            if (marker.collapsed && curLine != from2.line) {
              updateLineHeight(line, 0);
            }
            addMarkedSpan(line, new MarkedSpan(
              marker,
              curLine == from2.line ? from2.ch : null,
              curLine == to.line ? to.ch : null
            ), doc3.cm && doc3.cm.curOp);
            ++curLine;
          });
          if (marker.collapsed) {
            doc3.iter(from2.line, to.line + 1, function(line) {
              if (lineIsHidden(doc3, line)) {
                updateLineHeight(line, 0);
              }
            });
          }
          if (marker.clearOnEnter) {
            on(marker, "beforeCursorEnter", function() {
              return marker.clear();
            });
          }
          if (marker.readOnly) {
            seeReadOnlySpans();
            if (doc3.history.done.length || doc3.history.undone.length) {
              doc3.clearHistory();
            }
          }
          if (marker.collapsed) {
            marker.id = ++nextMarkerId;
            marker.atomic = true;
          }
          if (cm) {
            if (updateMaxLine) {
              cm.curOp.updateMaxLine = true;
            }
            if (marker.collapsed) {
              regChange(cm, from2.line, to.line + 1);
            } else if (marker.className || marker.startStyle || marker.endStyle || marker.css || marker.attributes || marker.title) {
              for (var i2 = from2.line; i2 <= to.line; i2++) {
                regLineChange(cm, i2, "text");
              }
            }
            if (marker.atomic) {
              reCheckSelection(cm.doc);
            }
            signalLater(cm, "markerAdded", cm, marker);
          }
          return marker;
        }
        var SharedTextMarker = function(markers, primary) {
          this.markers = markers;
          this.primary = primary;
          for (var i2 = 0; i2 < markers.length; ++i2) {
            markers[i2].parent = this;
          }
        };
        SharedTextMarker.prototype.clear = function() {
          if (this.explicitlyCleared) {
            return;
          }
          this.explicitlyCleared = true;
          for (var i2 = 0; i2 < this.markers.length; ++i2) {
            this.markers[i2].clear();
          }
          signalLater(this, "clear");
        };
        SharedTextMarker.prototype.find = function(side, lineObj) {
          return this.primary.find(side, lineObj);
        };
        eventMixin(SharedTextMarker);
        function markTextShared(doc3, from2, to, options, type) {
          options = copyObj(options);
          options.shared = false;
          var markers = [markText(doc3, from2, to, options, type)], primary = markers[0];
          var widget = options.widgetNode;
          linkedDocs(doc3, function(doc4) {
            if (widget) {
              options.widgetNode = widget.cloneNode(true);
            }
            markers.push(markText(doc4, clipPos(doc4, from2), clipPos(doc4, to), options, type));
            for (var i2 = 0; i2 < doc4.linked.length; ++i2) {
              if (doc4.linked[i2].isParent) {
                return;
              }
            }
            primary = lst(markers);
          });
          return new SharedTextMarker(markers, primary);
        }
        function findSharedMarkers(doc3) {
          return doc3.findMarks(Pos(doc3.first, 0), doc3.clipPos(Pos(doc3.lastLine())), function(m) {
            return m.parent;
          });
        }
        function copySharedMarkers(doc3, markers) {
          for (var i2 = 0; i2 < markers.length; i2++) {
            var marker = markers[i2], pos = marker.find();
            var mFrom = doc3.clipPos(pos.from), mTo = doc3.clipPos(pos.to);
            if (cmp(mFrom, mTo)) {
              var subMark = markText(doc3, mFrom, mTo, marker.primary, marker.primary.type);
              marker.markers.push(subMark);
              subMark.parent = marker;
            }
          }
        }
        function detachSharedMarkers(markers) {
          var loop = function(i3) {
            var marker = markers[i3], linked = [marker.primary.doc];
            linkedDocs(marker.primary.doc, function(d) {
              return linked.push(d);
            });
            for (var j = 0; j < marker.markers.length; j++) {
              var subMarker = marker.markers[j];
              if (indexOf(linked, subMarker.doc) == -1) {
                subMarker.parent = null;
                marker.markers.splice(j--, 1);
              }
            }
          };
          for (var i2 = 0; i2 < markers.length; i2++) loop(i2);
        }
        var nextDocId = 0;
        var Doc2 = function(text2, mode, firstLine, lineSep, direction) {
          if (!(this instanceof Doc2)) {
            return new Doc2(text2, mode, firstLine, lineSep, direction);
          }
          if (firstLine == null) {
            firstLine = 0;
          }
          BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
          this.first = firstLine;
          this.scrollTop = this.scrollLeft = 0;
          this.cantEdit = false;
          this.cleanGeneration = 1;
          this.modeFrontier = this.highlightFrontier = firstLine;
          var start = Pos(firstLine, 0);
          this.sel = simpleSelection(start);
          this.history = new History(null);
          this.id = ++nextDocId;
          this.modeOption = mode;
          this.lineSep = lineSep;
          this.direction = direction == "rtl" ? "rtl" : "ltr";
          this.extend = false;
          if (typeof text2 == "string") {
            text2 = this.splitLines(text2);
          }
          updateDoc(this, { from: start, to: start, text: text2 });
          setSelection(this, simpleSelection(start), sel_dontScroll);
        };
        Doc2.prototype = createObj(BranchChunk.prototype, {
          constructor: Doc2,
          // Iterate over the document. Supports two forms -- with only one
          // argument, it calls that for each line in the document. With
          // three, it iterates over the range given by the first two (with
          // the second being non-inclusive).
          iter: function(from2, to, op) {
            if (op) {
              this.iterN(from2 - this.first, to - from2, op);
            } else {
              this.iterN(this.first, this.first + this.size, from2);
            }
          },
          // Non-public interface for adding and removing lines.
          insert: function(at, lines) {
            var height = 0;
            for (var i2 = 0; i2 < lines.length; ++i2) {
              height += lines[i2].height;
            }
            this.insertInner(at - this.first, lines, height);
          },
          remove: function(at, n) {
            this.removeInner(at - this.first, n);
          },
          // From here, the methods are part of the public interface. Most
          // are also available from CodeMirror (editor) instances.
          getValue: function(lineSep) {
            var lines = getLines(this, this.first, this.first + this.size);
            if (lineSep === false) {
              return lines;
            }
            return lines.join(lineSep || this.lineSeparator());
          },
          setValue: docMethodOp(function(code) {
            var top = Pos(this.first, 0), last2 = this.first + this.size - 1;
            makeChange(this, {
              from: top,
              to: Pos(last2, getLine(this, last2).text.length),
              text: this.splitLines(code),
              origin: "setValue",
              full: true
            }, true);
            if (this.cm) {
              scrollToCoords(this.cm, 0, 0);
            }
            setSelection(this, simpleSelection(top), sel_dontScroll);
          }),
          replaceRange: function(code, from2, to, origin) {
            from2 = clipPos(this, from2);
            to = to ? clipPos(this, to) : from2;
            replaceRange(this, code, from2, to, origin);
          },
          getRange: function(from2, to, lineSep) {
            var lines = getBetween(this, clipPos(this, from2), clipPos(this, to));
            if (lineSep === false) {
              return lines;
            }
            if (lineSep === "") {
              return lines.join("");
            }
            return lines.join(lineSep || this.lineSeparator());
          },
          getLine: function(line) {
            var l = this.getLineHandle(line);
            return l && l.text;
          },
          getLineHandle: function(line) {
            if (isLine(this, line)) {
              return getLine(this, line);
            }
          },
          getLineNumber: function(line) {
            return lineNo(line);
          },
          getLineHandleVisualStart: function(line) {
            if (typeof line == "number") {
              line = getLine(this, line);
            }
            return visualLine(line);
          },
          lineCount: function() {
            return this.size;
          },
          firstLine: function() {
            return this.first;
          },
          lastLine: function() {
            return this.first + this.size - 1;
          },
          clipPos: function(pos) {
            return clipPos(this, pos);
          },
          getCursor: function(start) {
            var range2 = this.sel.primary(), pos;
            if (start == null || start == "head") {
              pos = range2.head;
            } else if (start == "anchor") {
              pos = range2.anchor;
            } else if (start == "end" || start == "to" || start === false) {
              pos = range2.to();
            } else {
              pos = range2.from();
            }
            return pos;
          },
          listSelections: function() {
            return this.sel.ranges;
          },
          somethingSelected: function() {
            return this.sel.somethingSelected();
          },
          setCursor: docMethodOp(function(line, ch, options) {
            setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
          }),
          setSelection: docMethodOp(function(anchor, head, options) {
            setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
          }),
          extendSelection: docMethodOp(function(head, other, options) {
            extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
          }),
          extendSelections: docMethodOp(function(heads, options) {
            extendSelections(this, clipPosArray(this, heads), options);
          }),
          extendSelectionsBy: docMethodOp(function(f, options) {
            var heads = map3(this.sel.ranges, f);
            extendSelections(this, clipPosArray(this, heads), options);
          }),
          setSelections: docMethodOp(function(ranges, primary, options) {
            if (!ranges.length) {
              return;
            }
            var out = [];
            for (var i2 = 0; i2 < ranges.length; i2++) {
              out[i2] = new Range(
                clipPos(this, ranges[i2].anchor),
                clipPos(this, ranges[i2].head || ranges[i2].anchor)
              );
            }
            if (primary == null) {
              primary = Math.min(ranges.length - 1, this.sel.primIndex);
            }
            setSelection(this, normalizeSelection(this.cm, out, primary), options);
          }),
          addSelection: docMethodOp(function(anchor, head, options) {
            var ranges = this.sel.ranges.slice(0);
            ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
            setSelection(this, normalizeSelection(this.cm, ranges, ranges.length - 1), options);
          }),
          getSelection: function(lineSep) {
            var ranges = this.sel.ranges, lines;
            for (var i2 = 0; i2 < ranges.length; i2++) {
              var sel = getBetween(this, ranges[i2].from(), ranges[i2].to());
              lines = lines ? lines.concat(sel) : sel;
            }
            if (lineSep === false) {
              return lines;
            } else {
              return lines.join(lineSep || this.lineSeparator());
            }
          },
          getSelections: function(lineSep) {
            var parts = [], ranges = this.sel.ranges;
            for (var i2 = 0; i2 < ranges.length; i2++) {
              var sel = getBetween(this, ranges[i2].from(), ranges[i2].to());
              if (lineSep !== false) {
                sel = sel.join(lineSep || this.lineSeparator());
              }
              parts[i2] = sel;
            }
            return parts;
          },
          replaceSelection: function(code, collapse, origin) {
            var dup = [];
            for (var i2 = 0; i2 < this.sel.ranges.length; i2++) {
              dup[i2] = code;
            }
            this.replaceSelections(dup, collapse, origin || "+input");
          },
          replaceSelections: docMethodOp(function(code, collapse, origin) {
            var changes = [], sel = this.sel;
            for (var i2 = 0; i2 < sel.ranges.length; i2++) {
              var range2 = sel.ranges[i2];
              changes[i2] = { from: range2.from(), to: range2.to(), text: this.splitLines(code[i2]), origin };
            }
            var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
            for (var i$12 = changes.length - 1; i$12 >= 0; i$12--) {
              makeChange(this, changes[i$12]);
            }
            if (newSel) {
              setSelectionReplaceHistory(this, newSel);
            } else if (this.cm) {
              ensureCursorVisible(this.cm);
            }
          }),
          undo: docMethodOp(function() {
            makeChangeFromHistory(this, "undo");
          }),
          redo: docMethodOp(function() {
            makeChangeFromHistory(this, "redo");
          }),
          undoSelection: docMethodOp(function() {
            makeChangeFromHistory(this, "undo", true);
          }),
          redoSelection: docMethodOp(function() {
            makeChangeFromHistory(this, "redo", true);
          }),
          setExtending: function(val) {
            this.extend = val;
          },
          getExtending: function() {
            return this.extend;
          },
          historySize: function() {
            var hist = this.history, done = 0, undone = 0;
            for (var i2 = 0; i2 < hist.done.length; i2++) {
              if (!hist.done[i2].ranges) {
                ++done;
              }
            }
            for (var i$12 = 0; i$12 < hist.undone.length; i$12++) {
              if (!hist.undone[i$12].ranges) {
                ++undone;
              }
            }
            return { undo: done, redo: undone };
          },
          clearHistory: function() {
            var this$1 = this;
            this.history = new History(this.history);
            linkedDocs(this, function(doc3) {
              return doc3.history = this$1.history;
            }, true);
          },
          markClean: function() {
            this.cleanGeneration = this.changeGeneration(true);
          },
          changeGeneration: function(forceSplit) {
            if (forceSplit) {
              this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
            }
            return this.history.generation;
          },
          isClean: function(gen) {
            return this.history.generation == (gen || this.cleanGeneration);
          },
          getHistory: function() {
            return {
              done: copyHistoryArray(this.history.done),
              undone: copyHistoryArray(this.history.undone)
            };
          },
          setHistory: function(histData) {
            var hist = this.history = new History(this.history);
            hist.done = copyHistoryArray(histData.done.slice(0), null, true);
            hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
          },
          setGutterMarker: docMethodOp(function(line, gutterID, value) {
            return changeLine(this, line, "gutter", function(line2) {
              var markers = line2.gutterMarkers || (line2.gutterMarkers = {});
              markers[gutterID] = value;
              if (!value && isEmpty2(markers)) {
                line2.gutterMarkers = null;
              }
              return true;
            });
          }),
          clearGutter: docMethodOp(function(gutterID) {
            var this$1 = this;
            this.iter(function(line) {
              if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
                changeLine(this$1, line, "gutter", function() {
                  line.gutterMarkers[gutterID] = null;
                  if (isEmpty2(line.gutterMarkers)) {
                    line.gutterMarkers = null;
                  }
                  return true;
                });
              }
            });
          }),
          lineInfo: function(line) {
            var n;
            if (typeof line == "number") {
              if (!isLine(this, line)) {
                return null;
              }
              n = line;
              line = getLine(this, line);
              if (!line) {
                return null;
              }
            } else {
              n = lineNo(line);
              if (n == null) {
                return null;
              }
            }
            return {
              line: n,
              handle: line,
              text: line.text,
              gutterMarkers: line.gutterMarkers,
              textClass: line.textClass,
              bgClass: line.bgClass,
              wrapClass: line.wrapClass,
              widgets: line.widgets
            };
          },
          addLineClass: docMethodOp(function(handle, where, cls) {
            return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
              var prop2 = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
              if (!line[prop2]) {
                line[prop2] = cls;
              } else if (classTest(cls).test(line[prop2])) {
                return false;
              } else {
                line[prop2] += " " + cls;
              }
              return true;
            });
          }),
          removeLineClass: docMethodOp(function(handle, where, cls) {
            return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
              var prop2 = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
              var cur = line[prop2];
              if (!cur) {
                return false;
              } else if (cls == null) {
                line[prop2] = null;
              } else {
                var found = cur.match(classTest(cls));
                if (!found) {
                  return false;
                }
                var end = found.index + found[0].length;
                line[prop2] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
              }
              return true;
            });
          }),
          addLineWidget: docMethodOp(function(handle, node, options) {
            return addLineWidget(this, handle, node, options);
          }),
          removeLineWidget: function(widget) {
            widget.clear();
          },
          markText: function(from2, to, options) {
            return markText(this, clipPos(this, from2), clipPos(this, to), options, options && options.type || "range");
          },
          setBookmark: function(pos, options) {
            var realOpts = {
              replacedWith: options && (options.nodeType == null ? options.widget : options),
              insertLeft: options && options.insertLeft,
              clearWhenEmpty: false,
              shared: options && options.shared,
              handleMouseEvents: options && options.handleMouseEvents
            };
            pos = clipPos(this, pos);
            return markText(this, pos, pos, realOpts, "bookmark");
          },
          findMarksAt: function(pos) {
            pos = clipPos(this, pos);
            var markers = [], spans = getLine(this, pos.line).markedSpans;
            if (spans) {
              for (var i2 = 0; i2 < spans.length; ++i2) {
                var span = spans[i2];
                if ((span.from == null || span.from <= pos.ch) && (span.to == null || span.to >= pos.ch)) {
                  markers.push(span.marker.parent || span.marker);
                }
              }
            }
            return markers;
          },
          findMarks: function(from2, to, filter) {
            from2 = clipPos(this, from2);
            to = clipPos(this, to);
            var found = [], lineNo2 = from2.line;
            this.iter(from2.line, to.line + 1, function(line) {
              var spans = line.markedSpans;
              if (spans) {
                for (var i2 = 0; i2 < spans.length; i2++) {
                  var span = spans[i2];
                  if (!(span.to != null && lineNo2 == from2.line && from2.ch >= span.to || span.from == null && lineNo2 != from2.line || span.from != null && lineNo2 == to.line && span.from >= to.ch) && (!filter || filter(span.marker))) {
                    found.push(span.marker.parent || span.marker);
                  }
                }
              }
              ++lineNo2;
            });
            return found;
          },
          getAllMarks: function() {
            var markers = [];
            this.iter(function(line) {
              var sps = line.markedSpans;
              if (sps) {
                for (var i2 = 0; i2 < sps.length; ++i2) {
                  if (sps[i2].from != null) {
                    markers.push(sps[i2].marker);
                  }
                }
              }
            });
            return markers;
          },
          posFromIndex: function(off2) {
            var ch, lineNo2 = this.first, sepSize = this.lineSeparator().length;
            this.iter(function(line) {
              var sz = line.text.length + sepSize;
              if (sz > off2) {
                ch = off2;
                return true;
              }
              off2 -= sz;
              ++lineNo2;
            });
            return clipPos(this, Pos(lineNo2, ch));
          },
          indexFromPos: function(coords) {
            coords = clipPos(this, coords);
            var index = coords.ch;
            if (coords.line < this.first || coords.ch < 0) {
              return 0;
            }
            var sepSize = this.lineSeparator().length;
            this.iter(this.first, coords.line, function(line) {
              index += line.text.length + sepSize;
            });
            return index;
          },
          copy: function(copyHistory) {
            var doc3 = new Doc2(
              getLines(this, this.first, this.first + this.size),
              this.modeOption,
              this.first,
              this.lineSep,
              this.direction
            );
            doc3.scrollTop = this.scrollTop;
            doc3.scrollLeft = this.scrollLeft;
            doc3.sel = this.sel;
            doc3.extend = false;
            if (copyHistory) {
              doc3.history.undoDepth = this.history.undoDepth;
              doc3.setHistory(this.getHistory());
            }
            return doc3;
          },
          linkedDoc: function(options) {
            if (!options) {
              options = {};
            }
            var from2 = this.first, to = this.first + this.size;
            if (options.from != null && options.from > from2) {
              from2 = options.from;
            }
            if (options.to != null && options.to < to) {
              to = options.to;
            }
            var copy2 = new Doc2(getLines(this, from2, to), options.mode || this.modeOption, from2, this.lineSep, this.direction);
            if (options.sharedHist) {
              copy2.history = this.history;
            }
            (this.linked || (this.linked = [])).push({ doc: copy2, sharedHist: options.sharedHist });
            copy2.linked = [{ doc: this, isParent: true, sharedHist: options.sharedHist }];
            copySharedMarkers(copy2, findSharedMarkers(this));
            return copy2;
          },
          unlinkDoc: function(other) {
            if (other instanceof CodeMirror3) {
              other = other.doc;
            }
            if (this.linked) {
              for (var i2 = 0; i2 < this.linked.length; ++i2) {
                var link = this.linked[i2];
                if (link.doc != other) {
                  continue;
                }
                this.linked.splice(i2, 1);
                other.unlinkDoc(this);
                detachSharedMarkers(findSharedMarkers(this));
                break;
              }
            }
            if (other.history == this.history) {
              var splitIds = [other.id];
              linkedDocs(other, function(doc3) {
                return splitIds.push(doc3.id);
              }, true);
              other.history = new History(null);
              other.history.done = copyHistoryArray(this.history.done, splitIds);
              other.history.undone = copyHistoryArray(this.history.undone, splitIds);
            }
          },
          iterLinkedDocs: function(f) {
            linkedDocs(this, f);
          },
          getMode: function() {
            return this.mode;
          },
          getEditor: function() {
            return this.cm;
          },
          splitLines: function(str) {
            if (this.lineSep) {
              return str.split(this.lineSep);
            }
            return splitLinesAuto(str);
          },
          lineSeparator: function() {
            return this.lineSep || "\n";
          },
          setDirection: docMethodOp(function(dir) {
            if (dir != "rtl") {
              dir = "ltr";
            }
            if (dir == this.direction) {
              return;
            }
            this.direction = dir;
            this.iter(function(line) {
              return line.order = null;
            });
            if (this.cm) {
              directionChanged(this.cm);
            }
          })
        });
        Doc2.prototype.eachLine = Doc2.prototype.iter;
        var lastDrop = 0;
        function onDrop(e) {
          var cm = this;
          clearDragCursor(cm);
          if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) {
            return;
          }
          e_preventDefault(e);
          if (ie) {
            lastDrop = +/* @__PURE__ */ new Date();
          }
          var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
          if (!pos || cm.isReadOnly()) {
            return;
          }
          if (files && files.length && window.FileReader && window.File) {
            var n = files.length, text2 = Array(n), read = 0;
            var markAsReadAndPasteIfAllFilesAreRead = function() {
              if (++read == n) {
                operation(cm, function() {
                  pos = clipPos(cm.doc, pos);
                  var change = {
                    from: pos,
                    to: pos,
                    text: cm.doc.splitLines(
                      text2.filter(function(t) {
                        return t != null;
                      }).join(cm.doc.lineSeparator())
                    ),
                    origin: "paste"
                  };
                  makeChange(cm.doc, change);
                  setSelectionReplaceHistory(cm.doc, simpleSelection(clipPos(cm.doc, pos), clipPos(cm.doc, changeEnd(change))));
                })();
              }
            };
            var readTextFromFile = function(file, i3) {
              if (cm.options.allowDropFileTypes && indexOf(cm.options.allowDropFileTypes, file.type) == -1) {
                markAsReadAndPasteIfAllFilesAreRead();
                return;
              }
              var reader = new FileReader();
              reader.onerror = function() {
                return markAsReadAndPasteIfAllFilesAreRead();
              };
              reader.onload = function() {
                var content = reader.result;
                if (/[\x00-\x08\x0e-\x1f]{2}/.test(content)) {
                  markAsReadAndPasteIfAllFilesAreRead();
                  return;
                }
                text2[i3] = content;
                markAsReadAndPasteIfAllFilesAreRead();
              };
              reader.readAsText(file);
            };
            for (var i2 = 0; i2 < files.length; i2++) {
              readTextFromFile(files[i2], i2);
            }
          } else {
            if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
              cm.state.draggingText(e);
              setTimeout(function() {
                return cm.display.input.focus();
              }, 20);
              return;
            }
            try {
              var text$1 = e.dataTransfer.getData("Text");
              if (text$1) {
                var selected;
                if (cm.state.draggingText && !cm.state.draggingText.copy) {
                  selected = cm.listSelections();
                }
                setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
                if (selected) {
                  for (var i$12 = 0; i$12 < selected.length; ++i$12) {
                    replaceRange(cm.doc, "", selected[i$12].anchor, selected[i$12].head, "drag");
                  }
                }
                cm.replaceSelection(text$1, "around", "paste");
                cm.display.input.focus();
              }
            } catch (e$1) {
            }
          }
        }
        function onDragStart(cm, e) {
          if (ie && (!cm.state.draggingText || +/* @__PURE__ */ new Date() - lastDrop < 100)) {
            e_stop(e);
            return;
          }
          if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) {
            return;
          }
          e.dataTransfer.setData("Text", cm.getSelection());
          e.dataTransfer.effectAllowed = "copyMove";
          if (e.dataTransfer.setDragImage && !safari) {
            var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
            img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            if (presto) {
              img.width = img.height = 1;
              cm.display.wrapper.appendChild(img);
              img._top = img.offsetTop;
            }
            e.dataTransfer.setDragImage(img, 0, 0);
            if (presto) {
              img.parentNode.removeChild(img);
            }
          }
        }
        function onDragOver(cm, e) {
          var pos = posFromMouse(cm, e);
          if (!pos) {
            return;
          }
          var frag = document.createDocumentFragment();
          drawSelectionCursor(cm, pos, frag);
          if (!cm.display.dragCursor) {
            cm.display.dragCursor = elt("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
            cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
          }
          removeChildrenAndAdd(cm.display.dragCursor, frag);
        }
        function clearDragCursor(cm) {
          if (cm.display.dragCursor) {
            cm.display.lineSpace.removeChild(cm.display.dragCursor);
            cm.display.dragCursor = null;
          }
        }
        function forEachCodeMirror(f) {
          if (!document.getElementsByClassName) {
            return;
          }
          var byClass = document.getElementsByClassName("CodeMirror"), editors = [];
          for (var i2 = 0; i2 < byClass.length; i2++) {
            var cm = byClass[i2].CodeMirror;
            if (cm) {
              editors.push(cm);
            }
          }
          if (editors.length) {
            editors[0].operation(function() {
              for (var i3 = 0; i3 < editors.length; i3++) {
                f(editors[i3]);
              }
            });
          }
        }
        var globalsRegistered = false;
        function ensureGlobalHandlers() {
          if (globalsRegistered) {
            return;
          }
          registerGlobalHandlers();
          globalsRegistered = true;
        }
        function registerGlobalHandlers() {
          var resizeTimer;
          on(window, "resize", function() {
            if (resizeTimer == null) {
              resizeTimer = setTimeout(function() {
                resizeTimer = null;
                forEachCodeMirror(onResize);
              }, 100);
            }
          });
          on(window, "blur", function() {
            return forEachCodeMirror(onBlur);
          });
        }
        function onResize(cm) {
          var d = cm.display;
          d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
          d.scrollbarsClipped = false;
          cm.setSize();
        }
        var keyNames = {
          3: "Pause",
          8: "Backspace",
          9: "Tab",
          13: "Enter",
          16: "Shift",
          17: "Ctrl",
          18: "Alt",
          19: "Pause",
          20: "CapsLock",
          27: "Esc",
          32: "Space",
          33: "PageUp",
          34: "PageDown",
          35: "End",
          36: "Home",
          37: "Left",
          38: "Up",
          39: "Right",
          40: "Down",
          44: "PrintScrn",
          45: "Insert",
          46: "Delete",
          59: ";",
          61: "=",
          91: "Mod",
          92: "Mod",
          93: "Mod",
          106: "*",
          107: "=",
          109: "-",
          110: ".",
          111: "/",
          145: "ScrollLock",
          173: "-",
          186: ";",
          187: "=",
          188: ",",
          189: "-",
          190: ".",
          191: "/",
          192: "`",
          219: "[",
          220: "\\",
          221: "]",
          222: "'",
          224: "Mod",
          63232: "Up",
          63233: "Down",
          63234: "Left",
          63235: "Right",
          63272: "Delete",
          63273: "Home",
          63275: "End",
          63276: "PageUp",
          63277: "PageDown",
          63302: "Insert"
        };
        for (var i = 0; i < 10; i++) {
          keyNames[i + 48] = keyNames[i + 96] = String(i);
        }
        for (var i$1 = 65; i$1 <= 90; i$1++) {
          keyNames[i$1] = String.fromCharCode(i$1);
        }
        for (var i$2 = 1; i$2 <= 12; i$2++) {
          keyNames[i$2 + 111] = keyNames[i$2 + 63235] = "F" + i$2;
        }
        var keyMap = {};
        keyMap.basic = {
          "Left": "goCharLeft",
          "Right": "goCharRight",
          "Up": "goLineUp",
          "Down": "goLineDown",
          "End": "goLineEnd",
          "Home": "goLineStartSmart",
          "PageUp": "goPageUp",
          "PageDown": "goPageDown",
          "Delete": "delCharAfter",
          "Backspace": "delCharBefore",
          "Shift-Backspace": "delCharBefore",
          "Tab": "defaultTab",
          "Shift-Tab": "indentAuto",
          "Enter": "newlineAndIndent",
          "Insert": "toggleOverwrite",
          "Esc": "singleSelection"
        };
        keyMap.pcDefault = {
          "Ctrl-A": "selectAll",
          "Ctrl-D": "deleteLine",
          "Ctrl-Z": "undo",
          "Shift-Ctrl-Z": "redo",
          "Ctrl-Y": "redo",
          "Ctrl-Home": "goDocStart",
          "Ctrl-End": "goDocEnd",
          "Ctrl-Up": "goLineUp",
          "Ctrl-Down": "goLineDown",
          "Ctrl-Left": "goGroupLeft",
          "Ctrl-Right": "goGroupRight",
          "Alt-Left": "goLineStart",
          "Alt-Right": "goLineEnd",
          "Ctrl-Backspace": "delGroupBefore",
          "Ctrl-Delete": "delGroupAfter",
          "Ctrl-S": "save",
          "Ctrl-F": "find",
          "Ctrl-G": "findNext",
          "Shift-Ctrl-G": "findPrev",
          "Shift-Ctrl-F": "replace",
          "Shift-Ctrl-R": "replaceAll",
          "Ctrl-[": "indentLess",
          "Ctrl-]": "indentMore",
          "Ctrl-U": "undoSelection",
          "Shift-Ctrl-U": "redoSelection",
          "Alt-U": "redoSelection",
          "fallthrough": "basic"
        };
        keyMap.emacsy = {
          "Ctrl-F": "goCharRight",
          "Ctrl-B": "goCharLeft",
          "Ctrl-P": "goLineUp",
          "Ctrl-N": "goLineDown",
          "Ctrl-A": "goLineStart",
          "Ctrl-E": "goLineEnd",
          "Ctrl-V": "goPageDown",
          "Shift-Ctrl-V": "goPageUp",
          "Ctrl-D": "delCharAfter",
          "Ctrl-H": "delCharBefore",
          "Alt-Backspace": "delWordBefore",
          "Ctrl-K": "killLine",
          "Ctrl-T": "transposeChars",
          "Ctrl-O": "openLine"
        };
        keyMap.macDefault = {
          "Cmd-A": "selectAll",
          "Cmd-D": "deleteLine",
          "Cmd-Z": "undo",
          "Shift-Cmd-Z": "redo",
          "Cmd-Y": "redo",
          "Cmd-Home": "goDocStart",
          "Cmd-Up": "goDocStart",
          "Cmd-End": "goDocEnd",
          "Cmd-Down": "goDocEnd",
          "Alt-Left": "goGroupLeft",
          "Alt-Right": "goGroupRight",
          "Cmd-Left": "goLineLeft",
          "Cmd-Right": "goLineRight",
          "Alt-Backspace": "delGroupBefore",
          "Ctrl-Alt-Backspace": "delGroupAfter",
          "Alt-Delete": "delGroupAfter",
          "Cmd-S": "save",
          "Cmd-F": "find",
          "Cmd-G": "findNext",
          "Shift-Cmd-G": "findPrev",
          "Cmd-Alt-F": "replace",
          "Shift-Cmd-Alt-F": "replaceAll",
          "Cmd-[": "indentLess",
          "Cmd-]": "indentMore",
          "Cmd-Backspace": "delWrappedLineLeft",
          "Cmd-Delete": "delWrappedLineRight",
          "Cmd-U": "undoSelection",
          "Shift-Cmd-U": "redoSelection",
          "Ctrl-Up": "goDocStart",
          "Ctrl-Down": "goDocEnd",
          "fallthrough": ["basic", "emacsy"]
        };
        keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;
        function normalizeKeyName(name) {
          var parts = name.split(/-(?!$)/);
          name = parts[parts.length - 1];
          var alt, ctrl, shift, cmd;
          for (var i2 = 0; i2 < parts.length - 1; i2++) {
            var mod = parts[i2];
            if (/^(cmd|meta|m)$/i.test(mod)) {
              cmd = true;
            } else if (/^a(lt)?$/i.test(mod)) {
              alt = true;
            } else if (/^(c|ctrl|control)$/i.test(mod)) {
              ctrl = true;
            } else if (/^s(hift)?$/i.test(mod)) {
              shift = true;
            } else {
              throw new Error("Unrecognized modifier name: " + mod);
            }
          }
          if (alt) {
            name = "Alt-" + name;
          }
          if (ctrl) {
            name = "Ctrl-" + name;
          }
          if (cmd) {
            name = "Cmd-" + name;
          }
          if (shift) {
            name = "Shift-" + name;
          }
          return name;
        }
        function normalizeKeyMap(keymap) {
          var copy2 = {};
          for (var keyname in keymap) {
            if (keymap.hasOwnProperty(keyname)) {
              var value = keymap[keyname];
              if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) {
                continue;
              }
              if (value == "...") {
                delete keymap[keyname];
                continue;
              }
              var keys2 = map3(keyname.split(" "), normalizeKeyName);
              for (var i2 = 0; i2 < keys2.length; i2++) {
                var val = void 0, name = void 0;
                if (i2 == keys2.length - 1) {
                  name = keys2.join(" ");
                  val = value;
                } else {
                  name = keys2.slice(0, i2 + 1).join(" ");
                  val = "...";
                }
                var prev = copy2[name];
                if (!prev) {
                  copy2[name] = val;
                } else if (prev != val) {
                  throw new Error("Inconsistent bindings for " + name);
                }
              }
              delete keymap[keyname];
            }
          }
          for (var prop2 in copy2) {
            keymap[prop2] = copy2[prop2];
          }
          return keymap;
        }
        function lookupKey(key, map4, handle, context) {
          map4 = getKeyMap(map4);
          var found = map4.call ? map4.call(key, context) : map4[key];
          if (found === false) {
            return "nothing";
          }
          if (found === "...") {
            return "multi";
          }
          if (found != null && handle(found)) {
            return "handled";
          }
          if (map4.fallthrough) {
            if (Object.prototype.toString.call(map4.fallthrough) != "[object Array]") {
              return lookupKey(key, map4.fallthrough, handle, context);
            }
            for (var i2 = 0; i2 < map4.fallthrough.length; i2++) {
              var result = lookupKey(key, map4.fallthrough[i2], handle, context);
              if (result) {
                return result;
              }
            }
          }
        }
        function isModifierKey(value) {
          var name = typeof value == "string" ? value : keyNames[value.keyCode];
          return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
        }
        function addModifierNames(name, event, noShift) {
          var base = name;
          if (event.altKey && base != "Alt") {
            name = "Alt-" + name;
          }
          if ((flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != "Ctrl") {
            name = "Ctrl-" + name;
          }
          if ((flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != "Mod") {
            name = "Cmd-" + name;
          }
          if (!noShift && event.shiftKey && base != "Shift") {
            name = "Shift-" + name;
          }
          return name;
        }
        function keyName(event, noShift) {
          if (presto && event.keyCode == 34 && event["char"]) {
            return false;
          }
          var name = keyNames[event.keyCode];
          if (name == null || event.altGraphKey) {
            return false;
          }
          if (event.keyCode == 3 && event.code) {
            name = event.code;
          }
          return addModifierNames(name, event, noShift);
        }
        function getKeyMap(val) {
          return typeof val == "string" ? keyMap[val] : val;
        }
        function deleteNearSelection(cm, compute) {
          var ranges = cm.doc.sel.ranges, kill = [];
          for (var i2 = 0; i2 < ranges.length; i2++) {
            var toKill = compute(ranges[i2]);
            while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
              var replaced = kill.pop();
              if (cmp(replaced.from, toKill.from) < 0) {
                toKill.from = replaced.from;
                break;
              }
            }
            kill.push(toKill);
          }
          runInOp(cm, function() {
            for (var i3 = kill.length - 1; i3 >= 0; i3--) {
              replaceRange(cm.doc, "", kill[i3].from, kill[i3].to, "+delete");
            }
            ensureCursorVisible(cm);
          });
        }
        function moveCharLogically(line, ch, dir) {
          var target = skipExtendingChars(line.text, ch + dir, dir);
          return target < 0 || target > line.text.length ? null : target;
        }
        function moveLogically(line, start, dir) {
          var ch = moveCharLogically(line, start.ch, dir);
          return ch == null ? null : new Pos(start.line, ch, dir < 0 ? "after" : "before");
        }
        function endOfLine(visually, cm, lineObj, lineNo2, dir) {
          if (visually) {
            if (cm.doc.direction == "rtl") {
              dir = -dir;
            }
            var order = getOrder(lineObj, cm.doc.direction);
            if (order) {
              var part = dir < 0 ? lst(order) : order[0];
              var moveInStorageOrder = dir < 0 == (part.level == 1);
              var sticky = moveInStorageOrder ? "after" : "before";
              var ch;
              if (part.level > 0 || cm.doc.direction == "rtl") {
                var prep = prepareMeasureForLine(cm, lineObj);
                ch = dir < 0 ? lineObj.text.length - 1 : 0;
                var targetTop = measureCharPrepared(cm, prep, ch).top;
                ch = findFirst(function(ch2) {
                  return measureCharPrepared(cm, prep, ch2).top == targetTop;
                }, dir < 0 == (part.level == 1) ? part.from : part.to - 1, ch);
                if (sticky == "before") {
                  ch = moveCharLogically(lineObj, ch, 1);
                }
              } else {
                ch = dir < 0 ? part.to : part.from;
              }
              return new Pos(lineNo2, ch, sticky);
            }
          }
          return new Pos(lineNo2, dir < 0 ? lineObj.text.length : 0, dir < 0 ? "before" : "after");
        }
        function moveVisually(cm, line, start, dir) {
          var bidi = getOrder(line, cm.doc.direction);
          if (!bidi) {
            return moveLogically(line, start, dir);
          }
          if (start.ch >= line.text.length) {
            start.ch = line.text.length;
            start.sticky = "before";
          } else if (start.ch <= 0) {
            start.ch = 0;
            start.sticky = "after";
          }
          var partPos = getBidiPartAt(bidi, start.ch, start.sticky), part = bidi[partPos];
          if (cm.doc.direction == "ltr" && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) {
            return moveLogically(line, start, dir);
          }
          var mv = function(pos, dir2) {
            return moveCharLogically(line, pos instanceof Pos ? pos.ch : pos, dir2);
          };
          var prep;
          var getWrappedLineExtent = function(ch2) {
            if (!cm.options.lineWrapping) {
              return { begin: 0, end: line.text.length };
            }
            prep = prep || prepareMeasureForLine(cm, line);
            return wrappedLineExtentChar(cm, line, prep, ch2);
          };
          var wrappedLineExtent2 = getWrappedLineExtent(start.sticky == "before" ? mv(start, -1) : start.ch);
          if (cm.doc.direction == "rtl" || part.level == 1) {
            var moveInStorageOrder = part.level == 1 == dir < 0;
            var ch = mv(start, moveInStorageOrder ? 1 : -1);
            if (ch != null && (!moveInStorageOrder ? ch >= part.from && ch >= wrappedLineExtent2.begin : ch <= part.to && ch <= wrappedLineExtent2.end)) {
              var sticky = moveInStorageOrder ? "before" : "after";
              return new Pos(start.line, ch, sticky);
            }
          }
          var searchInVisualLine = function(partPos2, dir2, wrappedLineExtent3) {
            var getRes = function(ch3, moveInStorageOrder3) {
              return moveInStorageOrder3 ? new Pos(start.line, mv(ch3, 1), "before") : new Pos(start.line, ch3, "after");
            };
            for (; partPos2 >= 0 && partPos2 < bidi.length; partPos2 += dir2) {
              var part2 = bidi[partPos2];
              var moveInStorageOrder2 = dir2 > 0 == (part2.level != 1);
              var ch2 = moveInStorageOrder2 ? wrappedLineExtent3.begin : mv(wrappedLineExtent3.end, -1);
              if (part2.from <= ch2 && ch2 < part2.to) {
                return getRes(ch2, moveInStorageOrder2);
              }
              ch2 = moveInStorageOrder2 ? part2.from : mv(part2.to, -1);
              if (wrappedLineExtent3.begin <= ch2 && ch2 < wrappedLineExtent3.end) {
                return getRes(ch2, moveInStorageOrder2);
              }
            }
          };
          var res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent2);
          if (res) {
            return res;
          }
          var nextCh = dir > 0 ? wrappedLineExtent2.end : mv(wrappedLineExtent2.begin, -1);
          if (nextCh != null && !(dir > 0 && nextCh == line.text.length)) {
            res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh));
            if (res) {
              return res;
            }
          }
          return null;
        }
        var commands = {
          selectAll,
          singleSelection: function(cm) {
            return cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
          },
          killLine: function(cm) {
            return deleteNearSelection(cm, function(range2) {
              if (range2.empty()) {
                var len = getLine(cm.doc, range2.head.line).text.length;
                if (range2.head.ch == len && range2.head.line < cm.lastLine()) {
                  return { from: range2.head, to: Pos(range2.head.line + 1, 0) };
                } else {
                  return { from: range2.head, to: Pos(range2.head.line, len) };
                }
              } else {
                return { from: range2.from(), to: range2.to() };
              }
            });
          },
          deleteLine: function(cm) {
            return deleteNearSelection(cm, function(range2) {
              return {
                from: Pos(range2.from().line, 0),
                to: clipPos(cm.doc, Pos(range2.to().line + 1, 0))
              };
            });
          },
          delLineLeft: function(cm) {
            return deleteNearSelection(cm, function(range2) {
              return {
                from: Pos(range2.from().line, 0),
                to: range2.from()
              };
            });
          },
          delWrappedLineLeft: function(cm) {
            return deleteNearSelection(cm, function(range2) {
              var top = cm.charCoords(range2.head, "div").top + 5;
              var leftPos = cm.coordsChar({ left: 0, top }, "div");
              return { from: leftPos, to: range2.from() };
            });
          },
          delWrappedLineRight: function(cm) {
            return deleteNearSelection(cm, function(range2) {
              var top = cm.charCoords(range2.head, "div").top + 5;
              var rightPos = cm.coordsChar({ left: cm.display.lineDiv.offsetWidth + 100, top }, "div");
              return { from: range2.from(), to: rightPos };
            });
          },
          undo: function(cm) {
            return cm.undo();
          },
          redo: function(cm) {
            return cm.redo();
          },
          undoSelection: function(cm) {
            return cm.undoSelection();
          },
          redoSelection: function(cm) {
            return cm.redoSelection();
          },
          goDocStart: function(cm) {
            return cm.extendSelection(Pos(cm.firstLine(), 0));
          },
          goDocEnd: function(cm) {
            return cm.extendSelection(Pos(cm.lastLine()));
          },
          goLineStart: function(cm) {
            return cm.extendSelectionsBy(
              function(range2) {
                return lineStart(cm, range2.head.line);
              },
              { origin: "+move", bias: 1 }
            );
          },
          goLineStartSmart: function(cm) {
            return cm.extendSelectionsBy(
              function(range2) {
                return lineStartSmart(cm, range2.head);
              },
              { origin: "+move", bias: 1 }
            );
          },
          goLineEnd: function(cm) {
            return cm.extendSelectionsBy(
              function(range2) {
                return lineEnd(cm, range2.head.line);
              },
              { origin: "+move", bias: -1 }
            );
          },
          goLineRight: function(cm) {
            return cm.extendSelectionsBy(function(range2) {
              var top = cm.cursorCoords(range2.head, "div").top + 5;
              return cm.coordsChar({ left: cm.display.lineDiv.offsetWidth + 100, top }, "div");
            }, sel_move);
          },
          goLineLeft: function(cm) {
            return cm.extendSelectionsBy(function(range2) {
              var top = cm.cursorCoords(range2.head, "div").top + 5;
              return cm.coordsChar({ left: 0, top }, "div");
            }, sel_move);
          },
          goLineLeftSmart: function(cm) {
            return cm.extendSelectionsBy(function(range2) {
              var top = cm.cursorCoords(range2.head, "div").top + 5;
              var pos = cm.coordsChar({ left: 0, top }, "div");
              if (pos.ch < cm.getLine(pos.line).search(/\S/)) {
                return lineStartSmart(cm, range2.head);
              }
              return pos;
            }, sel_move);
          },
          goLineUp: function(cm) {
            return cm.moveV(-1, "line");
          },
          goLineDown: function(cm) {
            return cm.moveV(1, "line");
          },
          goPageUp: function(cm) {
            return cm.moveV(-1, "page");
          },
          goPageDown: function(cm) {
            return cm.moveV(1, "page");
          },
          goCharLeft: function(cm) {
            return cm.moveH(-1, "char");
          },
          goCharRight: function(cm) {
            return cm.moveH(1, "char");
          },
          goColumnLeft: function(cm) {
            return cm.moveH(-1, "column");
          },
          goColumnRight: function(cm) {
            return cm.moveH(1, "column");
          },
          goWordLeft: function(cm) {
            return cm.moveH(-1, "word");
          },
          goGroupRight: function(cm) {
            return cm.moveH(1, "group");
          },
          goGroupLeft: function(cm) {
            return cm.moveH(-1, "group");
          },
          goWordRight: function(cm) {
            return cm.moveH(1, "word");
          },
          delCharBefore: function(cm) {
            return cm.deleteH(-1, "codepoint");
          },
          delCharAfter: function(cm) {
            return cm.deleteH(1, "char");
          },
          delWordBefore: function(cm) {
            return cm.deleteH(-1, "word");
          },
          delWordAfter: function(cm) {
            return cm.deleteH(1, "word");
          },
          delGroupBefore: function(cm) {
            return cm.deleteH(-1, "group");
          },
          delGroupAfter: function(cm) {
            return cm.deleteH(1, "group");
          },
          indentAuto: function(cm) {
            return cm.indentSelection("smart");
          },
          indentMore: function(cm) {
            return cm.indentSelection("add");
          },
          indentLess: function(cm) {
            return cm.indentSelection("subtract");
          },
          insertTab: function(cm) {
            return cm.replaceSelection("	");
          },
          insertSoftTab: function(cm) {
            var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
            for (var i2 = 0; i2 < ranges.length; i2++) {
              var pos = ranges[i2].from();
              var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
              spaces.push(spaceStr(tabSize - col % tabSize));
            }
            cm.replaceSelections(spaces);
          },
          defaultTab: function(cm) {
            if (cm.somethingSelected()) {
              cm.indentSelection("add");
            } else {
              cm.execCommand("insertTab");
            }
          },
          // Swap the two chars left and right of each selection's head.
          // Move cursor behind the two swapped characters afterwards.
          //
          // Doesn't consider line feeds a character.
          // Doesn't scan more than one line above to find a character.
          // Doesn't do anything on an empty line.
          // Doesn't do anything with non-empty selections.
          transposeChars: function(cm) {
            return runInOp(cm, function() {
              var ranges = cm.listSelections(), newSel = [];
              for (var i2 = 0; i2 < ranges.length; i2++) {
                if (!ranges[i2].empty()) {
                  continue;
                }
                var cur = ranges[i2].head, line = getLine(cm.doc, cur.line).text;
                if (line) {
                  if (cur.ch == line.length) {
                    cur = new Pos(cur.line, cur.ch - 1);
                  }
                  if (cur.ch > 0) {
                    cur = new Pos(cur.line, cur.ch + 1);
                    cm.replaceRange(
                      line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2),
                      Pos(cur.line, cur.ch - 2),
                      cur,
                      "+transpose"
                    );
                  } else if (cur.line > cm.doc.first) {
                    var prev = getLine(cm.doc, cur.line - 1).text;
                    if (prev) {
                      cur = new Pos(cur.line, 1);
                      cm.replaceRange(
                        line.charAt(0) + cm.doc.lineSeparator() + prev.charAt(prev.length - 1),
                        Pos(cur.line - 1, prev.length - 1),
                        cur,
                        "+transpose"
                      );
                    }
                  }
                }
                newSel.push(new Range(cur, cur));
              }
              cm.setSelections(newSel);
            });
          },
          newlineAndIndent: function(cm) {
            return runInOp(cm, function() {
              var sels = cm.listSelections();
              for (var i2 = sels.length - 1; i2 >= 0; i2--) {
                cm.replaceRange(cm.doc.lineSeparator(), sels[i2].anchor, sels[i2].head, "+input");
              }
              sels = cm.listSelections();
              for (var i$12 = 0; i$12 < sels.length; i$12++) {
                cm.indentLine(sels[i$12].from().line, null, true);
              }
              ensureCursorVisible(cm);
            });
          },
          openLine: function(cm) {
            return cm.replaceSelection("\n", "start");
          },
          toggleOverwrite: function(cm) {
            return cm.toggleOverwrite();
          }
        };
        function lineStart(cm, lineN) {
          var line = getLine(cm.doc, lineN);
          var visual = visualLine(line);
          if (visual != line) {
            lineN = lineNo(visual);
          }
          return endOfLine(true, cm, visual, lineN, 1);
        }
        function lineEnd(cm, lineN) {
          var line = getLine(cm.doc, lineN);
          var visual = visualLineEnd(line);
          if (visual != line) {
            lineN = lineNo(visual);
          }
          return endOfLine(true, cm, line, lineN, -1);
        }
        function lineStartSmart(cm, pos) {
          var start = lineStart(cm, pos.line);
          var line = getLine(cm.doc, start.line);
          var order = getOrder(line, cm.doc.direction);
          if (!order || order[0].level == 0) {
            var firstNonWS = Math.max(start.ch, line.text.search(/\S/));
            var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
            return Pos(start.line, inWS ? 0 : firstNonWS, start.sticky);
          }
          return start;
        }
        function doHandleBinding(cm, bound, dropShift) {
          if (typeof bound == "string") {
            bound = commands[bound];
            if (!bound) {
              return false;
            }
          }
          cm.display.input.ensurePolled();
          var prevShift = cm.display.shift, done = false;
          try {
            if (cm.isReadOnly()) {
              cm.state.suppressEdits = true;
            }
            if (dropShift) {
              cm.display.shift = false;
            }
            done = bound(cm) != Pass;
          } finally {
            cm.display.shift = prevShift;
            cm.state.suppressEdits = false;
          }
          return done;
        }
        function lookupKeyForEditor(cm, name, handle) {
          for (var i2 = 0; i2 < cm.state.keyMaps.length; i2++) {
            var result = lookupKey(name, cm.state.keyMaps[i2], handle, cm);
            if (result) {
              return result;
            }
          }
          return cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm) || lookupKey(name, cm.options.keyMap, handle, cm);
        }
        var stopSeq = new Delayed();
        function dispatchKey(cm, name, e, handle) {
          var seq = cm.state.keySeq;
          if (seq) {
            if (isModifierKey(name)) {
              return "handled";
            }
            if (/\'$/.test(name)) {
              cm.state.keySeq = null;
            } else {
              stopSeq.set(50, function() {
                if (cm.state.keySeq == seq) {
                  cm.state.keySeq = null;
                  cm.display.input.reset();
                }
              });
            }
            if (dispatchKeyInner(cm, seq + " " + name, e, handle)) {
              return true;
            }
          }
          return dispatchKeyInner(cm, name, e, handle);
        }
        function dispatchKeyInner(cm, name, e, handle) {
          var result = lookupKeyForEditor(cm, name, handle);
          if (result == "multi") {
            cm.state.keySeq = name;
          }
          if (result == "handled") {
            signalLater(cm, "keyHandled", cm, name, e);
          }
          if (result == "handled" || result == "multi") {
            e_preventDefault(e);
            restartBlink(cm);
          }
          return !!result;
        }
        function handleKeyBinding(cm, e) {
          var name = keyName(e, true);
          if (!name) {
            return false;
          }
          if (e.shiftKey && !cm.state.keySeq) {
            return dispatchKey(cm, "Shift-" + name, e, function(b) {
              return doHandleBinding(cm, b, true);
            }) || dispatchKey(cm, name, e, function(b) {
              if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion) {
                return doHandleBinding(cm, b);
              }
            });
          } else {
            return dispatchKey(cm, name, e, function(b) {
              return doHandleBinding(cm, b);
            });
          }
        }
        function handleCharBinding(cm, e, ch) {
          return dispatchKey(cm, "'" + ch + "'", e, function(b) {
            return doHandleBinding(cm, b, true);
          });
        }
        var lastStoppedKey = null;
        function onKeyDown(e) {
          var cm = this;
          if (e.target && e.target != cm.display.input.getField()) {
            return;
          }
          cm.curOp.focus = activeElt(root(cm));
          if (signalDOMEvent(cm, e)) {
            return;
          }
          if (ie && ie_version < 11 && e.keyCode == 27) {
            e.returnValue = false;
          }
          var code = e.keyCode;
          cm.display.shift = code == 16 || e.shiftKey;
          var handled = handleKeyBinding(cm, e);
          if (presto) {
            lastStoppedKey = handled ? code : null;
            if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey)) {
              cm.replaceSelection("", null, "cut");
            }
          }
          if (gecko && !mac && !handled && code == 46 && e.shiftKey && !e.ctrlKey && document.execCommand) {
            document.execCommand("cut");
          }
          if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className)) {
            showCrossHair(cm);
          }
        }
        function showCrossHair(cm) {
          var lineDiv = cm.display.lineDiv;
          addClass(lineDiv, "CodeMirror-crosshair");
          function up(e) {
            if (e.keyCode == 18 || !e.altKey) {
              rmClass(lineDiv, "CodeMirror-crosshair");
              off(document, "keyup", up);
              off(document, "mouseover", up);
            }
          }
          on(document, "keyup", up);
          on(document, "mouseover", up);
        }
        function onKeyUp(e) {
          if (e.keyCode == 16) {
            this.doc.sel.shift = false;
          }
          signalDOMEvent(this, e);
        }
        function onKeyPress(e) {
          var cm = this;
          if (e.target && e.target != cm.display.input.getField()) {
            return;
          }
          if (eventInWidget(cm.display, e) || signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || mac && e.metaKey) {
            return;
          }
          var keyCode = e.keyCode, charCode = e.charCode;
          if (presto && keyCode == lastStoppedKey) {
            lastStoppedKey = null;
            e_preventDefault(e);
            return;
          }
          if (presto && (!e.which || e.which < 10) && handleKeyBinding(cm, e)) {
            return;
          }
          var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
          if (ch == "\b") {
            return;
          }
          if (handleCharBinding(cm, e, ch)) {
            return;
          }
          cm.display.input.onKeyPress(e);
        }
        var DOUBLECLICK_DELAY = 400;
        var PastClick = function(time, pos, button) {
          this.time = time;
          this.pos = pos;
          this.button = button;
        };
        PastClick.prototype.compare = function(time, pos, button) {
          return this.time + DOUBLECLICK_DELAY > time && cmp(pos, this.pos) == 0 && button == this.button;
        };
        var lastClick, lastDoubleClick;
        function clickRepeat(pos, button) {
          var now = +/* @__PURE__ */ new Date();
          if (lastDoubleClick && lastDoubleClick.compare(now, pos, button)) {
            lastClick = lastDoubleClick = null;
            return "triple";
          } else if (lastClick && lastClick.compare(now, pos, button)) {
            lastDoubleClick = new PastClick(now, pos, button);
            lastClick = null;
            return "double";
          } else {
            lastClick = new PastClick(now, pos, button);
            lastDoubleClick = null;
            return "single";
          }
        }
        function onMouseDown(e) {
          var cm = this, display = cm.display;
          if (signalDOMEvent(cm, e) || display.activeTouch && display.input.supportsTouch()) {
            return;
          }
          display.input.ensurePolled();
          display.shift = e.shiftKey;
          if (eventInWidget(display, e)) {
            if (!webkit) {
              display.scroller.draggable = false;
              setTimeout(function() {
                return display.scroller.draggable = true;
              }, 100);
            }
            return;
          }
          if (clickInGutter(cm, e)) {
            return;
          }
          var pos = posFromMouse(cm, e), button = e_button(e), repeat = pos ? clickRepeat(pos, button) : "single";
          win(cm).focus();
          if (button == 1 && cm.state.selectingText) {
            cm.state.selectingText(e);
          }
          if (pos && handleMappedButton(cm, button, pos, repeat, e)) {
            return;
          }
          if (button == 1) {
            if (pos) {
              leftButtonDown(cm, pos, repeat, e);
            } else if (e_target(e) == display.scroller) {
              e_preventDefault(e);
            }
          } else if (button == 2) {
            if (pos) {
              extendSelection(cm.doc, pos);
            }
            setTimeout(function() {
              return display.input.focus();
            }, 20);
          } else if (button == 3) {
            if (captureRightClick) {
              cm.display.input.onContextMenu(e);
            } else {
              delayBlurEvent(cm);
            }
          }
        }
        function handleMappedButton(cm, button, pos, repeat, event) {
          var name = "Click";
          if (repeat == "double") {
            name = "Double" + name;
          } else if (repeat == "triple") {
            name = "Triple" + name;
          }
          name = (button == 1 ? "Left" : button == 2 ? "Middle" : "Right") + name;
          return dispatchKey(cm, addModifierNames(name, event), event, function(bound) {
            if (typeof bound == "string") {
              bound = commands[bound];
            }
            if (!bound) {
              return false;
            }
            var done = false;
            try {
              if (cm.isReadOnly()) {
                cm.state.suppressEdits = true;
              }
              done = bound(cm, pos) != Pass;
            } finally {
              cm.state.suppressEdits = false;
            }
            return done;
          });
        }
        function configureMouse(cm, repeat, event) {
          var option = cm.getOption("configureMouse");
          var value = option ? option(cm, repeat, event) : {};
          if (value.unit == null) {
            var rect = chromeOS ? event.shiftKey && event.metaKey : event.altKey;
            value.unit = rect ? "rectangle" : repeat == "single" ? "char" : repeat == "double" ? "word" : "line";
          }
          if (value.extend == null || cm.doc.extend) {
            value.extend = cm.doc.extend || event.shiftKey;
          }
          if (value.addNew == null) {
            value.addNew = mac ? event.metaKey : event.ctrlKey;
          }
          if (value.moveOnDrag == null) {
            value.moveOnDrag = !(mac ? event.altKey : event.ctrlKey);
          }
          return value;
        }
        function leftButtonDown(cm, pos, repeat, event) {
          if (ie) {
            setTimeout(bind(ensureFocus, cm), 0);
          } else {
            cm.curOp.focus = activeElt(root(cm));
          }
          var behavior = configureMouse(cm, repeat, event);
          var sel = cm.doc.sel, contained;
          if (cm.options.dragDrop && dragAndDrop && !cm.isReadOnly() && repeat == "single" && (contained = sel.contains(pos)) > -1 && (cmp((contained = sel.ranges[contained]).from(), pos) < 0 || pos.xRel > 0) && (cmp(contained.to(), pos) > 0 || pos.xRel < 0)) {
            leftButtonStartDrag(cm, event, pos, behavior);
          } else {
            leftButtonSelect(cm, event, pos, behavior);
          }
        }
        function leftButtonStartDrag(cm, event, pos, behavior) {
          var display = cm.display, moved = false;
          var dragEnd = operation(cm, function(e) {
            if (webkit) {
              display.scroller.draggable = false;
            }
            cm.state.draggingText = false;
            if (cm.state.delayingBlurEvent) {
              if (cm.hasFocus()) {
                cm.state.delayingBlurEvent = false;
              } else {
                delayBlurEvent(cm);
              }
            }
            off(display.wrapper.ownerDocument, "mouseup", dragEnd);
            off(display.wrapper.ownerDocument, "mousemove", mouseMove);
            off(display.scroller, "dragstart", dragStart);
            off(display.scroller, "drop", dragEnd);
            if (!moved) {
              e_preventDefault(e);
              if (!behavior.addNew) {
                extendSelection(cm.doc, pos, null, null, behavior.extend);
              }
              if (webkit && !safari || ie && ie_version == 9) {
                setTimeout(function() {
                  display.wrapper.ownerDocument.body.focus({ preventScroll: true });
                  display.input.focus();
                }, 20);
              } else {
                display.input.focus();
              }
            }
          });
          var mouseMove = function(e2) {
            moved = moved || Math.abs(event.clientX - e2.clientX) + Math.abs(event.clientY - e2.clientY) >= 10;
          };
          var dragStart = function() {
            return moved = true;
          };
          if (webkit) {
            display.scroller.draggable = true;
          }
          cm.state.draggingText = dragEnd;
          dragEnd.copy = !behavior.moveOnDrag;
          on(display.wrapper.ownerDocument, "mouseup", dragEnd);
          on(display.wrapper.ownerDocument, "mousemove", mouseMove);
          on(display.scroller, "dragstart", dragStart);
          on(display.scroller, "drop", dragEnd);
          cm.state.delayingBlurEvent = true;
          setTimeout(function() {
            return display.input.focus();
          }, 20);
          if (display.scroller.dragDrop) {
            display.scroller.dragDrop();
          }
        }
        function rangeForUnit(cm, pos, unit) {
          if (unit == "char") {
            return new Range(pos, pos);
          }
          if (unit == "word") {
            return cm.findWordAt(pos);
          }
          if (unit == "line") {
            return new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
          }
          var result = unit(cm, pos);
          return new Range(result.from, result.to);
        }
        function leftButtonSelect(cm, event, start, behavior) {
          if (ie) {
            delayBlurEvent(cm);
          }
          var display = cm.display, doc3 = cm.doc;
          e_preventDefault(event);
          var ourRange, ourIndex, startSel = doc3.sel, ranges = startSel.ranges;
          if (behavior.addNew && !behavior.extend) {
            ourIndex = doc3.sel.contains(start);
            if (ourIndex > -1) {
              ourRange = ranges[ourIndex];
            } else {
              ourRange = new Range(start, start);
            }
          } else {
            ourRange = doc3.sel.primary();
            ourIndex = doc3.sel.primIndex;
          }
          if (behavior.unit == "rectangle") {
            if (!behavior.addNew) {
              ourRange = new Range(start, start);
            }
            start = posFromMouse(cm, event, true, true);
            ourIndex = -1;
          } else {
            var range2 = rangeForUnit(cm, start, behavior.unit);
            if (behavior.extend) {
              ourRange = extendRange(ourRange, range2.anchor, range2.head, behavior.extend);
            } else {
              ourRange = range2;
            }
          }
          if (!behavior.addNew) {
            ourIndex = 0;
            setSelection(doc3, new Selection([ourRange], 0), sel_mouse);
            startSel = doc3.sel;
          } else if (ourIndex == -1) {
            ourIndex = ranges.length;
            setSelection(
              doc3,
              normalizeSelection(cm, ranges.concat([ourRange]), ourIndex),
              { scroll: false, origin: "*mouse" }
            );
          } else if (ranges.length > 1 && ranges[ourIndex].empty() && behavior.unit == "char" && !behavior.extend) {
            setSelection(
              doc3,
              normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0),
              { scroll: false, origin: "*mouse" }
            );
            startSel = doc3.sel;
          } else {
            replaceOneSelection(doc3, ourIndex, ourRange, sel_mouse);
          }
          var lastPos = start;
          function extendTo(pos) {
            if (cmp(lastPos, pos) == 0) {
              return;
            }
            lastPos = pos;
            if (behavior.unit == "rectangle") {
              var ranges2 = [], tabSize = cm.options.tabSize;
              var startCol = countColumn(getLine(doc3, start.line).text, start.ch, tabSize);
              var posCol = countColumn(getLine(doc3, pos.line).text, pos.ch, tabSize);
              var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
              for (var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line)); line <= end; line++) {
                var text2 = getLine(doc3, line).text, leftPos = findColumn(text2, left, tabSize);
                if (left == right) {
                  ranges2.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));
                } else if (text2.length > leftPos) {
                  ranges2.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text2, right, tabSize))));
                }
              }
              if (!ranges2.length) {
                ranges2.push(new Range(start, start));
              }
              setSelection(
                doc3,
                normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges2), ourIndex),
                { origin: "*mouse", scroll: false }
              );
              cm.scrollIntoView(pos);
            } else {
              var oldRange = ourRange;
              var range3 = rangeForUnit(cm, pos, behavior.unit);
              var anchor = oldRange.anchor, head;
              if (cmp(range3.anchor, anchor) > 0) {
                head = range3.head;
                anchor = minPos(oldRange.from(), range3.anchor);
              } else {
                head = range3.anchor;
                anchor = maxPos(oldRange.to(), range3.head);
              }
              var ranges$1 = startSel.ranges.slice(0);
              ranges$1[ourIndex] = bidiSimplify(cm, new Range(clipPos(doc3, anchor), head));
              setSelection(doc3, normalizeSelection(cm, ranges$1, ourIndex), sel_mouse);
            }
          }
          var editorSize = display.wrapper.getBoundingClientRect();
          var counter = 0;
          function extend(e) {
            var curCount = ++counter;
            var cur = posFromMouse(cm, e, true, behavior.unit == "rectangle");
            if (!cur) {
              return;
            }
            if (cmp(cur, lastPos) != 0) {
              cm.curOp.focus = activeElt(root(cm));
              extendTo(cur);
              var visible = visibleLines(display, doc3);
              if (cur.line >= visible.to || cur.line < visible.from) {
                setTimeout(operation(cm, function() {
                  if (counter == curCount) {
                    extend(e);
                  }
                }), 150);
              }
            } else {
              var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
              if (outside) {
                setTimeout(operation(cm, function() {
                  if (counter != curCount) {
                    return;
                  }
                  display.scroller.scrollTop += outside;
                  extend(e);
                }), 50);
              }
            }
          }
          function done(e) {
            cm.state.selectingText = false;
            counter = Infinity;
            if (e) {
              e_preventDefault(e);
              display.input.focus();
            }
            off(display.wrapper.ownerDocument, "mousemove", move);
            off(display.wrapper.ownerDocument, "mouseup", up);
            doc3.history.lastSelOrigin = null;
          }
          var move = operation(cm, function(e) {
            if (e.buttons === 0 || !e_button(e)) {
              done(e);
            } else {
              extend(e);
            }
          });
          var up = operation(cm, done);
          cm.state.selectingText = up;
          on(display.wrapper.ownerDocument, "mousemove", move);
          on(display.wrapper.ownerDocument, "mouseup", up);
        }
        function bidiSimplify(cm, range2) {
          var anchor = range2.anchor;
          var head = range2.head;
          var anchorLine = getLine(cm.doc, anchor.line);
          if (cmp(anchor, head) == 0 && anchor.sticky == head.sticky) {
            return range2;
          }
          var order = getOrder(anchorLine);
          if (!order) {
            return range2;
          }
          var index = getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index];
          if (part.from != anchor.ch && part.to != anchor.ch) {
            return range2;
          }
          var boundary = index + (part.from == anchor.ch == (part.level != 1) ? 0 : 1);
          if (boundary == 0 || boundary == order.length) {
            return range2;
          }
          var leftSide;
          if (head.line != anchor.line) {
            leftSide = (head.line - anchor.line) * (cm.doc.direction == "ltr" ? 1 : -1) > 0;
          } else {
            var headIndex = getBidiPartAt(order, head.ch, head.sticky);
            var dir = headIndex - index || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
            if (headIndex == boundary - 1 || headIndex == boundary) {
              leftSide = dir < 0;
            } else {
              leftSide = dir > 0;
            }
          }
          var usePart = order[boundary + (leftSide ? -1 : 0)];
          var from2 = leftSide == (usePart.level == 1);
          var ch = from2 ? usePart.from : usePart.to, sticky = from2 ? "after" : "before";
          return anchor.ch == ch && anchor.sticky == sticky ? range2 : new Range(new Pos(anchor.line, ch, sticky), head);
        }
        function gutterEvent(cm, e, type, prevent) {
          var mX, mY;
          if (e.touches) {
            mX = e.touches[0].clientX;
            mY = e.touches[0].clientY;
          } else {
            try {
              mX = e.clientX;
              mY = e.clientY;
            } catch (e$1) {
              return false;
            }
          }
          if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) {
            return false;
          }
          if (prevent) {
            e_preventDefault(e);
          }
          var display = cm.display;
          var lineBox = display.lineDiv.getBoundingClientRect();
          if (mY > lineBox.bottom || !hasHandler(cm, type)) {
            return e_defaultPrevented(e);
          }
          mY -= lineBox.top - display.viewOffset;
          for (var i2 = 0; i2 < cm.display.gutterSpecs.length; ++i2) {
            var g = display.gutters.childNodes[i2];
            if (g && g.getBoundingClientRect().right >= mX) {
              var line = lineAtHeight(cm.doc, mY);
              var gutter = cm.display.gutterSpecs[i2];
              signal(cm, type, cm, line, gutter.className, e);
              return e_defaultPrevented(e);
            }
          }
        }
        function clickInGutter(cm, e) {
          return gutterEvent(cm, e, "gutterClick", true);
        }
        function onContextMenu(cm, e) {
          if (eventInWidget(cm.display, e) || contextMenuInGutter(cm, e)) {
            return;
          }
          if (signalDOMEvent(cm, e, "contextmenu")) {
            return;
          }
          if (!captureRightClick) {
            cm.display.input.onContextMenu(e);
          }
        }
        function contextMenuInGutter(cm, e) {
          if (!hasHandler(cm, "gutterContextMenu")) {
            return false;
          }
          return gutterEvent(cm, e, "gutterContextMenu", false);
        }
        function themeChanged(cm) {
          cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
          clearCaches(cm);
        }
        var Init = { toString: function() {
          return "CodeMirror.Init";
        } };
        var defaults = {};
        var optionHandlers = {};
        function defineOptions(CodeMirror4) {
          var optionHandlers2 = CodeMirror4.optionHandlers;
          function option(name, deflt, handle, notOnInit) {
            CodeMirror4.defaults[name] = deflt;
            if (handle) {
              optionHandlers2[name] = notOnInit ? function(cm, val, old) {
                if (old != Init) {
                  handle(cm, val, old);
                }
              } : handle;
            }
          }
          CodeMirror4.defineOption = option;
          CodeMirror4.Init = Init;
          option("value", "", function(cm, val) {
            return cm.setValue(val);
          }, true);
          option("mode", null, function(cm, val) {
            cm.doc.modeOption = val;
            loadMode(cm);
          }, true);
          option("indentUnit", 2, loadMode, true);
          option("indentWithTabs", false);
          option("smartIndent", true);
          option("tabSize", 4, function(cm) {
            resetModeState(cm);
            clearCaches(cm);
            regChange(cm);
          }, true);
          option("lineSeparator", null, function(cm, val) {
            cm.doc.lineSep = val;
            if (!val) {
              return;
            }
            var newBreaks = [], lineNo2 = cm.doc.first;
            cm.doc.iter(function(line) {
              for (var pos = 0; ; ) {
                var found = line.text.indexOf(val, pos);
                if (found == -1) {
                  break;
                }
                pos = found + val.length;
                newBreaks.push(Pos(lineNo2, found));
              }
              lineNo2++;
            });
            for (var i2 = newBreaks.length - 1; i2 >= 0; i2--) {
              replaceRange(cm.doc, val, newBreaks[i2], Pos(newBreaks[i2].line, newBreaks[i2].ch + val.length));
            }
          });
          option("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\u2066\u2067\u2069\ufeff\ufff9-\ufffc]/g, function(cm, val, old) {
            cm.state.specialChars = new RegExp(val.source + (val.test("	") ? "" : "|	"), "g");
            if (old != Init) {
              cm.refresh();
            }
          });
          option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {
            return cm.refresh();
          }, true);
          option("electricChars", true);
          option("inputStyle", mobile ? "contenteditable" : "textarea", function() {
            throw new Error("inputStyle can not (yet) be changed in a running editor");
          }, true);
          option("spellcheck", false, function(cm, val) {
            return cm.getInputField().spellcheck = val;
          }, true);
          option("autocorrect", false, function(cm, val) {
            return cm.getInputField().autocorrect = val;
          }, true);
          option("autocapitalize", false, function(cm, val) {
            return cm.getInputField().autocapitalize = val;
          }, true);
          option("rtlMoveVisually", !windows);
          option("wholeLineUpdateBefore", true);
          option("theme", "default", function(cm) {
            themeChanged(cm);
            updateGutters(cm);
          }, true);
          option("keyMap", "default", function(cm, val, old) {
            var next = getKeyMap(val);
            var prev = old != Init && getKeyMap(old);
            if (prev && prev.detach) {
              prev.detach(cm, next);
            }
            if (next.attach) {
              next.attach(cm, prev || null);
            }
          });
          option("extraKeys", null);
          option("configureMouse", null);
          option("lineWrapping", false, wrappingChanged, true);
          option("gutters", [], function(cm, val) {
            cm.display.gutterSpecs = getGutters(val, cm.options.lineNumbers);
            updateGutters(cm);
          }, true);
          option("fixedGutter", true, function(cm, val) {
            cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
            cm.refresh();
          }, true);
          option("coverGutterNextToScrollbar", false, function(cm) {
            return updateScrollbars(cm);
          }, true);
          option("scrollbarStyle", "native", function(cm) {
            initScrollbars(cm);
            updateScrollbars(cm);
            cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
            cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
          }, true);
          option("lineNumbers", false, function(cm, val) {
            cm.display.gutterSpecs = getGutters(cm.options.gutters, val);
            updateGutters(cm);
          }, true);
          option("firstLineNumber", 1, updateGutters, true);
          option("lineNumberFormatter", function(integer) {
            return integer;
          }, updateGutters, true);
          option("showCursorWhenSelecting", false, updateSelection, true);
          option("resetSelectionOnContextMenu", true);
          option("lineWiseCopyCut", true);
          option("pasteLinesPerSelection", true);
          option("selectionsMayTouch", false);
          option("readOnly", false, function(cm, val) {
            if (val == "nocursor") {
              onBlur(cm);
              cm.display.input.blur();
            }
            cm.display.input.readOnlyChanged(val);
          });
          option("screenReaderLabel", null, function(cm, val) {
            val = val === "" ? null : val;
            cm.display.input.screenReaderLabelChanged(val);
          });
          option("disableInput", false, function(cm, val) {
            if (!val) {
              cm.display.input.reset();
            }
          }, true);
          option("dragDrop", true, dragDropChanged);
          option("allowDropFileTypes", null);
          option("cursorBlinkRate", 530);
          option("cursorScrollMargin", 0);
          option("cursorHeight", 1, updateSelection, true);
          option("singleCursorHeightPerLine", true, updateSelection, true);
          option("workTime", 100);
          option("workDelay", 100);
          option("flattenSpans", true, resetModeState, true);
          option("addModeClass", false, resetModeState, true);
          option("pollInterval", 100);
          option("undoDepth", 200, function(cm, val) {
            return cm.doc.history.undoDepth = val;
          });
          option("historyEventDelay", 1250);
          option("viewportMargin", 10, function(cm) {
            return cm.refresh();
          }, true);
          option("maxHighlightLength", 1e4, resetModeState, true);
          option("moveInputWithCursor", true, function(cm, val) {
            if (!val) {
              cm.display.input.resetPosition();
            }
          });
          option("tabindex", null, function(cm, val) {
            return cm.display.input.getField().tabIndex = val || "";
          });
          option("autofocus", null);
          option("direction", "ltr", function(cm, val) {
            return cm.doc.setDirection(val);
          }, true);
          option("phrases", null);
        }
        function dragDropChanged(cm, value, old) {
          var wasOn = old && old != Init;
          if (!value != !wasOn) {
            var funcs = cm.display.dragFunctions;
            var toggle = value ? on : off;
            toggle(cm.display.scroller, "dragstart", funcs.start);
            toggle(cm.display.scroller, "dragenter", funcs.enter);
            toggle(cm.display.scroller, "dragover", funcs.over);
            toggle(cm.display.scroller, "dragleave", funcs.leave);
            toggle(cm.display.scroller, "drop", funcs.drop);
          }
        }
        function wrappingChanged(cm) {
          if (cm.options.lineWrapping) {
            addClass(cm.display.wrapper, "CodeMirror-wrap");
            cm.display.sizer.style.minWidth = "";
            cm.display.sizerWidth = null;
          } else {
            rmClass(cm.display.wrapper, "CodeMirror-wrap");
            findMaxLine(cm);
          }
          estimateLineHeights(cm);
          regChange(cm);
          clearCaches(cm);
          setTimeout(function() {
            return updateScrollbars(cm);
          }, 100);
        }
        function CodeMirror3(place, options) {
          var this$1 = this;
          if (!(this instanceof CodeMirror3)) {
            return new CodeMirror3(place, options);
          }
          this.options = options = options ? copyObj(options) : {};
          copyObj(defaults, options, false);
          var doc3 = options.value;
          if (typeof doc3 == "string") {
            doc3 = new Doc2(doc3, options.mode, null, options.lineSeparator, options.direction);
          } else if (options.mode) {
            doc3.modeOption = options.mode;
          }
          this.doc = doc3;
          var input = new CodeMirror3.inputStyles[options.inputStyle](this);
          var display = this.display = new Display(place, doc3, input, options);
          display.wrapper.CodeMirror = this;
          themeChanged(this);
          if (options.lineWrapping) {
            this.display.wrapper.className += " CodeMirror-wrap";
          }
          initScrollbars(this);
          this.state = {
            keyMaps: [],
            // stores maps added by addKeyMap
            overlays: [],
            // highlighting overlays, as added by addOverlay
            modeGen: 0,
            // bumped when mode/overlay changes, used to invalidate highlighting info
            overwrite: false,
            delayingBlurEvent: false,
            focused: false,
            suppressEdits: false,
            // used to disable editing during key handlers when in readOnly mode
            pasteIncoming: -1,
            cutIncoming: -1,
            // help recognize paste/cut edits in input.poll
            selectingText: false,
            draggingText: false,
            highlight: new Delayed(),
            // stores highlight worker timeout
            keySeq: null,
            // Unfinished key sequence
            specialChars: null
          };
          if (options.autofocus && !mobile) {
            display.input.focus();
          }
          if (ie && ie_version < 11) {
            setTimeout(function() {
              return this$1.display.input.reset(true);
            }, 20);
          }
          registerEventHandlers(this);
          ensureGlobalHandlers();
          startOperation(this);
          this.curOp.forceUpdate = true;
          attachDoc(this, doc3);
          if (options.autofocus && !mobile || this.hasFocus()) {
            setTimeout(function() {
              if (this$1.hasFocus() && !this$1.state.focused) {
                onFocus(this$1);
              }
            }, 20);
          } else {
            onBlur(this);
          }
          for (var opt in optionHandlers) {
            if (optionHandlers.hasOwnProperty(opt)) {
              optionHandlers[opt](this, options[opt], Init);
            }
          }
          maybeUpdateLineNumberWidth(this);
          if (options.finishInit) {
            options.finishInit(this);
          }
          for (var i2 = 0; i2 < initHooks.length; ++i2) {
            initHooks[i2](this);
          }
          endOperation(this);
          if (webkit && options.lineWrapping && getComputedStyle(display.lineDiv).textRendering == "optimizelegibility") {
            display.lineDiv.style.textRendering = "auto";
          }
        }
        CodeMirror3.defaults = defaults;
        CodeMirror3.optionHandlers = optionHandlers;
        function registerEventHandlers(cm) {
          var d = cm.display;
          on(d.scroller, "mousedown", operation(cm, onMouseDown));
          if (ie && ie_version < 11) {
            on(d.scroller, "dblclick", operation(cm, function(e) {
              if (signalDOMEvent(cm, e)) {
                return;
              }
              var pos = posFromMouse(cm, e);
              if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) {
                return;
              }
              e_preventDefault(e);
              var word = cm.findWordAt(pos);
              extendSelection(cm.doc, word.anchor, word.head);
            }));
          } else {
            on(d.scroller, "dblclick", function(e) {
              return signalDOMEvent(cm, e) || e_preventDefault(e);
            });
          }
          on(d.scroller, "contextmenu", function(e) {
            return onContextMenu(cm, e);
          });
          on(d.input.getField(), "contextmenu", function(e) {
            if (!d.scroller.contains(e.target)) {
              onContextMenu(cm, e);
            }
          });
          var touchFinished, prevTouch = { end: 0 };
          function finishTouch() {
            if (d.activeTouch) {
              touchFinished = setTimeout(function() {
                return d.activeTouch = null;
              }, 1e3);
              prevTouch = d.activeTouch;
              prevTouch.end = +/* @__PURE__ */ new Date();
            }
          }
          function isMouseLikeTouchEvent(e) {
            if (e.touches.length != 1) {
              return false;
            }
            var touch = e.touches[0];
            return touch.radiusX <= 1 && touch.radiusY <= 1;
          }
          function farAway(touch, other) {
            if (other.left == null) {
              return true;
            }
            var dx = other.left - touch.left, dy = other.top - touch.top;
            return dx * dx + dy * dy > 20 * 20;
          }
          on(d.scroller, "touchstart", function(e) {
            if (!signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e) && !clickInGutter(cm, e)) {
              d.input.ensurePolled();
              clearTimeout(touchFinished);
              var now = +/* @__PURE__ */ new Date();
              d.activeTouch = {
                start: now,
                moved: false,
                prev: now - prevTouch.end <= 300 ? prevTouch : null
              };
              if (e.touches.length == 1) {
                d.activeTouch.left = e.touches[0].pageX;
                d.activeTouch.top = e.touches[0].pageY;
              }
            }
          });
          on(d.scroller, "touchmove", function() {
            if (d.activeTouch) {
              d.activeTouch.moved = true;
            }
          });
          on(d.scroller, "touchend", function(e) {
            var touch = d.activeTouch;
            if (touch && !eventInWidget(d, e) && touch.left != null && !touch.moved && /* @__PURE__ */ new Date() - touch.start < 300) {
              var pos = cm.coordsChar(d.activeTouch, "page"), range2;
              if (!touch.prev || farAway(touch, touch.prev)) {
                range2 = new Range(pos, pos);
              } else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) {
                range2 = cm.findWordAt(pos);
              } else {
                range2 = new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
              }
              cm.setSelection(range2.anchor, range2.head);
              cm.focus();
              e_preventDefault(e);
            }
            finishTouch();
          });
          on(d.scroller, "touchcancel", finishTouch);
          on(d.scroller, "scroll", function() {
            if (d.scroller.clientHeight) {
              updateScrollTop(cm, d.scroller.scrollTop);
              setScrollLeft(cm, d.scroller.scrollLeft, true);
              signal(cm, "scroll", cm);
            }
          });
          on(d.scroller, "mousewheel", function(e) {
            return onScrollWheel(cm, e);
          });
          on(d.scroller, "DOMMouseScroll", function(e) {
            return onScrollWheel(cm, e);
          });
          on(d.wrapper, "scroll", function() {
            return d.wrapper.scrollTop = d.wrapper.scrollLeft = 0;
          });
          d.dragFunctions = {
            enter: function(e) {
              if (!signalDOMEvent(cm, e)) {
                e_stop(e);
              }
            },
            over: function(e) {
              if (!signalDOMEvent(cm, e)) {
                onDragOver(cm, e);
                e_stop(e);
              }
            },
            start: function(e) {
              return onDragStart(cm, e);
            },
            drop: operation(cm, onDrop),
            leave: function(e) {
              if (!signalDOMEvent(cm, e)) {
                clearDragCursor(cm);
              }
            }
          };
          var inp = d.input.getField();
          on(inp, "keyup", function(e) {
            return onKeyUp.call(cm, e);
          });
          on(inp, "keydown", operation(cm, onKeyDown));
          on(inp, "keypress", operation(cm, onKeyPress));
          on(inp, "focus", function(e) {
            return onFocus(cm, e);
          });
          on(inp, "blur", function(e) {
            return onBlur(cm, e);
          });
        }
        var initHooks = [];
        CodeMirror3.defineInitHook = function(f) {
          return initHooks.push(f);
        };
        function indentLine(cm, n, how, aggressive) {
          var doc3 = cm.doc, state;
          if (how == null) {
            how = "add";
          }
          if (how == "smart") {
            if (!doc3.mode.indent) {
              how = "prev";
            } else {
              state = getContextBefore(cm, n).state;
            }
          }
          var tabSize = cm.options.tabSize;
          var line = getLine(doc3, n), curSpace = countColumn(line.text, null, tabSize);
          if (line.stateAfter) {
            line.stateAfter = null;
          }
          var curSpaceString = line.text.match(/^\s*/)[0], indentation;
          if (!aggressive && !/\S/.test(line.text)) {
            indentation = 0;
            how = "not";
          } else if (how == "smart") {
            indentation = doc3.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
            if (indentation == Pass || indentation > 150) {
              if (!aggressive) {
                return;
              }
              how = "prev";
            }
          }
          if (how == "prev") {
            if (n > doc3.first) {
              indentation = countColumn(getLine(doc3, n - 1).text, null, tabSize);
            } else {
              indentation = 0;
            }
          } else if (how == "add") {
            indentation = curSpace + cm.options.indentUnit;
          } else if (how == "subtract") {
            indentation = curSpace - cm.options.indentUnit;
          } else if (typeof how == "number") {
            indentation = curSpace + how;
          }
          indentation = Math.max(0, indentation);
          var indentString = "", pos = 0;
          if (cm.options.indentWithTabs) {
            for (var i2 = Math.floor(indentation / tabSize); i2; --i2) {
              pos += tabSize;
              indentString += "	";
            }
          }
          if (pos < indentation) {
            indentString += spaceStr(indentation - pos);
          }
          if (indentString != curSpaceString) {
            replaceRange(doc3, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
            line.stateAfter = null;
            return true;
          } else {
            for (var i$12 = 0; i$12 < doc3.sel.ranges.length; i$12++) {
              var range2 = doc3.sel.ranges[i$12];
              if (range2.head.line == n && range2.head.ch < curSpaceString.length) {
                var pos$1 = Pos(n, curSpaceString.length);
                replaceOneSelection(doc3, i$12, new Range(pos$1, pos$1));
                break;
              }
            }
          }
        }
        var lastCopied = null;
        function setLastCopied(newLastCopied) {
          lastCopied = newLastCopied;
        }
        function applyTextInput(cm, inserted, deleted, sel, origin) {
          var doc3 = cm.doc;
          cm.display.shift = false;
          if (!sel) {
            sel = doc3.sel;
          }
          var recent = +/* @__PURE__ */ new Date() - 200;
          var paste = origin == "paste" || cm.state.pasteIncoming > recent;
          var textLines = splitLinesAuto(inserted), multiPaste = null;
          if (paste && sel.ranges.length > 1) {
            if (lastCopied && lastCopied.text.join("\n") == inserted) {
              if (sel.ranges.length % lastCopied.text.length == 0) {
                multiPaste = [];
                for (var i2 = 0; i2 < lastCopied.text.length; i2++) {
                  multiPaste.push(doc3.splitLines(lastCopied.text[i2]));
                }
              }
            } else if (textLines.length == sel.ranges.length && cm.options.pasteLinesPerSelection) {
              multiPaste = map3(textLines, function(l) {
                return [l];
              });
            }
          }
          var updateInput = cm.curOp.updateInput;
          for (var i$12 = sel.ranges.length - 1; i$12 >= 0; i$12--) {
            var range2 = sel.ranges[i$12];
            var from2 = range2.from(), to = range2.to();
            if (range2.empty()) {
              if (deleted && deleted > 0) {
                from2 = Pos(from2.line, from2.ch - deleted);
              } else if (cm.state.overwrite && !paste) {
                to = Pos(to.line, Math.min(getLine(doc3, to.line).text.length, to.ch + lst(textLines).length));
              } else if (paste && lastCopied && lastCopied.lineWise && lastCopied.text.join("\n") == textLines.join("\n")) {
                from2 = to = Pos(from2.line, 0);
              }
            }
            var changeEvent = {
              from: from2,
              to,
              text: multiPaste ? multiPaste[i$12 % multiPaste.length] : textLines,
              origin: origin || (paste ? "paste" : cm.state.cutIncoming > recent ? "cut" : "+input")
            };
            makeChange(cm.doc, changeEvent);
            signalLater(cm, "inputRead", cm, changeEvent);
          }
          if (inserted && !paste) {
            triggerElectric(cm, inserted);
          }
          ensureCursorVisible(cm);
          if (cm.curOp.updateInput < 2) {
            cm.curOp.updateInput = updateInput;
          }
          cm.curOp.typing = true;
          cm.state.pasteIncoming = cm.state.cutIncoming = -1;
        }
        function handlePaste(e, cm) {
          var pasted = e.clipboardData && e.clipboardData.getData("Text");
          if (pasted) {
            e.preventDefault();
            if (!cm.isReadOnly() && !cm.options.disableInput && cm.hasFocus()) {
              runInOp(cm, function() {
                return applyTextInput(cm, pasted, 0, null, "paste");
              });
            }
            return true;
          }
        }
        function triggerElectric(cm, inserted) {
          if (!cm.options.electricChars || !cm.options.smartIndent) {
            return;
          }
          var sel = cm.doc.sel;
          for (var i2 = sel.ranges.length - 1; i2 >= 0; i2--) {
            var range2 = sel.ranges[i2];
            if (range2.head.ch > 100 || i2 && sel.ranges[i2 - 1].head.line == range2.head.line) {
              continue;
            }
            var mode = cm.getModeAt(range2.head);
            var indented = false;
            if (mode.electricChars) {
              for (var j = 0; j < mode.electricChars.length; j++) {
                if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
                  indented = indentLine(cm, range2.head.line, "smart");
                  break;
                }
              }
            } else if (mode.electricInput) {
              if (mode.electricInput.test(getLine(cm.doc, range2.head.line).text.slice(0, range2.head.ch))) {
                indented = indentLine(cm, range2.head.line, "smart");
              }
            }
            if (indented) {
              signalLater(cm, "electricInput", cm, range2.head.line);
            }
          }
        }
        function copyableRanges(cm) {
          var text2 = [], ranges = [];
          for (var i2 = 0; i2 < cm.doc.sel.ranges.length; i2++) {
            var line = cm.doc.sel.ranges[i2].head.line;
            var lineRange = { anchor: Pos(line, 0), head: Pos(line + 1, 0) };
            ranges.push(lineRange);
            text2.push(cm.getRange(lineRange.anchor, lineRange.head));
          }
          return { text: text2, ranges };
        }
        function disableBrowserMagic(field, spellcheck, autocorrect, autocapitalize) {
          field.setAttribute("autocorrect", autocorrect ? "on" : "off");
          field.setAttribute("autocapitalize", autocapitalize ? "on" : "off");
          field.setAttribute("spellcheck", !!spellcheck);
        }
        function hiddenTextarea() {
          var te = elt("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none");
          var div = elt("div", [te], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
          if (webkit) {
            te.style.width = "1000px";
          } else {
            te.setAttribute("wrap", "off");
          }
          if (ios) {
            te.style.border = "1px solid black";
          }
          return div;
        }
        function addEditorMethods(CodeMirror4) {
          var optionHandlers2 = CodeMirror4.optionHandlers;
          var helpers = CodeMirror4.helpers = {};
          CodeMirror4.prototype = {
            constructor: CodeMirror4,
            focus: function() {
              win(this).focus();
              this.display.input.focus();
            },
            setOption: function(option, value) {
              var options = this.options, old = options[option];
              if (options[option] == value && option != "mode") {
                return;
              }
              options[option] = value;
              if (optionHandlers2.hasOwnProperty(option)) {
                operation(this, optionHandlers2[option])(this, value, old);
              }
              signal(this, "optionChange", this, option);
            },
            getOption: function(option) {
              return this.options[option];
            },
            getDoc: function() {
              return this.doc;
            },
            addKeyMap: function(map4, bottom) {
              this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map4));
            },
            removeKeyMap: function(map4) {
              var maps = this.state.keyMaps;
              for (var i2 = 0; i2 < maps.length; ++i2) {
                if (maps[i2] == map4 || maps[i2].name == map4) {
                  maps.splice(i2, 1);
                  return true;
                }
              }
            },
            addOverlay: methodOp(function(spec, options) {
              var mode = spec.token ? spec : CodeMirror4.getMode(this.options, spec);
              if (mode.startState) {
                throw new Error("Overlays may not be stateful.");
              }
              insertSorted(
                this.state.overlays,
                {
                  mode,
                  modeSpec: spec,
                  opaque: options && options.opaque,
                  priority: options && options.priority || 0
                },
                function(overlay) {
                  return overlay.priority;
                }
              );
              this.state.modeGen++;
              regChange(this);
            }),
            removeOverlay: methodOp(function(spec) {
              var overlays = this.state.overlays;
              for (var i2 = 0; i2 < overlays.length; ++i2) {
                var cur = overlays[i2].modeSpec;
                if (cur == spec || typeof spec == "string" && cur.name == spec) {
                  overlays.splice(i2, 1);
                  this.state.modeGen++;
                  regChange(this);
                  return;
                }
              }
            }),
            indentLine: methodOp(function(n, dir, aggressive) {
              if (typeof dir != "string" && typeof dir != "number") {
                if (dir == null) {
                  dir = this.options.smartIndent ? "smart" : "prev";
                } else {
                  dir = dir ? "add" : "subtract";
                }
              }
              if (isLine(this.doc, n)) {
                indentLine(this, n, dir, aggressive);
              }
            }),
            indentSelection: methodOp(function(how) {
              var ranges = this.doc.sel.ranges, end = -1;
              for (var i2 = 0; i2 < ranges.length; i2++) {
                var range2 = ranges[i2];
                if (!range2.empty()) {
                  var from2 = range2.from(), to = range2.to();
                  var start = Math.max(end, from2.line);
                  end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
                  for (var j = start; j < end; ++j) {
                    indentLine(this, j, how);
                  }
                  var newRanges = this.doc.sel.ranges;
                  if (from2.ch == 0 && ranges.length == newRanges.length && newRanges[i2].from().ch > 0) {
                    replaceOneSelection(this.doc, i2, new Range(from2, newRanges[i2].to()), sel_dontScroll);
                  }
                } else if (range2.head.line > end) {
                  indentLine(this, range2.head.line, how, true);
                  end = range2.head.line;
                  if (i2 == this.doc.sel.primIndex) {
                    ensureCursorVisible(this);
                  }
                }
              }
            }),
            // Fetch the parser token for a given character. Useful for hacks
            // that want to inspect the mode state (say, for completion).
            getTokenAt: function(pos, precise) {
              return takeToken(this, pos, precise);
            },
            getLineTokens: function(line, precise) {
              return takeToken(this, Pos(line), precise, true);
            },
            getTokenTypeAt: function(pos) {
              pos = clipPos(this.doc, pos);
              var styles = getLineStyles(this, getLine(this.doc, pos.line));
              var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
              var type;
              if (ch == 0) {
                type = styles[2];
              } else {
                for (; ; ) {
                  var mid = before + after >> 1;
                  if ((mid ? styles[mid * 2 - 1] : 0) >= ch) {
                    after = mid;
                  } else if (styles[mid * 2 + 1] < ch) {
                    before = mid + 1;
                  } else {
                    type = styles[mid * 2 + 2];
                    break;
                  }
                }
              }
              var cut = type ? type.indexOf("overlay ") : -1;
              return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
            },
            getModeAt: function(pos) {
              var mode = this.doc.mode;
              if (!mode.innerMode) {
                return mode;
              }
              return CodeMirror4.innerMode(mode, this.getTokenAt(pos).state).mode;
            },
            getHelper: function(pos, type) {
              return this.getHelpers(pos, type)[0];
            },
            getHelpers: function(pos, type) {
              var found = [];
              if (!helpers.hasOwnProperty(type)) {
                return found;
              }
              var help = helpers[type], mode = this.getModeAt(pos);
              if (typeof mode[type] == "string") {
                if (help[mode[type]]) {
                  found.push(help[mode[type]]);
                }
              } else if (mode[type]) {
                for (var i2 = 0; i2 < mode[type].length; i2++) {
                  var val = help[mode[type][i2]];
                  if (val) {
                    found.push(val);
                  }
                }
              } else if (mode.helperType && help[mode.helperType]) {
                found.push(help[mode.helperType]);
              } else if (help[mode.name]) {
                found.push(help[mode.name]);
              }
              for (var i$12 = 0; i$12 < help._global.length; i$12++) {
                var cur = help._global[i$12];
                if (cur.pred(mode, this) && indexOf(found, cur.val) == -1) {
                  found.push(cur.val);
                }
              }
              return found;
            },
            getStateAfter: function(line, precise) {
              var doc3 = this.doc;
              line = clipLine(doc3, line == null ? doc3.first + doc3.size - 1 : line);
              return getContextBefore(this, line + 1, precise).state;
            },
            cursorCoords: function(start, mode) {
              var pos, range2 = this.doc.sel.primary();
              if (start == null) {
                pos = range2.head;
              } else if (typeof start == "object") {
                pos = clipPos(this.doc, start);
              } else {
                pos = start ? range2.from() : range2.to();
              }
              return cursorCoords(this, pos, mode || "page");
            },
            charCoords: function(pos, mode) {
              return charCoords(this, clipPos(this.doc, pos), mode || "page");
            },
            coordsChar: function(coords, mode) {
              coords = fromCoordSystem(this, coords, mode || "page");
              return coordsChar(this, coords.left, coords.top);
            },
            lineAtHeight: function(height, mode) {
              height = fromCoordSystem(this, { top: height, left: 0 }, mode || "page").top;
              return lineAtHeight(this.doc, height + this.display.viewOffset);
            },
            heightAtLine: function(line, mode, includeWidgets) {
              var end = false, lineObj;
              if (typeof line == "number") {
                var last2 = this.doc.first + this.doc.size - 1;
                if (line < this.doc.first) {
                  line = this.doc.first;
                } else if (line > last2) {
                  line = last2;
                  end = true;
                }
                lineObj = getLine(this.doc, line);
              } else {
                lineObj = line;
              }
              return intoCoordSystem(this, lineObj, { top: 0, left: 0 }, mode || "page", includeWidgets || end).top + (end ? this.doc.height - heightAtLine(lineObj) : 0);
            },
            defaultTextHeight: function() {
              return textHeight(this.display);
            },
            defaultCharWidth: function() {
              return charWidth(this.display);
            },
            getViewport: function() {
              return { from: this.display.viewFrom, to: this.display.viewTo };
            },
            addWidget: function(pos, node, scroll, vert, horiz) {
              var display = this.display;
              pos = cursorCoords(this, clipPos(this.doc, pos));
              var top = pos.bottom, left = pos.left;
              node.style.position = "absolute";
              node.setAttribute("cm-ignore-events", "true");
              this.display.input.setUneditable(node);
              display.sizer.appendChild(node);
              if (vert == "over") {
                top = pos.top;
              } else if (vert == "above" || vert == "near") {
                var vspace = Math.max(display.wrapper.clientHeight, this.doc.height), hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
                if ((vert == "above" || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight) {
                  top = pos.top - node.offsetHeight;
                } else if (pos.bottom + node.offsetHeight <= vspace) {
                  top = pos.bottom;
                }
                if (left + node.offsetWidth > hspace) {
                  left = hspace - node.offsetWidth;
                }
              }
              node.style.top = top + "px";
              node.style.left = node.style.right = "";
              if (horiz == "right") {
                left = display.sizer.clientWidth - node.offsetWidth;
                node.style.right = "0px";
              } else {
                if (horiz == "left") {
                  left = 0;
                } else if (horiz == "middle") {
                  left = (display.sizer.clientWidth - node.offsetWidth) / 2;
                }
                node.style.left = left + "px";
              }
              if (scroll) {
                scrollIntoView(this, { left, top, right: left + node.offsetWidth, bottom: top + node.offsetHeight });
              }
            },
            triggerOnKeyDown: methodOp(onKeyDown),
            triggerOnKeyPress: methodOp(onKeyPress),
            triggerOnKeyUp: onKeyUp,
            triggerOnMouseDown: methodOp(onMouseDown),
            execCommand: function(cmd) {
              if (commands.hasOwnProperty(cmd)) {
                return commands[cmd].call(null, this);
              }
            },
            triggerElectric: methodOp(function(text2) {
              triggerElectric(this, text2);
            }),
            findPosH: function(from2, amount, unit, visually) {
              var dir = 1;
              if (amount < 0) {
                dir = -1;
                amount = -amount;
              }
              var cur = clipPos(this.doc, from2);
              for (var i2 = 0; i2 < amount; ++i2) {
                cur = findPosH(this.doc, cur, dir, unit, visually);
                if (cur.hitSide) {
                  break;
                }
              }
              return cur;
            },
            moveH: methodOp(function(dir, unit) {
              var this$1 = this;
              this.extendSelectionsBy(function(range2) {
                if (this$1.display.shift || this$1.doc.extend || range2.empty()) {
                  return findPosH(this$1.doc, range2.head, dir, unit, this$1.options.rtlMoveVisually);
                } else {
                  return dir < 0 ? range2.from() : range2.to();
                }
              }, sel_move);
            }),
            deleteH: methodOp(function(dir, unit) {
              var sel = this.doc.sel, doc3 = this.doc;
              if (sel.somethingSelected()) {
                doc3.replaceSelection("", null, "+delete");
              } else {
                deleteNearSelection(this, function(range2) {
                  var other = findPosH(doc3, range2.head, dir, unit, false);
                  return dir < 0 ? { from: other, to: range2.head } : { from: range2.head, to: other };
                });
              }
            }),
            findPosV: function(from2, amount, unit, goalColumn) {
              var dir = 1, x = goalColumn;
              if (amount < 0) {
                dir = -1;
                amount = -amount;
              }
              var cur = clipPos(this.doc, from2);
              for (var i2 = 0; i2 < amount; ++i2) {
                var coords = cursorCoords(this, cur, "div");
                if (x == null) {
                  x = coords.left;
                } else {
                  coords.left = x;
                }
                cur = findPosV(this, coords, dir, unit);
                if (cur.hitSide) {
                  break;
                }
              }
              return cur;
            },
            moveV: methodOp(function(dir, unit) {
              var this$1 = this;
              var doc3 = this.doc, goals = [];
              var collapse = !this.display.shift && !doc3.extend && doc3.sel.somethingSelected();
              doc3.extendSelectionsBy(function(range2) {
                if (collapse) {
                  return dir < 0 ? range2.from() : range2.to();
                }
                var headPos = cursorCoords(this$1, range2.head, "div");
                if (range2.goalColumn != null) {
                  headPos.left = range2.goalColumn;
                }
                goals.push(headPos.left);
                var pos = findPosV(this$1, headPos, dir, unit);
                if (unit == "page" && range2 == doc3.sel.primary()) {
                  addToScrollTop(this$1, charCoords(this$1, pos, "div").top - headPos.top);
                }
                return pos;
              }, sel_move);
              if (goals.length) {
                for (var i2 = 0; i2 < doc3.sel.ranges.length; i2++) {
                  doc3.sel.ranges[i2].goalColumn = goals[i2];
                }
              }
            }),
            // Find the word at the given position (as returned by coordsChar).
            findWordAt: function(pos) {
              var doc3 = this.doc, line = getLine(doc3, pos.line).text;
              var start = pos.ch, end = pos.ch;
              if (line) {
                var helper = this.getHelper(pos, "wordChars");
                if ((pos.sticky == "before" || end == line.length) && start) {
                  --start;
                } else {
                  ++end;
                }
                var startChar = line.charAt(start);
                var check = isWordChar(startChar, helper) ? function(ch) {
                  return isWordChar(ch, helper);
                } : /\s/.test(startChar) ? function(ch) {
                  return /\s/.test(ch);
                } : function(ch) {
                  return !/\s/.test(ch) && !isWordChar(ch);
                };
                while (start > 0 && check(line.charAt(start - 1))) {
                  --start;
                }
                while (end < line.length && check(line.charAt(end))) {
                  ++end;
                }
              }
              return new Range(Pos(pos.line, start), Pos(pos.line, end));
            },
            toggleOverwrite: function(value) {
              if (value != null && value == this.state.overwrite) {
                return;
              }
              if (this.state.overwrite = !this.state.overwrite) {
                addClass(this.display.cursorDiv, "CodeMirror-overwrite");
              } else {
                rmClass(this.display.cursorDiv, "CodeMirror-overwrite");
              }
              signal(this, "overwriteToggle", this, this.state.overwrite);
            },
            hasFocus: function() {
              return this.display.input.getField() == activeElt(root(this));
            },
            isReadOnly: function() {
              return !!(this.options.readOnly || this.doc.cantEdit);
            },
            scrollTo: methodOp(function(x, y) {
              scrollToCoords(this, x, y);
            }),
            getScrollInfo: function() {
              var scroller = this.display.scroller;
              return {
                left: scroller.scrollLeft,
                top: scroller.scrollTop,
                height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
                width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
                clientHeight: displayHeight(this),
                clientWidth: displayWidth(this)
              };
            },
            scrollIntoView: methodOp(function(range2, margin) {
              if (range2 == null) {
                range2 = { from: this.doc.sel.primary().head, to: null };
                if (margin == null) {
                  margin = this.options.cursorScrollMargin;
                }
              } else if (typeof range2 == "number") {
                range2 = { from: Pos(range2, 0), to: null };
              } else if (range2.from == null) {
                range2 = { from: range2, to: null };
              }
              if (!range2.to) {
                range2.to = range2.from;
              }
              range2.margin = margin || 0;
              if (range2.from.line != null) {
                scrollToRange(this, range2);
              } else {
                scrollToCoordsRange(this, range2.from, range2.to, range2.margin);
              }
            }),
            setSize: methodOp(function(width, height) {
              var this$1 = this;
              var interpret = function(val) {
                return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
              };
              if (width != null) {
                this.display.wrapper.style.width = interpret(width);
              }
              if (height != null) {
                this.display.wrapper.style.height = interpret(height);
              }
              if (this.options.lineWrapping) {
                clearLineMeasurementCache(this);
              }
              var lineNo2 = this.display.viewFrom;
              this.doc.iter(lineNo2, this.display.viewTo, function(line) {
                if (line.widgets) {
                  for (var i2 = 0; i2 < line.widgets.length; i2++) {
                    if (line.widgets[i2].noHScroll) {
                      regLineChange(this$1, lineNo2, "widget");
                      break;
                    }
                  }
                }
                ++lineNo2;
              });
              this.curOp.forceUpdate = true;
              signal(this, "refresh", this);
            }),
            operation: function(f) {
              return runInOp(this, f);
            },
            startOperation: function() {
              return startOperation(this);
            },
            endOperation: function() {
              return endOperation(this);
            },
            refresh: methodOp(function() {
              var oldHeight = this.display.cachedTextHeight;
              regChange(this);
              this.curOp.forceUpdate = true;
              clearCaches(this);
              scrollToCoords(this, this.doc.scrollLeft, this.doc.scrollTop);
              updateGutterSpace(this.display);
              if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > 0.5 || this.options.lineWrapping) {
                estimateLineHeights(this);
              }
              signal(this, "refresh", this);
            }),
            swapDoc: methodOp(function(doc3) {
              var old = this.doc;
              old.cm = null;
              if (this.state.selectingText) {
                this.state.selectingText();
              }
              attachDoc(this, doc3);
              clearCaches(this);
              this.display.input.reset();
              scrollToCoords(this, doc3.scrollLeft, doc3.scrollTop);
              this.curOp.forceScroll = true;
              signalLater(this, "swapDoc", this, old);
              return old;
            }),
            phrase: function(phraseText) {
              var phrases = this.options.phrases;
              return phrases && Object.prototype.hasOwnProperty.call(phrases, phraseText) ? phrases[phraseText] : phraseText;
            },
            getInputField: function() {
              return this.display.input.getField();
            },
            getWrapperElement: function() {
              return this.display.wrapper;
            },
            getScrollerElement: function() {
              return this.display.scroller;
            },
            getGutterElement: function() {
              return this.display.gutters;
            }
          };
          eventMixin(CodeMirror4);
          CodeMirror4.registerHelper = function(type, name, value) {
            if (!helpers.hasOwnProperty(type)) {
              helpers[type] = CodeMirror4[type] = { _global: [] };
            }
            helpers[type][name] = value;
          };
          CodeMirror4.registerGlobalHelper = function(type, name, predicate, value) {
            CodeMirror4.registerHelper(type, name, value);
            helpers[type]._global.push({ pred: predicate, val: value });
          };
        }
        function findPosH(doc3, pos, dir, unit, visually) {
          var oldPos = pos;
          var origDir = dir;
          var lineObj = getLine(doc3, pos.line);
          var lineDir = visually && doc3.direction == "rtl" ? -dir : dir;
          function findNextLine() {
            var l = pos.line + lineDir;
            if (l < doc3.first || l >= doc3.first + doc3.size) {
              return false;
            }
            pos = new Pos(l, pos.ch, pos.sticky);
            return lineObj = getLine(doc3, l);
          }
          function moveOnce(boundToLine) {
            var next;
            if (unit == "codepoint") {
              var ch = lineObj.text.charCodeAt(pos.ch + (dir > 0 ? 0 : -1));
              if (isNaN(ch)) {
                next = null;
              } else {
                var astral = dir > 0 ? ch >= 55296 && ch < 56320 : ch >= 56320 && ch < 57343;
                next = new Pos(pos.line, Math.max(0, Math.min(lineObj.text.length, pos.ch + dir * (astral ? 2 : 1))), -dir);
              }
            } else if (visually) {
              next = moveVisually(doc3.cm, lineObj, pos, dir);
            } else {
              next = moveLogically(lineObj, pos, dir);
            }
            if (next == null) {
              if (!boundToLine && findNextLine()) {
                pos = endOfLine(visually, doc3.cm, lineObj, pos.line, lineDir);
              } else {
                return false;
              }
            } else {
              pos = next;
            }
            return true;
          }
          if (unit == "char" || unit == "codepoint") {
            moveOnce();
          } else if (unit == "column") {
            moveOnce(true);
          } else if (unit == "word" || unit == "group") {
            var sawType = null, group = unit == "group";
            var helper = doc3.cm && doc3.cm.getHelper(pos, "wordChars");
            for (var first = true; ; first = false) {
              if (dir < 0 && !moveOnce(!first)) {
                break;
              }
              var cur = lineObj.text.charAt(pos.ch) || "\n";
              var type = isWordChar(cur, helper) ? "w" : group && cur == "\n" ? "n" : !group || /\s/.test(cur) ? null : "p";
              if (group && !first && !type) {
                type = "s";
              }
              if (sawType && sawType != type) {
                if (dir < 0) {
                  dir = 1;
                  moveOnce();
                  pos.sticky = "after";
                }
                break;
              }
              if (type) {
                sawType = type;
              }
              if (dir > 0 && !moveOnce(!first)) {
                break;
              }
            }
          }
          var result = skipAtomic(doc3, pos, oldPos, origDir, true);
          if (equalCursorPos(oldPos, result)) {
            result.hitSide = true;
          }
          return result;
        }
        function findPosV(cm, pos, dir, unit) {
          var doc3 = cm.doc, x = pos.left, y;
          if (unit == "page") {
            var pageSize = Math.min(cm.display.wrapper.clientHeight, win(cm).innerHeight || doc3(cm).documentElement.clientHeight);
            var moveAmount = Math.max(pageSize - 0.5 * textHeight(cm.display), 3);
            y = (dir > 0 ? pos.bottom : pos.top) + dir * moveAmount;
          } else if (unit == "line") {
            y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
          }
          var target;
          for (; ; ) {
            target = coordsChar(cm, x, y);
            if (!target.outside) {
              break;
            }
            if (dir < 0 ? y <= 0 : y >= doc3.height) {
              target.hitSide = true;
              break;
            }
            y += dir * 5;
          }
          return target;
        }
        var ContentEditableInput = function(cm) {
          this.cm = cm;
          this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
          this.polling = new Delayed();
          this.composing = null;
          this.gracePeriod = false;
          this.readDOMTimeout = null;
        };
        ContentEditableInput.prototype.init = function(display) {
          var this$1 = this;
          var input = this, cm = input.cm;
          var div = input.div = display.lineDiv;
          div.contentEditable = true;
          disableBrowserMagic(div, cm.options.spellcheck, cm.options.autocorrect, cm.options.autocapitalize);
          function belongsToInput(e) {
            for (var t = e.target; t; t = t.parentNode) {
              if (t == div) {
                return true;
              }
              if (/\bCodeMirror-(?:line)?widget\b/.test(t.className)) {
                break;
              }
            }
            return false;
          }
          on(div, "paste", function(e) {
            if (!belongsToInput(e) || signalDOMEvent(cm, e) || handlePaste(e, cm)) {
              return;
            }
            if (ie_version <= 11) {
              setTimeout(operation(cm, function() {
                return this$1.updateFromDOM();
              }), 20);
            }
          });
          on(div, "compositionstart", function(e) {
            this$1.composing = { data: e.data, done: false };
          });
          on(div, "compositionupdate", function(e) {
            if (!this$1.composing) {
              this$1.composing = { data: e.data, done: false };
            }
          });
          on(div, "compositionend", function(e) {
            if (this$1.composing) {
              if (e.data != this$1.composing.data) {
                this$1.readFromDOMSoon();
              }
              this$1.composing.done = true;
            }
          });
          on(div, "touchstart", function() {
            return input.forceCompositionEnd();
          });
          on(div, "input", function() {
            if (!this$1.composing) {
              this$1.readFromDOMSoon();
            }
          });
          function onCopyCut(e) {
            if (!belongsToInput(e) || signalDOMEvent(cm, e)) {
              return;
            }
            if (cm.somethingSelected()) {
              setLastCopied({ lineWise: false, text: cm.getSelections() });
              if (e.type == "cut") {
                cm.replaceSelection("", null, "cut");
              }
            } else if (!cm.options.lineWiseCopyCut) {
              return;
            } else {
              var ranges = copyableRanges(cm);
              setLastCopied({ lineWise: true, text: ranges.text });
              if (e.type == "cut") {
                cm.operation(function() {
                  cm.setSelections(ranges.ranges, 0, sel_dontScroll);
                  cm.replaceSelection("", null, "cut");
                });
              }
            }
            if (e.clipboardData) {
              e.clipboardData.clearData();
              var content = lastCopied.text.join("\n");
              e.clipboardData.setData("Text", content);
              if (e.clipboardData.getData("Text") == content) {
                e.preventDefault();
                return;
              }
            }
            var kludge = hiddenTextarea(), te = kludge.firstChild;
            disableBrowserMagic(te);
            cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
            te.value = lastCopied.text.join("\n");
            var hadFocus = activeElt(rootNode(div));
            selectInput(te);
            setTimeout(function() {
              cm.display.lineSpace.removeChild(kludge);
              hadFocus.focus();
              if (hadFocus == div) {
                input.showPrimarySelection();
              }
            }, 50);
          }
          on(div, "copy", onCopyCut);
          on(div, "cut", onCopyCut);
        };
        ContentEditableInput.prototype.screenReaderLabelChanged = function(label) {
          if (label) {
            this.div.setAttribute("aria-label", label);
          } else {
            this.div.removeAttribute("aria-label");
          }
        };
        ContentEditableInput.prototype.prepareSelection = function() {
          var result = prepareSelection(this.cm, false);
          result.focus = activeElt(rootNode(this.div)) == this.div;
          return result;
        };
        ContentEditableInput.prototype.showSelection = function(info, takeFocus) {
          if (!info || !this.cm.display.view.length) {
            return;
          }
          if (info.focus || takeFocus) {
            this.showPrimarySelection();
          }
          this.showMultipleSelections(info);
        };
        ContentEditableInput.prototype.getSelection = function() {
          return this.cm.display.wrapper.ownerDocument.getSelection();
        };
        ContentEditableInput.prototype.showPrimarySelection = function() {
          var sel = this.getSelection(), cm = this.cm, prim = cm.doc.sel.primary();
          var from2 = prim.from(), to = prim.to();
          if (cm.display.viewTo == cm.display.viewFrom || from2.line >= cm.display.viewTo || to.line < cm.display.viewFrom) {
            sel.removeAllRanges();
            return;
          }
          var curAnchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
          var curFocus = domToPos(cm, sel.focusNode, sel.focusOffset);
          if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad && cmp(minPos(curAnchor, curFocus), from2) == 0 && cmp(maxPos(curAnchor, curFocus), to) == 0) {
            return;
          }
          var view = cm.display.view;
          var start = from2.line >= cm.display.viewFrom && posToDOM(cm, from2) || { node: view[0].measure.map[2], offset: 0 };
          var end = to.line < cm.display.viewTo && posToDOM(cm, to);
          if (!end) {
            var measure = view[view.length - 1].measure;
            var map4 = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
            end = { node: map4[map4.length - 1], offset: map4[map4.length - 2] - map4[map4.length - 3] };
          }
          if (!start || !end) {
            sel.removeAllRanges();
            return;
          }
          var old = sel.rangeCount && sel.getRangeAt(0), rng;
          try {
            rng = range(start.node, start.offset, end.offset, end.node);
          } catch (e) {
          }
          if (rng) {
            if (!gecko && cm.state.focused) {
              sel.collapse(start.node, start.offset);
              if (!rng.collapsed) {
                sel.removeAllRanges();
                sel.addRange(rng);
              }
            } else {
              sel.removeAllRanges();
              sel.addRange(rng);
            }
            if (old && sel.anchorNode == null) {
              sel.addRange(old);
            } else if (gecko) {
              this.startGracePeriod();
            }
          }
          this.rememberSelection();
        };
        ContentEditableInput.prototype.startGracePeriod = function() {
          var this$1 = this;
          clearTimeout(this.gracePeriod);
          this.gracePeriod = setTimeout(function() {
            this$1.gracePeriod = false;
            if (this$1.selectionChanged()) {
              this$1.cm.operation(function() {
                return this$1.cm.curOp.selectionChanged = true;
              });
            }
          }, 20);
        };
        ContentEditableInput.prototype.showMultipleSelections = function(info) {
          removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
          removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
        };
        ContentEditableInput.prototype.rememberSelection = function() {
          var sel = this.getSelection();
          this.lastAnchorNode = sel.anchorNode;
          this.lastAnchorOffset = sel.anchorOffset;
          this.lastFocusNode = sel.focusNode;
          this.lastFocusOffset = sel.focusOffset;
        };
        ContentEditableInput.prototype.selectionInEditor = function() {
          var sel = this.getSelection();
          if (!sel.rangeCount) {
            return false;
          }
          var node = sel.getRangeAt(0).commonAncestorContainer;
          return contains(this.div, node);
        };
        ContentEditableInput.prototype.focus = function() {
          if (this.cm.options.readOnly != "nocursor") {
            if (!this.selectionInEditor() || activeElt(rootNode(this.div)) != this.div) {
              this.showSelection(this.prepareSelection(), true);
            }
            this.div.focus();
          }
        };
        ContentEditableInput.prototype.blur = function() {
          this.div.blur();
        };
        ContentEditableInput.prototype.getField = function() {
          return this.div;
        };
        ContentEditableInput.prototype.supportsTouch = function() {
          return true;
        };
        ContentEditableInput.prototype.receivedFocus = function() {
          var this$1 = this;
          var input = this;
          if (this.selectionInEditor()) {
            setTimeout(function() {
              return this$1.pollSelection();
            }, 20);
          } else {
            runInOp(this.cm, function() {
              return input.cm.curOp.selectionChanged = true;
            });
          }
          function poll() {
            if (input.cm.state.focused) {
              input.pollSelection();
              input.polling.set(input.cm.options.pollInterval, poll);
            }
          }
          this.polling.set(this.cm.options.pollInterval, poll);
        };
        ContentEditableInput.prototype.selectionChanged = function() {
          var sel = this.getSelection();
          return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
        };
        ContentEditableInput.prototype.pollSelection = function() {
          if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) {
            return;
          }
          var sel = this.getSelection(), cm = this.cm;
          if (android && chrome && this.cm.display.gutterSpecs.length && isInGutter(sel.anchorNode)) {
            this.cm.triggerOnKeyDown({ type: "keydown", keyCode: 8, preventDefault: Math.abs });
            this.blur();
            this.focus();
            return;
          }
          if (this.composing) {
            return;
          }
          this.rememberSelection();
          var anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
          var head = domToPos(cm, sel.focusNode, sel.focusOffset);
          if (anchor && head) {
            runInOp(cm, function() {
              setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll);
              if (anchor.bad || head.bad) {
                cm.curOp.selectionChanged = true;
              }
            });
          }
        };
        ContentEditableInput.prototype.pollContent = function() {
          if (this.readDOMTimeout != null) {
            clearTimeout(this.readDOMTimeout);
            this.readDOMTimeout = null;
          }
          var cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
          var from2 = sel.from(), to = sel.to();
          if (from2.ch == 0 && from2.line > cm.firstLine()) {
            from2 = Pos(from2.line - 1, getLine(cm.doc, from2.line - 1).length);
          }
          if (to.ch == getLine(cm.doc, to.line).text.length && to.line < cm.lastLine()) {
            to = Pos(to.line + 1, 0);
          }
          if (from2.line < display.viewFrom || to.line > display.viewTo - 1) {
            return false;
          }
          var fromIndex, fromLine, fromNode;
          if (from2.line == display.viewFrom || (fromIndex = findViewIndex(cm, from2.line)) == 0) {
            fromLine = lineNo(display.view[0].line);
            fromNode = display.view[0].node;
          } else {
            fromLine = lineNo(display.view[fromIndex].line);
            fromNode = display.view[fromIndex - 1].node.nextSibling;
          }
          var toIndex = findViewIndex(cm, to.line);
          var toLine, toNode;
          if (toIndex == display.view.length - 1) {
            toLine = display.viewTo - 1;
            toNode = display.lineDiv.lastChild;
          } else {
            toLine = lineNo(display.view[toIndex + 1].line) - 1;
            toNode = display.view[toIndex + 1].node.previousSibling;
          }
          if (!fromNode) {
            return false;
          }
          var newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
          var oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length));
          while (newText.length > 1 && oldText.length > 1) {
            if (lst(newText) == lst(oldText)) {
              newText.pop();
              oldText.pop();
              toLine--;
            } else if (newText[0] == oldText[0]) {
              newText.shift();
              oldText.shift();
              fromLine++;
            } else {
              break;
            }
          }
          var cutFront = 0, cutEnd = 0;
          var newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
          while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront)) {
            ++cutFront;
          }
          var newBot = lst(newText), oldBot = lst(oldText);
          var maxCutEnd = Math.min(
            newBot.length - (newText.length == 1 ? cutFront : 0),
            oldBot.length - (oldText.length == 1 ? cutFront : 0)
          );
          while (cutEnd < maxCutEnd && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
            ++cutEnd;
          }
          if (newText.length == 1 && oldText.length == 1 && fromLine == from2.line) {
            while (cutFront && cutFront > from2.ch && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
              cutFront--;
              cutEnd++;
            }
          }
          newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd).replace(/^\u200b+/, "");
          newText[0] = newText[0].slice(cutFront).replace(/\u200b+$/, "");
          var chFrom = Pos(fromLine, cutFront);
          var chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);
          if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) {
            replaceRange(cm.doc, newText, chFrom, chTo, "+input");
            return true;
          }
        };
        ContentEditableInput.prototype.ensurePolled = function() {
          this.forceCompositionEnd();
        };
        ContentEditableInput.prototype.reset = function() {
          this.forceCompositionEnd();
        };
        ContentEditableInput.prototype.forceCompositionEnd = function() {
          if (!this.composing) {
            return;
          }
          clearTimeout(this.readDOMTimeout);
          this.composing = null;
          this.updateFromDOM();
          this.div.blur();
          this.div.focus();
        };
        ContentEditableInput.prototype.readFromDOMSoon = function() {
          var this$1 = this;
          if (this.readDOMTimeout != null) {
            return;
          }
          this.readDOMTimeout = setTimeout(function() {
            this$1.readDOMTimeout = null;
            if (this$1.composing) {
              if (this$1.composing.done) {
                this$1.composing = null;
              } else {
                return;
              }
            }
            this$1.updateFromDOM();
          }, 80);
        };
        ContentEditableInput.prototype.updateFromDOM = function() {
          var this$1 = this;
          if (this.cm.isReadOnly() || !this.pollContent()) {
            runInOp(this.cm, function() {
              return regChange(this$1.cm);
            });
          }
        };
        ContentEditableInput.prototype.setUneditable = function(node) {
          node.contentEditable = "false";
        };
        ContentEditableInput.prototype.onKeyPress = function(e) {
          if (e.charCode == 0 || this.composing) {
            return;
          }
          e.preventDefault();
          if (!this.cm.isReadOnly()) {
            operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
          }
        };
        ContentEditableInput.prototype.readOnlyChanged = function(val) {
          this.div.contentEditable = String(val != "nocursor");
        };
        ContentEditableInput.prototype.onContextMenu = function() {
        };
        ContentEditableInput.prototype.resetPosition = function() {
        };
        ContentEditableInput.prototype.needsContentAttribute = true;
        function posToDOM(cm, pos) {
          var view = findViewForLine(cm, pos.line);
          if (!view || view.hidden) {
            return null;
          }
          var line = getLine(cm.doc, pos.line);
          var info = mapFromLineView(view, line, pos.line);
          var order = getOrder(line, cm.doc.direction), side = "left";
          if (order) {
            var partPos = getBidiPartAt(order, pos.ch);
            side = partPos % 2 ? "right" : "left";
          }
          var result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
          result.offset = result.collapse == "right" ? result.end : result.start;
          return result;
        }
        function isInGutter(node) {
          for (var scan = node; scan; scan = scan.parentNode) {
            if (/CodeMirror-gutter-wrapper/.test(scan.className)) {
              return true;
            }
          }
          return false;
        }
        function badPos(pos, bad) {
          if (bad) {
            pos.bad = true;
          }
          return pos;
        }
        function domTextBetween(cm, from2, to, fromLine, toLine) {
          var text2 = "", closing = false, lineSep = cm.doc.lineSeparator(), extraLinebreak = false;
          function recognizeMarker(id2) {
            return function(marker) {
              return marker.id == id2;
            };
          }
          function close() {
            if (closing) {
              text2 += lineSep;
              if (extraLinebreak) {
                text2 += lineSep;
              }
              closing = extraLinebreak = false;
            }
          }
          function addText(str) {
            if (str) {
              close();
              text2 += str;
            }
          }
          function walk(node) {
            if (node.nodeType == 1) {
              var cmText = node.getAttribute("cm-text");
              if (cmText) {
                addText(cmText);
                return;
              }
              var markerID = node.getAttribute("cm-marker"), range2;
              if (markerID) {
                var found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
                if (found.length && (range2 = found[0].find(0))) {
                  addText(getBetween(cm.doc, range2.from, range2.to).join(lineSep));
                }
                return;
              }
              if (node.getAttribute("contenteditable") == "false") {
                return;
              }
              var isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
              if (!/^br$/i.test(node.nodeName) && node.textContent.length == 0) {
                return;
              }
              if (isBlock) {
                close();
              }
              for (var i2 = 0; i2 < node.childNodes.length; i2++) {
                walk(node.childNodes[i2]);
              }
              if (/^(pre|p)$/i.test(node.nodeName)) {
                extraLinebreak = true;
              }
              if (isBlock) {
                closing = true;
              }
            } else if (node.nodeType == 3) {
              addText(node.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
            }
          }
          for (; ; ) {
            walk(from2);
            if (from2 == to) {
              break;
            }
            from2 = from2.nextSibling;
            extraLinebreak = false;
          }
          return text2;
        }
        function domToPos(cm, node, offset) {
          var lineNode;
          if (node == cm.display.lineDiv) {
            lineNode = cm.display.lineDiv.childNodes[offset];
            if (!lineNode) {
              return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true);
            }
            node = null;
            offset = 0;
          } else {
            for (lineNode = node; ; lineNode = lineNode.parentNode) {
              if (!lineNode || lineNode == cm.display.lineDiv) {
                return null;
              }
              if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) {
                break;
              }
            }
          }
          for (var i2 = 0; i2 < cm.display.view.length; i2++) {
            var lineView = cm.display.view[i2];
            if (lineView.node == lineNode) {
              return locateNodeInLineView(lineView, node, offset);
            }
          }
        }
        function locateNodeInLineView(lineView, node, offset) {
          var wrapper = lineView.text.firstChild, bad = false;
          if (!node || !contains(wrapper, node)) {
            return badPos(Pos(lineNo(lineView.line), 0), true);
          }
          if (node == wrapper) {
            bad = true;
            node = wrapper.childNodes[offset];
            offset = 0;
            if (!node) {
              var line = lineView.rest ? lst(lineView.rest) : lineView.line;
              return badPos(Pos(lineNo(line), line.text.length), bad);
            }
          }
          var textNode = node.nodeType == 3 ? node : null, topNode = node;
          if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
            textNode = node.firstChild;
            if (offset) {
              offset = textNode.nodeValue.length;
            }
          }
          while (topNode.parentNode != wrapper) {
            topNode = topNode.parentNode;
          }
          var measure = lineView.measure, maps = measure.maps;
          function find2(textNode2, topNode2, offset2) {
            for (var i2 = -1; i2 < (maps ? maps.length : 0); i2++) {
              var map4 = i2 < 0 ? measure.map : maps[i2];
              for (var j = 0; j < map4.length; j += 3) {
                var curNode = map4[j + 2];
                if (curNode == textNode2 || curNode == topNode2) {
                  var line2 = lineNo(i2 < 0 ? lineView.line : lineView.rest[i2]);
                  var ch = map4[j] + offset2;
                  if (offset2 < 0 || curNode != textNode2) {
                    ch = map4[j + (offset2 ? 1 : 0)];
                  }
                  return Pos(line2, ch);
                }
              }
            }
          }
          var found = find2(textNode, topNode, offset);
          if (found) {
            return badPos(found, bad);
          }
          for (var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
            found = find2(after, after.firstChild, 0);
            if (found) {
              return badPos(Pos(found.line, found.ch - dist), bad);
            } else {
              dist += after.textContent.length;
            }
          }
          for (var before = topNode.previousSibling, dist$1 = offset; before; before = before.previousSibling) {
            found = find2(before, before.firstChild, -1);
            if (found) {
              return badPos(Pos(found.line, found.ch + dist$1), bad);
            } else {
              dist$1 += before.textContent.length;
            }
          }
        }
        var TextareaInput = function(cm) {
          this.cm = cm;
          this.prevInput = "";
          this.pollingFast = false;
          this.polling = new Delayed();
          this.hasSelection = false;
          this.composing = null;
          this.resetting = false;
        };
        TextareaInput.prototype.init = function(display) {
          var this$1 = this;
          var input = this, cm = this.cm;
          this.createField(display);
          var te = this.textarea;
          display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild);
          if (ios) {
            te.style.width = "0px";
          }
          on(te, "input", function() {
            if (ie && ie_version >= 9 && this$1.hasSelection) {
              this$1.hasSelection = null;
            }
            input.poll();
          });
          on(te, "paste", function(e) {
            if (signalDOMEvent(cm, e) || handlePaste(e, cm)) {
              return;
            }
            cm.state.pasteIncoming = +/* @__PURE__ */ new Date();
            input.fastPoll();
          });
          function prepareCopyCut(e) {
            if (signalDOMEvent(cm, e)) {
              return;
            }
            if (cm.somethingSelected()) {
              setLastCopied({ lineWise: false, text: cm.getSelections() });
            } else if (!cm.options.lineWiseCopyCut) {
              return;
            } else {
              var ranges = copyableRanges(cm);
              setLastCopied({ lineWise: true, text: ranges.text });
              if (e.type == "cut") {
                cm.setSelections(ranges.ranges, null, sel_dontScroll);
              } else {
                input.prevInput = "";
                te.value = ranges.text.join("\n");
                selectInput(te);
              }
            }
            if (e.type == "cut") {
              cm.state.cutIncoming = +/* @__PURE__ */ new Date();
            }
          }
          on(te, "cut", prepareCopyCut);
          on(te, "copy", prepareCopyCut);
          on(display.scroller, "paste", function(e) {
            if (eventInWidget(display, e) || signalDOMEvent(cm, e)) {
              return;
            }
            if (!te.dispatchEvent) {
              cm.state.pasteIncoming = +/* @__PURE__ */ new Date();
              input.focus();
              return;
            }
            var event = new Event("paste");
            event.clipboardData = e.clipboardData;
            te.dispatchEvent(event);
          });
          on(display.lineSpace, "selectstart", function(e) {
            if (!eventInWidget(display, e)) {
              e_preventDefault(e);
            }
          });
          on(te, "compositionstart", function() {
            var start = cm.getCursor("from");
            if (input.composing) {
              input.composing.range.clear();
            }
            input.composing = {
              start,
              range: cm.markText(start, cm.getCursor("to"), { className: "CodeMirror-composing" })
            };
          });
          on(te, "compositionend", function() {
            if (input.composing) {
              input.poll();
              input.composing.range.clear();
              input.composing = null;
            }
          });
        };
        TextareaInput.prototype.createField = function(_display) {
          this.wrapper = hiddenTextarea();
          this.textarea = this.wrapper.firstChild;
          var opts = this.cm.options;
          disableBrowserMagic(this.textarea, opts.spellcheck, opts.autocorrect, opts.autocapitalize);
        };
        TextareaInput.prototype.screenReaderLabelChanged = function(label) {
          if (label) {
            this.textarea.setAttribute("aria-label", label);
          } else {
            this.textarea.removeAttribute("aria-label");
          }
        };
        TextareaInput.prototype.prepareSelection = function() {
          var cm = this.cm, display = cm.display, doc3 = cm.doc;
          var result = prepareSelection(cm);
          if (cm.options.moveInputWithCursor) {
            var headPos = cursorCoords(cm, doc3.sel.primary().head, "div");
            var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
            result.teTop = Math.max(0, Math.min(
              display.wrapper.clientHeight - 10,
              headPos.top + lineOff.top - wrapOff.top
            ));
            result.teLeft = Math.max(0, Math.min(
              display.wrapper.clientWidth - 10,
              headPos.left + lineOff.left - wrapOff.left
            ));
          }
          return result;
        };
        TextareaInput.prototype.showSelection = function(drawn) {
          var cm = this.cm, display = cm.display;
          removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
          removeChildrenAndAdd(display.selectionDiv, drawn.selection);
          if (drawn.teTop != null) {
            this.wrapper.style.top = drawn.teTop + "px";
            this.wrapper.style.left = drawn.teLeft + "px";
          }
        };
        TextareaInput.prototype.reset = function(typing) {
          if (this.contextMenuPending || this.composing && typing) {
            return;
          }
          var cm = this.cm;
          this.resetting = true;
          if (cm.somethingSelected()) {
            this.prevInput = "";
            var content = cm.getSelection();
            this.textarea.value = content;
            if (cm.state.focused) {
              selectInput(this.textarea);
            }
            if (ie && ie_version >= 9) {
              this.hasSelection = content;
            }
          } else if (!typing) {
            this.prevInput = this.textarea.value = "";
            if (ie && ie_version >= 9) {
              this.hasSelection = null;
            }
          }
          this.resetting = false;
        };
        TextareaInput.prototype.getField = function() {
          return this.textarea;
        };
        TextareaInput.prototype.supportsTouch = function() {
          return false;
        };
        TextareaInput.prototype.focus = function() {
          if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt(rootNode(this.textarea)) != this.textarea)) {
            try {
              this.textarea.focus();
            } catch (e) {
            }
          }
        };
        TextareaInput.prototype.blur = function() {
          this.textarea.blur();
        };
        TextareaInput.prototype.resetPosition = function() {
          this.wrapper.style.top = this.wrapper.style.left = 0;
        };
        TextareaInput.prototype.receivedFocus = function() {
          this.slowPoll();
        };
        TextareaInput.prototype.slowPoll = function() {
          var this$1 = this;
          if (this.pollingFast) {
            return;
          }
          this.polling.set(this.cm.options.pollInterval, function() {
            this$1.poll();
            if (this$1.cm.state.focused) {
              this$1.slowPoll();
            }
          });
        };
        TextareaInput.prototype.fastPoll = function() {
          var missed = false, input = this;
          input.pollingFast = true;
          function p() {
            var changed = input.poll();
            if (!changed && !missed) {
              missed = true;
              input.polling.set(60, p);
            } else {
              input.pollingFast = false;
              input.slowPoll();
            }
          }
          input.polling.set(20, p);
        };
        TextareaInput.prototype.poll = function() {
          var this$1 = this;
          var cm = this.cm, input = this.textarea, prevInput = this.prevInput;
          if (this.contextMenuPending || this.resetting || !cm.state.focused || hasSelection(input) && !prevInput && !this.composing || cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq) {
            return false;
          }
          var text2 = input.value;
          if (text2 == prevInput && !cm.somethingSelected()) {
            return false;
          }
          if (ie && ie_version >= 9 && this.hasSelection === text2 || mac && /[\uf700-\uf7ff]/.test(text2)) {
            cm.display.input.reset();
            return false;
          }
          if (cm.doc.sel == cm.display.selForContextMenu) {
            var first = text2.charCodeAt(0);
            if (first == 8203 && !prevInput) {
              prevInput = "\u200B";
            }
            if (first == 8666) {
              this.reset();
              return this.cm.execCommand("undo");
            }
          }
          var same = 0, l = Math.min(prevInput.length, text2.length);
          while (same < l && prevInput.charCodeAt(same) == text2.charCodeAt(same)) {
            ++same;
          }
          runInOp(cm, function() {
            applyTextInput(
              cm,
              text2.slice(same),
              prevInput.length - same,
              null,
              this$1.composing ? "*compose" : null
            );
            if (text2.length > 1e3 || text2.indexOf("\n") > -1) {
              input.value = this$1.prevInput = "";
            } else {
              this$1.prevInput = text2;
            }
            if (this$1.composing) {
              this$1.composing.range.clear();
              this$1.composing.range = cm.markText(
                this$1.composing.start,
                cm.getCursor("to"),
                { className: "CodeMirror-composing" }
              );
            }
          });
          return true;
        };
        TextareaInput.prototype.ensurePolled = function() {
          if (this.pollingFast && this.poll()) {
            this.pollingFast = false;
          }
        };
        TextareaInput.prototype.onKeyPress = function() {
          if (ie && ie_version >= 9) {
            this.hasSelection = null;
          }
          this.fastPoll();
        };
        TextareaInput.prototype.onContextMenu = function(e) {
          var input = this, cm = input.cm, display = cm.display, te = input.textarea;
          if (input.contextMenuPending) {
            input.contextMenuPending();
          }
          var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
          if (!pos || presto) {
            return;
          }
          var reset = cm.options.resetSelectionOnContextMenu;
          if (reset && cm.doc.sel.contains(pos) == -1) {
            operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);
          }
          var oldCSS = te.style.cssText, oldWrapperCSS = input.wrapper.style.cssText;
          var wrapperBox = input.wrapper.offsetParent.getBoundingClientRect();
          input.wrapper.style.cssText = "position: static";
          te.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e.clientY - wrapperBox.top - 5) + "px; left: " + (e.clientX - wrapperBox.left - 5) + "px;\n      z-index: 1000; background: " + (ie ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
          var oldScrollY;
          if (webkit) {
            oldScrollY = te.ownerDocument.defaultView.scrollY;
          }
          display.input.focus();
          if (webkit) {
            te.ownerDocument.defaultView.scrollTo(null, oldScrollY);
          }
          display.input.reset();
          if (!cm.somethingSelected()) {
            te.value = input.prevInput = " ";
          }
          input.contextMenuPending = rehide;
          display.selForContextMenu = cm.doc.sel;
          clearTimeout(display.detectingSelectAll);
          function prepareSelectAllHack() {
            if (te.selectionStart != null) {
              var selected = cm.somethingSelected();
              var extval = "\u200B" + (selected ? te.value : "");
              te.value = "\u21DA";
              te.value = extval;
              input.prevInput = selected ? "" : "\u200B";
              te.selectionStart = 1;
              te.selectionEnd = extval.length;
              display.selForContextMenu = cm.doc.sel;
            }
          }
          function rehide() {
            if (input.contextMenuPending != rehide) {
              return;
            }
            input.contextMenuPending = false;
            input.wrapper.style.cssText = oldWrapperCSS;
            te.style.cssText = oldCSS;
            if (ie && ie_version < 9) {
              display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);
            }
            if (te.selectionStart != null) {
              if (!ie || ie && ie_version < 9) {
                prepareSelectAllHack();
              }
              var i2 = 0, poll = function() {
                if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 && te.selectionEnd > 0 && input.prevInput == "\u200B") {
                  operation(cm, selectAll)(cm);
                } else if (i2++ < 10) {
                  display.detectingSelectAll = setTimeout(poll, 500);
                } else {
                  display.selForContextMenu = null;
                  display.input.reset();
                }
              };
              display.detectingSelectAll = setTimeout(poll, 200);
            }
          }
          if (ie && ie_version >= 9) {
            prepareSelectAllHack();
          }
          if (captureRightClick) {
            e_stop(e);
            var mouseup = function() {
              off(window, "mouseup", mouseup);
              setTimeout(rehide, 20);
            };
            on(window, "mouseup", mouseup);
          } else {
            setTimeout(rehide, 50);
          }
        };
        TextareaInput.prototype.readOnlyChanged = function(val) {
          if (!val) {
            this.reset();
          }
          this.textarea.disabled = val == "nocursor";
          this.textarea.readOnly = !!val;
        };
        TextareaInput.prototype.setUneditable = function() {
        };
        TextareaInput.prototype.needsContentAttribute = false;
        function fromTextArea(textarea, options) {
          options = options ? copyObj(options) : {};
          options.value = textarea.value;
          if (!options.tabindex && textarea.tabIndex) {
            options.tabindex = textarea.tabIndex;
          }
          if (!options.placeholder && textarea.placeholder) {
            options.placeholder = textarea.placeholder;
          }
          if (options.autofocus == null) {
            var hasFocus = activeElt(rootNode(textarea));
            options.autofocus = hasFocus == textarea || textarea.getAttribute("autofocus") != null && hasFocus == document.body;
          }
          function save() {
            textarea.value = cm.getValue();
          }
          var realSubmit;
          if (textarea.form) {
            on(textarea.form, "submit", save);
            if (!options.leaveSubmitMethodAlone) {
              var form = textarea.form;
              realSubmit = form.submit;
              try {
                var wrappedSubmit = form.submit = function() {
                  save();
                  form.submit = realSubmit;
                  form.submit();
                  form.submit = wrappedSubmit;
                };
              } catch (e) {
              }
            }
          }
          options.finishInit = function(cm2) {
            cm2.save = save;
            cm2.getTextArea = function() {
              return textarea;
            };
            cm2.toTextArea = function() {
              cm2.toTextArea = isNaN;
              save();
              textarea.parentNode.removeChild(cm2.getWrapperElement());
              textarea.style.display = "";
              if (textarea.form) {
                off(textarea.form, "submit", save);
                if (!options.leaveSubmitMethodAlone && typeof textarea.form.submit == "function") {
                  textarea.form.submit = realSubmit;
                }
              }
            };
          };
          textarea.style.display = "none";
          var cm = CodeMirror3(
            function(node) {
              return textarea.parentNode.insertBefore(node, textarea.nextSibling);
            },
            options
          );
          return cm;
        }
        function addLegacyProps(CodeMirror4) {
          CodeMirror4.off = off;
          CodeMirror4.on = on;
          CodeMirror4.wheelEventPixels = wheelEventPixels;
          CodeMirror4.Doc = Doc2;
          CodeMirror4.splitLines = splitLinesAuto;
          CodeMirror4.countColumn = countColumn;
          CodeMirror4.findColumn = findColumn;
          CodeMirror4.isWordChar = isWordCharBasic;
          CodeMirror4.Pass = Pass;
          CodeMirror4.signal = signal;
          CodeMirror4.Line = Line;
          CodeMirror4.changeEnd = changeEnd;
          CodeMirror4.scrollbarModel = scrollbarModel;
          CodeMirror4.Pos = Pos;
          CodeMirror4.cmpPos = cmp;
          CodeMirror4.modes = modes;
          CodeMirror4.mimeModes = mimeModes;
          CodeMirror4.resolveMode = resolveMode;
          CodeMirror4.getMode = getMode;
          CodeMirror4.modeExtensions = modeExtensions;
          CodeMirror4.extendMode = extendMode;
          CodeMirror4.copyState = copyState;
          CodeMirror4.startState = startState;
          CodeMirror4.innerMode = innerMode;
          CodeMirror4.commands = commands;
          CodeMirror4.keyMap = keyMap;
          CodeMirror4.keyName = keyName;
          CodeMirror4.isModifierKey = isModifierKey;
          CodeMirror4.lookupKey = lookupKey;
          CodeMirror4.normalizeKeyMap = normalizeKeyMap;
          CodeMirror4.StringStream = StringStream;
          CodeMirror4.SharedTextMarker = SharedTextMarker;
          CodeMirror4.TextMarker = TextMarker;
          CodeMirror4.LineWidget = LineWidget;
          CodeMirror4.e_preventDefault = e_preventDefault;
          CodeMirror4.e_stopPropagation = e_stopPropagation;
          CodeMirror4.e_stop = e_stop;
          CodeMirror4.addClass = addClass;
          CodeMirror4.contains = contains;
          CodeMirror4.rmClass = rmClass;
          CodeMirror4.keyNames = keyNames;
        }
        defineOptions(CodeMirror3);
        addEditorMethods(CodeMirror3);
        var dontDelegate = "iter insert remove copy getEditor constructor".split(" ");
        for (var prop in Doc2.prototype) {
          if (Doc2.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0) {
            CodeMirror3.prototype[prop] = /* @__PURE__ */ (function(method) {
              return function() {
                return method.apply(this.doc, arguments);
              };
            })(Doc2.prototype[prop]);
          }
        }
        eventMixin(Doc2);
        CodeMirror3.inputStyles = { "textarea": TextareaInput, "contenteditable": ContentEditableInput };
        CodeMirror3.defineMode = function(name) {
          if (!CodeMirror3.defaults.mode && name != "null") {
            CodeMirror3.defaults.mode = name;
          }
          defineMode.apply(this, arguments);
        };
        CodeMirror3.defineMIME = defineMIME;
        CodeMirror3.defineMode("null", function() {
          return { token: function(stream) {
            return stream.skipToEnd();
          } };
        });
        CodeMirror3.defineMIME("text/plain", "null");
        CodeMirror3.defineExtension = function(name, func) {
          CodeMirror3.prototype[name] = func;
        };
        CodeMirror3.defineDocExtension = function(name, func) {
          Doc2.prototype[name] = func;
        };
        CodeMirror3.fromTextArea = fromTextArea;
        addLegacyProps(CodeMirror3);
        CodeMirror3.version = "5.65.20";
        return CodeMirror3;
      }));
    }
  });

  // node_modules/lib0/map.js
  var create = () => /* @__PURE__ */ new Map();
  var copy = (m) => {
    const r = create();
    m.forEach((v, k) => {
      r.set(k, v);
    });
    return r;
  };
  var setIfUndefined = (map3, key, createT) => {
    let set = map3.get(key);
    if (set === void 0) {
      map3.set(key, set = createT());
    }
    return set;
  };
  var map = (m, f) => {
    const res = [];
    for (const [key, value] of m) {
      res.push(f(value, key));
    }
    return res;
  };
  var any = (m, f) => {
    for (const [key, value] of m) {
      if (f(value, key)) {
        return true;
      }
    }
    return false;
  };

  // node_modules/lib0/set.js
  var create2 = () => /* @__PURE__ */ new Set();

  // node_modules/lib0/array.js
  var last = (arr) => arr[arr.length - 1];
  var appendTo = (dest, src) => {
    for (let i = 0; i < src.length; i++) {
      dest.push(src[i]);
    }
  };
  var from = Array.from;
  var every = (arr, f) => {
    for (let i = 0; i < arr.length; i++) {
      if (!f(arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  };
  var equalFlat = (a, b) => a.length === b.length && every(a, (item, index) => item === b[index]);
  var isArray = Array.isArray;

  // node_modules/lib0/observable.js
  var ObservableV2 = class {
    constructor() {
      this._observers = create();
    }
    /**
     * @template {keyof EVENTS & string} NAME
     * @param {NAME} name
     * @param {EVENTS[NAME]} f
     */
    on(name, f) {
      setIfUndefined(
        this._observers,
        /** @type {string} */
        name,
        create2
      ).add(f);
      return f;
    }
    /**
     * @template {keyof EVENTS & string} NAME
     * @param {NAME} name
     * @param {EVENTS[NAME]} f
     */
    once(name, f) {
      const _f = (...args2) => {
        this.off(
          name,
          /** @type {any} */
          _f
        );
        f(...args2);
      };
      this.on(
        name,
        /** @type {any} */
        _f
      );
    }
    /**
     * @template {keyof EVENTS & string} NAME
     * @param {NAME} name
     * @param {EVENTS[NAME]} f
     */
    off(name, f) {
      const observers = this._observers.get(name);
      if (observers !== void 0) {
        observers.delete(f);
        if (observers.size === 0) {
          this._observers.delete(name);
        }
      }
    }
    /**
     * Emit a named event. All registered event listeners that listen to the
     * specified name will receive the event.
     *
     * @todo This should catch exceptions
     *
     * @template {keyof EVENTS & string} NAME
     * @param {NAME} name The event name.
     * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
     */
    emit(name, args2) {
      return from((this._observers.get(name) || create()).values()).forEach((f) => f(...args2));
    }
    destroy() {
      this._observers = create();
    }
  };
  var Observable = class {
    constructor() {
      this._observers = create();
    }
    /**
     * @param {N} name
     * @param {function} f
     */
    on(name, f) {
      setIfUndefined(this._observers, name, create2).add(f);
    }
    /**
     * @param {N} name
     * @param {function} f
     */
    once(name, f) {
      const _f = (...args2) => {
        this.off(name, _f);
        f(...args2);
      };
      this.on(name, _f);
    }
    /**
     * @param {N} name
     * @param {function} f
     */
    off(name, f) {
      const observers = this._observers.get(name);
      if (observers !== void 0) {
        observers.delete(f);
        if (observers.size === 0) {
          this._observers.delete(name);
        }
      }
    }
    /**
     * Emit a named event. All registered event listeners that listen to the
     * specified name will receive the event.
     *
     * @todo This should catch exceptions
     *
     * @param {N} name The event name.
     * @param {Array<any>} args The arguments that are applied to the event listener.
     */
    emit(name, args2) {
      return from((this._observers.get(name) || create()).values()).forEach((f) => f(...args2));
    }
    destroy() {
      this._observers = create();
    }
  };

  // node_modules/lib0/math.js
  var floor = Math.floor;
  var abs = Math.abs;
  var add = (a, b) => a + b;
  var min = (a, b) => a < b ? a : b;
  var max = (a, b) => a > b ? a : b;
  var isNaN2 = Number.isNaN;
  var pow = Math.pow;
  var isNegativeZero = (n) => n !== 0 ? n < 0 : 1 / n < 0;

  // node_modules/lib0/binary.js
  var BIT1 = 1;
  var BIT2 = 2;
  var BIT3 = 4;
  var BIT4 = 8;
  var BIT6 = 32;
  var BIT7 = 64;
  var BIT8 = 128;
  var BIT18 = 1 << 17;
  var BIT19 = 1 << 18;
  var BIT20 = 1 << 19;
  var BIT21 = 1 << 20;
  var BIT22 = 1 << 21;
  var BIT23 = 1 << 22;
  var BIT24 = 1 << 23;
  var BIT25 = 1 << 24;
  var BIT26 = 1 << 25;
  var BIT27 = 1 << 26;
  var BIT28 = 1 << 27;
  var BIT29 = 1 << 28;
  var BIT30 = 1 << 29;
  var BIT31 = 1 << 30;
  var BIT32 = 1 << 31;
  var BITS5 = 31;
  var BITS6 = 63;
  var BITS7 = 127;
  var BITS17 = BIT18 - 1;
  var BITS18 = BIT19 - 1;
  var BITS19 = BIT20 - 1;
  var BITS20 = BIT21 - 1;
  var BITS21 = BIT22 - 1;
  var BITS22 = BIT23 - 1;
  var BITS23 = BIT24 - 1;
  var BITS24 = BIT25 - 1;
  var BITS25 = BIT26 - 1;
  var BITS26 = BIT27 - 1;
  var BITS27 = BIT28 - 1;
  var BITS28 = BIT29 - 1;
  var BITS29 = BIT30 - 1;
  var BITS30 = BIT31 - 1;
  var BITS31 = 2147483647;

  // node_modules/lib0/number.js
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
  var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
  var LOWEST_INT32 = 1 << 31;
  var isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
  var isNaN3 = Number.isNaN;
  var parseInt2 = Number.parseInt;

  // node_modules/lib0/string.js
  var fromCharCode = String.fromCharCode;
  var fromCodePoint = String.fromCodePoint;
  var MAX_UTF16_CHARACTER = fromCharCode(65535);
  var toLowerCase = (s) => s.toLowerCase();
  var trimLeftRegex = /^\s*/g;
  var trimLeft = (s) => s.replace(trimLeftRegex, "");
  var fromCamelCaseRegex = /([A-Z])/g;
  var fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match) => `${separator}${toLowerCase(match)}`));
  var _encodeUtf8Polyfill = (str) => {
    const encodedString = unescape(encodeURIComponent(str));
    const len = encodedString.length;
    const buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buf[i] = /** @type {number} */
      encodedString.codePointAt(i);
    }
    return buf;
  };
  var utf8TextEncoder = (
    /** @type {TextEncoder} */
    typeof TextEncoder !== "undefined" ? new TextEncoder() : null
  );
  var _encodeUtf8Native = (str) => utf8TextEncoder.encode(str);
  var encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;
  var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
  if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
    utf8TextDecoder = null;
  }

  // node_modules/lib0/encoding.js
  var Encoder = class {
    constructor() {
      this.cpos = 0;
      this.cbuf = new Uint8Array(100);
      this.bufs = [];
    }
  };
  var createEncoder = () => new Encoder();
  var length = (encoder) => {
    let len = encoder.cpos;
    for (let i = 0; i < encoder.bufs.length; i++) {
      len += encoder.bufs[i].length;
    }
    return len;
  };
  var toUint8Array = (encoder) => {
    const uint8arr = new Uint8Array(length(encoder));
    let curPos = 0;
    for (let i = 0; i < encoder.bufs.length; i++) {
      const d = encoder.bufs[i];
      uint8arr.set(d, curPos);
      curPos += d.length;
    }
    uint8arr.set(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
    return uint8arr;
  };
  var verifyLen = (encoder, len) => {
    const bufferLen = encoder.cbuf.length;
    if (bufferLen - encoder.cpos < len) {
      encoder.bufs.push(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos));
      encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
      encoder.cpos = 0;
    }
  };
  var write = (encoder, num) => {
    const bufferLen = encoder.cbuf.length;
    if (encoder.cpos === bufferLen) {
      encoder.bufs.push(encoder.cbuf);
      encoder.cbuf = new Uint8Array(bufferLen * 2);
      encoder.cpos = 0;
    }
    encoder.cbuf[encoder.cpos++] = num;
  };
  var writeUint8 = write;
  var writeVarUint = (encoder, num) => {
    while (num > BITS7) {
      write(encoder, BIT8 | BITS7 & num);
      num = floor(num / 128);
    }
    write(encoder, BITS7 & num);
  };
  var writeVarInt = (encoder, num) => {
    const isNegative = isNegativeZero(num);
    if (isNegative) {
      num = -num;
    }
    write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | BITS6 & num);
    num = floor(num / 64);
    while (num > 0) {
      write(encoder, (num > BITS7 ? BIT8 : 0) | BITS7 & num);
      num = floor(num / 128);
    }
  };
  var _strBuffer = new Uint8Array(3e4);
  var _maxStrBSize = _strBuffer.length / 3;
  var _writeVarStringNative = (encoder, str) => {
    if (str.length < _maxStrBSize) {
      const written = utf8TextEncoder.encodeInto(str, _strBuffer).written || 0;
      writeVarUint(encoder, written);
      for (let i = 0; i < written; i++) {
        write(encoder, _strBuffer[i]);
      }
    } else {
      writeVarUint8Array(encoder, encodeUtf8(str));
    }
  };
  var _writeVarStringPolyfill = (encoder, str) => {
    const encodedString = unescape(encodeURIComponent(str));
    const len = encodedString.length;
    writeVarUint(encoder, len);
    for (let i = 0; i < len; i++) {
      write(
        encoder,
        /** @type {number} */
        encodedString.codePointAt(i)
      );
    }
  };
  var writeVarString = utf8TextEncoder && /** @type {any} */
  utf8TextEncoder.encodeInto ? _writeVarStringNative : _writeVarStringPolyfill;
  var writeUint8Array = (encoder, uint8Array) => {
    const bufferLen = encoder.cbuf.length;
    const cpos = encoder.cpos;
    const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
    const rightCopyLen = uint8Array.length - leftCopyLen;
    encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
    encoder.cpos += leftCopyLen;
    if (rightCopyLen > 0) {
      encoder.bufs.push(encoder.cbuf);
      encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
      encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
      encoder.cpos = rightCopyLen;
    }
  };
  var writeVarUint8Array = (encoder, uint8Array) => {
    writeVarUint(encoder, uint8Array.byteLength);
    writeUint8Array(encoder, uint8Array);
  };
  var writeOnDataView = (encoder, len) => {
    verifyLen(encoder, len);
    const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
    encoder.cpos += len;
    return dview;
  };
  var writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
  var writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
  var writeBigInt64 = (encoder, num) => (
    /** @type {any} */
    writeOnDataView(encoder, 8).setBigInt64(0, num, false)
  );
  var floatTestBed = new DataView(new ArrayBuffer(4));
  var isFloat32 = (num) => {
    floatTestBed.setFloat32(0, num);
    return floatTestBed.getFloat32(0) === num;
  };
  var writeAny = (encoder, data) => {
    switch (typeof data) {
      case "string":
        write(encoder, 119);
        writeVarString(encoder, data);
        break;
      case "number":
        if (isInteger(data) && abs(data) <= BITS31) {
          write(encoder, 125);
          writeVarInt(encoder, data);
        } else if (isFloat32(data)) {
          write(encoder, 124);
          writeFloat32(encoder, data);
        } else {
          write(encoder, 123);
          writeFloat64(encoder, data);
        }
        break;
      case "bigint":
        write(encoder, 122);
        writeBigInt64(encoder, data);
        break;
      case "object":
        if (data === null) {
          write(encoder, 126);
        } else if (isArray(data)) {
          write(encoder, 117);
          writeVarUint(encoder, data.length);
          for (let i = 0; i < data.length; i++) {
            writeAny(encoder, data[i]);
          }
        } else if (data instanceof Uint8Array) {
          write(encoder, 116);
          writeVarUint8Array(encoder, data);
        } else {
          write(encoder, 118);
          const keys2 = Object.keys(data);
          writeVarUint(encoder, keys2.length);
          for (let i = 0; i < keys2.length; i++) {
            const key = keys2[i];
            writeVarString(encoder, key);
            writeAny(encoder, data[key]);
          }
        }
        break;
      case "boolean":
        write(encoder, data ? 120 : 121);
        break;
      default:
        write(encoder, 127);
    }
  };
  var RleEncoder = class extends Encoder {
    /**
     * @param {function(Encoder, T):void} writer
     */
    constructor(writer) {
      super();
      this.w = writer;
      this.s = null;
      this.count = 0;
    }
    /**
     * @param {T} v
     */
    write(v) {
      if (this.s === v) {
        this.count++;
      } else {
        if (this.count > 0) {
          writeVarUint(this, this.count - 1);
        }
        this.count = 1;
        this.w(this, v);
        this.s = v;
      }
    }
  };
  var flushUintOptRleEncoder = (encoder) => {
    if (encoder.count > 0) {
      writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
      if (encoder.count > 1) {
        writeVarUint(encoder.encoder, encoder.count - 2);
      }
    }
  };
  var UintOptRleEncoder = class {
    constructor() {
      this.encoder = new Encoder();
      this.s = 0;
      this.count = 0;
    }
    /**
     * @param {number} v
     */
    write(v) {
      if (this.s === v) {
        this.count++;
      } else {
        flushUintOptRleEncoder(this);
        this.count = 1;
        this.s = v;
      }
    }
    /**
     * Flush the encoded state and transform this to a Uint8Array.
     *
     * Note that this should only be called once.
     */
    toUint8Array() {
      flushUintOptRleEncoder(this);
      return toUint8Array(this.encoder);
    }
  };
  var flushIntDiffOptRleEncoder = (encoder) => {
    if (encoder.count > 0) {
      const encodedDiff = encoder.diff * 2 + (encoder.count === 1 ? 0 : 1);
      writeVarInt(encoder.encoder, encodedDiff);
      if (encoder.count > 1) {
        writeVarUint(encoder.encoder, encoder.count - 2);
      }
    }
  };
  var IntDiffOptRleEncoder = class {
    constructor() {
      this.encoder = new Encoder();
      this.s = 0;
      this.count = 0;
      this.diff = 0;
    }
    /**
     * @param {number} v
     */
    write(v) {
      if (this.diff === v - this.s) {
        this.s = v;
        this.count++;
      } else {
        flushIntDiffOptRleEncoder(this);
        this.count = 1;
        this.diff = v - this.s;
        this.s = v;
      }
    }
    /**
     * Flush the encoded state and transform this to a Uint8Array.
     *
     * Note that this should only be called once.
     */
    toUint8Array() {
      flushIntDiffOptRleEncoder(this);
      return toUint8Array(this.encoder);
    }
  };
  var StringEncoder = class {
    constructor() {
      this.sarr = [];
      this.s = "";
      this.lensE = new UintOptRleEncoder();
    }
    /**
     * @param {string} string
     */
    write(string) {
      this.s += string;
      if (this.s.length > 19) {
        this.sarr.push(this.s);
        this.s = "";
      }
      this.lensE.write(string.length);
    }
    toUint8Array() {
      const encoder = new Encoder();
      this.sarr.push(this.s);
      this.s = "";
      writeVarString(encoder, this.sarr.join(""));
      writeUint8Array(encoder, this.lensE.toUint8Array());
      return toUint8Array(encoder);
    }
  };

  // node_modules/lib0/error.js
  var create3 = (s) => new Error(s);
  var methodUnimplemented = () => {
    throw create3("Method unimplemented");
  };
  var unexpectedCase = () => {
    throw create3("Unexpected case");
  };

  // node_modules/lib0/decoding.js
  var errorUnexpectedEndOfArray = create3("Unexpected end of array");
  var errorIntegerOutOfRange = create3("Integer out of Range");
  var Decoder = class {
    /**
     * @param {Uint8Array} uint8Array Binary data to decode
     */
    constructor(uint8Array) {
      this.arr = uint8Array;
      this.pos = 0;
    }
  };
  var createDecoder = (uint8Array) => new Decoder(uint8Array);
  var hasContent = (decoder) => decoder.pos !== decoder.arr.length;
  var readUint8Array = (decoder, len) => {
    const view = new Uint8Array(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
    decoder.pos += len;
    return view;
  };
  var readVarUint8Array = (decoder) => readUint8Array(decoder, readVarUint(decoder));
  var readUint8 = (decoder) => decoder.arr[decoder.pos++];
  var readVarUint = (decoder) => {
    let num = 0;
    let mult = 1;
    const len = decoder.arr.length;
    while (decoder.pos < len) {
      const r = decoder.arr[decoder.pos++];
      num = num + (r & BITS7) * mult;
      mult *= 128;
      if (r < BIT8) {
        return num;
      }
      if (num > MAX_SAFE_INTEGER) {
        throw errorIntegerOutOfRange;
      }
    }
    throw errorUnexpectedEndOfArray;
  };
  var readVarInt = (decoder) => {
    let r = decoder.arr[decoder.pos++];
    let num = r & BITS6;
    let mult = 64;
    const sign = (r & BIT7) > 0 ? -1 : 1;
    if ((r & BIT8) === 0) {
      return sign * num;
    }
    const len = decoder.arr.length;
    while (decoder.pos < len) {
      r = decoder.arr[decoder.pos++];
      num = num + (r & BITS7) * mult;
      mult *= 128;
      if (r < BIT8) {
        return sign * num;
      }
      if (num > MAX_SAFE_INTEGER) {
        throw errorIntegerOutOfRange;
      }
    }
    throw errorUnexpectedEndOfArray;
  };
  var _readVarStringPolyfill = (decoder) => {
    let remainingLen = readVarUint(decoder);
    if (remainingLen === 0) {
      return "";
    } else {
      let encodedString = String.fromCodePoint(readUint8(decoder));
      if (--remainingLen < 100) {
        while (remainingLen--) {
          encodedString += String.fromCodePoint(readUint8(decoder));
        }
      } else {
        while (remainingLen > 0) {
          const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
          const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
          decoder.pos += nextLen;
          encodedString += String.fromCodePoint.apply(
            null,
            /** @type {any} */
            bytes
          );
          remainingLen -= nextLen;
        }
      }
      return decodeURIComponent(escape(encodedString));
    }
  };
  var _readVarStringNative = (decoder) => (
    /** @type any */
    utf8TextDecoder.decode(readVarUint8Array(decoder))
  );
  var readVarString = utf8TextDecoder ? _readVarStringNative : _readVarStringPolyfill;
  var readFromDataView = (decoder, len) => {
    const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
    decoder.pos += len;
    return dv;
  };
  var readFloat32 = (decoder) => readFromDataView(decoder, 4).getFloat32(0, false);
  var readFloat64 = (decoder) => readFromDataView(decoder, 8).getFloat64(0, false);
  var readBigInt64 = (decoder) => (
    /** @type {any} */
    readFromDataView(decoder, 8).getBigInt64(0, false)
  );
  var readAnyLookupTable = [
    (decoder) => void 0,
    // CASE 127: undefined
    (decoder) => null,
    // CASE 126: null
    readVarInt,
    // CASE 125: integer
    readFloat32,
    // CASE 124: float32
    readFloat64,
    // CASE 123: float64
    readBigInt64,
    // CASE 122: bigint
    (decoder) => false,
    // CASE 121: boolean (false)
    (decoder) => true,
    // CASE 120: boolean (true)
    readVarString,
    // CASE 119: string
    (decoder) => {
      const len = readVarUint(decoder);
      const obj = {};
      for (let i = 0; i < len; i++) {
        const key = readVarString(decoder);
        obj[key] = readAny(decoder);
      }
      return obj;
    },
    (decoder) => {
      const len = readVarUint(decoder);
      const arr = [];
      for (let i = 0; i < len; i++) {
        arr.push(readAny(decoder));
      }
      return arr;
    },
    readVarUint8Array
    // CASE 116: Uint8Array
  ];
  var readAny = (decoder) => readAnyLookupTable[127 - readUint8(decoder)](decoder);
  var RleDecoder = class extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     * @param {function(Decoder):T} reader
     */
    constructor(uint8Array, reader) {
      super(uint8Array);
      this.reader = reader;
      this.s = null;
      this.count = 0;
    }
    read() {
      if (this.count === 0) {
        this.s = this.reader(this);
        if (hasContent(this)) {
          this.count = readVarUint(this) + 1;
        } else {
          this.count = -1;
        }
      }
      this.count--;
      return (
        /** @type {T} */
        this.s
      );
    }
  };
  var UintOptRleDecoder = class extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor(uint8Array) {
      super(uint8Array);
      this.s = 0;
      this.count = 0;
    }
    read() {
      if (this.count === 0) {
        this.s = readVarInt(this);
        const isNegative = isNegativeZero(this.s);
        this.count = 1;
        if (isNegative) {
          this.s = -this.s;
          this.count = readVarUint(this) + 2;
        }
      }
      this.count--;
      return (
        /** @type {number} */
        this.s
      );
    }
  };
  var IntDiffOptRleDecoder = class extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor(uint8Array) {
      super(uint8Array);
      this.s = 0;
      this.count = 0;
      this.diff = 0;
    }
    /**
     * @return {number}
     */
    read() {
      if (this.count === 0) {
        const diff = readVarInt(this);
        const hasCount = diff & 1;
        this.diff = floor(diff / 2);
        this.count = 1;
        if (hasCount) {
          this.count = readVarUint(this) + 2;
        }
      }
      this.s += this.diff;
      this.count--;
      return this.s;
    }
  };
  var StringDecoder = class {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor(uint8Array) {
      this.decoder = new UintOptRleDecoder(uint8Array);
      this.str = readVarString(this.decoder);
      this.spos = 0;
    }
    /**
     * @return {string}
     */
    read() {
      const end = this.spos + this.decoder.read();
      const res = this.str.slice(this.spos, end);
      this.spos = end;
      return res;
    }
  };

  // node_modules/lib0/webcrypto.js
  var subtle = crypto.subtle;
  var getRandomValues = crypto.getRandomValues.bind(crypto);

  // node_modules/lib0/random.js
  var uint32 = () => getRandomValues(new Uint32Array(1))[0];
  var uuidv4Template = "10000000-1000-4000-8000" + -1e11;
  var uuidv4 = () => uuidv4Template.replace(
    /[018]/g,
    /** @param {number} c */
    (c) => (c ^ uint32() & 15 >> c / 4).toString(16)
  );

  // node_modules/lib0/time.js
  var getUnixTime = Date.now;

  // node_modules/lib0/promise.js
  var create4 = (f) => (
    /** @type {Promise<T>} */
    new Promise(f)
  );
  var all = Promise.all.bind(Promise);

  // node_modules/lib0/conditions.js
  var undefinedToNull = (v) => v === void 0 ? null : v;

  // node_modules/lib0/storage.js
  var VarStoragePolyfill = class {
    constructor() {
      this.map = /* @__PURE__ */ new Map();
    }
    /**
     * @param {string} key
     * @param {any} newValue
     */
    setItem(key, newValue) {
      this.map.set(key, newValue);
    }
    /**
     * @param {string} key
     */
    getItem(key) {
      return this.map.get(key);
    }
  };
  var _localStorage = new VarStoragePolyfill();
  var usePolyfill = true;
  try {
    if (typeof localStorage !== "undefined" && localStorage) {
      _localStorage = localStorage;
      usePolyfill = false;
    }
  } catch (e) {
  }
  var varStorage = _localStorage;
  var onChange = (eventHandler) => usePolyfill || addEventListener(
    "storage",
    /** @type {any} */
    eventHandler
  );
  var offChange = (eventHandler) => usePolyfill || removeEventListener(
    "storage",
    /** @type {any} */
    eventHandler
  );

  // node_modules/lib0/object.js
  var assign = Object.assign;
  var keys = Object.keys;
  var forEach = (obj, f) => {
    for (const key in obj) {
      f(obj[key], key);
    }
  };
  var map2 = (obj, f) => {
    const results = [];
    for (const key in obj) {
      results.push(f(obj[key], key));
    }
    return results;
  };
  var length2 = (obj) => keys(obj).length;
  var size = (obj) => keys(obj).length;
  var isEmpty = (obj) => {
    for (const _k in obj) {
      return false;
    }
    return true;
  };
  var every2 = (obj, f) => {
    for (const key in obj) {
      if (!f(obj[key], key)) {
        return false;
      }
    }
    return true;
  };
  var hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  var equalFlat2 = (a, b) => a === b || size(a) === size(b) && every2(a, (val, key) => (val !== void 0 || hasProperty(b, key)) && b[key] === val);
  var freeze = Object.freeze;
  var deepFreeze = (o) => {
    for (const key in o) {
      const c = o[key];
      if (typeof c === "object" || typeof c === "function") {
        deepFreeze(o[key]);
      }
    }
    return freeze(o);
  };

  // node_modules/lib0/traits.js
  var EqualityTraitSymbol = Symbol("Equality");

  // node_modules/lib0/function.js
  var callAll = (fs, args2, i = 0) => {
    try {
      for (; i < fs.length; i++) {
        fs[i](...args2);
      }
    } finally {
      if (i < fs.length) {
        callAll(fs, args2, i + 1);
      }
    }
  };
  var id = (a) => a;
  var equalityFlat = (a, b) => a === b || a != null && b != null && a.constructor === b.constructor && (isArray(a) && equalFlat(
    a,
    /** @type {Array<T>} */
    b
  ) || typeof a === "object" && equalFlat2(a, b));
  var equalityDeep = (a, b) => {
    if (a === b) {
      return true;
    }
    if (a == null || b == null || a.constructor !== b.constructor) {
      return false;
    }
    if (a[EqualityTraitSymbol] != null) {
      return a[EqualityTraitSymbol](b);
    }
    switch (a.constructor) {
      case ArrayBuffer:
        a = new Uint8Array(a);
        b = new Uint8Array(b);
      // eslint-disable-next-line no-fallthrough
      case Uint8Array: {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        break;
      }
      case Set: {
        if (a.size !== b.size) {
          return false;
        }
        for (const value of a) {
          if (!b.has(value)) {
            return false;
          }
        }
        break;
      }
      case Map: {
        if (a.size !== b.size) {
          return false;
        }
        for (const key of a.keys()) {
          if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) {
            return false;
          }
        }
        break;
      }
      case Object:
        if (length2(a) !== length2(b)) {
          return false;
        }
        for (const key in a) {
          if (!hasProperty(a, key) || !equalityDeep(a[key], b[key])) {
            return false;
          }
        }
        break;
      case Array:
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (!equalityDeep(a[i], b[i])) {
            return false;
          }
        }
        break;
      default:
        return false;
    }
    return true;
  };
  var isOneOf = (value, options) => options.includes(value);

  // node_modules/lib0/environment.js
  var isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
  var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && !isNode;
  var isMac = typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
  var params;
  var args = [];
  var computeParams = () => {
    if (params === void 0) {
      if (isNode) {
        params = create();
        const pargs = process.argv;
        let currParamName = null;
        for (let i = 0; i < pargs.length; i++) {
          const parg = pargs[i];
          if (parg[0] === "-") {
            if (currParamName !== null) {
              params.set(currParamName, "");
            }
            currParamName = parg;
          } else {
            if (currParamName !== null) {
              params.set(currParamName, parg);
              currParamName = null;
            } else {
              args.push(parg);
            }
          }
        }
        if (currParamName !== null) {
          params.set(currParamName, "");
        }
      } else if (typeof location === "object") {
        params = create();
        (location.search || "?").slice(1).split("&").forEach((kv) => {
          if (kv.length !== 0) {
            const [key, value] = kv.split("=");
            params.set(`--${fromCamelCase(key, "-")}`, value);
            params.set(`-${fromCamelCase(key, "-")}`, value);
          }
        });
      } else {
        params = create();
      }
    }
    return params;
  };
  var hasParam = (name) => computeParams().has(name);
  var getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase().replaceAll("-", "_")]) : undefinedToNull(varStorage.getItem(name));
  var hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
  var production = hasConf("production");
  var forceColor = isNode && isOneOf(process.env.FORCE_COLOR, ["true", "1", "2"]);
  var supportsColor = forceColor || !hasParam("--no-colors") && // @todo deprecate --no-colors
  !hasConf("no-color") && (!isNode || process.stdout.isTTY) && (!isNode || hasParam("--color") || getVariable("COLORTERM") !== null || (getVariable("TERM") || "").includes("color"));

  // node_modules/lib0/buffer.js
  var createUint8ArrayFromLen = (len) => new Uint8Array(len);
  var createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length3) => new Uint8Array(buffer, byteOffset, length3);
  var createUint8ArrayFromArrayBuffer = (buffer) => new Uint8Array(buffer);
  var toBase64Browser = (bytes) => {
    let s = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      s += fromCharCode(bytes[i]);
    }
    return btoa(s);
  };
  var toBase64Node = (bytes) => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
  var fromBase64Browser = (s) => {
    const a = atob(s);
    const bytes = createUint8ArrayFromLen(a.length);
    for (let i = 0; i < a.length; i++) {
      bytes[i] = a.charCodeAt(i);
    }
    return bytes;
  };
  var fromBase64Node = (s) => {
    const buf = Buffer.from(s, "base64");
    return createUint8ArrayViewFromArrayBuffer(buf.buffer, buf.byteOffset, buf.byteLength);
  };
  var toBase64 = isBrowser ? toBase64Browser : toBase64Node;
  var fromBase64 = isBrowser ? fromBase64Browser : fromBase64Node;
  var copyUint8Array = (uint8Array) => {
    const newBuf = createUint8ArrayFromLen(uint8Array.byteLength);
    newBuf.set(uint8Array);
    return newBuf;
  };

  // node_modules/lib0/pair.js
  var Pair = class {
    /**
     * @param {L} left
     * @param {R} right
     */
    constructor(left, right) {
      this.left = left;
      this.right = right;
    }
  };
  var create5 = (left, right) => new Pair(left, right);

  // node_modules/lib0/dom.js
  var doc = (
    /** @type {Document} */
    typeof document !== "undefined" ? document : {}
  );
  var domParser = (
    /** @type {DOMParser} */
    typeof DOMParser !== "undefined" ? new DOMParser() : null
  );
  var mapToStyleString = (m) => map(m, (value, key) => `${key}:${value};`).join("");
  var ELEMENT_NODE = doc.ELEMENT_NODE;
  var TEXT_NODE = doc.TEXT_NODE;
  var CDATA_SECTION_NODE = doc.CDATA_SECTION_NODE;
  var COMMENT_NODE = doc.COMMENT_NODE;
  var DOCUMENT_NODE = doc.DOCUMENT_NODE;
  var DOCUMENT_TYPE_NODE = doc.DOCUMENT_TYPE_NODE;
  var DOCUMENT_FRAGMENT_NODE = doc.DOCUMENT_FRAGMENT_NODE;

  // node_modules/lib0/eventloop.js
  var createTimeoutClass = (clearFunction) => class TT {
    /**
     * @param {number} timeoutId
     */
    constructor(timeoutId) {
      this._ = timeoutId;
    }
    destroy() {
      clearFunction(this._);
    }
  };
  var Timeout = createTimeoutClass(clearTimeout);
  var Interval = createTimeoutClass(clearInterval);
  var Animation = createTimeoutClass((arg) => typeof requestAnimationFrame !== "undefined" && cancelAnimationFrame(arg));
  var Idle = createTimeoutClass((arg) => typeof cancelIdleCallback !== "undefined" && cancelIdleCallback(arg));
  var createDebouncer = (timeout, triggerAfter = -1) => {
    let timer = -1;
    let lastCall = null;
    return (cb) => {
      clearTimeout(timer);
      if (cb) {
        if (triggerAfter >= 0) {
          const now = getUnixTime();
          if (lastCall === null) lastCall = now;
          if (now - lastCall > triggerAfter) {
            lastCall = null;
            timer = /** @type {any} */
            setTimeout(cb, 0);
            return;
          }
        }
        timer = /** @type {any} */
        setTimeout(() => {
          lastCall = null;
          cb();
        }, timeout);
      } else {
        lastCall = null;
      }
    };
  };

  // node_modules/lib0/symbol.js
  var create6 = Symbol;

  // node_modules/lib0/logging.common.js
  var BOLD = create6();
  var UNBOLD = create6();
  var BLUE = create6();
  var GREY = create6();
  var GREEN = create6();
  var RED = create6();
  var PURPLE = create6();
  var ORANGE = create6();
  var UNCOLOR = create6();
  var computeNoColorLoggingArgs = (args2) => {
    if (args2.length === 1 && args2[0]?.constructor === Function) {
      args2 = /** @type {Array<string|Symbol|Object|number>} */
      /** @type {[function]} */
      args2[0]();
    }
    const strBuilder = [];
    const logArgs = [];
    let i = 0;
    for (; i < args2.length; i++) {
      const arg = args2[i];
      if (arg === void 0) {
        break;
      } else if (arg.constructor === String || arg.constructor === Number) {
        strBuilder.push(arg);
      } else if (arg.constructor === Object) {
        break;
      }
    }
    if (i > 0) {
      logArgs.push(strBuilder.join(""));
    }
    for (; i < args2.length; i++) {
      const arg = args2[i];
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs;
  };
  var lastLoggingTime = getUnixTime();

  // node_modules/lib0/logging.js
  var _browserStyleMap = {
    [BOLD]: create5("font-weight", "bold"),
    [UNBOLD]: create5("font-weight", "normal"),
    [BLUE]: create5("color", "blue"),
    [GREEN]: create5("color", "green"),
    [GREY]: create5("color", "grey"),
    [RED]: create5("color", "red"),
    [PURPLE]: create5("color", "purple"),
    [ORANGE]: create5("color", "orange"),
    // not well supported in chrome when debugging node with inspector - TODO: deprecate
    [UNCOLOR]: create5("color", "black")
  };
  var computeBrowserLoggingArgs = (args2) => {
    if (args2.length === 1 && args2[0]?.constructor === Function) {
      args2 = /** @type {Array<string|Symbol|Object|number>} */
      /** @type {[function]} */
      args2[0]();
    }
    const strBuilder = [];
    const styles = [];
    const currentStyle = create();
    let logArgs = [];
    let i = 0;
    for (; i < args2.length; i++) {
      const arg = args2[i];
      const style = _browserStyleMap[arg];
      if (style !== void 0) {
        currentStyle.set(style.left, style.right);
      } else {
        if (arg === void 0) {
          break;
        }
        if (arg.constructor === String || arg.constructor === Number) {
          const style2 = mapToStyleString(currentStyle);
          if (i > 0 || style2.length > 0) {
            strBuilder.push("%c" + arg);
            styles.push(style2);
          } else {
            strBuilder.push(arg);
          }
        } else {
          break;
        }
      }
    }
    if (i > 0) {
      logArgs = styles;
      logArgs.unshift(strBuilder.join(""));
    }
    for (; i < args2.length; i++) {
      const arg = args2[i];
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs;
  };
  var computeLoggingArgs = supportsColor ? computeBrowserLoggingArgs : computeNoColorLoggingArgs;
  var print = (...args2) => {
    console.log(...computeLoggingArgs(args2));
    vconsoles.forEach((vc) => vc.print(args2));
  };
  var warn = (...args2) => {
    console.warn(...computeLoggingArgs(args2));
    args2.unshift(ORANGE);
    vconsoles.forEach((vc) => vc.print(args2));
  };
  var vconsoles = create2();

  // node_modules/lib0/iterator.js
  var createIterator = (next) => ({
    /**
     * @return {IterableIterator<T>}
     */
    [Symbol.iterator]() {
      return this;
    },
    // @ts-ignore
    next
  });
  var iteratorFilter = (iterator, filter) => createIterator(() => {
    let res;
    do {
      res = iterator.next();
    } while (!res.done && !filter(res.value));
    return res;
  });
  var iteratorMap = (iterator, fmap) => createIterator(() => {
    const { done, value } = iterator.next();
    return { done, value: done ? void 0 : fmap(value) };
  });

  // node_modules/yjs/dist/yjs.mjs
  var DeleteItem = class {
    /**
     * @param {number} clock
     * @param {number} len
     */
    constructor(clock, len) {
      this.clock = clock;
      this.len = len;
    }
  };
  var DeleteSet = class {
    constructor() {
      this.clients = /* @__PURE__ */ new Map();
    }
  };
  var iterateDeletedStructs = (transaction, ds, f) => ds.clients.forEach((deletes, clientid) => {
    const structs = (
      /** @type {Array<GC|Item>} */
      transaction.doc.store.clients.get(clientid)
    );
    if (structs != null) {
      const lastStruct = structs[structs.length - 1];
      const clockState = lastStruct.id.clock + lastStruct.length;
      for (let i = 0, del = deletes[i]; i < deletes.length && del.clock < clockState; del = deletes[++i]) {
        iterateStructs(transaction, structs, del.clock, del.len, f);
      }
    }
  });
  var findIndexDS = (dis, clock) => {
    let left = 0;
    let right = dis.length - 1;
    while (left <= right) {
      const midindex = floor((left + right) / 2);
      const mid = dis[midindex];
      const midclock = mid.clock;
      if (midclock <= clock) {
        if (clock < midclock + mid.len) {
          return midindex;
        }
        left = midindex + 1;
      } else {
        right = midindex - 1;
      }
    }
    return null;
  };
  var isDeleted = (ds, id2) => {
    const dis = ds.clients.get(id2.client);
    return dis !== void 0 && findIndexDS(dis, id2.clock) !== null;
  };
  var sortAndMergeDeleteSet = (ds) => {
    ds.clients.forEach((dels) => {
      dels.sort((a, b) => a.clock - b.clock);
      let i, j;
      for (i = 1, j = 1; i < dels.length; i++) {
        const left = dels[j - 1];
        const right = dels[i];
        if (left.clock + left.len >= right.clock) {
          left.len = max(left.len, right.clock + right.len - left.clock);
        } else {
          if (j < i) {
            dels[j] = right;
          }
          j++;
        }
      }
      dels.length = j;
    });
  };
  var mergeDeleteSets = (dss) => {
    const merged = new DeleteSet();
    for (let dssI = 0; dssI < dss.length; dssI++) {
      dss[dssI].clients.forEach((delsLeft, client) => {
        if (!merged.clients.has(client)) {
          const dels = delsLeft.slice();
          for (let i = dssI + 1; i < dss.length; i++) {
            appendTo(dels, dss[i].clients.get(client) || []);
          }
          merged.clients.set(client, dels);
        }
      });
    }
    sortAndMergeDeleteSet(merged);
    return merged;
  };
  var addToDeleteSet = (ds, client, clock, length3) => {
    setIfUndefined(ds.clients, client, () => (
      /** @type {Array<DeleteItem>} */
      []
    )).push(new DeleteItem(clock, length3));
  };
  var createDeleteSet = () => new DeleteSet();
  var createDeleteSetFromStructStore = (ss) => {
    const ds = createDeleteSet();
    ss.clients.forEach((structs, client) => {
      const dsitems = [];
      for (let i = 0; i < structs.length; i++) {
        const struct = structs[i];
        if (struct.deleted) {
          const clock = struct.id.clock;
          let len = struct.length;
          if (i + 1 < structs.length) {
            for (let next = structs[i + 1]; i + 1 < structs.length && next.deleted; next = structs[++i + 1]) {
              len += next.length;
            }
          }
          dsitems.push(new DeleteItem(clock, len));
        }
      }
      if (dsitems.length > 0) {
        ds.clients.set(client, dsitems);
      }
    });
    return ds;
  };
  var writeDeleteSet = (encoder, ds) => {
    writeVarUint(encoder.restEncoder, ds.clients.size);
    from(ds.clients.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, dsitems]) => {
      encoder.resetDsCurVal();
      writeVarUint(encoder.restEncoder, client);
      const len = dsitems.length;
      writeVarUint(encoder.restEncoder, len);
      for (let i = 0; i < len; i++) {
        const item = dsitems[i];
        encoder.writeDsClock(item.clock);
        encoder.writeDsLen(item.len);
      }
    });
  };
  var readDeleteSet = (decoder) => {
    const ds = new DeleteSet();
    const numClients = readVarUint(decoder.restDecoder);
    for (let i = 0; i < numClients; i++) {
      decoder.resetDsCurVal();
      const client = readVarUint(decoder.restDecoder);
      const numberOfDeletes = readVarUint(decoder.restDecoder);
      if (numberOfDeletes > 0) {
        const dsField = setIfUndefined(ds.clients, client, () => (
          /** @type {Array<DeleteItem>} */
          []
        ));
        for (let i2 = 0; i2 < numberOfDeletes; i2++) {
          dsField.push(new DeleteItem(decoder.readDsClock(), decoder.readDsLen()));
        }
      }
    }
    return ds;
  };
  var readAndApplyDeleteSet = (decoder, transaction, store) => {
    const unappliedDS = new DeleteSet();
    const numClients = readVarUint(decoder.restDecoder);
    for (let i = 0; i < numClients; i++) {
      decoder.resetDsCurVal();
      const client = readVarUint(decoder.restDecoder);
      const numberOfDeletes = readVarUint(decoder.restDecoder);
      const structs = store.clients.get(client) || [];
      const state = getState(store, client);
      for (let i2 = 0; i2 < numberOfDeletes; i2++) {
        const clock = decoder.readDsClock();
        const clockEnd = clock + decoder.readDsLen();
        if (clock < state) {
          if (state < clockEnd) {
            addToDeleteSet(unappliedDS, client, state, clockEnd - state);
          }
          let index = findIndexSS(structs, clock);
          let struct = structs[index];
          if (!struct.deleted && struct.id.clock < clock) {
            structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
            index++;
          }
          while (index < structs.length) {
            struct = structs[index++];
            if (struct.id.clock < clockEnd) {
              if (!struct.deleted) {
                if (clockEnd < struct.id.clock + struct.length) {
                  structs.splice(index, 0, splitItem(transaction, struct, clockEnd - struct.id.clock));
                }
                struct.delete(transaction);
              }
            } else {
              break;
            }
          }
        } else {
          addToDeleteSet(unappliedDS, client, clock, clockEnd - clock);
        }
      }
    }
    if (unappliedDS.clients.size > 0) {
      const ds = new UpdateEncoderV2();
      writeVarUint(ds.restEncoder, 0);
      writeDeleteSet(ds, unappliedDS);
      return ds.toUint8Array();
    }
    return null;
  };
  var generateNewClientId = uint32;
  var Doc = class _Doc extends ObservableV2 {
    /**
     * @param {DocOpts} opts configuration
     */
    constructor({ guid = uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
      super();
      this.gc = gc;
      this.gcFilter = gcFilter;
      this.clientID = generateNewClientId();
      this.guid = guid;
      this.collectionid = collectionid;
      this.share = /* @__PURE__ */ new Map();
      this.store = new StructStore();
      this._transaction = null;
      this._transactionCleanups = [];
      this.subdocs = /* @__PURE__ */ new Set();
      this._item = null;
      this.shouldLoad = shouldLoad;
      this.autoLoad = autoLoad;
      this.meta = meta;
      this.isLoaded = false;
      this.isSynced = false;
      this.isDestroyed = false;
      this.whenLoaded = create4((resolve) => {
        this.on("load", () => {
          this.isLoaded = true;
          resolve(this);
        });
      });
      const provideSyncedPromise = () => create4((resolve) => {
        const eventHandler = (isSynced) => {
          if (isSynced === void 0 || isSynced === true) {
            this.off("sync", eventHandler);
            resolve();
          }
        };
        this.on("sync", eventHandler);
      });
      this.on("sync", (isSynced) => {
        if (isSynced === false && this.isSynced) {
          this.whenSynced = provideSyncedPromise();
        }
        this.isSynced = isSynced === void 0 || isSynced === true;
        if (this.isSynced && !this.isLoaded) {
          this.emit("load", [this]);
        }
      });
      this.whenSynced = provideSyncedPromise();
    }
    /**
     * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
     *
     * `load()` might be used in the future to request any provider to load the most current data.
     *
     * It is safe to call `load()` multiple times.
     */
    load() {
      const item = this._item;
      if (item !== null && !this.shouldLoad) {
        transact(
          /** @type {any} */
          item.parent.doc,
          (transaction) => {
            transaction.subdocsLoaded.add(this);
          },
          null,
          true
        );
      }
      this.shouldLoad = true;
    }
    getSubdocs() {
      return this.subdocs;
    }
    getSubdocGuids() {
      return new Set(from(this.subdocs).map((doc2) => doc2.guid));
    }
    /**
     * Changes that happen inside of a transaction are bundled. This means that
     * the observer fires _after_ the transaction is finished and that all changes
     * that happened inside of the transaction are sent as one message to the
     * other peers.
     *
     * @template T
     * @param {function(Transaction):T} f The function that should be executed as a transaction
     * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
     * @return T
     *
     * @public
     */
    transact(f, origin = null) {
      return transact(this, f, origin);
    }
    /**
     * Define a shared data type.
     *
     * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
     * and do not overwrite each other. I.e.
     * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
     *
     * After this method is called, the type is also available on `ydoc.share.get(name)`.
     *
     * *Best Practices:*
     * Define all types right after the Y.Doc instance is created and store them in a separate object.
     * Also use the typed methods `getText(name)`, `getArray(name)`, ..
     *
     * @template {typeof AbstractType<any>} Type
     * @example
     *   const ydoc = new Y.Doc(..)
     *   const appState = {
     *     document: ydoc.getText('document')
     *     comments: ydoc.getArray('comments')
     *   }
     *
     * @param {string} name
     * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
     * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
     *
     * @public
     */
    get(name, TypeConstructor = (
      /** @type {any} */
      AbstractType
    )) {
      const type = setIfUndefined(this.share, name, () => {
        const t = new TypeConstructor();
        t._integrate(this, null);
        return t;
      });
      const Constr = type.constructor;
      if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
        if (Constr === AbstractType) {
          const t = new TypeConstructor();
          t._map = type._map;
          type._map.forEach(
            /** @param {Item?} n */
            (n) => {
              for (; n !== null; n = n.left) {
                n.parent = t;
              }
            }
          );
          t._start = type._start;
          for (let n = t._start; n !== null; n = n.right) {
            n.parent = t;
          }
          t._length = type._length;
          this.share.set(name, t);
          t._integrate(this, null);
          return (
            /** @type {InstanceType<Type>} */
            t
          );
        } else {
          throw new Error(`Type with the name ${name} has already been defined with a different constructor`);
        }
      }
      return (
        /** @type {InstanceType<Type>} */
        type
      );
    }
    /**
     * @template T
     * @param {string} [name]
     * @return {YArray<T>}
     *
     * @public
     */
    getArray(name = "") {
      return (
        /** @type {YArray<T>} */
        this.get(name, YArray)
      );
    }
    /**
     * @param {string} [name]
     * @return {YText}
     *
     * @public
     */
    getText(name = "") {
      return this.get(name, YText);
    }
    /**
     * @template T
     * @param {string} [name]
     * @return {YMap<T>}
     *
     * @public
     */
    getMap(name = "") {
      return (
        /** @type {YMap<T>} */
        this.get(name, YMap)
      );
    }
    /**
     * @param {string} [name]
     * @return {YXmlElement}
     *
     * @public
     */
    getXmlElement(name = "") {
      return (
        /** @type {YXmlElement<{[key:string]:string}>} */
        this.get(name, YXmlElement)
      );
    }
    /**
     * @param {string} [name]
     * @return {YXmlFragment}
     *
     * @public
     */
    getXmlFragment(name = "") {
      return this.get(name, YXmlFragment);
    }
    /**
     * Converts the entire document into a js object, recursively traversing each yjs type
     * Doesn't log types that have not been defined (using ydoc.getType(..)).
     *
     * @deprecated Do not use this method and rather call toJSON directly on the shared types.
     *
     * @return {Object<string, any>}
     */
    toJSON() {
      const doc2 = {};
      this.share.forEach((value, key) => {
        doc2[key] = value.toJSON();
      });
      return doc2;
    }
    /**
     * Emit `destroy` event and unregister all event handlers.
     */
    destroy() {
      this.isDestroyed = true;
      from(this.subdocs).forEach((subdoc) => subdoc.destroy());
      const item = this._item;
      if (item !== null) {
        this._item = null;
        const content = (
          /** @type {ContentDoc} */
          item.content
        );
        content.doc = new _Doc({ guid: this.guid, ...content.opts, shouldLoad: false });
        content.doc._item = item;
        transact(
          /** @type {any} */
          item.parent.doc,
          (transaction) => {
            const doc2 = content.doc;
            if (!item.deleted) {
              transaction.subdocsAdded.add(doc2);
            }
            transaction.subdocsRemoved.add(this);
          },
          null,
          true
        );
      }
      this.emit("destroyed", [true]);
      this.emit("destroy", [this]);
      super.destroy();
    }
  };
  var DSDecoderV1 = class {
    /**
     * @param {decoding.Decoder} decoder
     */
    constructor(decoder) {
      this.restDecoder = decoder;
    }
    resetDsCurVal() {
    }
    /**
     * @return {number}
     */
    readDsClock() {
      return readVarUint(this.restDecoder);
    }
    /**
     * @return {number}
     */
    readDsLen() {
      return readVarUint(this.restDecoder);
    }
  };
  var UpdateDecoderV1 = class extends DSDecoderV1 {
    /**
     * @return {ID}
     */
    readLeftID() {
      return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
    }
    /**
     * @return {ID}
     */
    readRightID() {
      return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
    }
    /**
     * Read the next client id.
     * Use this in favor of readID whenever possible to reduce the number of objects created.
     */
    readClient() {
      return readVarUint(this.restDecoder);
    }
    /**
     * @return {number} info An unsigned 8-bit integer
     */
    readInfo() {
      return readUint8(this.restDecoder);
    }
    /**
     * @return {string}
     */
    readString() {
      return readVarString(this.restDecoder);
    }
    /**
     * @return {boolean} isKey
     */
    readParentInfo() {
      return readVarUint(this.restDecoder) === 1;
    }
    /**
     * @return {number} info An unsigned 8-bit integer
     */
    readTypeRef() {
      return readVarUint(this.restDecoder);
    }
    /**
     * Write len of a struct - well suited for Opt RLE encoder.
     *
     * @return {number} len
     */
    readLen() {
      return readVarUint(this.restDecoder);
    }
    /**
     * @return {any}
     */
    readAny() {
      return readAny(this.restDecoder);
    }
    /**
     * @return {Uint8Array}
     */
    readBuf() {
      return copyUint8Array(readVarUint8Array(this.restDecoder));
    }
    /**
     * Legacy implementation uses JSON parse. We use any-decoding in v2.
     *
     * @return {any}
     */
    readJSON() {
      return JSON.parse(readVarString(this.restDecoder));
    }
    /**
     * @return {string}
     */
    readKey() {
      return readVarString(this.restDecoder);
    }
  };
  var DSDecoderV2 = class {
    /**
     * @param {decoding.Decoder} decoder
     */
    constructor(decoder) {
      this.dsCurrVal = 0;
      this.restDecoder = decoder;
    }
    resetDsCurVal() {
      this.dsCurrVal = 0;
    }
    /**
     * @return {number}
     */
    readDsClock() {
      this.dsCurrVal += readVarUint(this.restDecoder);
      return this.dsCurrVal;
    }
    /**
     * @return {number}
     */
    readDsLen() {
      const diff = readVarUint(this.restDecoder) + 1;
      this.dsCurrVal += diff;
      return diff;
    }
  };
  var UpdateDecoderV2 = class extends DSDecoderV2 {
    /**
     * @param {decoding.Decoder} decoder
     */
    constructor(decoder) {
      super(decoder);
      this.keys = [];
      readVarUint(decoder);
      this.keyClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
      this.clientDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
      this.leftClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
      this.rightClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
      this.infoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
      this.stringDecoder = new StringDecoder(readVarUint8Array(decoder));
      this.parentInfoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
      this.typeRefDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
      this.lenDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
    }
    /**
     * @return {ID}
     */
    readLeftID() {
      return new ID(this.clientDecoder.read(), this.leftClockDecoder.read());
    }
    /**
     * @return {ID}
     */
    readRightID() {
      return new ID(this.clientDecoder.read(), this.rightClockDecoder.read());
    }
    /**
     * Read the next client id.
     * Use this in favor of readID whenever possible to reduce the number of objects created.
     */
    readClient() {
      return this.clientDecoder.read();
    }
    /**
     * @return {number} info An unsigned 8-bit integer
     */
    readInfo() {
      return (
        /** @type {number} */
        this.infoDecoder.read()
      );
    }
    /**
     * @return {string}
     */
    readString() {
      return this.stringDecoder.read();
    }
    /**
     * @return {boolean}
     */
    readParentInfo() {
      return this.parentInfoDecoder.read() === 1;
    }
    /**
     * @return {number} An unsigned 8-bit integer
     */
    readTypeRef() {
      return this.typeRefDecoder.read();
    }
    /**
     * Write len of a struct - well suited for Opt RLE encoder.
     *
     * @return {number}
     */
    readLen() {
      return this.lenDecoder.read();
    }
    /**
     * @return {any}
     */
    readAny() {
      return readAny(this.restDecoder);
    }
    /**
     * @return {Uint8Array}
     */
    readBuf() {
      return readVarUint8Array(this.restDecoder);
    }
    /**
     * This is mainly here for legacy purposes.
     *
     * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
     *
     * @return {any}
     */
    readJSON() {
      return readAny(this.restDecoder);
    }
    /**
     * @return {string}
     */
    readKey() {
      const keyClock = this.keyClockDecoder.read();
      if (keyClock < this.keys.length) {
        return this.keys[keyClock];
      } else {
        const key = this.stringDecoder.read();
        this.keys.push(key);
        return key;
      }
    }
  };
  var DSEncoderV1 = class {
    constructor() {
      this.restEncoder = createEncoder();
    }
    toUint8Array() {
      return toUint8Array(this.restEncoder);
    }
    resetDsCurVal() {
    }
    /**
     * @param {number} clock
     */
    writeDsClock(clock) {
      writeVarUint(this.restEncoder, clock);
    }
    /**
     * @param {number} len
     */
    writeDsLen(len) {
      writeVarUint(this.restEncoder, len);
    }
  };
  var UpdateEncoderV1 = class extends DSEncoderV1 {
    /**
     * @param {ID} id
     */
    writeLeftID(id2) {
      writeVarUint(this.restEncoder, id2.client);
      writeVarUint(this.restEncoder, id2.clock);
    }
    /**
     * @param {ID} id
     */
    writeRightID(id2) {
      writeVarUint(this.restEncoder, id2.client);
      writeVarUint(this.restEncoder, id2.clock);
    }
    /**
     * Use writeClient and writeClock instead of writeID if possible.
     * @param {number} client
     */
    writeClient(client) {
      writeVarUint(this.restEncoder, client);
    }
    /**
     * @param {number} info An unsigned 8-bit integer
     */
    writeInfo(info) {
      writeUint8(this.restEncoder, info);
    }
    /**
     * @param {string} s
     */
    writeString(s) {
      writeVarString(this.restEncoder, s);
    }
    /**
     * @param {boolean} isYKey
     */
    writeParentInfo(isYKey) {
      writeVarUint(this.restEncoder, isYKey ? 1 : 0);
    }
    /**
     * @param {number} info An unsigned 8-bit integer
     */
    writeTypeRef(info) {
      writeVarUint(this.restEncoder, info);
    }
    /**
     * Write len of a struct - well suited for Opt RLE encoder.
     *
     * @param {number} len
     */
    writeLen(len) {
      writeVarUint(this.restEncoder, len);
    }
    /**
     * @param {any} any
     */
    writeAny(any2) {
      writeAny(this.restEncoder, any2);
    }
    /**
     * @param {Uint8Array} buf
     */
    writeBuf(buf) {
      writeVarUint8Array(this.restEncoder, buf);
    }
    /**
     * @param {any} embed
     */
    writeJSON(embed) {
      writeVarString(this.restEncoder, JSON.stringify(embed));
    }
    /**
     * @param {string} key
     */
    writeKey(key) {
      writeVarString(this.restEncoder, key);
    }
  };
  var DSEncoderV2 = class {
    constructor() {
      this.restEncoder = createEncoder();
      this.dsCurrVal = 0;
    }
    toUint8Array() {
      return toUint8Array(this.restEncoder);
    }
    resetDsCurVal() {
      this.dsCurrVal = 0;
    }
    /**
     * @param {number} clock
     */
    writeDsClock(clock) {
      const diff = clock - this.dsCurrVal;
      this.dsCurrVal = clock;
      writeVarUint(this.restEncoder, diff);
    }
    /**
     * @param {number} len
     */
    writeDsLen(len) {
      if (len === 0) {
        unexpectedCase();
      }
      writeVarUint(this.restEncoder, len - 1);
      this.dsCurrVal += len;
    }
  };
  var UpdateEncoderV2 = class extends DSEncoderV2 {
    constructor() {
      super();
      this.keyMap = /* @__PURE__ */ new Map();
      this.keyClock = 0;
      this.keyClockEncoder = new IntDiffOptRleEncoder();
      this.clientEncoder = new UintOptRleEncoder();
      this.leftClockEncoder = new IntDiffOptRleEncoder();
      this.rightClockEncoder = new IntDiffOptRleEncoder();
      this.infoEncoder = new RleEncoder(writeUint8);
      this.stringEncoder = new StringEncoder();
      this.parentInfoEncoder = new RleEncoder(writeUint8);
      this.typeRefEncoder = new UintOptRleEncoder();
      this.lenEncoder = new UintOptRleEncoder();
    }
    toUint8Array() {
      const encoder = createEncoder();
      writeVarUint(encoder, 0);
      writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
      writeVarUint8Array(encoder, toUint8Array(this.infoEncoder));
      writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
      writeVarUint8Array(encoder, toUint8Array(this.parentInfoEncoder));
      writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
      writeUint8Array(encoder, toUint8Array(this.restEncoder));
      return toUint8Array(encoder);
    }
    /**
     * @param {ID} id
     */
    writeLeftID(id2) {
      this.clientEncoder.write(id2.client);
      this.leftClockEncoder.write(id2.clock);
    }
    /**
     * @param {ID} id
     */
    writeRightID(id2) {
      this.clientEncoder.write(id2.client);
      this.rightClockEncoder.write(id2.clock);
    }
    /**
     * @param {number} client
     */
    writeClient(client) {
      this.clientEncoder.write(client);
    }
    /**
     * @param {number} info An unsigned 8-bit integer
     */
    writeInfo(info) {
      this.infoEncoder.write(info);
    }
    /**
     * @param {string} s
     */
    writeString(s) {
      this.stringEncoder.write(s);
    }
    /**
     * @param {boolean} isYKey
     */
    writeParentInfo(isYKey) {
      this.parentInfoEncoder.write(isYKey ? 1 : 0);
    }
    /**
     * @param {number} info An unsigned 8-bit integer
     */
    writeTypeRef(info) {
      this.typeRefEncoder.write(info);
    }
    /**
     * Write len of a struct - well suited for Opt RLE encoder.
     *
     * @param {number} len
     */
    writeLen(len) {
      this.lenEncoder.write(len);
    }
    /**
     * @param {any} any
     */
    writeAny(any2) {
      writeAny(this.restEncoder, any2);
    }
    /**
     * @param {Uint8Array} buf
     */
    writeBuf(buf) {
      writeVarUint8Array(this.restEncoder, buf);
    }
    /**
     * This is mainly here for legacy purposes.
     *
     * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
     *
     * @param {any} embed
     */
    writeJSON(embed) {
      writeAny(this.restEncoder, embed);
    }
    /**
     * Property keys are often reused. For example, in y-prosemirror the key `bold` might
     * occur very often. For a 3d application, the key `position` might occur very often.
     *
     * We cache these keys in a Map and refer to them via a unique number.
     *
     * @param {string} key
     */
    writeKey(key) {
      const clock = this.keyMap.get(key);
      if (clock === void 0) {
        this.keyClockEncoder.write(this.keyClock++);
        this.stringEncoder.write(key);
      } else {
        this.keyClockEncoder.write(clock);
      }
    }
  };
  var writeStructs = (encoder, structs, client, clock) => {
    clock = max(clock, structs[0].id.clock);
    const startNewStructs = findIndexSS(structs, clock);
    writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
    encoder.writeClient(client);
    writeVarUint(encoder.restEncoder, clock);
    const firstStruct = structs[startNewStructs];
    firstStruct.write(encoder, clock - firstStruct.id.clock);
    for (let i = startNewStructs + 1; i < structs.length; i++) {
      structs[i].write(encoder, 0);
    }
  };
  var writeClientsStructs = (encoder, store, _sm) => {
    const sm = /* @__PURE__ */ new Map();
    _sm.forEach((clock, client) => {
      if (getState(store, client) > clock) {
        sm.set(client, clock);
      }
    });
    getStateVector(store).forEach((_clock, client) => {
      if (!_sm.has(client)) {
        sm.set(client, 0);
      }
    });
    writeVarUint(encoder.restEncoder, sm.size);
    from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
      writeStructs(
        encoder,
        /** @type {Array<GC|Item>} */
        store.clients.get(client),
        client,
        clock
      );
    });
  };
  var readClientsStructRefs = (decoder, doc2) => {
    const clientRefs = create();
    const numOfStateUpdates = readVarUint(decoder.restDecoder);
    for (let i = 0; i < numOfStateUpdates; i++) {
      const numberOfStructs = readVarUint(decoder.restDecoder);
      const refs = new Array(numberOfStructs);
      const client = decoder.readClient();
      let clock = readVarUint(decoder.restDecoder);
      clientRefs.set(client, { i: 0, refs });
      for (let i2 = 0; i2 < numberOfStructs; i2++) {
        const info = decoder.readInfo();
        switch (BITS5 & info) {
          case 0: {
            const len = decoder.readLen();
            refs[i2] = new GC(createID(client, clock), len);
            clock += len;
            break;
          }
          case 10: {
            const len = readVarUint(decoder.restDecoder);
            refs[i2] = new Skip(createID(client, clock), len);
            clock += len;
            break;
          }
          default: {
            const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
            const struct = new Item(
              createID(client, clock),
              null,
              // left
              (info & BIT8) === BIT8 ? decoder.readLeftID() : null,
              // origin
              null,
              // right
              (info & BIT7) === BIT7 ? decoder.readRightID() : null,
              // right origin
              cantCopyParentInfo ? decoder.readParentInfo() ? doc2.get(decoder.readString()) : decoder.readLeftID() : null,
              // parent
              cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null,
              // parentSub
              readItemContent(decoder, info)
              // item content
            );
            refs[i2] = struct;
            clock += struct.length;
          }
        }
      }
    }
    return clientRefs;
  };
  var integrateStructs = (transaction, store, clientsStructRefs) => {
    const stack = [];
    let clientsStructRefsIds = from(clientsStructRefs.keys()).sort((a, b) => a - b);
    if (clientsStructRefsIds.length === 0) {
      return null;
    }
    const getNextStructTarget = () => {
      if (clientsStructRefsIds.length === 0) {
        return null;
      }
      let nextStructsTarget = (
        /** @type {{i:number,refs:Array<GC|Item>}} */
        clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1])
      );
      while (nextStructsTarget.refs.length === nextStructsTarget.i) {
        clientsStructRefsIds.pop();
        if (clientsStructRefsIds.length > 0) {
          nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */
          clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]);
        } else {
          return null;
        }
      }
      return nextStructsTarget;
    };
    let curStructsTarget = getNextStructTarget();
    if (curStructsTarget === null) {
      return null;
    }
    const restStructs = new StructStore();
    const missingSV = /* @__PURE__ */ new Map();
    const updateMissingSv = (client, clock) => {
      const mclock = missingSV.get(client);
      if (mclock == null || mclock > clock) {
        missingSV.set(client, clock);
      }
    };
    let stackHead = (
      /** @type {any} */
      curStructsTarget.refs[
        /** @type {any} */
        curStructsTarget.i++
      ]
    );
    const state = /* @__PURE__ */ new Map();
    const addStackToRestSS = () => {
      for (const item of stack) {
        const client = item.id.client;
        const inapplicableItems = clientsStructRefs.get(client);
        if (inapplicableItems) {
          inapplicableItems.i--;
          restStructs.clients.set(client, inapplicableItems.refs.slice(inapplicableItems.i));
          clientsStructRefs.delete(client);
          inapplicableItems.i = 0;
          inapplicableItems.refs = [];
        } else {
          restStructs.clients.set(client, [item]);
        }
        clientsStructRefsIds = clientsStructRefsIds.filter((c) => c !== client);
      }
      stack.length = 0;
    };
    while (true) {
      if (stackHead.constructor !== Skip) {
        const localClock = setIfUndefined(state, stackHead.id.client, () => getState(store, stackHead.id.client));
        const offset = localClock - stackHead.id.clock;
        if (offset < 0) {
          stack.push(stackHead);
          updateMissingSv(stackHead.id.client, stackHead.id.clock - 1);
          addStackToRestSS();
        } else {
          const missing = stackHead.getMissing(transaction, store);
          if (missing !== null) {
            stack.push(stackHead);
            const structRefs = clientsStructRefs.get(
              /** @type {number} */
              missing
            ) || { refs: [], i: 0 };
            if (structRefs.refs.length === structRefs.i) {
              updateMissingSv(
                /** @type {number} */
                missing,
                getState(store, missing)
              );
              addStackToRestSS();
            } else {
              stackHead = structRefs.refs[structRefs.i++];
              continue;
            }
          } else if (offset === 0 || offset < stackHead.length) {
            stackHead.integrate(transaction, offset);
            state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
          }
        }
      }
      if (stack.length > 0) {
        stackHead = /** @type {GC|Item} */
        stack.pop();
      } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
        stackHead = /** @type {GC|Item} */
        curStructsTarget.refs[curStructsTarget.i++];
      } else {
        curStructsTarget = getNextStructTarget();
        if (curStructsTarget === null) {
          break;
        } else {
          stackHead = /** @type {GC|Item} */
          curStructsTarget.refs[curStructsTarget.i++];
        }
      }
    }
    if (restStructs.clients.size > 0) {
      const encoder = new UpdateEncoderV2();
      writeClientsStructs(encoder, restStructs, /* @__PURE__ */ new Map());
      writeVarUint(encoder.restEncoder, 0);
      return { missing: missingSV, update: encoder.toUint8Array() };
    }
    return null;
  };
  var writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);
  var readUpdateV2 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2(decoder)) => transact(ydoc, (transaction) => {
    transaction.local = false;
    let retry = false;
    const doc2 = transaction.doc;
    const store = doc2.store;
    const ss = readClientsStructRefs(structDecoder, doc2);
    const restStructs = integrateStructs(transaction, store, ss);
    const pending = store.pendingStructs;
    if (pending) {
      for (const [client, clock] of pending.missing) {
        if (clock < getState(store, client)) {
          retry = true;
          break;
        }
      }
      if (restStructs) {
        for (const [client, clock] of restStructs.missing) {
          const mclock = pending.missing.get(client);
          if (mclock == null || mclock > clock) {
            pending.missing.set(client, clock);
          }
        }
        pending.update = mergeUpdatesV2([pending.update, restStructs.update]);
      }
    } else {
      store.pendingStructs = restStructs;
    }
    const dsRest = readAndApplyDeleteSet(structDecoder, transaction, store);
    if (store.pendingDs) {
      const pendingDSUpdate = new UpdateDecoderV2(createDecoder(store.pendingDs));
      readVarUint(pendingDSUpdate.restDecoder);
      const dsRest2 = readAndApplyDeleteSet(pendingDSUpdate, transaction, store);
      if (dsRest && dsRest2) {
        store.pendingDs = mergeUpdatesV2([dsRest, dsRest2]);
      } else {
        store.pendingDs = dsRest || dsRest2;
      }
    } else {
      store.pendingDs = dsRest;
    }
    if (retry) {
      const update = (
        /** @type {{update: Uint8Array}} */
        store.pendingStructs.update
      );
      store.pendingStructs = null;
      applyUpdateV2(transaction.doc, update);
    }
  }, transactionOrigin, false);
  var applyUpdateV2 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2) => {
    const decoder = createDecoder(update);
    readUpdateV2(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
  };
  var applyUpdate = (ydoc, update, transactionOrigin) => applyUpdateV2(ydoc, update, transactionOrigin, UpdateDecoderV1);
  var writeStateAsUpdate = (encoder, doc2, targetStateVector = /* @__PURE__ */ new Map()) => {
    writeClientsStructs(encoder, doc2.store, targetStateVector);
    writeDeleteSet(encoder, createDeleteSetFromStructStore(doc2.store));
  };
  var encodeStateAsUpdateV2 = (doc2, encodedTargetStateVector = new Uint8Array([0]), encoder = new UpdateEncoderV2()) => {
    const targetStateVector = decodeStateVector(encodedTargetStateVector);
    writeStateAsUpdate(encoder, doc2, targetStateVector);
    const updates = [encoder.toUint8Array()];
    if (doc2.store.pendingDs) {
      updates.push(doc2.store.pendingDs);
    }
    if (doc2.store.pendingStructs) {
      updates.push(diffUpdateV2(doc2.store.pendingStructs.update, encodedTargetStateVector));
    }
    if (updates.length > 1) {
      if (encoder.constructor === UpdateEncoderV1) {
        return mergeUpdates(updates.map((update, i) => i === 0 ? update : convertUpdateFormatV2ToV1(update)));
      } else if (encoder.constructor === UpdateEncoderV2) {
        return mergeUpdatesV2(updates);
      }
    }
    return updates[0];
  };
  var encodeStateAsUpdate = (doc2, encodedTargetStateVector) => encodeStateAsUpdateV2(doc2, encodedTargetStateVector, new UpdateEncoderV1());
  var readStateVector = (decoder) => {
    const ss = /* @__PURE__ */ new Map();
    const ssLength = readVarUint(decoder.restDecoder);
    for (let i = 0; i < ssLength; i++) {
      const client = readVarUint(decoder.restDecoder);
      const clock = readVarUint(decoder.restDecoder);
      ss.set(client, clock);
    }
    return ss;
  };
  var decodeStateVector = (decodedState) => readStateVector(new DSDecoderV1(createDecoder(decodedState)));
  var writeStateVector = (encoder, sv) => {
    writeVarUint(encoder.restEncoder, sv.size);
    from(sv.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
      writeVarUint(encoder.restEncoder, client);
      writeVarUint(encoder.restEncoder, clock);
    });
    return encoder;
  };
  var writeDocumentStateVector = (encoder, doc2) => writeStateVector(encoder, getStateVector(doc2.store));
  var encodeStateVectorV2 = (doc2, encoder = new DSEncoderV2()) => {
    if (doc2 instanceof Map) {
      writeStateVector(encoder, doc2);
    } else {
      writeDocumentStateVector(encoder, doc2);
    }
    return encoder.toUint8Array();
  };
  var encodeStateVector = (doc2) => encodeStateVectorV2(doc2, new DSEncoderV1());
  var EventHandler = class {
    constructor() {
      this.l = [];
    }
  };
  var createEventHandler = () => new EventHandler();
  var addEventHandlerListener = (eventHandler, f) => eventHandler.l.push(f);
  var removeEventHandlerListener = (eventHandler, f) => {
    const l = eventHandler.l;
    const len = l.length;
    eventHandler.l = l.filter((g) => f !== g);
    if (len === eventHandler.l.length) {
      console.error("[yjs] Tried to remove event handler that doesn't exist.");
    }
  };
  var callEventHandlerListeners = (eventHandler, arg0, arg1) => callAll(eventHandler.l, [arg0, arg1]);
  var ID = class {
    /**
     * @param {number} client client id
     * @param {number} clock unique per client id, continuous number
     */
    constructor(client, clock) {
      this.client = client;
      this.clock = clock;
    }
  };
  var compareIDs = (a, b) => a === b || a !== null && b !== null && a.client === b.client && a.clock === b.clock;
  var createID = (client, clock) => new ID(client, clock);
  var findRootTypeKey = (type) => {
    for (const [key, value] of type.doc.share.entries()) {
      if (value === type) {
        return key;
      }
    }
    throw unexpectedCase();
  };
  var RelativePosition = class {
    /**
     * @param {ID|null} type
     * @param {string|null} tname
     * @param {ID|null} item
     * @param {number} assoc
     */
    constructor(type, tname, item, assoc = 0) {
      this.type = type;
      this.tname = tname;
      this.item = item;
      this.assoc = assoc;
    }
  };
  var createRelativePositionFromJSON = (json) => new RelativePosition(json.type == null ? null : createID(json.type.client, json.type.clock), json.tname ?? null, json.item == null ? null : createID(json.item.client, json.item.clock), json.assoc == null ? 0 : json.assoc);
  var AbsolutePosition = class {
    /**
     * @param {AbstractType<any>} type
     * @param {number} index
     * @param {number} [assoc]
     */
    constructor(type, index, assoc = 0) {
      this.type = type;
      this.index = index;
      this.assoc = assoc;
    }
  };
  var createAbsolutePosition = (type, index, assoc = 0) => new AbsolutePosition(type, index, assoc);
  var createRelativePosition = (type, item, assoc) => {
    let typeid = null;
    let tname = null;
    if (type._item === null) {
      tname = findRootTypeKey(type);
    } else {
      typeid = createID(type._item.id.client, type._item.id.clock);
    }
    return new RelativePosition(typeid, tname, item, assoc);
  };
  var createRelativePositionFromTypeIndex = (type, index, assoc = 0) => {
    let t = type._start;
    if (assoc < 0) {
      if (index === 0) {
        return createRelativePosition(type, null, assoc);
      }
      index--;
    }
    while (t !== null) {
      if (!t.deleted && t.countable) {
        if (t.length > index) {
          return createRelativePosition(type, createID(t.id.client, t.id.clock + index), assoc);
        }
        index -= t.length;
      }
      if (t.right === null && assoc < 0) {
        return createRelativePosition(type, t.lastId, assoc);
      }
      t = t.right;
    }
    return createRelativePosition(type, null, assoc);
  };
  var getItemWithOffset = (store, id2) => {
    const item = getItem(store, id2);
    const diff = id2.clock - item.id.clock;
    return {
      item,
      diff
    };
  };
  var createAbsolutePositionFromRelativePosition = (rpos, doc2, followUndoneDeletions = true) => {
    const store = doc2.store;
    const rightID = rpos.item;
    const typeID = rpos.type;
    const tname = rpos.tname;
    const assoc = rpos.assoc;
    let type = null;
    let index = 0;
    if (rightID !== null) {
      if (getState(store, rightID.client) <= rightID.clock) {
        return null;
      }
      const res = followUndoneDeletions ? followRedone(store, rightID) : getItemWithOffset(store, rightID);
      const right = res.item;
      if (!(right instanceof Item)) {
        return null;
      }
      type = /** @type {AbstractType<any>} */
      right.parent;
      if (type._item === null || !type._item.deleted) {
        index = right.deleted || !right.countable ? 0 : res.diff + (assoc >= 0 ? 0 : 1);
        let n = right.left;
        while (n !== null) {
          if (!n.deleted && n.countable) {
            index += n.length;
          }
          n = n.left;
        }
      }
    } else {
      if (tname !== null) {
        type = doc2.get(tname);
      } else if (typeID !== null) {
        if (getState(store, typeID.client) <= typeID.clock) {
          return null;
        }
        const { item } = followUndoneDeletions ? followRedone(store, typeID) : { item: getItem(store, typeID) };
        if (item instanceof Item && item.content instanceof ContentType) {
          type = item.content.type;
        } else {
          return null;
        }
      } else {
        throw unexpectedCase();
      }
      if (assoc >= 0) {
        index = type._length;
      } else {
        index = 0;
      }
    }
    return createAbsolutePosition(type, index, rpos.assoc);
  };
  var compareRelativePositions = (a, b) => a === b || a !== null && b !== null && a.tname === b.tname && compareIDs(a.item, b.item) && compareIDs(a.type, b.type) && a.assoc === b.assoc;
  var Snapshot = class {
    /**
     * @param {DeleteSet} ds
     * @param {Map<number,number>} sv state map
     */
    constructor(ds, sv) {
      this.ds = ds;
      this.sv = sv;
    }
  };
  var createSnapshot = (ds, sm) => new Snapshot(ds, sm);
  var emptySnapshot = createSnapshot(createDeleteSet(), /* @__PURE__ */ new Map());
  var isVisible = (item, snapshot) => snapshot === void 0 ? !item.deleted : snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot.ds, item.id);
  var splitSnapshotAffectedStructs = (transaction, snapshot) => {
    const meta = setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, create2);
    const store = transaction.doc.store;
    if (!meta.has(snapshot)) {
      snapshot.sv.forEach((clock, client) => {
        if (clock < getState(store, client)) {
          getItemCleanStart(transaction, createID(client, clock));
        }
      });
      iterateDeletedStructs(transaction, snapshot.ds, (_item) => {
      });
      meta.add(snapshot);
    }
  };
  var StructStore = class {
    constructor() {
      this.clients = /* @__PURE__ */ new Map();
      this.pendingStructs = null;
      this.pendingDs = null;
    }
  };
  var getStateVector = (store) => {
    const sm = /* @__PURE__ */ new Map();
    store.clients.forEach((structs, client) => {
      const struct = structs[structs.length - 1];
      sm.set(client, struct.id.clock + struct.length);
    });
    return sm;
  };
  var getState = (store, client) => {
    const structs = store.clients.get(client);
    if (structs === void 0) {
      return 0;
    }
    const lastStruct = structs[structs.length - 1];
    return lastStruct.id.clock + lastStruct.length;
  };
  var addStruct = (store, struct) => {
    let structs = store.clients.get(struct.id.client);
    if (structs === void 0) {
      structs = [];
      store.clients.set(struct.id.client, structs);
    } else {
      const lastStruct = structs[structs.length - 1];
      if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
        throw unexpectedCase();
      }
    }
    structs.push(struct);
  };
  var findIndexSS = (structs, clock) => {
    let left = 0;
    let right = structs.length - 1;
    let mid = structs[right];
    let midclock = mid.id.clock;
    if (midclock === clock) {
      return right;
    }
    let midindex = floor(clock / (midclock + mid.length - 1) * right);
    while (left <= right) {
      mid = structs[midindex];
      midclock = mid.id.clock;
      if (midclock <= clock) {
        if (clock < midclock + mid.length) {
          return midindex;
        }
        left = midindex + 1;
      } else {
        right = midindex - 1;
      }
      midindex = floor((left + right) / 2);
    }
    throw unexpectedCase();
  };
  var find = (store, id2) => {
    const structs = store.clients.get(id2.client);
    return structs[findIndexSS(structs, id2.clock)];
  };
  var getItem = (
    /** @type {function(StructStore,ID):Item} */
    find
  );
  var findIndexCleanStart = (transaction, structs, clock) => {
    const index = findIndexSS(structs, clock);
    const struct = structs[index];
    if (struct.id.clock < clock && struct instanceof Item) {
      structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
      return index + 1;
    }
    return index;
  };
  var getItemCleanStart = (transaction, id2) => {
    const structs = (
      /** @type {Array<Item>} */
      transaction.doc.store.clients.get(id2.client)
    );
    return structs[findIndexCleanStart(transaction, structs, id2.clock)];
  };
  var getItemCleanEnd = (transaction, store, id2) => {
    const structs = store.clients.get(id2.client);
    const index = findIndexSS(structs, id2.clock);
    const struct = structs[index];
    if (id2.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
      structs.splice(index + 1, 0, splitItem(transaction, struct, id2.clock - struct.id.clock + 1));
    }
    return struct;
  };
  var replaceStruct = (store, struct, newStruct) => {
    const structs = (
      /** @type {Array<GC|Item>} */
      store.clients.get(struct.id.client)
    );
    structs[findIndexSS(structs, struct.id.clock)] = newStruct;
  };
  var iterateStructs = (transaction, structs, clockStart, len, f) => {
    if (len === 0) {
      return;
    }
    const clockEnd = clockStart + len;
    let index = findIndexCleanStart(transaction, structs, clockStart);
    let struct;
    do {
      struct = structs[index++];
      if (clockEnd < struct.id.clock + struct.length) {
        findIndexCleanStart(transaction, structs, clockEnd);
      }
      f(struct);
    } while (index < structs.length && structs[index].id.clock < clockEnd);
  };
  var Transaction = class {
    /**
     * @param {Doc} doc
     * @param {any} origin
     * @param {boolean} local
     */
    constructor(doc2, origin, local) {
      this.doc = doc2;
      this.deleteSet = new DeleteSet();
      this.beforeState = getStateVector(doc2.store);
      this.afterState = /* @__PURE__ */ new Map();
      this.changed = /* @__PURE__ */ new Map();
      this.changedParentTypes = /* @__PURE__ */ new Map();
      this._mergeStructs = [];
      this.origin = origin;
      this.meta = /* @__PURE__ */ new Map();
      this.local = local;
      this.subdocsAdded = /* @__PURE__ */ new Set();
      this.subdocsRemoved = /* @__PURE__ */ new Set();
      this.subdocsLoaded = /* @__PURE__ */ new Set();
      this._needFormattingCleanup = false;
    }
  };
  var writeUpdateMessageFromTransaction = (encoder, transaction) => {
    if (transaction.deleteSet.clients.size === 0 && !any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
      return false;
    }
    sortAndMergeDeleteSet(transaction.deleteSet);
    writeStructsFromTransaction(encoder, transaction);
    writeDeleteSet(encoder, transaction.deleteSet);
    return true;
  };
  var addChangedTypeToTransaction = (transaction, type, parentSub) => {
    const item = type._item;
    if (item === null || item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted) {
      setIfUndefined(transaction.changed, type, create2).add(parentSub);
    }
  };
  var tryToMergeWithLefts = (structs, pos) => {
    let right = structs[pos];
    let left = structs[pos - 1];
    let i = pos;
    for (; i > 0; right = left, left = structs[--i - 1]) {
      if (left.deleted === right.deleted && left.constructor === right.constructor) {
        if (left.mergeWith(right)) {
          if (right instanceof Item && right.parentSub !== null && /** @type {AbstractType<any>} */
          right.parent._map.get(right.parentSub) === right) {
            right.parent._map.set(
              right.parentSub,
              /** @type {Item} */
              left
            );
          }
          continue;
        }
      }
      break;
    }
    const merged = pos - i;
    if (merged) {
      structs.splice(pos + 1 - merged, merged);
    }
    return merged;
  };
  var tryGcDeleteSet = (ds, store, gcFilter) => {
    for (const [client, deleteItems] of ds.clients.entries()) {
      const structs = (
        /** @type {Array<GC|Item>} */
        store.clients.get(client)
      );
      for (let di = deleteItems.length - 1; di >= 0; di--) {
        const deleteItem = deleteItems[di];
        const endDeleteItemClock = deleteItem.clock + deleteItem.len;
        for (let si = findIndexSS(structs, deleteItem.clock), struct = structs[si]; si < structs.length && struct.id.clock < endDeleteItemClock; struct = structs[++si]) {
          const struct2 = structs[si];
          if (deleteItem.clock + deleteItem.len <= struct2.id.clock) {
            break;
          }
          if (struct2 instanceof Item && struct2.deleted && !struct2.keep && gcFilter(struct2)) {
            struct2.gc(store, false);
          }
        }
      }
    }
  };
  var tryMergeDeleteSet = (ds, store) => {
    ds.clients.forEach((deleteItems, client) => {
      const structs = (
        /** @type {Array<GC|Item>} */
        store.clients.get(client)
      );
      for (let di = deleteItems.length - 1; di >= 0; di--) {
        const deleteItem = deleteItems[di];
        const mostRightIndexToCheck = min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
        for (let si = mostRightIndexToCheck, struct = structs[si]; si > 0 && struct.id.clock >= deleteItem.clock; struct = structs[si]) {
          si -= 1 + tryToMergeWithLefts(structs, si);
        }
      }
    });
  };
  var cleanupTransactions = (transactionCleanups, i) => {
    if (i < transactionCleanups.length) {
      const transaction = transactionCleanups[i];
      const doc2 = transaction.doc;
      const store = doc2.store;
      const ds = transaction.deleteSet;
      const mergeStructs = transaction._mergeStructs;
      try {
        sortAndMergeDeleteSet(ds);
        transaction.afterState = getStateVector(transaction.doc.store);
        doc2.emit("beforeObserverCalls", [transaction, doc2]);
        const fs = [];
        transaction.changed.forEach(
          (subs, itemtype) => fs.push(() => {
            if (itemtype._item === null || !itemtype._item.deleted) {
              itemtype._callObserver(transaction, subs);
            }
          })
        );
        fs.push(() => {
          transaction.changedParentTypes.forEach((events, type) => {
            if (type._dEH.l.length > 0 && (type._item === null || !type._item.deleted)) {
              events = events.filter(
                (event) => event.target._item === null || !event.target._item.deleted
              );
              events.forEach((event) => {
                event.currentTarget = type;
                event._path = null;
              });
              events.sort((event1, event2) => event1.path.length - event2.path.length);
              callEventHandlerListeners(type._dEH, events, transaction);
            }
          });
        });
        fs.push(() => doc2.emit("afterTransaction", [transaction, doc2]));
        callAll(fs, []);
        if (transaction._needFormattingCleanup) {
          cleanupYTextAfterTransaction(transaction);
        }
      } finally {
        if (doc2.gc) {
          tryGcDeleteSet(ds, store, doc2.gcFilter);
        }
        tryMergeDeleteSet(ds, store);
        transaction.afterState.forEach((clock, client) => {
          const beforeClock = transaction.beforeState.get(client) || 0;
          if (beforeClock !== clock) {
            const structs = (
              /** @type {Array<GC|Item>} */
              store.clients.get(client)
            );
            const firstChangePos = max(findIndexSS(structs, beforeClock), 1);
            for (let i2 = structs.length - 1; i2 >= firstChangePos; ) {
              i2 -= 1 + tryToMergeWithLefts(structs, i2);
            }
          }
        });
        for (let i2 = mergeStructs.length - 1; i2 >= 0; i2--) {
          const { client, clock } = mergeStructs[i2].id;
          const structs = (
            /** @type {Array<GC|Item>} */
            store.clients.get(client)
          );
          const replacedStructPos = findIndexSS(structs, clock);
          if (replacedStructPos + 1 < structs.length) {
            if (tryToMergeWithLefts(structs, replacedStructPos + 1) > 1) {
              continue;
            }
          }
          if (replacedStructPos > 0) {
            tryToMergeWithLefts(structs, replacedStructPos);
          }
        }
        if (!transaction.local && transaction.afterState.get(doc2.clientID) !== transaction.beforeState.get(doc2.clientID)) {
          print(ORANGE, BOLD, "[yjs] ", UNBOLD, RED, "Changed the client-id because another client seems to be using it.");
          doc2.clientID = generateNewClientId();
        }
        doc2.emit("afterTransactionCleanup", [transaction, doc2]);
        if (doc2._observers.has("update")) {
          const encoder = new UpdateEncoderV1();
          const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
          if (hasContent2) {
            doc2.emit("update", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
          }
        }
        if (doc2._observers.has("updateV2")) {
          const encoder = new UpdateEncoderV2();
          const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
          if (hasContent2) {
            doc2.emit("updateV2", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
          }
        }
        const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
        if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
          subdocsAdded.forEach((subdoc) => {
            subdoc.clientID = doc2.clientID;
            if (subdoc.collectionid == null) {
              subdoc.collectionid = doc2.collectionid;
            }
            doc2.subdocs.add(subdoc);
          });
          subdocsRemoved.forEach((subdoc) => doc2.subdocs.delete(subdoc));
          doc2.emit("subdocs", [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc2, transaction]);
          subdocsRemoved.forEach((subdoc) => subdoc.destroy());
        }
        if (transactionCleanups.length <= i + 1) {
          doc2._transactionCleanups = [];
          doc2.emit("afterAllTransactions", [doc2, transactionCleanups]);
        } else {
          cleanupTransactions(transactionCleanups, i + 1);
        }
      }
    }
  };
  var transact = (doc2, f, origin = null, local = true) => {
    const transactionCleanups = doc2._transactionCleanups;
    let initialCall = false;
    let result = null;
    if (doc2._transaction === null) {
      initialCall = true;
      doc2._transaction = new Transaction(doc2, origin, local);
      transactionCleanups.push(doc2._transaction);
      if (transactionCleanups.length === 1) {
        doc2.emit("beforeAllTransactions", [doc2]);
      }
      doc2.emit("beforeTransaction", [doc2._transaction, doc2]);
    }
    try {
      result = f(doc2._transaction);
    } finally {
      if (initialCall) {
        const finishCleanup = doc2._transaction === transactionCleanups[0];
        doc2._transaction = null;
        if (finishCleanup) {
          cleanupTransactions(transactionCleanups, 0);
        }
      }
    }
    return result;
  };
  function* lazyStructReaderGenerator(decoder) {
    const numOfStateUpdates = readVarUint(decoder.restDecoder);
    for (let i = 0; i < numOfStateUpdates; i++) {
      const numberOfStructs = readVarUint(decoder.restDecoder);
      const client = decoder.readClient();
      let clock = readVarUint(decoder.restDecoder);
      for (let i2 = 0; i2 < numberOfStructs; i2++) {
        const info = decoder.readInfo();
        if (info === 10) {
          const len = readVarUint(decoder.restDecoder);
          yield new Skip(createID(client, clock), len);
          clock += len;
        } else if ((BITS5 & info) !== 0) {
          const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
          const struct = new Item(
            createID(client, clock),
            null,
            // left
            (info & BIT8) === BIT8 ? decoder.readLeftID() : null,
            // origin
            null,
            // right
            (info & BIT7) === BIT7 ? decoder.readRightID() : null,
            // right origin
            // @ts-ignore Force writing a string here.
            cantCopyParentInfo ? decoder.readParentInfo() ? decoder.readString() : decoder.readLeftID() : null,
            // parent
            cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null,
            // parentSub
            readItemContent(decoder, info)
            // item content
          );
          yield struct;
          clock += struct.length;
        } else {
          const len = decoder.readLen();
          yield new GC(createID(client, clock), len);
          clock += len;
        }
      }
    }
  }
  var LazyStructReader = class {
    /**
     * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
     * @param {boolean} filterSkips
     */
    constructor(decoder, filterSkips) {
      this.gen = lazyStructReaderGenerator(decoder);
      this.curr = null;
      this.done = false;
      this.filterSkips = filterSkips;
      this.next();
    }
    /**
     * @return {Item | GC | Skip |null}
     */
    next() {
      do {
        this.curr = this.gen.next().value || null;
      } while (this.filterSkips && this.curr !== null && this.curr.constructor === Skip);
      return this.curr;
    }
  };
  var LazyStructWriter = class {
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    constructor(encoder) {
      this.currClient = 0;
      this.startClock = 0;
      this.written = 0;
      this.encoder = encoder;
      this.clientStructs = [];
    }
  };
  var mergeUpdates = (updates) => mergeUpdatesV2(updates, UpdateDecoderV1, UpdateEncoderV1);
  var sliceStruct = (left, diff) => {
    if (left.constructor === GC) {
      const { client, clock } = left.id;
      return new GC(createID(client, clock + diff), left.length - diff);
    } else if (left.constructor === Skip) {
      const { client, clock } = left.id;
      return new Skip(createID(client, clock + diff), left.length - diff);
    } else {
      const leftItem = (
        /** @type {Item} */
        left
      );
      const { client, clock } = leftItem.id;
      return new Item(
        createID(client, clock + diff),
        null,
        createID(client, clock + diff - 1),
        null,
        leftItem.rightOrigin,
        leftItem.parent,
        leftItem.parentSub,
        leftItem.content.splice(diff)
      );
    }
  };
  var mergeUpdatesV2 = (updates, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
    if (updates.length === 1) {
      return updates[0];
    }
    const updateDecoders = updates.map((update) => new YDecoder(createDecoder(update)));
    let lazyStructDecoders = updateDecoders.map((decoder) => new LazyStructReader(decoder, true));
    let currWrite = null;
    const updateEncoder = new YEncoder();
    const lazyStructEncoder = new LazyStructWriter(updateEncoder);
    while (true) {
      lazyStructDecoders = lazyStructDecoders.filter((dec) => dec.curr !== null);
      lazyStructDecoders.sort(
        /** @type {function(any,any):number} */
        (dec1, dec2) => {
          if (dec1.curr.id.client === dec2.curr.id.client) {
            const clockDiff = dec1.curr.id.clock - dec2.curr.id.clock;
            if (clockDiff === 0) {
              return dec1.curr.constructor === dec2.curr.constructor ? 0 : dec1.curr.constructor === Skip ? 1 : -1;
            } else {
              return clockDiff;
            }
          } else {
            return dec2.curr.id.client - dec1.curr.id.client;
          }
        }
      );
      if (lazyStructDecoders.length === 0) {
        break;
      }
      const currDecoder = lazyStructDecoders[0];
      const firstClient = (
        /** @type {Item | GC} */
        currDecoder.curr.id.client
      );
      if (currWrite !== null) {
        let curr = (
          /** @type {Item | GC | null} */
          currDecoder.curr
        );
        let iterated = false;
        while (curr !== null && curr.id.clock + curr.length <= currWrite.struct.id.clock + currWrite.struct.length && curr.id.client >= currWrite.struct.id.client) {
          curr = currDecoder.next();
          iterated = true;
        }
        if (curr === null || // current decoder is empty
        curr.id.client !== firstClient || // check whether there is another decoder that has has updates from `firstClient`
        iterated && curr.id.clock > currWrite.struct.id.clock + currWrite.struct.length) {
          continue;
        }
        if (firstClient !== currWrite.struct.id.client) {
          writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
          currWrite = { struct: curr, offset: 0 };
          currDecoder.next();
        } else {
          if (currWrite.struct.id.clock + currWrite.struct.length < curr.id.clock) {
            if (currWrite.struct.constructor === Skip) {
              currWrite.struct.length = curr.id.clock + curr.length - currWrite.struct.id.clock;
            } else {
              writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
              const diff = curr.id.clock - currWrite.struct.id.clock - currWrite.struct.length;
              const struct = new Skip(createID(firstClient, currWrite.struct.id.clock + currWrite.struct.length), diff);
              currWrite = { struct, offset: 0 };
            }
          } else {
            const diff = currWrite.struct.id.clock + currWrite.struct.length - curr.id.clock;
            if (diff > 0) {
              if (currWrite.struct.constructor === Skip) {
                currWrite.struct.length -= diff;
              } else {
                curr = sliceStruct(curr, diff);
              }
            }
            if (!currWrite.struct.mergeWith(
              /** @type {any} */
              curr
            )) {
              writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
              currWrite = { struct: curr, offset: 0 };
              currDecoder.next();
            }
          }
        }
      } else {
        currWrite = { struct: (
          /** @type {Item | GC} */
          currDecoder.curr
        ), offset: 0 };
        currDecoder.next();
      }
      for (let next = currDecoder.curr; next !== null && next.id.client === firstClient && next.id.clock === currWrite.struct.id.clock + currWrite.struct.length && next.constructor !== Skip; next = currDecoder.next()) {
        writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
        currWrite = { struct: next, offset: 0 };
      }
    }
    if (currWrite !== null) {
      writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
      currWrite = null;
    }
    finishLazyStructWriting(lazyStructEncoder);
    const dss = updateDecoders.map((decoder) => readDeleteSet(decoder));
    const ds = mergeDeleteSets(dss);
    writeDeleteSet(updateEncoder, ds);
    return updateEncoder.toUint8Array();
  };
  var diffUpdateV2 = (update, sv, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
    const state = decodeStateVector(sv);
    const encoder = new YEncoder();
    const lazyStructWriter = new LazyStructWriter(encoder);
    const decoder = new YDecoder(createDecoder(update));
    const reader = new LazyStructReader(decoder, false);
    while (reader.curr) {
      const curr = reader.curr;
      const currClient = curr.id.client;
      const svClock = state.get(currClient) || 0;
      if (reader.curr.constructor === Skip) {
        reader.next();
        continue;
      }
      if (curr.id.clock + curr.length > svClock) {
        writeStructToLazyStructWriter(lazyStructWriter, curr, max(svClock - curr.id.clock, 0));
        reader.next();
        while (reader.curr && reader.curr.id.client === currClient) {
          writeStructToLazyStructWriter(lazyStructWriter, reader.curr, 0);
          reader.next();
        }
      } else {
        while (reader.curr && reader.curr.id.client === currClient && reader.curr.id.clock + reader.curr.length <= svClock) {
          reader.next();
        }
      }
    }
    finishLazyStructWriting(lazyStructWriter);
    const ds = readDeleteSet(decoder);
    writeDeleteSet(encoder, ds);
    return encoder.toUint8Array();
  };
  var flushLazyStructWriter = (lazyWriter) => {
    if (lazyWriter.written > 0) {
      lazyWriter.clientStructs.push({ written: lazyWriter.written, restEncoder: toUint8Array(lazyWriter.encoder.restEncoder) });
      lazyWriter.encoder.restEncoder = createEncoder();
      lazyWriter.written = 0;
    }
  };
  var writeStructToLazyStructWriter = (lazyWriter, struct, offset) => {
    if (lazyWriter.written > 0 && lazyWriter.currClient !== struct.id.client) {
      flushLazyStructWriter(lazyWriter);
    }
    if (lazyWriter.written === 0) {
      lazyWriter.currClient = struct.id.client;
      lazyWriter.encoder.writeClient(struct.id.client);
      writeVarUint(lazyWriter.encoder.restEncoder, struct.id.clock + offset);
    }
    struct.write(lazyWriter.encoder, offset);
    lazyWriter.written++;
  };
  var finishLazyStructWriting = (lazyWriter) => {
    flushLazyStructWriter(lazyWriter);
    const restEncoder = lazyWriter.encoder.restEncoder;
    writeVarUint(restEncoder, lazyWriter.clientStructs.length);
    for (let i = 0; i < lazyWriter.clientStructs.length; i++) {
      const partStructs = lazyWriter.clientStructs[i];
      writeVarUint(restEncoder, partStructs.written);
      writeUint8Array(restEncoder, partStructs.restEncoder);
    }
  };
  var convertUpdateFormat = (update, blockTransformer, YDecoder, YEncoder) => {
    const updateDecoder = new YDecoder(createDecoder(update));
    const lazyDecoder = new LazyStructReader(updateDecoder, false);
    const updateEncoder = new YEncoder();
    const lazyWriter = new LazyStructWriter(updateEncoder);
    for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
      writeStructToLazyStructWriter(lazyWriter, blockTransformer(curr), 0);
    }
    finishLazyStructWriting(lazyWriter);
    const ds = readDeleteSet(updateDecoder);
    writeDeleteSet(updateEncoder, ds);
    return updateEncoder.toUint8Array();
  };
  var convertUpdateFormatV2ToV1 = (update) => convertUpdateFormat(update, id, UpdateDecoderV2, UpdateEncoderV1);
  var errorComputeChanges = "You must not compute changes after the event-handler fired.";
  var YEvent = class {
    /**
     * @param {T} target The changed type.
     * @param {Transaction} transaction
     */
    constructor(target, transaction) {
      this.target = target;
      this.currentTarget = target;
      this.transaction = transaction;
      this._changes = null;
      this._keys = null;
      this._delta = null;
      this._path = null;
    }
    /**
     * Computes the path from `y` to the changed type.
     *
     * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
     *
     * The following property holds:
     * @example
     *   let type = y
     *   event.path.forEach(dir => {
     *     type = type.get(dir)
     *   })
     *   type === event.target // => true
     */
    get path() {
      return this._path || (this._path = getPathTo(this.currentTarget, this.target));
    }
    /**
     * Check if a struct is deleted by this event.
     *
     * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
     *
     * @param {AbstractStruct} struct
     * @return {boolean}
     */
    deletes(struct) {
      return isDeleted(this.transaction.deleteSet, struct.id);
    }
    /**
     * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
     */
    get keys() {
      if (this._keys === null) {
        if (this.transaction.doc._transactionCleanups.length === 0) {
          throw create3(errorComputeChanges);
        }
        const keys2 = /* @__PURE__ */ new Map();
        const target = this.target;
        const changed = (
          /** @type Set<string|null> */
          this.transaction.changed.get(target)
        );
        changed.forEach((key) => {
          if (key !== null) {
            const item = (
              /** @type {Item} */
              target._map.get(key)
            );
            let action;
            let oldValue;
            if (this.adds(item)) {
              let prev = item.left;
              while (prev !== null && this.adds(prev)) {
                prev = prev.left;
              }
              if (this.deletes(item)) {
                if (prev !== null && this.deletes(prev)) {
                  action = "delete";
                  oldValue = last(prev.content.getContent());
                } else {
                  return;
                }
              } else {
                if (prev !== null && this.deletes(prev)) {
                  action = "update";
                  oldValue = last(prev.content.getContent());
                } else {
                  action = "add";
                  oldValue = void 0;
                }
              }
            } else {
              if (this.deletes(item)) {
                action = "delete";
                oldValue = last(
                  /** @type {Item} */
                  item.content.getContent()
                );
              } else {
                return;
              }
            }
            keys2.set(key, { action, oldValue });
          }
        });
        this._keys = keys2;
      }
      return this._keys;
    }
    /**
     * This is a computed property. Note that this can only be safely computed during the
     * event call. Computing this property after other changes happened might result in
     * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
     * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
     *
     * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
     */
    get delta() {
      return this.changes.delta;
    }
    /**
     * Check if a struct is added by this event.
     *
     * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
     *
     * @param {AbstractStruct} struct
     * @return {boolean}
     */
    adds(struct) {
      return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0);
    }
    /**
     * This is a computed property. Note that this can only be safely computed during the
     * event call. Computing this property after other changes happened might result in
     * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
     * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
     *
     * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
     */
    get changes() {
      let changes = this._changes;
      if (changes === null) {
        if (this.transaction.doc._transactionCleanups.length === 0) {
          throw create3(errorComputeChanges);
        }
        const target = this.target;
        const added = create2();
        const deleted = create2();
        const delta = [];
        changes = {
          added,
          deleted,
          delta,
          keys: this.keys
        };
        const changed = (
          /** @type Set<string|null> */
          this.transaction.changed.get(target)
        );
        if (changed.has(null)) {
          let lastOp = null;
          const packOp = () => {
            if (lastOp) {
              delta.push(lastOp);
            }
          };
          for (let item = target._start; item !== null; item = item.right) {
            if (item.deleted) {
              if (this.deletes(item) && !this.adds(item)) {
                if (lastOp === null || lastOp.delete === void 0) {
                  packOp();
                  lastOp = { delete: 0 };
                }
                lastOp.delete += item.length;
                deleted.add(item);
              }
            } else {
              if (this.adds(item)) {
                if (lastOp === null || lastOp.insert === void 0) {
                  packOp();
                  lastOp = { insert: [] };
                }
                lastOp.insert = lastOp.insert.concat(item.content.getContent());
                added.add(item);
              } else {
                if (lastOp === null || lastOp.retain === void 0) {
                  packOp();
                  lastOp = { retain: 0 };
                }
                lastOp.retain += item.length;
              }
            }
          }
          if (lastOp !== null && lastOp.retain === void 0) {
            packOp();
          }
        }
        this._changes = changes;
      }
      return (
        /** @type {any} */
        changes
      );
    }
  };
  var getPathTo = (parent, child) => {
    const path = [];
    while (child._item !== null && child !== parent) {
      if (child._item.parentSub !== null) {
        path.unshift(child._item.parentSub);
      } else {
        let i = 0;
        let c = (
          /** @type {AbstractType<any>} */
          child._item.parent._start
        );
        while (c !== child._item && c !== null) {
          if (!c.deleted && c.countable) {
            i += c.length;
          }
          c = c.right;
        }
        path.unshift(i);
      }
      child = /** @type {AbstractType<any>} */
      child._item.parent;
    }
    return path;
  };
  var warnPrematureAccess = () => {
    warn("Invalid access: Add Yjs type to a document before reading data.");
  };
  var maxSearchMarker = 80;
  var globalSearchMarkerTimestamp = 0;
  var ArraySearchMarker = class {
    /**
     * @param {Item} p
     * @param {number} index
     */
    constructor(p, index) {
      p.marker = true;
      this.p = p;
      this.index = index;
      this.timestamp = globalSearchMarkerTimestamp++;
    }
  };
  var refreshMarkerTimestamp = (marker) => {
    marker.timestamp = globalSearchMarkerTimestamp++;
  };
  var overwriteMarker = (marker, p, index) => {
    marker.p.marker = false;
    marker.p = p;
    p.marker = true;
    marker.index = index;
    marker.timestamp = globalSearchMarkerTimestamp++;
  };
  var markPosition = (searchMarker, p, index) => {
    if (searchMarker.length >= maxSearchMarker) {
      const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
      overwriteMarker(marker, p, index);
      return marker;
    } else {
      const pm = new ArraySearchMarker(p, index);
      searchMarker.push(pm);
      return pm;
    }
  };
  var findMarker = (yarray, index) => {
    if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
      return null;
    }
    const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => abs(index - a.index) < abs(index - b.index) ? a : b);
    let p = yarray._start;
    let pindex = 0;
    if (marker !== null) {
      p = marker.p;
      pindex = marker.index;
      refreshMarkerTimestamp(marker);
    }
    while (p.right !== null && pindex < index) {
      if (!p.deleted && p.countable) {
        if (index < pindex + p.length) {
          break;
        }
        pindex += p.length;
      }
      p = p.right;
    }
    while (p.left !== null && pindex > index) {
      p = p.left;
      if (!p.deleted && p.countable) {
        pindex -= p.length;
      }
    }
    while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
      p = p.left;
      if (!p.deleted && p.countable) {
        pindex -= p.length;
      }
    }
    if (marker !== null && abs(marker.index - pindex) < /** @type {YText|YArray<any>} */
    p.parent.length / maxSearchMarker) {
      overwriteMarker(marker, p, pindex);
      return marker;
    } else {
      return markPosition(yarray._searchMarker, p, pindex);
    }
  };
  var updateMarkerChanges = (searchMarker, index, len) => {
    for (let i = searchMarker.length - 1; i >= 0; i--) {
      const m = searchMarker[i];
      if (len > 0) {
        let p = m.p;
        p.marker = false;
        while (p && (p.deleted || !p.countable)) {
          p = p.left;
          if (p && !p.deleted && p.countable) {
            m.index -= p.length;
          }
        }
        if (p === null || p.marker === true) {
          searchMarker.splice(i, 1);
          continue;
        }
        m.p = p;
        p.marker = true;
      }
      if (index < m.index || len > 0 && index === m.index) {
        m.index = max(index, m.index + len);
      }
    }
  };
  var callTypeObservers = (type, transaction, event) => {
    const changedType = type;
    const changedParentTypes = transaction.changedParentTypes;
    while (true) {
      setIfUndefined(changedParentTypes, type, () => []).push(event);
      if (type._item === null) {
        break;
      }
      type = /** @type {AbstractType<any>} */
      type._item.parent;
    }
    callEventHandlerListeners(changedType._eH, event, transaction);
  };
  var AbstractType = class {
    constructor() {
      this._item = null;
      this._map = /* @__PURE__ */ new Map();
      this._start = null;
      this.doc = null;
      this._length = 0;
      this._eH = createEventHandler();
      this._dEH = createEventHandler();
      this._searchMarker = null;
    }
    /**
     * @return {AbstractType<any>|null}
     */
    get parent() {
      return this._item ? (
        /** @type {AbstractType<any>} */
        this._item.parent
      ) : null;
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item|null} item
     */
    _integrate(y, item) {
      this.doc = y;
      this._item = item;
    }
    /**
     * @return {AbstractType<EventType>}
     */
    _copy() {
      throw methodUnimplemented();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {AbstractType<EventType>}
     */
    clone() {
      throw methodUnimplemented();
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
     */
    _write(_encoder) {
    }
    /**
     * The first non-deleted item
     */
    get _first() {
      let n = this._start;
      while (n !== null && n.deleted) {
        n = n.right;
      }
      return n;
    }
    /**
     * Creates YEvent and calls all type observers.
     * Must be implemented by each type.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, _parentSubs) {
      if (!transaction.local && this._searchMarker) {
        this._searchMarker.length = 0;
      }
    }
    /**
     * Observe all events that are created on this type.
     *
     * @param {function(EventType, Transaction):void} f Observer function
     */
    observe(f) {
      addEventHandlerListener(this._eH, f);
    }
    /**
     * Observe all events that are created by this type and its children.
     *
     * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
     */
    observeDeep(f) {
      addEventHandlerListener(this._dEH, f);
    }
    /**
     * Unregister an observer function.
     *
     * @param {function(EventType,Transaction):void} f Observer function
     */
    unobserve(f) {
      removeEventHandlerListener(this._eH, f);
    }
    /**
     * Unregister an observer function.
     *
     * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
     */
    unobserveDeep(f) {
      removeEventHandlerListener(this._dEH, f);
    }
    /**
     * @abstract
     * @return {any}
     */
    toJSON() {
    }
  };
  var typeListSlice = (type, start, end) => {
    type.doc ?? warnPrematureAccess();
    if (start < 0) {
      start = type._length + start;
    }
    if (end < 0) {
      end = type._length + end;
    }
    let len = end - start;
    const cs = [];
    let n = type._start;
    while (n !== null && len > 0) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        if (c.length <= start) {
          start -= c.length;
        } else {
          for (let i = start; i < c.length && len > 0; i++) {
            cs.push(c[i]);
            len--;
          }
          start = 0;
        }
      }
      n = n.right;
    }
    return cs;
  };
  var typeListToArray = (type) => {
    type.doc ?? warnPrematureAccess();
    const cs = [];
    let n = type._start;
    while (n !== null) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          cs.push(c[i]);
        }
      }
      n = n.right;
    }
    return cs;
  };
  var typeListForEach = (type, f) => {
    let index = 0;
    let n = type._start;
    type.doc ?? warnPrematureAccess();
    while (n !== null) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          f(c[i], index++, type);
        }
      }
      n = n.right;
    }
  };
  var typeListMap = (type, f) => {
    const result = [];
    typeListForEach(type, (c, i) => {
      result.push(f(c, i, type));
    });
    return result;
  };
  var typeListCreateIterator = (type) => {
    let n = type._start;
    let currentContent = null;
    let currentContentIndex = 0;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (currentContent === null) {
          while (n !== null && n.deleted) {
            n = n.right;
          }
          if (n === null) {
            return {
              done: true,
              value: void 0
            };
          }
          currentContent = n.content.getContent();
          currentContentIndex = 0;
          n = n.right;
        }
        const value = currentContent[currentContentIndex++];
        if (currentContent.length <= currentContentIndex) {
          currentContent = null;
        }
        return {
          done: false,
          value
        };
      }
    };
  };
  var typeListGet = (type, index) => {
    type.doc ?? warnPrematureAccess();
    const marker = findMarker(type, index);
    let n = type._start;
    if (marker !== null) {
      n = marker.p;
      index -= marker.index;
    }
    for (; n !== null; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index < n.length) {
          return n.content.getContent()[index];
        }
        index -= n.length;
      }
    }
  };
  var typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
    let left = referenceItem;
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    const store = doc2.store;
    const right = referenceItem === null ? parent._start : referenceItem.right;
    let jsonContent = [];
    const packJsonContent = () => {
      if (jsonContent.length > 0) {
        left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
        left.integrate(transaction, 0);
        jsonContent = [];
      }
    };
    content.forEach((c) => {
      if (c === null) {
        jsonContent.push(c);
      } else {
        switch (c.constructor) {
          case Number:
          case Object:
          case Boolean:
          case Array:
          case String:
            jsonContent.push(c);
            break;
          default:
            packJsonContent();
            switch (c.constructor) {
              case Uint8Array:
              case ArrayBuffer:
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(
                  /** @type {Uint8Array} */
                  c
                )));
                left.integrate(transaction, 0);
                break;
              case Doc:
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(
                  /** @type {Doc} */
                  c
                ));
                left.integrate(transaction, 0);
                break;
              default:
                if (c instanceof AbstractType) {
                  left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                  left.integrate(transaction, 0);
                } else {
                  throw new Error("Unexpected content type in insert operation");
                }
            }
        }
      }
    });
    packJsonContent();
  };
  var lengthExceeded = () => create3("Length exceeded!");
  var typeListInsertGenerics = (transaction, parent, index, content) => {
    if (index > parent._length) {
      throw lengthExceeded();
    }
    if (index === 0) {
      if (parent._searchMarker) {
        updateMarkerChanges(parent._searchMarker, index, content.length);
      }
      return typeListInsertGenericsAfter(transaction, parent, null, content);
    }
    const startIndex = index;
    const marker = findMarker(parent, index);
    let n = parent._start;
    if (marker !== null) {
      n = marker.p;
      index -= marker.index;
      if (index === 0) {
        n = n.prev;
        index += n && n.countable && !n.deleted ? n.length : 0;
      }
    }
    for (; n !== null; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index <= n.length) {
          if (index < n.length) {
            getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
          }
          break;
        }
        index -= n.length;
      }
    }
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, startIndex, content.length);
    }
    return typeListInsertGenericsAfter(transaction, parent, n, content);
  };
  var typeListPushGenerics = (transaction, parent, content) => {
    const marker = (parent._searchMarker || []).reduce((maxMarker, currMarker) => currMarker.index > maxMarker.index ? currMarker : maxMarker, { index: 0, p: parent._start });
    let n = marker.p;
    if (n) {
      while (n.right) {
        n = n.right;
      }
    }
    return typeListInsertGenericsAfter(transaction, parent, n, content);
  };
  var typeListDelete = (transaction, parent, index, length3) => {
    if (length3 === 0) {
      return;
    }
    const startIndex = index;
    const startLength = length3;
    const marker = findMarker(parent, index);
    let n = parent._start;
    if (marker !== null) {
      n = marker.p;
      index -= marker.index;
    }
    for (; n !== null && index > 0; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        index -= n.length;
      }
    }
    while (length3 > 0 && n !== null) {
      if (!n.deleted) {
        if (length3 < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length3));
        }
        n.delete(transaction);
        length3 -= n.length;
      }
      n = n.right;
    }
    if (length3 > 0) {
      throw lengthExceeded();
    }
    if (parent._searchMarker) {
      updateMarkerChanges(
        parent._searchMarker,
        startIndex,
        -startLength + length3
        /* in case we remove the above exception */
      );
    }
  };
  var typeMapDelete = (transaction, parent, key) => {
    const c = parent._map.get(key);
    if (c !== void 0) {
      c.delete(transaction);
    }
  };
  var typeMapSet = (transaction, parent, key, value) => {
    const left = parent._map.get(key) || null;
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    let content;
    if (value == null) {
      content = new ContentAny([value]);
    } else {
      switch (value.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
        case Date:
        case BigInt:
          content = new ContentAny([value]);
          break;
        case Uint8Array:
          content = new ContentBinary(
            /** @type {Uint8Array} */
            value
          );
          break;
        case Doc:
          content = new ContentDoc(
            /** @type {Doc} */
            value
          );
          break;
        default:
          if (value instanceof AbstractType) {
            content = new ContentType(value);
          } else {
            throw new Error("Unexpected content type");
          }
      }
    }
    new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
  };
  var typeMapGet = (parent, key) => {
    parent.doc ?? warnPrematureAccess();
    const val = parent._map.get(key);
    return val !== void 0 && !val.deleted ? val.content.getContent()[val.length - 1] : void 0;
  };
  var typeMapGetAll = (parent) => {
    const res = {};
    parent.doc ?? warnPrematureAccess();
    parent._map.forEach((value, key) => {
      if (!value.deleted) {
        res[key] = value.content.getContent()[value.length - 1];
      }
    });
    return res;
  };
  var typeMapHas = (parent, key) => {
    parent.doc ?? warnPrematureAccess();
    const val = parent._map.get(key);
    return val !== void 0 && !val.deleted;
  };
  var typeMapGetAllSnapshot = (parent, snapshot) => {
    const res = {};
    parent._map.forEach((value, key) => {
      let v = value;
      while (v !== null && (!snapshot.sv.has(v.id.client) || v.id.clock >= (snapshot.sv.get(v.id.client) || 0))) {
        v = v.left;
      }
      if (v !== null && isVisible(v, snapshot)) {
        res[key] = v.content.getContent()[v.length - 1];
      }
    });
    return res;
  };
  var createMapIterator = (type) => {
    type.doc ?? warnPrematureAccess();
    return iteratorFilter(
      type._map.entries(),
      /** @param {any} entry */
      (entry) => !entry[1].deleted
    );
  };
  var YArrayEvent = class extends YEvent {
  };
  var YArray = class _YArray extends AbstractType {
    constructor() {
      super();
      this._prelimContent = [];
      this._searchMarker = [];
    }
    /**
     * Construct a new YArray containing the specified items.
     * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
     * @param {Array<T>} items
     * @return {YArray<T>}
     */
    static from(items) {
      const a = new _YArray();
      a.push(items);
      return a;
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      this.insert(
        0,
        /** @type {Array<any>} */
        this._prelimContent
      );
      this._prelimContent = null;
    }
    /**
     * @return {YArray<T>}
     */
    _copy() {
      return new _YArray();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YArray<T>}
     */
    clone() {
      const arr = new _YArray();
      arr.insert(0, this.toArray().map(
        (el) => el instanceof AbstractType ? (
          /** @type {typeof el} */
          el.clone()
        ) : el
      ));
      return arr;
    }
    get length() {
      this.doc ?? warnPrematureAccess();
      return this._length;
    }
    /**
     * Creates YArrayEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, parentSubs) {
      super._callObserver(transaction, parentSubs);
      callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
    }
    /**
     * Inserts new content at an index.
     *
     * Important: This function expects an array of content. Not just a content
     * object. The reason for this "weirdness" is that inserting several elements
     * is very efficient when it is done as a single operation.
     *
     * @example
     *  // Insert character 'a' at position 0
     *  yarray.insert(0, ['a'])
     *  // Insert numbers 1, 2 at position 1
     *  yarray.insert(1, [1, 2])
     *
     * @param {number} index The index to insert content at.
     * @param {Array<T>} content The array of content
     */
    insert(index, content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListInsertGenerics(
            transaction,
            this,
            index,
            /** @type {any} */
            content
          );
        });
      } else {
        this._prelimContent.splice(index, 0, ...content);
      }
    }
    /**
     * Appends content to this YArray.
     *
     * @param {Array<T>} content Array of content to append.
     *
     * @todo Use the following implementation in all types.
     */
    push(content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListPushGenerics(
            transaction,
            this,
            /** @type {any} */
            content
          );
        });
      } else {
        this._prelimContent.push(...content);
      }
    }
    /**
     * Prepends content to this YArray.
     *
     * @param {Array<T>} content Array of content to prepend.
     */
    unshift(content) {
      this.insert(0, content);
    }
    /**
     * Deletes elements starting from an index.
     *
     * @param {number} index Index at which to start deleting elements
     * @param {number} length The number of elements to remove. Defaults to 1.
     */
    delete(index, length3 = 1) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListDelete(transaction, this, index, length3);
        });
      } else {
        this._prelimContent.splice(index, length3);
      }
    }
    /**
     * Returns the i-th element from a YArray.
     *
     * @param {number} index The index of the element to return from the YArray
     * @return {T}
     */
    get(index) {
      return typeListGet(this, index);
    }
    /**
     * Transforms this YArray to a JavaScript Array.
     *
     * @return {Array<T>}
     */
    toArray() {
      return typeListToArray(this);
    }
    /**
     * Returns a portion of this YArray into a JavaScript Array selected
     * from start to end (end not included).
     *
     * @param {number} [start]
     * @param {number} [end]
     * @return {Array<T>}
     */
    slice(start = 0, end = this.length) {
      return typeListSlice(this, start, end);
    }
    /**
     * Transforms this Shared Type to a JSON object.
     *
     * @return {Array<any>}
     */
    toJSON() {
      return this.map((c) => c instanceof AbstractType ? c.toJSON() : c);
    }
    /**
     * Returns an Array with the result of calling a provided function on every
     * element of this YArray.
     *
     * @template M
     * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
     * @return {Array<M>} A new array with each element being the result of the
     *                 callback function
     */
    map(f) {
      return typeListMap(
        this,
        /** @type {any} */
        f
      );
    }
    /**
     * Executes a provided function once on every element of this YArray.
     *
     * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
     */
    forEach(f) {
      typeListForEach(this, f);
    }
    /**
     * @return {IterableIterator<T>}
     */
    [Symbol.iterator]() {
      return typeListCreateIterator(this);
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    _write(encoder) {
      encoder.writeTypeRef(YArrayRefID);
    }
  };
  var readYArray = (_decoder) => new YArray();
  var YMapEvent = class extends YEvent {
    /**
     * @param {YMap<T>} ymap The YArray that changed.
     * @param {Transaction} transaction
     * @param {Set<any>} subs The keys that changed.
     */
    constructor(ymap, transaction, subs) {
      super(ymap, transaction);
      this.keysChanged = subs;
    }
  };
  var YMap = class _YMap extends AbstractType {
    /**
     *
     * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
     */
    constructor(entries) {
      super();
      this._prelimContent = null;
      if (entries === void 0) {
        this._prelimContent = /* @__PURE__ */ new Map();
      } else {
        this._prelimContent = new Map(entries);
      }
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      this._prelimContent.forEach((value, key) => {
        this.set(key, value);
      });
      this._prelimContent = null;
    }
    /**
     * @return {YMap<MapType>}
     */
    _copy() {
      return new _YMap();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YMap<MapType>}
     */
    clone() {
      const map3 = new _YMap();
      this.forEach((value, key) => {
        map3.set(key, value instanceof AbstractType ? (
          /** @type {typeof value} */
          value.clone()
        ) : value);
      });
      return map3;
    }
    /**
     * Creates YMapEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, parentSubs) {
      callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
    }
    /**
     * Transforms this Shared Type to a JSON object.
     *
     * @return {Object<string,any>}
     */
    toJSON() {
      this.doc ?? warnPrematureAccess();
      const map3 = {};
      this._map.forEach((item, key) => {
        if (!item.deleted) {
          const v = item.content.getContent()[item.length - 1];
          map3[key] = v instanceof AbstractType ? v.toJSON() : v;
        }
      });
      return map3;
    }
    /**
     * Returns the size of the YMap (count of key/value pairs)
     *
     * @return {number}
     */
    get size() {
      return [...createMapIterator(this)].length;
    }
    /**
     * Returns the keys for each element in the YMap Type.
     *
     * @return {IterableIterator<string>}
     */
    keys() {
      return iteratorMap(
        createMapIterator(this),
        /** @param {any} v */
        (v) => v[0]
      );
    }
    /**
     * Returns the values for each element in the YMap Type.
     *
     * @return {IterableIterator<MapType>}
     */
    values() {
      return iteratorMap(
        createMapIterator(this),
        /** @param {any} v */
        (v) => v[1].content.getContent()[v[1].length - 1]
      );
    }
    /**
     * Returns an Iterator of [key, value] pairs
     *
     * @return {IterableIterator<[string, MapType]>}
     */
    entries() {
      return iteratorMap(
        createMapIterator(this),
        /** @param {any} v */
        (v) => (
          /** @type {any} */
          [v[0], v[1].content.getContent()[v[1].length - 1]]
        )
      );
    }
    /**
     * Executes a provided function on once on every key-value pair.
     *
     * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
     */
    forEach(f) {
      this.doc ?? warnPrematureAccess();
      this._map.forEach((item, key) => {
        if (!item.deleted) {
          f(item.content.getContent()[item.length - 1], key, this);
        }
      });
    }
    /**
     * Returns an Iterator of [key, value] pairs
     *
     * @return {IterableIterator<[string, MapType]>}
     */
    [Symbol.iterator]() {
      return this.entries();
    }
    /**
     * Remove a specified element from this YMap.
     *
     * @param {string} key The key of the element to remove.
     */
    delete(key) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapDelete(transaction, this, key);
        });
      } else {
        this._prelimContent.delete(key);
      }
    }
    /**
     * Adds or updates an element with a specified key and value.
     * @template {MapType} VAL
     *
     * @param {string} key The key of the element to add to this YMap
     * @param {VAL} value The value of the element to add
     * @return {VAL}
     */
    set(key, value) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapSet(
            transaction,
            this,
            key,
            /** @type {any} */
            value
          );
        });
      } else {
        this._prelimContent.set(key, value);
      }
      return value;
    }
    /**
     * Returns a specified element from this YMap.
     *
     * @param {string} key
     * @return {MapType|undefined}
     */
    get(key) {
      return (
        /** @type {any} */
        typeMapGet(this, key)
      );
    }
    /**
     * Returns a boolean indicating whether the specified key exists or not.
     *
     * @param {string} key The key to test.
     * @return {boolean}
     */
    has(key) {
      return typeMapHas(this, key);
    }
    /**
     * Removes all elements from this YMap.
     */
    clear() {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          this.forEach(function(_value, key, map3) {
            typeMapDelete(transaction, map3, key);
          });
        });
      } else {
        this._prelimContent.clear();
      }
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    _write(encoder) {
      encoder.writeTypeRef(YMapRefID);
    }
  };
  var readYMap = (_decoder) => new YMap();
  var equalAttrs = (a, b) => a === b || typeof a === "object" && typeof b === "object" && a && b && equalFlat2(a, b);
  var ItemTextListPosition = class {
    /**
     * @param {Item|null} left
     * @param {Item|null} right
     * @param {number} index
     * @param {Map<string,any>} currentAttributes
     */
    constructor(left, right, index, currentAttributes) {
      this.left = left;
      this.right = right;
      this.index = index;
      this.currentAttributes = currentAttributes;
    }
    /**
     * Only call this if you know that this.right is defined
     */
    forward() {
      if (this.right === null) {
        unexpectedCase();
      }
      switch (this.right.content.constructor) {
        case ContentFormat:
          if (!this.right.deleted) {
            updateCurrentAttributes(
              this.currentAttributes,
              /** @type {ContentFormat} */
              this.right.content
            );
          }
          break;
        default:
          if (!this.right.deleted) {
            this.index += this.right.length;
          }
          break;
      }
      this.left = this.right;
      this.right = this.right.right;
    }
  };
  var findNextPosition = (transaction, pos, count) => {
    while (pos.right !== null && count > 0) {
      switch (pos.right.content.constructor) {
        case ContentFormat:
          if (!pos.right.deleted) {
            updateCurrentAttributes(
              pos.currentAttributes,
              /** @type {ContentFormat} */
              pos.right.content
            );
          }
          break;
        default:
          if (!pos.right.deleted) {
            if (count < pos.right.length) {
              getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
            }
            pos.index += pos.right.length;
            count -= pos.right.length;
          }
          break;
      }
      pos.left = pos.right;
      pos.right = pos.right.right;
    }
    return pos;
  };
  var findPosition = (transaction, parent, index, useSearchMarker) => {
    const currentAttributes = /* @__PURE__ */ new Map();
    const marker = useSearchMarker ? findMarker(parent, index) : null;
    if (marker) {
      const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
      return findNextPosition(transaction, pos, index - marker.index);
    } else {
      const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
      return findNextPosition(transaction, pos, index);
    }
  };
  var insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
    while (currPos.right !== null && (currPos.right.deleted === true || currPos.right.content.constructor === ContentFormat && equalAttrs(
      negatedAttributes.get(
        /** @type {ContentFormat} */
        currPos.right.content.key
      ),
      /** @type {ContentFormat} */
      currPos.right.content.value
    ))) {
      if (!currPos.right.deleted) {
        negatedAttributes.delete(
          /** @type {ContentFormat} */
          currPos.right.content.key
        );
      }
      currPos.forward();
    }
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    negatedAttributes.forEach((val, key) => {
      const left = currPos.left;
      const right = currPos.right;
      const nextFormat = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      nextFormat.integrate(transaction, 0);
      currPos.right = nextFormat;
      currPos.forward();
    });
  };
  var updateCurrentAttributes = (currentAttributes, format) => {
    const { key, value } = format;
    if (value === null) {
      currentAttributes.delete(key);
    } else {
      currentAttributes.set(key, value);
    }
  };
  var minimizeAttributeChanges = (currPos, attributes) => {
    while (true) {
      if (currPos.right === null) {
        break;
      } else if (currPos.right.deleted || currPos.right.content.constructor === ContentFormat && equalAttrs(
        attributes[
          /** @type {ContentFormat} */
          currPos.right.content.key
        ] ?? null,
        /** @type {ContentFormat} */
        currPos.right.content.value
      )) ;
      else {
        break;
      }
      currPos.forward();
    }
  };
  var insertAttributes = (transaction, parent, currPos, attributes) => {
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    const negatedAttributes = /* @__PURE__ */ new Map();
    for (const key in attributes) {
      const val = attributes[key];
      const currentVal = currPos.currentAttributes.get(key) ?? null;
      if (!equalAttrs(currentVal, val)) {
        negatedAttributes.set(key, currentVal);
        const { left, right } = currPos;
        currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
        currPos.right.integrate(transaction, 0);
        currPos.forward();
      }
    }
    return negatedAttributes;
  };
  var insertText = (transaction, parent, currPos, text2, attributes) => {
    currPos.currentAttributes.forEach((_val, key) => {
      if (attributes[key] === void 0) {
        attributes[key] = null;
      }
    });
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    minimizeAttributeChanges(currPos, attributes);
    const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
    const content = text2.constructor === String ? new ContentString(
      /** @type {string} */
      text2
    ) : text2 instanceof AbstractType ? new ContentType(text2) : new ContentEmbed(text2);
    let { left, right, index } = currPos;
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
    }
    right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
    right.integrate(transaction, 0);
    currPos.right = right;
    currPos.index = index;
    currPos.forward();
    insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
  };
  var formatText = (transaction, parent, currPos, length3, attributes) => {
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    minimizeAttributeChanges(currPos, attributes);
    const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
    iterationLoop: while (currPos.right !== null && (length3 > 0 || negatedAttributes.size > 0 && (currPos.right.deleted || currPos.right.content.constructor === ContentFormat))) {
      if (!currPos.right.deleted) {
        switch (currPos.right.content.constructor) {
          case ContentFormat: {
            const { key, value } = (
              /** @type {ContentFormat} */
              currPos.right.content
            );
            const attr = attributes[key];
            if (attr !== void 0) {
              if (equalAttrs(attr, value)) {
                negatedAttributes.delete(key);
              } else {
                if (length3 === 0) {
                  break iterationLoop;
                }
                negatedAttributes.set(key, value);
              }
              currPos.right.delete(transaction);
            } else {
              currPos.currentAttributes.set(key, value);
            }
            break;
          }
          default:
            if (length3 < currPos.right.length) {
              getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length3));
            }
            length3 -= currPos.right.length;
            break;
        }
      }
      currPos.forward();
    }
    if (length3 > 0) {
      let newlines = "";
      for (; length3 > 0; length3--) {
        newlines += "\n";
      }
      currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
    insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
  };
  var cleanupFormattingGap = (transaction, start, curr, startAttributes, currAttributes) => {
    let end = start;
    const endFormats = create();
    while (end && (!end.countable || end.deleted)) {
      if (!end.deleted && end.content.constructor === ContentFormat) {
        const cf = (
          /** @type {ContentFormat} */
          end.content
        );
        endFormats.set(cf.key, cf);
      }
      end = end.right;
    }
    let cleanups = 0;
    let reachedCurr = false;
    while (start !== end) {
      if (curr === start) {
        reachedCurr = true;
      }
      if (!start.deleted) {
        const content = start.content;
        switch (content.constructor) {
          case ContentFormat: {
            const { key, value } = (
              /** @type {ContentFormat} */
              content
            );
            const startAttrValue = startAttributes.get(key) ?? null;
            if (endFormats.get(key) !== content || startAttrValue === value) {
              start.delete(transaction);
              cleanups++;
              if (!reachedCurr && (currAttributes.get(key) ?? null) === value && startAttrValue !== value) {
                if (startAttrValue === null) {
                  currAttributes.delete(key);
                } else {
                  currAttributes.set(key, startAttrValue);
                }
              }
            }
            if (!reachedCurr && !start.deleted) {
              updateCurrentAttributes(
                currAttributes,
                /** @type {ContentFormat} */
                content
              );
            }
            break;
          }
        }
      }
      start = /** @type {Item} */
      start.right;
    }
    return cleanups;
  };
  var cleanupContextlessFormattingGap = (transaction, item) => {
    while (item && item.right && (item.right.deleted || !item.right.countable)) {
      item = item.right;
    }
    const attrs = /* @__PURE__ */ new Set();
    while (item && (item.deleted || !item.countable)) {
      if (!item.deleted && item.content.constructor === ContentFormat) {
        const key = (
          /** @type {ContentFormat} */
          item.content.key
        );
        if (attrs.has(key)) {
          item.delete(transaction);
        } else {
          attrs.add(key);
        }
      }
      item = item.left;
    }
  };
  var cleanupYTextFormatting = (type) => {
    let res = 0;
    transact(
      /** @type {Doc} */
      type.doc,
      (transaction) => {
        let start = (
          /** @type {Item} */
          type._start
        );
        let end = type._start;
        let startAttributes = create();
        const currentAttributes = copy(startAttributes);
        while (end) {
          if (end.deleted === false) {
            switch (end.content.constructor) {
              case ContentFormat:
                updateCurrentAttributes(
                  currentAttributes,
                  /** @type {ContentFormat} */
                  end.content
                );
                break;
              default:
                res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
                startAttributes = copy(currentAttributes);
                start = end;
                break;
            }
          }
          end = end.right;
        }
      }
    );
    return res;
  };
  var cleanupYTextAfterTransaction = (transaction) => {
    const needFullCleanup = /* @__PURE__ */ new Set();
    const doc2 = transaction.doc;
    for (const [client, afterClock] of transaction.afterState.entries()) {
      const clock = transaction.beforeState.get(client) || 0;
      if (afterClock === clock) {
        continue;
      }
      iterateStructs(
        transaction,
        /** @type {Array<Item|GC>} */
        doc2.store.clients.get(client),
        clock,
        afterClock,
        (item) => {
          if (!item.deleted && /** @type {Item} */
          item.content.constructor === ContentFormat && item.constructor !== GC) {
            needFullCleanup.add(
              /** @type {any} */
              item.parent
            );
          }
        }
      );
    }
    transact(doc2, (t) => {
      iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
        if (item instanceof GC || !/** @type {YText} */
        item.parent._hasFormatting || needFullCleanup.has(
          /** @type {YText} */
          item.parent
        )) {
          return;
        }
        const parent = (
          /** @type {YText} */
          item.parent
        );
        if (item.content.constructor === ContentFormat) {
          needFullCleanup.add(parent);
        } else {
          cleanupContextlessFormattingGap(t, item);
        }
      });
      for (const yText of needFullCleanup) {
        cleanupYTextFormatting(yText);
      }
    });
  };
  var deleteText = (transaction, currPos, length3) => {
    const startLength = length3;
    const startAttrs = copy(currPos.currentAttributes);
    const start = currPos.right;
    while (length3 > 0 && currPos.right !== null) {
      if (currPos.right.deleted === false) {
        switch (currPos.right.content.constructor) {
          case ContentType:
          case ContentEmbed:
          case ContentString:
            if (length3 < currPos.right.length) {
              getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length3));
            }
            length3 -= currPos.right.length;
            currPos.right.delete(transaction);
            break;
        }
      }
      currPos.forward();
    }
    if (start) {
      cleanupFormattingGap(transaction, start, currPos.right, startAttrs, currPos.currentAttributes);
    }
    const parent = (
      /** @type {AbstractType<any>} */
      /** @type {Item} */
      (currPos.left || currPos.right).parent
    );
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length3);
    }
    return currPos;
  };
  var YTextEvent = class extends YEvent {
    /**
     * @param {YText} ytext
     * @param {Transaction} transaction
     * @param {Set<any>} subs The keys that changed
     */
    constructor(ytext, transaction, subs) {
      super(ytext, transaction);
      this.childListChanged = false;
      this.keysChanged = /* @__PURE__ */ new Set();
      subs.forEach((sub) => {
        if (sub === null) {
          this.childListChanged = true;
        } else {
          this.keysChanged.add(sub);
        }
      });
    }
    /**
     * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
     */
    get changes() {
      if (this._changes === null) {
        const changes = {
          keys: this.keys,
          delta: this.delta,
          added: /* @__PURE__ */ new Set(),
          deleted: /* @__PURE__ */ new Set()
        };
        this._changes = changes;
      }
      return (
        /** @type {any} */
        this._changes
      );
    }
    /**
     * Compute the changes in the delta format.
     * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
     *
     * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
     *
     * @public
     */
    get delta() {
      if (this._delta === null) {
        const y = (
          /** @type {Doc} */
          this.target.doc
        );
        const delta = [];
        transact(y, (transaction) => {
          const currentAttributes = /* @__PURE__ */ new Map();
          const oldAttributes = /* @__PURE__ */ new Map();
          let item = this.target._start;
          let action = null;
          const attributes = {};
          let insert = "";
          let retain = 0;
          let deleteLen = 0;
          const addOp = () => {
            if (action !== null) {
              let op = null;
              switch (action) {
                case "delete":
                  if (deleteLen > 0) {
                    op = { delete: deleteLen };
                  }
                  deleteLen = 0;
                  break;
                case "insert":
                  if (typeof insert === "object" || insert.length > 0) {
                    op = { insert };
                    if (currentAttributes.size > 0) {
                      op.attributes = {};
                      currentAttributes.forEach((value, key) => {
                        if (value !== null) {
                          op.attributes[key] = value;
                        }
                      });
                    }
                  }
                  insert = "";
                  break;
                case "retain":
                  if (retain > 0) {
                    op = { retain };
                    if (!isEmpty(attributes)) {
                      op.attributes = assign({}, attributes);
                    }
                  }
                  retain = 0;
                  break;
              }
              if (op) delta.push(op);
              action = null;
            }
          };
          while (item !== null) {
            switch (item.content.constructor) {
              case ContentType:
              case ContentEmbed:
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    addOp();
                    action = "insert";
                    insert = item.content.getContent()[0];
                    addOp();
                  }
                } else if (this.deletes(item)) {
                  if (action !== "delete") {
                    addOp();
                    action = "delete";
                  }
                  deleteLen += 1;
                } else if (!item.deleted) {
                  if (action !== "retain") {
                    addOp();
                    action = "retain";
                  }
                  retain += 1;
                }
                break;
              case ContentString:
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    if (action !== "insert") {
                      addOp();
                      action = "insert";
                    }
                    insert += /** @type {ContentString} */
                    item.content.str;
                  }
                } else if (this.deletes(item)) {
                  if (action !== "delete") {
                    addOp();
                    action = "delete";
                  }
                  deleteLen += item.length;
                } else if (!item.deleted) {
                  if (action !== "retain") {
                    addOp();
                    action = "retain";
                  }
                  retain += item.length;
                }
                break;
              case ContentFormat: {
                const { key, value } = (
                  /** @type {ContentFormat} */
                  item.content
                );
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    const curVal = currentAttributes.get(key) ?? null;
                    if (!equalAttrs(curVal, value)) {
                      if (action === "retain") {
                        addOp();
                      }
                      if (equalAttrs(value, oldAttributes.get(key) ?? null)) {
                        delete attributes[key];
                      } else {
                        attributes[key] = value;
                      }
                    } else if (value !== null) {
                      item.delete(transaction);
                    }
                  }
                } else if (this.deletes(item)) {
                  oldAttributes.set(key, value);
                  const curVal = currentAttributes.get(key) ?? null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    attributes[key] = curVal;
                  }
                } else if (!item.deleted) {
                  oldAttributes.set(key, value);
                  const attr = attributes[key];
                  if (attr !== void 0) {
                    if (!equalAttrs(attr, value)) {
                      if (action === "retain") {
                        addOp();
                      }
                      if (value === null) {
                        delete attributes[key];
                      } else {
                        attributes[key] = value;
                      }
                    } else if (attr !== null) {
                      item.delete(transaction);
                    }
                  }
                }
                if (!item.deleted) {
                  if (action === "insert") {
                    addOp();
                  }
                  updateCurrentAttributes(
                    currentAttributes,
                    /** @type {ContentFormat} */
                    item.content
                  );
                }
                break;
              }
            }
            item = item.right;
          }
          addOp();
          while (delta.length > 0) {
            const lastOp = delta[delta.length - 1];
            if (lastOp.retain !== void 0 && lastOp.attributes === void 0) {
              delta.pop();
            } else {
              break;
            }
          }
        });
        this._delta = delta;
      }
      return (
        /** @type {any} */
        this._delta
      );
    }
  };
  var YText = class _YText extends AbstractType {
    /**
     * @param {String} [string] The initial value of the YText.
     */
    constructor(string) {
      super();
      this._pending = string !== void 0 ? [() => this.insert(0, string)] : [];
      this._searchMarker = [];
      this._hasFormatting = false;
    }
    /**
     * Number of characters of this text type.
     *
     * @type {number}
     */
    get length() {
      this.doc ?? warnPrematureAccess();
      return this._length;
    }
    /**
     * @param {Doc} y
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      try {
        this._pending.forEach((f) => f());
      } catch (e) {
        console.error(e);
      }
      this._pending = null;
    }
    _copy() {
      return new _YText();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YText}
     */
    clone() {
      const text2 = new _YText();
      text2.applyDelta(this.toDelta());
      return text2;
    }
    /**
     * Creates YTextEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, parentSubs) {
      super._callObserver(transaction, parentSubs);
      const event = new YTextEvent(this, transaction, parentSubs);
      callTypeObservers(this, transaction, event);
      if (!transaction.local && this._hasFormatting) {
        transaction._needFormattingCleanup = true;
      }
    }
    /**
     * Returns the unformatted string representation of this YText type.
     *
     * @public
     */
    toString() {
      this.doc ?? warnPrematureAccess();
      let str = "";
      let n = this._start;
      while (n !== null) {
        if (!n.deleted && n.countable && n.content.constructor === ContentString) {
          str += /** @type {ContentString} */
          n.content.str;
        }
        n = n.right;
      }
      return str;
    }
    /**
     * Returns the unformatted string representation of this YText type.
     *
     * @return {string}
     * @public
     */
    toJSON() {
      return this.toString();
    }
    /**
     * Apply a {@link Delta} on this shared YText type.
     *
     * @param {Array<any>} delta The changes to apply on this element.
     * @param {object}  opts
     * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
     *
     *
     * @public
     */
    applyDelta(delta, { sanitize = true } = {}) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          const currPos = new ItemTextListPosition(null, this._start, 0, /* @__PURE__ */ new Map());
          for (let i = 0; i < delta.length; i++) {
            const op = delta[i];
            if (op.insert !== void 0) {
              const ins = !sanitize && typeof op.insert === "string" && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === "\n" ? op.insert.slice(0, -1) : op.insert;
              if (typeof ins !== "string" || ins.length > 0) {
                insertText(transaction, this, currPos, ins, op.attributes || {});
              }
            } else if (op.retain !== void 0) {
              formatText(transaction, this, currPos, op.retain, op.attributes || {});
            } else if (op.delete !== void 0) {
              deleteText(transaction, currPos, op.delete);
            }
          }
        });
      } else {
        this._pending.push(() => this.applyDelta(delta));
      }
    }
    /**
     * Returns the Delta representation of this YText type.
     *
     * @param {Snapshot} [snapshot]
     * @param {Snapshot} [prevSnapshot]
     * @param {function('removed' | 'added', ID):any} [computeYChange]
     * @return {any} The Delta representation of this type.
     *
     * @public
     */
    toDelta(snapshot, prevSnapshot, computeYChange) {
      this.doc ?? warnPrematureAccess();
      const ops = [];
      const currentAttributes = /* @__PURE__ */ new Map();
      const doc2 = (
        /** @type {Doc} */
        this.doc
      );
      let str = "";
      let n = this._start;
      function packStr() {
        if (str.length > 0) {
          const attributes = {};
          let addAttributes = false;
          currentAttributes.forEach((value, key) => {
            addAttributes = true;
            attributes[key] = value;
          });
          const op = { insert: str };
          if (addAttributes) {
            op.attributes = attributes;
          }
          ops.push(op);
          str = "";
        }
      }
      const computeDelta = () => {
        while (n !== null) {
          if (isVisible(n, snapshot) || prevSnapshot !== void 0 && isVisible(n, prevSnapshot)) {
            switch (n.content.constructor) {
              case ContentString: {
                const cur = currentAttributes.get("ychange");
                if (snapshot !== void 0 && !isVisible(n, snapshot)) {
                  if (cur === void 0 || cur.user !== n.id.client || cur.type !== "removed") {
                    packStr();
                    currentAttributes.set("ychange", computeYChange ? computeYChange("removed", n.id) : { type: "removed" });
                  }
                } else if (prevSnapshot !== void 0 && !isVisible(n, prevSnapshot)) {
                  if (cur === void 0 || cur.user !== n.id.client || cur.type !== "added") {
                    packStr();
                    currentAttributes.set("ychange", computeYChange ? computeYChange("added", n.id) : { type: "added" });
                  }
                } else if (cur !== void 0) {
                  packStr();
                  currentAttributes.delete("ychange");
                }
                str += /** @type {ContentString} */
                n.content.str;
                break;
              }
              case ContentType:
              case ContentEmbed: {
                packStr();
                const op = {
                  insert: n.content.getContent()[0]
                };
                if (currentAttributes.size > 0) {
                  const attrs = (
                    /** @type {Object<string,any>} */
                    {}
                  );
                  op.attributes = attrs;
                  currentAttributes.forEach((value, key) => {
                    attrs[key] = value;
                  });
                }
                ops.push(op);
                break;
              }
              case ContentFormat:
                if (isVisible(n, snapshot)) {
                  packStr();
                  updateCurrentAttributes(
                    currentAttributes,
                    /** @type {ContentFormat} */
                    n.content
                  );
                }
                break;
            }
          }
          n = n.right;
        }
        packStr();
      };
      if (snapshot || prevSnapshot) {
        transact(doc2, (transaction) => {
          if (snapshot) {
            splitSnapshotAffectedStructs(transaction, snapshot);
          }
          if (prevSnapshot) {
            splitSnapshotAffectedStructs(transaction, prevSnapshot);
          }
          computeDelta();
        }, "cleanup");
      } else {
        computeDelta();
      }
      return ops;
    }
    /**
     * Insert text at a given index.
     *
     * @param {number} index The index at which to start inserting.
     * @param {String} text The text to insert at the specified position.
     * @param {TextAttributes} [attributes] Optionally define some formatting
     *                                    information to apply on the inserted
     *                                    Text.
     * @public
     */
    insert(index, text2, attributes) {
      if (text2.length <= 0) {
        return;
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          const pos = findPosition(transaction, this, index, !attributes);
          if (!attributes) {
            attributes = {};
            pos.currentAttributes.forEach((v, k) => {
              attributes[k] = v;
            });
          }
          insertText(transaction, this, pos, text2, attributes);
        });
      } else {
        this._pending.push(() => this.insert(index, text2, attributes));
      }
    }
    /**
     * Inserts an embed at a index.
     *
     * @param {number} index The index to insert the embed at.
     * @param {Object | AbstractType<any>} embed The Object that represents the embed.
     * @param {TextAttributes} [attributes] Attribute information to apply on the
     *                                    embed
     *
     * @public
     */
    insertEmbed(index, embed, attributes) {
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          const pos = findPosition(transaction, this, index, !attributes);
          insertText(transaction, this, pos, embed, attributes || {});
        });
      } else {
        this._pending.push(() => this.insertEmbed(index, embed, attributes || {}));
      }
    }
    /**
     * Deletes text starting from an index.
     *
     * @param {number} index Index at which to start deleting.
     * @param {number} length The number of characters to remove. Defaults to 1.
     *
     * @public
     */
    delete(index, length3) {
      if (length3 === 0) {
        return;
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          deleteText(transaction, findPosition(transaction, this, index, true), length3);
        });
      } else {
        this._pending.push(() => this.delete(index, length3));
      }
    }
    /**
     * Assigns properties to a range of text.
     *
     * @param {number} index The position where to start formatting.
     * @param {number} length The amount of characters to assign properties to.
     * @param {TextAttributes} attributes Attribute information to apply on the
     *                                    text.
     *
     * @public
     */
    format(index, length3, attributes) {
      if (length3 === 0) {
        return;
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          const pos = findPosition(transaction, this, index, false);
          if (pos.right === null) {
            return;
          }
          formatText(transaction, this, pos, length3, attributes);
        });
      } else {
        this._pending.push(() => this.format(index, length3, attributes));
      }
    }
    /**
     * Removes an attribute.
     *
     * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
     *
     * @param {String} attributeName The attribute name that is to be removed.
     *
     * @public
     */
    removeAttribute(attributeName) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapDelete(transaction, this, attributeName);
        });
      } else {
        this._pending.push(() => this.removeAttribute(attributeName));
      }
    }
    /**
     * Sets or updates an attribute.
     *
     * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
     *
     * @param {String} attributeName The attribute name that is to be set.
     * @param {any} attributeValue The attribute value that is to be set.
     *
     * @public
     */
    setAttribute(attributeName, attributeValue) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapSet(transaction, this, attributeName, attributeValue);
        });
      } else {
        this._pending.push(() => this.setAttribute(attributeName, attributeValue));
      }
    }
    /**
     * Returns an attribute value that belongs to the attribute name.
     *
     * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
     *
     * @param {String} attributeName The attribute name that identifies the
     *                               queried value.
     * @return {any} The queried attribute value.
     *
     * @public
     */
    getAttribute(attributeName) {
      return (
        /** @type {any} */
        typeMapGet(this, attributeName)
      );
    }
    /**
     * Returns all attribute name/value pairs in a JSON Object.
     *
     * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
     *
     * @return {Object<string, any>} A JSON Object that describes the attributes.
     *
     * @public
     */
    getAttributes() {
      return typeMapGetAll(this);
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    _write(encoder) {
      encoder.writeTypeRef(YTextRefID);
    }
  };
  var readYText = (_decoder) => new YText();
  var YXmlTreeWalker = class {
    /**
     * @param {YXmlFragment | YXmlElement} root
     * @param {function(AbstractType<any>):boolean} [f]
     */
    constructor(root, f = () => true) {
      this._filter = f;
      this._root = root;
      this._currentNode = /** @type {Item} */
      root._start;
      this._firstCall = true;
      root.doc ?? warnPrematureAccess();
    }
    [Symbol.iterator]() {
      return this;
    }
    /**
     * Get the next node.
     *
     * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
     *
     * @public
     */
    next() {
      let n = this._currentNode;
      let type = n && n.content && /** @type {any} */
      n.content.type;
      if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) {
        do {
          type = /** @type {any} */
          n.content.type;
          if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
            n = type._start;
          } else {
            while (n !== null) {
              const nxt = n.next;
              if (nxt !== null) {
                n = nxt;
                break;
              } else if (n.parent === this._root) {
                n = null;
              } else {
                n = /** @type {AbstractType<any>} */
                n.parent._item;
              }
            }
          }
        } while (n !== null && (n.deleted || !this._filter(
          /** @type {ContentType} */
          n.content.type
        )));
      }
      this._firstCall = false;
      if (n === null) {
        return { value: void 0, done: true };
      }
      this._currentNode = n;
      return { value: (
        /** @type {any} */
        n.content.type
      ), done: false };
    }
  };
  var YXmlFragment = class _YXmlFragment extends AbstractType {
    constructor() {
      super();
      this._prelimContent = [];
    }
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get firstChild() {
      const first = this._first;
      return first ? first.content.getContent()[0] : null;
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      this.insert(
        0,
        /** @type {Array<any>} */
        this._prelimContent
      );
      this._prelimContent = null;
    }
    _copy() {
      return new _YXmlFragment();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YXmlFragment}
     */
    clone() {
      const el = new _YXmlFragment();
      el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
      return el;
    }
    get length() {
      this.doc ?? warnPrematureAccess();
      return this._prelimContent === null ? this._length : this._prelimContent.length;
    }
    /**
     * Create a subtree of childNodes.
     *
     * @example
     * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
     * for (let node in walker) {
     *   // `node` is a div node
     *   nop(node)
     * }
     *
     * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
     *                          returns a Boolean indicating whether the child
     *                          is to be included in the subtree.
     * @return {YXmlTreeWalker} A subtree and a position within it.
     *
     * @public
     */
    createTreeWalker(filter) {
      return new YXmlTreeWalker(this, filter);
    }
    /**
     * Returns the first YXmlElement that matches the query.
     * Similar to DOM's {@link querySelector}.
     *
     * Query support:
     *   - tagname
     * TODO:
     *   - id
     *   - attribute
     *
     * @param {CSS_Selector} query The query on the children.
     * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
     *
     * @public
     */
    querySelector(query) {
      query = query.toUpperCase();
      const iterator = new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query);
      const next = iterator.next();
      if (next.done) {
        return null;
      } else {
        return next.value;
      }
    }
    /**
     * Returns all YXmlElements that match the query.
     * Similar to Dom's {@link querySelectorAll}.
     *
     * @todo Does not yet support all queries. Currently only query by tagName.
     *
     * @param {CSS_Selector} query The query on the children
     * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
     *
     * @public
     */
    querySelectorAll(query) {
      query = query.toUpperCase();
      return from(new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query));
    }
    /**
     * Creates YXmlEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, parentSubs) {
      callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
    }
    /**
     * Get the string representation of all the children of this YXmlFragment.
     *
     * @return {string} The string representation of all children.
     */
    toString() {
      return typeListMap(this, (xml) => xml.toString()).join("");
    }
    /**
     * @return {string}
     */
    toJSON() {
      return this.toString();
    }
    /**
     * Creates a Dom Element that mirrors this YXmlElement.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type.
     * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM(_document = document, hooks = {}, binding) {
      const fragment = _document.createDocumentFragment();
      if (binding !== void 0) {
        binding._createAssociation(fragment, this);
      }
      typeListForEach(this, (xmlType) => {
        fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
      });
      return fragment;
    }
    /**
     * Inserts new content at an index.
     *
     * @example
     *  // Insert character 'a' at position 0
     *  xml.insert(0, [new Y.XmlText('text')])
     *
     * @param {number} index The index to insert content at
     * @param {Array<YXmlElement|YXmlText>} content The array of content
     */
    insert(index, content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListInsertGenerics(transaction, this, index, content);
        });
      } else {
        this._prelimContent.splice(index, 0, ...content);
      }
    }
    /**
     * Inserts new content at an index.
     *
     * @example
     *  // Insert character 'a' at position 0
     *  xml.insert(0, [new Y.XmlText('text')])
     *
     * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
     * @param {Array<YXmlElement|YXmlText>} content The array of content
     */
    insertAfter(ref, content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          const refItem = ref && ref instanceof AbstractType ? ref._item : ref;
          typeListInsertGenericsAfter(transaction, this, refItem, content);
        });
      } else {
        const pc = (
          /** @type {Array<any>} */
          this._prelimContent
        );
        const index = ref === null ? 0 : pc.findIndex((el) => el === ref) + 1;
        if (index === 0 && ref !== null) {
          throw create3("Reference item not found");
        }
        pc.splice(index, 0, ...content);
      }
    }
    /**
     * Deletes elements starting from an index.
     *
     * @param {number} index Index at which to start deleting elements
     * @param {number} [length=1] The number of elements to remove. Defaults to 1.
     */
    delete(index, length3 = 1) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListDelete(transaction, this, index, length3);
        });
      } else {
        this._prelimContent.splice(index, length3);
      }
    }
    /**
     * Transforms this YArray to a JavaScript Array.
     *
     * @return {Array<YXmlElement|YXmlText|YXmlHook>}
     */
    toArray() {
      return typeListToArray(this);
    }
    /**
     * Appends content to this YArray.
     *
     * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
     */
    push(content) {
      this.insert(this.length, content);
    }
    /**
     * Prepends content to this YArray.
     *
     * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
     */
    unshift(content) {
      this.insert(0, content);
    }
    /**
     * Returns the i-th element from a YArray.
     *
     * @param {number} index The index of the element to return from the YArray
     * @return {YXmlElement|YXmlText}
     */
    get(index) {
      return typeListGet(this, index);
    }
    /**
     * Returns a portion of this YXmlFragment into a JavaScript Array selected
     * from start to end (end not included).
     *
     * @param {number} [start]
     * @param {number} [end]
     * @return {Array<YXmlElement|YXmlText>}
     */
    slice(start = 0, end = this.length) {
      return typeListSlice(this, start, end);
    }
    /**
     * Executes a provided function on once on every child element.
     *
     * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
     */
    forEach(f) {
      typeListForEach(this, f);
    }
    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     */
    _write(encoder) {
      encoder.writeTypeRef(YXmlFragmentRefID);
    }
  };
  var readYXmlFragment = (_decoder) => new YXmlFragment();
  var YXmlElement = class _YXmlElement extends YXmlFragment {
    constructor(nodeName = "UNDEFINED") {
      super();
      this.nodeName = nodeName;
      this._prelimAttrs = /* @__PURE__ */ new Map();
    }
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get nextSibling() {
      const n = this._item ? this._item.next : null;
      return n ? (
        /** @type {YXmlElement|YXmlText} */
        /** @type {ContentType} */
        n.content.type
      ) : null;
    }
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get prevSibling() {
      const n = this._item ? this._item.prev : null;
      return n ? (
        /** @type {YXmlElement|YXmlText} */
        /** @type {ContentType} */
        n.content.type
      ) : null;
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      /** @type {Map<string, any>} */
      this._prelimAttrs.forEach((value, key) => {
        this.setAttribute(key, value);
      });
      this._prelimAttrs = null;
    }
    /**
     * Creates an Item with the same effect as this Item (without position effect)
     *
     * @return {YXmlElement}
     */
    _copy() {
      return new _YXmlElement(this.nodeName);
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YXmlElement<KV>}
     */
    clone() {
      const el = new _YXmlElement(this.nodeName);
      const attrs = this.getAttributes();
      forEach(attrs, (value, key) => {
        if (typeof value === "string") {
          el.setAttribute(key, value);
        }
      });
      el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
      return el;
    }
    /**
     * Returns the XML serialization of this YXmlElement.
     * The attributes are ordered by attribute-name, so you can easily use this
     * method to compare YXmlElements
     *
     * @return {string} The string representation of this type.
     *
     * @public
     */
    toString() {
      const attrs = this.getAttributes();
      const stringBuilder = [];
      const keys2 = [];
      for (const key in attrs) {
        keys2.push(key);
      }
      keys2.sort();
      const keysLen = keys2.length;
      for (let i = 0; i < keysLen; i++) {
        const key = keys2[i];
        stringBuilder.push(key + '="' + attrs[key] + '"');
      }
      const nodeName = this.nodeName.toLocaleLowerCase();
      const attrsString = stringBuilder.length > 0 ? " " + stringBuilder.join(" ") : "";
      return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`;
    }
    /**
     * Removes an attribute from this YXmlElement.
     *
     * @param {string} attributeName The attribute name that is to be removed.
     *
     * @public
     */
    removeAttribute(attributeName) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapDelete(transaction, this, attributeName);
        });
      } else {
        this._prelimAttrs.delete(attributeName);
      }
    }
    /**
     * Sets or updates an attribute.
     *
     * @template {keyof KV & string} KEY
     *
     * @param {KEY} attributeName The attribute name that is to be set.
     * @param {KV[KEY]} attributeValue The attribute value that is to be set.
     *
     * @public
     */
    setAttribute(attributeName, attributeValue) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapSet(transaction, this, attributeName, attributeValue);
        });
      } else {
        this._prelimAttrs.set(attributeName, attributeValue);
      }
    }
    /**
     * Returns an attribute value that belongs to the attribute name.
     *
     * @template {keyof KV & string} KEY
     *
     * @param {KEY} attributeName The attribute name that identifies the
     *                               queried value.
     * @return {KV[KEY]|undefined} The queried attribute value.
     *
     * @public
     */
    getAttribute(attributeName) {
      return (
        /** @type {any} */
        typeMapGet(this, attributeName)
      );
    }
    /**
     * Returns whether an attribute exists
     *
     * @param {string} attributeName The attribute name to check for existence.
     * @return {boolean} whether the attribute exists.
     *
     * @public
     */
    hasAttribute(attributeName) {
      return (
        /** @type {any} */
        typeMapHas(this, attributeName)
      );
    }
    /**
     * Returns all attribute name/value pairs in a JSON Object.
     *
     * @param {Snapshot} [snapshot]
     * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
     *
     * @public
     */
    getAttributes(snapshot) {
      return (
        /** @type {any} */
        snapshot ? typeMapGetAllSnapshot(this, snapshot) : typeMapGetAll(this)
      );
    }
    /**
     * Creates a Dom Element that mirrors this YXmlElement.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type.
     * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM(_document = document, hooks = {}, binding) {
      const dom = _document.createElement(this.nodeName);
      const attrs = this.getAttributes();
      for (const key in attrs) {
        const value = attrs[key];
        if (typeof value === "string") {
          dom.setAttribute(key, value);
        }
      }
      typeListForEach(this, (yxml) => {
        dom.appendChild(yxml.toDOM(_document, hooks, binding));
      });
      if (binding !== void 0) {
        binding._createAssociation(dom, this);
      }
      return dom;
    }
    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     */
    _write(encoder) {
      encoder.writeTypeRef(YXmlElementRefID);
      encoder.writeKey(this.nodeName);
    }
  };
  var readYXmlElement = (decoder) => new YXmlElement(decoder.readKey());
  var YXmlEvent = class extends YEvent {
    /**
     * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
     * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
     *                   child list changed.
     * @param {Transaction} transaction The transaction instance with which the
     *                                  change was created.
     */
    constructor(target, subs, transaction) {
      super(target, transaction);
      this.childListChanged = false;
      this.attributesChanged = /* @__PURE__ */ new Set();
      subs.forEach((sub) => {
        if (sub === null) {
          this.childListChanged = true;
        } else {
          this.attributesChanged.add(sub);
        }
      });
    }
  };
  var YXmlHook = class _YXmlHook extends YMap {
    /**
     * @param {string} hookName nodeName of the Dom Node.
     */
    constructor(hookName) {
      super();
      this.hookName = hookName;
    }
    /**
     * Creates an Item with the same effect as this Item (without position effect)
     */
    _copy() {
      return new _YXmlHook(this.hookName);
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YXmlHook}
     */
    clone() {
      const el = new _YXmlHook(this.hookName);
      this.forEach((value, key) => {
        el.set(key, value);
      });
      return el;
    }
    /**
     * Creates a Dom Element that mirrors this YXmlElement.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type
     * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM(_document = document, hooks = {}, binding) {
      const hook = hooks[this.hookName];
      let dom;
      if (hook !== void 0) {
        dom = hook.createDom(this);
      } else {
        dom = document.createElement(this.hookName);
      }
      dom.setAttribute("data-yjs-hook", this.hookName);
      if (binding !== void 0) {
        binding._createAssociation(dom, this);
      }
      return dom;
    }
    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     */
    _write(encoder) {
      encoder.writeTypeRef(YXmlHookRefID);
      encoder.writeKey(this.hookName);
    }
  };
  var readYXmlHook = (decoder) => new YXmlHook(decoder.readKey());
  var YXmlText = class _YXmlText extends YText {
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get nextSibling() {
      const n = this._item ? this._item.next : null;
      return n ? (
        /** @type {YXmlElement|YXmlText} */
        /** @type {ContentType} */
        n.content.type
      ) : null;
    }
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get prevSibling() {
      const n = this._item ? this._item.prev : null;
      return n ? (
        /** @type {YXmlElement|YXmlText} */
        /** @type {ContentType} */
        n.content.type
      ) : null;
    }
    _copy() {
      return new _YXmlText();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YXmlText}
     */
    clone() {
      const text2 = new _YXmlText();
      text2.applyDelta(this.toDelta());
      return text2;
    }
    /**
     * Creates a Dom Element that mirrors this YXmlText.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object<string, any>} [hooks] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type.
     * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM(_document = document, hooks, binding) {
      const dom = _document.createTextNode(this.toString());
      if (binding !== void 0) {
        binding._createAssociation(dom, this);
      }
      return dom;
    }
    toString() {
      return this.toDelta().map((delta) => {
        const nestedNodes = [];
        for (const nodeName in delta.attributes) {
          const attrs = [];
          for (const key in delta.attributes[nodeName]) {
            attrs.push({ key, value: delta.attributes[nodeName][key] });
          }
          attrs.sort((a, b) => a.key < b.key ? -1 : 1);
          nestedNodes.push({ nodeName, attrs });
        }
        nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
        let str = "";
        for (let i = 0; i < nestedNodes.length; i++) {
          const node = nestedNodes[i];
          str += `<${node.nodeName}`;
          for (let j = 0; j < node.attrs.length; j++) {
            const attr = node.attrs[j];
            str += ` ${attr.key}="${attr.value}"`;
          }
          str += ">";
        }
        str += delta.insert;
        for (let i = nestedNodes.length - 1; i >= 0; i--) {
          str += `</${nestedNodes[i].nodeName}>`;
        }
        return str;
      }).join("");
    }
    /**
     * @return {string}
     */
    toJSON() {
      return this.toString();
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    _write(encoder) {
      encoder.writeTypeRef(YXmlTextRefID);
    }
  };
  var readYXmlText = (decoder) => new YXmlText();
  var AbstractStruct = class {
    /**
     * @param {ID} id
     * @param {number} length
     */
    constructor(id2, length3) {
      this.id = id2;
      this.length = length3;
    }
    /**
     * @type {boolean}
     */
    get deleted() {
      throw methodUnimplemented();
    }
    /**
     * Merge this struct with the item to the right.
     * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
     * Also this method does *not* remove right from StructStore!
     * @param {AbstractStruct} right
     * @return {boolean} whether this merged with right
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     * @param {number} offset
     * @param {number} encodingRef
     */
    write(encoder, offset, encodingRef) {
      throw methodUnimplemented();
    }
    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate(transaction, offset) {
      throw methodUnimplemented();
    }
  };
  var structGCRefNumber = 0;
  var GC = class extends AbstractStruct {
    get deleted() {
      return true;
    }
    delete() {
    }
    /**
     * @param {GC} right
     * @return {boolean}
     */
    mergeWith(right) {
      if (this.constructor !== right.constructor) {
        return false;
      }
      this.length += right.length;
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate(transaction, offset) {
      if (offset > 0) {
        this.id.clock += offset;
        this.length -= offset;
      }
      addStruct(transaction.doc.store, this);
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeInfo(structGCRefNumber);
      encoder.writeLen(this.length - offset);
    }
    /**
     * @param {Transaction} transaction
     * @param {StructStore} store
     * @return {null | number}
     */
    getMissing(transaction, store) {
      return null;
    }
  };
  var ContentBinary = class _ContentBinary {
    /**
     * @param {Uint8Array} content
     */
    constructor(content) {
      this.content = content;
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [this.content];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentBinary}
     */
    copy() {
      return new _ContentBinary(this.content);
    }
    /**
     * @param {number} offset
     * @return {ContentBinary}
     */
    splice(offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentBinary} right
     * @return {boolean}
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeBuf(this.content);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 3;
    }
  };
  var readContentBinary = (decoder) => new ContentBinary(decoder.readBuf());
  var ContentDeleted = class _ContentDeleted {
    /**
     * @param {number} len
     */
    constructor(len) {
      this.len = len;
    }
    /**
     * @return {number}
     */
    getLength() {
      return this.len;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return false;
    }
    /**
     * @return {ContentDeleted}
     */
    copy() {
      return new _ContentDeleted(this.len);
    }
    /**
     * @param {number} offset
     * @return {ContentDeleted}
     */
    splice(offset) {
      const right = new _ContentDeleted(this.len - offset);
      this.len = offset;
      return right;
    }
    /**
     * @param {ContentDeleted} right
     * @return {boolean}
     */
    mergeWith(right) {
      this.len += right.len;
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
      addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
      item.markDeleted();
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeLen(this.len - offset);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 1;
    }
  };
  var readContentDeleted = (decoder) => new ContentDeleted(decoder.readLen());
  var createDocFromOpts = (guid, opts) => new Doc({ guid, ...opts, shouldLoad: opts.shouldLoad || opts.autoLoad || false });
  var ContentDoc = class _ContentDoc {
    /**
     * @param {Doc} doc
     */
    constructor(doc2) {
      if (doc2._item) {
        console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid.");
      }
      this.doc = doc2;
      const opts = {};
      this.opts = opts;
      if (!doc2.gc) {
        opts.gc = false;
      }
      if (doc2.autoLoad) {
        opts.autoLoad = true;
      }
      if (doc2.meta !== null) {
        opts.meta = doc2.meta;
      }
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [this.doc];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentDoc}
     */
    copy() {
      return new _ContentDoc(createDocFromOpts(this.doc.guid, this.opts));
    }
    /**
     * @param {number} offset
     * @return {ContentDoc}
     */
    splice(offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentDoc} right
     * @return {boolean}
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
      this.doc._item = item;
      transaction.subdocsAdded.add(this.doc);
      if (this.doc.shouldLoad) {
        transaction.subdocsLoaded.add(this.doc);
      }
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
      if (transaction.subdocsAdded.has(this.doc)) {
        transaction.subdocsAdded.delete(this.doc);
      } else {
        transaction.subdocsRemoved.add(this.doc);
      }
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeString(this.doc.guid);
      encoder.writeAny(this.opts);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 9;
    }
  };
  var readContentDoc = (decoder) => new ContentDoc(createDocFromOpts(decoder.readString(), decoder.readAny()));
  var ContentEmbed = class _ContentEmbed {
    /**
     * @param {Object} embed
     */
    constructor(embed) {
      this.embed = embed;
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [this.embed];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentEmbed}
     */
    copy() {
      return new _ContentEmbed(this.embed);
    }
    /**
     * @param {number} offset
     * @return {ContentEmbed}
     */
    splice(offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentEmbed} right
     * @return {boolean}
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeJSON(this.embed);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 5;
    }
  };
  var readContentEmbed = (decoder) => new ContentEmbed(decoder.readJSON());
  var ContentFormat = class _ContentFormat {
    /**
     * @param {string} key
     * @param {Object} value
     */
    constructor(key, value) {
      this.key = key;
      this.value = value;
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return false;
    }
    /**
     * @return {ContentFormat}
     */
    copy() {
      return new _ContentFormat(this.key, this.value);
    }
    /**
     * @param {number} _offset
     * @return {ContentFormat}
     */
    splice(_offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentFormat} _right
     * @return {boolean}
     */
    mergeWith(_right) {
      return false;
    }
    /**
     * @param {Transaction} _transaction
     * @param {Item} item
     */
    integrate(_transaction, item) {
      const p = (
        /** @type {YText} */
        item.parent
      );
      p._searchMarker = null;
      p._hasFormatting = true;
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeKey(this.key);
      encoder.writeJSON(this.value);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 6;
    }
  };
  var readContentFormat = (decoder) => new ContentFormat(decoder.readKey(), decoder.readJSON());
  var ContentJSON = class _ContentJSON {
    /**
     * @param {Array<any>} arr
     */
    constructor(arr) {
      this.arr = arr;
    }
    /**
     * @return {number}
     */
    getLength() {
      return this.arr.length;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return this.arr;
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentJSON}
     */
    copy() {
      return new _ContentJSON(this.arr);
    }
    /**
     * @param {number} offset
     * @return {ContentJSON}
     */
    splice(offset) {
      const right = new _ContentJSON(this.arr.slice(offset));
      this.arr = this.arr.slice(0, offset);
      return right;
    }
    /**
     * @param {ContentJSON} right
     * @return {boolean}
     */
    mergeWith(right) {
      this.arr = this.arr.concat(right.arr);
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      const len = this.arr.length;
      encoder.writeLen(len - offset);
      for (let i = offset; i < len; i++) {
        const c = this.arr[i];
        encoder.writeString(c === void 0 ? "undefined" : JSON.stringify(c));
      }
    }
    /**
     * @return {number}
     */
    getRef() {
      return 2;
    }
  };
  var readContentJSON = (decoder) => {
    const len = decoder.readLen();
    const cs = [];
    for (let i = 0; i < len; i++) {
      const c = decoder.readString();
      if (c === "undefined") {
        cs.push(void 0);
      } else {
        cs.push(JSON.parse(c));
      }
    }
    return new ContentJSON(cs);
  };
  var isDevMode = getVariable("node_env") === "development";
  var ContentAny = class _ContentAny {
    /**
     * @param {Array<any>} arr
     */
    constructor(arr) {
      this.arr = arr;
      isDevMode && deepFreeze(arr);
    }
    /**
     * @return {number}
     */
    getLength() {
      return this.arr.length;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return this.arr;
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentAny}
     */
    copy() {
      return new _ContentAny(this.arr);
    }
    /**
     * @param {number} offset
     * @return {ContentAny}
     */
    splice(offset) {
      const right = new _ContentAny(this.arr.slice(offset));
      this.arr = this.arr.slice(0, offset);
      return right;
    }
    /**
     * @param {ContentAny} right
     * @return {boolean}
     */
    mergeWith(right) {
      this.arr = this.arr.concat(right.arr);
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      const len = this.arr.length;
      encoder.writeLen(len - offset);
      for (let i = offset; i < len; i++) {
        const c = this.arr[i];
        encoder.writeAny(c);
      }
    }
    /**
     * @return {number}
     */
    getRef() {
      return 8;
    }
  };
  var readContentAny = (decoder) => {
    const len = decoder.readLen();
    const cs = [];
    for (let i = 0; i < len; i++) {
      cs.push(decoder.readAny());
    }
    return new ContentAny(cs);
  };
  var ContentString = class _ContentString {
    /**
     * @param {string} str
     */
    constructor(str) {
      this.str = str;
    }
    /**
     * @return {number}
     */
    getLength() {
      return this.str.length;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return this.str.split("");
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentString}
     */
    copy() {
      return new _ContentString(this.str);
    }
    /**
     * @param {number} offset
     * @return {ContentString}
     */
    splice(offset) {
      const right = new _ContentString(this.str.slice(offset));
      this.str = this.str.slice(0, offset);
      const firstCharCode = this.str.charCodeAt(offset - 1);
      if (firstCharCode >= 55296 && firstCharCode <= 56319) {
        this.str = this.str.slice(0, offset - 1) + "\uFFFD";
        right.str = "\uFFFD" + right.str.slice(1);
      }
      return right;
    }
    /**
     * @param {ContentString} right
     * @return {boolean}
     */
    mergeWith(right) {
      this.str += right.str;
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
    }
    /**
     * @return {number}
     */
    getRef() {
      return 4;
    }
  };
  var readContentString = (decoder) => new ContentString(decoder.readString());
  var typeRefs = [
    readYArray,
    readYMap,
    readYText,
    readYXmlElement,
    readYXmlFragment,
    readYXmlHook,
    readYXmlText
  ];
  var YArrayRefID = 0;
  var YMapRefID = 1;
  var YTextRefID = 2;
  var YXmlElementRefID = 3;
  var YXmlFragmentRefID = 4;
  var YXmlHookRefID = 5;
  var YXmlTextRefID = 6;
  var ContentType = class _ContentType {
    /**
     * @param {AbstractType<any>} type
     */
    constructor(type) {
      this.type = type;
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [this.type];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentType}
     */
    copy() {
      return new _ContentType(this.type._copy());
    }
    /**
     * @param {number} offset
     * @return {ContentType}
     */
    splice(offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentType} right
     * @return {boolean}
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
      this.type._integrate(transaction.doc, item);
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
      let item = this.type._start;
      while (item !== null) {
        if (!item.deleted) {
          item.delete(transaction);
        } else if (item.id.clock < (transaction.beforeState.get(item.id.client) || 0)) {
          transaction._mergeStructs.push(item);
        }
        item = item.right;
      }
      this.type._map.forEach((item2) => {
        if (!item2.deleted) {
          item2.delete(transaction);
        } else if (item2.id.clock < (transaction.beforeState.get(item2.id.client) || 0)) {
          transaction._mergeStructs.push(item2);
        }
      });
      transaction.changed.delete(this.type);
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
      let item = this.type._start;
      while (item !== null) {
        item.gc(store, true);
        item = item.right;
      }
      this.type._start = null;
      this.type._map.forEach(
        /** @param {Item | null} item */
        (item2) => {
          while (item2 !== null) {
            item2.gc(store, true);
            item2 = item2.left;
          }
        }
      );
      this.type._map = /* @__PURE__ */ new Map();
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      this.type._write(encoder);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 7;
    }
  };
  var readContentType = (decoder) => new ContentType(typeRefs[decoder.readTypeRef()](decoder));
  var followRedone = (store, id2) => {
    let nextID = id2;
    let diff = 0;
    let item;
    do {
      if (diff > 0) {
        nextID = createID(nextID.client, nextID.clock + diff);
      }
      item = getItem(store, nextID);
      diff = nextID.clock - item.id.clock;
      nextID = item.redone;
    } while (nextID !== null && item instanceof Item);
    return {
      item,
      diff
    };
  };
  var splitItem = (transaction, leftItem, diff) => {
    const { client, clock } = leftItem.id;
    const rightItem = new Item(
      createID(client, clock + diff),
      leftItem,
      createID(client, clock + diff - 1),
      leftItem.right,
      leftItem.rightOrigin,
      leftItem.parent,
      leftItem.parentSub,
      leftItem.content.splice(diff)
    );
    if (leftItem.deleted) {
      rightItem.markDeleted();
    }
    if (leftItem.keep) {
      rightItem.keep = true;
    }
    if (leftItem.redone !== null) {
      rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
    }
    leftItem.right = rightItem;
    if (rightItem.right !== null) {
      rightItem.right.left = rightItem;
    }
    transaction._mergeStructs.push(rightItem);
    if (rightItem.parentSub !== null && rightItem.right === null) {
      rightItem.parent._map.set(rightItem.parentSub, rightItem);
    }
    leftItem.length = diff;
    return rightItem;
  };
  var Item = class _Item extends AbstractStruct {
    /**
     * @param {ID} id
     * @param {Item | null} left
     * @param {ID | null} origin
     * @param {Item | null} right
     * @param {ID | null} rightOrigin
     * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
     * @param {string | null} parentSub
     * @param {AbstractContent} content
     */
    constructor(id2, left, origin, right, rightOrigin, parent, parentSub, content) {
      super(id2, content.getLength());
      this.origin = origin;
      this.left = left;
      this.right = right;
      this.rightOrigin = rightOrigin;
      this.parent = parent;
      this.parentSub = parentSub;
      this.redone = null;
      this.content = content;
      this.info = this.content.isCountable() ? BIT2 : 0;
    }
    /**
     * This is used to mark the item as an indexed fast-search marker
     *
     * @type {boolean}
     */
    set marker(isMarked) {
      if ((this.info & BIT4) > 0 !== isMarked) {
        this.info ^= BIT4;
      }
    }
    get marker() {
      return (this.info & BIT4) > 0;
    }
    /**
     * If true, do not garbage collect this Item.
     */
    get keep() {
      return (this.info & BIT1) > 0;
    }
    set keep(doKeep) {
      if (this.keep !== doKeep) {
        this.info ^= BIT1;
      }
    }
    get countable() {
      return (this.info & BIT2) > 0;
    }
    /**
     * Whether this item was deleted or not.
     * @type {Boolean}
     */
    get deleted() {
      return (this.info & BIT3) > 0;
    }
    set deleted(doDelete) {
      if (this.deleted !== doDelete) {
        this.info ^= BIT3;
      }
    }
    markDeleted() {
      this.info |= BIT3;
    }
    /**
     * Return the creator clientID of the missing op or define missing items and return null.
     *
     * @param {Transaction} transaction
     * @param {StructStore} store
     * @return {null | number}
     */
    getMissing(transaction, store) {
      if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
        return this.origin.client;
      }
      if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
        return this.rightOrigin.client;
      }
      if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
        return this.parent.client;
      }
      if (this.origin) {
        this.left = getItemCleanEnd(transaction, store, this.origin);
        this.origin = this.left.lastId;
      }
      if (this.rightOrigin) {
        this.right = getItemCleanStart(transaction, this.rightOrigin);
        this.rightOrigin = this.right.id;
      }
      if (this.left && this.left.constructor === GC || this.right && this.right.constructor === GC) {
        this.parent = null;
      } else if (!this.parent) {
        if (this.left && this.left.constructor === _Item) {
          this.parent = this.left.parent;
          this.parentSub = this.left.parentSub;
        } else if (this.right && this.right.constructor === _Item) {
          this.parent = this.right.parent;
          this.parentSub = this.right.parentSub;
        }
      } else if (this.parent.constructor === ID) {
        const parentItem = getItem(store, this.parent);
        if (parentItem.constructor === GC) {
          this.parent = null;
        } else {
          this.parent = /** @type {ContentType} */
          parentItem.content.type;
        }
      }
      return null;
    }
    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate(transaction, offset) {
      if (offset > 0) {
        this.id.clock += offset;
        this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
        this.origin = this.left.lastId;
        this.content = this.content.splice(offset);
        this.length -= offset;
      }
      if (this.parent) {
        if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
          let left = this.left;
          let o;
          if (left !== null) {
            o = left.right;
          } else if (this.parentSub !== null) {
            o = /** @type {AbstractType<any>} */
            this.parent._map.get(this.parentSub) || null;
            while (o !== null && o.left !== null) {
              o = o.left;
            }
          } else {
            o = /** @type {AbstractType<any>} */
            this.parent._start;
          }
          const conflictingItems = /* @__PURE__ */ new Set();
          const itemsBeforeOrigin = /* @__PURE__ */ new Set();
          while (o !== null && o !== this.right) {
            itemsBeforeOrigin.add(o);
            conflictingItems.add(o);
            if (compareIDs(this.origin, o.origin)) {
              if (o.id.client < this.id.client) {
                left = o;
                conflictingItems.clear();
              } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
                break;
              }
            } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
              if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
                left = o;
                conflictingItems.clear();
              }
            } else {
              break;
            }
            o = o.right;
          }
          this.left = left;
        }
        if (this.left !== null) {
          const right = this.left.right;
          this.right = right;
          this.left.right = this;
        } else {
          let r;
          if (this.parentSub !== null) {
            r = /** @type {AbstractType<any>} */
            this.parent._map.get(this.parentSub) || null;
            while (r !== null && r.left !== null) {
              r = r.left;
            }
          } else {
            r = /** @type {AbstractType<any>} */
            this.parent._start;
            this.parent._start = this;
          }
          this.right = r;
        }
        if (this.right !== null) {
          this.right.left = this;
        } else if (this.parentSub !== null) {
          this.parent._map.set(this.parentSub, this);
          if (this.left !== null) {
            this.left.delete(transaction);
          }
        }
        if (this.parentSub === null && this.countable && !this.deleted) {
          this.parent._length += this.length;
        }
        addStruct(transaction.doc.store, this);
        this.content.integrate(transaction, this);
        addChangedTypeToTransaction(
          transaction,
          /** @type {AbstractType<any>} */
          this.parent,
          this.parentSub
        );
        if (
          /** @type {AbstractType<any>} */
          this.parent._item !== null && /** @type {AbstractType<any>} */
          this.parent._item.deleted || this.parentSub !== null && this.right !== null
        ) {
          this.delete(transaction);
        }
      } else {
        new GC(this.id, this.length).integrate(transaction, 0);
      }
    }
    /**
     * Returns the next non-deleted item
     */
    get next() {
      let n = this.right;
      while (n !== null && n.deleted) {
        n = n.right;
      }
      return n;
    }
    /**
     * Returns the previous non-deleted item
     */
    get prev() {
      let n = this.left;
      while (n !== null && n.deleted) {
        n = n.left;
      }
      return n;
    }
    /**
     * Computes the last content address of this Item.
     */
    get lastId() {
      return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1);
    }
    /**
     * Try to merge two items
     *
     * @param {Item} right
     * @return {boolean}
     */
    mergeWith(right) {
      if (this.constructor === right.constructor && compareIDs(right.origin, this.lastId) && this.right === right && compareIDs(this.rightOrigin, right.rightOrigin) && this.id.client === right.id.client && this.id.clock + this.length === right.id.clock && this.deleted === right.deleted && this.redone === null && right.redone === null && this.content.constructor === right.content.constructor && this.content.mergeWith(right.content)) {
        const searchMarker = (
          /** @type {AbstractType<any>} */
          this.parent._searchMarker
        );
        if (searchMarker) {
          searchMarker.forEach((marker) => {
            if (marker.p === right) {
              marker.p = this;
              if (!this.deleted && this.countable) {
                marker.index -= this.length;
              }
            }
          });
        }
        if (right.keep) {
          this.keep = true;
        }
        this.right = right.right;
        if (this.right !== null) {
          this.right.left = this;
        }
        this.length += right.length;
        return true;
      }
      return false;
    }
    /**
     * Mark this Item as deleted.
     *
     * @param {Transaction} transaction
     */
    delete(transaction) {
      if (!this.deleted) {
        const parent = (
          /** @type {AbstractType<any>} */
          this.parent
        );
        if (this.countable && this.parentSub === null) {
          parent._length -= this.length;
        }
        this.markDeleted();
        addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
        addChangedTypeToTransaction(transaction, parent, this.parentSub);
        this.content.delete(transaction);
      }
    }
    /**
     * @param {StructStore} store
     * @param {boolean} parentGCd
     */
    gc(store, parentGCd) {
      if (!this.deleted) {
        throw unexpectedCase();
      }
      this.content.gc(store);
      if (parentGCd) {
        replaceStruct(store, this, new GC(this.id, this.length));
      } else {
        this.content = new ContentDeleted(this.length);
      }
    }
    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     * @param {number} offset
     */
    write(encoder, offset) {
      const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
      const rightOrigin = this.rightOrigin;
      const parentSub = this.parentSub;
      const info = this.content.getRef() & BITS5 | (origin === null ? 0 : BIT8) | // origin is defined
      (rightOrigin === null ? 0 : BIT7) | // right origin is defined
      (parentSub === null ? 0 : BIT6);
      encoder.writeInfo(info);
      if (origin !== null) {
        encoder.writeLeftID(origin);
      }
      if (rightOrigin !== null) {
        encoder.writeRightID(rightOrigin);
      }
      if (origin === null && rightOrigin === null) {
        const parent = (
          /** @type {AbstractType<any>} */
          this.parent
        );
        if (parent._item !== void 0) {
          const parentItem = parent._item;
          if (parentItem === null) {
            const ykey = findRootTypeKey(parent);
            encoder.writeParentInfo(true);
            encoder.writeString(ykey);
          } else {
            encoder.writeParentInfo(false);
            encoder.writeLeftID(parentItem.id);
          }
        } else if (parent.constructor === String) {
          encoder.writeParentInfo(true);
          encoder.writeString(parent);
        } else if (parent.constructor === ID) {
          encoder.writeParentInfo(false);
          encoder.writeLeftID(parent);
        } else {
          unexpectedCase();
        }
        if (parentSub !== null) {
          encoder.writeString(parentSub);
        }
      }
      this.content.write(encoder, offset);
    }
  };
  var readItemContent = (decoder, info) => contentRefs[info & BITS5](decoder);
  var contentRefs = [
    () => {
      unexpectedCase();
    },
    // GC is not ItemContent
    readContentDeleted,
    // 1
    readContentJSON,
    // 2
    readContentBinary,
    // 3
    readContentString,
    // 4
    readContentEmbed,
    // 5
    readContentFormat,
    // 6
    readContentType,
    // 7
    readContentAny,
    // 8
    readContentDoc,
    // 9
    () => {
      unexpectedCase();
    }
    // 10 - Skip is not ItemContent
  ];
  var structSkipRefNumber = 10;
  var Skip = class extends AbstractStruct {
    get deleted() {
      return true;
    }
    delete() {
    }
    /**
     * @param {Skip} right
     * @return {boolean}
     */
    mergeWith(right) {
      if (this.constructor !== right.constructor) {
        return false;
      }
      this.length += right.length;
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate(transaction, offset) {
      unexpectedCase();
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeInfo(structSkipRefNumber);
      writeVarUint(encoder.restEncoder, this.length - offset);
    }
    /**
     * @param {Transaction} transaction
     * @param {StructStore} store
     * @return {null | number}
     */
    getMissing(transaction, store) {
      return null;
    }
  };
  var glo = (
    /** @type {any} */
    typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}
  );
  var importIdentifier = "__ $YJS$ __";
  if (glo[importIdentifier] === true) {
    console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
  }
  glo[importIdentifier] = true;

  // node_modules/lib0/mutex.js
  var createMutex = () => {
    let token = true;
    return (f, g) => {
      if (token) {
        token = false;
        try {
          f();
        } finally {
          token = true;
        }
      } else if (g !== void 0) {
        g();
      }
    };
  };

  // node_modules/lib0/diff.js
  var highSurrogateRegex = /[\uD800-\uDBFF]/;
  var lowSurrogateRegex = /[\uDC00-\uDFFF]/;
  var simpleDiffString = (a, b) => {
    let left = 0;
    let right = 0;
    while (left < a.length && left < b.length && a[left] === b[left]) {
      left++;
    }
    if (left > 0 && highSurrogateRegex.test(a[left - 1])) left--;
    while (right + left < a.length && right + left < b.length && a[a.length - right - 1] === b[b.length - right - 1]) {
      right++;
    }
    if (right > 0 && lowSurrogateRegex.test(a[a.length - right])) right--;
    return {
      index: left,
      remove: a.length - left - right,
      insert: b.slice(left, b.length - right)
    };
  };

  // node_modules/y-codemirror/src/y-codemirror.js
  var import_codemirror = __toESM(require_codemirror(), 1);
  var cmOrigin = "y-codemirror";
  var typeObserver = (binding, event) => {
    binding._mux(() => {
      const cmDoc = binding.cmDoc;
      const cm = cmDoc.getEditor();
      let anchor = cm.indexFromPos(cm.getCursor("anchor"));
      let head = cm.indexFromPos(cm.getCursor("head"));
      const switchSel = head < anchor;
      if (switchSel) {
        const tmp = head;
        head = anchor;
        anchor = tmp;
      }
      const performChange = () => {
        const delta = event.delta;
        let index = 0;
        for (let i = 0; i < event.delta.length; i++) {
          const d = delta[i];
          if (d.retain) {
            index += d.retain;
          } else if (d.insert) {
            if (index < anchor || anchor < head && index === anchor) {
              anchor += d.insert.length;
            }
            if (index < head) {
              head += d.insert.length;
            }
            const pos = cmDoc.posFromIndex(index);
            cmDoc.replaceRange(d.insert, pos, pos, cmOrigin);
            index += d.insert.length;
          } else if (d.delete) {
            if (index < anchor) {
              anchor = max(anchor - d.delete, index);
            }
            if (index < head) {
              head = max(head - d.delete, index);
            }
            const start = cmDoc.posFromIndex(index);
            const end = cmDoc.posFromIndex(index + d.delete);
            cmDoc.replaceRange("", start, end, cmOrigin);
          }
        }
      };
      if (cm) {
        cm.operation(performChange);
      } else {
        performChange();
      }
      if (switchSel) {
        const tmp = head;
        head = anchor;
        anchor = tmp;
      }
      cm.setSelection(cm.posFromIndex(anchor), cm.posFromIndex(head), { scroll: false });
    });
  };
  var targetObserver = (binding, changes) => {
    binding._mux(() => {
      binding.doc.transact(() => {
        const hasPaste = binding.yUndoManager && changes.some((change) => change.origin === "paste");
        if (hasPaste) {
          binding.yUndoManager.stopCapturing();
        }
        if (changes.length > 1) {
          const d = simpleDiffString(binding.type.toString(), binding.cmDoc.getValue());
          binding.type.delete(d.index, d.remove);
          binding.type.insert(d.index, d.insert);
        } else {
          const change = changes[0];
          const start = binding.cmDoc.indexFromPos(change.from);
          const delLen = change.removed.map((s) => s.length).reduce(add) + change.removed.length - 1;
          if (delLen > 0) {
            binding.type.delete(start, delLen);
          }
          if (change.text.length > 0) {
            binding.type.insert(start, change.text.join("\n"));
          }
        }
        if (hasPaste) {
          binding.yUndoManager.stopCapturing();
        }
      }, binding);
    });
    if (binding._pendingCursorEvent) {
      binding._pendingCursorEvent = false;
      binding.emit("cursorActivity", [binding]);
    }
  };
  var createRemoteCaret = (username, color) => {
    const caret = document.createElement("span");
    caret.classList.add("remote-caret");
    caret.setAttribute("style", `border-color: ${color}`);
    const userDiv = document.createElement("div");
    userDiv.setAttribute("style", `background-color: ${color}`);
    userDiv.insertBefore(document.createTextNode(username), null);
    caret.insertBefore(userDiv, null);
    setTimeout(() => {
      caret.classList.add("hide-name");
    }, 2e3);
    return caret;
  };
  var createEmptyLinePlaceholder = (color) => {
    const placeholder = document.createElement("span");
    placeholder.setAttribute("style", "user-select: none;");
    const emptyTxt = document.createElement("span");
    emptyTxt.insertBefore(document.createTextNode(""), null);
    const sel = document.createElement("span");
    sel.setAttribute("class", "y-line-selection");
    sel.setAttribute("style", `display: inline-block; position: absolute; left: 4px; right: 4px; top: 0; bottom: 0; background-color: ${color}70`);
    placeholder.insertBefore(sel, null);
    placeholder.insertBefore(emptyTxt, null);
    return placeholder;
  };
  var updateRemoteSelection = (y, cm, type, cursors, clientId, awareness) => {
    const aw = awareness.getStates().get(clientId);
    const m = cursors.get(clientId);
    if (m !== void 0) {
      if (m.caret) {
        m.caret.clear();
      }
      m.sel.forEach((sel) => sel.clear());
      cursors.delete(clientId);
    }
    if (aw === void 0) {
      return;
    }
    const user = aw.user || {};
    if (user.color == null) {
      user.color = "#ffa500";
    }
    if (user.name == null) {
      user.name = `User: ${clientId}`;
    }
    const cursor = aw.cursor;
    if (cursor == null || cursor.anchor == null || cursor.head == null) {
      return;
    }
    const anchor = createAbsolutePositionFromRelativePosition(JSON.parse(cursor.anchor), y);
    const head = createAbsolutePositionFromRelativePosition(JSON.parse(cursor.head), y);
    if (anchor !== null && head !== null && anchor.type === type && head.type === type) {
      const headpos = cm.posFromIndex(head.index);
      const anchorpos = cm.posFromIndex(anchor.index);
      let from2, to;
      if (head.index < anchor.index) {
        from2 = headpos;
        to = anchorpos;
      } else {
        from2 = anchorpos;
        to = headpos;
      }
      const caretEl = createRemoteCaret(user.name, user.color);
      if (m && equalityFlat(aw.cursor.anchor, m.awCursor.anchor) && equalityFlat(aw.cursor.head, m.awCursor.head)) {
        caretEl.classList.add("hide-name");
      }
      const sel = [];
      if (head.index !== anchor.index) {
        if (from2.line !== to.line && from2.ch !== 0) {
          sel.push(cm.markText(from2, new import_codemirror.default.Pos(from2.line + 1, 0), { css: `background-color: ${user.color}70;`, inclusiveRight: false, inclusiveLeft: false }));
          from2 = new import_codemirror.default.Pos(from2.line + 1, 0);
        }
        while (from2.line !== to.line) {
          sel.push(cm.setBookmark(new import_codemirror.default.Pos(from2.line, 0), { widget: createEmptyLinePlaceholder(user.color) }));
          from2 = new import_codemirror.default.Pos(from2.line + 1, 0);
        }
        sel.push(cm.markText(from2, to, { css: `background-color: ${user.color}70;`, inclusiveRight: false, inclusiveLeft: false }));
      }
      const caret = sel.length > 0 && to === headpos && headpos.ch === 0 ? null : cm.setBookmark(headpos, { widget: caretEl, insertLeft: true });
      cursors.set(clientId, { caret, sel, awCursor: cursor });
    }
  };
  var codemirrorCursorActivity = (y, cm, type, awareness) => {
    const aw = awareness.getLocalState();
    if (!cm.hasFocus() || aw == null || !cm.display.wrapper.ownerDocument.hasFocus()) {
      return;
    }
    const newAnchor = createRelativePositionFromTypeIndex(type, cm.indexFromPos(cm.getCursor("anchor")));
    const newHead = createRelativePositionFromTypeIndex(type, cm.indexFromPos(cm.getCursor("head")));
    let currentAnchor = null;
    let currentHead = null;
    if (aw.cursor != null) {
      currentAnchor = createRelativePositionFromJSON(JSON.parse(aw.cursor.anchor));
      currentHead = createRelativePositionFromJSON(JSON.parse(aw.cursor.head));
    }
    if (aw.cursor == null || !compareRelativePositions(currentAnchor, newAnchor) || !compareRelativePositions(currentHead, newHead)) {
      awareness.setLocalStateField("cursor", {
        anchor: JSON.stringify(newAnchor),
        head: JSON.stringify(newHead)
      });
    }
  };
  var CodemirrorBinding = class extends Observable {
    /**
     * @param {Y.Text} textType
     * @param {import('codemirror').Editor} codeMirror
     * @param {any | null} [awareness]
     * @param {{ yUndoManager?: Y.UndoManager }} [options]
     */
    constructor(textType, codeMirror, awareness = null, { yUndoManager = null } = {}) {
      super();
      const doc2 = textType.doc;
      const cmDoc = codeMirror.getDoc();
      this.doc = doc2;
      this.type = textType;
      this.cm = codeMirror;
      this.cmDoc = cmDoc;
      this.awareness = awareness || null;
      this.yUndoManager = yUndoManager;
      this._onStackItemAdded = ({ stackItem, changedParentTypes }) => {
        if (changedParentTypes.has(textType) && this._beforeChangeSelection) {
          stackItem.meta.set(this, this._beforeChangeSelection);
        }
      };
      this._onStackItemPopped = ({ stackItem }) => {
        const sel = stackItem.meta.get(this);
        if (sel) {
          const anchor = createAbsolutePositionFromRelativePosition(sel.anchor, doc2).index;
          const head = createAbsolutePositionFromRelativePosition(sel.head, doc2).index;
          codeMirror.setSelection(codeMirror.posFromIndex(anchor), codeMirror.posFromIndex(head));
          this._beforeChange();
        }
      };
      if (yUndoManager) {
        yUndoManager.trackedOrigins.add(this);
        const editorUndo = (cm) => {
          cm.endOperation();
          yUndoManager.undo();
          cm.startOperation();
        };
        const editorRedo = (cm) => {
          cm.endOperation();
          yUndoManager.redo();
          cm.startOperation();
        };
        codeMirror.addKeyMap({
          // pc
          "Ctrl-Z": editorUndo,
          "Shift-Ctrl-Z": editorRedo,
          "Ctrl-Y": editorRedo,
          // mac
          "Cmd-Z": editorUndo,
          "Shift-Cmd-Z": editorRedo,
          "Cmd-Y": editorRedo
        });
        yUndoManager.on("stack-item-added", this._onStackItemAdded);
        yUndoManager.on("stack-item-popped", this._onStackItemPopped);
      }
      this._mux = createMutex();
      cmDoc.setValue(textType.toString());
      this._typeObserver = (event) => typeObserver(this, event);
      this._targetObserver = (instance, changes) => {
        if (instance.getDoc() === cmDoc) {
          targetObserver(this, changes);
        }
      };
      this._cursors = /* @__PURE__ */ new Map();
      this._changedCursors = /* @__PURE__ */ new Set();
      this._debounceCursorEvent = createDebouncer(10);
      this._awarenessListener = (event) => {
        if (codeMirror.getDoc() !== cmDoc) {
          return;
        }
        const f = (clientId) => {
          if (clientId !== doc2.clientID) {
            this._changedCursors.add(clientId);
          }
        };
        event.added.forEach(f);
        event.removed.forEach(f);
        event.updated.forEach(f);
        if (this._changedCursors.size > 0) {
          this._debounceCursorEvent(() => {
            this._changedCursors.forEach((clientId) => {
              updateRemoteSelection(doc2, codeMirror, textType, this._cursors, clientId, awareness);
            });
            this._changedCursors.clear();
          });
        }
      };
      this._pendingCursorEvent = false;
      this._cursorListener = () => {
        if (codeMirror.getDoc() === cmDoc) {
          this._pendingCursorEvent = true;
          setTimeout(() => {
            if (this._pendingCursorEvent) {
              this._pendingCursorEvent = false;
              this.emit("cursorActivity", [codeMirror]);
            }
          }, 0);
        }
      };
      this.on("cursorActivity", () => {
        codemirrorCursorActivity(doc2, codeMirror, textType, awareness);
      });
      this._blurListeer = () => awareness.setLocalStateField("cursor", null);
      textType.observe(this._typeObserver);
      codeMirror.on("changes", this._targetObserver);
      this._beforeChangeSelection = null;
      this._beforeChange = () => {
        this._mux(() => {
          const anchor = createRelativePositionFromTypeIndex(textType, codeMirror.indexFromPos(codeMirror.getCursor("anchor")));
          const head = createRelativePositionFromTypeIndex(textType, codeMirror.indexFromPos(codeMirror.getCursor("head")));
          this._beforeChangeSelection = { anchor, head };
        });
      };
      codeMirror.on("beforeChange", this._beforeChange);
      if (awareness) {
        codeMirror.on("swapDoc", this._blurListeer);
        awareness.on("change", this._awarenessListener);
        codeMirror.on("cursorActivity", this._cursorListener);
        codeMirror.on("blur", this._blurListeer);
        codeMirror.on("focus", this._cursorListener);
      }
    }
    destroy() {
      this.type.unobserve(this._typeObserver);
      this.cm.off("swapDoc", this._blurListeer);
      this.cm.off("changes", this._targetObserver);
      this.cm.off("beforeChange", this._beforeChange);
      this.cm.off("cursorActivity", this._cursorListener);
      this.cm.off("focus", this._cursorListener);
      this.cm.off("blur", this._blurListeer);
      if (this.awareness) {
        this.awareness.off("change", this._awarenessListener);
      }
      if (this.yUndoManager) {
        this.yUndoManager.off("stack-item-added", this._onStackItemAdded);
        this.yUndoManager.off("stack-item-popped", this._onStackItemPopped);
        this.yUndoManager.trackedOrigins.delete(this);
      }
      this.type = null;
      this.cm = null;
      this.cmDoc = null;
      super.destroy();
    }
  };

  // node_modules/lib0/broadcastchannel.js
  var channels = /* @__PURE__ */ new Map();
  var LocalStoragePolyfill = class {
    /**
     * @param {string} room
     */
    constructor(room) {
      this.room = room;
      this.onmessage = null;
      this._onChange = (e) => e.key === room && this.onmessage !== null && this.onmessage({ data: fromBase64(e.newValue || "") });
      onChange(this._onChange);
    }
    /**
     * @param {ArrayBuffer} buf
     */
    postMessage(buf) {
      varStorage.setItem(this.room, toBase64(createUint8ArrayFromArrayBuffer(buf)));
    }
    close() {
      offChange(this._onChange);
    }
  };
  var BC = typeof BroadcastChannel === "undefined" ? LocalStoragePolyfill : BroadcastChannel;
  var getChannel = (room) => setIfUndefined(channels, room, () => {
    const subs = create2();
    const bc = new BC(room);
    bc.onmessage = (e) => subs.forEach((sub) => sub(e.data, "broadcastchannel"));
    return {
      bc,
      subs
    };
  });
  var subscribe = (room, f) => {
    getChannel(room).subs.add(f);
    return f;
  };
  var unsubscribe = (room, f) => {
    const channel = getChannel(room);
    const unsubscribed = channel.subs.delete(f);
    if (unsubscribed && channel.subs.size === 0) {
      channel.bc.close();
      channels.delete(room);
    }
    return unsubscribed;
  };
  var publish = (room, data, origin = null) => {
    const c = getChannel(room);
    c.bc.postMessage(data);
    c.subs.forEach((sub) => sub(data, origin));
  };

  // node_modules/y-protocols/sync.js
  var messageYjsSyncStep1 = 0;
  var messageYjsSyncStep2 = 1;
  var messageYjsUpdate = 2;
  var writeSyncStep1 = (encoder, doc2) => {
    writeVarUint(encoder, messageYjsSyncStep1);
    const sv = encodeStateVector(doc2);
    writeVarUint8Array(encoder, sv);
  };
  var writeSyncStep2 = (encoder, doc2, encodedStateVector) => {
    writeVarUint(encoder, messageYjsSyncStep2);
    writeVarUint8Array(encoder, encodeStateAsUpdate(doc2, encodedStateVector));
  };
  var readSyncStep1 = (decoder, encoder, doc2) => writeSyncStep2(encoder, doc2, readVarUint8Array(decoder));
  var readSyncStep2 = (decoder, doc2, transactionOrigin) => {
    try {
      applyUpdate(doc2, readVarUint8Array(decoder), transactionOrigin);
    } catch (error) {
      console.error("Caught error while handling a Yjs update", error);
    }
  };
  var writeUpdate = (encoder, update) => {
    writeVarUint(encoder, messageYjsUpdate);
    writeVarUint8Array(encoder, update);
  };
  var readUpdate = readSyncStep2;
  var readSyncMessage = (decoder, encoder, doc2, transactionOrigin) => {
    const messageType = readVarUint(decoder);
    switch (messageType) {
      case messageYjsSyncStep1:
        readSyncStep1(decoder, encoder, doc2);
        break;
      case messageYjsSyncStep2:
        readSyncStep2(decoder, doc2, transactionOrigin);
        break;
      case messageYjsUpdate:
        readUpdate(decoder, doc2, transactionOrigin);
        break;
      default:
        throw new Error("Unknown message type");
    }
    return messageType;
  };

  // node_modules/y-protocols/auth.js
  var messagePermissionDenied = 0;
  var readAuthMessage = (decoder, y, permissionDeniedHandler2) => {
    switch (readVarUint(decoder)) {
      case messagePermissionDenied:
        permissionDeniedHandler2(y, readVarString(decoder));
    }
  };

  // node_modules/y-protocols/awareness.js
  var outdatedTimeout = 3e4;
  var Awareness = class extends Observable {
    /**
     * @param {Y.Doc} doc
     */
    constructor(doc2) {
      super();
      this.doc = doc2;
      this.clientID = doc2.clientID;
      this.states = /* @__PURE__ */ new Map();
      this.meta = /* @__PURE__ */ new Map();
      this._checkInterval = /** @type {any} */
      setInterval(() => {
        const now = getUnixTime();
        if (this.getLocalState() !== null && outdatedTimeout / 2 <= now - /** @type {{lastUpdated:number}} */
        this.meta.get(this.clientID).lastUpdated) {
          this.setLocalState(this.getLocalState());
        }
        const remove = [];
        this.meta.forEach((meta, clientid) => {
          if (clientid !== this.clientID && outdatedTimeout <= now - meta.lastUpdated && this.states.has(clientid)) {
            remove.push(clientid);
          }
        });
        if (remove.length > 0) {
          removeAwarenessStates(this, remove, "timeout");
        }
      }, floor(outdatedTimeout / 10));
      doc2.on("destroy", () => {
        this.destroy();
      });
      this.setLocalState({});
    }
    destroy() {
      this.emit("destroy", [this]);
      this.setLocalState(null);
      super.destroy();
      clearInterval(this._checkInterval);
    }
    /**
     * @return {Object<string,any>|null}
     */
    getLocalState() {
      return this.states.get(this.clientID) || null;
    }
    /**
     * @param {Object<string,any>|null} state
     */
    setLocalState(state) {
      const clientID = this.clientID;
      const currLocalMeta = this.meta.get(clientID);
      const clock = currLocalMeta === void 0 ? 0 : currLocalMeta.clock + 1;
      const prevState = this.states.get(clientID);
      if (state === null) {
        this.states.delete(clientID);
      } else {
        this.states.set(clientID, state);
      }
      this.meta.set(clientID, {
        clock,
        lastUpdated: getUnixTime()
      });
      const added = [];
      const updated = [];
      const filteredUpdated = [];
      const removed = [];
      if (state === null) {
        removed.push(clientID);
      } else if (prevState == null) {
        if (state != null) {
          added.push(clientID);
        }
      } else {
        updated.push(clientID);
        if (!equalityDeep(prevState, state)) {
          filteredUpdated.push(clientID);
        }
      }
      if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
        this.emit("change", [{ added, updated: filteredUpdated, removed }, "local"]);
      }
      this.emit("update", [{ added, updated, removed }, "local"]);
    }
    /**
     * @param {string} field
     * @param {any} value
     */
    setLocalStateField(field, value) {
      const state = this.getLocalState();
      if (state !== null) {
        this.setLocalState({
          ...state,
          [field]: value
        });
      }
    }
    /**
     * @return {Map<number,Object<string,any>>}
     */
    getStates() {
      return this.states;
    }
  };
  var removeAwarenessStates = (awareness, clients, origin) => {
    const removed = [];
    for (let i = 0; i < clients.length; i++) {
      const clientID = clients[i];
      if (awareness.states.has(clientID)) {
        awareness.states.delete(clientID);
        if (clientID === awareness.clientID) {
          const curMeta = (
            /** @type {MetaClientState} */
            awareness.meta.get(clientID)
          );
          awareness.meta.set(clientID, {
            clock: curMeta.clock + 1,
            lastUpdated: getUnixTime()
          });
        }
        removed.push(clientID);
      }
    }
    if (removed.length > 0) {
      awareness.emit("change", [{ added: [], updated: [], removed }, origin]);
      awareness.emit("update", [{ added: [], updated: [], removed }, origin]);
    }
  };
  var encodeAwarenessUpdate = (awareness, clients, states = awareness.states) => {
    const len = clients.length;
    const encoder = createEncoder();
    writeVarUint(encoder, len);
    for (let i = 0; i < len; i++) {
      const clientID = clients[i];
      const state = states.get(clientID) || null;
      const clock = (
        /** @type {MetaClientState} */
        awareness.meta.get(clientID).clock
      );
      writeVarUint(encoder, clientID);
      writeVarUint(encoder, clock);
      writeVarString(encoder, JSON.stringify(state));
    }
    return toUint8Array(encoder);
  };
  var applyAwarenessUpdate = (awareness, update, origin) => {
    const decoder = createDecoder(update);
    const timestamp = getUnixTime();
    const added = [];
    const updated = [];
    const filteredUpdated = [];
    const removed = [];
    const len = readVarUint(decoder);
    for (let i = 0; i < len; i++) {
      const clientID = readVarUint(decoder);
      let clock = readVarUint(decoder);
      const state = JSON.parse(readVarString(decoder));
      const clientMeta = awareness.meta.get(clientID);
      const prevState = awareness.states.get(clientID);
      const currClock = clientMeta === void 0 ? 0 : clientMeta.clock;
      if (currClock < clock || currClock === clock && state === null && awareness.states.has(clientID)) {
        if (state === null) {
          if (clientID === awareness.clientID && awareness.getLocalState() != null) {
            clock++;
          } else {
            awareness.states.delete(clientID);
          }
        } else {
          awareness.states.set(clientID, state);
        }
        awareness.meta.set(clientID, {
          clock,
          lastUpdated: timestamp
        });
        if (clientMeta === void 0 && state !== null) {
          added.push(clientID);
        } else if (clientMeta !== void 0 && state === null) {
          removed.push(clientID);
        } else if (state !== null) {
          if (!equalityDeep(state, prevState)) {
            filteredUpdated.push(clientID);
          }
          updated.push(clientID);
        }
      }
    }
    if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
      awareness.emit("change", [{
        added,
        updated: filteredUpdated,
        removed
      }, origin]);
    }
    if (added.length > 0 || updated.length > 0 || removed.length > 0) {
      awareness.emit("update", [{
        added,
        updated,
        removed
      }, origin]);
    }
  };

  // node_modules/lib0/url.js
  var encodeQueryParams = (params2) => map2(params2, (val, key) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join("&");

  // node_modules/y-websocket/src/y-websocket.js
  var messageSync = 0;
  var messageQueryAwareness = 3;
  var messageAwareness = 1;
  var messageAuth = 2;
  var messageHandlers = [];
  messageHandlers[messageSync] = (encoder, decoder, provider, emitSynced, _messageType) => {
    writeVarUint(encoder, messageSync);
    const syncMessageType = readSyncMessage(
      decoder,
      encoder,
      provider.doc,
      provider
    );
    if (emitSynced && syncMessageType === messageYjsSyncStep2 && !provider.synced) {
      provider.synced = true;
    }
  };
  messageHandlers[messageQueryAwareness] = (encoder, _decoder, provider, _emitSynced, _messageType) => {
    writeVarUint(encoder, messageAwareness);
    writeVarUint8Array(
      encoder,
      encodeAwarenessUpdate(
        provider.awareness,
        Array.from(provider.awareness.getStates().keys())
      )
    );
  };
  messageHandlers[messageAwareness] = (_encoder, decoder, provider, _emitSynced, _messageType) => {
    applyAwarenessUpdate(
      provider.awareness,
      readVarUint8Array(decoder),
      provider
    );
  };
  messageHandlers[messageAuth] = (_encoder, decoder, provider, _emitSynced, _messageType) => {
    readAuthMessage(
      decoder,
      provider.doc,
      (_ydoc, reason) => permissionDeniedHandler(provider, reason)
    );
  };
  var messageReconnectTimeout = 3e4;
  var permissionDeniedHandler = (provider, reason) => console.warn(`Permission denied to access ${provider.url}.
${reason}`);
  var readMessage = (provider, buf, emitSynced) => {
    const decoder = createDecoder(buf);
    const encoder = createEncoder();
    const messageType = readVarUint(decoder);
    const messageHandler = provider.messageHandlers[messageType];
    if (
      /** @type {any} */
      messageHandler
    ) {
      messageHandler(encoder, decoder, provider, emitSynced, messageType);
    } else {
      console.error("Unable to compute message");
    }
    return encoder;
  };
  var setupWS = (provider) => {
    if (provider.shouldConnect && provider.ws === null) {
      const websocket = new provider._WS(provider.url);
      websocket.binaryType = "arraybuffer";
      provider.ws = websocket;
      provider.wsconnecting = true;
      provider.wsconnected = false;
      provider.synced = false;
      websocket.onmessage = (event) => {
        provider.wsLastMessageReceived = getUnixTime();
        const encoder = readMessage(provider, new Uint8Array(event.data), true);
        if (length(encoder) > 1) {
          websocket.send(toUint8Array(encoder));
        }
      };
      websocket.onerror = (event) => {
        provider.emit("connection-error", [event, provider]);
      };
      websocket.onclose = (event) => {
        provider.emit("connection-close", [event, provider]);
        provider.ws = null;
        provider.wsconnecting = false;
        if (provider.wsconnected) {
          provider.wsconnected = false;
          provider.synced = false;
          removeAwarenessStates(
            provider.awareness,
            Array.from(provider.awareness.getStates().keys()).filter(
              (client) => client !== provider.doc.clientID
            ),
            provider
          );
          provider.emit("status", [{
            status: "disconnected"
          }]);
        } else {
          provider.wsUnsuccessfulReconnects++;
        }
        setTimeout(
          setupWS,
          min(
            pow(2, provider.wsUnsuccessfulReconnects) * 100,
            provider.maxBackoffTime
          ),
          provider
        );
      };
      websocket.onopen = () => {
        provider.wsLastMessageReceived = getUnixTime();
        provider.wsconnecting = false;
        provider.wsconnected = true;
        provider.wsUnsuccessfulReconnects = 0;
        provider.emit("status", [{
          status: "connected"
        }]);
        const encoder = createEncoder();
        writeVarUint(encoder, messageSync);
        writeSyncStep1(encoder, provider.doc);
        websocket.send(toUint8Array(encoder));
        if (provider.awareness.getLocalState() !== null) {
          const encoderAwarenessState = createEncoder();
          writeVarUint(encoderAwarenessState, messageAwareness);
          writeVarUint8Array(
            encoderAwarenessState,
            encodeAwarenessUpdate(provider.awareness, [
              provider.doc.clientID
            ])
          );
          websocket.send(toUint8Array(encoderAwarenessState));
        }
      };
      provider.emit("status", [{
        status: "connecting"
      }]);
    }
  };
  var broadcastMessage = (provider, buf) => {
    const ws = provider.ws;
    if (provider.wsconnected && ws && ws.readyState === ws.OPEN) {
      ws.send(buf);
    }
    if (provider.bcconnected) {
      publish(provider.bcChannel, buf, provider);
    }
  };
  var WebsocketProvider = class extends Observable {
    /**
     * @param {string} serverUrl
     * @param {string} roomname
     * @param {Y.Doc} doc
     * @param {object} opts
     * @param {boolean} [opts.connect]
     * @param {awarenessProtocol.Awareness} [opts.awareness]
     * @param {Object<string,string>} [opts.params]
     * @param {typeof WebSocket} [opts.WebSocketPolyfill] Optionall provide a WebSocket polyfill
     * @param {number} [opts.resyncInterval] Request server state every `resyncInterval` milliseconds
     * @param {number} [opts.maxBackoffTime] Maximum amount of time to wait before trying to reconnect (we try to reconnect using exponential backoff)
     * @param {boolean} [opts.disableBc] Disable cross-tab BroadcastChannel communication
     */
    constructor(serverUrl, roomname, doc2, {
      connect = true,
      awareness = new Awareness(doc2),
      params: params2 = {},
      WebSocketPolyfill = WebSocket,
      resyncInterval = -1,
      maxBackoffTime = 2500,
      disableBc = false
    } = {}) {
      super();
      while (serverUrl[serverUrl.length - 1] === "/") {
        serverUrl = serverUrl.slice(0, serverUrl.length - 1);
      }
      const encodedParams = encodeQueryParams(params2);
      this.maxBackoffTime = maxBackoffTime;
      this.bcChannel = serverUrl + "/" + roomname;
      this.url = serverUrl + "/" + roomname + (encodedParams.length === 0 ? "" : "?" + encodedParams);
      this.roomname = roomname;
      this.doc = doc2;
      this._WS = WebSocketPolyfill;
      this.awareness = awareness;
      this.wsconnected = false;
      this.wsconnecting = false;
      this.bcconnected = false;
      this.disableBc = disableBc;
      this.wsUnsuccessfulReconnects = 0;
      this.messageHandlers = messageHandlers.slice();
      this._synced = false;
      this.ws = null;
      this.wsLastMessageReceived = 0;
      this.shouldConnect = connect;
      this._resyncInterval = 0;
      if (resyncInterval > 0) {
        this._resyncInterval = /** @type {any} */
        setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const encoder = createEncoder();
            writeVarUint(encoder, messageSync);
            writeSyncStep1(encoder, doc2);
            this.ws.send(toUint8Array(encoder));
          }
        }, resyncInterval);
      }
      this._bcSubscriber = (data, origin) => {
        if (origin !== this) {
          const encoder = readMessage(this, new Uint8Array(data), false);
          if (length(encoder) > 1) {
            publish(this.bcChannel, toUint8Array(encoder), this);
          }
        }
      };
      this._updateHandler = (update, origin) => {
        if (origin !== this) {
          const encoder = createEncoder();
          writeVarUint(encoder, messageSync);
          writeUpdate(encoder, update);
          broadcastMessage(this, toUint8Array(encoder));
        }
      };
      this.doc.on("update", this._updateHandler);
      this._awarenessUpdateHandler = ({ added, updated, removed }, _origin) => {
        const changedClients = added.concat(updated).concat(removed);
        const encoder = createEncoder();
        writeVarUint(encoder, messageAwareness);
        writeVarUint8Array(
          encoder,
          encodeAwarenessUpdate(awareness, changedClients)
        );
        broadcastMessage(this, toUint8Array(encoder));
      };
      this._unloadHandler = () => {
        removeAwarenessStates(
          this.awareness,
          [doc2.clientID],
          "window unload"
        );
      };
      if (typeof window !== "undefined") {
        window.addEventListener("unload", this._unloadHandler);
      } else if (typeof process !== "undefined") {
        process.on("exit", this._unloadHandler);
      }
      awareness.on("update", this._awarenessUpdateHandler);
      this._checkInterval = /** @type {any} */
      setInterval(() => {
        if (this.wsconnected && messageReconnectTimeout < getUnixTime() - this.wsLastMessageReceived) {
          this.ws.close();
        }
      }, messageReconnectTimeout / 10);
      if (connect) {
        this.connect();
      }
    }
    /**
     * @type {boolean}
     */
    get synced() {
      return this._synced;
    }
    set synced(state) {
      if (this._synced !== state) {
        this._synced = state;
        this.emit("synced", [state]);
        this.emit("sync", [state]);
      }
    }
    destroy() {
      if (this._resyncInterval !== 0) {
        clearInterval(this._resyncInterval);
      }
      clearInterval(this._checkInterval);
      this.disconnect();
      if (typeof window !== "undefined") {
        window.removeEventListener("unload", this._unloadHandler);
      } else if (typeof process !== "undefined") {
        process.off("exit", this._unloadHandler);
      }
      this.awareness.off("update", this._awarenessUpdateHandler);
      this.doc.off("update", this._updateHandler);
      super.destroy();
    }
    connectBc() {
      if (this.disableBc) {
        return;
      }
      if (!this.bcconnected) {
        subscribe(this.bcChannel, this._bcSubscriber);
        this.bcconnected = true;
      }
      const encoderSync = createEncoder();
      writeVarUint(encoderSync, messageSync);
      writeSyncStep1(encoderSync, this.doc);
      publish(this.bcChannel, toUint8Array(encoderSync), this);
      const encoderState = createEncoder();
      writeVarUint(encoderState, messageSync);
      writeSyncStep2(encoderState, this.doc);
      publish(this.bcChannel, toUint8Array(encoderState), this);
      const encoderAwarenessQuery = createEncoder();
      writeVarUint(encoderAwarenessQuery, messageQueryAwareness);
      publish(
        this.bcChannel,
        toUint8Array(encoderAwarenessQuery),
        this
      );
      const encoderAwarenessState = createEncoder();
      writeVarUint(encoderAwarenessState, messageAwareness);
      writeVarUint8Array(
        encoderAwarenessState,
        encodeAwarenessUpdate(this.awareness, [
          this.doc.clientID
        ])
      );
      publish(
        this.bcChannel,
        toUint8Array(encoderAwarenessState),
        this
      );
    }
    disconnectBc() {
      const encoder = createEncoder();
      writeVarUint(encoder, messageAwareness);
      writeVarUint8Array(
        encoder,
        encodeAwarenessUpdate(this.awareness, [
          this.doc.clientID
        ], /* @__PURE__ */ new Map())
      );
      broadcastMessage(this, toUint8Array(encoder));
      if (this.bcconnected) {
        unsubscribe(this.bcChannel, this._bcSubscriber);
        this.bcconnected = false;
      }
    }
    disconnect() {
      this.shouldConnect = false;
      this.disconnectBc();
      if (this.ws !== null) {
        this.ws.close();
      }
    }
    connect() {
      this.shouldConnect = true;
      if (!this.wsconnected && this.ws === null) {
        setupWS(this);
        this.connectBc();
      }
    }
  };

  // frontend/app.js
  var import_codemirror2 = __toESM(require_codemirror(), 1);
  var MODE_MAP = {
    "JavaScript": "javascript",
    "Golang": "go",
    "Python": "python",
    "Java": "text/x-java",
    "HTML": "htmlmixed",
    "CSS": "css",
    "C++": "text/x-c++src",
    "Rust": "text/x-rustsrc"
  };
  function initializeYjsEditor(sessionId, username, language, initialContent) {
    const ydoc = new Doc();
    const ytext = ydoc.getText("shared-text");
    const provider = new WebsocketProvider(
      `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`,
      `session-${sessionId}`,
      ydoc,
      {
        connect: true,
        awareness: true,
        resyncInterval: 5e3
      }
    );
    if (ytext.length === 0 && initialContent) {
      ytext.insert(0, initialContent);
    }
    provider.awareness.setLocalState({
      user: {
        name: username,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        colorLight: "#" + Math.floor(Math.random() * 16777215).toString(16)
      }
    });
    const mode = MODE_MAP[language] || "javascript";
    const editor = import_codemirror2.default.fromTextArea(document.getElementById("code-editor"), {
      lineNumbers: true,
      mode,
      theme: "eclipse",
      indentUnit: 2,
      smartIndent: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      lineWrapping: true,
      viewportMargin: Infinity,
      extraKeys: {
        "Tab": function(cm) {
          if (cm.somethingSelected()) {
            cm.indentSelection("add");
          } else {
            cm.replaceSelection("  ", "end");
          }
        },
        "Shift-Tab": function(cm) {
          cm.indentSelection("subtract");
        }
      }
    });
    const binding = new CodemirrorBinding(ytext, editor, /* @__PURE__ */ new Set([provider.awareness]), provider);
    provider.on("status", (event) => {
      const statusEl = document.getElementById("connection-status");
      if (statusEl) {
        if (event.status === "connected") {
          statusEl.textContent = "\u2713 Connected";
          statusEl.style.color = "#4CAF50";
        } else {
          statusEl.textContent = "\u27F3 Connecting...";
          statusEl.style.color = "#FF9800";
        }
      }
      console.log("[Yjs] Connection status:", event.status);
    });
    provider.awareness.on("change", (changes) => {
      const users = Array.from(provider.awareness.getStates().entries()).map(([clientID, state]) => state.user?.name).filter(Boolean);
      console.log("[Yjs] Active users:", users);
    });
    console.log("[Yjs] Editor initialized for session:", sessionId);
    console.log("[Yjs] User:", username);
    console.log("[Yjs] Language:", language);
    return { ydoc, provider, binding, editor };
  }
  function cleanupYjs(provider) {
    if (provider) {
      provider.disconnect();
      provider.destroy();
    }
  }
})();
