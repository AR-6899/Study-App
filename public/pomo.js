// console.log("Pomo script running")
(function (workerScript) {
    if (!/MSIE 10/i.test(navigator.userAgent)) {
        try {
            var blob = new Blob(["\
var fakeIdToId = {};\
onmessage = function (event) {\
	var data = event.data,\
		name = data.name,\
		fakeId = data.fakeId,\
		time;\
	if(data.hasOwnProperty('time')) {\
		time = data.time;\
	}\
	switch (name) {\
		case 'setInterval':\
			fakeIdToId[fakeId] = setInterval(function () {\
				postMessage({fakeId: fakeId});\
			}, time);\
			break;\
		case 'clearInterval':\
			if (fakeIdToId.hasOwnProperty (fakeId)) {\
				clearInterval(fakeIdToId[fakeId]);\
				delete fakeIdToId[fakeId];\
			}\
			break;\
		case 'setTimeout':\
			fakeIdToId[fakeId] = setTimeout(function () {\
				postMessage({fakeId: fakeId});\
				if (fakeIdToId.hasOwnProperty (fakeId)) {\
					delete fakeIdToId[fakeId];\
				}\
			}, time);\
			break;\
		case 'clearTimeout':\
			if (fakeIdToId.hasOwnProperty (fakeId)) {\
				clearTimeout(fakeIdToId[fakeId]);\
				delete fakeIdToId[fakeId];\
			}\
			break;\
	}\
}\
"]);
            // Obtain a blob URL reference to our worker 'file'.
            workerScript = window.URL.createObjectURL(blob);
        } catch (error) {
            /* Blob is not supported, use external script instead */
        }
    }
    var worker,
        fakeIdToCallback = {},
        lastFakeId = 0,
        maxFakeId = 0x7FFFFFFF, // 2 ^ 31 - 1, 31 bit, positive values of signed 32 bit integer
        logPrefix = 'HackTimer.js by turuslan: ';
    if (typeof (Worker) !== 'undefined') {
        function getFakeId() {
            do {
                if (lastFakeId == maxFakeId) {
                    lastFakeId = 0;
                } else {
                    lastFakeId++;
                }
            } while (fakeIdToCallback.hasOwnProperty(lastFakeId));
            return lastFakeId;
        }
        try {
            worker = new Worker(workerScript);
            window.setInterval = function (callback, time /* , parameters */) {
                var fakeId = getFakeId();
                fakeIdToCallback[fakeId] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call(arguments, 2)
                };
                worker.postMessage({
                    name: 'setInterval',
                    fakeId: fakeId,
                    time: time
                });
                return fakeId;
            };
            window.clearInterval = function (fakeId) {
                if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                    delete fakeIdToCallback[fakeId];
                    worker.postMessage({
                        name: 'clearInterval',
                        fakeId: fakeId
                    });
                }
            };
            window.setTimeout = function (callback, time /* , parameters */) {
                var fakeId = getFakeId();
                fakeIdToCallback[fakeId] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call(arguments, 2),
                    isTimeout: true
                };
                worker.postMessage({
                    name: 'setTimeout',
                    fakeId: fakeId,
                    time: time
                });
                return fakeId;
            };
            window.clearTimeout = function (fakeId) {
                if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                    delete fakeIdToCallback[fakeId];
                    worker.postMessage({
                        name: 'clearTimeout',
                        fakeId: fakeId
                    });
                }
            };
            worker.onmessage = function (event) {
                var data = event.data,
                    fakeId = data.fakeId,
                    request,
                    parameters,
                    callback;
                if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                    request = fakeIdToCallback[fakeId];
                    callback = request.callback;
                    parameters = request.parameters;
                    if (request.hasOwnProperty('isTimeout') && request.isTimeout) {
                        delete fakeIdToCallback[fakeId];
                    }
                }
                if (typeof (callback) === 'string') {
                    try {
                        callback = new Function(callback);
                    } catch (error) {
                        console.log(logPrefix + 'Error parsing callback code string: ', error);
                    }
                }
                if (typeof (callback) === 'function') {
                    callback.apply(window, parameters);
                }
            };
            worker.onerror = function (event) {
                console.log(event);
            };
        } catch (error) {
            console.log(logPrefix + 'Initialisation failed');
            console.error(error);
        }
    } else {
        console.log(logPrefix + 'Initialisation failed - HTML5 Web Worker is not supported');
    }
})('HackTimerWorker.js');

const timer = document.querySelector(".pomo-text");
const animate = document.querySelector(".pomo-timer");
const pomo_25 = document.querySelector(".pomo1");
const pomo_50 = document.querySelector(".pomo2");
const timer_state = document.querySelector(".state");
const timer_reset = document.querySelector(".reset");
let flag = false;
let paused = false;
let id;

const runTimer = () => {
    animate.classList.remove('ani-rotate-off');
    animate.classList.add('ani-rotate-on');
    id = setInterval(() => {
        let str1 = timer.innerText.split(':')[0];
        let str2 = timer.innerText.split(':')[1];
        let min = Number.parseInt(str1);
        let sec = Number.parseInt(str2);

        if (sec == 0) {
            min = min - 1;
            sec = 59;
        }
        else
            sec--;

        if (min < 10)
            str1 = "0" + min.toString();
        else
            str1 = min.toString();

        if (sec < 10)
            str2 = "0" + sec.toString();
        else
            str2 = sec.toString();

        timer.innerText = `${str1}:${str2}`;

        if (min == 0 && sec == 0) {
            flag = false;
            paused = false;
            timer.innerText = `00:00`;

            alarm = new Audio();
            alarm.src = `assets\\alarm.mp3`;
            alarm.play();
            animate.classList.remove('ani-rotate-on');
            animate.classList.add('ani-rotate-off');
            clearInterval(id);
        }
    }, 1000);
}

const main = () => {
    pomo_25.addEventListener('click', () => {
        if (flag)
            clearInterval(id);
        if (paused)
            timer_state.innerText = "Pause";

        id = 0;
        flag = true;
        paused = false;
        timer.innerText = `25:00`;
        runTimer();
    })

    pomo_50.addEventListener('click', () => {
        if (flag == true)
            clearInterval(id);
        if (paused)
            timer_state.innerText = "Pause";

        id = 0;
        flag = true;
        paused = false;
        timer.innerText = `50:00`;
        runTimer();
    })

    timer_state.addEventListener('click', () => {
        if (flag && paused == false) {
            clearInterval(id);
            id = 0;
            timer_state.innerText = "Continue";
            paused = true;
            animate.classList.remove('ani-rotate-on');
            animate.classList.add('ani-rotate-off');
        }
        else if (flag && paused == true) {
            timer_state.innerText = "Pause";
            paused = false;
            runTimer();
        }
    })

    timer_reset.addEventListener('click', () => {
        if (flag) {
            clearInterval(id);
            id = 0;
            flag = false;
            paused = false;
            timer_state.innerText = "Pause";
            timer.innerText = `00:00`;
            animate.classList.remove('ani-rotate-on');
            animate.classList.add('ani-rotate-off');
        }
    })
}

main()