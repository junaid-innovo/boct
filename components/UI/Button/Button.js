import React from 'react'

const button = (props) => {
   return <button onClick={props.onClick} className={props.className}>{props.children}</button>
}

export default button
