import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { SpinnerDotted, SpinnerInfinity } from "spinners-react";
import { Read as ReadT } from "types";
import { useParams } from "react-router-dom";
import { Get } from "services";

const { api } = window.bridge;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  padding: 10px 0px 40px 0px;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 8px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #4f9ce8;
    border-radius: 30px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #2076ee;
  }
  img {
    width: 80%;
    margin-top: 10px;
  }
`;

const Txt = styled.p<{
  fs: string;
  bold?: boolean;
  color: string;
}>`
  margin-bottom: 4px;
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "600" : "normal")};
  color: ${(p) => p.color};
`;

const Btn = styled.button<{ right?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  transition: transform 400ms ease-in-out;
  &:hover {
    transform: translateX(${(p) => (p.right ? "5px" : "-5px")});
  }
`;

const Nav = styled.div`
  position: sticky;
  top: calc(50% - 30px);
  left: 0;
  width: 90%;
  height: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Loading = styled.div`
  position: absolute;
  top: calc(50% - 90px);
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Read: React.FC = () => {
  const params = useParams();
  const [data, setData] = useState<ReadT>();
  const [img, setImg] = useState<any>();
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [remote, setRemote] = useState(false);

  const mounted = useRef(false);

  useEffect(() => {
    api.on("read:done", (_e, buff) => {
      if (typeof buff === "boolean" && !buff) {
        setRemote(true);
      } else {
        const blob = new Blob([buff as Buffer]);
        const im = URL.createObjectURL(blob);
        if (mounted.current) {
          setImg(im);
          setLoading(false);
        }
      }
    });
    (async () => {
      mounted.current && setLoading2(true);
      const res = await Get<{ result: ReadT }>(`/read/${params.id}`);
      if (mounted.current) {
        setData(res.data.result);
        setLoading2(false);
      }
    })();
    mounted.current = true;
    return () => {
      mounted.current = false;
      api.removeAllListeners("read_done");
    };
  }, []);
  useEffect(() => {
    if (current <= 1) setCurrent(1);
    if (current >= (data?.pages || 1)) setCurrent(data?.pages || 1);
    (async () => {
      if (remote && data?.id) {
        mounted.current && setLoading(true);
        const res_ = await fetch(
          `http://localhost:4000/api/v1/page/${data.id}/${current}`
        );
        const blob = await res_.blob();
        if (mounted.current) {
          setImg(URL.createObjectURL(blob));
          setLoading(false);
        }
      } else {
        if (data?.id) {
          setLoading(true);
          api.send("read:page", {
            rid: params.id,
            root: data.title,
            id: data.id,
            page: current,
            total: data.pages,
          });
        }
      }
    })();
  }, [current, data?.id, remote]);

  return (
    <Container>
      <Nav>
        <Btn
          onClick={() => {
            setCurrent((c) => c - 1);
          }}
          disabled={loading || current <= 1}
        >
          <RiArrowLeftSLine size={60} color="#2076ee" />
        </Btn>
        <Btn
          right
          onClick={() => {
            setCurrent((c) => c + 1);
          }}
          disabled={loading || current >= (data?.pages || 1)}
        >
          <RiArrowRightSLine size={60} color="#2076ee" />
        </Btn>
      </Nav>
      {loading2 ? (
        <SpinnerInfinity
          size={80}
          thickness={100}
          speed={100}
          style={{
            marginTop: 20,
          }}
          color="#e81c6f"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
      ) : (
        <>
          <Txt fs="30px" color="#fff" style={{}}>
            {data?.title.substring(0, 50) +
              `${
                (data?.title || "").length >
                (data?.title || "").substring(0, 50).length
                  ? "..."
                  : ""
              }` || "Title"}
          </Txt>
          <Txt fs="20px" color="#fff">
            {data?.info.substring(0, data?.info.indexOf("S"))}
            {" - " + current + "/" + data?.pages}
          </Txt>
        </>
      )}
      {loading ? (
        <Loading>
          <SpinnerDotted
            size={100}
            thickness={180}
            speed={100}
            color="#e81c6f"
          />
        </Loading>
      ) : (
        <img src={img} alt="img" draggable={false} />
      )}
    </Container>
  );
};
