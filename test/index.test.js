import { act, renderHook } from '@testing-library/react-hooks'
import useUploadProgress from '../src/index'

test('should update current progress', () => {
  let sizeTotal = 10000
  let sizeLoaded = 0
  let sizeUpdate = 500
  let progress = 0

  const { result } = renderHook(() => useUploadProgress())

  while (sizeLoaded < sizeTotal) {
    const [handleProgress] = result.current

    // update loaded value
    sizeLoaded = sizeLoaded + sizeUpdate

    // calculate progress
    progress = Math.round((sizeLoaded * 100) / sizeTotal)

    act(() => {
      handleProgress({
        total: sizeTotal,
        loaded: sizeLoaded,
      })
    })

    const [, currentProgress] = result.current

    // check current progress
    expect(currentProgress).toBe(progress)
  }
})

test('should update current speed', async () => {
  function generateRandomProgress(total, loaded) {
    const minSize = 1000
    const maxSize = 5000

    loaded = loaded + Math.random() * (maxSize - minSize) + minSize

    if (loaded > total) {
      loaded = total
    }

    return {
      total: total,
      loaded: loaded,
      timeStamp: Date.now(),
    }
  }

  let sizeTotal = 10000
  let sizeLoaded = 0
  let timestamp = Date.now()
  let speed = 0

  const { result, waitFor } = renderHook(() => useUploadProgress())

  while (sizeLoaded < sizeTotal) {
    await waitFor(function () {
      const [handleProgress] = result.current

      // generate random progress
      const randomProgress = generateRandomProgress(sizeTotal, sizeLoaded)

      // calculate current speed
      const size = randomProgress.loaded - sizeLoaded
      const duration = (randomProgress.timeStamp - timestamp) / 1000
      speed = size / duration

      // update loaded size and timestamp
      sizeLoaded = randomProgress.loaded
      timestamp = randomProgress.timeStamp

      act(() => {
        handleProgress(randomProgress)
      })

      const [, , currentSpeed] = result.current

      // check current speed
      expect(currentSpeed).toBe(speed)
    }, { interval: 1000 })
  }
})
