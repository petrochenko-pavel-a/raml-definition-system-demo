/// <reference path="./typings/tsd.d.ts" />
import React=require("react")
import ReactDom=require("react-dom")

import ReactDomServer=require("react-dom/server")
import mu=require("material-ui");
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import ActionInfo from 'material-ui/lib/svg-icons/action/info';
import ContentInbox from 'material-ui/lib/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/lib/svg-icons/content/drafts';
import ContentSend from 'material-ui/lib/svg-icons/content/send';
import List =mu.List
import Paper=mu.Paper;
import Table=mu.Table;
import TableRow=mu.TableRow;
import TableRowColumn=mu.TableRowColumn;
import TableHeader=mu.TableHeader;
import TableHeaderColumn=mu.TableHeaderColumn;
import TableBody=mu.TableBody;
import Card=mu.Card;
import CardHeader=mu.CardHeader;
import CardText=mu.CardText;

import ListItem=mu.ListItem;
import rd=require("raml-definition-system")
var injectTapEventPlugin =require('react-tap-event-plugin');
injectTapEventPlugin();

var universe=rd.getUniverse("RAML10");

interface EventHandler{
    (x:any):void
}


class TypeItem extends React.Component<{t:rd.IType,selected:boolean,onTouch?:any},void>{


    componentDidUpdate() {
        if (this.props.selected) {
            var node:any = ReactDom.findDOMNode(this);

            var centerIfNeeded =true;

            var parent = node.parentNode.parentNode,
                parentComputedStyle = window.getComputedStyle(parent, null),
                parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
                parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
                overTop = node.offsetTop - parent.offsetTop < parent.scrollTop,
                overBottom = (node.offsetTop - parent.offsetTop + node.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
                overLeft = node.offsetLeft - parent.offsetLeft < parent.scrollLeft,
                overRight = (node.offsetLeft - parent.offsetLeft + node.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
                alignWithTop = overTop && !overBottom;

            if ((overTop || overBottom) && centerIfNeeded) {
                parent.scrollTop = node.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + node.clientHeight / 2;
            }

            if ((overLeft || overRight) && centerIfNeeded) {
                parent.scrollLeft = node.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + node.clientWidth / 2;
            }

            if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
                var an:any=node;
                an.scrollIntoView(alignWithTop);
            }
        }
    }

    render(){
        if (this.props.selected){
            return <ListItem style={{backgroundColor:"lightgray"}} onTouchTap={this.props.onTouch} primaryText={this.props.t.nameId()} secondaryText={this.props.t.description()} key={this.props.t.nameId()} leftIcon={<ActionGrade/>}/>
        }
        return <ListItem primaryText={this.props.t.nameId()} onTouchTap={this.props.onTouch} secondaryText={this.props.t.description()} key={this.props.t.nameId()} leftIcon={<ActionGrade/>}/>
    }
}

function typeItem(t:rd.IType,selected:boolean){
    return <TypeItem t={t} selected={selected} />
}
class SimpleList extends React.Component<{bindTo:any[],selected:any, labelProvider:(x:any,s:boolean)=>React.ReactElement<any>,onClick:(x:any)=>void},void>{


    render(){
        var obj=this.props;
        return <List>
            {
                obj.bindTo.map(y=>{
                    var res=  obj.labelProvider(y,y===this.props.selected)
                    res=React.cloneElement(res,{onTouch:(x:any)=>obj.onClick(y)})
                    return res;
                })
            }
        </List>;
    }
}
class GroupedListSection extends React.Component<{bindTo:Group,selected:any, labelProvider:(x:any,s:boolean)=>React.ReactElement<any>,onClick:(x:any)=>void},void>{


    render(){
        var obj=this.props;
        var result=obj.bindTo.items.map(y=>{
            var res=  obj.labelProvider(y,y===this.props.selected)
            res=React.cloneElement(res,{onTouch:(x:any)=>obj.onClick(y)})
            return res;
        });
        console.log(result);

        return <ListItem primaryText={this.props.bindTo.title} initiallyOpen={this.props.bindTo.title=="Essentials"}
                         primaryTogglesNestedList={true} nestedItems={result}>
        </ListItem>;
    }
}
interface Group{
    title: string
    items:any[];
}

function buildGroups(items:any[],f:(o:any)=>string):Group[]{
    var holder:{ [title:string]:Group}={};
    holder["Essentials"]={ title:"Essentials",items:[]};
    holder["Modularization & Reusability"]={ title:"Modularization & Reusability",items:[]};
    holder["Security"]={ title:"Security",items:[]};
    items.forEach(x=>{
        var groupTitle=f(x);
        if (holder[groupTitle]){
            holder[groupTitle].items.push(x);
        }
        else{
            holder[groupTitle]={
                title: groupTitle,
                items:[x]
            }
        }
    })
    return Object.keys(holder).map(x=>holder[x])
}

class GroupedList extends React.Component<{bindTo:any[],selected:any, labelProvider:(x:any,s:boolean)=>React.ReactElement<any>,onClick:(x:any)=>void,groupFunction:(o:any)=>string},void>{


