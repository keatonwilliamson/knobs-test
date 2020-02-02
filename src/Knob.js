import React from 'react';

class Knob extends React.Component {
  constructor(props) {
    super(props);
    // props.degrees is a hard coded value of knobのdegree range. 
    // start and end angle are read only
    this.fullAngle = props.degrees;
    // finds half the leftovers of the pie
    this.startAngle = (360 - props.degrees) / 2;
    // opens up from start anlge like a japanese fan 
    this.endAngle = this.startAngle + props.degrees;


    // the min/max arguments are swapped with the angle arguments.
    // this swaps the function to output a degrees from value, rather than value from degrees
    this.currentDeg = Math.floor(
      this.convertRange(
        props.min,
        props.max,
        this.startAngle,
        this.endAngle,
        props.value
      )
    );

    this.state = { deg: this.currentDeg };
  }

  startDrag = e => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
    // points (pts) finds the exact center xy coordinates of your knob 
    // getBoundingClientRect() left and top finds the distance from the knobのboundaries to the viewportのedges
    // width/2 and height/2 adds half of the knobs size to that to get to the center
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2
    };

    // moveHandler runs continuously on mouse movement
    const moveHandler = e => {

      // console.log("start angle", this.startAngle)
      // console.log("end angle", this.endAngle)

      this.currentDeg = this.getDeg(e.clientX, e.clientY, pts);
      if (this.currentDeg === this.startAngle) this.currentDeg--;

      // new value is a 1-10 converted from the current degrees
      let newValue = Math.floor(
        this.convertRange(
          this.startAngle,
          this.endAngle,
          this.props.min,
          this.props.max,
          this.currentDeg
        )
      );
      // console.log("new value", newValue);

      // state on knob is degrees -- state on app.js is 1-10 value
      this.setState({ deg: this.currentDeg });
      this.props.onChange(newValue);
    };

    // onMouseDown from react add listener for movement
    // clean up on mouseup
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", e => {
      document.removeEventListener("mousemove", moveHandler);
    });
  };


  getDeg = (cX, cY, pts) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = Math.atan(y / x) * 180 / Math.PI;
    console.log("degreees", deg)
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg += 270;
    }
    let finalDeg = Math.min(Math.max(this.startAngle, deg), this.endAngle);
    return finalDeg;
  };

  // ((current degrees - smallest angle) / (biggest angle - smallest angle)) * (biggest range - smallest range) + smallestRange
  convertRange = (sA, bA, sR, bR, cD) => {
    return ((cD - sA) / (bA - sA)) * (bR - sR) + sR;
  }

  dcpy = o => {
    return JSON.parse(JSON.stringify(o));
  };

  render() {

    let iStyle = this.dcpy({ transform: "rotate(" + this.state.deg + "deg)"});

    return (
        <div className="knob outer" onMouseDown={this.startDrag}>
          <div className="knob inner" style={iStyle}>
            <div className="grip" />
          </div>
        </div>
    );
  }
}

export default Knob;