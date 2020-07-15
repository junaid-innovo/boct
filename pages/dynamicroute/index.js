import DynamicRouting from "../../components/RoutesPlan/DynamicRouting";
import Layout from "../../components/Layout/Layout";

// import "./index.css";
import { i18n, Link, withTranslation } from "../../i18n";
const DynamicRouteComp = (props) => {
  return (
    <React.Fragment>
      <Layout {...props}>
        <DynamicRouting {...props} />
      </Layout>
    </React.Fragment>
  );
};
DynamicRouteComp.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

export default withTranslation("common")(DynamicRouteComp);
