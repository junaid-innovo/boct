import Live from "../components/Live/Live";
import Layout from "../components/Layout/Layout";

// import "./index.css";
import { i18n, Link, withTranslation } from "../i18n";
const LiveComp = (props) => {
  console.log("props now", props);
  return (
    <React.Fragment>
      <Layout {...props}>
        <Live {...props} />
      </Layout>
    </React.Fragment>
  );
};
LiveComp.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

export default withTranslation("common")(LiveComp);
