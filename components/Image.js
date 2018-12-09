import { get } from "@civility/utilities"
import React, { useEffect, useState } from "react"
import { readPost } from "../services/contentServices"

export default function Image({ context, ...props }) {
  const postId = get(context, [ "id" ])

  if (!postId || (context.type !== "blog")) {
    return <img {...props} />
  }

  const [ src, setSrc ] = useState("")

  useEffect(() => {
    readPost(postId)
      .then(post => {
        if (src || !post || !post.contentRoot) return
        setSrc(post.contentRoot + props.src
          .replace("./", "/")
          .replace("images/", "medium/"),
        )
      })
  })

  return <img
    {...props}
    className={ "col-12 " + (props.className || "") }
    src={src}
  />
}
