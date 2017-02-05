import React from 'react'
import FilterLink from '../containers/FilterLink'

const Footer = () => (
  <p>
    Show:
    {" "}
    <FilterLink filter="showAll">
      All
    </FilterLink>
    {", "}
    <FilterLink filter="showActive">
      Active
    </FilterLink>
    {", "}
    <FilterLink filter="showCompleted">
      Completed
    </FilterLink>
  </p>
)

export default Footer
