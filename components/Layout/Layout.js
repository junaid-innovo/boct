import NavBar from "../NavBar/NavBar";
const layout = (props) => {
  return (
    <React.Fragment>
      <div className="container-fluid">
        <NavBar  {...props}/>
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default layout;
