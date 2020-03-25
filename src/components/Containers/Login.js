import React, {Component} from 'react';
import {Button, FormGroup, FormControl, FormLabel} from 'react-bootstrap';
import '../../css/Login.css';
import App from './App';
import Logo from '../../images/controltower.png';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedin: false,
    };
  }
  validateForm = () => {
    return this.state.email.length > 0 && this.state.password.length > 0;
  };

  handleSubmit = event => {
    this.setState({
      loggedin: true,
    });
    event.preventDefault();
  };
  rednerLoginDesign = () => {
    return (
      <div className="container-fluid">
        <div className="row mt-5">
          <div className="m-auto">
            <div className="col-12">
              <img
                alt="logo"
                style={{maxHeight: '100px', maxWidth: '100px'}}
                src={Logo}
              />
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="m-auto">
            <div className="col-12">
              <h6>Control Tower For Van Sales</h6>
            </div>
          </div>
        </div>
        <div className="row m-auto">
          <div className="col-12">
            <div className="Login">
              <form onSubmit={this.handleSubmit}>
                <FormGroup controlid="email" bssize="large">
                  <FormLabel>Email</FormLabel>
                  <FormControl
                    autoFocus
                    type="email"
                    value={this.state.email}
                    onChange={e => this.setState({email: e.target.value})}
                  />
                </FormGroup>
                <FormGroup controlId="password" bssize="large">
                  <FormLabel>Password</FormLabel>
                  <FormControl
                    value={this.state.password}
                    onChange={e => this.setState({password: e.target.value})}
                    type="password"
                  />
                </FormGroup>
                <Button
                  block
                  bssize="large"
                  disabled={!this.validateForm()}
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    if (this.state.loggedin) {
      return <App></App>;
    } else {
      return this.rednerLoginDesign();
    }
  }
}
export default Login;
