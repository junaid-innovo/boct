// import Live from "../components/Live/Live";
import RoutesPlan from "../../components/RoutesPlan/RoutesPlan";
import Layout from "../../components/Layout/Layout";

// import "./index.css";
import { i18n, Link, withTranslation } from "../../i18n";
const CustomRouteComp = (props) => {
  return (
    <React.Fragment>
      <Layout {...props}>
        <RoutesPlan {...props} />
      </Layout>
    </React.Fragment>
  );
};
CustomRouteComp.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

export default withTranslation("common")(CustomRouteComp);
