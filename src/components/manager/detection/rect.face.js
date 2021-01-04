import React from 'react'
import {
    Layer,
    Rect,
    Text,
  } from "react-konva";
const colors = {
    green: '#53A548',
    red: '#CE4027',
    yellow: '#BB9457',
    purple: '#8A2BE2'
  }
function RectFace(props) {
    var color = colors.green;
    if(props.name.toLocaleLowerCase() === 'UNKNOWN'.toLocaleLowerCase()) {
         color = colors.red;
    } else {
        if(props.isActive === false) {
            color = colors.purple;
        }
    }
    if(props.isRelative) {
        color=  colors.yellow
    }
    return (
        <Layer>
            <Rect x={props.x1-5} y={props.y1-5} stroke={color} strokeWidth={2} width={props.x2 - props.x1+15} height={props.y2 - props.y1+10}/>
            <Rect x={props.x1-5} y={props.y2+5} stroke={color} strokeWidth={2} fill={color} width={props.x2 - props.x1+15} height={20}/>
            <Text x={props.x1-2} y={props.y2+10} text={props.name} fontFamily={'Calibri'} fill={'white'} />
        </Layer>
    )
}

export default RectFace
