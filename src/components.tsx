/// <reference path="../typings/tsd.d.ts" />
import b =require("./bindings")
import React=require("react")
import ReactDom=require("react-dom")
import ReactDomServer=require("react-dom/server")
import mu=require("material-ui");
import DOMElement = __React.DOMElement;

interface IAttachable extends React.Component<any,any>{


}

interface TextFieldProps extends b.IBindable<string> {

    caption?:string
}

export class TextField extends React.Component<TextFieldProps,void>{

    controller:b.BindingController=new b.BindingController(this);

    refresh(){
      this.forceUpdate();
    }

    render(){
        return <mu.TextField id='k' floatingLabelText={this.props.caption} value={this.controller.getValue()} onChange={e=>this.controller.newValue(getEventValue(e))}/>;
    }
}
class MyComponent extends React.Component<void,void>{
    render(){
        return <div><a></a></div>
    }
}
export class View<P,S> extends React.Component<P,S>{

    componentDidMount(){
        b.attach(this);
    }
    componentWillUnmount(){
        b.dettach(this);
    }
    refresh(){
        this.forceUpdate();
    }

}
export class CheckBox extends React.Component<b.IBindable<boolean>,void>{

    controller:b.BindingController=new b.BindingController(this);

    refresh(){
        this.forceUpdate();
    }

    render(){
        return <mu.Checkbox id='k' label={this.props.caption} checked={this.controller.getValue()} onCheck={e=>this.controller.newValue(getEventValue(e))}/>;
    }
}


function getEventValue(e:React.FormEvent){
    var v:any=e;
    var q=v.nativeEvent.srcElement;
    if (q.type==="checkbox"){
        return q.checked;
    }
    return q.value;
}
