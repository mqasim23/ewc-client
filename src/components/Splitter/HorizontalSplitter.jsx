import { useState, useEffect } from 'react';
import { useAppData } from '../../hooks';
import { extractStringUntilSecondPeriod } from '../../utils';

const HorizontalSplitter = ({ data }) => {
  const { Posn, SplitObj1, SplitObj2, Event } = data?.Properties;
  const [position, setPosition] = useState({ top: Posn && Posn[0] });
  const [isResizing, setResizing] = useState(false);
  const { handleData, reRender } = useAppData();
  let formHeight = 800;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        let newTop = e.clientY;

        const parentSize = JSON.parse(
          localStorage.getItem(extractStringUntilSecondPeriod(data?.ID))
        );
        const { Size } = parentSize;

        newTop = Math.max(0, Math.min(newTop, formHeight));

        handleData(
          {
            ID: SplitObj1,
            Properties: {
              Posn: [0, 0],
              Size: [newTop - 3, Size[1]],
            },
          },
          'WS'
        );

        handleData(
          {
            ID: SplitObj2,
            Properties: {
              Posn: [newTop + 3, 0],
              Size: [formHeight - (newTop + 3), Size[1]],
            },
          },
          'WS'
        );

        reRender();
        setPosition({ top: newTop });
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setResizing(false);
        console.log('Dragging ended. New top position:', position.top);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, position.top]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  let horizontalStyles = {
    width: '100%',
    height: '3px',
    backgroundColor: '#CCCCCC',
    cursor: 'row-resize',
    position: 'absolute',
    top: position?.top,
    left: 0,
  };

  return <div style={horizontalStyles} onMouseDown={(e) => handleMouseDown(e)}></div>;
};

export default HorizontalSplitter;
