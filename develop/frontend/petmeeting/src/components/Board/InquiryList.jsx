import React, { useState } from "react";

function InquiryList(props) {
    const [hoverd, setHovered] = useState(false);


    return (
        <div 
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div>{props.board.title}</div>
        </div>
    )
}

export default InquiryList;