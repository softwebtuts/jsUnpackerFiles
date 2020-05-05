self.addEventListener('message', function (e) {
    var source = e.data.source;
   if (e.data.beautify) {
    try {
        self._window = self.window;
        self.window = {};

        self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/beautify.min.js');

        source = self.window.js_beautify(source, {
            unescape_strings: true,
            jslint_happy: true
        });

        self.window = self._window;
    } catch (err) {
        console.log(err);
    }
   }

    try {
    self.importScripts('https://raw.githack.com/softwebtuts/jsUnpackerFiles/master/highlight.min.js');
    source = self.hljs.highlight('javascript', source).value;
    } catch (err) {
        console.log(err);
    }

    self.postMessage(source);
});
