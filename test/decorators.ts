class A {
    public props:any = {};
    constructor(props){
        this.init(props);
        this.show();
    }
    init(props) {
        console.log('init', props);
        Object.assign(this.props, props);
    }
    show(){
        console.log(this.props);
    }
}

// 类装饰器
@addAttr({b:2})
class AA extends A {
    constructor(props){
        super(props);
    }
    showA(){
        console.log('a', this.props.a);
    }
    showB(){
        console.log('b', this.props.b);
    }
}

function addAttr(baseProps): Function{
    return function (target) { // 
        return class extends target{
            constructor(props){
                Object.assign(props, baseProps)
                super(props);
            }
        }
    };
}

console.log('111')
let a = new AA({a:1})
a.showA()
a.showB()
console.log(a instanceof AA)