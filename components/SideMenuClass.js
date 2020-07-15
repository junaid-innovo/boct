import React,{Component} from 'react';
import sideMenuStyle from "../css/sideMenu";
import SideMenu from 'react-sidemenu';

class SideMenuClass extends Component{
    render(){
       return  <SideMenu items={sideMenuStyle}></SideMenu>
    }
}

export default SideMenuClass;