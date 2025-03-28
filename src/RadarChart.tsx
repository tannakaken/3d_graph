import { button, folder, useControls } from "leva";
import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { Line, Text } from "@react-three/drei";

import type { ButtonInput, FolderInput } from "leva/dist/declarations/src/types";
import { Prompt } from "./Prompt";

const initialData = () => ([
  {name: "line 1", data: [
    { name: "1", value: 1 },
    { name: "2", value: 2 },
    { name: "3", value: 4 },
    { name: "4", value: 3 },
    { name: "5", value: 5 },
  ]},
  {name: "line 2", data: [
    { name: "1", value: 3 },
    { name: "2", value: 4 },
    { name: "3", value: 2 },
    { name: "4", value: 2 },
    { name: "5", value: 3 },
  ]},
]);

const initialTitle = () => ({
  '1': 'item 1',
  '2': 'item 2',
  '3': 'item 3',
  '4': 'item 4',
  '5': 'item 5',
});

const RADIUS = 5;
const RATIO = 0.6;

/**
 * 3D Radar Chart component using React Three Fiber
 */
export const RadarChart = () => {
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
            [newName]: `item ${newName}`,
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

  const calcRadian = useCallback((pointIndex: number) => {
    return -(pointIndex / lines[0].data.length) * Math.PI * 2 + Math.PI / 2;
  }, [lines]);

  return (
    <group>
        {[...Array(5)].map((_, index) => {
            const points = lines[0].data.map((_, pointIndex) => {
                const radian = calcRadian(pointIndex);
                return new THREE.Vector3(
                    Math.cos(radian) * (index + 1) * RATIO,
                    Math.sin(radian) * (index + 1) * RATIO,
                    0);
            });
            points.push(points[0]);
            return (<Line 
                // biome-ignore lint/suspicious/noArrayIndexKey: index以外に情報がない。
                key={`radar-${index}`}
                points={points}
                color="rgba(255, 255, 255, 0.3)"
                lineWidth={0.5}
                dashed={true}
            />
        )})}
      {lines.map((line, index) => {
        const color = new THREE.Color(
          `hsl(${(index / lines.length) * 360}, 100%, 50%)`
        )
        const points = line.data.map(
            (point, pointIndex) => {
                const value = controls[`${line.name} ${point.name}`] as number * RATIO;
                const radian = calcRadian(pointIndex);
                return new THREE.Vector3(
                    Math.cos(radian) * value,
                    Math.sin(radian) * value,
                    0);
        });
        points.push(points[0]);
        return (<Line 
            key={`line-${line.name}`}
            points={points}
            color={color}
            lineWidth={2} />);
      })}
      {lines[0].data.map((point, pointIndex) => {
        const radian = calcRadian(pointIndex);
        const radius = (RADIUS + 1) * RATIO
        return (<Text
          key={`label-for-${point.name}`}
          position={[Math.cos(radian) * radius, Math.sin(radian) * radius, 0]}
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
        </Text>);
    }
      )}
    </group>
  );
};