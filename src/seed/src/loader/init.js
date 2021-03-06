/**
 * @ignore
 * mix loader into S and infer KISSy baseUrl if not set
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
(function (S, undefined) {

    S.mix(S,
        {
            /**
             * Registers a module with the KISSY global.
             * @param {String} name module name.
             * it must be set if combine is true in {@link KISSY#config}
             * @param {Function} fn module definition function that is used to return
             * this module value
             * @param {KISSY} fn.S KISSY global instance
             * @param {Object} [cfg] module optional config data
             * @param {String[]} cfg.requires this module's required module name list
             * @member KISSY
             *
             * for example:
             *      @example
             *      // dom module's definition
             *      KISSY.add('dom', function(S, xx){
             *          return {css: function(el, name, val){}};
             *      },{
             *          requires:['xx']
             *      });
             */
            add: function (name, fn, cfg) {
                this.getLoader().add(name, fn, cfg);
            },
            /**
             * Attached one or more modules to global KISSY instance.
             * @param {String|String[]} names moduleNames. 1-n modules to bind(use comma to separate)
             * @param {Function} callback callback function executed
             * when KISSY has the required functionality.
             * @param {KISSY} callback.S KISSY instance
             * @param callback.x... used module values
             * @member KISSY
             *
             * for example:
             *      @example
             *      // loads and attached overlay,dd and its dependencies
             *      KISSY.use('overlay,dd', function(S, Overlay){});
             */
            use: function (names, callback) {
                var loader = this.getLoader();
                loader.use.apply(loader, arguments);
            },
            /**
             * get KISSY 's loader instance
             * @member KISSY
             * @return {KISSY.Loader}
             */
            getLoader: function () {
                var self = this,
                    Config = self.Config,
                    Env = self.Env;
                if (Config.combine && !S.UA.nodejs) {
                    return Env._comboLoader;
                } else {
                    return Env._loader;
                }
            },
            /**
             * get module value defined by define function
             * @param {string} moduleName
             * @member KISSY
             */
            require: function (moduleName) {
                return utils.getModules(this, [moduleName])[1];
            }
        });

    var Loader = S.Loader,
        Env = S.Env,
        utils = Loader.Utils,
        ComboLoader = S.Loader.Combo;

    function returnJson(s) {
        return (new Function('return ' + s))();
    }

    /**
     * get base from seed.js
     * @return {Object} base for kissy
     * @ignore
     *
     * for example:
     *      @example
     *      http://a.tbcdn.cn/??s/kissy/x.y.z/seed-min.js,p/global/global.js
     *      note about custom combo rules, such as yui3:
     *      combo-prefix='combo?' combo-sep='&'
     */
    function getBaseInfo() {
        // get base from current script file path
        // notice: timestamp
        var baseReg = /^(.*)(seed|kissy)(?:-min)?\.js[^/]*/i,
            baseTestReg = /(seed|kissy)(?:-min)?\.js/i,
            comboPrefix,
            comboSep,
            scripts = Env.host.document.getElementsByTagName('script'),
            script = scripts[scripts.length - 1],
        // can not use KISSY.Uri
        // /??x.js,dom.js for tbcdn
            src = script.src,
            baseInfo = script.getAttribute('data-config');

        if (baseInfo) {
            baseInfo = returnJson(baseInfo);
        } else {
            baseInfo = {};
        }

        comboPrefix = baseInfo.comboPrefix = baseInfo.comboPrefix || '??';
        comboSep = baseInfo.comboSep = baseInfo.comboSep || ',';

        var parts ,
            base,
            index = src.indexOf(comboPrefix);

        // no combo
        if (index == -1) {
            base = src.replace(baseReg, '$1');
        } else {
            base = src.substring(0, index);
            // a.tbcdn.cn??y.js, ie does not insert / after host
            // a.tbcdn.cn/combo? comboPrefix=/combo?
            if (base.charAt(base.length - 1) != '/') {
                base += '/';
            }
            parts = src.substring(index + comboPrefix.length).split(comboSep);
            S.each(parts, function (part) {
                if (part.match(baseTestReg)) {
                    base += part.replace(baseReg, '$1');
                    return false;
                }
                return undefined;
            });
        }
        return S.mix({
            base: base
        }, baseInfo);
    }

    if (S.UA.nodejs) {
        // nodejs: no tag
        S.config({
            charset: 'utf-8',
            base: __dirname.replace(/\\/g, '/').replace(/\/$/, '') + '/'
        });
    } else {
        // will transform base to absolute path
        S.config(S.mix({
            // 2k(2048) url length
            comboMaxUrlLength: 2000,
            // file limit number for a single combo url
            comboMaxFileNum: 40,
            charset: 'utf-8',
            tag: '@TIMESTAMP@'
        }, getBaseInfo()));
    }

    S.config('systemPackage', new Loader.Package({
        name: '',
        runtime: S
    }));

    // Initializes loader.
    Env.mods = {}; // all added mods
    Env._loader = new Loader(S);

    if (ComboLoader) {
        Env._comboLoader = new ComboLoader(S);
    }

})(KISSY);