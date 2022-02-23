import React, { FC, useRef, useEffect } from 'react'
import { UtterancesProps } from './types'
import { createScriptElement, putChildElement } from './util'

const Utterances: FC<UtterancesProps> = ({
  repo,
  label,
  theme,
  issueTerm,
  issueNumber
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const scriptEl = createScriptElement({
      repo,
      label,
      theme,
      issueTerm,
      issueNumber: issueNumber as never
    })

    putChildElement(ref.current, scriptEl)
  }, [issueNumber, issueTerm, label, repo, theme])

  return <div ref={ref} />
}

export default Utterances
