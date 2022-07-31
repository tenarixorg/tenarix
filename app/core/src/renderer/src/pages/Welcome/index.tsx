import React, { useEffect, useState } from "react";
import { Container, Div, Progress, Txt } from "components/src/Elements";
import { useTheme, useGeneral } from "context-providers";
import { ProgressCheck } from "components";
import { SpinnerDotted } from "spinners-react";
import { useNavigate } from "react-router-dom";

const { api } = window.bridge;

export const Welcome: React.FC = () => {
  const { canNavigate } = useGeneral();
  const { colors } = useTheme();
  const [chromeProgess, setChromeProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const navigation = useNavigate();

  useEffect(() => {
    api.send("can:navigate");
    api.on("res:chromium:stage", (_, res) => {
      setStage(res);
    });
    api.on("res:chromium:down:progress", (_, res) => {
      setChromeProgress(res);
    });
    return () => {
      api.removeAllListeners("res:chromium:stage");
      api.removeAllListeners("res:chromium:down:progress");
    };
  }, []);

  useEffect(() => {
    if (canNavigate) {
      api.send("restore:size");
      navigation("/ext");
    } else {
      api.send("get:chromium");
    }
  }, [canNavigate, navigation]);

  return (
    <Container
      padding="20px"
      scrollColor={colors.primary}
      bg={colors.background2}
      noScroll
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      dragger
    >
      <Div>
        {stage === 0 && (
          <Txt fs="20px" color={colors.fontPrimary} margin="0px 0px 0% 0px">
            {"Checking Internet Connection"}
          </Txt>
        )}
        {stage === 1 && (
          <Txt fs="20px" color={colors.fontPrimary} margin="0px 0px 20% 0px">
            {"Downloading Tenarix Core"}
          </Txt>
        )}
        {stage === 2 && (
          <Txt fs="20px" color={colors.fontPrimary} margin="0px 0px 20% 0px">
            {"Extracting Tenarix Core"}
          </Txt>
        )}
        {stage === 3 && (
          <Txt fs="20px" color={colors.fontPrimary} margin="0px 0px 20% 0px">
            {"Testing Tenarix Core"}
          </Txt>
        )}
        {stage === 4 && (
          <Txt fs="20px" color={colors.fontPrimary} margin="0px 0px 20% 0px">
            {"Welcome to Tenarix"}
          </Txt>
        )}
      </Div>

      <Div
        width="100%"
        height="100%"
        justify="center"
        align="center"
        zIndex={1}
        style={{
          position: "absolute",
          top: -50,
          left: 0,
        }}
      >
        {stage !== 1 ? (
          <SpinnerDotted
            size={100}
            thickness={100}
            speed={200}
            color={colors.secondary}
          />
        ) : (
          <Progress
            max="100"
            value={chromeProgess.toFixed(2)}
            bg={colors.background1}
            width="400px"
            height="30px"
            borderRadis="20px"
            progressColor={colors.secondary}
            color={colors.fontPrimary}
            fs="10px"
          >
            {chromeProgess.toFixed(2)}
          </Progress>
        )}
      </Div>
      <Div
        width="100%"
        height="100%"
        justify="center"
        align="flex-end"
        zIndex={1}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <ProgressCheck
          stages={4}
          current={stage}
          doneColor={colors.secondary}
          currentColor={colors.primary}
          pendingColor={colors.background1}
        />
      </Div>
    </Container>
  );
};
