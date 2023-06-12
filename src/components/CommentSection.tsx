import { Container, Grid } from '@mui/material';
import { createContext, useState } from 'react';
import defaultData from '../../data.json';
import Comment from './Comment';
import { useTransition, animated } from '@react-spring/web';
import Editor from './Editor';

export interface User {
    username: string;
    image: {
        webp: string;
    };
}

export interface CommentType {
    id: number;
    content: string;
    createdAt: string;
    score: number;
    user: User;
    replies?: CommentType[];
    replyingTo?: string;
    parentId?: number;
}
export type DataState = [
    CommentType[],
    React.Dispatch<React.SetStateAction<CommentType[]>>
];
export const DataContext = createContext<DataState>([
    defaultData.comments,
    console.error,
]);

export const UserContext = createContext<User>(defaultData.currentUser);

const sortByScore = (a: CommentType, b: CommentType) => b.score - a.score;

export default function CommentSection() {
    const [data, setData] = useState<CommentType[]>(defaultData.comments);

    const comments = [...data].sort(sortByScore);

    const transitions = useTransition(comments, {
        key: (item: CommentType) => item.id,
        from: { opacity: 0 },
        leave: { opacity: 0 },
        enter: () => ({ opacity: 1 }),
        // animation, when order changes
        update: { opacity: 1 },
    });

    return (
        <Container maxWidth='sm'>
            <UserContext.Provider value={defaultData.currentUser}>
                <DataContext.Provider value={[data, setData]}>
                    <Grid container spacing={2}>
                        {transitions((style, comment, _, index) => (
                            <Grid item xs={12} key={comment.id}>
                                <animated.div
                                    style={{
                                        zIndex: comments.length - index,
                                        ...style,
                                    }}
                                >
                                    <Comment {...comment} />
                                </animated.div>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Editor />
                        </Grid>
                    </Grid>
                </DataContext.Provider>
            </UserContext.Provider>
        </Container>
    );
}
