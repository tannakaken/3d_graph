import { button, folder, useControls } from "leva";
import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { Line, Text } from "@react-three/drei";

import type { ButtonInput, FolderInput } from "leva/dist/declarations/src/types";
import { Prompt } from "./Prompt";
import Legend from "./Legend";
import { resolveColor } from "./helpers/color.helper";

const initialData = () => ([
  {name: "data 1", data: [
    { name: "1", value: 1 },
    { name: "2", value: 2 },
    { name: "3", value: 4 },
    { name: "4", value: 3 },
    { name: "5", value: 5 },
  ]},
  {name: "data 2", data: [
    { name: "1", value: 3 },
    { name: "2", value: 4 },
    { name: "3", value: 2 },
    { name: "4", value: 2 },
    { name: "5", value: 3 },
  ]},
]);

const initialScoreTitle = () => ({
  '1': 'score 1',
  '2': 'score 2',
  '3': 'score 3',
  '4': 'score 4',
  '5': 'score 5',
});

const initialDataTitle = () => ({
  'data 1': 'data 1',
  'data 2': 'data 2',
})

const RADIUS = 5;
const RATIO = 0.6;

/**
 * 3D Radar Chart component using React Three Fiber
 */
export const RadarChart = () => {
  const [data, setData] = useState(initialData());
  const [scoreTitles, setScoreTitles] = useState<Record<string, string>>(initialScoreTitle());
  const [dataTitles, setDataTitles] = useState<Record<string, string>>(initialDataTitle());

  const [controls] = useControls(

    () => data.reduce(
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
        "add score": button(() => {
          const newName = `${data[0].data.length + 1}`;
          for (const datum in data) {
            data[datum].data.push({ name: newName, value: data.length + 1 });
          }
          setData([...data]);
          setScoreTitles({
            ...scoreTitles,
            [newName]: `score ${newName}`,
          });
        }),
        "add data": button(() => {
          const newName = `data ${data.length + 1}`;
          setData([...data, { name: newName, data: [...data[0].data] }]);
          setDataTitles({
            ...dataTitles,
            [newName]: newName,
          });
        }),
        "reset data": button(() => {
          setData(initialData());
          setScoreTitles(initialScoreTitle());
          setDataTitles(initialDataTitle());
        }),
      } as Record<string, ButtonInput | FolderInput<Record<string, number>>>,
    ),
    [data, scoreTitles, dataTitles],
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  useEffect(() => {
    document.body.style.cursor = hoveredIndex !== undefined ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredIndex]);

  const calcRadian = useCallback((pointIndex: number) => {
    return -(pointIndex / data[0].data.length) * Math.PI * 2 + Math.PI / 2;
  }, [data]);

  return (
    <group>
        {[...Array(5)].map((_, index) => {
            const points = data[0].data.map((_, pointIndex) => {
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
                color="white"
                lineWidth={0.5}
                dashed={true}
                gapSize={0.1}
                dashSize={0.1}
            />
        )})}
      {data.map((datum, index) => {
        const points = datum.data.map(
            (point, pointIndex) => {
                const value = controls[`${datum.name} ${point.name}`] as number * RATIO;
                const radian = calcRadian(pointIndex);
                return new THREE.Vector3(
                    Math.cos(radian) * value,
                    Math.sin(radian) * value,
                    0);
        });
        points.push(points[0]);
        return (<Line 
            key={`line-${datum.name}`}
            points={points}
            color={resolveColor(index, data.length)}
            lineWidth={2} />);
      })}
      <Legend 
        position={[-3, 3, 0]}
        totalLength={data.length}
        items={data.map((datum, index) => ({ index, label: dataTitles[datum.name] }))}
        onClick={async (index) => {
          const name = data[index].name;
          const newTitle = await Prompt.call({message: "データの名前を入力してください。", defaultValue: dataTitles[name]});
          if (newTitle) {
            dataTitles[name] = newTitle;
            setDataTitles({ ...dataTitles });
          }
        }}   />
      {data[0].data.map((point, pointIndex) => {
        const radian = calcRadian(pointIndex);
        const offset = pointIndex === 0 ? 0.5 : 1.2;
        const radius = (RADIUS + offset) * RATIO
        return (<Text
          key={`label-for-${point.name}`}
          position={[Math.cos(radian) * radius, Math.sin(radian) * radius, 0]}
          fontSize={0.5}
          color={pointIndex === hoveredIndex ? "blue" : "white"}
          anchorX="center"
          anchorY="middle"
          onClick={async () => {
            const newTitle = await Prompt.call({message: "スコアの名前を入力してください。", defaultValue: scoreTitles[point.name]});
            if (newTitle) {
              scoreTitles[point.name] = newTitle;
              setScoreTitles({ ...scoreTitles });
            }
          }}
          onPointerOver={() => setHoveredIndex(pointIndex)}
          onPointerOut={() => setHoveredIndex(undefined)}
        >
          {scoreTitles[point.name]}
        </Text>);
    }
      )}
    </group>
  );
};