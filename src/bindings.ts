
export interface IBindable<T>{
    object?: any
    path?: any
    bindTo?:T
    caption?: string

}

interface BindableControl{
    refresh():void;
    displayError?(e:string):void;
    props:IBindable<any>
}

var globalTops:{ refresh():void }[]=[];

export function attach(c:{refresh():void}){
    globalTops.push(c);
}

export function dettach(c:{refresh():void}){
    globalTops=globalTops.filter(x=>x!==c);
}

export class BindingController{

    constructor(private v:BindableControl){}

    getValue(){
        return this.v.props.object[this.v.props.path];
    }

    newValue(v:any){
        this.v.props.object[this.v.props.path]=v;
        update();
    }
}
export function update(){
    globalTops.forEach(x=>x.refresh())
}