import React, { useState, useEffect, useRef } from 'react';
import { useAppData } from '../../hooks';
import { excludeKeys, parseFlexStyles, rgbColor } from '../../utils';
import SelectComponent from '../SelectComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-ribbon/dist/react-bootstrap-ribbon.css';

const CustomRibbonGroup = ({ data }) => {
  const { findCurrentData, fontScale, handleData } = useAppData();
  const updatedData = excludeKeys(data);
  const { Size, Title, BorderCol, CSS } = data?.Properties;
  const customStyle = parseFlexStyles(CSS);
  const font = findCurrentData(data.FontObj && data.FontObj);
  const appDataMaxHeight = findCurrentData("app-data")?.Properties?.maxHeight || 50;
  const fontProperties = font && font?.Properties;

  const [tempDivWidth, setTempDivWidth] = useState("auto");
  const [divHeight, setDivHeight] = useState("auto");
  // const [maxHeight, setMaxHeight] = useState(100)
  const maxHeight = useRef(appDataMaxHeight)
  const heightPadding =35

  useEffect(() => {
    const updateDimensions = () => {
      setTimeout(() => {
        const titleElement = document.getElementById(data.ID + "-title");
        const ribbonElement = document.getElementById(`ribbon-item-height-${data.id}`);
        const ribbonElements = document.querySelectorAll(`[id^="ribbon-item-height-${data.id}"]`);
        const ribbonElementsWithoutId = document.querySelectorAll(`[id^="ribbon-height"]`);
        let maxRibbonHeight = 0;
        let sumRibbonDivWidth = 0;
        let sumRibbonDivHeight = 0;
        // let allTimeMaxHeight =0
// console.log({maxRibbonHeight})
        ribbonElements.forEach((element) => {
          const elementHeight =((element.getBoundingClientRect().height) || 0 );
          maxHeight.current = Math.max(maxHeight.current, elementHeight);
          // console.log("elementHeight",{elementHeight, maxHeight:maxHeight.current})
        });
        // console.log("Before Update - maxHeight:", maxHeight.current);
        // if (maxRibbonHeight > 0) {
        //   maxHeight.current = Math.max(maxRibbonHeight, maxHeight.current);
        // }

        if(localStorage.getItem("maxHeight") && localStorage.getItem("maxHeight") < maxHeight.current){
        localStorage.setItem("maxHeight", maxHeight.current+heightPadding);
        // maxHeight.current =  maxHeight.current;
        }
        if(!localStorage.getItem("maxHeight")){
          localStorage.setItem("maxHeight", maxHeight.current + heightPadding);
        }
        // console.log("After Update - maxHeight:", maxHeight.current, "appDataMaxHeight", appDataMaxHeight, "local",localStorage.getItem("maxHeight"));
        
        // console.log("ribbon elements",{ribbonElements,ribbonElementsWithoutId, maxRibbonHeight, maxHeight:localStorage.getItem("maxHeight") })

        ribbonElements.forEach((element) => {
          const elementWidth = element.getBoundingClientRect().width || 0;
          sumRibbonDivWidth += elementWidth
        });
        ribbonElements.forEach((element) => {
          const elementHeight = element.getBoundingClientRect().height || 0;
          sumRibbonDivHeight += elementHeight
        });

        const tempWidth = Math.max(sumRibbonDivWidth, sumRibbonDivHeight)
        const titleDivWidth = titleElement?.getBoundingClientRect().width || 0;
        const titleDivHeight = titleElement?.getBoundingClientRect().height || 0;
        const ribbonDivWidth = ribbonElement?.getBoundingClientRect().width || 0;
        // const ribbonDivHeight = ribbonElement?.getBoundingClientRect().height || 0;

        console.log("314",{maxRibbonHeight, titleDivHeight, })

        if (ribbonElements.length > 1) {
          setTempDivWidth(`${Math.max(tempWidth + ribbonDivWidth, titleDivWidth)}px`);
        } else {
          setTempDivWidth(`${Math.max(tempWidth, titleDivWidth)}px`);

        }
        ribbonElementsWithoutId.forEach((element) => {
          element.style.height = `${localStorage.getItem("maxHeight")}px`;
        });

        
        // setDivHeight(`${maxRibbonHeight}px`);
      }, 500);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [data.id]);
  const size = Size || 2;

  // useEffect(() => {
  //   const updateDimensions = () => {
  //     setTimeout(() => {
  //       const ribbonElements = document.querySelectorAll('[id^="ribbon-height"]');
  //       let maxRibbonHeight = 0;

  //       ribbonElements.forEach((element) => {
  //         const elementHeight = element.getBoundingClientRect().height || 0;
  //         maxRibbonHeight = Math.max(maxRibbonHeight, elementHeight);
  //       });

  //       ribbonElements.forEach((element) => {
  //         element.style.height = `${maxRibbonHeight+5}px`;
  //       });
  //     }, 600);
  //   };

  //   updateDimensions();
  //   window.addEventListener("resize", updateDimensions);

  //   return () => window.removeEventListener("resize", updateDimensions);
  // }, []);


  return (
    <div id={data?.ID} style={{ width: tempDivWidth }}>
      <div
        style={{
          border: `1px solid ${rgbColor(BorderCol)}`,
          borderTop: 0,
          position: 'relative',
          height: divHeight,
          justifyContent: "space-around",
          paddingTop: "3px",
          ...customStyle,
        }}
        id={`ribbon-height`}
        className="row"
      >
        {Object.keys(updatedData).map((key, index) => {
          return <SelectComponent key={index} data={{ ...updatedData[key], FontObj: data.FontObj, id: data.id, ImageList: data.ImageList }} />;
        })}

        <div>
          <p
            id={data.ID + "-title"}
            style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: 'rgb(204, 204, 204)',
              margin: 0,
              fontWeight: 'bolder',
              fontFamily: fontProperties?.PName,
              fontSize: fontProperties?.Size
                ? `${fontProperties.Size * fontScale}px`
                : `${12 * fontScale}px`,
              minWidth: "max-content",
              width: "100%",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
            className="text-center"
          >
            {Title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomRibbonGroup;
