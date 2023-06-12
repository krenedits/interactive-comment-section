import { ButtonProps } from '@mui/material';
import IconButton from './IconButton';
import ReplyIcon from '/images/icon-reply.svg';

export default function ReplyButton(props: ButtonProps) {
    return (
        <IconButton size='small' icon={ReplyIcon} {...props}>
            Reply
        </IconButton>
    );
}
