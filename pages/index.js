import React from 'react'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import { sortBy } from 'ramda'

// Styles for highlighted code blocks.
import 'css/zenburn.css'

export default class Index extends React.Component {
  render () {
    const pages = this.props.route.pages.filter(page => page.data.date);
    const sortedPages = sortBy(page => page.data.date, pages).reverse();

    const pageLinks = sortedPages.map(page => {
      return <li
        key={page.path}
        style={{
          marginBottom: rhythm(1/4),
        }}
      >
        <Link to={prefixLink(page.path)}>{page.data.title}</Link>
      </li>
    })

    return (
      <DocumentTitle title={config.siteTitle}>
        <div>
        {pageLinks}
        </div>
      </DocumentTitle>
    )
  }
}
