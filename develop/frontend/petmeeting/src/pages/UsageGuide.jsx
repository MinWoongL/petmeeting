import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HowToUse() {



    return (
        <Box>
            <Typography>
                이용방법
            </Typography>
            <Box>
                <Typography>
                    조작방법
                </Typography>


            </Box>
            <Box>
                <Typography>
                    후원방법
                </Typography>
            </Box>


        </Box>
    )
}

