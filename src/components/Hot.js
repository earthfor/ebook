import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Hot.css'

class HotItem extends Component {
  static get propTypes () {
    return {
      data: PropTypes.array
    }
  }

  render () {
    const dom = this.props.data.map((v) => (
      <li className='hot-data-content-item'>{v.text}</li>
    ))

    return (
      <ul>{ dom }</ul>
    )
  }
}

class Hot extends Component {
  static get propTypes () {
    return {
      title: PropTypes.string,
      data: PropTypes.array
    }
  }

  render () {
    return (
      <div className='hot-container'>
        <div className='hot-title-container'>
          <i className='fas fa-fire hot-title-icon' />
          <div className='hot-title-content'>{ this.props.title }</div>
        </div>
        <div className='hot-data-container'>
          <HotItem className='hot-data-content' data={this.props.data} />
        </div>
      </div>
    )
  }
}

export default Hot
