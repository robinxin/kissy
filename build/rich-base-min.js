/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Nov 14 21:53
*/
KISSY.add("rich-base",function(e,k){function i(){var c,b;k.apply(this,arguments);b=this.get("listeners");for(c in b)this.on(c,b[c]);this.callMethodByHierarchy("initializer","constructor");this.constructPlugins();this.callPluginsMethod("initializer")}var l=e.noop;e.extend(i,k,{callMethodByHierarchy:function(c,b){for(var d=this.constructor,a=[],e,j,f,g,h;d;){h=[];if(g=d.__ks_exts)for(f=0;f<g.length;f++)if(e=g[f])"constructor"!=b&&(e=e.prototype.hasOwnProperty(b)?e.prototype[b]:null),e&&h.push(e);d.prototype.hasOwnProperty(c)&&
(j=d.prototype[c])&&h.push(j);h.length&&a.push.apply(a,h.reverse());d=d.superclass&&d.superclass.constructor}for(f=a.length-1;0<=f;f--)a[f]&&a[f].call(this)},callPluginsMethod:function(c){var b=this;e.each(b.get("plugins"),function(d){if(d[c])d[c](b)})},constructPlugins:function(){var c=this.get("plugins");e.each(c,function(b,d){e.isFunction(b)&&(c[d]=new b)})},initializer:l,destructor:l,destroy:function(){this.callPluginsMethod("destructor");for(var c=this.constructor,b,d,a;c;){c.prototype.hasOwnProperty("destructor")&&
c.prototype.destructor.apply(this);if(b=c.__ks_exts)for(a=b.length-1;0<=a;a--)(d=b[a]&&b[a].prototype.__destructor)&&d.apply(this);c=c.superclass&&c.superclass.constructor}this.fire("destroy");this.detach();this.fire("destroy");return this},plug:function(c){e.isFunction(c)&&(c=new c);c.initializer&&c.initializer(this)},unplug:function(c){var b=[],d=e.isString(c);e.each(this.get("plugins"),function(a){c&&(d?(!a.get||a.get("pluginId")!=c)&&b.push(a):a==c&&b.push(a))});this.setInternal("plugins",b)}},
{ATTRS:{plugins:{value:[]},listeners:{value:[]}}});i.extend=function b(d,a,i){var j="RichBaseDerived",f,g;f=e.makeArray(arguments);e.isObject(d)&&(i=a,a=d,d=[]);if("string"==typeof(f=f[f.length-1]))j=f;a=a||{};a.hasOwnProperty("constructor")?g=a.constructor:(g=function(){g.superclass.constructor.apply(this,arguments)},e.Config.debug&&eval("C=function "+j.replace(/[-.]/g,"_")+"(){ C.superclass.constructor.apply(this, arguments);}"));g.name=j;e.extend(g,this,a,i);if(d){g.__ks_exts=d;var h={},k={};e.each(d.concat(g),
function(a){if(a){e.each(a.ATTRS,function(a,b){var d=h[b]=h[b]||{};e.mix(d,a)});var a=a.prototype,b;for(b in a)a.hasOwnProperty(b)&&(k[b]=a[b])}});g.ATTRS=h;e.augment(g,k)}g.extend=b;return g};return i},{requires:["base"]});