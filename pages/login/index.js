// import Live from "../components/Live/Live";
import Login from "../../components/Containers/Login";

// import "./index.css";
import { i18n, Link, withTranslation } from "../../i18n";
import { checkServerSideCookie } from "../../store/actionsCreators/loginCreator";
const LoginComp = (props) => {
  return (
    <React.Fragment>
      <Login {...props} />
    </React.Fragment>
  );
};
// LoginComp.getInitialProps = async ctx) => {
//   // checkServerSideCookie(ctx),
//   return {namespacesRequired: ["common"] };
//   // rest of code
// };
LoginComp.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

export default withTranslation("common")(LoginComp);
