import React from 'react';
import classes from './App.module.css';
import WordCloud from "./Components/WordCloud/WordCloud";

export default function App() {
    return <div className={classes.App}>
        <WordCloud/>
    </div>;
}
