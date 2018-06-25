import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Search.css'

class Search extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.value
    }
  }
  static get propTypes () {
    return {
      value: PropTypes.string,
      change: PropTypes.any,
      keyDown: PropTypes.any,
      autoFocus: PropTypes.bool
    }
  }
  changeValue (value) {
    this.setState({ value })
  }
  render () {
    return (
      <div className='search-container'>
        <div className='search-item search-item-input'>
          <input value={this.state.value} autoFocus={this.props.autoFocus} className='search-item-input-content' type='text' name='search' placeholder='请输入小说名称，作者，主角' autoComplete='off'
            onChange={
              (e) => {
                const { value } = e.target
                this.changeValue(value) // Change value immediately
                this.props.change(value)
              }
            }
            onKeyDown={
              (e) => {
                const value = this.props.keyDown(e)
                console.log(value)
                value !== undefined && this.changeValue(value)
              }
            }
          />
        </div>
        <div className='search-item-btn-container'>
          <button className='search-item search-item-btn-content'><i className='fas fa-search' /></button>
        </div>
      </div>
    )
  }
}

export default Search
