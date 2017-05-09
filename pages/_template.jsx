import React from 'react'
import { Container } from 'react-responsive-grid'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import Headroom from 'react-headroom'

import { rhythm } from 'utils/typography'

module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return (
      <div>
        <Headroom
          wrapperStyle={{
            marginBottom: rhythm(1),
          }}
          style={{
            background: 'lightgray',
          }}
        >
          <Container
            style={{
              maxWidth: 960,
              paddingTop: 0,
              padding: `${rhythm(1)} ${rhythm(1/2)}`,
            }}
          >
            <Link
              to={prefixLink('/')}
              style={{
                color: 'black',
                textDecoration: 'none',
              }}
            >
              nabilhassein.github.io
            </Link>
          </Container>
          <Container
            style={{
              maxWidth: 960,
              paddingTop: 0,
              padding: `${rhythm(1)} ${rhythm(1/2)}`,
            }}
          >
            <Link
              to={prefixLink('/projects')}
              style={{
                color: 'black',
                textDecoration: 'none',
              }}
            >
              Projects
            </Link>
            <span> | </span>
            <Link
              to={prefixLink('/presentations')}
              style={{
                color: 'black',
                textDecoration: 'none',
              }}
            >
              Presentations
            </Link>
            <span> | </span>
            <Link
              to={prefixLink('/about')}
              style={{
                color: 'black',
                textDecoration: 'none',
              }}
            >
              About
            </Link>
            <span> | </span>
            <Link
              to={prefixLink('/contact')}
              style={{
                color: 'black',
                textDecoration: 'none',
              }}
            >
              Contact
            </Link>
          </Container>
        </Headroom>
        <Container
          style={{
            maxWidth: 960,
            padding: `${rhythm(1)} ${rhythm(1/2)}`,
            paddingTop: 0,
          }}
        >
          {this.props.children}
        </Container>
      </div>
    )
  },
})
