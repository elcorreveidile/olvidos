"use client"

import * as React from "react"

const DropdownMenuContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  open: false,
  setOpen: () => {},
})

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)

  return (
    <button
      onClick={() => setOpen(!open)}
      className="inline-flex justify-center rounded-md text-sm font-medium"
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  children,
  align = "start",
}: {
  children: React.ReactNode
  align?: "start" | "end" | "center"
}) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  const alignClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg ${alignClasses[align]}`}
    >
      <div className="py-1">{children}</div>
    </div>
  )
}

export function DropdownMenuItem({
  children,
  onClick,
  asChild,
}: {
  children: React.ReactNode
  onClick?: () => void
  asChild?: boolean
}) {
  const { setOpen } = React.useContext(DropdownMenuContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => {
        setOpen(false)
        if (onClick) onClick()
      },
    })
  }

  return (
    <button
      onClick={() => {
        setOpen(false)
        if (onClick) onClick()
      }}
      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {children}
    </button>
  )
}
