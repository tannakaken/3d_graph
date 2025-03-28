import { button, folder, useControls } from "leva";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { Line, Text } from "@react-three/drei";

import type { ButtonInput, FolderInput } from "leva/dist/declarations/src/types";
import { Prompt } from "./Prompt";

const initialData = () => ([
  {name: "line 1", data: [
    { name: "1", value: 1 },
    { name: "2", value: 2 },
    { name: "3", value: 4 },
  ]},
  {name: "line 2", data: [
    { name: "1", value: 3 },
    { name: "2", value: 4 },
    { name: "3", value: 2 },
  ]},
]);

const initialTitle = () => ({
  '1': '1月',
  '2': '2月',
  '3': '3月',
});


/**
 * 3D Line Chart component using React Three Fiber
 */
export const LineChart = () => {
  const [lines, setLines] = useState(initialData());
  const [titles, setTitles] = useState<Record<string, string>>(initialTitle());

  const [controls] = useControls(

    () => lines.reduce(
      (acc, datum) => {
        const folderData = datum.data.reduce(
          (acc, point) => {
            acc[`${datum.name} ${point.name}`] = point.value;
            return acc;
          }
          , {} as Record<string, number>
        );
        acc[datum.name] = folder(folderData, { collapsed: false });
        return acc;
      },
      {
        "add value": button(() => {
          const newName = `${lines[0].data.length + 1}`;
          for (const datum in lines) {
            lines[datum].data.push({ name: newName, value: lines.length + 1 });
          }
          setLines([...lines]);
          setTitles({
            ...titles,
            [newName]: newName,
          });
        }),
        "add line": button(() => {
          const newName = `line ${lines.length + 1}`;
          setLines([...lines, { name: newName, data: [...lines[0].data] }]);
          setTitles({
            ...titles,
            [newName]: newName,
          });
        }),
        "reset value": button(() => {
          setLines(initialData());
          setTitles(initialTitle());
        }),
      } as Record<string, ButtonInput | FolderInput<Record<string, number>>>,
    ),
    [lines, titles],
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  useEffect(() => {
    document.body.style.cursor = hoveredIndex !== undefined ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredIndex]);

  return (
    <group>
      {lines.map((line, index) => {
        const color = new THREE.Color(
          `hsl(${(index / lines.length) * 360}, 100%, 50%)`
        )
        return (<Line 
          key={`line-${line.name}`}
          points={line.data.map((point, pointIndex) => new THREE.Vector3((pointIndex - (line.data.length - 1) / 2) * 2, controls[`${line.name} ${point.name}`] as number, -index/2))}
          color={color}
          lineWidth={2} />);
      })}
      {lines[0].data.map((point, pointIndex) => (
        <Text
          key={`label-for-${point.name}`}
          position={[(pointIndex - (lines[0].data.length - 1) / 2) * 2, 0, 0]}
          fontSize={0.5}
          color={pointIndex === hoveredIndex ? "blue" : "white"}
          anchorX="center"
          anchorY="middle"
          onClick={async () => {
            const newTitle = await Prompt.call({message: "データの名前を入力してください。", defaultValue: titles[point.name]});
            if (newTitle) {
              titles[point.name] = newTitle;
              setTitles({ ...titles });
            }
          }}
          onPointerOver={() => setHoveredIndex(pointIndex)}
          onPointerOut={() => setHoveredIndex(undefined)}
        >
          {titles[point.name]}
        </Text>)
      )}
    </group>
  );
};