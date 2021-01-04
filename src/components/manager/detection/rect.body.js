import React from 'react'
import {
    Layer,
    Rect,
    Text,
  } from "react-konva";
const colors = {
    yellow: '#BB9457'
  }
function RectBody(props) {
    var color = colors.yellow;
    return (
        <Layer>
            <Rect x={props.x1-5} y={props.y1-10} stroke={color} strokeWidth={2} width={props.x2 - props.x1+15} height={props.y2 - props.y1+10}/>
            <Rect x={props.x1-5} y={props.y1-25} stroke={color} strokeWidth={2} fill={color} width={props.x2 - props.x1+15} height={20}/>
            <Text x={props.x1-2} y={props.y1-20} text={props.name} fontFamily={'Calibri'} fill={'white'} />
        </Layer>
    )
}

export default RectBody
