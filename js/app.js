document.addEventListener("DOMContentLoaded", function () {
    const startMicrophoneTestButton = document.getElementById("startMicrophoneTest");
    const stopMicrophoneTestButton = document.getElementById("stopMicrophoneTest");
    const startSpeakerTestButton = document.getElementById("startSpeakerTest");

    let mediaRecorder;
    let chunks = [];

    startMicrophoneTestButton.addEventListener("click", startMicrophoneTest);
    stopMicrophoneTestButton.addEventListener("click", stopMicrophoneTest);
    startSpeakerTestButton.addEventListener("click", startSpeakerTest);

    function startMicrophoneTest() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const microphone = audioContext.createMediaStreamSource(stream);

                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);

                    playAudio(audioUrl);

                    // 清空chunks数组
                    chunks = [];
                };

                mediaRecorder.start();

                startMicrophoneTestButton.style.display = "none";
                stopMicrophoneTestButton.style.display = "inline-block";
            })
            .catch(error => {
                console.error("访问麦克风时出错:", error);
                alert("麦克风测试失败。请检查您的麦克风并重试。");
            });
    }

    function stopMicrophoneTest() {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }

        startMicrophoneTestButton.style.display = "inline-block";
        stopMicrophoneTestButton.style.display = "none";
    }

    function startSpeakerTest() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine"; // You can change the waveform type if needed
        oscillator.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2); // Stop after 2 seconds

        alert("扬声器测试成功！");
    }

    function playAudio(audioUrl) {
        const audioElement = new Audio(audioUrl);
        audioElement.play();
    }
});
