/// <reference path="./typings/tsd.d.ts" />
import React=require("react")
import ReactDom=require("react-dom")
import ReactDomServer=require("react-dom/server")
import mu=require("material-ui");
import c=require("./src/components")
import b=require("./src/bindings")

var watch=require("watchjs")

interface IPerson{
    name: string
    lastName: string
    title?: string
    married?: boolean
}


class PersonView extends c.View<{ p:IPerson},void>{

    personUI(p:IPerson){
    return <mu.Card style={{margin: "1em"}} >
        <mu.CardHeader style={{backgroundColor: "lightgray"}}
                       title={p.name+" "+p.lastName}
                       subtitle={p.title} />
        <c.TextField caption="First Name" bindTo={p.name}/>
        <c.TextField caption="Last Name"  bindTo={p.lastName}/>
        <c.TextField caption="Title" bindTo={p.title}/>
        <c.CheckBox caption="Married" bindTo={p.married}/>
        <c.CheckBox caption="Married" bindTo={p.married}/>
        <c.TextField caption="First Name" bindTo={p.name}/>
    </mu.Card>
    }
    render(){
        return this.personUI(this.props.p);
    }
}
function closeDialog(){
    ReactDom.unmountComponentAtNode(document.getElementById('dialog-container'))
}
function showDialog(p:IPerson){
    var m=<mu.Dialog open={true} actions={[<mu.RaisedButton label="Hello2" onMouseDown={x=>closeDialog()}/>]}><PersonView p={p}/></mu.Dialog>;
    ReactDom.render(m,document.getElementById("dialog-container"));
}

//hello
function render(){
    var obj={
        name: "Pavel",
        lastName: "Petrochenko"
    }
    return <div><PersonView p={obj}/><mu.RaisedButton label="Reinit" onMouseDown={x=>{obj.name="A";b.update();showDialog(obj)}}/></div>
}
ReactDom.render(render(),document.getElementById("content"));