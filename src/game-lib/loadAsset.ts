export async function loadImage (path: string) {
  const imgURL = new URL(path, import.meta.url).href
  const image = new Image()
  image.src = imgURL
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = (event) => reject(event)
  })
}

export async function loadAudio (path: string) {
  const audioURL = new URL(path, import.meta.url).href
  const audio = new Audio(audioURL)
  return new Promise((resolve, reject) => {
    audio.onload = () => resolve(audio)
    audio.onerror = (event) => reject(event)
  })
}
