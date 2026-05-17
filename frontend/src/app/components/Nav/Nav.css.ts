import { style, globalStyle } from "@vanilla-extract/css";

export const navContainer = style({
  width: "26rem",
  height: "100vh",
  background: "#fff",
  borderRight: "1px solid #eee",
  padding: "0 2rem",
});

export const logoContainer = style({
  width: "100%",
  padding: "2rem 0",
});

globalStyle(`${logoContainer} img`, {
  width: "160px",
  height: "auto",
  marginBottom: "8px",
  objectFit: "contain",
});

export const logoTxt = style({
  fontSize: "1.6rem",
});

export const navList = style({
  marginTop: "2rem",
});

export const navItem = style({
  selectors: {
    "& + &": {
      marginTop: "1rem",
    },
  },
});

export const navLink = style({
  fontSize: "1.6rem",
  display: "flex",
  alignItems: "center",

  selectors: {
    "& + &": {
      marginTop: "1rem",
    },
    "&:hover": {
      color: "#191f28",
    }
  },
});

export const Icon = style({
  display: "block",
  fontSize: "2rem",
  marginRight: ".8rem",
});

