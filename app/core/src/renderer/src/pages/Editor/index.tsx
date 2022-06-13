import React, { useCallback, useEffect, useRef, useState } from "react";
import MEditor, { OnMount } from "@monaco-editor/react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Btn, Container, Loading, Txt } from "components/src/Elements";
import { themeSchema, settingsSchema } from "schemas";
import { BsFileEarmarkX } from "react-icons/bs";
import { SpinnerDotted } from "spinners-react";
import { FaRegSave } from "react-icons/fa";
import { useTheme } from "context-providers";
import styled from "styled-components";

const { api } = window.bridge;

type Edit = Parameters<OnMount>[0];

export const Editor: React.FC = () => {
  const editorRef = useRef<Edit | null>(null);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [lastValue, setLastValue] = useState("");
  const [value, setValue] = useState("");
  const [schema, setSchema] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const params = useParams();
  const navigation = useNavigate();
  const URLstate = useLocation().state;

  useEffect(() => {
    api.on("res:load:editor", (_e, res) => {
      setValue(res);
      setLastValue(res);
      setLoading(false);
    });

    api.on("res:theme:schema", (_e, res) => {
      setSchema(res.schema);
    });

    api.on("res:external:themes:files", (_e, res) => {
      setFiles(res);
    });

    api.send("load:editor", {
      src: params.src,
      data: {
        filename: (URLstate as any)?.filename,
      },
    });

    api.send("get:theme:schema");
    api.send("get:external:themes:files");

    return () => {
      api.removeAllListeners("res:load:editor");
      api.removeAllListeners("res:theme:schema");
      api.removeAllListeners("res:external:themes:files");
    };
  }, [params.src, URLstate]);

  const handleSave = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "s" && e.ctrlKey) {
        e.preventDefault();
        if (value !== lastValue) {
          editorRef.current.getAction("editor.action.formatDocument").run();
          if (params.src === "theme") {
            api.send("save:full:external:theme", {
              filename: (URLstate as any)?.filename,
              data: value,
            });
          } else {
            api.send("save:full:settings", {
              data: value,
            });
          }
          setLastValue(value);
        }
      }
    },
    [value, lastValue, URLstate, params.src]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleSave);
    return () => {
      document.removeEventListener("keydown", handleSave);
    };
  }, [handleSave]);

  return (
    <Container bg={colors.background1} scrollColor={colors.primary} noScroll>
      {loading ? (
        <Loading>
          <SpinnerDotted
            size={100}
            thickness={180}
            speed={100}
            color={colors.secondary}
          />
        </Loading>
      ) : (
        <>
          <MEditor
            options={{
              fontSize: 16,
              lineHeight: 1.5,
              letterSpacing: 1.2,
              scrollbar: {
                verticalScrollbarSize: 10,
              },
            }}
            height="calc(100% - 46px)"
            onChange={(v) => {
              setValue(v || "");
            }}
            width="100vw"
            theme={schema === "dark" ? "vs-dark" : "light"}
            defaultLanguage="json"
            value={value}
            language="json"
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            beforeMount={(monaco) => {
              monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: true,
                schemas: [
                  {
                    uri: "http://schemas/akuqt.json",
                    fileMatch: ["*"],
                    schema:
                      params.src === "setup"
                        ? settingsSchema(files)
                        : themeSchema,
                  },
                ],
              });
            }}
          />
          <TabBar borderColor={colors.navbar.background}>
            <Txt fs="14px" color={colors.fontPrimary}>
              {params.src === "setup"
                ? "settings.json"
                : (URLstate as any)?.filename}
            </Txt>
            <BtnContainer>
              <Btn
                style={{ marginRight: 5 }}
                disabled={lastValue === value}
                onClick={() => {
                  editorRef.current
                    .getAction("editor.action.formatDocument")
                    .run();

                  if (params.src === "theme") {
                    api.send("save:full:external:theme", {
                      filename: (URLstate as any)?.filename,
                      data: value,
                    });
                  } else {
                    api.send("save:full:settings", {
                      data: value,
                    });
                  }
                  setLastValue(value);
                }}
              >
                <FaRegSave
                  color={lastValue === value ? "#8f8f8f" : colors.primary}
                  size={18}
                />
              </Btn>
              <Btn
                onClick={() => {
                  navigation(-1);
                }}
              >
                <BsFileEarmarkX color={colors.primary} size={17} />
              </Btn>
            </BtnContainer>
          </TabBar>
        </>
      )}
    </Container>
  );
};

const TabBar = styled.div<{ borderColor: string }>`
  position: absolute;
  width: 100%;
  height: 22px;
  border-top: 1px solid ${(p) => p.borderColor};
  left: 0;
  top: calc(100% - 46px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
`;

const BtnContainer = styled.div`
  width: fit-content;
  padding: 0px 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
