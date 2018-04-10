import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import Post from '../components/Post'

export default class DraftsPage extends Component {
  render() {
    return (
      <Query query={DRAFTS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>Loading ...</div>
              </div>
            )
          }

          if (error) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>An unexpected error occured.</div>
              </div>
            )
          }
          return (
            <Fragment>
              <div className="flex justify-between items-center">
                <h1>Drafts</h1>
              </div>
              {data.drafts &&
                data.drafts.map(draft => (
                  <Post
                    key={draft.id}
                    post={draft}
                    isDraft={!draft.isPublished}
                  />
                ))}
              {this.props.children}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export const DRAFTS_QUERY = gql`
  query DraftsQuery {
    drafts {
      id
      text
      title
      imageUrl
      isPublished
    }
  }
`