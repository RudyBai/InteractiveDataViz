import React, {useEffect, useState} from "react";
import {scaleWords} from "./WordCloudUtils";
import * as d3 from 'd3';
import Slider from "@material-ui/core/Slider";
import cloud from "d3-cloud";
import classes from "./WordCloud.module.css";

export interface Word {
    text: string,
    value: number
}

export interface WordCount {
    text: string,
    value: number,
    count: string
}

const marks = [
    {
        value: 1980,
        label: '1980',
    },
    {
        value: 1983,
        label: '1983',
    },
    {
        value: 1985,
        label: '1985',
    },
    {
        value: 1986,
        label: '1986',
    },
    {
        value: 1987,
        label: '1987',
    },
    {
        value: 1988,
        label: '1988',
    },
    {
        value: 1989,
        label: '1989',
    },
    {
        value: 1990,
        label: '1990',
    },
    {
        value: 1991,
        label: '1991',
    },
    {
        value: 1992,
        label: '1992',
    },
    {
        value: 1993,
        label: '1993',
    },
    {
        value: 1994,
        label: '1994',
    },
    {
        value: 1995,
        label: '1995',
    },
    {
        value: 1996,
        label: '1996',
    },
    {
        value: 1997,
        label: '1997',
    },
    {
        value: 1998,
        label: '1998',
    },
    {
        value: 1999,
        label: '1999',
    },
    {
        value: 2000,
        label: '2000',
    },
    {
        value: 2001,
        label: '2001',
    },
    {
        value: 2002,
        label: '2002',
    },
    {
        value: 2003,
        label: '2003',
    },
    {
        value: 2004,
        label: '2004',
    },
    {
        value: 2005,
        label: '2005',
    },
    {
        value: 2006,
        label: '2006',
    },
    {
        value: 2007,
        label: '2007',
    },
    {
        value: 2008,
        label: '2008',
    },
    {
        value: 2009,
        label: '2009',
    },
    {
        value: 2010,
        label: '2010',
    },
    {
        value: 2011,
        label: '2011',
    },
    {
        value: 2012,
        label: '2012',
    },
    {
        value: 2013,
        label: '2013',
    },
    {
        value: 2014,
        label: '2014',
    },
    {
        value: 2015,
        label: '2015',
    },
    {
        value: 2016,
        label: '2016',
    },
    {
        value: 2017,
        label: '2017',
    },
    {
        value: 2018,
        label: '2018',
    }
];

export default function WordCloud() {

    const [year, setYear] = useState<number>(1980);
    const [word, setWord] = useState<WordCount>({
        text: "",
        value: 0,
        count: "0 / 0"
    });

    useEffect(() => {
        if (process.env.NODE_ENV === "development") console.log("Fetching data.");
        for (let i = 0; i < marks.length; i++) {
            fetch("data/" + marks[i].value + "_metric.json", {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then((response) => {
                return response.json();
            }).then((metrics) => {

                const drawWordCloud = (data: WordCount[], targetDiv: string, id: string) => {
                    const width = window.innerWidth - 20;
                    const height = window.innerHeight - 56;

                    const fill = d3.scaleOrdinal(d3.schemeCategory10);

                    const xScale = d3.scaleLinear().domain([0, d3.max(data, function (d: any) {
                        return d.value;
                    })]).range([10, 150]);

                    cloud()
                        .size([width, height])
                        .timeInterval(20)
                        .words(data)
                        .fontSize((d: any) => xScale(+d.value))
                        .text((d: any) => d.text)
                        .rotate(() => -45 + ~~(+Math.random() * 2) * 90)
                        .font("Impact")
                        .on("end", draw)
                        .start();

                    function draw(words: any) {
                        d3
                            .select(targetDiv)
                            .append("svg")
                            .attr("id", id)
                            .style("display", id === "" + year ? "block" : "none")
                            .attr("width", width)
                            .attr("height", height)
                            .append("g")
                            .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
                            .selectAll("text")
                            .data(words)
                            .enter()
                            .append("text")
                            .attr("font-size", (d: any) => xScale(d.value) + "px")
                            .style("font-family", "Impact")

                            .on("mouseover", function (d) {
                                setWord({
                                    text: d.text,
                                    value: d.value,
                                    count: d.count
                                } as WordCount);
                                // @ts-ignore
                                this.attributes["font-size"].value = parseFloat(this.attributes["font-size"].value.replace("px", "")) * 1.6 + "px";
                                d3.select(this).raise();
                            })

                            .on("mouseout", function () {
                                // @ts-ignore
                                this.attributes["font-size"].value = parseFloat(this.attributes["font-size"].value.replace("px", "")) * 0.625 + "px";
                                d3.select(this).lower();
                            })

                            .attr("fill", (d: any, i: any) => fill(i))
                            .attr("text-anchor", "middle")
                            .attr("transform", (d: any) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")

                            .text((d: any) => {
                                return d.text;
                            });

                        if (process.env.NODE_ENV === "development") console.log(id + " loaded.");
                        if (year + "" === id) {
                            const loading = document.getElementById("loading");
                            if (loading) loading.style.display = "none";
                        }
                    }

                    cloud().stop();
                }

                drawWordCloud(scaleWords(metrics, 10, 200), "#chart", "" + marks[i].value);

            });
        }
    }, []);

    useEffect(() => {
        const svg = document.getElementById("" + year);
        if (svg !== null) {
            svg.style.display = "block";
            if (process.env.NODE_ENV === "development") console.log(year + ": " + svg.style.display);
        }
    }, [year]);


    const handleYearChange = (event: any, newValue: number | number[]) => {
        if (newValue as number !== year) {
            const svg = document.getElementById("" + year);
            if (svg !== null) {
                svg.style.display = "none";
                console.log(year + ": " + svg.style.display);
            }
            setYear(newValue as number);
        }
    };

    return <div>
        <div id={"chart"} className={classes.Cloud}>
            <p id={"loading"}>Loading...</p>
        </div>
        <div className={classes.Wrapper}>
            <div id={"slider"} className={classes.Slider}>
                <Slider
                    defaultValue={1980}
                    getAriaValueText={(value) => {
                        return `${value}`;
                    }}
                    aria-labelledby="discrete-slider-custom"
                    step={null}
                    valueLabelDisplay="auto"
                    marks={marks}
                    min={1980}
                    max={2018}
                    onChangeCommitted={handleYearChange}
                />
            </div>
            <div className={classes.Details}>
                <p>Word: {word.text}</p>
                <p>Value: {(word.value as number).toFixed(2)}</p>
                <p>Count: {word.count}</p>
            </div>
        </div>
    </div>
}
