import {
    Avatar,
    Button,
    Grid,
    Paper,
    TextField,
    useMediaQuery,
} from '@mui/material';
import { useContext, useState } from 'react';
import { DataContext, UserContext } from './CommentSection';
import theme from '../styles/theme';

export interface EditorProps {
    handleReply?: (reply: string) => void;
    replyingTo?: string;
}

export default function Editor({ handleReply, replyingTo }: EditorProps) {
    const [_, setData] = useContext(DataContext);
    const [comment, setComment] = useState('');
    const user = useContext(UserContext);
    const { image } = user;
    const matches = useMediaQuery('(min-width:600px)');

    const handleAdd = () => {
        if (handleReply) {
            handleReply(comment);
        } else {
            setData((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    content: comment,
                    createdAt: 'right now',
                    score: 0,
                    user,
                },
            ]);
        }
        setComment('');
    };

    const Picture = <Avatar sx={{ width: 30, height: 30 }} src={image.webp} />;
    const Field = (
        <TextField
            fullWidth
            variant='outlined'
            placeholder='Add a comment...'
            size='small'
            multiline
            rows={3}
            value={replyingTo ? '@' + replyingTo + ' ' + comment : comment}
            onChange={(e) => {
                if (
                    replyingTo &&
                    e.target.value.length < replyingTo.length + 2
                ) {
                    setComment('');
                    return;
                }
                setComment(e.target.value.replace('@' + replyingTo + ' ', ''));
            }}
        />
    );
    const ActionButton = (
        <Button
            variant='contained'
            onClick={handleAdd}
            sx={{
                '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    boxShadow: 'none',
                },
                boxShadow: 'none',
            }}
        >
            send
        </Button>
    );

    const DesktopView = (
        <>
            <Grid item xs={6} md={1}>
                {Picture}
            </Grid>
            <Grid item xs={12} md={9}>
                {Field}
            </Grid>
            <Grid item xs={6} md={2}>
                {ActionButton}
            </Grid>
        </>
    );

    const MobileView = (
        <>
            <Grid item xs={12}>
                {Field}
            </Grid>
            <Grid item>{Picture}</Grid>
            <Grid item>{ActionButton}</Grid>
        </>
    );

    return (
        <Grid item xs={12}>
            <Paper
                sx={{
                    padding: '1rem',
                    width: '100%',
                }}
            >
                <Grid container spacing={2} justifyContent='space-between'>
                    {matches ? DesktopView : MobileView}
                </Grid>
            </Paper>
        </Grid>
    );
}
