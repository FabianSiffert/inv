import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

const busyShowDelay = 250
const busyMinimumVisible = 500

interface ContextProps {
  headerItem?: ReactNode
  setHeaderItem: (newHeaderMiddleItem: ReactNode) => void
  isBusy: boolean
  setBusy: (isBusy: boolean) => void
}

export const HeaderContext = createContext<ContextProps>({
  headerItem: undefined,
  setHeaderItem: () => {},
  isBusy: false,
  setBusy: () => {}
})

interface Props {
  children?: React.ReactNode
}

const HeaderProvider: React.FC<Props> = ({ children }) => {
  const [headerMiddleItem, setHeaderMiddleItem] = useState<ReactNode>(undefined)
  const [isBusy, setIsBusy] = useState(false)

  const setHeaderItem = useCallback((newHeaderMiddleItem: ReactNode) => {
    setHeaderMiddleItem(() => newHeaderMiddleItem)
  }, [])

  const setBusy = useCallback((busy: boolean) => setIsBusy(busy), [])

  const [isBusyShown, setBusyShown] = useState(false)
  const busyShownAt = useRef(0)

  useEffect(() => {
    if (isBusy) {
      const timeout = window.setTimeout(() => {
        busyShownAt.current = Date.now()
        setBusyShown(true)
      }, busyShowDelay)
      return () => window.clearTimeout(timeout)
    }
    const remaining = busyMinimumVisible - (Date.now() - busyShownAt.current)
    const timeout = window.setTimeout(() => setBusyShown(false), Math.max(remaining, 0))
    return () => window.clearTimeout(timeout)
  }, [isBusy])

  const contextValue = useMemo(
    () => ({
      headerItem: headerMiddleItem,
      setHeaderItem,
      isBusy: isBusyShown,
      setBusy
    }),
    [headerMiddleItem, setHeaderItem, isBusyShown, setBusy]
  )

  return <HeaderContext.Provider value={contextValue}>{children}</HeaderContext.Provider>
}

export default HeaderProvider
