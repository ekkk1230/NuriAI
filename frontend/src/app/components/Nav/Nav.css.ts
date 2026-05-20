import { style, globalStyle } from "@vanilla-extract/css";

export const navContainer = style({
  width: "26rem",
  height: "100vh",
  background: "#fff",
  borderRight: "1px solid #eee",
  padding: "0 2rem",
  position: "sticky",
  top: "0",
  left: "0",
});

export const logoContainer = style({
  width: "calc(100% + 4rem)",
  position: "relative",
  left: "-2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem 0",
  borderBottom: "1px solid #eee",
});

globalStyle(`${logoContainer} img`, {
  width: "160px",
  height: "auto",
  marginBottom: "1.6rem",
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
  padding: "1rem 2rem",
  borderRadius: ".8rem",

  selectors: {
    "& + &": {
      marginTop: "1rem",
    },
    "&:hover": {
      background: "rgba(114, 118, 124, 0.1)",
    }
  },
});

export const active = style({
  color: "#154ea3",
  fontWeight: "bold",
  background: "rgba(21, 78, 163, 0.1)",
  selectors: {
    "&:hover": {
      background: "rgba(21, 78, 163, 0.1)",
    }
  },
})

export const Icon = style({
  display: "block",
  fontSize: "2rem",
  marginRight: ".8rem",
});

export const logoBottom = style({
  width: "calc(100% + 4rem)",
  position: "absolute",
  left: "-2rem",
  borderTop: "1px solid #eee",
  padding: "2rem",
  bottom: "0",
});

export const bottomBox = style({
  width: "100%",
});

globalStyle(`${bottomBox} img`, {
  display: "block",
  margin: "0 auto",
  width: "80%",
  height: "auto",
  objectFit: "contain",
});

