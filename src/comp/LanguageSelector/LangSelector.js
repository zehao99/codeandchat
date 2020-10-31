import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./LangSelector.module.scss";
import { motion } from "framer-motion";

const LangSelector = (props) => {
  const langList = props.values ? props.values : ["java", "c++", "python"];

  const [langIdx, setLangIdx] = useState(0);
  const [showList, setShowList] = useState(false);

  const handleToggleList = () => {
    setShowList((prev) => !prev);
  };

  const handleMouseLeave = () => {
    setShowList(false);
  };

  const handleSelection = (idx) => {
    setLangIdx(idx);
    props.onChange(idx);
    setShowList((prev) => !prev);
  };

  return (
    <div onMouseLeave={handleMouseLeave}>
      <div className={styles.selectContainer}>
        <p>{langList[langIdx]}</p>
        <button onClick={handleToggleList}>
          {showList ? (
            <FontAwesomeIcon icon={faChevronUp} style={{ margin: "auto" }} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} style={{ margin: "auto" }} />
          )}
        </button>
      </div>
      {showList && (
        <motion.div
          initial={{ scale: 0, y: "-50%" }}
          animate={{ scale: 1, y: "0%" }}
          transition={{ duration: 0.1 }}
          className={styles.langListItems}
        >
          {langList.map((e, idx) => (
            <p
              key={idx}
              style={idx % 2 === 1 ? { background: "rgba(0,0,0,0.2)" } : null}
              onClick={handleSelection.bind(this, idx)}
            >
              {e}
            </p>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LangSelector;
