/// <reference path="../../typings/tsd.d.ts" />
import React=require("react")
import rd=require("raml-definition-system")

export interface Func<T>{
    (arg:T):void
}
export interface IListProperties{

    dataSource: any[]
    onSelectItem?: Func<any>

}
export interface IBindableProperties{

    bindTo?: any;
    caption?: string;
    disablement?: boolean
    visibility?: boolean
    selection?: any;
}

namespace q {


    export abstract class BindableComponent extends React.Component<IBindableProperties,void>{

        constructor(){
            super()
            var ms=new Error().stack;
            console.log(ms);
        }
        render(){

            return <div>{this.props.children}</div>
        }
    }

    export class slider extends React.Component<void,void> {

        render() {
            return <div></div>
        }
    }
    export class splitpane extends BindableComponent{}
    export class textfield extends BindableComponent{}
    export class checkbox  extends BindableComponent{}
    export class textarea  extends BindableComponent{}
    export class password  extends BindableComponent{}
    export class select  extends BindableComponent{}
    export class list  extends BindableComponent{}
    export class hc  extends BindableComponent{}
    export class vc  extends BindableComponent{}

}
function enumerable(isEnumerable: boolean) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        descriptor.enumerable = isEnumerable;
        return descriptor;
    };
}


interface User{
    firstName?: string
    lastName?: string,
    email?: string,
    city?: string
    payedUser?: boolean
    wantsPizza?: boolean
}

class UserImpl implements User{

    d: string
}

function UserProfileView(bindTo:{user:User}){
    var u:User=bindTo.user;
    //what we need is to replace instance with a stub!!! And this will work forever!
    //problem it is not clear how to do it in general case
    return <q.vc>
        <q.hc><q.textfield caption="First Name" bindTo={u.firstName}/><q.textfield caption="Last Name" bindTo={u.lastName}/></q.hc>
        <q.hc><q.textfield caption="Email" bindTo={u.email}/><q.textfield caption="City" bindTo={u.city}/></q.hc>
        <q.checkbox caption="Payed" bindTo={u.payedUser}/>
        <q.checkbox caption="Want Pizza" bindTo={u.wantsPizza} disablement={!u.payedUser}/>
    </q.vc>;
}

function usersMasterDetails(users:User[]){
    var selection:User=null;
    return <q.splitpane>
        <q.list bindTo={users} selection={selection}/>
        <UserProfileView user={selection}/>
    </q.splitpane>;
}

var u=UserProfileView({user:{}});
import ReactDom=require("react-dom")
import ReactDomServer=require("react-dom/server")
var s=ReactDomServer.renderToStaticMarkup(u);
