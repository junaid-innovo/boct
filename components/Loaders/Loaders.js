import React from "react";
import {
  ClipLoader,
  FadeLoader,
  PropagateLoader,
  CircleLoader,
} from "react-spinners";
import { css } from "@emotion/core";
export const LoadFadeLoader = (props) => (
  <FadeLoader
    css={`
      cssdisplay: block;
      margin: 0 auto;
      border-color: red;
    `}
    // css={props.css}
    size={props.size}
    height={props.height ? props.height : 5}
    // width={props.width ? props.width : 10}
    // radius={props.radius}
    // margin={props.margin}
    color={"#123abc"}
    loading={props.sideloading}
  />
);

export const LoadCircleLoader = (props) => (
  <CircleLoader
    // css={`
    //   cssdisplay: block;
    //   margin: 0 auto;
    //   border-color: red;
    // `}
    css={props.css}
    size={props.size}
    height={props.height ? props.height : 5}
    width={props.width ? props.width : 10}
    radius={props.radius}
    margin={props.margin}
    color={"#123abc"}
    loading={props.loading}
  />
);

export const LoadClipLoader = (props) => (
  <ClipLoader
    css={props.css}
    size={props.size}
    loading={props.loading}
  ></ClipLoader>
);
export const LoadPropagateLoader = (props) => (
  <PropagateLoader
    size={props.size}
    // color={'red'}
    css={css`
      display: block;
      margin: 0 auto;
      border-color: red;
    `}
  ></PropagateLoader>
);

// import React from 'react';
// import {ClipLoader, FadeLoader, PropagateLoader} from 'react-spinners';
// import {css} from '@emotion/core';
// export const LoadFadeLoader = props => (
//   <FadeLoader
//     css={`
//       cssdisplay: block;
//       margin: 0 auto;
//       border-color: red;
//     `}
//     size={props.size}
//     height={props.height ? props.height : 5}
//     color={'#123abc'}
//     loading={props.sideloading}
//   />
// );

// export const LoadClipLoader = props => (
//   <ClipLoader size={props.size}></ClipLoader>
// );
// export const LoadPropagateLoader = props => (
//   <PropagateLoader
//     size={props.size}
//     // color={'red'}
//     css={css`
//       display: block;
//       margin: 0 auto;
//       border-color: red;
//     `}
//   ></PropagateLoader>
// );
