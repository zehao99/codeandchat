import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Dummy = (props) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          color: "#fff",
          width: "80vw",
          textAlign: "center",
        }}
      >
        Please make sure the window is bigger than 600 * 600.
      </p>
      <p
        style={{
          color: "#a18f6f",
          width: "80vw",
          textAlign: "center",
        }}
      >
        This App doesn't support mobile devices.
      </p>
      <a
        href="https://github.com/zehao99/easychat"
        style={{ marginTop: "2rem" }}
      >
        <FontAwesomeIcon icon={faGithub} /> Github
      </a>
    </div>
  );
};

export default Dummy;
