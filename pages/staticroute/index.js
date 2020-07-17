import StaticRouting from "../../components/RoutesPlan/StaticRouting";
import Layout from "../../components/Layout/Layout";

// import "./index.css";
import { i18n, Link, withTranslation } from "../../i18n";
const StaticRouteComp = (props) => {
  return (
    <React.Fragment>
      <Layout {...props}>
        <StaticRouting {...props} />
      </Layout>
    </React.Fragment>
  );
};
StaticRouteComp.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

export default withTranslation("common")(StaticRouteComp);
