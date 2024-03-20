export async function loadImage (path: string): Promise<HTMLImageElement> {
  const imgURL = new URL(path, import.meta.url).href
  const image = new Image()
  image.src = imgURL
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = (event) => reject(event)
  })
}

export function loadAudio (path: string): HTMLAudioElement {
  const audioURL = new URL(path, import.meta.url).href
  return new Audio(audioURL)
}
