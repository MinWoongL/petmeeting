import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../static/config";

const useDogDetail = (shelterNo) => {
  const [dogData, setDogData] = useState(null);

  useEffect(() => {
    axios
      .get(`${config.baseURL}/api/v1/dog?shelterNo=${shelterNo}`)
      .then((response) => {
        setDogData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [shelterNo]);

  return dogData;
};

export default useDogDetail;
