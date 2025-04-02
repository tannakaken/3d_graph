import { Text } from '@react-three/drei';

type Props = {
    fontSize?: number;
    text: string;
};

export const ThreeDNovel = ({ text, fontSize }: Props) => {
    return (
        <Text fontSize={fontSize}>
            {text}
        </Text>
    );
};
