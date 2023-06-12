import { ThemeProvider } from '@mui/material';
import './App.css';
import CommentSection from './components/CommentSection';
import theme from './styles/theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CommentSection />
        </ThemeProvider>
    );
}

export default App;
