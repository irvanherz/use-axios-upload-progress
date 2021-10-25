import { act, renderHook } from '@testing-library/react-hooks'
import useUploadProgress from '../src/index'

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

test('should update current progress', () => {
  let sizeTotal = 100000
  let sizeLoaded = 0
  let progress = 0

  const { result } = renderHook(() => useUploadProgress())

  while (sizeLoaded < sizeTotal) {
    const [handleProgress] = result.current

    // generate random progress
    const randomProgress = generateRandomProgress(sizeTotal, sizeLoaded)

    // update loaded size
    sizeLoaded = randomProgress.loaded

    // calculate progress
    progress = Math.round((sizeLoaded * 100) / sizeTotal)

    act(() => {
      handleProgress(randomProgress)
    })

    const [, currentProgress] = result.current

    // check current progress
    expect(currentProgress).toBe(progress)
  }
})

test('should update current speed', async () => {
  jest.useFakeTimers()

  let sizeTotal = 100000
  let sizeLoaded = 0
  let timestamp = Date.now()
  let progress = 0
  let speed = 0

  const { result } = renderHook(() => useUploadProgress())

  while (sizeLoaded < sizeTotal) {
    jest.advanceTimersByTime(1000)

    const [handleProgress] = result.current

    // generate random progress
    const randomProgress = generateRandomProgress(sizeTotal, sizeLoaded)

    if (progress) {
      // calculate current speed
      const size = randomProgress.loaded - sizeLoaded
      const duration = (randomProgress.timeStamp - timestamp) / 1000
      speed = size / duration
    }

    // update loaded size and timestamp
    sizeLoaded = randomProgress.loaded
    timestamp = randomProgress.timeStamp

    // calculate progress
    progress = Math.round((sizeLoaded * 100) / sizeTotal)

    act(() => {
      handleProgress(randomProgress)
    })

    const [, , currentSpeed] = result.current

    // check current speed
    expect(currentSpeed).toBe(speed)
  }
})

test('should update current ETA', async () => {
  jest.useFakeTimers()

  let sizeTotal = 100000
  let sizeLoaded = 0
  let timestamp = Date.now()
  let progress = 0
  let speed = 0
  let ETA = 0

  const { result } = renderHook(() => useUploadProgress())

  while (sizeLoaded < sizeTotal) {
    jest.advanceTimersByTime(1000)

    const [handleProgress] = result.current

    // generate random progress
    const randomProgress = generateRandomProgress(sizeTotal, sizeLoaded)

    if (progress) {
      // calculate current speed
      const size = randomProgress.loaded - sizeLoaded
      const duration = (randomProgress.timeStamp - timestamp) / 1000
      speed = size / duration
    }

    // update loaded size and timestamp
    sizeLoaded = randomProgress.loaded
    timestamp = randomProgress.timeStamp

    // calculate progress
    progress = Math.round((sizeLoaded * 100) / sizeTotal)

    if (speed) {
      // calculate current ETA
      ETA = (sizeTotal - sizeLoaded) / speed
    }

    act(() => {
      handleProgress(randomProgress)
    })

    const [, , , currentETA] = result.current

    // check current ETA
    expect(currentETA).toBe(ETA)
  }
})
