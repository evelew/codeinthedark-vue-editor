import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view'
import { syntaxHighlighting } from '@codemirror/language'
import { classHighlighter, tagHighlighter, tags } from '@lezer/highlight'
import { Compartment } from '@codemirror/state'
import { html } from '@codemirror/lang-html'

const useEditorSettings = () => {
  const lang = new Compartment().of(html())
  const extensions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    syntaxHighlighting(classHighlighter),
    syntaxHighlighting(
      tagHighlighter([
        {
          tag: tags.angleBracket,
          class: 'tok-angle-bracket'
        },
        {
          tag: tags.name,
          class: 'tok-name'
        },
        {
          tag: tags.tagName,
          class: 'tok-tag-name'
        },
        {
          tag: tags.className,
          class: 'tok-class-name'
        },
        {
          tag: tags.attributeName,
          class: 'tok-attribute-name'
        }
      ])
    )
  ]

  return {
    extensions,
    lang
  }
}

export default useEditorSettings
