import React from "react";
import LoadingLogo from "../../assets/images/petmeeting_logo_loading.png";

const LoadingMain = () => {

    return(
        <div style={{ backgroundColor: "var(--dark)", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={LoadingLogo} alt="Loading Logo" style={{maxWidth: "20%", maxHeight: "100%" }}></img>
        </div>
    );
};

export default LoadingMain;