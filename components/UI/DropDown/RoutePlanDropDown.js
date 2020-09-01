import { Dropdown, FormControl } from "react-bootstrap";
import { useState } from "react";
import style from "./DropDown.module.css";
import { lang } from "moment";
import { ALL_ORDERS, UNASSIGNED_ORDERS } from "../../Constants/Order/Constants";
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <p
    className={`${style.DropdownToggle} form-control rounded-0`}
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <i className="fa fa-chevron-down pull-right"></i>
  </p>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          //   className="mx-3 my-2 w-auto"
          className="rounded-0"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value ||
              child.props.children.toLowerCase().startsWith(value) ||
              child.props.children.toUpperCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);
const CustomDropDown = (props) => {
  let lang = props.language;
  return (
    <Dropdown onSelect={props.dropInfo.event}>
      <Dropdown.Toggle
        className={style.Dropdown}
        as={CustomToggle}
        id="dropdown-custom-components"
      >
        {props.dropInfo.text}
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu} className={`${style.dropDownMenu}`}>
        {props.dropInfo.id === "searchroute" ? (
          <React.Fragment>
            {/* <Dropdown.Item
              as="button"
              key={ALL_ORDERS}
              eventKey={ALL_ORDERS}
              value={ALL_ORDERS}
            >
              {props.dropInfo.text1}
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              key={UNASSIGNED_ORDERS}
              eventKey={UNASSIGNED_ORDERS}
              value={UNASSIGNED_ORDERS}
            >
              {props.dropInfo.text2}
            </Dropdown.Item> */}

            {props.dropInfo.data.length > 0 &&
              props.dropInfo.data.map((menu, key) => {
                return (
                  <Dropdown.Item
                    as="button"
                    key={key}
                    eventKey={menu.route_name && menu.route_name[lang]}
                    value={menu.route_id}
                  >
                    {menu.route_name && menu.route_name[lang]}
                  </Dropdown.Item>
                );
              })}
          </React.Fragment>
        ) : null}

        {props.dropInfo.data.length > 0 &&
          props.dropInfo.data.map((menu, key) => {
            return props.dropInfo.id === "searchcity" ? (
              <Dropdown.Item
                as="button"
                key={key}
                eventKey={menu.location_name[lang]}
                value={menu.loaction_id}
              >
                {menu.location_name[lang]}
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                as="button"
                key={key}
                eventKey={menu.name}
                value={menu.id}
              >
                {menu.name}
              </Dropdown.Item>
            );
          })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropDown;
