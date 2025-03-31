import { button, folder, useControls } from "leva";
import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { Line, Text } from "@react-three/drei";

import type { ButtonInput, FolderInput } from "leva/dist/declarations/src/types";
import { Prompt } from "./Prompt";
import { resolveColor } from "./helpers/color.helper";
import Legend from "./Legend";

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

const initialCategoryTitle = () => ({
  '1': '1月',
  '2': '2月',
  '3': '3月',
});

const initialLineTitle = () => ({
  'line 1': 'line 1',
  'line 2': 'line 2',
});


/**
 * 3D Line Chart component using React Three Fiber
 */
export const LineChart = () => {
  const [lines, setLines] = useState(initialData());
  const [categoryTitles, setCategoryTitles] = useState<Record<string, string>>(initialCategoryTitle());
  const [lineTitles, setLineTitles] = useState<Record<string, string>>(initialLineTitle());

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
        "add category": button(() => {
          const newName = `${lines[0].data.length + 1}`;
          for (const datum in lines) {
            lines[datum].data.push({ name: newName, value: lines.length + 1 });
          }
          setLines([...lines]);
          setCategoryTitles({
            ...categoryTitles,
            [newName]: newName,
          });
        }),
        "add line": button(() => {
          const newName = `line ${lines.length + 1}`;
          setLines([...lines, { name: newName, data: [...lines[0].data] }]);
          setLineTitles({
            ...lineTitles,
            [newName]: newName,
          });
        }),
        "reset lines": button(() => {
          setLines(initialData());
          setCategoryTitles(initialCategoryTitle());
          setLineTitles(initialLineTitle());
        }),
      } as Record<string, ButtonInput | FolderInput<Record<string, number>>>,
    ),
    [lines, categoryTitles],
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  useEffect(() => {
    document.body.style.cursor = hoveredIndex !== undefined ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredIndex]);

  const calcPositionX = useCallback((index: number) => {
    return (index - (lines[0].data.length - 1) / 2) * 2;
  }, [lines]);

  return (
    <group>
       <Legend 
        position={[-4, 3, 0]}
        totalLength={lines.length}
        items={lines.map((line, index) => ({ index, label: lineTitles[line.name] }))}
        onClick={async (index) => {
          const name = lines[index].name;
          const newTitle = await Prompt.call({message: "折れ線の名前を入力してください。", defaultValue: lineTitles[name]});
            if (newTitle) {
              lineTitles[name] = newTitle;
              setLineTitles({ ...lineTitles });
            }
        }} />
      {lines.map((line, index) => {
        const points = line.data.map(
          (point, pointIndex) => new THREE.Vector3(
            calcPositionX(pointIndex),
            controls[`${line.name} ${point.name}`] as number,
            -index/4));
        return (<Line 
          key={`line-${line.name}`}
          points={points}
          color={resolveColor(index, lines.length)}
          lineWidth={2} />);
      })}
      {lines[0].data.map((point, pointIndex) => (
        <Text
          key={`label-for-${point.name}`}
          position={[calcPositionX(pointIndex), 0, 0]}
          fontSize={0.5}
          color={pointIndex === hoveredIndex ? "blue" : "white"}
          anchorX="center"
          anchorY="middle"
          onClick={async () => {
            const newTitle = await Prompt.call({message: "データの名前を入力してください。", defaultValue: categoryTitles[point.name]});
            if (newTitle) {
              categoryTitles[point.name] = newTitle;
              setCategoryTitles({ ...categoryTitles });
            }
          }}
          onPointerOver={() => setHoveredIndex(pointIndex)}
          onPointerOut={() => setHoveredIndex(undefined)}
        >
          {categoryTitles[point.name]}
        </Text>)
      )}
    </group>
  );
};