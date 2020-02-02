import React from 'react';

class Knob extends React.Component {
    constructor(props) {
      super(props);
      // props.degrees is a hard coded value of knobのdegree range. 
      // start and end angle are read only
      this.fullAngle = props.degrees;
      this.startAngle = (360 - props.degrees) / 2;
      this.endAngle = this.startAngle + props.degrees;

      this.margin = props.size * 0.15;

      // the first two arguments are swapped from the second two arguments when this function is used later in the code... seems like a bug but we'll see
      this.currentDeg = Math.floor(
        this.convertRange(
          // props.min,
          // props.max,
          1,
          10,
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
        console.log("new value", newValue);
        
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
      if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
        deg += 90;
      } else {
        deg += 270;
      }
      let finalDeg = Math.min(Math.max(this.startAngle, deg), this.endAngle);
      return finalDeg;
    };
  
    convertRange = (startAngle50, endAngle310, propsMin1, propsMax10, currentDegrees) => {
      let returnedValue = (currentDegrees - startAngle50) * (propsMax10 - propsMin1) / (endAngle310 - startAngle50) + propsMin1;
      console.log(`(${currentDegrees} - ${startAngle50}) * (${propsMax10} - ${propsMin1}) / (${endAngle310} - ${startAngle50}) + ${propsMin1} === ${returnedValue}`)
      return (currentDegrees - startAngle50) * (propsMax10 - propsMin1) / (endAngle310 - startAngle50) + propsMin1;
    };

    refactoredConvertRange = (startAngle50, endAngle310, propsMin1, propsMax10, currentDegrees) => {
      // (actual value - smallest value / biggest value - smallest value) * valueRangeTenish + smallestRange
      return ((currentDegrees - startAngle50) / (endAngle310 - startAngle50)) * (propsMax10 - propsMin1) + propsMin1;
    }
  
    dcpy = o => {
      return JSON.parse(JSON.stringify(o));
    };
  
    render() {
      let kStyle = {
        width: this.props.size,
        height: this.props.size
      };
      let iStyle = this.dcpy(kStyle);
      let oStyle = this.dcpy(kStyle);
      oStyle.margin = this.margin;
      if (this.props.color) {
        oStyle.backgroundImage =
          "radial-gradient(100% 70%,hsl(210, " +
          this.currentDeg +
          "%, " +
          this.currentDeg / 5 +
          "%),hsl(" +
          Math.random() * 100 +
          ",20%," +
          this.currentDeg / 36 +
          "%))";
      }
      iStyle.transform = "rotate(" + this.state.deg + "deg)";
  
      return (
        <div className="knob" style={kStyle}>
          <div className="knob outer" style={oStyle} onMouseDown={this.startDrag}>
            <div className="knob inner" style={iStyle}>
              <div className="grip" />
            </div>
          </div>
        </div>
      );
    }
  }

export default Knob;