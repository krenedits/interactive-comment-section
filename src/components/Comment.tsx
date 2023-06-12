import { Grid, Paper, useMediaQuery } from '@mui/material';
import { animated, useTransition } from '@react-spring/web';
import { useContext, useState, useRef, useEffect } from 'react';
import ActionButton from './ActionButton';
import { CommentType, DataContext, UserContext } from './CommentSection';
import Content from './Content';
import Counter from './Counter';
import Editor from './Editor';
import Header from './Header';

export default function Comment(comment: CommentType) {
    const { content, replyingTo, parentId, id } = comment;
    const matches = useMediaQuery('(min-width:600px)');
    const [editorState, setEditorState] = useState<{
        parentId?: number;
        replyingTo?: string;
    }>();
    const [_, setData] = useContext(DataContext);
    const user = useContext(UserContext);
    const editorRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleReplyClick = () => {
        setEditorState((prev) => ({
            ...prev,
            parentId: parentId ?? id,
            replyingTo: parentId ? comment.user.username : undefined,
        }));
    };

    useEffect(() => {
        if (editorState?.parentId && editorRef.current) {
            editorRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [editorState]);

    const handleReply = (reply: string) => {
        setData((prev) =>
            prev.map((item) => {
                if (item.id === editorState?.parentId) {
                    return {
                        ...item,
                        replies: [
                            ...(item.replies ?? []),
                            {
                                id: Date.now(),
                                content: reply,
                                createdAt: 'right now',
                                score: 0,
                                user,
                                replyingTo: comment.user.username,
                            },
                        ],
                    };
                }
                return item;
            })
        );

        setEditorState((prev) => ({
            ...prev,
            parentId: undefined,
            replyingTo: undefined,
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const HeaderSlot = (
        <Header createdAt={comment.createdAt} user={comment.user} />
    );
    const CounterSlot = <Counter parentId={parentId} id={comment.id} />;
    const ActionButtonSlot = isEditing ? null : (
        <ActionButton
            handleEditClick={handleEditClick}
            handleReplyClick={handleReplyClick}
            comment={comment}
        />
    );
    const ContentSlot = (
        <Content
            isEditing={isEditing}
            replyingTo={replyingTo}
            content={content}
            id={id}
            parentId={parentId}
            setIsEditing={setIsEditing}
        />
    );

    const DesktopView = (
        <Grid container spacing={2} justifyContent='space-between'>
            <Grid item xs={1}>
                {CounterSlot}
            </Grid>
            <Grid item container xs={11} spacing={1}>
                <Grid item xs={12} container justifyContent='space-between'>
                    {HeaderSlot}
                    {ActionButtonSlot}
                </Grid>
                {ContentSlot}
            </Grid>
        </Grid>
    );

    const MobileView = (
        <Grid container spacing={2} justifyContent='space-between'>
            <Grid item xs={12}>
                {HeaderSlot}
            </Grid>
            {ContentSlot}
            <Grid item container xs={12} justifyContent='space-between'>
                {CounterSlot}
                {ActionButtonSlot}
            </Grid>
        </Grid>
    );

    const replies = comment.replies || [];

    const transitions = useTransition(replies, {
        key: (item: CommentType) => item.id,
        from: { opacity: 0 },
        leave: { opacity: 0 },
        enter: () => ({ opacity: 1 }),
    });

    return (
        <>
            <Grid item xs={12}>
                <Paper
                    sx={{
                        padding: '1rem',
                        width: '100%',
                    }}
                >
                    {matches ? DesktopView : MobileView}
                </Paper>
            </Grid>
            {replies.length > 0 && (
                <Grid item container xs={12} style={{ marginTop: '1rem' }}>
                    {transitions((style, reply, _, index) => (
                        <Grid item xs={12} key={reply.id}>
                            <animated.div
                                style={{
                                    zIndex: replies.length - index,
                                    ...style,
                                    paddingLeft: matches ? '1rem' : 0,
                                }}
                            >
                                <div
                                    style={{
                                        borderLeft: '1px solid hsl(0, 0%, 75%)',
                                        padding: 0,
                                        paddingLeft: '1rem',
                                        paddingTop: index > 0 ? '1rem' : 0,
                                    }}
                                >
                                    <Comment parentId={id} {...reply} />
                                </div>
                            </animated.div>
                        </Grid>
                    ))}
                    {editorState?.parentId && !editorState.replyingTo && (
                        <Grid
                            item
                            xs={12}
                            ref={editorRef}
                            style={{
                                paddingLeft: matches ? '1rem' : 0,
                            }}
                        >
                            <div
                                style={{
                                    borderLeft: '1px solid hsl(0, 0%, 75%)',
                                    padding: 0,
                                    paddingLeft: '1rem',
                                    paddingTop: '1rem',
                                }}
                            >
                                <Editor
                                    handleReply={handleReply}
                                    replyingTo={comment.user.username}
                                />
                            </div>
                        </Grid>
                    )}
                </Grid>
            )}
            {editorState?.parentId && editorState.replyingTo && (
                <Grid item xs={12}>
                    <Editor
                        handleReply={handleReply}
                        replyingTo={comment.user.username}
                    />
                </Grid>
            )}
        </>
    );
}
