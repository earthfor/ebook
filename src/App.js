import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css'

import './App.css'

import Index from './page/Index'
import Rank from './page/Rank'
import Explore from './page/Explore'

class App extends Component {
  constructor () {
    super()
    this.state = {
      show: {
        rightNav: false
      }
    }
  }
  changeRightNav (state) {
    this.setState({
      show: {
        rightNav: !!state
      }
    })
  }
  render () {
    return (
      <Router>
        <div>
          <div className='nav-container'>
            <div className='nav'>
              <div className='nav-left'>
                <div className='nav-item'>
                  <Link to='/'>搜索</Link>
                </div>
                <div className='nav-item'>
                  <Link to='/rank'>排行</Link>
                </div>
                <div className='nav-item'>
                  <Link to='/explore'>发现</Link>
                </div>
              </div>
              <div className='nav-right'
                onMouseEnter={() => this.changeRightNav(true)}
                onMouseLeave={() => this.changeRightNav(false)}
              >
                <div
                  className={`nav-right-head ${this.state.show.rightNav && 'nav-right-head-hover'}`}
                >
                  <div className='nav-right-icon'>
                    <i className='fas fa-bars' />
                  </div>
                </div>
                { this.state.show.rightNav === true &&
                  <div className='nav-right-ul'>
                    <div className='nav-item nav-right-item'>
                      <a href='/help'>帮助</a>
                    </div>
                    <div className='nav-item nav-right-item'>
                      <a href='/setting'>设置</a>
                    </div>
                    <div className='nav-item nav-right-item'>
                      <a href='/download'>下载</a>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className='body-container'>
            <Route exact path='/' component={Index} />
            <Route path='/rank' component={Rank} />
            <Route path='/explore' component={Explore} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
