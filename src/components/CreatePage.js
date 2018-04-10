import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { DRAFTS_QUERY } from './DraftsPage'

class CreatePage extends Component {
  state = {
    title: '',
    text: '',
    imageUrl: ''
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_DRAFT_MUTATION}
        update={(cache, { data }) => {
          const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
          cache.writeQuery({
            query: DRAFTS_QUERY,
            data: { drafts: drafts.concat([data.createDraft]) },
          })
        }}
      >
        {(createDraft, { data, loading, error }) => {
          return (
            <div className="pa4 flex justify-center bg-white">
              <form
                onSubmit={async e => {
                  e.preventDefault()
                  const { title, text, imageUrl } = this.state
                  await createDraft({
                    variables: { title, text, imageUrl },
                  })
                  this.props.history.replace('/drafts')
                }}
              >
                <h1>Create Draft</h1>
                <input
                  autoFocus
                  className="w-100 pa2 mv2 br2 b--black-20 bw1"
                  onChange={e => this.setState({ imageUrl: e.target.value })}
                  placeholder="Image URL"
                  type="text"
                  value={this.state.imageUrl}
                />
                <input
                  autoFocus
                  className="w-100 pa2 mv2 br2 b--black-20 bw1"
                  onChange={e => this.setState({ title: e.target.value })}
                  placeholder="Title"
                  type="text"
                  value={this.state.title}
                />
                <textarea
                  className="db w-100 ba bw1 b--black-20 pa2 br2 mb2"
                  cols={50}
                  onChange={e => this.setState({ text: e.target.value })}
                  placeholder="Content"
                  rows={8}
                  value={this.state.text}
                />
                <input
                  className={`pa3 bg-black-10 bn ${this.state.text &&
                    this.state.title && this.state.imageUrl && 
                    'dim pointer'}`}
                  disabled={!this.state.text || !this.state.title || !this.state.imageUrl}
                  type="submit"
                  value="Create"
                />
                <a className="f6 pointer" onClick={this.props.history.goBack}>
                  or cancel
                </a>
              </form>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

export default withRouter(CreatePage)

const CREATE_DRAFT_MUTATION = gql`
  mutation CreateDraftMutation($title: String!, $text: String!, $imageUrl: String!) {
    createDraft(title: $title, text: $text, imageUrl: $imageUrl) {
      id
      title
      text
      imageUrl
      isPublished
    }
  }
`