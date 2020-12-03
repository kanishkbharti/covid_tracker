import React from "react";
import Dialog from "@material-ui/core/Dialog";
import ReactChar from "../../ReactChar";
import CancelIcon from "@material-ui/icons/Cancel";

const ResultDialog = ({ result, setRedirect }) => {
  const data = {
    confirmed: result["TotalConfirmed"],
    recovered: result["TotalRecovered"],
    deaths: result["TotalDeaths"]
  };

  console.log(data);

  const close = () => {
    setRedirect(false);
  };
  return (
    <Dialog open={true} fullScreen>
      <button className="btn btn-primary" onClick={close}>
        <CancelIcon />
      </button>
      <ReactChar country={result["Country"]} data={data} />
    </Dialog>
  );
};

export default ResultDialog;
