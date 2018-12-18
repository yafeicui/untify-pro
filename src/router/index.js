import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom'
import './index.scss'
import HomePage from '../pages/menu'
import Login from '../pages/login'
import Register from '../pages/register'
class OuterMain extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return <div className="router-content">
				<Switch>
					<Route path="/" exact>
						<Redirect to="/login" />
					</Route>
					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
					<Route path="/page" component={HomePage} />
				</Switch>
			</div>
  }
}

export default OuterMain
