import { Row } from "antd";
import React from "react";
import { useSelector } from "react-redux";
function FrameComponent(props) {
  const [imgSrc, setImgSrc] = React.useState("");
  // const [faces, setFaces] = React.useState([])
  const frameState = useSelector((state) => state.frame);
  React.useEffect(() => {
    setImgSrc(frameState[props.raw + props.camera_code]);
    // setFaces(frameState.faces)
  }, [frameState[props.raw + props.camera_code]]);

  return (
    <div className="img-root">
      <img 
        alt='frame streaming camera'
        width='100%' 
        maxheight='500px' 
        src={`${imgSrc}`} 
      />
     
      <Row justify="center">
        <h3>{props.camera_code + ' ' + props.raw}</h3>
      </Row>
    </div>
  );
}

export default FrameComponent;
