import { useEffect, useMemo, useRef, useState } from "react"
import { Braces, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { COMMON_VARIABLES } from "@/lib/variables"

type FieldTarget = {
  el: HTMLInputElement | HTMLTextAreaElement
  start: number
  end: number
}

/**
 * Inserts a `{{variable}}` token into whichever plain text field the user was
 * last editing — the Subject input or a GrapesJS trait field like Href, both
 * ordinary `<input>` elements in the same document. GrapesJS's canvas is a
 * contentEditable region inside an iframe, which this deliberately can't
 * reach; picking a variable there instead copies it to the clipboard.
 */
export function VariablePicker({ variables }: { variables: string[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)
  const target = useRef<FieldTarget | null>(null)

  useEffect(() => {
    function handleFocusOut(e: FocusEvent) {
      const el = e.target
      if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return
      // Ignore the picker's own search box losing focus when an item is clicked.
      if (el.closest("[data-variable-picker]")) return
      target.current = {
        el,
        start: el.selectionStart ?? el.value.length,
        end: el.selectionEnd ?? el.value.length,
      }
    }
    function handleFocusIn(e: FocusEvent) {
      // The GrapesJS canvas is an iframe — once it's focused, the last
      // recorded field is almost certainly stale, so stop offering it.
      if (e.target instanceof HTMLIFrameElement) target.current = null
    }
    document.addEventListener("focusout", handleFocusOut, true)
    document.addEventListener("focusin", handleFocusIn, true)
    return () => {
      document.removeEventListener("focusout", handleFocusOut, true)
      document.removeEventListener("focusin", handleFocusIn, true)
    }
  }, [])

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 2500)
    return () => clearTimeout(timer)
  }, [feedback])

  const items = useMemo(() => {
    const merged = [...new Set([...variables, ...COMMON_VARIABLES])].sort()
    const q = query.trim().toLowerCase()
    return q ? merged.filter((v) => v.toLowerCase().includes(q)) : merged
  }, [variables, query])

  function handleSelect(token: string) {
    const text = `{{${token}}}`
    const current = target.current

    if (current && document.contains(current.el)) {
      const { el, start, end } = current
      const proto =
        el instanceof HTMLTextAreaElement
          ? window.HTMLTextAreaElement.prototype
          : window.HTMLInputElement.prototype
      // Setting `.value` directly skips React's change-tracking on controlled
      // inputs (like Subject); going through the native setter and firing a
      // real `input` event is what makes React — and GrapesJS's own trait
      // bindings — pick the change up.
      const nativeSetter = Object.getOwnPropertyDescriptor(proto, "value")?.set
      const value = el.value
      nativeSetter?.call(el, value.slice(0, start) + text + value.slice(end))
      el.dispatchEvent(new Event("input", { bubbles: true }))
      el.dispatchEvent(new Event("change", { bubbles: true }))

      const cursor = start + text.length
      el.focus()
      el.setSelectionRange(cursor, cursor)
      target.current = { el, start: cursor, end: cursor }
      setFeedback(`Inserted ${text}`)
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => setFeedback(`Copied ${text} — paste it where you need it`))
        .catch(() => setFeedback(`Couldn't copy — type ${text} manually`))
    }

    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          title="Click a field, then insert a {{variable}} into it"
        >
          <Braces />
          Variables
        </Button>
      </PopoverTrigger>
      <PopoverContent data-variable-picker align="end" className="p-0">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search variables"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {items.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-muted-foreground">
              No matching variables
            </p>
          ) : (
            items.map((token) => (
              <button
                key={token}
                type="button"
                onClick={() => handleSelect(token)}
                className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                <span className="truncate font-mono text-xs">{`{{${token}}}`}</span>
                {variables.includes(token) && (
                  <span className="shrink-0 text-[10px] text-muted-foreground">used</span>
                )}
              </button>
            ))
          )}
        </div>
        <div className="border-t px-3 py-2 text-xs text-muted-foreground">
          {feedback ?? "Click a field, then pick a variable to insert it there."}
        </div>
      </PopoverContent>
    </Popover>
  )
}
