import { get, isNumber } from "@civility/utilities"
import Error from "next/error"
import React from "react"
import Layout from "../components/Layout"
import Link from "../components/LinkPost"
import { readBlogMeta } from "../services/contentServices"
import { shouldShowPost } from "../utilities/predicates"


class Index extends React.Component {

  mainCategories = [ "code", "music", "photos", "coffee" ]

  state = {
    search: null,
  }

  constructor(props) {
    super(props)
  }

  static async getInitialProps(props) {
    const content = await readBlogMeta()
    const search = props.query.filter || props.query.subDomain
    return { content, search }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ error })
  }

  onChange(evt) {
    const search = evt.target.value || ""
    this.setState({ search })
  }

  render() {
    const { content, error } = this.props
    if (error) return <Error statusCode={error.statusCode} />

    const search = this.state.search == null ? this.props.search : this.state.search

    const searchResults = get(content, [])
      .filter(post => post && shouldShowPost(search, post))
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      .reduce((all, post, currIndex, arr) => {
        const thisYear = new Date(post.created).getFullYear()
        if (!all.length) return [ thisYear, post ]
        const lastPost = arr[currIndex - 1]
        if (isNumber(lastPost)) return all.concat(post)
        const lastYear = new Date(lastPost.created).getFullYear()
        return all.concat(lastYear !== thisYear ? [ thisYear, post ] : [ post ])
      }, [])
      .map((post, index) => isNumber(post)
        ? <h2 key={index}>{post}</h2>
        : <Link key={index} post={post} />,
      )


    return (
      <Layout className="fit-800 pl3 pr3 justify-center">
        { this.props.user ? "LOGGED IN" : ""}
        <h1 className="center h1 p3">Hi! I'm Ben! 👋</h1>
        <p>
          I make things. Mostly code and music.  If you're familiar with my work,
          {" "}you probably use <a href="https://favioli.com">Favioli</a>, saw me on
          {" "}<a href="https://www.youtube.com/channel/UCpznF0d3ky603SFPzJwtT0g">Youtube</a>, or know me personally.
          {" "}So I apologize for whichever of those you have experienced.
        </p>
        <p>
          This blog is basically a place to put random thoughts and stuff. If you haven't gotten
          {" "}enough of me, then feel free to poke around. I try to write stuff in a way that
          {" "}is readable and teaches new things. So hopefully you will learn something new.
        </p>
        <br />
        <ul className="list-reset">{searchResults}</ul>
      </Layout>
    )
  }
}

export default Index
