// import Live from "../components/Live/Live";
import Layout from "../../components/Layout/Layout";

// import "./index.css";
import { i18n, Link, withTranslation } from "../../i18n";
const StaticRouteComp = (props) => {
  return (
    <React.Fragment>
      <Layout {...props}>Static Route</Layout>
    </React.Fragment>
  );
};
StaticRouteComp.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

export default withTranslation("common")(StaticRouteComp);
