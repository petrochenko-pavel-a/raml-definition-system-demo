import esprima=require("esprima")
var estraverse=require("estraverse")
import fs=require("fs")
import path=require("path")
import Identifier = ESTree.Identifier;
var escodegen:any=require("escodegen")

var node=esprima.parse(fs.readFileSync("test.js").toString());

function createLiteral(n:string):ESTree.Literal{
   return {type: "Literal", value: n};
}
function createProperty(n:string,v:ESTree.Expression){
    return {
        key: createLiteral(n),
        value: v,
        type: "Property",
        kind: "init",
        method: false,
        shorthand: false,
        computed: false
    }
}
estraverse.traverse(node,{

    enter(x:ESTree.Node){
        if (x.type=="CallExpression"){
            var call:ESTree.CallExpression=<ESTree.CallExpression>x;
            if (call.callee.type=="Identifier"||call.callee.type=="MemberExpression"){
                var c=call.callee;
                if (c.type=="MemberExpression"){
                    var me=<ESTree.MemberExpression>c;
                    c=me.property;
                }
                if (c.type=="Identifier") {
                    var id:ESTree.Identifier = <ESTree.Identifier>c;
                    if (id.name == "createElement") {
                        if (call.arguments.length > 1) {
                            var obj = call.arguments[1];

                            if (obj.type == "ObjectExpression") {
                                var object:ESTree.ObjectExpression = <ESTree.ObjectExpression>obj;

                                if (object.properties) {
                                    object.properties.forEach(x=>{
                                        if (x.key.type=="Identifier"){
                                            var lv=(<ESTree.Identifier>x.key).name;
                                            if (lv=="bindTo"){
                                                if (x.value.type=="MemberExpression"){
                                                    var me=<ESTree.MemberExpression>x.value;
                                                    if (me.property.type==="Identifier"){
                                                        var kv:ESTree.Literal = {type: "Literal", value: "bindToPath"};
                                                        object.properties.push(createProperty("object",me.object));
                                                        object.properties.push(createProperty("path",createLiteral((<ESTree.Identifier>me.property).name)))

                                                    }
                                                }
                                                
                                            }
                                        }
                                    })

                                }
                            }
                        }
                    }
                }
            }
            return true;
        }
    }
    ,
    leave(x:ESTree.Node){

    }
})
fs.writeFileSync("testOut.js",escodegen.generate(node));