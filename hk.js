(function() {
    /*
        Copyright (c) 2017 Carey Li

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
    */
    
    const HK_VER = 1.00;
    const HK_VERBOSITY = true;
    
    window.hk = typeof window.hk == "undefined" ? {} : window.hk;

    log = {
        info: msg => {

            if (typeof HK_LOG_TO_PAGE !== "undefined") {
                document.getElementById("log").textContent += `\n[INFO] ${msg}`;

                return;
            }

            console.info(`[HK] [INFO] ${msg}`);
        },
        warn: (msg, traceback) => {
            traceback = typeof traceback === "undefined" ? "" : `- ${traceback}`;

            if (typeof HK_LOG_TO_PAGE !== "undefined") {
                document.getElementById("log").textContent += `\n[WARN] ${msg} ${traceback}`;

                return;
            }

            console.warn(`[HK] [WARN] ${msg} ${traceback}`);
        },
        debug: msg => {
            if (!HK_VERBOSITY) return;

            log.info(msg);
        }
    }

    generateEventListener = (fullMsg, progress, lastPressTime, callback, opts) => {
        window.addEventListener("keydown", function handler(event) {
            if (fullMsg === progress + event.key) {
                log.info(`Matched ${event.key}`);

                this.removeEventListener("keydown", handler);

                callback(); return;
            } else if (event.key === fullMsg[progress.length] && (performance.now() - lastPressTime <= opts.delay)) {
                log.info(`Matched ${event.key}`);

                this.removeEventListener("keydown", handler);

                generateEventListener(fullMsg, progress + event.key, performance.now(), callback, opts);
            } else if (performance.now() - lastPressTime > opts.delay) {
                this.removeEventListener("keydown", handler);

                hk.addWordListener(fullMsg, callback, opts);
            }
        });
    }

    hk.addWordListener = (msg = "", callback = _=>alert("no callback given"), opts = {}) => {
        log.debug(`addWordListener called, opts: ${JSON.stringify(opts)}`);

        if (msg === "") {
            log.warn("Provided message must not be empty")
            return;
        }

        let defaultOpts = {
            delay: 1000, // Milliseconds allowed in between each keypress
        }

        let diff = Object.keys(defaultOpts).filter(x => typeof Object.keys(opts)[x] === "undefined");

        for (el in diff) opts[diff[el]] = defaultOpts[diff[el]];

        log.info(`Final opt object: ${JSON.stringify(opts)}`);

        window.addEventListener("keydown", function handler(event) {
            if (event.key == msg[0]) {
                log.info(`Matched ${event.key}`);

                this.removeEventListener("keydown", handler);

                generateEventListener(msg, event.key, performance.now(), callback, opts);
            }
        });
    };

})();