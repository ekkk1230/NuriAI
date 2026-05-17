import { style, globalStyle } from "@vanilla-extract/css";

export const MainContainer = style({
    width: "100%",
});

export const TopSection = style({
    width: "100%",
    background: "url('/top-bg.png') no-repeat center",
    backgroundSize: "cover",
    padding: "12rem 0",
});

globalStyle(`${TopSection} p`, {
    color: "#fff",
    textAlign: "center",
});

export const BigTit = style({
    fontSize: "4.2rem",
    fontWeight: "bold",
    marginBottom: "3rem",
});

export const SmTit = style({
    fontSize: "2.4rem",
    lineHeight: "1.6",
});

export const StartBtn = style({
    display: "block",
    margin: "4rem auto",
    borderRadius: "60rem",
    background: "#fff",
    padding: "2rem 4rem",
    fontSize: "1.6rem",
    fontWeight: "500",
});