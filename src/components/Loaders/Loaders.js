import React from "react"
import {ClipLoader,FadeLoader} from 'react-spinners';
export const LoadFadeLoader = props => (
  <FadeLoader
    css={`
      cssdisplay: block;
      margin: 0 auto;
      border-color: red;
    `}
    height={5}
    color={'#123abc'}
    loading={props.sideloading}
  />
);

export  const LoadClipLoader =props=>(
  <ClipLoader
  size={props.size}
  ></ClipLoader>
)
