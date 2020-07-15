import RoutesPlan from "../../components/RoutesPlan/RoutesPlan";
import Layout from "../../components/Layout/Layout";

import { withTranslation } from "../../i18n";
const routesplancomp = (props) => {
  return (
    <React.Fragment>
      <Layout {...props}>
        <RoutesPlan {...props} />
      </Layout>
    </React.Fragment>
  );
};
routesplancomp.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

export default withTranslation("common")(routesplancomp);
