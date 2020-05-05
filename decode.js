/**
 * @name  de4js
 * @description  JavaScript Deobfuscator and Unpacker
 * @author  Zzbaivong <Zzbaivong@gmail.com> (https://lelinhtinh.github.io)
 * @version  1.6.3
 * @copyright  Zzbaivong 2017
 * @license  MIT
 */

/* globals JSFuckDecode, AADecode, JJdecode, Urlencoded, P_A_C_K_E_R, JavascriptObfuscator, MyObfuscate */
/* eslint-disable no-console */

self.addEventListener('message', function (e) {
    var source = e.data.source,
        packer = e.data.packer;

    if (packer === 'evalencode') {
        self._eval = self.eval;
        self.eval = function (_evalsource) {
            source = _evalsource;
        };
        try {
            self._eval(source);
        } catch (err) {
            console.log(err);
        }
        self.eval = self._eval;
    } else if (packer === '_numberencode') {
        try {
            var patt = /_\d{4}\((_\d{4})\);\}/,
                _numbersource = source;

            if (patt.test(_numbersource)) {
                _numbersource = _numbersource.replace(/var\s/g, 'this.');
                _numbersource = _numbersource.replace(/function\s(_\d{4})\(/, 'this.$1=function(');
                _numbersource = _numbersource.replace(patt, 'self.sourceNumberEncodeZz=$1;};');

                _numbersource = '(function(){' + _numbersource + '})();';
                eval(_numbersource);

                source = self.sourceNumberEncodeZz;
            }
        } catch (err) {
            console.log(err);
        }
    } else if (packer === 'arrayencode') {
        try {
            var pattarr = /[\s\n]*var\s+([\w\d_$]+)\s*=\s*\[.*?\];/,
                _var = source.match(pattarr);

            if (_var && _var.length === 2) {
                var _name = _var[1],
                    _code = source.replace(pattarr, ''),

                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
                    quote = function (s, q) {
                        return s.replace(new RegExp('[*+?^${}()|[\\]\\\\' + q + ']', 'g'), '\\$&');
                    },

                    pattkey = new RegExp(_name.replace(/\$/g, '\\$') + '\\[(\\d+)\\]', 'g');

                _var = _var[0].replace(/[\s\S]*?\[/, '[');
                _var = eval(_var);

                _code.replace(pattkey, function (key, index) {
                    var item = _var[index],
                        q = item.indexOf('"') !== -1 ? "'" : '"';

                    _code = _code.replace(key, q + quote(_var[index], q) + q);
                    return _code;
                });

                _code = _code.replace(/(\[("|')([\w\d_$]+)("|')\])/gi, '.$3 ');
                source = _code;
            }
        } catch (err) {
            console.log(err);
        }
    } else if (packer === 'jsfuck') {
        try {
            self._window = self.window;
            self.window = {};
            self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/jsfuck.js');
            self.JSFuck = self.window.JSFuck;
            self.window = self._window;

            self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/decoder-jsfuck.js');

            source = JSFuckDecode.decode(source);
        } catch (err) {
            console.log(err);
        }
    } else if (packer === 'aaencode') {
        try {
            self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/aadecode.js');

            source = AADecode.decode(source);
        } catch (err) {
            console.log(err);
        }
    } else if (packer === 'jjencode') {
        try {
            self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/jjdecode.js');

            source = JJdecode.decode(source);
        } catch (err) {
            console.log(err);
        }
    } else if (packer === 'urlencode') {
        try {
            self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/urlencode_unpacker.js');

            if (Urlencoded.detect(source)) source = Urlencoded.unpack(source);
        } catch (err) {
            console.log(err);
        }
    } else if (packer === 'p_a_c_k_e_r') {
        try {
            self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/p_a_c_k_e_r_unpacker.js');

            if (P_A_C_K_E_R.detect(source)) source = P_A_C_K_E_R.unpack(source);
        } catch (err) {
            console.log(err);
        }
    } else if (packer === 'javascriptobfuscator') {
        try {
            self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/javascriptobfuscator_unpacker.js');

            if (JavascriptObfuscator.detect(source)) source = JavascriptObfuscator.unpack(source);
        } catch (err) {
            console.log(err);
        }
    } else if (packer === 'myobfuscate') {
        try {
            self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/myobfuscate_unpacker.js');

            if (MyObfuscate.detect(source)) source = MyObfuscate.unpack(source);
        } catch (err) {
            console.log(err);
        }
    }

    self.postMessage(source);
});
