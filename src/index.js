import React, { useState, useRef, useMemo } from 'react';

function useUploadProgress() {
  const [lastProgressEvent, setLastProgressEvent] = useState()
  const [currentProgressEvent, setCurrentProgressEvent] = useState()
  const currentProgressEventRef = useRef()

  currentProgressEventRef.current = currentProgressEvent

  const currentProgress = useMemo(() => {
    const loaded = currentProgressEvent?.loaded || 0
    const total = currentProgressEvent?.total || 0
    return total ? Math.round((loaded * 100) / total) : 0
  }, [currentProgressEvent])

  const resetProgress = () => {
    setLastProgressEvent(undefined)
    setCurrentProgressEvent(undefined)
  }

  const currentSpeed = useMemo(() => {
    if (!lastProgressEvent) return 0
    const d = ((currentProgressEvent?.timeStamp || 0) - (lastProgressEvent?.timeStamp || 0)) / 1000
    const bytes = (currentProgressEvent?.loaded || 0) - (lastProgressEvent?.loaded || 0)
    return d ? (bytes / d) : 0
  }, [currentProgressEvent, lastProgressEvent])

  const currentETA = useMemo(() => {
    if (!currentSpeed) return 0
    const remainingBytes = (currentProgressEvent?.total || 0) - (currentProgressEvent?.loaded || 0)
    return remainingBytes / currentSpeed
  }, [currentProgressEvent, currentSpeed])

  const handleProgress = progressEvent => {
    console.log(progressEvent);
    setLastProgressEvent(currentProgressEventRef.current)
    setCurrentProgressEvent(progressEvent)
  }

  return [handleProgress, currentProgress, currentSpeed, currentETA, resetProgress];
}

export default useUploadProgress