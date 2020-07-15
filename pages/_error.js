import React from "react";
import PropTypes from "prop-types";

import { withTranslation } from "../i18n";
import { NOT_FOUND } from "../components/Constants/HTTP_STATUS/status";
import NextError from "next/error";
const Error = ({ statusCode, t }) => {
  let errorContent = null;
  if (statusCode === NOT_FOUND) {
    errorContent = <NextError statusCode={statusCode} />;
  } else {
    errorContent = (
      <p>
        {statusCode
          ? t("error-with-status", { statusCode })
          : t("error-without-status")}
      </p>
    );
  }
  return errorContent;
};

Error.getInitialProps = async ({ res, err }) => {
  let statusCode = null;
  if (res) {
    ({ statusCode } = res);
  } else if (err) {
    ({ statusCode } = err);
  }
  return {
    namespacesRequired: ["common"],
    statusCode,
  };
};

Error.defaultProps = {
  statusCode: null,
};

Error.propTypes = {
  statusCode: PropTypes.number,
  t: PropTypes.func.isRequired,
};

export default withTranslation("common")(Error);
