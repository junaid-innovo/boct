// import Live from "../components/Live/Live";
import Login from "../../components/Containers/Login";

// import "./index.css";
import { i18n, Link, withTranslation } from "../../i18n";
const LoginComp = (props) => {
  return (
    <React.Fragment>
      <Login {...props} />
    </React.Fragment>
  );
};
LoginComp.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

export default withTranslation("common")(LoginComp);
