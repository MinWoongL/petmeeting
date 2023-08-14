import React from "react";
import LoadingLogo from "../../assets/images/petmeeting_logo_loading.png";
import MovingLogo from "../../assets/images/MovingLogo.gif";

const LoadingMain = () => {

    return(
        <div style={{ 
            // backgroundColor: "var(--dark)", 
            backgroundColor: "black",
            minHeight: "100vh", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center" }}>
            <img src={MovingLogo} alt="Loading Logo" style={{maxWidth: "30%", maxHeight: "100%" }}></img>
        </div>
    );
};

export default LoadingMain;