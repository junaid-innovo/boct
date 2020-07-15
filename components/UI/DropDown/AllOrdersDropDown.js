import React, { useState } from 'react'
import { FormControl, Dropdown } from 'react-bootstrap'
import classStyle from './DropDown.module.css'
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
   <a
      href=""
      ref={ref}
      onClick={(e) => {
         e.preventDefault()
         onClick(e)
      }}
   >
      {children}
      <i style={{ fontSize: '12px' }} className="fa fa-chevron-down"></i>
   </a>
))

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
   ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('')

      return (
         <div
            ref={ref}
            style={style}
            className={className}
            aria-labelledby={labeledBy}
            style={{ backgroundColor: '#CCC2A7' }}
         >
            {/* <FormControl
               autoFocus
               className="mx-3 my-2 w-auto"
               placeholder="Type to filter..."
               onChange={(e) => setValue(e.target.value)}
               value={value}
            /> */}
            <ul className={`${classStyle.customDropDown} list-unstyled`}>
               {React.Children.toArray(children).filter(
                  (child) =>
                     !value ||
                     child.props.children.toLowerCase().startsWith(value)
               )}
            </ul>
         </div>
      )
   }
)

const CustomDropDown = (props) => {
   return (
      <Dropdown>
         <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            {props.text}
         </Dropdown.Toggle>
         {/* {props.data.length > 0 && ( */}
         <Dropdown.Menu
            as={CustomMenu}
            className={`className="ml-4  ${classStyle.dropDownMenu}
         `}
         >
            {props.menudata.length > 0 &&
               props.menudata.map((menu, key) => {
                  return (
                     <Dropdown.Item
                        key={key}
                        eventKey="1"
                        value={menu.id}
                        onClick={menu.event}
                     >
                        {menu.text}
                     </Dropdown.Item>
                  )
               })}
         </Dropdown.Menu>
         {/* )} */}
      </Dropdown>
   )
}
export default CustomDropDown
