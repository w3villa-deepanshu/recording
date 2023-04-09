document.addEventListener('DOMContentLoaded',async () => {
  const startBtn = document.querySelector("#start-btn")
  const stopBtn = document.querySelector("#stop-btn")
  const saveBtn = document.querySelector("#save-btn")
  let stream,recorder,chunks=[]

startBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log("start btn")
  stream = await startCapture()
  recorder = startRecording(stream,chunks)
})

stopBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log("stop btn")
  stopCapture(stream)
  stopRecording(recorder)
  console.log("chunks",{chunks})
})

saveBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log("save btn")
  const recoding = await saveRecording(chunks)
  console.log(recoding);
})


async function startCapture() {
  let stream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({audio:false});
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
  } catch (error) {
    console.log(error)
  }
  const tracks = [...stream.getTracks(),...videoStream.getTracks()]
  return new MediaStream(tracks);
}

function stopCapture(stream) {
  stream.getTracks().forEach(track => track.stop())
}

function startRecording(stream,chunks) {
  const recorder = new MediaRecorder(stream)
  recorder.ondataavailable = (e) => {
    chunks.push(e.data)
  }
  recorder.start()
  return recorder;
}

function stopRecording(recorder) {
  recorder.stop()
}

async function saveRecording(chunks) {
const file = new File(chunks,{
  type: 'video/webm',
  filename: "recoding.webm"
});

const formData = new FormData()
const token = document.getElementsByName('csrf-token')[0]
formData.append('recording[file]',file)
return await fetch('/recordings',{
  method:"POST",
  headers: {
    'X-CSRF-Token': token,
  },
  body: formData
}).then(r => r.json())
}
})