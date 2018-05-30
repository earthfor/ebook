import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Search.css'

class Search extends Component {
  static get propTypes () {
    return {
      change: PropTypes.any,
      keyDown: PropTypes.any,
      autoFocus: PropTypes.bool
    }
  }
  render () {
    return (
      <div className='search-container'>
        <div className='search-item search-item-input'>
          <input autoFocus={this.props.autoFocus} className='search-item-input-content' type='text' name='search' placeholder='请输入小说名称，作者，主角' autoComplete='off'
            onChange={(e) => this.props.change(e.target.value)}
            onKeyDown={(e) => this.props.keyDown(e)}
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
