import ControlTower from "../../components/ControlTower/Controltower";
import Layout from "../../components/Layout/Layout";
import { withTranslation } from "../../i18n";

const controltowercomp = (props) => {
  return (
    <React.Fragment>
      <Layout {...props}>
        <ControlTower {...props} />
      </Layout>
    </React.Fragment>
  );
};
controltowercomp.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});
export default withTranslation("common")(controltowercomp);
