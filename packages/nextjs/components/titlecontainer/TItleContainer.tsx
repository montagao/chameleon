import React, { FC } from "react";

const TitleComponent: FC = ({}) => {
  return (
    <>
      <div className="flex">
        <img src="/assets/nounsmeleon.svg" />
        <img src="/assets/nounsmeleon_wordmark.svg" alt="Nounsmeleon" />
      </div>
      <div style={{ marginTop: "-4rem", marginLeft: "13rem" }}>
        <img src="/assets/motto.svg" alt="Generative NFTs made easy" />
      </div>
    </>
  );
};

export default TitleComponent;
