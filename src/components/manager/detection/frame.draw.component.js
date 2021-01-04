import React from 'react'
import { Row } from "antd";
import { Stage } from "react-konva";
import RectFace from "./rect.face";
import RectBody from "./rect.body";
import RectObject from './rect.object';
const w = 620;
const h = 440;
function FrameDrawComponent(props) {
  const [FaceData, setFaceData] = React.useState([])
  const [ItemData, setItemData] = React.useState([])
  const [BodyData, setBodyData] = React.useState([])

  const onLoad = (e) => {
    let ww = e.target.width
    let hh = e.target.height
    setFaceData(props.FaceData?props.FaceData.map(e => {
      e.left = e.left / (ww/w)
      e.right = e.right / (ww/w)
      e.top = e.top /(hh/h)
      e.bottom = e.bottom /(hh/h)
      return e
    }): [])
    setBodyData(props.BodyData?props.BodyData.map(e => {
      e.left = e.left / (ww/w)
      e.right = e.right / (ww/w)
      e.top = e.top /(hh/h)
      e.bottom = e.bottom /(hh/h)
      return e
    }): [])
    setItemData(props.ProhibitedItemData?props.ProhibitedItemData.map(e => {
      e.left = e.left / (ww/w)
      e.right = e.right / (ww/w)
      e.top = e.top /(hh/h)
      e.bottom = e.bottom /(hh/h)
      return e
    }): [])
  }

    return (
    <div>
      <img alt='evidence' style={{'display': 'none'}}  onLoad={onLoad} src={`${props.src}`} />
      <img alt='evidence' style={{'position': 'absolute'}}  width={w} height={h}  src={`${props.src}`} />
      <Stage   style={{'position': 'absolute'}} width={w} height={h}>
        {FaceData.map(e => (<RectFace isRelative={e.isRelative} isActive={e.isActive} name={e.code} x1={e.left} y1={e.top} x2={e.right} y2={e.bottom} />))}
      </Stage>
      <Stage style={{'position': 'absolute'}} width={w} height={h}>
        {ItemData.map(e => (<RectObject name={e.code} x1={e.left} y1={e.top} x2={e.right} y2={e.bottom} />))}
      </Stage>
      <Stage width={w} height={h}>
        {BodyData.map(e => (<RectBody name={e.code} x1={e.left} y1={e.top} x2={e.right} y2={e.bottom} />))}
      </Stage>
    </div>
    )
}

export default FrameDrawComponent
