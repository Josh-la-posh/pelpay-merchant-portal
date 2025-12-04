// const AnimatedLineChart = ({ className }) => {
//   return (
//     <svg
//       width="240"
//       height="60"
//       viewBox="0 0 340 60"
//       fill="none"
//       className={className}
//     >
//       <path
//         d="M5,24.643C20.714,23.393,36.429,22.143,52.143,22.143C67.857,22.143,83.571,23.571,99.286,23.571C115,23.571,130.714,17.5,146.429,17.5C162.143,17.5,177.857,20,193.571,20C209.286,20,225,13.929,240.714,13.929C256.429,13.929,272.143,16.429,287.857,16.429C303.571,16.429,319.286,13.571,335,10.714"
//         stroke="currentColor"
//         stroke-width="3"
//         fill="none"
//         stroke-linecap="round"
//         stroke-dasharray="400"
//         stroke-dashoffset="400"
//       >
//         <animate
//           attributeName="stroke-dashoffset"
//           from="400"
//           to="0"
//           dur="1s"
//           repeatCount="1"
//           fill="freeze"
//         />
//       </path>
//     </svg>
//   );
// };

// export default AnimatedLineChart;

// const AnimatedChartLine = () =>{
// return(
//     <svg
//   class="recharts-surface"
//   width="258"
//   height="60"
//   viewBox="0 0 258 60"
// >
//     <path
//       stroke="currentColor"
//       stroke-width="2"
//       fill="none"
//       width="248"
//       height="50"
//       stroke-dasharray="400"
//       stroke-dashoffset="400"
//       d="M5,23.333C16.81,22.5,28.619,21.667,40.429,21.667C52.238,21.667,64.048,22.5,75.857,22.5C87.667,22.5,99.476,20,111.286,20C123.095,20,134.905,20.833,146.714,20.833C158.524,20.833,170.333,19.167,182.143,19.167C193.952,19.167,205.762,20,217.571,20C229.381,20,241.19,19.167,253,18.333"
//     >
//         <animate
//           attributeName="stroke-dashoffset"
//           from="400"
//           to="0"
//           dur="1s"
//           repeatCount="1"
//           fill="freeze"
//         />
//     </path>
  
// </svg>
// )

// }
// export default AnimatedChartLine;


import React from "react";

const AnimatedChartLine = ({
  width = 240,
  height = 60,
  color = "currentColor",
  duration = 1, 
  className,
  pathData = "M5,23.333C16.81,22.5,28.619,21.667,40.429,21.667C52.238,21.667,64.048,22.5,75.857,22.5C87.667,22.5,99.476,20,111.286,20C123.095,20,134.905,20.833,146.714,20.833C158.524,20.833,170.333,19.167,182.143,19.167C193.952,19.167,205.762,20,217.571,20C229.381,20,241.19,19.167,253,18.333"
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
    >
      <path
        d={pathData}
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="400"
        strokeDashoffset="400"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="400"
          to="0"
          dur={`${duration}s`}
          repeatCount="1"
          fill="freeze"
        />
      </path>
    </svg>
  );
};

export default AnimatedChartLine;
