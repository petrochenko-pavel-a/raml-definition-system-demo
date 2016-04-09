/// <reference path="../../typings/tsd.d.ts" />
import React=require("react")

export function genericStaticSetup(body:React.ReactElement<any>):React.ReactElement<any>{
    var layout=<html lang="en">
    <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
        <link rel="stylesheet" href="https://code.getmdl.io/1.1.3/material.indigo-pink.min.css"></link>
        <script defer src="https://code.getmdl.io/1.1.3/material.min.js"></script>
        <meta charSet="UTF-8"></meta>
    </head>
    {body}
    </html>
    return layout;
}
