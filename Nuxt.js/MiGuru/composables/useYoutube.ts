/// <reference path="../.nuxt/types/youtube.d.ts" />

export const useYouTube = (): Promise<typeof window.YT> => {
  return new Promise((resolve) => {
    if (window.YT && typeof window.YT.Player === 'function') {
      resolve(window.YT)
    } else {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)

      window.onYouTubeIframeAPIReady = () => {
        resolve(window.YT)
      }
    }
  })
}