    render(){
        var obj=this.props;
        return <List>
            {buildGroups(this.props.bindTo,this.props.groupFunction).map(g=><GroupedListSection bindTo={g} selected={this.props.selected} labelProvider={this.props.labelProvider} onClick={this.props.onClick}/>)}
        </List>;
    }
}
const Essentials=["Api","Resource","Method","Response","TypeDeclaration"]
const SuperTypes=["MethodBase","ResourceBase","HasNormalParameters","LibraryBase","RAMLLanguageElement","TypeInstance","TypeInstanceProperty","ModelLocation","LocationKind"]

const Modularization=["Trait","ResourceType","Library","Overlay","Extension"]
function simpleGroupFunction(t:rd.ITypeDefinition):string{

    if (Essentials.indexOf(t.nameId())!=-1){
        return "Essentials"
    }
    if (t.isAssignableFrom("TypeDeclaration")){
        return "Particular type kinds";
    }
    if (SuperTypes.indexOf(t.nameId())!=-1){
        return "Abstract & System Types"
    }
    if (Modularization.indexOf(t.nameId())!=-1){
        return "Modularization & Reusability"
    }
    if (t.isValueType()){
        return "Value Types";
    }
    if (t.nameId().indexOf("Security")!=-1){
        return "Security";
    }
    return "Utility";
}


function TypeView(obj:{type:rd.IType,handler:EventHandler}){
    if (!obj.type){
        return <div/>
    }
    return <div style={{marginLeft:"1em"}}>
        <h1>{obj.type.nameId()}</h1>
        <div>{obj.type.description()}</div>
        <TypeSuperTypes type={obj.type.superTypes()} handler={obj.handler} title="Super Types"/>
        <TypeSuperTypes type={obj.type.subTypes()} handler={obj.handler} title="Sub Types"/>
        <PropertiesTable props={obj.type.properties()} handler={obj.handler} title="Declared Properties"/>
        <PropertiesTable props={obj.type.allProperties().filter(x=>x.domain()!=obj.type)} handler={obj.handler} title="Inherited Properties"/>
    </div>
}
function TypeSuperTypes(obj:{type:rd.IType[],handler:EventHandler,title:string}){
    var c=obj.type;
    if (c.length>0){
        return <div>{obj.title}: {c.map(x=><mu.FlatButton primary={true} onTouchTap={e=>obj.handler(x)} label={x.nameId()}/>)}</div>
    }

    return <div/>
}

function rangeLabel(p:rd.IProperty):string{

    var vl=p.range().nameId();
    if (p.range().nameId()==="StringType"){
        vl= "string";
    }
    if (p.range().nameId()==="BooleanType"){
        vl= "boolean";
    }
    if (p.range().nameId()==="NumberType"){
        vl= "number";
    }
    if (p.isMultiValue()){
        if (p.range().getAdapter(rd.RAMLService).getKeyProp()){
            if (!p.getAdapter(rd.RAMLPropertyService).isMerged()) {
                return "[]:" + vl;
            }
            return vl;
        }
        return vl+'[]'
    }
    return vl;
}

function renderPropName(p:rd.IProperty):string{
    if (p.isMultiValue()){
        if (p.range().getAdapter(rd.RAMLService).getKeyProp()){
            if (!p.getAdapter(rd.RAMLPropertyService).isMerged()) {
                return p.nameId();
            }
            return "["+p.nameId()+"]";
        }
        return p.nameId();
    }
    return p.nameId();
}

function PropertiesTable(obj:{props:rd.IProperty[],handler:EventHandler, title: string}) {
    if (obj.props.length==0){
        return <div/>
    }
    return <Card expandable={true} initiallyExpanded={true}>
        <CardHeader title={obj.title} showExpandableButton={true} actAsExpander={true}/>
        <CardText expandable={true}>
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>
                            <b>Property</b>
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            <b>Type</b>
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            <b>Owner</b>
                        </TableHeaderColumn>
                        <TableHeaderColumn colSpan={2}>
                            <b>Description</b>
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {obj.props.map(x=><TableRow selectable={false} >
                        <TableRowColumn  ><b>{renderPropName(x)}</b></TableRowColumn>
                        <TableRowColumn><a style={{color: "blue", cursor:"pointer", textDecoration:"underline"}} onClick={e=>obj.handler(x.range())}>{rangeLabel(x)}</a></TableRowColumn>
                        <TableRowColumn ><a style={{color: "blue", cursor:"pointer", textDecoration:"underline"}} onClick={e=>obj.handler(x.range())}>{x.domain().nameId()}</a></TableRowColumn>
                        <TableRowColumn colSpan={3}><div style={{ wordWrap:"normal",whiteSpace: "normal"}}>{x.description()}</div></TableRowColumn>
                    </TableRow>)}
                </TableBody>
            </Table>
        </CardText>
    </Card>
}

class App extends React.Component<void,void>{

    s:any=universe.type("Api")
    onClick(x:any){
        this.s=x;
        this.forceUpdate();
    }

    render(){
        return <div><mu.AppBar title="RAML Definition System"/><div className="row">
            <Paper className="col sidebar"  style={{ height:"100%", overflow: "scroll"}}>
                <GroupedList selected={this.s} bindTo={universe.types()} labelProvider={typeItem} onClick={x=>this.onClick(x)} groupFunction={simpleGroupFunction}/></Paper>
            <div className="col content" style={{ height: "100%", overflow: "scroll"}} ><TypeView type={this.s} handler={(z:rd.IType)=>this.onClick(z)}/></div>
        </div></div>
    }
}

function dom(){
    return <App/>;
}

ReactDom.render(dom(),document.getElementById("content"));