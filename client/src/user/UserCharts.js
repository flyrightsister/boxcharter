/*
 * Copyright (c) 2017 Bonnie Schulkin. All Rights Reserved.
 *
 * This file is part of BoxCharter.
 *
 * BoxCharter is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * BoxCharter is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with BoxCharter. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * Component for displaying a table of a user's charts
 * @module
 * UserCharts
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import ChartRow from './ChartRow'
import { getUserCharts } from './userActions'

class UserCharts extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    if (this.props.auth && this.props.auth.user && this.props.auth.user.userId) {
      this.props.getUserCharts(this.props.auth.user.userId)
    }
  }
  render() {
    const chartRows = this.props.charts.map((chart) => {
      return (<ChartRow key={chart.chartId} chart={chart} />)
    })

    return (
      <div className="user-charts">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {chartRows}
          </tbody>
        </table>
      </div>
    )
  }
}

function mapStateToProps({ auth, charts }) {
  return { auth, charts }
}

export default connect(mapStateToProps, { getUserCharts })(UserCharts);